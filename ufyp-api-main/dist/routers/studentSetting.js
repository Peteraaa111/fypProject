"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupStudentSettingRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const studentSetting_1 = require("../controllers/studentSetting");
const multer_1 = __importDefault(require("@koa/multer"));
const setupStudentSettingRoutes = (router) => {
    const studentSettingRouter = new koa_router_1.default({ prefix: "/api/v1/studentSetting" });
    const uploadImage = (0, multer_1.default)({
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                callback(new Error("Please upload an image"), false);
            }
            callback(null, true);
        },
        dest: "temp",
    });
    studentSettingRouter.post("/getAllStudentReward", (0, koa_bodyparser_1.default)(), studentSetting_1.getAllStudentReward);
    studentSettingRouter.post("/getStudentRewardDetail", (0, koa_bodyparser_1.default)(), studentSetting_1.getStudentRewardDetail);
    studentSettingRouter.post("/getAllClassAndStudent", (0, koa_bodyparser_1.default)(), studentSetting_1.getAllClassAndStudent);
    studentSettingRouter.post("/applyInterestClassToStudent", (0, koa_bodyparser_1.default)(), studentSetting_1.applyInterestClassToStudent);
    studentSettingRouter.post("/applyRewardToStudent", uploadImage.any(), studentSetting_1.applyRewardToStudent);
    studentSettingRouter.put("/editStudentReward", uploadImage.any(), studentSetting_1.editStudentReward);
    studentSettingRouter.put("/editInterestClassToStudent", (0, koa_bodyparser_1.default)(), studentSetting_1.editInterestClassToStudent);
    router.use(studentSettingRouter.routes());
};
exports.setupStudentSettingRoutes = setupStudentSettingRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudFNldHRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVycy9zdHVkZW50U2V0dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBbUQ7QUFDbkQsb0VBQXdDO0FBRXhDLGtFQVF1QztBQUN2Qyx5REFBaUM7QUFFMUIsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLE1BQTJDLEVBQVEsRUFBRTtJQUU3RixNQUFNLG9CQUFvQixHQUFHLElBQUksb0JBQU0sQ0FBOEIsRUFBQyxNQUFNLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDO0lBRzFHLE1BQU0sV0FBVyxHQUFHLElBQUEsZ0JBQU0sRUFBQztRQUN6QixVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO2dCQUNqRCxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN0RDtZQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksRUFBRSxNQUFNO0tBQ2IsQ0FBQyxDQUFDO0lBR0gsb0JBQW9CLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLG9DQUFtQixDQUFDLENBQUM7SUFDckYsb0JBQW9CLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLHVDQUFzQixDQUFDLENBQUM7SUFDM0Ysb0JBQW9CLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLHNDQUFxQixDQUFDLENBQUM7SUFDekYsb0JBQW9CLENBQUMsSUFBSSxDQUFDLDhCQUE4QixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLDRDQUEyQixDQUFDLENBQUM7SUFDckcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxxQ0FBb0IsQ0FBQyxDQUFDO0lBQzVGLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFLEVBQUUsa0NBQWlCLENBQUMsQ0FBQztJQUNyRixvQkFBb0IsQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsMkNBQTBCLENBQUMsQ0FBQztJQUNsRyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBeEJXLFFBQUEseUJBQXlCLDZCQXdCcEMifQ==