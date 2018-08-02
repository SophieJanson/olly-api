import {
  Post,
  Body,
  HttpCode,
  JsonController,
} from "routing-controllers";
import ActivityController from "../activities/controller";
import UserController from "../users/controller";
import MatchController from "../matches/controller";
import FollowUpController from "../followups/controller";
import Company from "../companies/entity";
import WeeklyUpdateController from '../weeklyUpdates/controller'

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

    }
    const userId = JSON.parse(data).user.id
    try {
      await WeeklyUpdates.newWeeklyGoals({
        user: userId,
        [JSON.parse(data)['actions'][0].name]: [JSON.parse(data)['actions'][0]['selected_options'][0].value]
      })
    } catch(e) {
      console.error(e)
    } 
    return JSON.parse(data)['actions'][0].value === "submit" ? "Thank you for your input. We will be in touch!" : ""
  }

  @Post("/")
  async getPost(
    @HttpCode(200)
    @Body() body: any
  ) {
    if(!body.event || body.event.subtype === "bot_message") return "no event"
    const {text} = body.event
    const teamId = body.team_id
    const company = await this.getTeam(teamId)

    if(!company) {
      return "Company not found"
    }
    const commands = text.split(" ")
    const mainCommand = commands[0].substring(0,2) !== "<@" ? commands[0] : commands[1]
    let data;
    console.log("Command, ",mainCommand)
    switch(mainCommand) {
      case 'users':
        data = await Users.getAllUsers()
        break;
      case 'matches':
        data = await Matches.getMatch(0)
        break;
      case 'followups':
        data = await FollowUps.getFollowUps()
        break;
      case 'activities':
        data = await Activities.getActivities()
        break;
      default:
        data = "Request not understood, try again"
    }
    console.log(data)
  }
}