import User from "../users/entity";
import WeeklyUpdate from "../weeklyUpdates/entity";
import { getRepository } from "typeorm";

export async function getCategory(inputCategory) {
  let resultCat = async () => {
    return await WeeklyUpdate.find({
      select: ["category", "id"],
      relations: ["userId"],
      where: {
        category: inputCategory
      }
    });
  };
  return await resultCat();
}

export async function getDepartment(inputDepartment) {
  let resultDepartment = async () => {
    return await User.find({
      //select: ["department", "id", "firstName", "lastName"],
      relations: ["weeklyUpdate"],
      where: {
        department: inputDepartment
      }
    });
  };
  return await resultDepartment();
}

export async function getActivity(inputActivities) {
  let resultActivity = async () => {
    return await getRepository(WeeklyUpdate)
      .createQueryBuilder("weeklyupdate")
      // .select("weeklyUpdate")
      .leftJoinAndSelect("weeklyupdate.activityId", "activity")
      .leftJoinAndSelect("weeklyupdate.userId", "user")
      .where("activity.activityName = :inputActivities")
      .setParameter("inputActivities", inputActivities)
      .getMany();
  };
  return await resultActivity();
}

export async function algolly(inputDepartment, inputActivities, inputCategory) {
  const departmentMatch = await getDepartment(inputDepartment);
  const activityMatch = await getActivity(inputActivities);
  const categoryMatch = await getCategory(inputCategory);
  console.log(inputActivities, "inputactivity");
  if (!departmentMatch || departmentMatch.length === 0) {
    if (!activityMatch || activityMatch.length === 0) {
      if (!categoryMatch || categoryMatch.length === 0) {
        return null;
      } else
        return categoryMatch
        .map(catMatch => catMatch.userId);
    } else
      return activityMatch.map(actMatch => actMatch.userId && actMatch.userId);
  } else return departmentMatch;
}
