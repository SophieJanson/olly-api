var request = require("superagent")
var SlackBot = require('slackbots');

let time = `${new Date().getHours()}:${new Date().getMinutes()}`;

const bot = new SlackBot({
	token: "xoxb-13649336358-407340755362-WVcEJblXeNy63YzPjG5r42xA",
	name: "Olly"
})

bot.on("start", () => {
	// const params = {
	// 	icon_emoji: ":penguin:"
	// }
	
	console.log(`Olly's server is running @ ${time}`)

	bot.postMessageToChannel(
		"bot-testing",
		"Olly is here for you!",
		// params
	)
})

bot.on("error", (err) => console.log(err))

bot.on("message", (data) => {
	console.log(data)
	if (data.type !== "message") {
		return;
	}
	handleMessage(data.text)
})

function handleMessage(message) {
	console.log("MESSAGE", message)
	if (message.includes(" chucknorris")) {
		chuckJoke()
	} else if (message.includes(" giphy")) {
		giphyFunc()
	} else if (message.includes(" Olly")) {
		ollyFunc()
	}
}

function chuckJoke () {
	request
		.get("https://api.chucknorris.io/jokes/random")
		.then(res => {
			const joke = res.body.value
	
			// const params = {
			// 	icon_emoji: ":laughing:"
			// }

			bot.postMessageToChannel(
				"bot-testing",
				`Chuck Norris: ${joke}`,
				// params
			)
	})
}

function giphyFunc () {
	request
			.get("https://bot-back-end.herokuapp.com/giphy/batman")
			// .get("http://localhost:4000/giphy/duck")
			.then(res => {
				// const joke = res.body.data[0].id
				const joke = res.res.text
				console.log("here's your joke, bro: " + Object.keys(joke))
		
				// const params = {
				// 	icon_emoji: ":laughing:"
				// }

				bot.postMessageToChannel(
					"bot-testing",
					`Giphy: ${joke}`,
					// params
				)
			})
			.catch((err) => console.log(err))
}

function ollyFunc () {
	request
		.get("http://localhost:4000")
}