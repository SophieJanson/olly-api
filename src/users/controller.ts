
import { JsonController, Patch, HttpCode, Param, BodyParam, NotFoundError, Get } from "routing-controllers";
import User from "./entity";

@JsonController()
export default class UserController {
	async signup(userData: any) {
    console.log("DATA", userData)
		const entity = await User.create(userData);
		const user = await entity.save();
		return await user;
	}a
		
	@Patch("/users/:userid/")
		@HttpCode(200)
		async updateUserInterest(
			@Param("userid") userId: User,
			@BodyParam("interests") interests: string,
			@BodyParam("funFact") funFact: string,
			@BodyParam("skills") skills: string,
			@BodyParam("department") department: string,
			@BodyParam("role") role: string,
		) {	
			const user = await User.findOne(userId)
			
			if (!user) throw new NotFoundError("There's no user with the given ID, man! #CYBYWY")
			if ( !interests && !funFact && !skills && !department && !role ) {
				throw new NotFoundError("Nothing to update here, bro!")
			}

			skills ? user.skills = skills.split(",") : user.skills
			interests ? user.interests = interests.split(",") : user.interests
			funFact ? user.funFact = funFact : user.funFact
			department ? user.department = department : user.department
			role ? user.role = role : user.role

			let updatedUser = await user.save()
			return updatedUser
		}

	
  @Get('/users/:userId')
  async getUser(
    userSlackId: number,
    @Param('userId') userId: number
  ) {
    const user = await User.findOne((userId || userSlackId))
    return user
  }

  @Get('/users')
  async allUsers() {
    const users = await User.find()
    return { users }
  }
}
