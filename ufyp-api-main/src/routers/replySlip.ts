import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
  getReplySlip,
  addReplySlip,
  deleteReplySlip,
  editReplySlip,
  distributionReplySlip,
  //getStudentData,
  getAllClassAndStudent,
  getNumStudentsWithReplySlip,
  getAllClass,
} from "../controllers/replySlip";

export const setupReplySlipRoutes = (router: Router<DefaultState, RouterContext>): void => {

    const replySlipRouter = new Router<DefaultState, RouterContext>({ prefix: "/api/v1/replySlip" });
      // Routers

      //replySlipRouter.post("/getStudentData", bodyParser(), getStudentData);
      replySlipRouter.post("/getAllClass", bodyParser(), getAllClass);

      replySlipRouter.post("/getAllClassAndStudent", bodyParser(), getAllClassAndStudent);

      replySlipRouter.post('/getNumStudentsWithReplySlip',bodyParser(),getNumStudentsWithReplySlip);

      replySlipRouter.post("/getReplySlip", bodyParser(), getReplySlip);

      replySlipRouter.post("/addReplySlip", bodyParser(), addReplySlip);

      replySlipRouter.post("/distributionReplySlip", bodyParser(), distributionReplySlip);
  
      replySlipRouter.put("/editReplySlip", bodyParser(), editReplySlip);

      replySlipRouter.delete("/removeReplySlip",  bodyParser(), deleteReplySlip)

      router.use(replySlipRouter.routes()); 
};

    