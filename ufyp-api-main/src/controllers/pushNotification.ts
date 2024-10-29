import { RouterContext } from "koa-router";
import * as service from "../services/pushNotification"; 

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


export const editNotification = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const contentTC: string = (body as { contentTC: string}).contentTC;
  const contentEN: string = (body as { contentEN: string }).contentEN;
  const id: number = (body as { id: number }).id;
  const titleTC: string = (body as { titleTC: string}).titleTC;
  const titleEN: string = (body as { titleEN: string }).titleEN;
  let result = await service.editNotification(id,contentTC,contentEN,titleTC,titleEN);
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



export const getAllNotification = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    let result = await service.getAllNotification();
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

export const pushNotification = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const selectedOption: string = (body as { selectedOption: string}).selectedOption;
  const id: number = (body as { id: number }).id;
  let result = await service.pushNotification(selectedOption,id);
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



