import {
  JsonController,
  Post,
  Body,
  BadRequestError,
  HeaderParam,
  HeaderParams,
  Req
} from "routing-controllers";
import Company from "../companies/entity";

@JsonController()
export default class LoginController {
  @Post("/logins")
  async authenticate(
    @HeaderParams() params: any,
    @Body() body: any
  ) {
    console.log("APIKEY2", params.authorization)
    console.log("BODY2", body)

    const company = await Company.findOne({ where: { name: body.name } });
    if (!company)
      throw new BadRequestError("Company not found");

    if (!(await company.checkApiKey(params.authorization))) throw new BadRequestError("TEST");

    return "Signed in"
  }
}
