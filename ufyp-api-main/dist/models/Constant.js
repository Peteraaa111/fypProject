"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantYear = void 0;
class ConstantYear {
}
exports.ConstantYear = ConstantYear;
ConstantYear.now = new Date();
ConstantYear.currentYear = ConstantYear.now.getFullYear() >= 2024 && ConstantYear.now.getMonth() >= 6 ? 2024 : 2023;
ConstantYear.nextYear = ConstantYear.currentYear + 1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc3RhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL0NvbnN0YW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQWEsWUFBWTs7QUFBekIsb0NBSUM7QUFIVSxnQkFBRyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsd0JBQVcsR0FBVyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLElBQUksSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDL0cscUJBQVEsR0FBVyxZQUFZLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyJ9