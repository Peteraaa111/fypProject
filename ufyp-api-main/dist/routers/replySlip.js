"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupReplySlipRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const replySlip_1 = require("../controllers/replySlip");
const setupReplySlipRoutes = (router) => {
    const replySlipRouter = new koa_router_1.default({ prefix: "/api/v1/replySlip" });
    // Routers
    //replySlipRouter.post("/getStudentData", bodyParser(), getStudentData);
    replySlipRouter.post("/getAllClass", (0, koa_bodyparser_1.default)(), replySlip_1.getAllClass);
    replySlipRouter.post("/getAllClassAndStudent", (0, koa_bodyparser_1.default)(), replySlip_1.getAllClassAndStudent);
    replySlipRouter.post('/getNumStudentsWithReplySlip', (0, koa_bodyparser_1.default)(), replySlip_1.getNumStudentsWithReplySlip);
    replySlipRouter.post("/getReplySlip", (0, koa_bodyparser_1.default)(), replySlip_1.getReplySlip);
    replySlipRouter.post("/addReplySlip", (0, koa_bodyparser_1.default)(), replySlip_1.addReplySlip);
    replySlipRouter.post("/distributionReplySlip", (0, koa_bodyparser_1.default)(), replySlip_1.distributionReplySlip);
    replySlipRouter.put("/editReplySlip", (0, koa_bodyparser_1.default)(), replySlip_1.editReplySlip);
    replySlipRouter.delete("/removeReplySlip", (0, koa_bodyparser_1.default)(), replySlip_1.deleteReplySlip);
    router.use(replySlipRouter.routes());
};
exports.setupReplySlipRoutes = setupReplySlipRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbHlTbGlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcnMvcmVwbHlTbGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUFtRDtBQUNuRCxvRUFBd0M7QUFFeEMsd0RBVWtDO0FBRTNCLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxNQUEyQyxFQUFRLEVBQUU7SUFFdEYsTUFBTSxlQUFlLEdBQUcsSUFBSSxvQkFBTSxDQUE4QixFQUFFLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUM7SUFDL0YsVUFBVTtJQUVWLHdFQUF3RTtJQUN4RSxlQUFlLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSx1QkFBVyxDQUFDLENBQUM7SUFFaEUsZUFBZSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSxpQ0FBcUIsQ0FBQyxDQUFDO0lBRXBGLGVBQWUsQ0FBQyxJQUFJLENBQUMsOEJBQThCLEVBQUMsSUFBQSx3QkFBVSxHQUFFLEVBQUMsdUNBQTJCLENBQUMsQ0FBQztJQUU5RixlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFBLHdCQUFVLEdBQUUsRUFBRSx3QkFBWSxDQUFDLENBQUM7SUFFbEUsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsd0JBQVksQ0FBQyxDQUFDO0lBRWxFLGVBQWUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsSUFBQSx3QkFBVSxHQUFFLEVBQUUsaUNBQXFCLENBQUMsQ0FBQztJQUVwRixlQUFlLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFFLHlCQUFhLENBQUMsQ0FBQztJQUVuRSxlQUFlLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFHLElBQUEsd0JBQVUsR0FBRSxFQUFFLDJCQUFlLENBQUMsQ0FBQTtJQUUxRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLENBQUMsQ0FBQztBQXZCVyxRQUFBLG9CQUFvQix3QkF1Qi9CIn0=