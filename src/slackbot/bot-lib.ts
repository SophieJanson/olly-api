
import Activity from "../activities/entity"

export const activities = ["Talking JS", "Climbing", "Organizing a Potluck dinner", "Camel riding"]
export const departments = ["Development", "Marketing", "Customer Success", "Human Resources", "Analytics", "Legal"]
export const categories = ["socialize", "network"] 

export const ollyCopy = {
	join: {
		newUser: " HEY-YO! You just joined this team, I saw you! Type `intro` so we can start, then type `set activities`, then type `goals` "
	},
	introduction: {
		onStart: "Let me know about yourself",
		onThanks: "Thanks! Now, I'll be able to match you with the right people!",
		onFailed: "Sorry, I'm afraid something went wrong. Can you try again?"
	},
	match: {
		onStart: "While you’re here, can you let me know what you’re up for this week?",
		onNoMatch: "No matches available. Try again next week",
		onOneMatch: "You matched with ",
		onManyMatches: "Your matches are "
	},
	followUp: {
		onStart: `, just wanted to check if you managed to meet up?`,
		onYes: "That’s great! How was your meeting?",
		onNo: "I'm sorry to hear that! Let's try again next week.",
		onThanks: "Thank you for your feedback!"
	}
}

export const ollyConfig = {
	activities: ["Talking JS", "Climbing", "Organizing a Potluck dinner", "Camel riding"],
	departments: ["Development", "Marketing", "Customer Success", "Human Resources", "Analytics", "Legal"],
	categories: ["socialize", "network"] 
}

export const weeklyUpdateQuestions = async () => {
    const activities = await Activity.find()
    const fallback = "If you could read this message, you'd be choosing something fun to do right now."
    const callbackId = "weekly_update"

    let threeButtons: any = await [
            {
                "text": "I want to ...",
                "fallback": fallback,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": callbackId,
                "actions": [
                    {
                        "name": "category",
                        "text": "Pick a category",
                        "type": "select",
                        "options": ollyConfig.categories.map(cat => ({
                            text: cat,
                            value: cat
                        }))                 
                    }
                ]
            },
                    {
                "text": "... by doing ...",
                "fallback": fallback,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": callbackId,
                "actions": [
                    {
                        "name": "activity",
                        "text": "Pick an activity",
                        "type": "select",
                        "options": await activities.map(activ => { return {
                                    text: activ.activityName,
                                    value: activ.id
                                } 
                            } )
                    }
                ]
            },
            {
                "text": " ... with ...",
                "fallback": fallback,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": callbackId,
                "actions": [
                    {
                        "name": "department",
                        "text": "Pick buddy/buddies",
                        "type": "select",
                        "options": await ollyConfig.departments.map(dept => ({
                                     text: dept,
                                     value: dept.toLowerCase().split(" ").join("_")
                         					 }) 
                         )
                    }
                ]
            },
            {
                "fallback": fallback,
                "title": "Submit Your Answer",
                "callback_id": callbackId,
                "color": "#66BD96",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "submit",
                        "style": "primary",
                        "text": "Submit Answers",
                        "type": "button",
                        "value": "submit"
                    }
                ]
            }
    ]
    return await threeButtons
}
       
export const introButton = [
			{
				"text": "Tell Me More",
				"fallback": "You can't click on this button at the moment",
				"callback_id": "intro_me",
				"color": "#3AA3E3",
				"attachment_type": "default",
				"actions": [
					{
						"name": "Tell Me More",
						"text": "Tell Me More",
						"type": "button",
						"value": "intro",
						"style": "primary"
					}
				]
			}
]

export const threeIntroQuestions = async (trgId, callbId) => {
	let threeQ = 
		{
			"trigger_id": `${trgId}`,
			"dialog": {
				"callback_id": `${callbId}`,
				"title": "Your Department",
				"submit_label": "Submit",
				"notify_on_cancel": true,
				"elements": [
					{
						"label": "Your Department",
						"type": "select",
						"name": "choose_dept",
						"options": await departments.map(dept => { return {
							label: dept,
							value: dept.toLowerCase().split(" ").join("_")
							}
						})
					},
					{
						"label": "Funfact About You",
						"name": "fun_fact",
						"type": "text",
						"placeholder": "Once, I ate the whole birthday cake of Joanna from Marketing ..."
					},
					{
						"label": "Your Interests",
						"name": "your_interests",
						"type": "text",
						"placeholder": "Interested in knitting, javascript or sustainability? Let me know what you are most passionate about!"
					}
				]
			}
		}
	return await threeQ
}

export const getFollowUpHappenedQuestion = () => {
	return [
		{
			"fallback": "Did your meeting happen?",
			"callback_id": "follow_up_happened",
			"attachment_type": "default",
			"actions": [
				{
					"name": "yes",
					"text": "Yes",
					"type": "button",
					"value": "yes",
					"style": "primary"
				},
				{
					"name": "no",
					"text": "No",
					"type": "button",
					"value": "no",
					"style": "primary"
				}
			]
		}
	]
}

export const getFollowUpFeedbackQuestion = () => {
	return [
		{
			"fallback": "Add some comments please",
			"attachment_type": "default",
			"callback_id": "follow_up_feedback",
			"actions": [
				{
					"name": "great",
					"text": "Great",
					"type": "button",
					"value": "2",
					"color": "#3AA3E3",
					"style": "primary"
				},
				{
					"name": "okay",
					"text": "It was okay",
					"type": "button",
					"value": "1",
					"style": "primary"
				},
				{
					"name": "bad",
					"text": "It could have been better",
					"type": "button",
					"value": "0",
					"style": "primary"
				}
			]
		}
	]
}