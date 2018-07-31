import User from "../users/entity";
import WeeklyUpdate from "../weeklyUpdates/entity";
import { getRepository } from "typeorm";

export async function getCategory(inputCategory) {
  let resultCat = async () => {
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
  return await resultCat();
}

export async function getDepartment(inputDepartment) {
  let resultDepartment = async () => {
    //  console.log(cat, "cat 1");
    return await User.find({
      select: ["department", "id", "firstName", "lastName"],
      where: {
        department: inputDepartment
      }
    });
    console.log("cat dep");
  };
  return await resultDepartment();
}

export async function getActivity(inputActivities) {
  let resultActivity = async () => {
    console.log(inputActivities);
    return await getRepository(WeeklyUpdate)
      .createQueryBuilder("weeklyupdate")
      .leftJoinAndSelect("weeklyupdate.activityId", "activity")
      .where("activity.activityName = :inputActivities")
      //  .andWhere('week = 1')
      .setParameter("inputActivities", inputActivities)
      .getMany();
  };
  return await resultActivity();
}

export default function algolly(department, category, activity) {
  const matchesResult = [] as any[];

  if (department !== null) {
    let departments = async () => {
      return await getRepository(User)
        .createQueryBuilder("user")
        .where("user_department = :userDepartment", {
          userDepartment: department
        })
        .getMany();
    };
    matchesResult.push(departments());

    return matchesResult;
  }

  if (category !== null) {
    getCategory(category);
  }

  if (activity !== null) {
    getActivity(activity);
  }
}
