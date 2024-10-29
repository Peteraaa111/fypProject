import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
  getAllClassAndStudent,
  applyRewardToStudent,
  getStudentRewardDetail,
  getAllStudentReward,
  editStudentReward,
  applyInterestClassToStudent,
  editInterestClassToStudent
} from "../controllers/studentSetting";
import multer from "@koa/multer";

export const setupStudentSettingRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const studentSettingRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/studentSetting" });

  
  const uploadImage = multer({
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callback(new Error("Please upload an image"), false);
      }
      callback(null, true);
    },
    dest: "temp",
  });


  studentSettingRouter.post("/getAllStudentReward", bodyParser(), getAllStudentReward);
  studentSettingRouter.post("/getStudentRewardDetail", bodyParser(), getStudentRewardDetail);
  studentSettingRouter.post("/getAllClassAndStudent", bodyParser(), getAllClassAndStudent);
  studentSettingRouter.post("/applyInterestClassToStudent", bodyParser(), applyInterestClassToStudent);
  studentSettingRouter.post("/applyRewardToStudent", uploadImage.any(), applyRewardToStudent);
  studentSettingRouter.put("/editStudentReward", uploadImage.any(), editStudentReward);
  studentSettingRouter.put("/editInterestClassToStudent", bodyParser(), editInterestClassToStudent);
  router.use(studentSettingRouter.routes());
};