var request = require("superagent")
var SlackBot = require('slackbots');
import {threeButtonsFunc} from './bot-lib';
import User from '../users/entity'
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
		"Olly is here for you!",
		`${params.icon_emoji}`
	)
})

bot.on("error", (err) => console.log(err))

bot.on("message", (data) => {
  console.log("Olly is listening")
	if (data.type !== "message") {
		return;
	}
	handleMessage(data)
})

function handleMessage(data) {
	if(!data.text) return "no text"

	if (data.text.includes(" hey")) {
		return ollyHey(data.user)
	} else if (data.text.includes(" goals")) {
		return ollyMatch(data.text)
	} else if (data.text.includes(" intro")) {
		return ollyIntro()
	} else if (data.text.includes(" add me")) {
		return ollyAddUser(data)
	}
}

function ollyHey(userId) {
	console.log("	 	")
	console.log("		Problematic DATA: 	" + userId)
	console.log("	 	")
	// request
	// 	.get(`http://localhost:4000/hey/${userId}`)
	// 	.then(res => {
	// 		request
	// 			.post('https://hooks.slack.com/services/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')
	// 			.set('Content-Type', 'application/json')
	// 			.send( res.body.aboutMeButton )
	// 			.catch(err => console.log("			ERROR FROM INSIDE REQUEST:   " + err));
	// 		}
	// 	)
	// 	.catch(err => console.log("			ERROR FROM OUTSIDE REQUEST:   " + err))
}

function ollyIntro() {
	request
		.get(`http://localhost:4000/intro`)
		.then(res => {
			request
				.post('https://hooks.slack.com/services/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')
				.set('Content-Type', 'application/json')
				.send( { text: res.body.intro } )
				.catch(err => console.log("			ERROR FROM INSIDE REQUEST:   " + err));
			}
		)
		.catch(err => console.log("			ERROR FROM OUTSIDE REQUEST:   " + err))
}

async function ollyMatch(message) {
  console.log(message)
  bot.postMessage(
    "your-olly", 
    "While you’re here, can you let me know what you’re up for this week?", 
    {
      attachments: await JSON.stringify(await threeButtonsFunc())
    }
  )
  .then(res => console.log("RESULT", res))
  .catch(err => console.error(err))
}

async function ollyAddUser(message): Promise<User|string> {
	if(await User.find({slackId: message.user})) {
		return bot.postMessageToChannel(
			'your-olly',
			"You already exist"
		)
	}

	const departments = ["development", "marketing", "customer success", "hr"]
	const setDepartment = departments[Math.round(Math.random() * departments.length)]
	
	const user = new User()
	user.slackId = message.user
	user.department = setDepartment
	const savedUser = await user.save()
	bot.postMessageToChannel(
		'your-olly',
		"You have been added"
	)
	return savedUser
}
