import { JsonController, Body, BadRequestError, NotFoundError } from "routing-controllers";
import WeeklyUpdate from "./entity"
import User from "../users/entity"
import { getRepository } from "../../node_modules/typeorm";
import * as moment from 'moment'

moment().format()    

@JsonController()
export default class WeeklyUpdateController {
	async newWeeklyGoals(
		@Body() data: any,
	) {
		if(!data.user) throw new BadRequestError()

		const userId = await User.findOne({slackId: data.user})
		if(!userId || !userId.id) throw new NotFoundError
		const week = moment().isoWeek()
    const update = await getRepository(WeeklyUpdate)
      .createQueryBuilder('weeklyupdate')
      .where("user_id = :id", {id: userId.id})
			.getOne()

			let entity
			if(!update || typeof update === "undefined") {
				entity = new WeeklyUpdate()
				entity.userId = userId
				entity.weekNumber = week
			} else {
				entity = update
			}

		data.activity ? entity.activityId = data.activity[0] : null
		data.category ? entity.category = data.category[0] : null
		data.department ? entity.department = data.department[0] : null
		return entity.save()
  }
  
	async registerUpdateMatch(
		matchId: number,
		weeklyUpdateId: number
	) {
		const update = await WeeklyUpdate.findOne(weeklyUpdateId)
		if(!update) throw new NotFoundError("Weekly Update could not be found")
		update.matchId = matchId

		return update.save()
	}
}
