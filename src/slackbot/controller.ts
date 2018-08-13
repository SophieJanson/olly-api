import {
  Post,
  Body,
  HttpCode,
  JsonController,
  NotFoundError,
	BadRequestError,
} from "routing-controllers";

import MatchController from "../matches/controller";
import Company from "../companies/entity";
import User from "../users/entity"
import WeeklyUpdateController from '../weeklyUpdates/controller'
import { threeIntroQuestions, introButton, noMatchesText, yourMatch, yourMatches, ollyIntroQuestionsThanks, ollyIntroQuestionsFailed, threeButtonsFunc, activities, ollyOnMatch, ollyOnIntro, ollyNewUserJoinTeam } from './bot-lib';
import * as request from "superagent"
import Match from "../matches/entity";
import ActivityController from "../activities/controller";

const token = process.env.BOT_ID
const Matches = new MatchController()
const WeeklyUpdates = new WeeklyUpdateController()
const ActivityClass = new ActivityController()

@JsonController()
export default class SlackbotController {
  
  	getTeam = (teamId) => {
    return Company.findOne({"teamId": teamId})
	}
	
	postMessage = (
		messageText: string, 
		channel: string = "", 
		attachments: object = {},
		responseUrl: string = ""
	): Promise<string> => {
		return request
			.post(responseUrl)
			.set({
				'Content-Type': 'application/json; charset=utf8',
				'Authorization': `Bearer ${token}`
			})
			.send({
				"channel": channel,
				"text": `${messageText}`,
				"attachments": attachments,
				"as_user": true
			})
			.then(_ => "request has been sent")
			.catch(err => {
				console.log("_____ RES from chat.postMessage__ : ", err)
				return "Error!"
			})
	}

	@Post('/slack/message')
	async parseResponse(
		@HttpCode(200)
		@Body() body: any
	) {
		console.log(body)
		//Slack needs this to validate the request URL. 
		if(body.challenge) return await body.challenge

		if(!body.event || body.event.bot_id) return "Error"
		
		if(body.event.type.includes("team_join")) {
			console.log(await body.event.user.id)
			console.log(await " ___ Congrats, JUST JOINED THE TEAM!")
			return await this.postMessage(ollyNewUserJoinTeam, body.event.user.id, [{"text":""}], "https://slack.com/api/chat.postMessage") 
		}

		if(body.event.text.includes('goals')) {
			return this.postMessage(ollyOnMatch, body.event.channel, await threeButtonsFunc(), body.response_url)
		} else if(body.event.text.includes('intro')) {
			return this.postMessage(ollyOnIntro, body.event.channel, await introButton, body.response_url)
		} else if(body.event.text.includes('set activities')) {
			const addedActivities = async() => {
				return await activities.forEach(activ => {
					return ActivityClass.addActivity(activ)
				}) 
			}

			addedActivities()
				.then(_ => {
					return this.postMessage("Activities are set, woohoo!", body.event.channel, [], body.response_url)
				})
				.catch(err => console.error(err))
		}

		return ""
	}

  @Post('/slack/response')
  async getInfo(
    @HttpCode(200)
		@Body() body: any
  ) {
		if(!body || !body.payload) throw new BadRequestError("Incorrect body")
		const parsedData = this.tryParseJson(body.payload)
		if (!parsedData) throw new BadRequestError("Incorrect body")

		const userId: string = parsedData.user && parsedData.user.id
		switch(parsedData.callback_id) {
			case 'weekly_update':
				const parsedMessage = parsedData['actions'][0]
				try {
					if(parsedMessage['selected_options']) {
						await WeeklyUpdates.newWeeklyGoals({
							user: userId,
							[parsedMessage.name]: [parsedMessage['selected_options'][0].value]
						})
						return " "
					}
				} catch(e) {
					console.error("ERROR_________", e)
				} 

				if(parsedMessage.value === "submit") {
					let matches: Match | null = await this.getMatches(userId)
					if(!matches) return "no matches"
					return this.trimMatchedUsers(matches.users, userId)
				}
				break;

			case 'intro_me':
				this.sendIntroQuestions(parsedData)
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
		const newUsers = users.filter(user => user.slackId !== currentUserSlackId)

		if( users.length > newUsers.length) {
			return this.trimMatchedUsers(newUsers, currentUserSlackId)
		}

		const message = users.length < 2 ? yourMatch : yourMatches 
		const usersString = users.length < 2 ? users[0].slackId : users.map(user => user.slackId).join(", ")
		return `${message} <@${usersString}>`
	}

	answerTheUser = async (message, responseUrl) => {
		await request
		.post(responseUrl)
		.set({
			'Content-Type': 'application/json; charset=utf8',
			'Authorization': `Bearer ${token}`
		})
		.send({"text": `${message}`})
		.then(res => console.log("_____ RES from chat.postMessage__ : ", res.status, " ", res.body))
		.catch(err => console.log("_____ RES from chat.postMessage__ : ", err))
	}

	tryParseJson = (payload: string) => {
		try{
			return JSON.parse(payload)
		} catch(e) {
			console.error(e)
		}
		return false
	}

	sendIntroQuestions = async (parsedData) => {
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
	}
}