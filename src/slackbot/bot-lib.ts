
import User from "../users/entity"
import Activity from "../activities/entity"
import WeeklyUpdate from "../weeklyUpdates/entity"

export const threeButtonsFunc = async () => {
    
    const categories = await WeeklyUpdate.find( { select: ["category"] } )
    const activities = await Activity.find(  )
    const departments = await User.find( { select: ["department"] } )

    let threeButtons: any = await {
        "response_type": "ephemeral",
        "replace_original": false,
        "text": "While you’re here, can you let me know what you’re up for this week?",
        "attachments": [
            {
                "text": "I want to ...",
                "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": "weekly_update",
                "actions": [
                    {
                        "name": "category",
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
                "callback_id": "weekly_update",
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
                "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": "weekly_update",
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
            "callback_id": "submit_button",
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
    }
    return await threeButtons
}
        

// threeButtonsFunc()
