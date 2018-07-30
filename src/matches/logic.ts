import {
    JsonController
} from "routing-controllers";


import User from "../users/entity";
import WeeklyUpdate from "../weeklyUpdates/entity";
import FollowUp from "../followups/entity";


//input : 
//list of departments 
//currentUser input on departments
//list of activities
//currentsUser input of activities
//list of categories
//currentUser input of categories

@JsonController()
export default class LogicController {

}
console.log('hi i am logic')



function department(department) {

    // async let inputDepartment = WeeklyUpdate.find(department)
    // async  let usersDepartment = User.find(department)
    // await inputDepartment.find(usersDepartment)

    // if (WeeklyUpdate.department === users.department) {


    }
}

// export function algolly(department, category, activitity) {

//     switch () {

//         case department:
//             //  call function
//             department(department)
//             break;
//         case activity:
//             //  call function
//             break;
//         case category:
//             //  call function
//             break;
//         default:
//         //  call function
//     }




// }