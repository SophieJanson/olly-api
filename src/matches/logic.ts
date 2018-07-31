import User from '../users/entity'
import WeeklyUpdate from '../weeklyUpdates/entity'
import { getRepository } from 'typeorm';



export async function getCategory(inputCategory) {
    let cat = async () => {
      //  console.log(cat, "cat 1");
      return await WeeklyUpdate.find({
        select: ["category", "id"],
        relations: ["user"],
        where: {
          category: inputCategory
        }
      });
      console.log("cat 2");
    };
    return await cat();
  }

   export async function getDepartment(inputDepartment) {
    let catDep = async () => {
      //  console.log(cat, "cat 1");
      return await User.find({
        select: ["department", "id", "firstName", "lastName"],
        where: {
          department: inputDepartment
        }
      });
      console.log("cat dep");
    };
    return await catDep();
  }

function getActivity(activity) {
    let activities = async () => { 
        return await getRepository(WeeklyUpdate)
        .createQueryBuilder('weeklyUpdate')
        .where("weeklyUpdate_activity = :weeklyUpdateActivity", {
            weeklyActivity: activity
          })
        .innerJoinAndSelect('weeklyUpdate.activity', 'activity')
        .getMany()
    }
    return activities
}



export default function algolly(department, category, activity) {
    
    const  matchesResult = [] as any[];
    
        if (department !== null) {
        
            let departments = async () => { 
                return await getRepository(User)
                    .createQueryBuilder("user")
                    .where("user_department = :userDepartment", { userDepartment: department })
                    .getMany()
            }
                matchesResult.push(departments())
            
                return matchesResult
            
            }
            
            if (category !== null) {
                getCategory(category)
            }
            
            if (activity !== null) {
                getActivity(activity)
            }
        
    
}