import {
  JsonController,
  Post,
  Body,
  HttpCode,
  BadRequestError,
  NotFoundError
} from "routing-controllers";
import * as request from 'superagent'
import UserController from '../users/controller'
import User from '../users/entity'
import Company from "../companies/entity";

const Users = new UserController()

@JsonController()
export default class SlackbotController {
  @Post("/")
  async getPost(
    @HttpCode(200)
    @Body() body: any
  ) {
    console.log("HEEEEELLO", body)
    if(body.event.subtype === 'bot_message') return "no bots allowed"
    if(!body.event) throw new BadRequestError

    const { user, channel } = body.event
    const teamId = body.team_id
    const userEntity = await User.find({slackId: user})
    console.log(userEntity)
    const companyToken = await Company.findOne({"teamId": teamId})
    if(! companyToken) throw new NotFoundError
    console.log("BODY EVENT", body.event)
    return request
      .post('https://slack.com/api/chat.postMessage')
      .set('Authorization', `Bearer ${await companyToken.botAccessToken}`)
      .send({"text": `<@${user}>`, 
        "channel": `${channel}`
      })
      .then(res => console.log(res))
    return body.challenge
  }
}
