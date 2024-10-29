import { RouterContext } from "koa-router";
import * as service from "../services/admin"; 

export const getAllUser = async (ctx: RouterContext, next: any) => {
    try {
        const { teachersUsers, parentsUsers } = await service.getAllUser();
        ctx.body = {teachersUsers,parentsUsers};
        await next();
    } catch (error) {
        console.error('Error getting all user list:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all user list' };
    }
};

export const changePasswordForUser = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const userId: string = (body as { docIDValue: string}).docIDValue;
    const newPassword: string = (body as { newPasswordValue: string }).newPasswordValue;
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    let result = await service.changePasswordForUser(userId,newPassword);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,userId,"reset user password");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};



export const getAllLeaveForm = async (ctx: RouterContext, next: any) => {
  try {
      const { leaveFormList } = await service.getAllLeaveForm();
      ctx.body = {leaveFormList};
      await next();
  } catch (error) {
      console.error('Error getting all leave form list:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all user list' };
  }
};

export const getAllSystemProblem = async (ctx: RouterContext, next: any) => {
  try {
      const { systemProblemList } = await service.getAllSystemProblem();
      ctx.body = {systemProblemList};
      await next();
  } catch (error) {
      console.error('Error getting all system problem list:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all user list' };
  }
};

export const approvalLeaveForm = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const status: string = (body as { status: string}).status;
  const id: string = (body as { id: string }).id;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  let result = await service.approvalLeaveForm(status,id);
  if (result.success) {
    ctx.status = 201;
    await service.logMovement(actorUid,result.studentId,status+" the leave from in"+result.date);
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const getAllInterestClassRegistration = async (ctx: RouterContext, next: any) => {
  try {
      const { interestClassFormList } = await service.getAllInterestClassRegistration();
      ctx.body = {interestClassFormList};
      await next();
  } catch (error) {
      console.error('Error getting all interest class form list:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all list' };
  }
};

export const approvalLInterestClassegistration = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const status: string = (body as { status: string}).status;
  const interestClassID: string = (body as { id: string }).id;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  let result = await service.approvalInterestClassForm(status,interestClassID);
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