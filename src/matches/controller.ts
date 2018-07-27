import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  CurrentUser,
  HttpCode,
  Body,
  NotFoundError,
  BadRequestError
} from "routing-controllers";
import Match from "./entity";
import User from "../users/entity";
import { getConnection } from "../../node_modules/typeorm";
//import User from "../users/entity";
//import { ConnectionManager } from "../../node_modules/typeorm";

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
  async createMatch(
    @Body() match: Match) {
      if(!match.users) throw new BadRequestError("No users specified")
      if(!match.activities) throw new BadRequestError("No activity specified")
      if(!match.categories) throw new BadRequestError("No category specified")
      if(!match.status) throw new BadRequestError("No status specified")
    // const usertwo = await User.findOne(2)
    // if(!usertwo) throw NotFoundError
    // const newMatch = new Match()
    // newMatch.activities = ["swimming"]
    // newMatch.categories = ["learn"]
    // newMatch.status = "pending"
    // newMatch.users = [user, usertwo]

    return match.save();
  }
}
