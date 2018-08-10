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
import { threeIntroQuestions, noMatchesText, yourMatch, yourMatches, ollyIntroQuestionsThanks, ollyIntroQuestionsFailed } from './bot-lib';
import * as request from "superagent"
import Match from "../matches/entity";

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
		const data = body.payload,
					parsedData = JSON.parse(data),
					userId = parsedData.user.id

		switch(parsedData.callback_id) {
			case 'weekly_update':
				const parsedMessage = parsedData['actions'][0]
				try {
					if(parsedMessage['selected_options']) {
						await WeeklyUpdates.newWeeklyGoals({
							user: userId,
							[parsedMessage.name]: [parsedMessage['selected_options'][0].value]
						})
						console.log("DOES THIS RETURN EMPTY")
						return ""
					}
				} catch(e) {
					console.error("ERROR_________", e)
				} 

				if(parsedMessage.value === "submit") {
					let matches: Match | null = await this.getMatches(userId)
					console.log("MATCHES ARE: ", await matches)
					if(!matches) return "no matches"
					console.log("DOES IT GET TO TRIM USERS")

					return this.trimMatchedUsers(matches.users, userId)
				}
				break;

			case 'intro_me':
				if(parsedData.type === "interactive_message") {
					let threeQ = await threeIntroQuestions(parsedData.trigger_id, parsedData.callback_id)
		
					await request
						.post("https://slack.com/api/dialog.open")
						.set({
							'Content-Type': 'application/json; charset=utf8',
							'Authorization': `Bearer ${token}`
						})
						.send( await threeQ )
						.then(res => console.log("threeQ answer: ", res.status, " ", res.body) )
						.catch(err => console.log("			ERROR FROM intro_me CALLBACK:   " + err));
				}
		
				if (parsedData.type === "dialog_submission") {
					const dept = parsedData.submission.choose_dept,
								funFact = parsedData.submission.fun_fact,
								interests = parsedData.submission.your_interests,
								userId = parsedData.user.id
			
					this.saveUser(dept, funFact, interests, userId)
						.then(_ => this.answerTheUser(ollyIntroQuestionsThanks, parsedData.response_url))
						.catch(err => {
							console.error(err)
							this.answerTheUser(ollyIntroQuestionsFailed, parsedData.response_url)
						})
				}
				return ""

			default: 
				return ollyIntroQuestionsFailed
		}
	}

	async saveUser(dept, funFact, interest, userId) {
		const existingUsers = await User.find({slackId: userId})
		let entity
		if(await existingUsers.length > 0) {
			entity = await existingUsers[0]
		} else {
			entity = new User()
		}
		entity.slackId = userId
		entity.department = await dept
		entity.funFact = await funFact
		entity.interests = await interest
		await entity.save()	
	}

	async getMatches(
		user: string
	) {
		const update = await WeeklyUpdates.getWeeklyGoals(user)
		if(!update || !update.id) throw new NotFoundError("Weekly update could not be found")
		const {department, activityId, category} = await update
		return await Matches.createMatch({department, activityId, category, id: update.id})
	}

	trimMatchedUsers = (users, currentUserSlackId: string): string  => {
		if(!users || users.length < 1) return noMatchesText
		console.log("DOES IT GET HERE? TRIM USERS LINE 117")

		const newUsers = users.filter(user => user.slackId !== currentUserSlackId)

		if( users.length > newUsers.length) {
			return this.trimMatchedUsers(newUsers, currentUserSlackId)
		}
		console.log("DOES IT GET HERE? TRIM USERS LINE 124")

		const message = users.length < 2 ? yourMatch : yourMatches 
		const usersString = users.length < 2 ? users[0].slackId : users.map(user => user.slackId).join(", ")
		console.log("DOES IT GET HERE?", message, usersString)
		return `${message} <@${usersString}>`
	}

	answerTheUser = async (message, responseUrl) => {
		await request
		.post(responseUrl)
		.set({
			'Content-Type': 'application/json; charset=utf8',
			'Authorization': `Bearer ${token}`
		})
		.send({
			"text": `${message}`
		})
		.then(res => console.log("_____ RES from chat.postMessage__ : ", res.status, " ", res.body))
		.catch(err => console.log("_____ RES from chat.postMessage__ : ", err))
	}
}