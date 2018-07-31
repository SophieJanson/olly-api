import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  HttpCode,
  Body
} from "routing-controllers";
import Company from "./entity";
import { sign } from "../jwt";

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
}
