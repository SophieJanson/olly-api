import {
  JsonController,
  Post,
  Body,
  HttpCode,
  BadRequestError
} from "routing-controllers";
import * as request from 'superagent'
//import UserController from '../users/controller'
import User from '../users/entity'
import Company from "../companies/entity";
import ActivityController from "../activities/controller";

const Activities = new ActivityController()
//const Users = new UserController()

@JsonController()
export default class SlackbotController {
  @Post("/")
  async getPost(
    @HttpCode(200)
    @Body() body: any
  ) {
    console.log("testttt")
    if(!body.event) throw new BadRequestError
    if(body.event.subtype === 'bot_message') return "no bots allowed"

    const { user, text } = body.event
    const teamId = body.team_id

    const companyToken = await Company.findOne({"teamId": teamId})
    if(! companyToken) return "penguin"
    console.log("EEEEEEEEVENTS!", await body.event)
    switch(text.split(" ")[1]) {
      case 'activities':
        const activities = Activities.getActivities()

        return request
          .post('https://slack.com/api/chat.postMessage')
          .set('Authorization', `Bearer ${await companyToken.botAccessToken}`)
          .send({"text": `${await activities}`, 
            "channel": `${body.event.channel}`
          })
          .then(res => console.log("RES", res))  
      default:
        return request
          .post('https://slack.com/api/chat.postMessage')
          .set('Authorization', `Bearer ${await companyToken.botAccessToken}`)
          .send({"text": `No data found, try again`, 
            "channel": `${body.event.channel}`
          })
          .then(res => console.log("RES", res)) 
    }
    const userEntity = await User.find({slackId: user})
    console.log(userEntity)
    console.log("BODY EVENT", body.event)

    return body.challenge
  }
}
