export type activityPhotoModal = {
    activityName: string
    activityID:string
    year:string
    activityMonth:string
    filePath:string
}

export type addActivityModal ={
    yearSelect: string,
    activityName: string,
    photoDate: string,
    activityDate:string
}


export type editUploadImageModal = {
    activityName: string
    activityID:string
    year:string
    activityMonth:string
    filePath:string
    imageID:string
    imageName:string
}
