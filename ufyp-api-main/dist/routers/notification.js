"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNotificationRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const notification_1 = require("../controllers/notification");
const setupNotificationRoutes = (router) => {
    const notificationRouter = new koa_router_1.default({ prefix: "/api/v1/notification" });
    notificationRouter.post("/sendNotification", (0, koa_bodyparser_1.default)(), notification_1.sendNotification);
    router.use(notificationRouter.routes());
};
exports.setupNotificationRoutes = setupNotificationRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcnMvbm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUFtRDtBQUNuRCxvRUFBd0M7QUFFeEMsOERBRXFDO0FBRTlCLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxNQUEyQyxFQUFRLEVBQUU7SUFFM0YsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLG9CQUFNLENBQThCLEVBQUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztJQUV0RyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsK0JBQWdCLENBQUMsQ0FBQztJQUU3RSxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDMUMsQ0FBQyxDQUFDO0FBUFcsUUFBQSx1QkFBdUIsMkJBT2xDIn0=