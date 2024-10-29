import { RouterContext } from "koa-router";
import * as service from "../services/chat"; 
import sharp from "sharp";


export const getChatListByID = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const studentId: string = (body as {studentID:string}).studentID;
    const classId: string = (body as {classID:string}).classID;
    let result = await service.getChatListByID(studentId,classId);
    if (result.success) {
      ctx.status = 201;
      ctx.body = result; 
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
}; 

export const getTeacherChatListByID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const teacherId: string = (body as {teacherID:string}).teacherID;
  const classId: string = (body as {classID:string}).classID;
  let result = await service.getTeacherChatListByID(teacherId,classId);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const findSenderName = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  //const teacherId: string = (body as {teacherID:string}).teacherID;
  const senderID: string = (body as {senderID:string}).senderID;
  let result = await service.findSenderName(senderID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const getGroupChatList = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  //const teacherId: string = (body as {teacherID:string}).teacherID;
  const senderID: string = (body as {classID:string}).classID;
  let result = await service.getGroupChatList(senderID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 






export const getMessageInChatRoom = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classId: string = (body as {classID:string}).classID;
  const chatRoomID:string = (body as {chatRoomID:string}).chatRoomID;
  let result = await service.getAllMessageInChatRoom(classId,chatRoomID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 
  

export const sendMessageInChatRoom = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const senderID: string = (body as {senderID:string}).senderID;
  const classId: string = (body as {classID:string}).classID;
  const chatRoomID:string = (body as {chatRoomID:string}).chatRoomID;
  const message: any = (body as {message:any}).message;
  const type:string = (body as {type:string}).type;

  let result = await service.sendMessageInChatRoom(senderID,classId,chatRoomID,message,type);
  if (result.success) { 
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 

export const sendFileInChatRoom = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const files:any = ctx.request.files;
  const senderID: string = (body as {senderID:string}).senderID;
  const classId: string = (body as {classID:string}).classID;
  const chatRoomID:string = (body as {chatRoomID:string}).chatRoomID;
  const type:string = (body as {type:string}).type;

  let result = await service.sendFileInChatRoom(senderID,classId,chatRoomID,files,type);
  if (result.success) { 
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 


export const sendAudioFileInChatRoom = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const files:any = ctx.request.files;
  const senderID: string = (body as {senderID:string}).senderID;
  const classId: string = (body as {classID:string}).classID;
  const chatRoomID:string = (body as {chatRoomID:string}).chatRoomID;
  const type:string = (body as {type:string}).type;
  let result = await service.sendAudioFileInChatRoom(senderID,classId,chatRoomID,files,type);
  if (result.success) { 
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 

export const sendVideoFileInChatRoom = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const files:any = ctx.request.files;
  const senderID: string = (body as {senderID:string}).senderID;
  const classId: string = (body as {classID:string}).classID;
  const chatRoomID:string = (body as {chatRoomID:string}).chatRoomID;
  const type:string = (body as {type:string}).type;
  let result = await service.sendVideoFileInChatRoom(senderID,classId,chatRoomID,files,type);
  if (result.success) { 
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 