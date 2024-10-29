import * as service from "../services/interestClass"; 
import  { RouterContext } from "koa-router";
import {
    interestClassModal,
} from "../models/interestClass";


export const getAllClassAndStudentInterest = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const result = await service.getAllClassAndStudentInterest(selectedYear);
    if(result.success){
        ctx.status = 201;
        ctx.body = result.data;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};


export const getAllStudentInterestClass = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const result = await service.getAllStudentInterestClass(selectedYear);
    if(result.success){
        ctx.status = 201;
        ctx.body = result.data;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};


export const createInterestClassDocument = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: interestClassModal = (body as { data: interestClassModal }).data;
    const selectedYear: string = (body as { selectedYear: string}).selectedYear;
    const CurrentUserUid: string = (body as { CurrentUserUid: string}).CurrentUserUid;
    const result = await service.createInterestClassDocument(data,selectedYear);
    if(result.success){
        ctx.status = 201;
        await service.logMovement(CurrentUserUid,result.documentId,"add new inteest class");
        ctx.body = result;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};


export const getAllInterestClassGroup = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const result = await service.getAllInterestClassGroup(selectedYear);
    if(result.success){
        ctx.status = 201;
        ctx.body = result.data;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};

export const editInterestClassDocument = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: interestClassModal = (body as { data: interestClassModal }).data;
    const selectedYear: string = (body as { selectedYear: string}).selectedYear;
    const CurrentUserUid: string = (body as { CurrentUserUid: string}).CurrentUserUid;
    const result = await service.editInterestClassDocument(data,selectedYear);
    if(result.success){
        ctx.status = 201;
        await service.logMovement(CurrentUserUid,result.documentId,"Edit inteest class information");
        ctx.body = result;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};


export const editInterestClassStatus = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const status: string = (body as { status: string }).status;
    const selectedYear: string = (body as { selectedYear: string}).selectedYear;
    const id: string = (body as { id: string }).id;
    const CurrentUserUid: string = (body as { CurrentUserUid: string}).CurrentUserUid;
    const result = await service.editInterestClassStatus(status,selectedYear,id);
    if(result.success){
        ctx.status = 201;
        await service.logMovement(CurrentUserUid,result.documentId,"Edit inteest class information status To "+status);
        ctx.body = result;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};




