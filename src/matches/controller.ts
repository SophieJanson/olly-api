import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  CurrentUser,
  HttpCode
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
  async createMatch(@CurrentUser() user: User, match: Match) {
    await getConnection()
      .createQueryBuilder()
      .relation(Match, "users")
      .of(match)
      .add(user);

    // let users = await connection
    // .getRepository(User)
    // .createQueryBuilder("user") // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
    // .innerJoinAndSelect("user.id", "userId")
    // .leftJoinAndSelect("user.matches", "match")
    // // .where("photo.isPublished = true")
    // .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
    // .orderBy("photo.id", "DESC")
    // .skip(5)
    // .take(10)
    // .setParameters({ photoName: "My", bearName: "Mishka" })
    // .getMany();

    // const match = await Match.find(users);

    return match;
  }
}
