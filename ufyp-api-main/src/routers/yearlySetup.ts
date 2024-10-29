import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
  createPhotoCollection,
  createYearlyAttendance,
  deleteAttendanceCollection,
} from "../controllers/yearlySetup";

export const setupYearlySetupRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const yearlyRouter = new Router<DefaultState, RouterContext>({ prefix: "/api/v1/yearlySetup" });

  yearlyRouter.post("/createPhotoCollection", bodyParser(), createPhotoCollection);

  yearlyRouter.post("/createYearlyAttendance", bodyParser(), createYearlyAttendance);

  yearlyRouter.delete("/deleteAttendanceCollection", bodyParser(), deleteAttendanceCollection);

  router.use(yearlyRouter.routes());
}; 