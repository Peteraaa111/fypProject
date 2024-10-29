import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
  getClassAttendance,
  getClassmateData,
  submitAttendanceList,
  uploadImageForHomework,
  createHomeworkForClass,
  checkDateHomeworkExist,
  getTheHomeworkData,
  editHomeworkForClass,
  getStudentFirstHalfGrade,
  getStudentSecondHalfGrade,
  submitClassSeatingTable,
  getClassSeatingTable,
} from "../controllers/teacherFunction";
import multer from "@koa/multer";

export const setupTeacherFunctionRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const teacherFunctionRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/teacherFunction" });

  const uploadImage = multer({
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callback(new Error("Please upload an image"), false);
      }
      callback(null, true);
    },
    dest: "temp",
  });

  teacherFunctionRouter.post("/uploadImageForHomework", uploadImage.any(), uploadImageForHomework); 

  teacherFunctionRouter.post("/getClassmateData",bodyParser(),getClassmateData);
  teacherFunctionRouter.post("/getClassAttendance",bodyParser(),getClassAttendance);
  teacherFunctionRouter.post("/submitAttendanceList",bodyParser(),submitAttendanceList);

  teacherFunctionRouter.post("/createHomeworkForClass",bodyParser(),createHomeworkForClass);

  teacherFunctionRouter.post("/checkDateHomeworkExist",bodyParser(),checkDateHomeworkExist);
  teacherFunctionRouter.post("/editHomeworkForClass",bodyParser(),editHomeworkForClass);

  teacherFunctionRouter.post("/getTheHomeworkData",bodyParser(),getTheHomeworkData);


  teacherFunctionRouter.post("/submitClassSeatingTable",bodyParser(),submitClassSeatingTable);
  teacherFunctionRouter.post("/getClassSeatingTable",bodyParser(),getClassSeatingTable);

  teacherFunctionRouter.post("/getStudentFirstHalfGrade",bodyParser(),getStudentFirstHalfGrade);
  teacherFunctionRouter.post("/getStudentSecondHalfGrade",bodyParser(),getStudentSecondHalfGrade);
  // Routers

  router.use(teacherFunctionRouter.routes());
};