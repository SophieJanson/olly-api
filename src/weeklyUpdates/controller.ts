import {
  JsonController,
  Post,
  Body,
  CurrentUser,
  Get,
  BadRequestError
} from "routing-controllers";
import WeeklyUpdate from "./entity";
import User from "../users/entity";
// import cron from "node-cron"
// cron.schedule(* 15 * * 2, () => {}

const categories = ["socialize", "network", "learn", "teach"];
const blah = Math.floor(Math.random() * categories.length);
//console.log(categories[blah])
const connectionType = ["a team", "a randomPerson", "a group"];
const rah = Math.floor(Math.random() * connectionType.length);
//console.log(connectionType[rah])
const status = ["pending", "matched"];
const neh = Math.floor(Math.random() * connectionType.length);
//console.log(status[neh])

@JsonController()
export default class WeeklyUpdateController {
  @Get("/weeklygoals")
  // get weeklygoals should send a slack message to the user
  // after choosing among options and submitting, the user will send the post request
  // match and activity should be offered to the user as options in Slack
  // they should be brought to the front-end from their respective tables in the back-end
  @Post("/weeklygoals")
  async newWeeklyGoals(@Body() data: WeeklyUpdate, 
  @CurrentUser() user: User) {
    const entity = await WeeklyUpdate.create(data);
    if (!user.id) {
      throw new BadRequestError("No user");
    }
    entity.category = categories[blah];
    entity.department = connectionType[rah];
    entity.weekNumber = Math.floor(Math.random() * 52); // this WILL be the number of the current week
    entity.status = status[neh];
    entity.userId = user.id;
    // entity.activity =

    // here the match algo runs, then assigns its value to entity.match
    // entity.match =

    const weeklyUpdate = await entity.save();
    return await WeeklyUpdate.findOne(weeklyUpdate.id);
  }
}
