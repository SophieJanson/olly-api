// import {
//   JsonController,
//   Get,
//   Param,
//   Authorized,
//   Post,
//   HttpCode,
//   Body
// } from "routing-controllers";
import Match from "./entity";
import User from "../users/entity";

interface MatchRequest {
  users: User[],
  activities: string[],
  categories: string[],
  status: string
}

export default class MatchController {
  async getMatch(
    matchId: number) {
    return await Match.findOne(matchId);
  }

  async createMatch(
    match: MatchRequest) {
    const newMatch = new Match()
    return await Match.merge(newMatch, match).save();
  }
}
