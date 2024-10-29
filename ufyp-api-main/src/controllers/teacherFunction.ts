import { RouterContext } from "koa-router";
import * as service from "../services/teacherFunction"; 
import { attendanceSubmitModal, homeworkModal } from "../models/teacherFunction";

export const addNotification = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const contentTC: string = (body as { contentTC: string}).contentTC;
    const contentEN: string = (body as { contentEN: string }).contentEN;
    const titleTC: string = (body as { titleTC: string}).titleTC;
    const titleEN: string = (body as { titleEN: string }).titleEN;
    let result = await service.addNotification(contentTC,contentEN,titleTC,titleEN);
    if (result.success) {
      ctx.status = 201;
      //await service.logMovement(actorUid,studentId,status+" the leave from");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const getClassmateData = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const classID: string = (body as { classID: string }).classID;
    let result = await service.getClassmateData(classID);
    if (result.success) {
      ctx.status = 201;
      //await service.logMovement(actorUid,studentId,status+" the leave from");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const getClassAttendance = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as { classID: string }).classID;
  const attendanceDate: string = (body as { attendanceDate: string }).attendanceDate;
  let result = await service.getClassAttendance(classID,attendanceDate);
  if (result.success) {
    ctx.status = 201;
    //await service.logMovement(actorUid,studentId,status+" the leave from");
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const submitAttendanceList = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: attendanceSubmitModal[] = (body as { data: attendanceSubmitModal[] }).data;
  const classID: string = (body as { classID: string }).classID;
  const attendanceDate: string = (body as { attendanceDate: string }).attendanceDate;
  let result = await service.submitAttendanceList(data,classID,attendanceDate);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const uploadImageForHomework = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const files:any = ctx.request.files;

  const selectedDate: string = (body as { selectedDate: string }).selectedDate;
  let result = await service.uploadImageForHomework(files,selectedDate);
  if (result.success) { 
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 

export const createHomeworkForClass = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as { classID: string }).classID;
  const data: homeworkModal = (body as { data: homeworkModal }).data;
  let result = await service.createHomeworkForClass(classID,data);
  if (result.success) { 
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 

export const checkDateHomeworkExist = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as { classID: string }).classID;
  const selectedDate: string = (body as { selectedDate: string }).selectedDate;

  let result = await service.checkDateHomeworkExist(classID,selectedDate);
  if (result.success) { 
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 


export const getTheHomeworkData = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as { classID: string }).classID;
  const selectedDate: string = (body as { selectedDate: string }).selectedDate;
  console.log(selectedDate);
  let result = await service.getTheHomeworkData(classID,selectedDate);
  if (result.success) { 
    ctx.status = 201;
    ctx.type = 'image/png';
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 

export const editHomeworkForClass = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as { classID: string }).classID;
  const data: homeworkModal = (body as { data: homeworkModal }).data;
  
  let result = await service.editHomeworkForClass(classID,data);
  if (result.success) { 
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next(); 
}; 


export const getStudentFirstHalfGrade = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as {classId:string}).classId;
  let result = await service.getStudentFirstHalfGrade(classID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 
 


export const getStudentSecondHalfGrade = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as {classId:string}).classId;

  let result = await service.getStudentSecondHalfGrade(classID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 



export const submitClassSeatingTable = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as {classID:string}).classID;
  const classTable: any = (body as {classTable:any}).classTable;
  let result = await service.submitClassSeatingTable(classID,classTable);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 
 


export const getClassSeatingTable = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as {classID:string}).classID;
  let result = await service.getClassSeatingTable(classID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 
 


