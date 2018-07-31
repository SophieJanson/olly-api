import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  HttpCode,
  Body
} from "routing-controllers";
import Match from "./entity";
import User from "../users/entity";
// import { getConnection } from "../../node_modules/typeorm";
// import Activity from "../activities/entity";
// import { ConnectionManager } from "../../node_modules/typeorm";

interface MatchRequest {
  users: User[],
  activities: string[],
  categories: string[],
  status: string
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
    const newMatch = new Match()
    return Match.merge(newMatch, match).save();
  }
}
