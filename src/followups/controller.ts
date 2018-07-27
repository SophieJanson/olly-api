import { IsString } from "class-validator";
import {
  JsonController,
  Post,
  Body,
  CurrentUser,
  Param,
  Authorized
} from "routing-controllers";
import FollowUp from "./entity";
import User from "../users/entity";


@JsonController()
export default class FollowUpController {
  
  @Authorized()
  @Post("/matches/:matchId/followup")
  async createFollowUp(
    @Param('matchId') matchId: number,
    @Body() changes: Partial<FollowUp>,
    @CurrentUser() user: User
  ) {
    const followUp = await FollowUp.find({match: matchId, user: user.id})[0]

    let newFollowUp: FollowUp 

    if(!followUp && changes.rating) {
      newFollowUp = new FollowUp()
    } else {
      newFollowUp= followUp
    }
    return FollowUp.merge(newFollowUp, changes).save()
  }
}
