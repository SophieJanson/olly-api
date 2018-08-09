// var request = require("superagent")
var SlackBot = require('slackbots');
import {threeButtonsFunc, introButton, departments, channel} from './bot-lib';
import User from '../users/entity'
let time = `${new Date().getHours()}:${new Date().getMinutes()}`;

export const bot = new SlackBot({
	token: process.env.BOT_ID,
	name: "Olly"
})

bot.on("start", () => {
	const params = {
		icon_emoji: ":penguin:"
	}
	
	console.log(`Olly's server is running @ ${time}`)

	bot.postMessageToChannel(
		"your-olly",
		"Olly is here for you!",
		`${params.icon_emoji}`
	)
})

bot.on("error", (err) => console.log(err))

bot.on("message", (data) => {
	if (data.type !== "message") {
		return;
	}
	handleMessage(data)
})

function handleMessage(data) {
	if(!data.text) return "no text"

	if (data.text.includes("goals")) {
		return ollyMatch(data)
	} else if (data.text.includes("intro")) {
		return ollyIntro(data)
	}
}

async function ollyIntro(data) {
	const existingUser = await User.find({slackId: data.user})

	if(existingUser.length > 0) {
		console.log("EXISTING USER", existingUser, existingUser.length)
		return "You already exist"
	}

	bot.postMessage(
		data.channel,
		"Let me know about yourself",
		{
			attachments: await JSON.stringify(await introButton)
		}
	)
		.then(res => console.log(" ___ OLLY INTRO res ___ : ", res.message))
  	.catch(err => console.error(err))
}

async function ollyMatch(data) {
  bot.postMessage(
    data.channel, 
    "While you’re here, can you let me know what you’re up for this week?", 
    {
      attachments: await JSON.stringify(await threeButtonsFunc())
    }
  )
		.then(res => console.log("RESULT", res))
		.catch(err => console.error(err))
}
