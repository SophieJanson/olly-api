import { JsonController, Post, Body, CurrentUser, Get, Patch, BadRequestError, NotFoundError, Param, QueryParam, QueryParams } from "routing-controllers";
import WeeklyUpdate from "./entity"
import User from "../users/entity"
import { getRepository } from "../../node_modules/typeorm";
import * as moment from 'moment'
import {threeButtonsFunc} from "../slackbot/bot-lib"
import SlackbotController from "../slackbot/controller"
// import cron from "node-cron"
// cron.schedule(* 15 * * 2, () => {}
moment().format()

let aboutMeButton = {
    "text": "Tell Me About Yourself Now",
    "attachments": [
        {
            "text": "About Me",
            "fallback": "You can't click on this button at the moment",
            "callback_id": "about_me",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "About Me",
                    "text": "About Me",
                    "type": "button",
                    "value": "aboutMe",
					"style": "primary"
                }
			]
		}
	]
}

let openDialog = (trigId, callbackId) => {
  let dialog = {
	"trigger_id": `${trigId}`,
	"dialog": {
		"callback_id": `${callbackId}`,
		"title": "Request a Ride",
		"submit_label": "Request",
		"notify_on_cancel": true,
		"elements": [
			{
				"type": "text",
				"label": "Pickup Location",
				"name": "loc_origin"
			},
			{
				"type": "text",
				"label": "Dropoff Location",
				"name": "loc_destination"
			}
		]
	}
  }
  return dialog
}

@JsonController()
export default class WeeklyUpdateController {
	
	@Get("/hey/:data")
    async hey(
		@Param("data") userId: string
	) {
		console.log(" 			user: ", userId)
		let a = await User.findOne({ where: { slackId: userId }})
		console.log(" SEARCHING users: 	", a )

		if ( a === undefined ) { 
			
			let entity = await User.create()
			entity.slackId = userId
			await entity.save()
			const welcome = "I am sorry, I don't know you ... but wait! Now, I do! :)"
			return { welcome }

		} 
		// const welcome = "Hi there! How's it going today?!"
		const welcome = "Hi there! How's it going today?!"
    	return { aboutMeButton }

    }

    @Get("/intro")
    async intro(
		// @Param("data") data
	) {
		let intro = "introduction"
		return { intro }
    }

    @Get("/test")
    async test() {
        const cats = await threeButtonsFunc()
        return {cats}
    }

	@Post("/weeklygoals") 
moment().format()    

@JsonController()
export default class WeeklyUpdateController {
	async newWeeklyGoals(
		data: any,
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

			let entity
			if(!update || typeof update === "undefined") {
				entity = new WeeklyUpdate()
				entity.userId = user
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
