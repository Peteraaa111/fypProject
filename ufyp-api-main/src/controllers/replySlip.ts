import { RouterContext } from "koa-router";
import * as service from "../services/replySlip"; 
import { 
    replySlipInformationModal,
    distributionReplySlipModal,
} from '../models/replySlip';

export const getReplySlip = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const result = await service.getReplySlip(selectedYear);
    if(result.success){
        ctx.status = 201;
        ctx.body = result.data;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};

export const addReplySlip = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: replySlipInformationModal = (body as { data: replySlipInformationModal }).data;
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    let result = await service.addReplySlip(data);
    if (result.success) {
      ctx.status = 201;
      service.logMovement(actorUid,null,"Add reply slip No."+result.resultid);
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};
  
export const editReplySlip = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const dataID: string = (body as { dataID: string }).dataID;
    const data: replySlipInformationModal = (body as { data: replySlipInformationModal }).data;
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    let result = await service.editReplySlip(dataID,data);
    if (result.success) {
      ctx.status = 201;
      service.logMovement(actorUid,null,"Edit reply slip No."+dataID);
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const deleteReplySlip = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const dataID: string = (body as { id: string }).id;
    const selectedYear: string = (body as { selectedYear: string }).selectedYear;
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    let result = await service.deleteReplySlip(dataID,selectedYear);
    if (result.success) {
      ctx.status = 201;
      service.logMovement(actorUid,null,"Edit reply slip No."+dataID);
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const distributionReplySlip = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: distributionReplySlipModal = (body as { data: distributionReplySlipModal }).data;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  console.log(data);
  let result = await service.distributionReplySlip(data);
  if (result.success) {
    ctx.status = 201;
    service.logMovement(actorUid,null,"Distribute reply slip No."+data.id);
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const getAllClass = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const selectedYear: string = (body as { year: string}).year;
  const result = await service.getAllClass(selectedYear);
  if(result.success){
      ctx.status = 201;
      ctx.body = result.data;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};

export const getAllClassAndStudent = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const selectedYear: string = (body as { year: string}).year;
  const result = await service.getAllClassAndStudent(selectedYear);
  if(result.success){
      ctx.status = 201;
      ctx.body = result.data;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};

export const getNumStudentsWithReplySlip = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const selectedYear: string = (body as { year: string}).year;
  const replySlipId: string = (body as { replySlipId: string}).replySlipId;
  const result = await service.getNumStudentsWithReplySlip(selectedYear,replySlipId);
  if(result.success){
      ctx.status = 201;
      ctx.body = result.data;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};

