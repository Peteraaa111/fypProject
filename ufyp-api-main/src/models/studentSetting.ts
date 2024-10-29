export type studentRewardModal ={
    studentID:string;
    studentClass:string;
    studentEngName:string;
    studentChiName:string;
}

export type applyRewardData = {
    filePath:string;
    selectedYear:string;
    studentClass:string;
    studentId:string;
    CurrentUserUid:string;
}

export type reward ={
    rewardNameTC:string;
    rewardNameEN:string
}


export type applyInterestClassData = {
    selectedYear:string;
    studentClass:string;
    studentId:string;
    CurrentUserUid:string;
}


export type interClassIdGroup = {
    interestClassName:string
}
