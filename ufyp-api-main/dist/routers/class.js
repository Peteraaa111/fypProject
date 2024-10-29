"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupClassRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const class_1 = require("../controllers/class");
const multer_1 = __importDefault(require("@koa/multer"));
const setupClassRoutes = (router) => {
    const classRouter = new koa_router_1.default({ prefix: "/api/v1/class" });
    const uploadImage = (0, multer_1.default)({
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                callback(new Error("Please upload an image"), false);
            }
            callback(null, true);
        },
        dest: "temp",
    });
    classRouter.get("/getUnassignedStudentsAndClass/", class_1.getUnassignedStudentsAndClass);
    classRouter.get("/getAcademicYearWithClasses", class_1.getAcademicYearWithClasses);
    classRouter.get("/getClassmateByAcademicYearAndClass/:year/:classID", class_1.getClassmateByAcademicYearAndClass);
    classRouter.get("/getAllClassHeadTeacher/:year/", class_1.getAllClassTeachers);
    classRouter.get("/getClassHomework/:classID/:year", class_1.getClassHomework);
    classRouter.get("/getAllDocumentsInCollection/:year/:termDate/:classID", class_1.getAllDocumentsInCollection);
    classRouter.post("/createClass", (0, koa_bodyparser_1.default)(), class_1.createClass);
    classRouter.post("/getAllUnAssignTeachers", (0, koa_bodyparser_1.default)(), class_1.getAllUnAssignTeachers);
    classRouter.post("/addTeacherToClass", (0, koa_bodyparser_1.default)(), class_1.addTeacherToClass);
    classRouter.post("/getWholeYearClassGrade", (0, koa_bodyparser_1.default)(), class_1.getWholeYearClassGrade);
    classRouter.post("/addStudentToClass", (0, koa_bodyparser_1.default)(), class_1.addStudentToClass);
    classRouter.post("/addClassExamGrade", (0, koa_bodyparser_1.default)(), class_1.addClassExamGrade);
    classRouter.post("/addClassToGrade", (0, koa_bodyparser_1.default)(), class_1.addClassToGrade);
    classRouter.post("/submitAttendance", (0, koa_bodyparser_1.default)(), class_1.submitAttendance);
    classRouter.post("/getAttendanceDateInfo", (0, koa_bodyparser_1.default)(), class_1.getAttendanceDateInfo);
    classRouter.post("/uploadHomeworkImage", uploadImage.any(), class_1.uploadHomeworkImage);
    classRouter.post("/addClassTimeTable", (0, koa_bodyparser_1.default)(), class_1.addClassTimeTable);
    classRouter.post("/getClassTimeTable", (0, koa_bodyparser_1.default)(), class_1.getClassTimeTable);
    classRouter.put("/redistributeClassNumber", (0, koa_bodyparser_1.default)(), class_1.redistributeClassNumber);
    classRouter.put("/:classID/:date/editHomework", (0, koa_bodyparser_1.default)(), class_1.editHomework);
    classRouter.put("/editExam", (0, koa_bodyparser_1.default)(), class_1.editExam);
    classRouter.delete('/removeTeacherFromClass/', (0, koa_bodyparser_1.default)(), class_1.deleteTeacherInClass);
    classRouter.delete('/removeStudentFromClass/:classID/:studentID/:CurrentUserUid/:academicYearValue', (0, koa_bodyparser_1.default)(), class_1.removeStudentFromClass);
    classRouter.delete('/deleteHomeworkInClass/', (0, koa_bodyparser_1.default)(), class_1.deleteHomeworkInClass);
    router.use(classRouter.routes());
};
exports.setupClassRoutes = setupClassRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVycy9jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBbUQ7QUFDbkQsb0VBQXdDO0FBQ3hDLGdEQXlCOEI7QUFFOUIseURBQWlDO0FBRTFCLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxNQUEyQyxFQUFRLEVBQUU7SUFDcEYsTUFBTSxXQUFXLEdBQUcsSUFBSSxvQkFBTSxDQUE4QixFQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDO0lBR3hGLE1BQU0sV0FBVyxHQUFHLElBQUEsZ0JBQU0sRUFBQztRQUN6QixVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO2dCQUNqRCxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN0RDtZQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksRUFBRSxNQUFNO0tBQ2IsQ0FBQyxDQUFDO0lBR0gsV0FBVyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxxQ0FBNkIsQ0FBQyxDQUFDO0lBRWxGLFdBQVcsQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsa0NBQTBCLENBQUMsQ0FBQztJQUUzRSxXQUFXLENBQUMsR0FBRyxDQUFDLG9EQUFvRCxFQUFFLDBDQUFrQyxDQUFDLENBQUM7SUFHMUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRSwyQkFBbUIsQ0FBQyxDQUFDO0lBRXZFLFdBQVcsQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEVBQUUsd0JBQWdCLENBQUMsQ0FBQztJQUV0RSxXQUFXLENBQUMsR0FBRyxDQUFDLHVEQUF1RCxFQUFFLG1DQUEyQixDQUFDLENBQUM7SUFFdEcsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsbUJBQVcsQ0FBQyxDQUFDO0lBRTVELFdBQVcsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsOEJBQXNCLENBQUMsQ0FBQztJQUVsRixXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLHlCQUFpQixDQUFDLENBQUM7SUFHeEUsV0FBVyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSw4QkFBc0IsQ0FBQyxDQUFDO0lBRWxGLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUseUJBQWlCLENBQUMsQ0FBQztJQUV4RSxXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLHlCQUFpQixDQUFDLENBQUM7SUFFeEUsV0FBVyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSx1QkFBZSxDQUFDLENBQUM7SUFFcEUsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSx3QkFBZ0IsQ0FBQyxDQUFDO0lBRXRFLFdBQVcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsNkJBQXFCLENBQUMsQ0FBQztJQUVoRixXQUFXLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSwyQkFBbUIsQ0FBQyxDQUFDO0lBRWpGLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUseUJBQWlCLENBQUMsQ0FBQztJQUN4RSxXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLHlCQUFpQixDQUFDLENBQUM7SUFHeEUsV0FBVyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSwrQkFBdUIsQ0FBQyxDQUFDO0lBRW5GLFdBQVcsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsb0JBQVksQ0FBQyxDQUFDO0lBRTVFLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLGdCQUFRLENBQUMsQ0FBQztJQUdyRCxXQUFXLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFFLDRCQUFvQixDQUFDLENBQUM7SUFFbEYsV0FBVyxDQUFDLE1BQU0sQ0FBQyxnRkFBZ0YsRUFBQyxJQUFBLHdCQUFVLEdBQUUsRUFBRSw4QkFBc0IsQ0FBQyxDQUFBO0lBR3pJLFdBQVcsQ0FBQyxNQUFNLENBQUMseUJBQXlCLEVBQUMsSUFBQSx3QkFBVSxHQUFFLEVBQUUsNkJBQXFCLENBQUMsQ0FBQztJQUlsRixNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQXRFVyxRQUFBLGdCQUFnQixvQkFzRTNCIn0=