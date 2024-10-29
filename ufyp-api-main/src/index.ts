// Import packages
import Koa, { DefaultState } from "koa";
import Router, {RouterContext} from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import cors from 'koa-cors';
import { setupUsersRoutes } from "./routers/users";
import { setupClassRoutes } from "./routers/class";
import { setupAdminRoutes } from "./routers/admin";
import { setupYearlySetupRoutes } from "./routers/yearlySetup";
import { setupSchoolActivityRoutes } from "./routers/schoolActivity";
import { setupReplySlipRoutes } from "./routers/replySlip";
import { setupDataAnalysisRoutes } from "./routers/dataAnalysis";
import { setupStudentSettingRoutes } from "./routers/studentSetting";
import { setupInterestClassRoutes } from "./routers/interestClass";
import { setupYearRankRoutes } from "./routers/yearRank";
import { setupNotificationRoutes } from "./routers/notification";
import { setupChatRoutes} from "./routers/chat";
import { setupPushNotificationRoutes} from "./routers/pushNotification";
import { setupTeacherFunctionRoutes} from "./routers/teacherFunction";

import https from "https";
import fs from "fs";

// Create Koa app instance and a router instance
const app: Koa = new Koa();
const router = new Router<DefaultState, RouterContext>();
app.use(cors());


//app.use(classes.routes()).use(classes.allowedMethods());
// app.use(adminRouter.routes()).use(adminRouter.allowedMethods());
//app.use(users.routes()).use(users.allowedMethods());
//app.use(yearlySetup.routes()).use(yearlySetup.allowedMethods());
//app.use(schoolActivity.routes()).use(schoolActivity.allowedMethods());
setupUsersRoutes(router);
setupYearlySetupRoutes(router);
setupSchoolActivityRoutes(router);
setupAdminRoutes(router);
setupClassRoutes(router);
setupReplySlipRoutes(router);
setupDataAnalysisRoutes(router);
setupStudentSettingRoutes(router);
setupInterestClassRoutes(router);
setupYearRankRoutes(router);
setupNotificationRoutes(router);
setupChatRoutes(router);
setupPushNotificationRoutes(router);
setupTeacherFunctionRoutes(router);

app.use(router.routes()).use(router.allowedMethods());
app.use(json());
app.use(logger({ transporter: myTransporter }));
app.use(bodyParser());

app.listen(10888, () => {
  console.log("Server started on localhost:10888");
});

function myTransporter(str: string, args: any[]) {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' });
  console.log("["+timestamp+"]", str);
}
