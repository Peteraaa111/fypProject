"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupYearlySetupRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const yearlySetup_1 = require("../controllers/yearlySetup");
const setupYearlySetupRoutes = (router) => {
    const yearlyRouter = new koa_router_1.default({ prefix: "/api/v1/yearlySetup" });
    yearlyRouter.post("/createPhotoCollection", (0, koa_bodyparser_1.default)(), yearlySetup_1.createPhotoCollection);
    yearlyRouter.post("/createYearlyAttendance", (0, koa_bodyparser_1.default)(), yearlySetup_1.createYearlyAttendance);
    yearlyRouter.delete("/deleteAttendanceCollection", (0, koa_bodyparser_1.default)(), yearlySetup_1.deleteAttendanceCollection);
    router.use(yearlyRouter.routes());
};
exports.setupYearlySetupRoutes = setupYearlySetupRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhcmx5U2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVycy95ZWFybHlTZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBbUQ7QUFDbkQsb0VBQXdDO0FBRXhDLDREQUlvQztBQUU3QixNQUFNLHNCQUFzQixHQUFHLENBQUMsTUFBMkMsRUFBUSxFQUFFO0lBRTFGLE1BQU0sWUFBWSxHQUFHLElBQUksb0JBQU0sQ0FBOEIsRUFBRSxNQUFNLEVBQUUscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO0lBRWhHLFlBQVksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsbUNBQXFCLENBQUMsQ0FBQztJQUVqRixZQUFZLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLG9DQUFzQixDQUFDLENBQUM7SUFFbkYsWUFBWSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSx3Q0FBMEIsQ0FBQyxDQUFDO0lBRTdGLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBWFcsUUFBQSxzQkFBc0IsMEJBV2pDIn0=