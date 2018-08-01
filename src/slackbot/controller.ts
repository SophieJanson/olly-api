import {
  Post,
  Body,
  HttpCode,
  JsonController,
} from "routing-controllers";
import * as request from 'superagent'
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
  getInfo(
    @HttpCode(200)
    @Body() body: any
  ) {
    const data = body.payload
    console.log(data)
    //if(!data.actions) return "Something went wrong. Please try again."
    const userId = JSON.parse(data).user.id
    WeeklyUpdates.newWeeklyGoals({
      user: userId
    })
    console.log("BOOOOOODY", JSON.parse(data)['actions'][0])
    return ""
  }

  @Post("/")
  async getPost(
    @HttpCode(200)
    @Body() body: any
  ) {
    if(!body.event || body.event.subtype === "bot_message") return "no event"
    const { type, user, text, channel} = body.event
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
    // return request
    //   .post('https://slack.com/api/chat.postMessage')
    //   .set('Authorization', `Bearer ${await company.botAccessToken}`)
    //   .send({"text": `${await JSON.stringify(data)}`, 
    //     "channel": `${channel}`
    //   })
    //   .then(res => res.body)
    //   .catch(err => console.error(err))  
  }
}
   
const respond = (responseText, atUser = null, fromUser, atChannel) => {

}

// export const startSocket = () => {
//   console.log("Hello!")
//   const bot = new SlackBot({
//     token: "xoxb-13649336358-407340755362-WVcEJblXeNy63YzPjG5r42xA",
//     name: "Olly"
//   })
//   console.log(bot)
//   bot.on("start", () => {        
//     bot.postMessageToChannel(
//       "test-integrations",
//       "Olly is here for you!",
//     )
//   })
// }



//     console.log("testttt")
//     if(!body.event) throw new BadRequestError
//     if(body.event.subtype === 'bot_message') return "bot"

//     const { user, text } = body.event
//     const teamId = body.team_id

//     const companyToken = await Company.findOne({"teamId": teamId})
//     if(! companyToken) return "bot"

//     switch(text.split(" ")[1]) {
//       case 'activities':
//         const activities = Activities.getActivities()

//         return request
//           .post('https://slack.com/api/chat.postMessage')
//           .set('Authorization', `Bearer ${await companyToken.botAccessToken}`)
//           .send({"text": `${await activities}`, 
//             "channel": `${body.event.channel}`
//           })
//           .then(res => console.log("RES", res))  
//       default:
//         return request
//           .post('https://slack.com/api/chat.postMessage')
//           .set('Authorization', `Bearer ${await companyToken.botAccessToken}`)
//           .send({"text": `No data found, try again`, 
//             "channel": `${body.event.channel}`
//           })
//           .then(res => console.log("RES", res)) 
//     }
//     const userEntity = await User.find({slackId: user})
//     console.log(userEntity)
//     console.log("BODY EVENT", body.event)

//     return body.challenge
//   }
// }
