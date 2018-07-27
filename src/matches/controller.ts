import { JsonController, Get, Param } from "routing-controllers";
import Match from "./entity";

@JsonController()
export default class MatchController {
  @Get("/matches/:matchId")
  getMatch(@Param("matchId") matchId: number) {
    return Match.findOne(matchId);
  }
}
