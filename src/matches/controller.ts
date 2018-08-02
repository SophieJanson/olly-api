import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  HttpCode,
  QueryParams,
  Patch
} from "routing-controllers";
import Match from "./entity";
import WeeklyUpdateController from '../weeklyUpdates/controller'
import { algolly, getCategory, getActivity, getDepartment } from "./logic";

const WeeklyUpdates = new WeeklyUpdateController()
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
    //weeklyUpdateId: number
  ) {
    const AlgollyResult = await algolly(
      params.department,
      params.activity,
      params.category
    );

    if (!AlgollyResult || AlgollyResult === null) return "No matches available"

    let newMatch = new Match();
    newMatch.users = AlgollyResult; 
    const finalNewMatch = await newMatch.save()
    console.log("FINAL ---------", await finalNewMatch)
    if(!finalNewMatch.id) return finalNewMatch
    await WeeklyUpdates.registerUpdateMatch(finalNewMatch.id, params.weekly)
    return finalNewMatch
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