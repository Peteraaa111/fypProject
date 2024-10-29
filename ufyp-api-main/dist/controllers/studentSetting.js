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
exports.editInterestClassToStudent = exports.applyInterestClassToStudent = exports.editStudentReward = exports.getStudentRewardDetail = exports.getAllStudentReward = exports.applyRewardToStudent = exports.getAllClassAndStudent = void 0;
const service = __importStar(require("../services/studentSetting"));
const getAllClassAndStudent = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const result = yield service.getAllClassAndStudent(selectedYear);
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
exports.getAllClassAndStudent = getAllClassAndStudent;
const applyRewardToStudent = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const applyRewardData = JSON.parse(body.applyRewardData);
    const rewardData = JSON.parse(body.rewardData);
    const files = ctx.request.files;
    const result = yield service.applyRewardToStudent(files, applyRewardData, rewardData);
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
exports.applyRewardToStudent = applyRewardToStudent;
const getAllStudentReward = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const result = yield service.getAllStudentReward(selectedYear);
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
exports.getAllStudentReward = getAllStudentReward;
const getStudentRewardDetail = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const studentID = body.photoDate;
    const result = yield service.getStudentRewardDetail(selectedYear, studentID);
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
exports.getStudentRewardDetail = getStudentRewardDetail;
const editStudentReward = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const applyRewardData = JSON.parse(body.applyRewardData);
    const rewardData = JSON.parse(body.rewardData);
    const files = ctx.request.files;
    const result = yield service.editStudentReward(files, applyRewardData, rewardData);
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
exports.editStudentReward = editStudentReward;
const applyInterestClassToStudent = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const applyInterestClassData = body.applyInterestClassData;
    const data = body.interestArray;
    const result = yield service.addInterestClassForStudentDocument(data, applyInterestClassData);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(applyInterestClassData.CurrentUserUid, applyInterestClassData.studentId, "Apply interest class to student " + applyInterestClassData.studentId);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.applyInterestClassToStudent = applyInterestClassToStudent;
const editInterestClassToStudent = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const applyInterestClassData = body.applyInterestClassData;
    const data = body.interestArray;
    const result = yield service.editInterestClassForStudentDocument(data, applyInterestClassData);
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
exports.editInterestClassToStudent = editInterestClassToStudent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudFNldHRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlcnMvc3R1ZGVudFNldHRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxvRUFBc0Q7QUFXL0MsTUFBTSxxQkFBcUIsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDekUsTUFBTSxJQUFJLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkMsTUFBTSxZQUFZLEdBQVksSUFBd0IsQ0FBQyxJQUFJLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDakUsSUFBRyxNQUFNLENBQUMsT0FBTyxFQUFDO1FBQ2QsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQzFCO1NBQUk7UUFDRCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNyQjtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDakIsQ0FBQyxDQUFBLENBQUM7QUFaVyxRQUFBLHFCQUFxQix5QkFZaEM7QUFFSyxNQUFNLG9CQUFvQixHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUN4RSxNQUFNLElBQUksR0FBUSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUNuQyxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN6RCxNQUFNLFVBQVUsR0FBWSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4RCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUMsZUFBZSxFQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BGLElBQUcsTUFBTSxDQUFDLE9BQU8sRUFBQztRQUNkLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ3JCO1NBQUk7UUFDRCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNyQjtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDakIsQ0FBQyxDQUFBLENBQUM7QUFkVyxRQUFBLG9CQUFvQix3QkFjL0I7QUFFSyxNQUFNLG1CQUFtQixHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUN2RSxNQUFNLElBQUksR0FBWSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN2QyxNQUFNLFlBQVksR0FBWSxJQUF3QixDQUFDLElBQUksQ0FBQztJQUM1RCxNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMvRCxJQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUM7UUFDZCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDMUI7U0FBSTtRQUNELEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ3JCO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNqQixDQUFDLENBQUEsQ0FBQztBQVpXLFFBQUEsbUJBQW1CLHVCQVk5QjtBQUdLLE1BQU0sc0JBQXNCLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQzFFLE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLE1BQU0sWUFBWSxHQUFZLElBQXdCLENBQUMsSUFBSSxDQUFDO0lBQzVELE1BQU0sU0FBUyxHQUFZLElBQTZCLENBQUMsU0FBUyxDQUFDO0lBQ25FLE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLHNCQUFzQixDQUFDLFlBQVksRUFBQyxTQUFTLENBQUMsQ0FBQztJQUM1RSxJQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUM7UUFDZCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDMUI7U0FBSTtRQUNELEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ3JCO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNqQixDQUFDLENBQUEsQ0FBQztBQWJXLFFBQUEsc0JBQXNCLDBCQWFqQztBQUVLLE1BQU0saUJBQWlCLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQ3JFLE1BQU0sSUFBSSxHQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ25DLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sVUFBVSxHQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hDLE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBQyxlQUFlLEVBQUMsVUFBVSxDQUFDLENBQUM7SUFDakYsSUFBRyxNQUFNLENBQUMsT0FBTyxFQUFDO1FBQ2QsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDckI7U0FBSTtRQUNELEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ3JCO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNqQixDQUFDLENBQUEsQ0FBQztBQWRXLFFBQUEsaUJBQWlCLHFCQWM1QjtBQUdLLE1BQU0sMkJBQTJCLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQy9FLE1BQU0sSUFBSSxHQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ25DLE1BQU0sc0JBQXNCLEdBQTRCLElBQTBELENBQUMsc0JBQXNCLENBQUM7SUFDMUksTUFBTSxJQUFJLEdBQXdCLElBQThDLENBQUMsYUFBYSxDQUFDO0lBQy9GLE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLGtDQUFrQyxDQUFDLElBQUksRUFBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzdGLElBQUcsTUFBTSxDQUFDLE9BQU8sRUFBQztRQUNkLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLE1BQU0sT0FBTyxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFDLGtDQUFrQyxHQUFFLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ3JCO1NBQUk7UUFDRCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNyQjtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDakIsQ0FBQyxDQUFBLENBQUM7QUFkVyxRQUFBLDJCQUEyQiwrQkFjdEM7QUFFSyxNQUFNLDBCQUEwQixHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUM5RSxNQUFNLElBQUksR0FBUSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUNuQyxNQUFNLHNCQUFzQixHQUE0QixJQUEwRCxDQUFDLHNCQUFzQixDQUFDO0lBQzFJLE1BQU0sSUFBSSxHQUF3QixJQUE4QyxDQUFDLGFBQWEsQ0FBQztJQUNoRyxNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxJQUFJLEVBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUM3RixJQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUM7UUFDZCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNyQjtTQUFJO1FBQ0QsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDckI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFDO0FBYlcsUUFBQSwwQkFBMEIsOEJBYXJDIn0=