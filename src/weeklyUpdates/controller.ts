import { JsonController, Post, Body, CurrentUser, Get, Patch, BadRequestError } from "routing-controllers";
import WeeklyUpdate from "./entity"
import User from "../users/entity"
import { getRepository } from "../../node_modules/typeorm";
// import cron from "node-cron"
// cron.schedule(* 15 * * 2, () => {}

const categories = ["socialize", "network", "learn", "teach"]
const blah = Math.floor(Math.random() * categories.length)   
console.log(categories[blah])              
const connectionType = ["a team", "a randomPerson", "a group"]
const rah = Math.floor(Math.random() * connectionType.length)
console.log(connectionType[rah])      
const status = ["pending", "matched"]
const neh = Math.floor(Math.random() * connectionType.length)
console.log(status[neh])      

@JsonController()
export default class WeeklyUpdateController {
	
	@Get("/weeklygoals")
	// get weeklygoals should send a slack message to the user
	// after choosing among options and submitting, the user will send the post request
	// match and activity should be offered to the user as options in Slack
	// they should be brought to the front-end from their respective tables in the back-end
	
	@Post("/weeklygoals") 
	async newWeeklyGoals(
		@Body() data: any,
	) {
    if(!data.user) throw new BadRequestError()
    const update = await getRepository(WeeklyUpdate)
      .createQueryBuilder('weeklyupdate')
      .leftJoinAndSelect('weeklyupdate.user', 'user')
      .where("user.slackId = :userId")
      .setParameter('userId', data.user)
      .getOne()

      if(update) {
        return await WeeklyUpdate.merge(update, data).save()
      } else {
        const entity = await WeeklyUpdate.create(data)
        return await entity
      }

    //    console.log("UPDATE", await update)

		// entity.category = data.category
    // entity.department = data.department
    // entity.activityId = data.activityId
    
		// entity.weekNumber = Math.floor(Math.random() * 52) // this WILL be the number of the current week
		// entity.status = status[neh]
		// entity.user = user 

		// const weeklyUpdate = await entity.save()

    // return WeeklyUpdate.findOne(weeklyUpdate.id)
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
