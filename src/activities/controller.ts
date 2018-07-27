import { JsonController, Get, Body, Post, Param, NotFoundError, HttpCode, Put, Delete } from "routing-controllers";
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
    @HttpCode(201)
    @Body() activity: Activity
  ) {
    return activity.save()
  }

  @Put('/activities/:activityId')
  async editActivity(
    @Param('activityId') activityId: number,
    @Body() update: Activity
  ) {
    const activity = await Activity.findOne(activityId)
    if(!activity) {
      throw new NotFoundError
    }
    return Activity.merge(activity, update).save()
  }

  @Delete('/activities/:activityId')
  async deleteActivity(
    @Param('activityId') activityId: number,
  ) {
    const activity = await Activity.findOne(activityId)
    if(!activity) {
      throw new NotFoundError
    }
    return Activity.remove(activity)
  }
  
}
