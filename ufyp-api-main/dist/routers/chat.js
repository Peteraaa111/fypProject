"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const chat_1 = require("../controllers/chat");
const multer_1 = __importDefault(require("@koa/multer"));
const setupChatRoutes = (router) => {
    const chatRouter = new koa_router_1.default({ prefix: "/api/v1/chat" });
    const uploadVideo = (0, multer_1.default)({
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(mp4|avi|mov|flv|wmv)$/)) {
                callback(new Error("Please upload a video file"), false);
            }
            callback(null, true);
        },
        dest: "temp",
    });
    const uploadAudio = (0, multer_1.default)({
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(mp3|wav|ogg|aac)$/)) {
                callback(new Error("Please upload an audio file"), false);
            }
            callback(null, true);
        },
        dest: "temp",
    });
    const uploadImage = (0, multer_1.default)({
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                callback(new Error("Please upload an image"), false);
            }
            callback(null, true);
        },
        dest: "temp",
    });
    chatRouter.post("/sendFileInChatRoom", uploadImage.any(), chat_1.sendFileInChatRoom);
    chatRouter.post("/sendAudioFileInChatRoom", uploadAudio.any(), chat_1.sendAudioFileInChatRoom);
    chatRouter.post("/sendVideoFileInChatRoom", uploadVideo.any(), chat_1.sendVideoFileInChatRoom);
    chatRouter.post('/getGroupChatList', (0, koa_bodyparser_1.default)(), chat_1.getGroupChatList);
    chatRouter.post('/findSenderName', (0, koa_bodyparser_1.default)(), chat_1.findSenderName);
    chatRouter.post("/getChatListByID", (0, koa_bodyparser_1.default)(), chat_1.getChatListByID);
    chatRouter.post("/getTeacherChatListByID", (0, koa_bodyparser_1.default)(), chat_1.getTeacherChatListByID);
    chatRouter.post("/sendMessageInChatRoom", (0, koa_bodyparser_1.default)(), chat_1.sendMessageInChatRoom);
    chatRouter.post("/getMessageInChatRoom", (0, koa_bodyparser_1.default)(), chat_1.getMessageInChatRoom);
    router.use(chatRouter.routes());
};
exports.setupChatRoutes = setupChatRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXJzL2NoYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQW1EO0FBQ25ELG9FQUF3QztBQUV4Qyw4Q0FXNkI7QUFDN0IseURBQWlDO0FBRTFCLE1BQU0sZUFBZSxHQUFHLENBQUMsTUFBMkMsRUFBUSxFQUFFO0lBRW5GLE1BQU0sVUFBVSxHQUFHLElBQUksb0JBQU0sQ0FBOEIsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUV0RixNQUFNLFdBQVcsR0FBRyxJQUFBLGdCQUFNLEVBQUM7UUFDekIsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUTtZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsRUFBRTtnQkFDeEQsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDMUQ7WUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxJQUFJLEVBQUUsTUFBTTtLQUNiLENBQUMsQ0FBQztJQUVILE1BQU0sV0FBVyxHQUFHLElBQUEsZ0JBQU0sRUFBQztRQUN6QixVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFO2dCQUNwRCxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUMzRDtZQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksRUFBRSxNQUFNO0tBQ2IsQ0FBQyxDQUFDO0lBRUgsTUFBTSxXQUFXLEdBQUcsSUFBQSxnQkFBTSxFQUFDO1FBQ3pCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVE7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7Z0JBQ2pELFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3REO1lBQ0QsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQ0QsSUFBSSxFQUFFLE1BQU07S0FDYixDQUFDLENBQUM7SUFFSCxVQUFVLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSx5QkFBa0IsQ0FBQyxDQUFDO0lBRTlFLFVBQVUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRSxFQUFFLDhCQUF1QixDQUFDLENBQUM7SUFFeEYsVUFBVSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFLEVBQUUsOEJBQXVCLENBQUMsQ0FBQztJQUV4RixVQUFVLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLHVCQUFnQixDQUFDLENBQUM7SUFFbkUsVUFBVSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBQyxJQUFBLHdCQUFVLEdBQUUsRUFBQyxxQkFBYyxDQUFDLENBQUM7SUFFL0QsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSxzQkFBZSxDQUFDLENBQUM7SUFFbkUsVUFBVSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSw2QkFBc0IsQ0FBQyxDQUFDO0lBRWpGLFVBQVUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsNEJBQXFCLENBQUMsQ0FBQztJQUUvRSxVQUFVLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLDJCQUFvQixDQUFDLENBQUM7SUFHN0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUF0RFcsUUFBQSxlQUFlLG1CQXNEMUIifQ==