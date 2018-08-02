import { JsonController, Post, Body, CurrentUser, Get, Patch, BadRequestError, NotFoundError, Param, QueryParam, QueryParams } from "routing-controllers";
import WeeklyUpdate from "./entity"
import User from "../users/entity"
import { getRepository } from "../../node_modules/typeorm";
import * as moment from 'moment'
import {threeButtonsFunc} from "../slackbot/bot-lib"
// import cron from "node-cron"
// cron.schedule(* 15 * * 2, () => {}
moment().format()
// const categories = ["socialize", "network", "learn", "teach"]
// const blah = Math.floor(Math.random() * categories.length)   
// const connectionType = ["a team", "a randomPerson", "a group"]
// const rah = Math.floor(Math.random() * connectionType.length)
// console.log(connectionType[rah])      
// const status = ["pending", "matched"]
// const neh = Math.floor(Math.random() * connectionType.length)
// console.log(status[neh])      

@JsonController()
export default class WeeklyUpdateController {
	
	@Get("/hey/:data")
    async hey(
		@Param("data") userId: string
	) {
		// console.log(" 			user: ", typeof userId)
		let a = await User.findOne({ where: { slackId: userId }})
		console.log(" SEARCHING users: 	", a )

		if ( a !== undefined ) { 
			const welcome = "Hi there! I am Olly, it's super nice to meet you!"
    	    return { welcome }
		} else {
			let entity = await User.create()
			entity.slackId = userId
			let user = await entity.save()
			return await user
			const iDontKnowYou = "I am sorry, I don't know you"
			return { iDontKnowYou }
		}
    }

    @Get("/onboard")
    async onboard(data) {
    	let updateUser = 1
    }

    @Get("/test")
    async test() {
        const cats = await threeButtonsFunc()
        return {cats}
    }

	@Post("/weeklygoals") 
	async newWeeklyGoals(
		@Body() data: any,
	) {
		if(!data.user) throw new BadRequestError()
		const userId = await User.findOne({slackId: data.user})
		if(!userId || !userId.id) throw new NotFoundError
		const week = moment().isoWeek()
		console.log("DAAAAAAAAAAAAATA", data)
    	const update = await getRepository(WeeklyUpdate)
			.createQueryBuilder('weeklyupdate')
			.where("user_id = :id")
			.setParameter('id', userId.id)
			.getOne()

			if(!update || typeof update === "undefined") {
				const entity = new WeeklyUpdate()
				entity.userId = userId.id
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

	//@Get("/weeklygoals")
	// get weeklygoals should send a slack message to the user
	// after choosing among options and submitting, the user will send the post request
	// match and activity should be offered to the user as options in Slack
	// they should be brought to the front-end from their respective tables in the back-end
}
