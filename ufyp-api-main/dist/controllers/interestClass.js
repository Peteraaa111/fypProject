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
exports.editInterestClassStatus = exports.editInterestClassDocument = exports.getAllInterestClassGroup = exports.createInterestClassDocument = exports.getAllStudentInterestClass = exports.getAllClassAndStudentInterest = void 0;
const service = __importStar(require("../services/interestClass"));
const getAllClassAndStudentInterest = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const result = yield service.getAllClassAndStudentInterest(selectedYear);
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
exports.getAllClassAndStudentInterest = getAllClassAndStudentInterest;
const getAllStudentInterestClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const result = yield service.getAllStudentInterestClass(selectedYear);
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
exports.getAllStudentInterestClass = getAllStudentInterestClass;
const createInterestClassDocument = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const selectedYear = body.selectedYear;
    const CurrentUserUid = body.CurrentUserUid;
    const result = yield service.createInterestClassDocument(data, selectedYear);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(CurrentUserUid, result.documentId, "add new inteest class");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.createInterestClassDocument = createInterestClassDocument;
const getAllInterestClassGroup = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    const result = yield service.getAllInterestClassGroup(selectedYear);
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
exports.getAllInterestClassGroup = getAllInterestClassGroup;
const editInterestClassDocument = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const selectedYear = body.selectedYear;
    const CurrentUserUid = body.CurrentUserUid;
    const result = yield service.editInterestClassDocument(data, selectedYear);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(CurrentUserUid, result.documentId, "Edit inteest class information");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.editInterestClassDocument = editInterestClassDocument;
const editInterestClassStatus = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const status = body.status;
    const selectedYear = body.selectedYear;
    const id = body.id;
    const CurrentUserUid = body.CurrentUserUid;
    const result = yield service.editInterestClassStatus(status, selectedYear, id);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(CurrentUserUid, result.documentId, "Edit inteest class information status To " + status);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.editInterestClassStatus = editInterestClassStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJlc3RDbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9pbnRlcmVzdENsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUVBQXFEO0FBTzlDLE1BQU0sNkJBQTZCLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQ2pGLE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLE1BQU0sWUFBWSxHQUFZLElBQXdCLENBQUMsSUFBSSxDQUFDO0lBQzVELE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLDZCQUE2QixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3pFLElBQUcsTUFBTSxDQUFDLE9BQU8sRUFBQztRQUNkLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztLQUMxQjtTQUFJO1FBQ0QsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDckI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFDO0FBWlcsUUFBQSw2QkFBNkIsaUNBWXhDO0FBR0ssTUFBTSwwQkFBMEIsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDOUUsTUFBTSxJQUFJLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkMsTUFBTSxZQUFZLEdBQVksSUFBd0IsQ0FBQyxJQUFJLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsMEJBQTBCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEUsSUFBRyxNQUFNLENBQUMsT0FBTyxFQUFDO1FB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