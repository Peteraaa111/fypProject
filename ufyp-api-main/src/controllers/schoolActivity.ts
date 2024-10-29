import { RouterContext } from "koa-router";
import * as service from "../services/schoolActivity"; 
import { 
  activityPhotoModal,    
  addActivityModal,
  editUploadImageModal,      
} from '../models/schoolActivity';

export const getAcademicYearDocIds = async (ctx: RouterContext, next: any) => {
    try {
      const result = await service.getAcademicYearDocIds();
      if(result.success){
        ctx.body = result.data;
        await next();
      }else{
        ctx.status = 500;
        ctx.body = result;
      }

    } catch (error) {
      console.error('Error getting all year options:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all year options' };
    }
};


export const getPhotoDocIds = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const result = await service.getPhotoDocIds(selectedYear);
    if(result.success){
        ctx.status = 201;
        ctx.body = result.data;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};

export const getPhotogetPhotoActivityDocIds = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const photoDate: string = (body as { photoDate: string}).photoDate;
    const result = await service.getPhotoActivity(selectedYear,photoDate);
    if(result.success){
        ctx.status = 201;
        ctx.body = result.data;
    }else{
        ctx.status = 500;
        ctx.body = result;
    }
    await next();
};

export const getPhotoInActivity = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const selectedYear: string = (body as { year: string}).year;
  const photoDate: string = (body as { photoDate: string}).photoDate;
  const id: string = (body as { id: string}).id;
  const result = await service.getPhotoInActivity(selectedYear,photoDate,id);

  if(result.success){
      ctx.status = 201;
      ctx.body = result.data;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};

export const uploadPhoto = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const files = ctx.request.files;
  const activityName: string = (body as { activityName: string}).activityName;
  const filePath: string = (body as { filePath: string}).filePath;
  const activityID: string = (body as { id: string}).id;
  const year: string = (body as { year: string}).year;
  const activityMonth: string = (body as { activityMonth: string}).activityMonth;
  const group : activityPhotoModal = { activityName,activityID,year,activityMonth,filePath};
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  const result = await service.uploadFiles(files,group,actorUid);
  if(result.success){
      ctx.status = 201;
      ctx.body = result;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};


export const editUploadImage = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const files = ctx.request.files;
  const year: string = (body as { year: string}).year;
  const filePath: string = (body as { filePath: string}).filePath;
  const imageName: string = (body as { imageName: string}).imageName;
  const imageID: string = (body as { imageID: string}).imageID;
  const activityName: string = (body as { activityName: string}).activityName;
  const activityMonth: string = (body as { activityMonth: string}).activityMonth;
  const activityID: string = (body as { activityID: string}).activityID;
  const group : editUploadImageModal = { activityName,activityID,year,activityMonth,filePath,imageID,imageName};
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  const result = await service.editUploadImage(files,group,actorUid);
  if(result.success){
      ctx.status = 201;
      ctx.body = result;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};


export const addActivity = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: addActivityModal = (body as { data: addActivityModal }).data;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  let result = await service.addActivity(data);
  console.log(result);
  if(result.success){
      ctx.status = 201;
      await service.logMovement(actorUid,result.targetID, "add activity");
      ctx.body = result;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};

export const deleteImage = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: editUploadImageModal = (body as { data: editUploadImageModal }).data;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  const result = await service.deleteImage(data,actorUid);
  if(result.success){
      ctx.status = 201;
      ctx.body = result;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};

