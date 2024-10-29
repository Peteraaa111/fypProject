import { RouterContext } from "koa-router";
import * as service from "../services/dataAnalysis"; 
import { 
    inputSearchAttendanceModal,
    ExamRecordModal
} from '../models/dataAnalysis'

export const searchAttendance = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: inputSearchAttendanceModal = (body as { data: inputSearchAttendanceModal }).data;
    let result = await service.searchAttendance(data);
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
}

export const searchExamRecord = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: ExamRecordModal = (body as { data: ExamRecordModal }).data;
  console.log(data);
  //console.log(data);
  let result = await service.searchExamRecord(data);
  if (result.success) {
    ctx.status = 201;
    //await service.logMovement(actorUid,data.docID,"Edit " + classID + " class " + data.studentName + " "+termDate + " exam mark ");
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}


