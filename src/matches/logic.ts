import User from '../users/entity'
import WeeklyUpdate from '../weeklyUpdates/entity'
import Activity from '../activities/entity'
import { getRepository } from 'typeorm';




function getDepartment(department) {
    let departments = async () => { 
        return await getRepository(User)
            .createQueryBuilder("user")
            .where("user_department = :userDepartment", { userDepartment: department })
            .getMany()
    }
}   

function getActivity(activity) {

}

function getCategory(category) {

}


export default function algolly(department, category, activity) {

    if (department !== null) {
        getDepartment(department)
    }
    
    if (category !== null) {
        getCategory(category)
    }
    
    if (activity !== null) {
        getActivity(activity)
    }

}