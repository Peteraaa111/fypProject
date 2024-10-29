class AppUser{
  static String id='';
  static String role='';
  static String currentClass = '';
}


class Student extends AppUser{
  static String sChiName='';
  static String parentName='';
  static String sBorn='';
  static String sAge='';
  static String sIdNumber='';
  static String sEngName='';
  static String homeAddress='';
  static String parentPhoneNumber='';
  static String sGender='';



  static void setProperties(Map<String, dynamic> res) {
    sChiName = res['studentData']['s_ChiName'];
    parentName = res['studentData']['parent_Name'];
    AppUser.id = res['studentData']['s_Id'];
    sBorn = res['studentData']['s_Born'];
    sAge = res['studentData']['s_Age'];
    sIdNumber = res['studentData']['s_IdNumber'];
    sEngName = res['studentData']['s_EngName'];
    homeAddress = res['studentData']['home_Address'];
    parentPhoneNumber = res['studentData']['parent_PhoneNumber'];
    sGender = res['studentData']['s_Gender'];
    AppUser.currentClass = res['studentData']['s_CurrentClass'];
    AppUser.role = 'Student';
  }

  static void printStudent() {
    print('sChiName: $sChiName');
    print('parentName: $parentName');
    //print('sId: $AppUser.id');
    print('sBorn: $sBorn');
    print('sAge: $sAge');
    print('sIdNumber: $sIdNumber');
    //print('graduate: $graduate');
    print('sEngName: $sEngName');
    print('homeAddress: $homeAddress');
    print('parentPhoneNumber: $parentPhoneNumber');
    //print('currentClass: $currentClass');
    print('sGender: $sGender');
  }

  static void clear() {
      sChiName = '';
      parentName = '';
      AppUser.id = '';
      sBorn = '';
      sAge = '';
      sIdNumber = '';
      //graduate = '';
      sEngName = '';
      homeAddress = '';
      parentPhoneNumber = '';
      sGender = '';
      AppUser.currentClass = '';
      AppUser.role = '';
  }

    
}

class Teacher extends AppUser {
  static String home_Address='';
  static String t_ChiName='';
  static String t_EngName='';
  static String t_gender='';
  static String t_phoneNumber ='';


  static void setProperties(Map<String, dynamic> res) {
    t_ChiName = res['teacherData']['t_ChiName'];
    t_EngName = res['teacherData']['t_EngName'];
    AppUser.id = res['teacherData']['t_Id'];
    home_Address = res['teacherData']['home_Address'];
    t_gender = res['teacherData']['t_gender'];
    t_phoneNumber = res['teacherData']['t_phoneNumber'];
    AppUser.currentClass = res['teacherData']['s_CurrentClass'];
    AppUser.role = 'Teacher';
  }

    static void clear() {
      t_ChiName = '';
      t_EngName = '';
      AppUser.id = '';
      home_Address = '';
      t_gender = '';
      t_phoneNumber = '';
      AppUser.currentClass = '';
      AppUser.role = '';
  }


}