import { JsonController, Get } from "routing-controllers";
import Activity from "./entity";

@JsonController()
export default class ActivityController {
  @Get('/activities')
  async getActivities() {
    return await {
      activities: Activity.find()
    }
  }
}
