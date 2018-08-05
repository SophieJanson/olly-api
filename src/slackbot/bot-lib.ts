
import User from "../users/entity"
import Activity from "../activities/entity"

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
       

