export type replySlipInformationModal ={
    yearSelect: string,
    titleTC: ''
    titleEN:''
    mainContentTC:''
    mainContentEN:''
    recipientContentTC:''
    recipientContentEN:''
    payment:true
    paymentAmount:0
    //  recipient:''
}


export type distributionReplySlipModal = {
    yearSelect: '',
    id: '',
    selectOption: string,
    classSelectedOptions: string[],
    studentSelectedOptions:  studentAndTheirClass[],
}

export type studentAndTheirClass = { 
    class: '';
    studentID: '';
}
