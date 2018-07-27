import {
  JsonController,
  Get,
  Param,
  Authorized,
  Post,
  CurrentUser,
  HttpCode,
  Body,
  NotFoundError
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
    @CurrentUser() user: User, 
    @Body() body: any) {
      console.log(body)
    const usertwo = await User.findOne(2)
    if(!usertwo) throw NotFoundError
    const newMatch = new Match()
    newMatch.activities = ["swimming"]
    newMatch.categories = ["learn"]
    newMatch.status = "pending"
    newMatch.users = [user, usertwo]
    // await getConnection()
    //   .createQueryBuilder()
    //   .relation(Match, "users")
    //   .relation(User, "matches")
    //   .of(body.match)
    //   .add(user);

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

    return newMatch.save();
  }
}
