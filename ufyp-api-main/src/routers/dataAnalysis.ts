import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
    searchAttendance,
    searchExamRecord
} from "../controllers/dataAnalysis";

export const setupDataAnalysisRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const dataAnalysisRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/dataAnalysis" });


  dataAnalysisRouter.post("/searchAttendance", bodyParser(), searchAttendance);

  dataAnalysisRouter.post("/searchExamRecord", bodyParser(), searchExamRecord);


  router.use(dataAnalysisRouter.routes());
};