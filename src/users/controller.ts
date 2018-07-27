import { JsonController, Post, Body, Param, Get, NotFoundError, Put, HttpCode } from "routing-controllers";
import User from "./entity";

@JsonController()
export default class UsersController {
  
  @Post('/users')
  @HttpCode(201)
  async createUser(
    @Body() user: User
  ) {
    const { password, ...rest } = user
    const entity = User.create(rest)
    await entity.setPassword(password)
    return entity.save()
  }
  
  // @Get('/users/:userId/stats')
  // async getStats(
  //   @Body() user: User
  // ) {
  //   const user = await User.findOne(user)
  //   return user
  // }


  @Get('/users/:userId')
  async getUser(
    @Param('userId') userId: number
  ) {
    const user = await User.findOne(userId)
    return user
  }


  @Get('/users')
  async allUsers() {
    const users = await User.find()
    return { users }
  }

  
 

}
