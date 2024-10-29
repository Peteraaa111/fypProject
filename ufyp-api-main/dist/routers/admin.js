"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAdminRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const admin_1 = require("../controllers/admin");
const setupAdminRoutes = (router) => {
    const adminRouter = new koa_router_1.default({ prefix: "/api/v1/admin" });
    // Routers
    adminRouter.get("/getAllUser", admin_1.getAllUser);
    adminRouter.post("/resetPassword", (0, koa_bodyparser_1.default)(), admin_1.changePasswordForUser);
    adminRouter.put("/approvalLeaveForm", (0, koa_bodyparser_1.default)(), admin_1.approvalLeaveForm);
    adminRouter.get("/getAllSystemProblem", admin_1.getAllSystemProblem);
    adminRouter.get("/getAllLeaveForm", admin_1.getAllLeaveForm);
    adminRouter.get("/getAllInterestClassRegistration", admin_1.getAllInterestClassRegistration);
    adminRouter.put("/approvalInterestClassForm", (0, koa_bodyparser_1.default)(), admin_1.approvalLInterestClassegistration);
    router.use(adminRouter.routes());
};
exports.setupAdminRoutes = setupAdminRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVycy9hZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBbUQ7QUFDbkQsb0VBQXdDO0FBRXhDLGdEQVE4QjtBQUV2QixNQUFNLGdCQUFnQixHQUFHLENBQUMsTUFBMkMsRUFBUSxFQUFFO0lBRXBGLE1BQU0sV0FBVyxHQUFHLElBQUksb0JBQU0sQ0FBOEIsRUFBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUV4RixVQUFVO0lBQ1YsV0FBVyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsa0JBQVUsQ0FBQyxDQUFDO0lBRTNDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsNkJBQXFCLENBQUMsQ0FBQztJQUV4RSxXQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLHlCQUFpQixDQUFDLENBQUM7SUFFdkUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSwyQkFBbUIsQ0FBQyxDQUFDO0lBRTdELFdBQVcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsdUJBQWUsQ0FBQyxDQUFDO0lBRXJELFdBQVcsQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEVBQUUsdUNBQStCLENBQUMsQ0FBQztJQUNyRixXQUFXLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLHlDQUFpQyxDQUFDLENBQUM7SUFHL0YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUM7QUFwQlcsUUFBQSxnQkFBZ0Isb0JBb0IzQiJ9