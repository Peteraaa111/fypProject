import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
    generateRank,
    getStudentRankByYear,
    distributeNextYearClass
} from "../controllers/yearRank";

export const setupYearRankRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const yearRankRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/yearlyRank" });

  // Routers
  yearRankRouter.post("/getStudentRankByYear", bodyParser(),getStudentRankByYear);

  //yearRankRouter.post("/resetPassword", bodyParser(), changePasswordForUser); 
  yearRankRouter.post("/generateRank",bodyParser(),generateRank);

  yearRankRouter.post("/distributeNextYearClass",bodyParser(),distributeNextYearClass);


  router.use(yearRankRouter.routes());
};