import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {
  getUnassignedStudentsAndClass,
  getAcademicYearWithClasses,
  getClassmateByAcademicYearAndClass,
  getClassHomework,
  getAllDocumentsInCollection,
  createClass,
  addStudentToClass,
  addClassExamGrade,
  addClassToGrade,
  redistributeClassNumber,
  editHomework,
  editExam,
  removeStudentFromClass,
  submitAttendance,
  getAttendanceDateInfo,
  getWholeYearClassGrade,
  uploadHomeworkImage,
  getAllClassTeachers,
  getAllUnAssignTeachers,
  addTeacherToClass,
  deleteTeacherInClass,
  deleteHomeworkInClass,
  addClassTimeTable,
  getClassTimeTable,
} from "../controllers/class";
import {DefaultState} from "koa";
import multer from "@koa/multer";

export const setupClassRoutes = (router: Router<DefaultState, RouterContext>): void => {
  const classRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/class" });


  const uploadImage = multer({
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callback(new Error("Please upload an image"), false);
      }
      callback(null, true);
    },
    dest: "temp",
  });


  classRouter.get("/getUnassignedStudentsAndClass/", getUnassignedStudentsAndClass);
  
  classRouter.get("/getAcademicYearWithClasses", getAcademicYearWithClasses);

  classRouter.get("/getClassmateByAcademicYearAndClass/:year/:classID", getClassmateByAcademicYearAndClass);


  classRouter.get("/getAllClassHeadTeacher/:year/", getAllClassTeachers);

  classRouter.get("/getClassHomework/:classID/:year", getClassHomework);

  classRouter.get("/getAllDocumentsInCollection/:year/:termDate/:classID", getAllDocumentsInCollection);

  classRouter.post("/createClass", bodyParser(), createClass);

  classRouter.post("/getAllUnAssignTeachers", bodyParser(), getAllUnAssignTeachers);
  
  classRouter.post("/addTeacherToClass", bodyParser(), addTeacherToClass);


  classRouter.post("/getWholeYearClassGrade", bodyParser(), getWholeYearClassGrade);

  classRouter.post("/addStudentToClass", bodyParser(), addStudentToClass);

  classRouter.post("/addClassExamGrade", bodyParser(), addClassExamGrade);

  classRouter.post("/addClassToGrade", bodyParser(), addClassToGrade);

  classRouter.post("/submitAttendance", bodyParser(), submitAttendance);

  classRouter.post("/getAttendanceDateInfo", bodyParser(), getAttendanceDateInfo);

  classRouter.post("/uploadHomeworkImage", uploadImage.any(), uploadHomeworkImage);

  classRouter.post("/addClassTimeTable", bodyParser(), addClassTimeTable);
  classRouter.post("/getClassTimeTable", bodyParser(), getClassTimeTable);

  
  classRouter.put("/redistributeClassNumber", bodyParser(), redistributeClassNumber);

  classRouter.put("/:classID/:date/editHomework", bodyParser(), editHomework);

  classRouter.put("/editExam", bodyParser(), editExam);


  classRouter.delete('/removeTeacherFromClass/',bodyParser(), deleteTeacherInClass);

  classRouter.delete('/removeStudentFromClass/:classID/:studentID/:CurrentUserUid/:academicYearValue',bodyParser(), removeStudentFromClass)


  classRouter.delete('/deleteHomeworkInClass/',bodyParser(), deleteHomeworkInClass);
  

  
  router.use(classRouter.routes());
};