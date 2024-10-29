import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
    getAllClassAndStudentInterest,
    getAllInterestClassGroup,
    createInterestClassDocument,
    editInterestClassDocument,
    editInterestClassStatus,
    getAllStudentInterestClass,
    
} from "../controllers/interestClass";

export const setupInterestClassRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const interestClassRouter = new Router<DefaultState, RouterContext>({ prefix: "/api/v1/interestClass" });


  interestClassRouter.post("/getAllInterestClassGroup",bodyParser(),getAllInterestClassGroup);


  interestClassRouter.post("/getAllClassAndStudentInterest", bodyParser(), getAllClassAndStudentInterest);

  interestClassRouter.post("/getAllStudentInterestClass", bodyParser(), getAllStudentInterestClass);
  
  interestClassRouter.post("/addInterestClass", bodyParser(), createInterestClassDocument);

  interestClassRouter.put("/editInterestClass", bodyParser(), editInterestClassDocument);

  interestClassRouter.put("/editInterestClassStatus", bodyParser(), editInterestClassStatus);


  router.use(interestClassRouter.routes());
}; 