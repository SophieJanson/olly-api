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
      relations: ["weeklyUpdate"],
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

export async function algolly(inputDepartment, inputActivities, inputCategory) {
  //let matchesResult = [] as any[];
  console.log("pietje", inputDepartment);
  if (inputDepartment !== null) {
    const departmentMatch = await getDepartment(inputDepartment);
    console.log(departmentMatch, "depmatch");
    return departmentMatch;
  }

  if (inputActivities !== null) {
    const activityMatch = await getActivity(inputActivities);
    console.log(activityMatch, "activityMatch");
    return activityMatch;
  }

  if (inputCategory !== null) {
    const categoryMatch = await getCategory(inputCategory);
    console.log(categoryMatch, "categoryMatch");
    return categoryMatch;
  }

  // if (inputCategory) {
  //   getCategory(category);
  // }

  // if (inputActivities) {
  //   getActivity(activity);
  // }
  return "Sorry, can not find a match";
}
