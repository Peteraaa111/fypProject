import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:my_app/common/settings.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/pages/auth_page.dart';
import 'package:my_app/pages/login_page.dart';
import 'package:my_app/parent/informationSetting/parent_information_setting.dart';
import 'package:my_app/parent/parent_drawer_item.dart';

import 'parent_home_page.dart';

import '../common/contacts.dart';
import '../pages/dashboard.dart';
import 'parent_drawer_header.dart';
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
  final ParentDrawerSections currentPage;
  final Function(ParentDrawerSections,String) onMenuItemTap;

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
            selected: currentPage == ParentDrawerSections.dashboard,
            onTap: () => onMenuItemTap(ParentDrawerSections.dashboard,S.current.dashboard),
          ),
          MenuItem(
            title: S.current.notifications,
            icon: Icons.notifications_outlined,
            selected: currentPage == ParentDrawerSections.notifications,
            onTap: () => onMenuItemTap(ParentDrawerSections.notifications, S.current.notifications),
          ),

          MenuItem(
            title: S.current.chatContact,
            icon: Icons.chat_outlined,
            selected: currentPage == ParentDrawerSections.chatContact,
            onTap: () => onMenuItemTap(ParentDrawerSections.chatContact, S.current.chatContact),
          ),

          Divider(
            color: Colors.grey[400], // Change this to your preferred color
            thickness: 1, // Increase this to make the divider bolder
          ),
          
          ListTile(
            title: Text(
              S.current.studentInformation,
              style: TextStyle(
                color: Colors.grey, // Change this to your preferred color
                fontSize: 16,
              ),
            ),
          ),

          MenuItem(
            title: S.current.classHomework,
            icon: Icons.home_work_outlined,
            selected: currentPage == ParentDrawerSections.classHomework,
            onTap: () => onMenuItemTap(ParentDrawerSections.classHomework,S.current.classHomework),
          ),

          MenuItem(
            title: S.current.rewardPage,
            icon: Icons.assessment_outlined,
            selected: currentPage == ParentDrawerSections.reward,
            onTap: () => onMenuItemTap(ParentDrawerSections.reward,S.current.rewardPage),
          ),

          MenuItem(
            title: S.current.ViewInterestClass,
            icon: Icons.list_outlined,
            selected: currentPage == ParentDrawerSections.interestClass,
            onTap: () => onMenuItemTap(ParentDrawerSections.interestClass,S.current.ViewInterestClass),
          ),

          MenuItem(
            title: S.current.applyLeavePage,
            icon: Icons.history_outlined,
            selected: currentPage == ParentDrawerSections.applylLeave,
            onTap: () => onMenuItemTap(ParentDrawerSections.applylLeave,S.current.applyLeavePage),
          ),
          MenuItem(
            title: S.current.attendanceCheck,
            icon: Icons.date_range_outlined,
            selected: currentPage == ParentDrawerSections.attendanceCheck,
            onTap: () => onMenuItemTap(ParentDrawerSections.attendanceCheck,S.current.attendanceCheck),
          ),
          MenuItem(
            title: S.current.gradeCheck,
            icon: Icons.grade_outlined,
            selected: currentPage == ParentDrawerSections.gradeCheck,
            onTap: () => onMenuItemTap(ParentDrawerSections.gradeCheck,S.current.gradeCheck),
          ),
          MenuItem(
            title: S.current.seat,
            icon: Icons.table_restaurant_outlined,
            selected: currentPage == ParentDrawerSections.classSeat,
            onTap: () => onMenuItemTap(ParentDrawerSections.classSeat,S.current.seat),
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
            selected: currentPage == ParentDrawerSections.schoolPhoto,
            onTap: () => onMenuItemTap(ParentDrawerSections.schoolPhoto,S.current.schoolPhoto),
          ),

          MenuItem(
            title: S.current.replySlip,
            icon: Icons.note_outlined,
            selected: currentPage == ParentDrawerSections.replySlip,
            onTap: () => onMenuItemTap(ParentDrawerSections.replySlip,S.current.replySlip),
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


          MenuItem(
            title: S.current.informationSetting,
            icon: Icons.person_outline,
            selected: currentPage == ParentDrawerSections.informationSetting,
            onTap: () => onMenuItemTap(ParentDrawerSections.informationSetting,S.current.informationSetting),
          ),
          MenuItem(
            title: S.current.settings,
            icon: Icons.settings_outlined,
            selected: currentPage == ParentDrawerSections.settings,
            onTap: () => onMenuItemTap(ParentDrawerSections.settings,S.current.settings),
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
            selected: currentPage == ParentDrawerSections.contacts,
            onTap: () => onMenuItemTap(ParentDrawerSections.contacts,S.current.contacts),
          ),
          MenuItem(
            title: S.current.help,
            icon: Icons.help_outline_outlined,
            selected: currentPage == ParentDrawerSections.helpPage,
            onTap: () => onMenuItemTap(ParentDrawerSections.helpPage,S.current.help),
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
            selected: currentPage == ParentDrawerSections.logout,
            onTap: () => signUserOut(context),
          ),
        ],
      ),
    );
  }
}