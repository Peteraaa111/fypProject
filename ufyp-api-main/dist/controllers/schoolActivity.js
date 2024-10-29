"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.addActivity = exports.editUploadImage = exports.uploadPhoto = exports.getPhotoInActivity = exports.getPhotogetPhotoActivityDocIds = exports.getPhotoDocIds = exports.getAcademicYearDocIds = void 0;
const service = __importStar(require("../services/schoolActivity"));
const getAcademicYearDocIds = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.getAcademicYearDocIds();
        if (result.success) {
            ctx.body = result.data;
            yield next();
        }
        else {
            ctx.status = 500;
            ctx.body = result;
        }
    }
    catch (error) {
        console.error('Error getting all year options:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all year options' };
    }
});
exports.getAcademicYearDocIds = getAcademicYearDocIds;
const getPhotoDocIds = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const result = yield service.getPhotoDocIds(selectedYear);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result.data;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getPhotoDocIds = getPhotoDocIds;
const getPhotogetPhotoActivityDocIds = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const photoDate = body.photoDate;
    const result = yield service.getPhotoActivity(selectedYear, photoDate);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result.data;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getPhotogetPhotoActivityDocIds = getPhotogetPhotoActivityDocIds;
const getPhotoInActivity = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const photoDate = body.photoDate;
    const id = body.id;
    const result = yield service.getPhotoInActivity(selectedYear, photoDate, id);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result.data;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getPhotoInActivity = getPhotoInActivity;
const uploadPhoto = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const files = ctx.request.files;
    const activityName = body.activityName;
    const filePath = body.filePath;
    const activityID = body.id;
    const year = body.year;
    const activityMonth = body.activityMonth;
    const group = { activityName, activityID, year, activityMonth, filePath };
    const actorUid = body.CurrentUserUid;
    const result = yield service.uploadFiles(files, group, actorUid);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.uploadPhoto = uploadPhoto;
const editUploadImage = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const files = ctx.request.files;
    const year = body.year;
    const filePath = body.filePath;
    const imageName = body.imageName;
    const imageID = body.imageID;
    const activityName = body.activityName;
    const activityMonth = body.activityMonth;
    const activityID = body.activityID;
    const group = { activityName, activityID, year, activityMonth, filePath, imageID, imageName };
    const actorUid = body.CurrentUserUid;
    const result = yield service.editUploadImage(files, group, actorUid);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.editUploadImage = editUploadImage;
const addActivity = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    let result = yield service.addActivity(data);
    console.log(result);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, result.targetID, "add activity");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.addActivity = addActivity;
const deleteImage = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    const result = yield service.deleteImage(data, actorUid);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.deleteImage = deleteImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nob29sQWN0aXZpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlcnMvc2Nob29sQWN0aXZpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxvRUFBc0Q7QUFPL0MsTUFBTSxxQkFBcUIsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDekUsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDckQsSUFBRyxNQUFNLENBQUMsT0FBTyxFQUFDO1lBQ2hCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN2QixNQUFNLElBQUksRUFBRSxDQUFDO1NBQ2Q7YUFBSTtZQUNILEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1NBQ25CO0tBRUY7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLEtBQUssRUFBRSxxREFBcUQsRUFBRSxDQUFDO0tBQzdFO0FBQ0wsQ0FBQyxDQUFBLENBQUM7QUFoQlcsUUFBQSxxQkFBcUIseUJBZ0JoQztBQUdLLE1BQU0sY0FBYyxHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUNsRSxNQUFNLElBQUksR0FBWSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN2QyxNQUFNLFlBQVksR0FBWSxJQUF3QixDQUFDLElBQUksQ0FBQztJQUM1RCxNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMs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