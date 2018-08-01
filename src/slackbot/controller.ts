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

const Activities = new ActivityController()
const Users = new UserController()
const Matches = new MatchController()
const FollowUps = new FollowUpController()

@JsonController()
export default class SlackbotController {
  getTeam = (teamId) => {
    return Company.findOne({"teamId": teamId})
  
  }

  @Post("/")
  async getPost(
    @HttpCode(200)
    @Body() body: any
  ) {
    if(!body.event) return "no event"
    const { type, user, text, channel} = body.event
    const teamId = body.team_id
    const token = this.getTeam(teamId)
    const commands = text.split(" ")
    const mainCommand = commands[0].substring(0,2) !== "<@" ? commands[0] : commands[1]
    console.log(mainCommand, token)
    let data;
    switch(mainCommand) {
      case 'users':
        data = await Users.getAllUsers()
      case 'matches':
        data = await Matches.getMatch(1)
      case 'followups':
        data = await FollowUps.getFollowUps()
      case 'activities':
        data = await Activities.getActivities()
      default:
        data = "Request not understood, try again"
    }
    console.log(data, token)
    return request
      .post('https://slack.com/api/chat.postMessage')
      .set('Authorization', `Bearer ${await token}`)
      .send({"text": `${await data}`, 
        "channel": `${channel}`
      })
      .then(res => console.log("RES", res))
      .catch(err => console.error(err))  
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
