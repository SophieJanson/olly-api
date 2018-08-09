import {
  Post,
  Body,
  HttpCode,
  JsonController,
  NotFoundError,
} from "routing-controllers";

import MatchController from "../matches/controller";
import Company from "../companies/entity";
import User from "../users/entity"
import WeeklyUpdateController from '../weeklyUpdates/controller'
import { threeIntroQuestions } from './bot-lib';
import * as request from "superagent"

const token = process.env.BOT_ID
const Matches = new MatchController()
const WeeklyUpdates = new WeeklyUpdateController()

@JsonController()
export default class SlackbotController {
  
  getTeam = (teamId) => {
    return Company.findOne({"teamId": teamId})
  }

  @Post('/slacktest')
  async getInfo(
    @HttpCode(200)
    @Body() body: any
  ) {
	const data = body.payload
	console.log("___JSON data from Slack___: " + data)

  if(JSON.parse(data).callback_id === "weekly_update") {
		const userId = JSON.parse(data).user.id
		const parsedMessage = JSON.parse(data)['actions'][0]
		try {
			if(parsedMessage['selected_options']) {
			await WeeklyUpdates.newWeeklyGoals({
				user: userId,
				[parsedMessage.name]: [parsedMessage['selected_options'][0].value]
			})
			}
		} catch(e) {
			console.error("ERROR_________", e)
		} 

		if(parsedMessage.value === "submit") {
			let matches = await this.getMatches(userId)
			if(matches === null) {
				return "No matches available. Try again next week"
			} 
			return "Your match(es) is / are: " + await matches.users.map(user => `<@${user.slackId}>`)
			.join(", ")
		}
    return ""
	}

	if(JSON.parse(data).callback_id === "intro_me") {

		if(JSON.parse(data).type === "interactive_message") {
			let triggerId = JSON.parse(data).trigger_id
			let callbackId = JSON.parse(data).callback_id
			let threeQ = await threeIntroQuestions(triggerId, callbackId)

			await request
				.post("https://slack.com/api/dialog.open")
				.set({
					'Content-Type': 'application/json; charset=utf8',
					'Authorization': `Bearer ${token}`
				})
				.send( await threeQ )
				.then(res => console.log("threeQ answer: ", res.status, " ", res.body) )
				.catch(err => console.log("			ERROR FROM intro_me CALLBACK:   " + err));
			
			// return "" // it works even without this return statement
		}

		if (JSON.parse(data).type === "dialog_submission") {

			const dept = JSON.parse(data).submission.choose_dept
			const funFact = JSON.parse(data).submission.fun_fact
			const interests = JSON.parse(data).submission.your_interests
			const userId = JSON.parse(data).user.id

			let answerTheUser = async (message) => {
				await request
				.post("https://slack.com/api/chat.postMessage")
				.set({
					'Content-Type': 'application/json; charset=utf8',
					'Authorization': `Bearer ${token}`
				})
				.send({
					"token": `${token}`,
					"channel": `${JSON.parse(data).channel.id}`,
					"text": `${message}`
				})
				.then(res => console.log("_____ RES from chat.postMessage__ : ", res.status, " ", res.body))
				.catch(err => console.log("_____ RES from chat.postMessage__ : ", err))
			}

			const okayMessage = "Thanks! Now, I'll be able to match you with the right people!"

			let entity = new User() 
			entity.slackId = userId
			entity.department = await dept
			entity.funFact = await funFact
			entity.interests = await interests
			await entity.save()			
			answerTheUser(okayMessage)
		}
	}

	return ""
	}

	async getMatches(
		user: string
	) {
		const update = await WeeklyUpdates.getWeeklyGoals(user)
		if(!update || !update.id) throw new NotFoundError("Weekly update could not be found")
		const {department, activityId, category} = await update
		return await Matches.createMatch({department, activityId, category, id: update.id})
	}

	@Post("/")
	async getPost(
		@HttpCode(200)
		@Body() body: any
	) {
		return body
	}
}