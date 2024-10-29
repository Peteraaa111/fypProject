"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVideoFileInChatRoom = exports.sendAudioFileInChatRoom = exports.sendFileInChatRoom = exports.sendMessageInChatRoom = exports.getMessageInChatRoom = exports.getGroupChatList = exports.findSenderName = exports.getTeacherChatListByID = exports.getChatListByID = void 0;
const service = __importStar(require("../services/chat"));
const getChatListByID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentID;
    const classId = body.classID;
    let result = yield service.getChatListByID(studentId, classId);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getChatListByID = getChatListByID;
const getTeacherChatListByID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const teacherId = body.teacherID;
    const classId = body.classID;
    let result = yield service.getTeacherChatListByID(teacherId, classId);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getTeacherChatListByID = getTeacherChatListByID;
const findSenderName = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    //const teacherId: string = (body as {teacherID:string}).teacherID;
    const senderID = body.senderID;
    let result = yield service.findSenderName(senderID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.findSenderName = findSenderName;
const getGroupChatList = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    //const teacherId: string = (body as {teacherID:string}).teacherID;
    const senderID = body.classID;
    let result = yield service.getGroupChatList(senderID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getGroupChatList = getGroupChatList;
const getMessageInChatRoom = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classId = body.classID;
    const chatRoomID = body.chatRoomID;
    let result = yield service.getAllMessageInChatRoom(classId, chatRoomID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getMessageInChatRoom = getMessageInChatRoom;
const sendMessageInChatRoom = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const senderID = body.senderID;
    const classId = body.classID;
    const chatRoomID = body.chatRoomID;
    const message = body.message;
    const type = body.type;
    let result = yield service.sendMessageInChatRoom(senderID, classId, chatRoomID, message, type);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.sendMessageInChatRoom = sendMessageInChatRoom;
const sendFileInChatRoom = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const files = ctx.request.files;
    const senderID = body.senderID;
    const classId = body.classID;
    const chatRoomID = body.chatRoomID;
    const type = body.type;
    let result = yield service.sendFileInChatRoom(senderID, classId, chatRoomID, files, type);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.sendFileInChatRoom = sendFileInChatRoom;
const sendAudioFileInChatRoom = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const files = ctx.request.files;
    const senderID = body.senderID;
    const classId = body.classID;
    const chatRoomID = body.chatRoomID;
    const type = body.type;
    let result = yield service.sendAudioFileInChatRoom(senderID, classId, chatRoomID, files, type);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.sendAudioFileInChatRoom = sendAudioFileInChatRoom;
const sendVideoFileInChatRoom = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const files = ctx.request.files;
    const senderID = body.senderID;
    const classId = body.classID;
    const chatRoomID = body.chatRoomID;
    const type = body.type;
    let result = yield service.sendVideoFileInChatRoom(senderID, classId, chatRoomID, files, type);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.sendVideoFileInChatRoom = sendVideoFileInChatRoom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9jaGF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMERBQTRDO0FBSXJDLE1BQU0sZUFBZSxHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUNuRSxNQUFNLElBQUksR0FBWSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN2QyxNQUFNLFNBQVMsR0FBWSxJQUEyQixDQUFDLFNBQVMsQ0FBQztJQUNqRSxNQUFNLE9BQU8sR0FBWSxJQUF5QixDQUFDLE9BQU8sQ0FBQztJQUMzRCxJQUFJLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlELElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNsQixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFDO0FBYlcsUUFBQSxlQUFlLG1CQWExQjtBQUVLLE1BQU0sc0JBQXNCLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQzVFLE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLE1BQU0sU0FBUyxHQUFZLElBQTJCLENBQUMsU0FBUyxDQUFDO0lBQ2pFLE1BQU0sT0FBTyxHQUFZLElBQXlCLENBQUMsT0FBTyxDQUFDO0lBQzNELElBQUksTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBQyxPQUFPLENBQUMsQ0FBQztJQUNyRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDbEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7U0FBTTtRQUNMLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNmLENBQUMsQ0FBQSxDQUFDO0FBYlcsUUFBQSxzQkFBc0IsMEJBYWpDO0FBRUssTUFBTSxjQUFjLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLG1FQUFtRTtJQUNuRSxNQUFNLFFBQVEsR0FBWSxJQUEwQixDQUFDLFFBQVEsQ0FBQztJQUM5RCxJQUFJLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEQsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO1NBQU07UUFDTCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDZixDQUFDLENBQUEsQ0FBQztBQWJXLFFBQUEsY0FBYyxrQkFhekI7QUFFSyxNQUFNLGdCQUFnQixHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUN0RSxNQUFNLElBQUksR0FBWSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN2QyxtRUFBbUU7SUFDbkUsTUFBTSxRQUFRLEdBQVksSUFBeUIsQ0FBQyxPQUFPLENBQUM7SUFDNUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEQsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO1NBQU07UUFDTCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDZixDQUFDLENBQUEsQ0FBQztBQWJXLFFBQUEsZ0JBQWdCLG9CQWEzQjtBQU9LLE1BQU0sb0JBQW9CLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQzFFLE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLE1BQU0sT0FBTyxHQUFZLElBQXlCLENBQUMsT0FBTyxDQUFDO0lBQzNELE1BQU0sVUFBVSxHQUFXLElBQTRCLENBQUMsVUFBVSxDQUFDO0lBQ25FLElBQUksTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sRUFBQyxVQUFVLENBQUMsQ0FBQztJQUN2RSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDbEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7U0FBTTtRQUNMLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNmLENBQUMsQ0FBQSxDQUFDO0FBYlcsUUFBQSxvQkFBb0Isd0JBYS9CO0FBR0ssTUFBTSxxQkFBcUIsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDM0UsTUFBTSxJQUFJLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkMsTUFBTSxRQUFRLEdBQVksSUFBMEIsQ0FBQyxRQUFRLENBQUM7SUFDOUQsTUFBTSxPQUFPLEdBQVksSUFBeUIsQ0FBQyxPQUFPLENBQUM7SUFDM0QsTUFBTSxVQUFVLEdBQVcsSUFBNEIsQ0FBQyxVQUFVLENBQUM7SUFDbkUsTUFBTSxPQUFPLEdBQVMsSUFBc0IsQ0FBQyxPQUFPLENBQUM7SUFDckQsTUFBTSxJQUFJLEdBQVcsSUFBc0IsQ0FBQyxJQUFJLENBQUM7SUFFakQsSUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNGLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNsQixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2YsQ0FBQyxDQUFBLENBQUM7QUFqQlcsUUFBQSxxQkFBcUIseUJBaUJoQztBQUVLLE1BQU0sa0JBQWtCLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQ3hFLE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLE1BQU0sS0FBSyxHQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ3BDLE1BQU0sUUFBUSxHQUFZLElBQTBCLENBQUMsUUFBUSxDQUFDO0lBQzlELE1BQU0sT0FBTyxHQUFZLElBQXlCLENBQUMsT0FBTyxDQUFDO0lBQzNELE1BQU0sVUFBVSxHQUFXLElBQTRCLENBQUMsVUFBVSxDQUFDO0lBQ25FLE1BQU0sSUFBSSxHQUFXLElBQXNCLENBQUMsSUFBSSxDQUFDO0lBRWpELElBQUksTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsQ0FBQztJQUN0RixJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDbEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7U0FBTTtRQUNMLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNmLENBQUMsQ0FBQSxDQUFDO0FBakJXLFFBQUEsa0JBQWtCLHNCQWlCN0I7QUFHSyxNQUFNLHVCQUF1QixHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUM3RSxNQUFNLElBQUksR0FBWSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN2QyxNQUFNLEtBQUssR0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNwQyxNQUFNLFFBQVEsR0FBWSxJQUEwQixDQUFDLFFBQVEsQ0FBQztJQUM5RCxNQUFNLE9BQU8sR0FBWSxJQUF5QixDQUFDLE9BQU8sQ0FBQztJQUMzRCxNQUFNLFVBQVUsR0FBVyxJQUE0QixDQUFDLFVBQVUsQ0FBQztJQUNuRSxNQUFNLElBQUksR0FBVyxJQUFzQixDQUFDLElBQUksQ0FBQztJQUNqRCxJQUFJLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0YsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO1NBQU07UUFDTCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDZixDQUFDLENBQUEsQ0FBQztBQWhCVyxRQUFBLHVCQUF1QiwyQkFnQmxDO0FBRUssTUFBTSx1QkFBdUIsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDN0UsTUFBTSxJQUFJLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkMsTUFBTSxLQUFLLEdBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDcEMsTUFBTSxRQUFRLEdBQVksSUFBMEIsQ0FBQyxRQUFRLENBQUM7SUFDOUQsTUFBTSxPQUFPLEdBQVksSUFBeUIsQ0FBQyxPQUFPLENBQUM7SUFDM0QsTUFBTSxVQUFVLEdBQVcsSUFBNEIsQ0FBQyxVQUFVLENBQUM7SUFDbkUsTUFBTSxJQUFJLEdBQVcsSUFBc0IsQ0FBQyxJQUFJLENBQUM7SUFDakQsSUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNGLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNsQixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2YsQ0FBQyxDQUFBLENBQUM7QUFoQlcsUUFBQSx1QkFBdUIsMkJBZ0JsQyJ9