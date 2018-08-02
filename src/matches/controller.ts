import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  HttpCode,
  QueryParams,
  BadRequestError,
  NotFoundError
} from "routing-controllers";
import Match from "./entity";
import { algolly, getCategory, getActivity, getDepartment } from "./logic";

@JsonController()
export default class MatchController {
  @Authorized()
  @Get("/matches/:matchId")
  getMatch(@Param("matchId") matchId: number) {
    return Match.findOne(matchId);
  }

  @Post("/matches")
  @HttpCode(201)
  async createMatch(
    @QueryParams() params: any,
  ) {
    const AlgollyResult = await algolly(
      params.department,
      params.activity,
      params.category
    );
    if (!AlgollyResult || AlgollyResult === null) return "No matches available"

    let newMatch = new Match();

    if (!newMatch || newMatch === null) {
      throw new BadRequestError("newMatch is a number!");
    }
    newMatch.users = AlgollyResult; //cant seem to fix this typeError
    return newMatch.save();
  }

  @Get("/logic/categories")
  @HttpCode(200)
  async getCategoryNow() {
    console.log("socialize");
    return await getCategory("socialize");
  } 

  @Get("/logic/activities")
  @HttpCode(200)
  async getActivityNow() {
    return await getActivity("tennis");
  }

  @Get("/logic/departments")
  @HttpCode(200)
  async getDepartmentNow() {
    return await getDepartment("development");
  }

  @Get("/logic/algolly")
  @HttpCode(200)
  async getalgollyNow() {
    return await algolly("develssment", "tnis", "socialize");
  }
}