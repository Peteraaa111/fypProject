import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/main.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/parent/parent_drawer_item.dart';
import 'package:my_app/parent/parent_home_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsPage extends StatefulWidget {

  
  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _isSwitched = false;

  @override
  void initState() {
    super.initState();
    _loadSwitchState();
  }
  

  Future<void> saveLanguageCode(String languageCode, BuildContext context) async {
    await UserApi().saveLanguageCode(jsonEncode({'userID':AppUser.id, 'languageCode':languageCode}),context);
  }

  Locale _locale = Locale('zh', 'hk');
  Future<void> _loadSwitchState() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _isSwitched = prefs.getBool('switchState') ?? false;
    });
  }

  Future<void> changeLocale(BuildContext context, String languageCode) async {
    Locale newLocale = Locale(languageCode, "");
    MyApp.setLocale(context, newLocale);
    GlobalVariable.isChineseLocale = languageCode == 'zh';
  }

  Future<void> _saveSwitchState(bool value) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool('switchState', value);
  }

  DropdownMenuItem<String> buildDropdownMenuItem(String text, String value) {
    return DropdownMenuItem(
      child: Row(
        children: [
          const Icon(Icons.translate),
          const SizedBox(width: 10),
          Text(text),
        ],
      ),
      value: value,
    );
  }

  Row buildLanguageSettingRow(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Icon(Icons.language, color: Colors.blue),
        const SizedBox(width: 5),
        Text(
          S.current.selectedLanguage,
          style: const TextStyle(fontSize: 16),
        ),
        const SizedBox(width: 25),
        DropdownButton(
          dropdownColor: Colors.white,
          underline: Container(
            height: 2,
            color: Colors.blue[300],
          ),
          icon: const Icon(Icons.arrow_drop_down, color: Colors.blue),
          onChanged: (v) async {
            setState(() {
              changeLocale(context, v.toString());
              GlobalVariable.isChineseLocale = v.toString() == 'zh';
            });
            await saveLanguageCode(v.toString(),context);
          },
          value: Localizations.localeOf(context).languageCode,
          items: [
            buildDropdownMenuItem('中文', 'zh'),
            buildDropdownMenuItem('English', 'en'),
          ],
        ),
      ],
    );
  }

  Row buildNotificationSettingRow() {
    return Row(
      children: [
        const Icon(Icons.notifications, color: Colors.blue),
        const SizedBox(width: 5),
        Text(S.current.notificationsLabel),
        Switch(
          value: _isSwitched,
          onChanged: (value) {
            setState(() {
              _isSwitched = value;
              _saveSwitchState(value);
            });
          },
          activeTrackColor: Colors.blue[300],
          activeColor: Colors.blue,
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 15.0, top: 5.0),
            child: buildLanguageSettingRow(context),
          ),
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.only(left: 15.0),
            child: buildNotificationSettingRow(),
          ),
        ],
      ),
    );
  }
}
