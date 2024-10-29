export type ParentRegister = {
  s_Id:string;
  s_EngName: string;
  s_ChiName: string;
  s_Gender: string;
  s_Age:string;
  s_Born:string;
  s_idcardNumber:string;
  parent_Name:string;
  parent_PhoneNumber:string;
  home_Address:string;
  email: string;
  password: string;
  //role: string;
  graduate: boolean; 
};

export type TeacherRegister = {
  t_Id:string;
  t_ChiName:string;
  t_EngName:string;
  t_Gender: string;
  t_phoneNumber:string;
  home_Address:string;
  email: string;
  password: string;
  leave:boolean;
  index:number;
}

export type AdminRegsiter = {
  a_Id:string;
  a_Name:string;
  email: string;
  password: string;
}


export type userEditModal = {
  s_ChiName:string;
  s_EngName:string;
  home_Address:string;
  s_Age:string;
  parent_Name:string;
  s_Id:string;
}
