
import User from "../users/entity"
import Activity from "../activities/entity"
// import { triggerAsyncId } from "async_hooks";

const departments = ["Development", "Marketing", "Customer Success", "Human Resources", "Analytics", "Legal"]

export const threeButtonsFunc = async () => {
    
    const categories = ["socialize", "network"] //await WeeklyUpdate.find( { select: ["category"] } )
    const activities = await Activity.find()
    const departments = await User.find( { select: ["department"] } )
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
                        "options": categories.map(cat => ({
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
                        "options": await departments.map(dept => { return {
                                    text: dept.department,
                                    value: dept.department
                                } 
                            } )
                    }
                ]
            },
            {
                "fallback": "Submit Your Answer",
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
							"label": `${dept}`,
							"value": `${dept.toLowerCase().split(" ").join("_")}`
							}
						})
					},
					{
						"label": "Fun Fact About You",
						"name": "fun_fact",
						"type": "text",
						"placeholder": "Once, I ate the whole birthday cake of Joanna from Marketing ..."
					},
					{
						"label": "Your Interests",
						"name": "your_interests",
						"type": "text",
						"placeholder": "fill in 3 areas of interest, separated with a comma"
					}
				]

			}
		}
	return await threeQ
}