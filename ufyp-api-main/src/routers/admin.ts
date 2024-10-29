import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
  getAllUser,
  changePasswordForUser,
  getAllSystemProblem,
  getAllLeaveForm,
  approvalLeaveForm,
  getAllInterestClassRegistration,
  approvalLInterestClassegistration,
} from "../controllers/admin";

export const setupAdminRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const adminRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/admin" });

  // Routers
  adminRouter.get("/getAllUser", getAllUser);

  adminRouter.post("/resetPassword", bodyParser(), changePasswordForUser); 

  adminRouter.put("/approvalLeaveForm", bodyParser(), approvalLeaveForm); 

  adminRouter.get("/getAllSystemProblem", getAllSystemProblem);

  adminRouter.get("/getAllLeaveForm", getAllLeaveForm);

  adminRouter.get("/getAllInterestClassRegistration", getAllInterestClassRegistration);
  adminRouter.put("/approvalInterestClassForm", bodyParser(), approvalLInterestClassegistration); 


  router.use(adminRouter.routes());
};