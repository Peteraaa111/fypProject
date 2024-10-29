"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupYearRankRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const yearRank_1 = require("../controllers/yearRank");
const setupYearRankRoutes = (router) => {
    const yearRankRouter = new koa_router_1.default({ prefix: "/api/v1/yearlyRank" });
    // Routers
    yearRankRouter.post("/getStudentRankByYear", (0, koa_bodyparser_1.default)(), yearRank_1.getStudentRankByYear);
    //yearRankRouter.post("/resetPassword", bodyParser(), changePasswordForUser); 
    yearRankRouter.post("/generateRank", (0, koa_bodyparser_1.default)(), yearRank_1.generateRank);
    yearRankRouter.post("/distributeNextYearClass", (0, koa_bodyparser_1.default)(), yearRank_1.distributeNextYearClass);
    router.use(yearRankRouter.routes());
};
exports.setupYearRankRoutes = setupYearRankRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhclJhbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVycy95ZWFyUmFuay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBbUQ7QUFDbkQsb0VBQXdDO0FBRXhDLHNEQUlpQztBQUUxQixNQUFNLG1CQUFtQixHQUFHLENBQUMsTUFBMkMsRUFBUSxFQUFFO0lBRXZGLE1BQU0sY0FBYyxHQUFHLElBQUksb0JBQU0sQ0FBOEIsRUFBQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO0lBRWhHLFVBQVU7SUFDVixjQUFjLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLElBQUEsd0JBQVUsR0FBRSxFQUFDLCtCQUFvQixDQUFDLENBQUM7SUFFaEYsOEVBQThFO0lBQzlFLGNBQWMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLHVCQUFZLENBQUMsQ0FBQztJQUUvRCxjQUFjLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFDLElBQUEsd0JBQVUsR0FBRSxFQUFDLGtDQUF1QixDQUFDLENBQUM7SUFHckYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFkVyxRQUFBLG1CQUFtQix1QkFjOUIifQ==