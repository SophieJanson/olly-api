import User from "../users/entity";
import WeeklyUpdate from "../weeklyUpdates/entity";
//import Activity from "../activities/entity";
import { getRepository } from "typeorm";

export function getDepartment(inputDepartment) {
  let departments = async () => {
    return await getRepository(User)
      .createQueryBuilder("user")
      .where("user_department = :userDepartment", {
        userDepartment: inputDepartment
      })
      .getMany();
  };
  return departments;
}

export function getActivity(inputActivities) {
  let activities = async () => {
    return await getRepository(WeeklyUpdate)
      .createQueryBuilder("activity")
      .where("weeklyUpdate_activity = :weeklyUpdateActivity", {
        weeklyActivity: inputActivities
      })
      .innerJoinAndSelect("weeklyUpdate.activity", "activity")
      .getMany();
  };
  return activities;
}

export async function getCategory(inputCategory) {
  let cat = async () => {
    //  console.log(cat, "cat 1");
    return await WeeklyUpdate.find({
      select: ["category"],

      where: {
        category: inputCategory
      }
    });
    console.log("cat 2");
  };
  return await cat();
}

export default function algolly(department, category, activity) {
  if (department !== null) {
    getDepartment(department);
  }

  if (category !== null) {
    getCategory(category);
  }

  if (activity !== null) {
    getActivity(activity);
  }
}

//export const logWeekly = () => WeeklyUpdate.find();
