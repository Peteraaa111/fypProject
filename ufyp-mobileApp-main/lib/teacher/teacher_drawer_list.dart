import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:my_app/common/settings.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/pages/auth_page.dart';
import 'package:my_app/pages/login_page.dart';
import 'package:my_app/teacher/teacher_drawer_item.dart';



import '../common/contacts.dart';
import '../pages/dashboard.dart';
import '../pages/notifications.dart';

class MenuItem extends StatelessWidget {
  final String title;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  const MenuItem({
    Key? key,
    required this.title,
    required this.icon,
    required this.selected,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? Colors.grey[300] : Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: Row(
            children: [
              Expanded(
                child: Icon(
                  icon,
                  size: 20,
                  color: Colors.black,
                ),
              ),
              Expanded(
                flex: 5,
                child: Text(
                  title,
                  style: const TextStyle(
                    color: Colors.black,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MyDrawerList extends StatelessWidget {
  final TeacherDrawerSections currentPage;
  final Function(TeacherDrawerSections,String) onMenuItemTap;

  const MyDrawerList({
    Key? key,
    required this.currentPage,
    required this.onMenuItemTap,
  }) : super(key: key);
  
  Future<void> signUserOut(BuildContext context) async {
    Student.clear();
    //await FirebaseAuth.instance.signOut();
    FirebaseAuth.instance.signOut().then((dynamic) {
      Navigator.pushReplacement(
      context,
        MaterialPageRoute(builder: (context) => AuthPage()),
      );
    }).catchError((e, s) {
        print(e);
        print(s);
    });

  }


  @override
  Widget build(BuildContext context) {


    return Container(
      padding: const EdgeInsets.only(
        top: 15,
      ),
      child: Column(
        // shows the list of menu drawer
        children: [
          MenuItem(
            title: S.current.dashboard,
            icon: Icons.dashboard_outlined,
            selected: currentPage == TeacherDrawerSections.dashboard,
            onTap: () => onMenuItemTap(TeacherDrawerSections.dashboard,S.current.dashboard),
          ),

          MenuItem(
            title: S.current.chatContact,
            icon: Icons.chat_outlined,
            selected: currentPage == TeacherDrawerSections.chatContact,
            onTap: () => onMenuItemTap(TeacherDrawerSections.chatContact, S.current.chatContact),
          ),

          Divider(
            color: Colors.grey[400], // Change this to your preferred color
            thickness: 1, // Increase this to make the divider bolder
          ),

          ListTile(
            title: Text(
              S.current.classManagement,
              style: TextStyle(
                color: Colors.grey, // Change this to your preferred color
                fontSize: 16,
              ),
            ),
          ),

          MenuItem(
            title: S.current.classAttendance,
            icon: Icons.edit_note_outlined,
            selected: currentPage == TeacherDrawerSections.classAttendance,
            onTap: () => onMenuItemTap(TeacherDrawerSections.classAttendance, S.current.classAttendance),
          ),


          MenuItem(
            title: S.current.teacherAddClassHW,
            icon: Icons.add_home_work_outlined,
            selected: currentPage == TeacherDrawerSections.classHomework,
            onTap: () => onMenuItemTap(TeacherDrawerSections.classHomework, S.current.teacherAddClassHW),
          ),

          MenuItem(
            title: S.current.checkGrade,
            icon: Icons.grade,
            selected: currentPage == TeacherDrawerSections.checkGrade,
            onTap: () => onMenuItemTap(TeacherDrawerSections.checkGrade, S.current.checkGrade),
          ),


          MenuItem(
            title: S.current.seat,
            icon: Icons.text_snippet,
            selected: currentPage == TeacherDrawerSections.seatPlan,
            onTap: () => onMenuItemTap(TeacherDrawerSections.seatPlan,  S.current.seat),
          ),


 
          

          

          Divider(
            color: Colors.grey[400], // Change this to your preferred color
            thickness: 1, // Increase this to make the divider bolder
          ),



          ListTile(
            title: Text(
              S.current.schoolInfo,
              style: TextStyle(
                color: Colors.grey, // Change this to your preferred color
                fontSize: 16,
              ),
            ),
          ),

          MenuItem(
            title: S.current.schoolPhoto,
            icon: Icons.photo_outlined,
            selected: currentPage == TeacherDrawerSections.schoolPhoto,
            onTap: () => onMenuItemTap(TeacherDrawerSections.schoolPhoto,S.current.schoolPhoto),
          ),


          Divider(
            color: Colors.grey[400], // Change this to your preferred color
            thickness: 1, // Increase this to make the divider bolder
          ),

          ListTile(
            title: Text(
              S.current.settings,
              style: TextStyle(
                color: Colors.grey, // Change this to your preferred color
                fontSize: 16,
              ),
            ),
          ),


          // MenuItem(
          //   title: S.current.informationSetting,
          //   icon: Icons.person_outline,
          //   selected: currentPage == TeacherDrawerSections.informationSetting,
          //   onTap: () => onMenuItemTap(TeacherDrawerSections.informationSetting,S.current.informationSetting),
          // ),
          MenuItem(
            title: S.current.settings,
            icon: Icons.settings_outlined,
            selected: currentPage == TeacherDrawerSections.settings,
            onTap: () => onMenuItemTap(TeacherDrawerSections.settings,S.current.settings),
          ),
          Divider(
            color: Colors.grey[400], // Change this to your preferred color
            thickness: 1, // Increase this to make the divider bolder
          ),
          ListTile(
            title: Text(
              S.current.supportAndContact,
              style: TextStyle(
                color: Colors.grey, // Change this to your preferred color
                fontSize: 16,
              ),
            ),
          ),
          MenuItem(
            title: S.current.contacts,
            icon: Icons.people_alt_outlined,
            selected: currentPage == TeacherDrawerSections.contacts,
            onTap: () => onMenuItemTap(TeacherDrawerSections.contacts,S.current.contacts),
          ),
          MenuItem(
            title: S.current.help,
            icon: Icons.help_outline_outlined,
            selected: currentPage == TeacherDrawerSections.helpPage,
            onTap: () => onMenuItemTap(TeacherDrawerSections.helpPage,S.current.help),
          ),


          Divider(
            color: Colors.grey[400], // Change this to your preferred color
            thickness: 1, // Increase this to make the divider bolder
          ),
          ListTile(
            title: Text(
              S.current.logout,
              style: TextStyle(
                color: Colors.grey, // Change this to your preferred color
                fontSize: 16,
              ),
            ),
          ),
          MenuItem(
            title: S.current.logout,
            icon: Icons.logout_outlined,
            selected: currentPage == TeacherDrawerSections.logout,
            onTap: () => signUserOut(context),
          ),
        ],
      ),
    );
  }
}