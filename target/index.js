"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const db_1 = require("./db");
const Koa = require("koa");
const jwt_1 = require("./jwt");
const entity_1 = require("./users/entity");
const controller_1 = require("./users/controller");
const controller_2 = require("./logins/controller");
const controller_3 = require("./weeklyUpdates/controller");
const controller_4 = require("./matches/controller");
const controller_5 = require("./activities/controller");
const app = new Koa();
const port = process.env.PORT || 4000;
let time = `${new Date().getHours()}:${new Date().getMinutes()}`;
routing_controllers_1.useKoaServer(app, {
    cors: true,
    controllers: [
        controller_1.default,
        controller_2.default,
        controller_3.default,
        controller_4.default,
        controller_5.default
    ],
    authorizationChecker: (action) => {
        const header = action.request.headers.authorization;
        if (header && header.startsWith("Bearer ")) {
            const [, token] = header.split(" ");
            try {
                return !!(token && jwt_1.verify(token));
            }
            catch (e) {
                throw new routing_controllers_1.BadRequestError(e);
            }
        }
        return false;
    },
    currentUserChecker: async (action) => {
        const header = action.request.headers.authorization;
        if (header && header.startsWith("Bearer ")) {
            const [, token] = header.split(" ");
            if (token) {
                const { id } = jwt_1.verify(token);
                return entity_1.default.findOne(id);
            }
        }
        return undefined;
    }
});
db_1.default()
    .then(_ => {
    app.listen(port);
    console.log(`Listening on port ${port}  @ ${time}`);
})
    .catch(err => console.error(err));
//# sourceMappingURL=index.js.map