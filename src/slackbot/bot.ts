
var SlackBot = require('slackbots');
import {threeButtonsFunc, introButton, ollyOnStart, ollyOnIntro, ollyOnMatch} from './bot-lib';
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
		`${ollyOnStart}`,
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

<<<<<<< HEAD
	if (data.text.includes(" goals")) {
		return ollyMatch(data.text)
	} else if (data.text.includes(" intro")) {
		return ollyIntro()
	} 
}
=======
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
>>>>>>> 16eb87e3eec81fe02128257990725ad280a532e6

	bot.postMessage(
<<<<<<< HEAD
		"your-olly",
		`${ollyOnIntro}`,
=======
		data.channel,
		"Let me know about yourself",
>>>>>>> 16eb87e3eec81fe02128257990725ad280a532e6
		{
			attachments: await JSON.stringify(await introButton)
		}
	)
		.then(res => console.log(" ___ OLLY INTRO res ___ : ", res.message))
  	.catch(err => console.error(err))
}

<<<<<<< HEAD
async function ollyMatch(message) {
  bot.postMessage(
    "your-olly", 
    `${ollyOnMatch}`, 
=======
async function ollyMatch(data) {
  bot.postMessage(
    data.channel, 
    "While you’re here, can you let me know what you’re up for this week?", 
>>>>>>> 16eb87e3eec81fe02128257990725ad280a532e6
    {
      attachments: await JSON.stringify(await threeButtonsFunc())
    }
  )
<<<<<<< HEAD
  .then(res => console.log("RESULT", res))
  .catch(err => console.error(err))
}

=======
		.then(res => console.log("RESULT", res))
		.catch(err => console.error(err))
}
>>>>>>> 16eb87e3eec81fe02128257990725ad280a532e6
