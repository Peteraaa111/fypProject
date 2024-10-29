"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPushNotificationRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const pushNotification_1 = require("../controllers/pushNotification");
const setupPushNotificationRoutes = (router) => {
    const pushNotificationRouter = new koa_router_1.default({ prefix: "/api/v1/pushNotification" });
    // Routers
    pushNotificationRouter.post("/addNotification", (0, koa_bodyparser_1.default)(), pushNotification_1.addNotification);
    pushNotificationRouter.post("/pushNotification", (0, koa_bodyparser_1.default)(), pushNotification_1.pushNotification);
    pushNotificationRouter.get("/getAllNotification", pushNotification_1.getAllNotification);
    pushNotificationRouter.put("/editNotification", (0, koa_bodyparser_1.default)(), pushNotification_1.editNotification);
    router.use(pushNotificationRouter.routes());
};
exports.setupPushNotificationRoutes = setupPushNotificationRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaE5vdGlmaWNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXJzL3B1c2hOb3RpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQW1EO0FBQ25ELG9FQUF3QztBQUV4QyxzRUFLeUM7QUFFbEMsTUFBTSwyQkFBMkIsR0FBRyxDQUFDLE1BQTJDLEVBQVEsRUFBRTtJQUUvRixNQUFNLHNCQUFzQixHQUFHLElBQUksb0JBQU0sQ0FBOEIsRUFBQyxNQUFNLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO0lBRTlHLFVBQVU7SUFFVixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO0lBRy9FLHNCQUFzQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSxtQ0FBZ0IsQ0FBQyxDQUFDO0lBRWpGLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxxQ0FBa0IsQ0FBQyxDQUFDO0lBRXRFLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSxtQ0FBZ0IsQ0FBQyxDQUFDO0lBRWhGLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUM7QUFoQlcsUUFBQSwyQkFBMkIsK0JBZ0J0QyJ9