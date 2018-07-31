import {
  JsonController,
  Post,
  Body,
  HttpCode,
  BadRequestError
} from "routing-controllers";
import * as request from 'superagent'
import UserController from '../users/controller'

const ollySecret = process.env.OLLY_SECRET || "xoxp-13649336358-342889958628-407205862387-250247745f6e6b17c47d00b401822361"
const Users = new UserController()

@JsonController()
export default class SlackbotController {
  @Post("/")
  async getPost(
    @HttpCode(200)
    @Body() body: any
  ) {
    if(!body.event) throw new BadRequestError
    if(body.event.text.split(" ").includes("users")) {
      const allUsers = await Users.allUsers()
      return request
        .post('https://slack.com/api/chat.postMessage')
        .set('Authorization', `Bearer ${ollySecret}`)
        .send({"text": `${await allUsers.users.map(user => user.firstName)}`, 
          "channel": `${body.event.channel}`
        })
    }
    return body.challenge
  }
}
