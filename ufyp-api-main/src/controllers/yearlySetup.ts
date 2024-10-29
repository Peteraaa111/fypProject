import * as service from "../services/yearlySetup"; 
import  { RouterContext } from "koa-router";

export const createPhotoCollection = async (ctx: RouterContext, next: any) => {
    let result = await service.createPhotoCollection();
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const createYearlyAttendance = async (ctx: RouterContext, next: any) => {
  let result = await service.updateYearlyAttendance();
  if (result.success) {
    ctx.status = 201;
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const deleteAttendanceCollection = async (ctx: RouterContext, next: any) => {
  let result = await service.deleteAttendanceCollection();
  if (result.success) {
    ctx.status = 201;
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};