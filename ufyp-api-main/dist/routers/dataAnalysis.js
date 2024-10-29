"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDataAnalysisRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const dataAnalysis_1 = require("../controllers/dataAnalysis");
const setupDataAnalysisRoutes = (router) => {
    const dataAnalysisRouter = new koa_router_1.default({ prefix: "/api/v1/dataAnalysis" });
    dataAnalysisRouter.post("/searchAttendance", (0, koa_bodyparser_1.default)(), dataAnalysis_1.searchAttendance);
    dataAnalysisRouter.post("/searchExamRecord", (0, koa_bodyparser_1.default)(), dataAnalysis_1.searchExamRecord);
    router.use(dataAnalysisRouter.routes());
};
exports.setupDataAnalysisRoutes = setupDataAnalysisRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YUFuYWx5c2lzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcnMvZGF0YUFuYWx5c2lzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUFtRDtBQUNuRCxvRUFBd0M7QUFFeEMsOERBR3FDO0FBRTlCLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxNQUEyQyxFQUFRLEVBQUU7SUFFM0YsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLG9CQUFNLENBQThCLEVBQUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztJQUd0RyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsK0JBQWdCLENBQUMsQ0FBQztJQUU3RSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsK0JBQWdCLENBQUMsQ0FBQztJQUc3RSxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDMUMsQ0FBQyxDQUFDO0FBWFcsUUFBQSx1QkFBdUIsMkJBV2xDIn0=