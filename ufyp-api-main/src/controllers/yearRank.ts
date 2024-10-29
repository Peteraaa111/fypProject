import { RouterContext } from "koa-router";
import * as service from "../services/yearRank"; 
import {
    yearRankModal,
    distributeNextYearClassModal,
} from "../models/yearRank";


export const getStudentRankByYear = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const yearSelectValue: string = (body as {year:string}).year;
    let result = await service.getStudentRankByYear(yearSelectValue);
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const generateRank = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: yearRankModal[] = (body as { data: yearRankModal[]}).data;
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    const yearSelectValue: string = (body as {yearSelectValue:string}).yearSelectValue;
    let result = await service.generateRank(data,yearSelectValue);
    if (result.success) {
      ctx.status = 201;
      //await service.logMovement(actorUid,userId,"reset user password");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const distributeNextYearClass = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: distributeNextYearClassModal[] = (body as { data: distributeNextYearClassModal[]}).data;
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    console.log(data);
    let result = await service.distributeNextYearClass(data);
    if (result.success) {
      ctx.status = 201;
      //await service.logMovement(actorUid,userId,"reset user password");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};