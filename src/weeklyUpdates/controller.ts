import { JsonController, Post, Body, BadRequestError, NotFoundError } from "routing-controllers";
import WeeklyUpdate from "./entity"
import User from "../users/entity"
import { getRepository } from "../../node_modules/typeorm";
import * as moment from 'moment'

moment().format()    

@JsonController()
export default class WeeklyUpdateController {
	
	//@Get("/weeklygoals")
	// get weeklygoals should send a slack message to the user
	// after choosing among options and submitting, the user will send the post request
	// match and activity should be offered to the user as options in Slack
	// they should be brought to the front-end from their respective tables in the back-end
	
	@Post("/weeklygoals") 
	async newWeeklyGoals(
		@Body() data: any,
	) {
		if(!data.user) throw new BadRequestError('test')
		const userId = await User.findOne({slackId: data.user})
		if(!userId || !userId.id) throw new NotFoundError
		const week = moment().isoWeek()
    const update = await getRepository(WeeklyUpdate)
      .createQueryBuilder('weeklyupdate')
      .where("user_id = :id")
      .setParameter('id', userId.id)
			.getOne()

			if(!update || typeof update === "undefined") {
				const entity = new WeeklyUpdate()
				entity.userId = userId
				data.activity ? entity.activityId = data.activity[0] : null
				data.category ? entity.category = data.category[0] : null
				data.department ? entity.department = data.department[0] : null
				entity.weekNumber = week
				return entity.save()
			} else {
				data.activity ? update.activityId = data.activity[0] : null
				data.category ? update.category = data.category[0] : null
				data.department ? update.department = data.department[0] : null
				return update.save()
			}
    return "hello"
  }
  
  // @Patch("/weeklygoals/whatevs") 
	// async updateUpdate(
	// 	@Body() changes: any
	// ) {
	// 	const entity = new WeeklyUpdate()
  //   WeeklyUpdate.merge(entity, changes)
	// 	entity.category = data.category
  //   entity.department = data.department
  //   entity.activityId = data.activityId
    
	// 	entity.weekNumber = Math.floor(Math.random() * 52) // this WILL be the number of the current week
	// 	entity.status = status[neh]
	// 	entity.user = user 

	// 	const weeklyUpdate = await entity.save()

	// 	return WeeklyUpdate.findOne(weeklyUpdate.id)
	// }
}
