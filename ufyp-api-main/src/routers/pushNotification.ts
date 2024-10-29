import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
  addNotification,
  pushNotification,
  getAllNotification,
  editNotification,
} from "../controllers/pushNotification";

export const setupPushNotificationRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const pushNotificationRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/pushNotification" });

  // Routers

  pushNotificationRouter.post("/addNotification", bodyParser(), addNotification);

  
  pushNotificationRouter.post("/pushNotification", bodyParser(), pushNotification);

  pushNotificationRouter.get("/getAllNotification", getAllNotification);

  pushNotificationRouter.put("/editNotification", bodyParser(), editNotification);

  router.use(pushNotificationRouter.routes());
};