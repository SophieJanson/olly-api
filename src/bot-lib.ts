
import User from "./users/entity"
import Activity from "./activities/entity"
import WeeklyUpdate from "./weeklyUpdates/entity"

export const threeButtonsFunc = async () => {
	
	const categories = await WeeklyUpdate.find( { select: ["category"] } )
	const activities = await Activity.find( { select: ["activity"] } )
	const departments = await User.find( { select: ["department"] } )

	let threeButtons: any = await {
		"text": "While you’re here, can you let me know what you’re up for this week?",
		"response_type": "in_channel",
		"attachments": [
			{
				"text": "I want to ...",
				"fallback": "If you could read this message, you'd be choosing something fun to do right now.",
				"color": "#3AA3E3",
				"attachment_type": "default",
				"callback_id": "game_selection",
				"actions": [
					{
						"name": "games_list",
						"text": "Pick a category",
						"type": "select",
						"options": await categories.map(cat => { return {
									text: cat.category,
									value: cat.category
								} 
							} )					
					}
				]
			},
					{
				"text": "... by doing ...",
				"fallback": "If you could read this message, you'd be choosing something fun to do right now.",
				"color": "#3AA3E3",
				"attachment_type": "default",
				"callback_id": "game_selection",
				"actions": [
					{
						"name": "games_list",
						"text": "Pick an activity",
						"type": "select",
						"options": await activities.map(activ => { return {
									text: activ.activity,
									value: activ.activity
								} 
							} )
					}
				]
			},
					{
				"text": " ... with ...",
				"fallback": "If you could read this message, you'd be choosing something fun to do right now.",
				"color": "#3AA3E3",
				"attachment_type": "default",
				"callback_id": "game_selection",
				"actions": [
					{
						"name": "games_list",
						"text": "Pick buddy/buddies",
						"type": "select",
						"options": await departments.map(dept => { return {
									text: dept.department,
									value: dept.department
								} 
							} )
					}
				]
			}
			]
	}
	return await threeButtons
}
    	

threeButtonsFunc()