"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTeacherFunctionRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const teacherFunction_1 = require("../controllers/teacherFunction");
const multer_1 = __importDefault(require("@koa/multer"));
const setupTeacherFunctionRoutes = (router) => {
    const teacherFunctionRouter = new koa_router_1.default({ prefix: "/api/v1/teacherFunction" });
    const uploadImage = (0, multer_1.default)({
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                callback(new Error("Please upload an image"), false);
            }
            callback(null, true);
        },
        dest: "temp",
    });
    teacherFunctionRouter.post("/uploadImageForHomework", uploadImage.any(), teacherFunction_1.uploadImageForHomework);
    teacherFunctionRouter.post("/getClassmateData", (0, koa_bodyparser_1.default)(), teacherFunction_1.getClassmateData);
    teacherFunctionRouter.post("/getClassAttendance", (0, koa_bodyparser_1.default)(), teacherFunction_1.getClassAttendance);
    teacherFunctionRouter.post("/submitAttendanceList", (0, koa_bodyparser_1.default)(), teacherFunction_1.submitAttendanceList);
    teacherFunctionRouter.post("/createHomeworkForClass", (0, koa_bodyparser_1.default)(), teacherFunction_1.createHomeworkForClass);
    teacherFunctionRouter.post("/checkDateHomeworkExist", (0, koa_bodyparser_1.default)(), teacherFunction_1.checkDateHomeworkExist);
    teacherFunctionRouter.post("/editHomeworkForClass", (0, koa_bodyparser_1.default)(), teacherFunction_1.editHomeworkForClass);
    teacherFunctionRouter.post("/getTheHomeworkData", (0, koa_bodyparser_1.default)(), teacherFunction_1.getTheHomeworkData);
    teacherFunctionRouter.post("/submitClassSeatingTable", (0, koa_bodyparser_1.default)(), teacherFunction_1.submitClassSeatingTable);
    teacherFunctionRouter.post("/getClassSeatingTable", (0, koa_bodyparser_1.default)(), teacherFunction_1.getClassSeatingTable);
    teacherFunctionRouter.post("/getStudentFirstHalfGrade", (0, koa_bodyparser_1.default)(), teacherFunction_1.getStudentFirstHalfGrade);
    teacherFunctionRouter.post("/getStudentSecondHalfGrade", (0, koa_bodyparser_1.default)(), teacherFunction_1.getStudentSecondHalfGrade);
    // Routers
    router.use(teacherFunctionRouter.routes());
};
exports.setupTeacherFunctionRoutes = setupTeacherFunctionRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVhY2hlckZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcnMvdGVhY2hlckZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUFtRDtBQUNuRCxvRUFBd0M7QUFFeEMsb0VBYXdDO0FBQ3hDLHlEQUFpQztBQUUxQixNQUFNLDBCQUEwQixHQUFHLENBQUMsTUFBMkMsRUFBUSxFQUFFO0lBRTlGLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxvQkFBTSxDQUE4QixFQUFDLE1BQU0sRUFBRSx5QkFBeUIsRUFBRSxDQUFDLENBQUM7SUFFNUcsTUFBTSxXQUFXLEdBQUcsSUFBQSxnQkFBTSxFQUFDO1FBQ3pCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVE7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7Z0JBQ2pELFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3REO1lBQ0QsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQ0QsSUFBSSxFQUFFLE1BQU07S0FDYixDQUFDLENBQUM7SUFFSCxxQkFBcUIsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRSxFQUFFLHdDQUFzQixDQUFDLENBQUM7SUFFakcscUJBQXFCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLGtDQUFnQixDQUFDLENBQUM7SUFDOUUscUJBQXFCLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLG9DQUFrQixDQUFDLENBQUM7SUFDbEYscUJBQXFCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLHNDQUFvQixDQUFDLENBQUM7SUFFdEYscUJBQXFCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLHdDQUFzQixDQUFDLENBQUM7SUFFMUYscUJBQXFCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLHdDQUFzQixDQUFDLENBQUM7SUFDMUYscUJBQXFCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLHNDQUFvQixDQUFDLENBQUM7SUFFdEYscUJBQXFCLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLG9DQUFrQixDQUFDLENBQUM7SUFHbEYscUJBQXFCLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLHlDQUF1QixDQUFDLENBQUM7SUFDNUYscUJBQXFCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLHNDQUFvQixDQUFDLENBQUM7SUFFdEYscUJBQXFCLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLDBDQUF3QixDQUFDLENBQUM7SUFDOUYscUJBQXFCLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLDJDQUF5QixDQUFDLENBQUM7SUFDaEcsVUFBVTtJQUVWLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUM7QUFwQ1csUUFBQSwwQkFBMEIsOEJBb0NyQyJ9