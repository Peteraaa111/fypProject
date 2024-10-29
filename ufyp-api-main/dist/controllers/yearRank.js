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
exports.distributeNextYearClass = exports.generateRank = exports.getStudentRankByYear = void 0;
const service = __importStar(require("../services/yearRank"));
const getStudentRankByYear = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const yearSelectValue = body.year;
    let result = yield service.getStudentRankByYear(yearSelectValue);
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
exports.getStudentRankByYear = getStudentRankByYear;
const generateRank = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    const yearSelectValue = body.yearSelectValue;
    let result = yield service.generateRank(data, yearSelectValue);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,userId,"reset user password");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.generateRank = generateRank;
const distributeNextYearClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    console.log(data);
    let result = yield service.distributeNextYearClass(data);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,userId,"reset user password");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.distributeNextYearClass = distributeNextYearClass;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhclJhbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlcnMveWVhclJhbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSw4REFBZ0Q7QUFPekMsTUFBTSxvQkFBb0IsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDeEUsTUFBTSxJQUFJLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkMsTUFBTSxlQUFlLEdBQVksSUFBc0IsQ0FBQyxJQUFJLENBQUM7SUFDN0QsSUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDakUsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO1NBQU07UUFDTCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDakIsQ0FBQyxDQUFBLENBQUM7QUFaVyxRQUFBLG9CQUFvQix3QkFZL0I7QUFFSyxNQUFNLFlBQVksR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDaEUsTUFBTSxJQUFJLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkMsTUFBTSxJQUFJLEdBQXFCLElBQWlDLENBQUMsSUFBSSxDQUFDO0lBQ3RFLE1BQU0sUUFBUSxHQUFZLElBQW1DLENBQUMsY0FBYyxDQUFDO0lBQzdFLE1BQU0sZUFBZSxHQUFZLElBQWlDLENBQUMsZUFBZSxDQUFDO0lBQ25GLElBQUksTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUMsZUFBZSxDQUFDLENBQUM7SUFDOUQsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLG1FQUFtRTtRQUNuRSxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFDO0FBZlcsUUFBQSxZQUFZLGdCQWV2QjtBQUVLLE1BQU0sdUJBQXVCLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQzNFLE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLE1BQU0sSUFBSSxHQUFvQyxJQUFnRCxDQUFDLElBQUksQ0FBQztJQUNwRyxNQUFNLFFBQVEsR0FBWSxJQUFtQyxDQUFDLGNBQWMsQ0FBQztJQUM3RSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLElBQUksTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNsQixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixtRUFBbUU7UUFDbkUsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7U0FBTTtRQUNMLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNqQixDQUFDLENBQUEsQ0FBQztBQWZXLFFBQUEsdUJBQXVCLDJCQWVsQyJ9