import {
  Post,
  Body,
  HttpCode,
  JsonController,
  BadRequestError,
  NotFoundError,
} from "routing-controllers";

import ActivityController from "../activities/controller";
import UserController from "../users/controller";
import MatchController from "../matches/controller";
import FollowUpController from "../followups/controller";
import Company from "../companies/entity";
import WeeklyUpdateController from '../weeklyUpdates/controller'
import WeeklyUpdate from "../weeklyUpdates/entity";

const Activities = new ActivityController()
const Users = new UserController()
const Matches = new MatchController()
const FollowUps = new FollowUpController()
const WeeklyUpdates = new WeeklyUpdateController()

@JsonController()
export default class SlackbotController {
  getTeam = (teamId) => {
    return Company.findOne({"teamId": teamId})
  }

  @Post('/slacktest')
  async getInfo(
    @HttpCode(200)
    @Body() body: any
  ) {
	  const data = body.payload

    if(JSON.parse(data).callback_id === "weekly_update") {
      
      const userId = JSON.parse(data).user.id
      const parsedMessage = JSON.parse(data)['actions'][0]
      try {
        if(parsedMessage['selected_options']) {
          await WeeklyUpdates.newWeeklyGoals({
            user: userId,
            [parsedMessage.name]: [parsedMessage['selected_options'][0].value]
          })
        }
      } catch(e) {
        console.error("ERROR_________", e)
      } 

      if(parsedMessage.value === "submit") {
        let matches = await this.getMatches(userId)
        if(!matches) {
          return "No matches available. Try again next week"
        } 
        return "Your match(es) is / are: " + await matches.users.map(user => `<@${user.slackId}>`)
          .join(", ")
      }
      return ""
    }
  }

  async getMatches(
    user: string
  ) {
    const update = await WeeklyUpdates.getWeeklyGoals(user)
    if(!update || !update.id) throw new NotFoundError("Weekly update could not be found")
    const {department, activityId, category} = await update
    return await Matches.createMatch({department, activityId, category, id: update.id})
  }

  @Post("/")
  async getPost(
    @HttpCode(200)
    @Body() body: any
  ) {
    return body
  }
}