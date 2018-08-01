import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  HttpCode,
  Body,
  QueryParam,
  QueryParams
} from "routing-controllers";
import Match from "./entity";
import User from "../users/entity";
import { algolly, getCategory, getActivity, getDepartment } from "./logic";
//import WeeklyUpdate from "../weeklyUpdates/entity";

// import { getConnection } from "../../node_modules/typeorm";
// import Activity from "../activities/entity";
// import { ConnectionManager } from "../../node_modules/typeorm";

interface MatchRequest {
  users: User[];
  activities: string[];
  categories: string[];
  status: string;
}

@JsonController()
export default class MatchController {
  @Authorized()
  @Get("/matches/:matchId")
  getMatch(@Param("matchId") matchId: number) {
    return Match.findOne(matchId);
  }

  @Authorized()
  @Post("/matches")
  @HttpCode(201)
  async createMatch(@Body() match: MatchRequest) {
    const newMatch = new Match();
    return Match.merge(newMatch, match).save();
  }

  // @Authorized()
  // @Post("/matches")
  // @HttpCode(201)
  // async createMatch(@QueryParams() params: any) {
  //   const newMatch = new Match();
  //   const AlgollyResult = await algolly(
  //     params.department,
  //     params.activity,
  //     params.category
  //   );
  //   const match = Match.create(AlgollyResult);
  //   newMatch.department = department;

  //   return Match.merge(newMatch, match).save();

  // async createMatch(@Body() match: MatchRequest) {
  //   const newMatch = new Match();
  //   return Match.merge(newMatch, match).save();
  // }

  @Get("/logic/categories")
  @HttpCode(200)
  async getCategoryNow() {
    console.log("socialize");
    return await getCategory("socialize");
  }

  @Get("/logic/activities")
  @HttpCode(200)
  async getActivityNow() {
    //  await console.log(getActivity("activities"));
    return await getActivity("tennis");
  }

  @Get("/logic/departments")
  @HttpCode(200)
  async getDepartmentNow() {
    // await console.log(getDepartment("hi department"));
    return await getDepartment("development");
  }

  @Get("/logic/algolly")
  @HttpCode(200)
  async getalgollyNow(@QueryParams() params: any) {
    return await algolly("develment", "tennis", "soclize");
  }

  // @Post("/logic/algolly")
  // @HttpCode(200)
  // async getalgollyNow(
  //   @QueryParams() params: any
  // ) {
  //   return await algolly(params.department, params.activity, params.category);
  // }
}
