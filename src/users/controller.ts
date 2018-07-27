import { JsonController, Post, Body, Patch, HttpCode, Param, BodyParam, NotFoundError } from "routing-controllers";
import User from "./entity";

@JsonController()
export default class UserController {
	//   @Authorized()
	@Post("/users")
	async signup(@Body() data: User) {
		const { password, ...rest } = data;
		const entity = User.create(rest);
		await entity.setPassword(password);

		const user = await entity.save();

		return user;
	}
		
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

			// let skillsArray = 
			// let interestsArray = 

			skills ? user.skills = skills.split(",") : user.skills
			interests ? user.interests = interests.split(",") : user.interests
			funFact ? user.funFact = funFact : user.funFact
			department ? user.department = department : user.department
			role ? user.role = role : user.role

			let updatedUser = await user.save()
			return updatedUser
		}

	//   @Authorized()
	// @Get('/users/:id([0-9]+)')
	// getUser(
	// 	@Param('id') id: number
	// ) {
	// 	return User.findOne(id)
	// }

	// @Authorized()
	// @Get('/users')
	// allUsers() {
	// 	return User.find()
	// }
}
