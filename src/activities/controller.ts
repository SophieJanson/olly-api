import { JsonController, Get, Body, Post } from "routing-controllers";
import Activity from "./entity";

@JsonController()
export default class ActivityController {
  @Get('/activities')
  async getActivities() {
    return await {
      activities: Activity.find()
    }
  }

  @Post('/activities')
  async addActivity(
    @Body() activity: Activity
  ) {
    return activity.save()
  }
}
