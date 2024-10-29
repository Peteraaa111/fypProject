"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupInterestClassRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const interestClass_1 = require("../controllers/interestClass");
const setupInterestClassRoutes = (router) => {
    const interestClassRouter = new koa_router_1.default({ prefix: "/api/v1/interestClass" });
    interestClassRouter.post("/getAllInterestClassGroup", (0, koa_bodyparser_1.default)(), interestClass_1.getAllInterestClassGroup);
    interestClassRouter.post("/getAllClassAndStudentInterest", (0, koa_bodyparser_1.default)(), interestClass_1.getAllClassAndStudentInterest);
    interestClassRouter.post("/getAllStudentInterestClass", (0, koa_bodyparser_1.default)(), interestClass_1.getAllStudentInterestClass);
    interestClassRouter.post("/addInterestClass", (0, koa_bodyparser_1.default)(), interestClass_1.createInterestClassDocument);
    interestClassRouter.put("/editInterestClass", (0, koa_bodyparser_1.default)(), interestClass_1.editInterestClassDocument);
    interestClassRouter.put("/editInterestClassStatus", (0, koa_bodyparser_1.default)(), interestClass_1.editInterestClassStatus);
    router.use(interestClassRouter.routes());
};
exports.setupInterestClassRoutes = setupInterestClassRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJlc3RDbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXJzL2ludGVyZXN0Q2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQW1EO0FBQ25ELG9FQUF3QztBQUV4QyxnRUFRc0M7QUFFL0IsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLE1BQTJDLEVBQVEsRUFBRTtJQUU1RixNQUFNLG1CQUFtQixHQUFHLElBQUksb0JBQU0sQ0FBOEIsRUFBRSxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO0lBR3pHLG1CQUFtQixDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBQyxJQUFBLHdCQUFVLEdBQUUsRUFBQyx3Q0FBd0IsQ0FBQyxDQUFDO0lBRzVGLG1CQUFtQixDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSw2Q0FBNkIsQ0FBQyxDQUFDO0lBRXhHLG1CQUFtQixDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSwwQ0FBMEIsQ0FBQyxDQUFDO0lBRWxHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSwyQ0FBMkIsQ0FBQyxDQUFDO0lBRXpGLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSx5Q0FBeUIsQ0FBQyxDQUFDO0lBRXZGLG1CQUFtQixDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSx1Q0FBdUIsQ0FBQyxDQUFDO0lBRzNGLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMzQyxDQUFDLENBQUM7QUFwQlcsUUFBQSx3QkFBd0IsNEJBb0JuQyJ9