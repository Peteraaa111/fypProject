"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_cors_1 = __importDefault(require("koa-cors"));
const users_1 = require("./routers/users");
const class_1 = require("./routers/class");
const admin_1 = require("./routers/admin");
const yearlySetup_1 = require("./routers/yearlySetup");
const schoolActivity_1 = require("./routers/schoolActivity");
const replySlip_1 = require("./routers/replySlip");
const dataAnalysis_1 = require("./routers/dataAnalysis");
const studentSetting_1 = require("./routers/studentSetting");
const interestClass_1 = require("./routers/interestClass");
const yearRank_1 = require("./routers/yearRank");
const notification_1 = require("./routers/notification");
const chat_1 = require("./routers/chat");
const pushNotification_1 = require("./routers/pushNotification");
const teacherFunction_1 = require("./routers/teacherFunction");
// Create Koa app instance and a router instance
const app = new koa_1.default();
const router = new koa_router_1.default();
app.use((0, koa_cors_1.default)());
//app.use(classes.routes()).use(classes.allowedMethods());
// app.use(adminRouter.routes()).use(adminRouter.allowedMethods());
//app.use(users.routes()).use(users.allowedMethods());
//app.use(yearlySetup.routes()).use(yearlySetup.allowedMethods());
//app.use(schoolActivity.routes()).use(schoolActivity.allowedMethods());
(0, users_1.setupUsersRoutes)(router);
(0, yearlySetup_1.setupYearlySetupRoutes)(router);
(0, schoolActivity_1.setupSchoolActivityRoutes)(router);
(0, admin_1.setupAdminRoutes)(router);
(0, class_1.setupClassRoutes)(router);
(0, replySlip_1.setupReplySlipRoutes)(router);
(0, dataAnalysis_1.setupDataAnalysisRoutes)(router);
(0, studentSetting_1.setupStudentSettingRoutes)(router);
(0, interestClass_1.setupInterestClassRoutes)(router);
(0, yearRank_1.setupYearRankRoutes)(router);
(0, notification_1.setupNotificationRoutes)(router);
(0, chat_1.setupChatRoutes)(router);
(0, pushNotification_1.setupPushNotificationRoutes)(router);
(0, teacherFunction_1.setupTeacherFunctionRoutes)(router);
app.use(router.routes()).use(router.allowedMethods());
app.use((0, koa_json_1.default)());
app.use((0, koa_logger_1.default)({ transporter: myTransporter }));
app.use((0, koa_bodyparser_1.default)());
app.listen(10888, () => {
    console.log("Server started on localhost:10888");
});
function myTransporter(str, args) {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' });
    console.log("[" + timestamp + "]", str);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrQkFBa0I7QUFDbEIsOENBQXdDO0FBQ3hDLDREQUFpRDtBQUNqRCw0REFBZ0M7QUFDaEMsd0RBQTRCO0FBQzVCLG9FQUF3QztBQUN4Qyx3REFBNEI7QUFDNUIsMkNBQW1EO0FBQ25ELDJDQUFtRDtBQUNuRCwyQ0FBbUQ7QUFDbkQsdURBQStEO0FBQy9ELDZEQUFxRTtBQUNyRSxtREFBMkQ7QUFDM0QseURBQWlFO0FBQ2pFLDZEQUFxRTtBQUNyRSwyREFBbUU7QUFDbkUsaURBQXlEO0FBQ3pELHlEQUFpRTtBQUNqRSx5Q0FBZ0Q7QUFDaEQsaUVBQXdFO0FBQ3hFLCtEQUFzRTtBQUt0RSxnREFBZ0Q7QUFDaEQsTUFBTSxHQUFHLEdBQVEsSUFBSSxhQUFHLEVBQUUsQ0FBQztBQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFNLEVBQStCLENBQUM7QUFDekQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGtCQUFJLEdBQUUsQ0FBQyxDQUFDO0FBR2hCLDBEQUEwRDtBQUMxRCxtRUFBbUU7QUFDbkUsc0RBQXNEO0FBQ3RELGtFQUFrRTtBQUNsRSx3RUFBd0U7QUFDeEUsSUFBQSx3QkFBZ0IsRUFBQyxNQUFNLENBQUMsQ0FBQztBQUN6QixJQUFBLG9DQUFzQixFQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLElBQUEsMENBQXlCLEVBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsSUFBQSx3QkFBZ0IsRUFBQyxNQUFNLENBQUMsQ0FBQztBQUN6QixJQUFBLHdCQUFnQixFQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pCLElBQUEsZ0NBQW9CLEVBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBQSxzQ0FBdUIsRUFBQyxNQUFNLENBQUMsQ0FBQztBQUNoQyxJQUFBLDBDQUF5QixFQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLElBQUEsd0NBQXdCLEVBQUMsTUFBTSxDQUFDLENBQUM7QUFDakMsSUFBQSw4QkFBbUIsRUFBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixJQUFBLHNDQUF1QixFQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLElBQUEsc0JBQWUsRUFBQyxNQUFNLENBQUMsQ0FBQztBQUN4QixJQUFBLDhDQUEyQixFQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLElBQUEsNENBQTBCLEVBQUMsTUFBTSxDQUFDLENBQUM7QUFFbkMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFDdEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGtCQUFJLEdBQUUsQ0FBQyxDQUFDO0FBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxvQkFBTSxFQUFDLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRCxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsd0JBQVUsR0FBRSxDQUFDLENBQUM7QUFFdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUNuRCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsYUFBYSxDQUFDLEdBQVcsRUFBRSxJQUFXO0lBQzdDLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDckYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUMsU0FBUyxHQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0QyxDQUFDIn0=