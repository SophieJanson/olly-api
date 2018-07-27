import {
  JsonController,
  Get,
  Param,
  Authorized
  // Post,
  // CurrentUser,
  // HttpCode
} from "routing-controllers";
import Match from "./entity";
// import User from "../users/entity";

@JsonController()
export default class MatchController {
  @Authorized()
  @Get("/matches/:matchId")
  getMatch(@Param("matchId") matchId: number) {
    return Match.findOne(matchId);
  }

  //   @Authorized()
  //   @Post("/matches")
  //   @HttpCode(201)
  //   async createMatch(@CurrentUser() user: User) {
  //     const entity = await Match.create().save();

  //     await MatchedUser.create({
  //       match: entity,
  //       user
  //     }).save();

  //     const match = await Match.findOne(entity.id);

  //     return match;
  //   }
}
