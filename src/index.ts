import "reflect-metadata";
import { Action, BadRequestError, useKoaServer } from "routing-controllers";
import setupDb from "./db";
import * as Koa from "koa";
import { verify } from "./jwt";
import User from "./users/entity";
import UserController from "./users/controller";
import LoginController from "./logins/controller";
import WeeklyUpdateController from "./weeklyUpdates/controller";
import MatchController from "./matches/controller";
import ActivityController from "./activities/controller";
import FollowUpController from "./followups/controller"
import LogicController from "./matches/logic";

const app = new Koa();
const port = process.env.PORT || 4000;
let time = `${new Date().getHours()}:${new Date().getMinutes()}`;

useKoaServer(app, {
  cors: true,
  controllers: [
    UserController,
    LoginController,
    WeeklyUpdateController,
    MatchController,
    ActivityController,
    FollowUpController,
    LogicController
  ],
  authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");

      try {
        return !!(token && verify(token));
      } catch (e) {
        throw new BadRequestError(e);
      }
    }

    return false;
  },
  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");

      if (token) {
        const { id } = verify(token);
        return User.findOne(id);
      }
    }
    return undefined;
  }
});

setupDb()
  .then(_ => {
    app.listen(port);
    console.log(`Listening on port ${port}  @ ${time}`);
  })
  .catch(err => console.error(err));
