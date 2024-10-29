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
exports.pushNotification = exports.getAllNotification = exports.editNotification = exports.addNotification = void 0;
const service = __importStar(require("../services/pushNotification"));
const addNotification = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const contentTC = body.contentTC;
    const contentEN = body.contentEN;
    const titleTC = body.titleTC;
    const titleEN = body.titleEN;
    let result = yield service.addNotification(contentTC, contentEN, titleTC, titleEN);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,studentId,status+" the leave from");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.addNotification = addNotification;
const editNotification = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const contentTC = body.contentTC;
    const contentEN = body.contentEN;
    const id = body.id;
    const titleTC = body.titleTC;
    const titleEN = body.titleEN;
    let result = yield service.editNotification(id, contentTC, contentEN, titleTC, titleEN);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,studentId,status+" the leave from");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.editNotification = editNotification;
const getAllNotification = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    let result = yield service.getAllNotification();
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,studentId,status+" the leave from");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getAllNotification = getAllNotification;
const pushNotification = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedOption = body.selectedOption;
    const id = body.id;
    let result = yield service.pushNotification(selectedOption, id);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,studentId,status+" the leave from");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.pushNotification = pushNotification;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaE5vdGlmaWNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9wdXNoTm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esc0VBQXdEO0FBRWpELE1BQU0sZUFBZSxHQUFHLENBQU8sR0FBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUNuRSxNQUFNLElBQUksR0FBWSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN2QyxNQUFNLFNBQVMsR0FBWSxJQUE2QixDQUFDLFNBQVMsQ0FBQztJQUNuRSxNQUFNLFNBQVMsR0FBWSxJQUE4QixDQUFDLFNBQVMsQ0FBQztJQUNwRSxNQUFNLE9BQU8sR0FBWSxJQUEyQixDQUFDLE9BQU8sQ0FBQztJQUM3RCxNQUFNLE9BQU8sR0FBWSxJQUE0QixDQUFDLE9BQU8sQ0FBQztJQUM5RCxJQUFJLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEYsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLHlFQUF5RTtRQUN6RSxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFDO0FBaEJXLFFBQUEsZUFBZSxtQkFnQjFCO0FBR0ssTUFBTSxnQkFBZ0IsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDdEUsTUFBTSxJQUFJLEdBQVksR0FBRyxD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