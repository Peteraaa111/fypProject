import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import { 
  findSenderName,
    getChatListByID, 
    getGroupChatList, 
    getMessageInChatRoom, 
    getTeacherChatListByID, 
    sendAudioFileInChatRoom, 
    sendFileInChatRoom, 
    sendMessageInChatRoom,
    sendVideoFileInChatRoom,

} from "../controllers/chat";
import multer from "@koa/multer";

export const setupChatRoutes = (router: Router<DefaultState, RouterContext>): void => {

  const chatRouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/chat" });
  
  const uploadVideo = multer({
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(mp4|avi|mov|flv|wmv)$/)) {
        callback(new Error("Please upload a video file"), false);
      }
      callback(null, true);
    },
    dest: "temp",
  });

  const uploadAudio = multer({
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(mp3|wav|ogg|aac)$/)) {
        callback(new Error("Please upload an audio file"), false);
      }
      callback(null, true);
    },
    dest: "temp",
  });

  const uploadImage = multer({
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callback(new Error("Please upload an image"), false);
      }
      callback(null, true);
    },
    dest: "temp",
  });

  chatRouter.post("/sendFileInChatRoom", uploadImage.any(), sendFileInChatRoom); 

  chatRouter.post("/sendAudioFileInChatRoom", uploadAudio.any(), sendAudioFileInChatRoom); 
  
  chatRouter.post("/sendVideoFileInChatRoom", uploadVideo.any(), sendVideoFileInChatRoom); 

  chatRouter.post('/getGroupChatList',bodyParser(),getGroupChatList);

  chatRouter.post('/findSenderName',bodyParser(),findSenderName);
  
  chatRouter.post("/getChatListByID", bodyParser(), getChatListByID);  

  chatRouter.post("/getTeacherChatListByID", bodyParser(), getTeacherChatListByID); 

  chatRouter.post("/sendMessageInChatRoom", bodyParser(), sendMessageInChatRoom); 

  chatRouter.post("/getMessageInChatRoom", bodyParser(), getMessageInChatRoom); 


  router.use(chatRouter.routes());
};