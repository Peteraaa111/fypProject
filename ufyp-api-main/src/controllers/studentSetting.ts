import { RouterContext } from "koa-router";
import * as service from "../services/studentSetting"; 
import { 
    applyRewardData,
    reward,
    applyInterestClassData,
    interClassIdGroup,
} from '../models/studentSetting'
import json from "koa-json";



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

export const applyRewardToStudent = async (ctx: RouterContext, next: any) => {
    const body: any = ctx.request.body;
    const applyRewardData = JSON.parse(body.applyRewardData);
    const rewardData:reward[] = JSON.parse(body.rewardData);
    const files = ctx.request.files;
    const result = await service.applyRewardToStudent(files,applyRewardData,rewardData);
    if(result.success){
        ctx.status = 201;
        ctx.body = result;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};

export const getAllStudentReward = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const result = await service.getAllStudentReward(selectedYear);
    if(result.success){
        ctx.status = 201;
        ctx.body = result.data;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};


export const getStudentRewardDetail = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const studentID: string = (body as { photoDate: string}).photoDate;
    const result = await service.getStudentRewardDetail(selectedYear,studentID);
    if(result.success){
        ctx.status = 201;
        ctx.body = result.data;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};

export const editStudentReward = async (ctx: RouterContext, next: any) => {
    const body: any = ctx.request.body;
    const applyRewardData = JSON.parse(body.applyRewardData);
    const rewardData:reward[] = JSON.parse(body.rewardData);
    const files = ctx.request.files;
    const result = await service.editStudentReward(files,applyRewardData,rewardData);
    if(result.success){
        ctx.status = 201;
        ctx.body = result;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};


export const applyInterestClassToStudent = async (ctx: RouterContext, next: any) => {
    const body: any = ctx.request.body;
    const applyInterestClassData: applyInterestClassData = (body as { applyInterestClassData: applyInterestClassData}).applyInterestClassData;
    const data:interClassIdGroup[] = (body as { interestArray: interClassIdGroup[]}).interestArray;
    const result = await service.addInterestClassForStudentDocument(data,applyInterestClassData);
    if(result.success){
        ctx.status = 201;
        await service.logMovement(applyInterestClassData.CurrentUserUid,applyInterestClassData.studentId,"Apply interest class to student "+ applyInterestClassData.studentId);
        ctx.body = result;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};

export const editInterestClassToStudent = async (ctx: RouterContext, next: any) => {
    const body: any = ctx.request.body;
    const applyInterestClassData: applyInterestClassData = (body as { applyInterestClassData: applyInterestClassData}).applyInterestClassData;
    const data:interClassIdGroup[] = (body as { interestArray: interClassIdGroup[]}).interestArray;
   const result = await service.editInterestClassForStudentDocument(data,applyInterestClassData);
    if(result.success){
        ctx.status = 201;
        ctx.body = result;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};