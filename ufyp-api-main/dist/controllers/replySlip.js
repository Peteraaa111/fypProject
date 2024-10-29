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
exports.getNumStudentsWithReplySlip = exports.getAllClassAndStudent = exports.getAllClass = exports.distributionReplySlip = exports.deleteReplySlip = exports.editReplySlip = exports.addReplySlip = exports.getReplySlip = void 0;
const service = __importStar(require("../services/replySlip"));
const getReplySlip = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const result = yield service.getReplySlip(selectedYear);
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
exports.getReplySlip = getReplySlip;
const addReplySlip = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    let result = yield service.addReplySlip(data);
    if (result.success) {
        ctx.status = 201;
        service.logMovement(actorUid, null, "Add reply slip No." + result.resultid);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.addReplySlip = addReplySlip;
const editReplySlip = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const dataID = body.dataID;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    let result = yield service.editReplySlip(dataID, data);
    if (result.success) {
        ctx.status = 201;
        service.logMovement(actorUid, null, "Edit reply slip No." + dataID);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.editReplySlip = editReplySlip;
const deleteReplySlip = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const dataID = body.id;
    const selectedYear = body.selectedYear;
    const actorUid = body.CurrentUserUid;
    let result = yield service.deleteReplySlip(dataID, selectedYear);
    if (result.success) {
        ctx.status = 201;
        service.logMovement(actorUid, null, "Edit reply slip No." + dataID);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.deleteReplySlip = deleteReplySlip;
const distributionReplySlip = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    console.log(data);
    let result = yield service.distributionReplySlip(data);
    if (result.success) {
        ctx.status = 201;
        service.logMovement(actorUid, null, "Distribute reply slip No." + data.id);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.distributionReplySlip = distributionReplySlip;
const getAllClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const result = yield service.getAllClass(selectedYear);
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
exports.getAllClass = getAllClass;
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
const getNumStudentsWithReplySlip = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const replySlipId = body.replySlipId;
    const result = yield service.getNumStudentsWithReplySlip(selectedYear, replySlipId);
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
exports.getNumStudentsWithReplySlip = getNumStudentsWithReplySlip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbHlTbGlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL3JlcGx5U2xpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLCtEQUFpRDtBQU0xQyxNQUFNLFlBQVksR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDaEUsTUFBTSxJQUFJLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkMsTUFBTSxZQUFZLEdBQVksSUFBd0IsQ0FBQyxJQUFJLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hELElBQUcsTUFBTSxDQUFDLE9BQU8sRUFBQztRQUNkLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztLQUMxQjtTQUFJO1FBQ0QsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDckI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFDO0FBWlcsUUFBQSxZQUFZLGdCQVl2QjtBQUVLLE1BQU0sWUFBWSxHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUNoRSxNQUFNLElBQUksR0FBWSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN2QyxNQUFNLElBQUksR0FBK0IsSUFBNEMsQ0FBQyxJQUFJLENBQUM7SUFDM0YsTUFBTSxRQUFRLEdBQVksSUFBbUMsQ0FBQyxjQUFjLENBQUM7SUFDN0UsSUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLElB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