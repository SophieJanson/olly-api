
var SlackBot = require('slackbots');
import {threeButtonsFunc, introButton, ollyOnStart, ollyOnIntro, ollyOnMatch} from './bot-lib';
let time = `${new Date().getHours()}:${new Date().getMinutes()}`;

export const bot = new SlackBot({
	token: process.env.BOT_ID || "xoxb-215618382279-404376298535-QAhcY9Uwox7Mn7SrG0HaRbj4",
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

	if (data.text.includes(" goals")) {
		return ollyMatch(data.text)
	} else if (data.text.includes(" intro")) {
		return ollyIntro()
	} 
}

async function ollyIntro() {
	
	bot.postMessage(
		"your-olly",
		`${ollyOnIntro}`,
		{
			attachments: await JSON.stringify(await introButton)
		}
	)
	.then(res => console.log(" ___ OLLY INTRO res ___ : ", res.message))
  	.catch(err => console.error(err))
}

async function ollyMatch(message) {
  bot.postMessage(
    "your-olly", 
    `${ollyOnMatch}`, 
    {
      attachments: await JSON.stringify(await threeButtonsFunc())
    }
  )
  .then(res => console.log("RESULT", res))
  .catch(err => console.error(err))
}

