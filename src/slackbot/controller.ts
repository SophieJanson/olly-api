import {
  Post,
  Body,
  HttpCode,
  JsonController,
  BadRequestError,
} from "routing-controllers";
import ActivityController from "../activities/controller";
import UserController from "../users/controller";
import MatchController from "../matches/controller";
import FollowUpController from "../followups/controller";
import Company from "../companies/entity";
import WeeklyUpdateController from '../weeklyUpdates/controller'
import WeeklyUpdate from "../weeklyUpdates/entity";
import { updateLocale } from "moment";

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
    if(!body.payload) throw new BadRequestError("You BAAAAD requester!")
    const data = body.payload
    console.log("DATA", data)
    if(JSON.parse(data).callback_id === "weekly_update") {
      
      const userId = JSON.parse(data).user.id
      let update
      try {
        console.log("DAAAATA IN TRY", userId)

        update = await WeeklyUpdates.newWeeklyGoals({
          user: userId,
          [JSON.parse(data)['actions'][0].name]: [JSON.parse(data)['actions'][0]['selected_options'][0].value]
        })
      } catch(e) {
        console.error("ERROR_________", e)
      } finally {
        this.getMatches(await update)
      }
    return JSON.parse(data)['actions'][0].value === "submit" ? "Thank you for your input. We will be in touch!" : ""
    }
  }

  // @Get('/weekly/:slackId/matches')
  async getMatches(
    update: WeeklyUpdate
  ) {
    if(!update) throw new BadRequestError("What's wrong with you?")
    const {department, activityId, category, id } = await update
    return Matches.createMatch({department, activityId, category, id})
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