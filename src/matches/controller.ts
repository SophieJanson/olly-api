import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  HttpCode,
  QueryParams
} from "routing-controllers";
import Match from "./entity";
import WeeklyUpdateController from "../weeklyUpdates/controller";
import { algolly, getCategory, getActivity, getDepartment } from "./logic";

const WeeklyUpdates = new WeeklyUpdateController();
@JsonController()
export default class MatchController {
  @Authorized()
  @Get("/matches/:matchId")
  getMatch(@Param("matchId") matchId: number) {
    return Match.findOne(matchId);
  }

  @Post("/matches")
  @HttpCode(201)
  async createMatch(params: any) {
    console.log(params, "paramsss");
    const AlgollyResult = await algolly(
      params.department,
      params.activityId,
      params.category
    );

    if (!AlgollyResult || AlgollyResult === null) return "No matches available";

    let newMatch = new Match();
    newMatch.users = AlgollyResult;
    const finalNewMatch = await newMatch.save();

    if (!finalNewMatch.id) return finalNewMatch;
    await WeeklyUpdates.registerUpdateMatch(finalNewMatch.id, params.id);
    return finalNewMatch;
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
    return await getActivity(1);
  }

  @Get("/logic/departments")
  @HttpCode(200)
  async getDepartmentNow() {
    return await getDepartment("development");
  }

  @Get("/logic/algolly")
  @HttpCode(200)
  async getalgollyNow() {
    return await algolly("develssment", 1, "socialize");
  }
}
