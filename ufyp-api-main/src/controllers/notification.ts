import { RouterContext } from "koa-router";
import * as service from "../services/notification"; 


export const sendNotification = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    let result = await service.sendNotification();
    if (result.success) {
      ctx.status = 201;

      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};
