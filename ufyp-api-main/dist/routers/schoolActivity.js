"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSchoolActivityRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const schoolActivity_1 = require("../controllers/schoolActivity");
const multer_1 = __importDefault(require("@koa/multer"));
const setupSchoolActivityRoutes = (router) => {
    const schoolActivityrouter = new koa_router_1.default({ prefix: "/api/v1/schoolActivity" });
    const uploadImage = (0, multer_1.default)({
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                callback(new Error("Please upload an image"), false);
            }
            callback(null, true);
        },
        dest: "temp",
    });
    schoolActivityrouter.get("/getAcademicYearDocIds", schoolActivity_1.getAcademicYearDocIds);
    schoolActivityrouter.post("/getPhotoDocIds", (0, koa_bodyparser_1.default)(), schoolActivity_1.getPhotoDocIds);
    schoolActivityrouter.post("/getPhotoInActivity", (0, koa_bodyparser_1.default)(), schoolActivity_1.getPhotoInActivity);
    schoolActivityrouter.post("/uploadPhoto", uploadImage.any(), schoolActivity_1.uploadPhoto);
    schoolActivityrouter.put("/editUploadPhoto", uploadImage.any(), schoolActivity_1.editUploadImage);
    schoolActivityrouter.post("/getPhotogetPhotoActivityDocIds", (0, koa_bodyparser_1.default)(), schoolActivity_1.getPhotogetPhotoActivityDocIds);
    schoolActivityrouter.post("/addActivity", (0, koa_bodyparser_1.default)(), schoolActivity_1.addActivity);
    schoolActivityrouter.delete("/deletePhoto", (0, koa_bodyparser_1.default)(), schoolActivity_1.deleteImage);
    router.use(schoolActivityrouter.routes());
};
exports.setupSchoolActivityRoutes = setupSchoolActivityRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nob29sQWN0aXZpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVycy9zY2hvb2xBY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBbUQ7QUFDbkQsb0VBQXdDO0FBQ3hDLGtFQVN1QztBQUN2Qyx5REFBaUM7QUFJMUIsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLE1BQTJDLEVBQVEsRUFBRTtJQUM3RixNQUFNLG9CQUFvQixHQUFHLElBQUksb0JBQU0sQ0FBOEIsRUFBQyxNQUFNLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDO0lBRzFHLE1BQU0sV0FBVyxHQUFHLElBQUEsZ0JBQU0sRUFBQztRQUN6QixVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO2dCQUNqRCxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN0RDtZQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksRUFBRSxNQUFNO0tBQ2IsQ0FBQyxDQUFDO0lBR0gsb0JBQW9CLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFDLHNDQUFxQixDQUFDLENBQUM7SUFFekUsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLCtCQUFjLENBQUMsQ0FBQztJQUUzRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsbUNBQWtCLENBQUMsQ0FBQztJQUVuRixvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSw0QkFBVyxDQUFDLENBQUM7SUFFMUUsb0JBQW9CLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxnQ0FBZSxDQUFDLENBQUM7SUFFakYsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLCtDQUE4QixDQUFDLENBQUM7SUFFM0csb0JBQW9CLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxJQUFBLHdCQUFVLEdBQUUsRUFBQyw0QkFBVyxDQUFDLENBQUM7SUFFbkUsb0JBQW9CLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBQyxJQUFBLHdCQUFVLEdBQUUsRUFBQyw0QkFBVyxDQUFDLENBQUM7SUFHckUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQztBQWpDVyxRQUFBLHlCQUF5Qiw2QkFpQ3BDIn0=