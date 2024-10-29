import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
    sendNotification,
} from "../controllers/notification";

export const setupNotificationRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const notificationRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/notification" });
  
  notificationRouter.post("/sendNotification", bodyParser(), sendNotification); 

  router.use(notificationRouter.routes());
};