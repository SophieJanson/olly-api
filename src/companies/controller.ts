import {
  JsonController,
  Get,
  Authorized,
  Post,
  HttpCode,
  Body,
  QueryParams
} from "routing-controllers";
import Company from "./entity";
import * as request from 'superagent'

@JsonController()
export default class CompanyController {
  @Authorized()
  @Get("/companies")
  getCompany() {
    return Company.find();
  }

  @Post("/companies")
  @HttpCode(201)
  async createCompany(
    @Body() body: any
  ) {
    const newCompany = new Company()
    const apiKey = await newCompany.setApiKey()
    newCompany.name = body.name
    await newCompany.save()
    return apiKey
  }

  @Get("/auth")
  async createAuth(
    @QueryParams() params : any
  ) {
    console.log("PAAAAARAMS", params)
    const credentials = await request
      .get(`https://slack.com/api/oauth.access?code=${params.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`)
      .then(res => res.body)
      .catch(err => console.error(err))
    console.log(await credentials)

    const newCompany = new Company()
    const apiKey = await newCompany.setApiKey()
    newCompany.name = credentials.team_name
    newCompany.teamId = credentials.team_id
    newCompany.teamAccessToken = credentials.access_token
    newCompany.botAccessToken = credentials.bot.bot_access_token
    newCompany.botUserId = credentials.bot.bot_user_id
    return newCompany.save()
  }
}
