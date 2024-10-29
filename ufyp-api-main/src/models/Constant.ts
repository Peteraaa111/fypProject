export class ConstantYear {
    static now: Date = new Date();
    static currentYear: number = ConstantYear.now.getFullYear() >= 2024 && ConstantYear.now.getMonth() >= 6 ? 2024 : 2023;
    static nextYear: number = ConstantYear.currentYear + 1;
}