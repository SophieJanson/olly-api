import {
  JsonController,
  Post,
  Body,
  CurrentUser,
  Param,
  Authorized,
  HttpCode,
  Get
} from "routing-controllers";
import FollowUp from "./entity";
import User from "../users/entity";

@JsonController()
export default class FollowUpController {
  @Authorized()
  @Post("/matches/:matchId/followup")
  async createFollowUp(
    @HttpCode(201)
    @Param("matchId")
    matchId: number,
    @Body() changes: Partial<FollowUp>,
    @CurrentUser() user: User
  ) {
    const followUp = await FollowUp.find({ match: matchId, user: user.id })[0];

    let newFollowUp: FollowUp;

    if (!followUp && changes.rating) {
      newFollowUp = new FollowUp();
    } else {
      newFollowUp = followUp;
    }
    return FollowUp.merge(newFollowUp, changes).save();
  }

  @Authorized()
  @Get("/followups")
  async getFollowUps() {
    return {
      followUps: await FollowUp.find()
    };
  }

  @Authorized()
  @Get("/matches/:matchId/followups")
  async getFollowUpPerMatch(@Param("matchId") matchId: number) {
    return {
      followUps: await FollowUp.find({ match: matchId })
    };
  }
}
