import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:my_app/api/firebase_api.dart';
import 'package:my_app/common/settings.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/pages/auth_page.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:my_app/parent/parent_drawer_item.dart';
import 'package:my_app/parent/parent_home_page.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:my_app/firebase_options.dart';
import 'package:my_app/generated/l10n.dart';


Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message)async {
  await Firebase.initializeApp();
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Stripe.merchantIdentifier = 'hello';
  await Stripe.instance.applySettings();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const MyApp());
}

class MyApp extends StatefulWidget  {
  const MyApp({Key? key}) : super(key: key);


  // This widget is the root of your application.
  static void setLocale(BuildContext context, Locale newLocale) async {
    _MyAppState? state = context.findAncestorStateOfType<_MyAppState>();

    var prefs = await SharedPreferences.getInstance();
    prefs.setString('languageCode', newLocale.languageCode);
    prefs.setString('countryCode', "");

    state?.setState(() {
      state._locale = newLocale;
    });
  }

  @override
  _MyAppState createState() => _MyAppState();
}


class _MyAppState extends State<MyApp> {
  Locale _locale = Locale('zh', 'hk');
  // FirebaseApi notificationServices = FirebaseApi();

  @override
  void initState() {
    super.initState();
    //notificationServices.initLocalNotifications(context);
    // notificationServices.requestNotificationPermission();
    // notificationServices.firebaseInit(context);
    // notificationServices.forgroundMessage();
    // notificationServices.setupInteractMessage(context);
    this._fetchLocale().then((locale) {
      setState(() {
        this._locale = locale;
        GlobalVariable.isChineseLocale = locale.languageCode == 'zh';
      });
    });
  }

  Future<Locale> _fetchLocale() async {
    var prefs = await SharedPreferences.getInstance();

    String languageCode = prefs.getString('languageCode') ?? 'zh';
    String countryCode = prefs.getString('countryCode') ?? 'hk';

    return Locale(languageCode, countryCode);
  }


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      locale: _locale,
      localizationsDelegates: const [
        S.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        const FallbackCupertinoLocalisationsDelegate(),
      ],
      supportedLocales: [
        const Locale('en', ''), // English, no country code
        const Locale('zh', ''),
      ],
      theme: ThemeData(
        primarySwatch: Colors.deepPurple, textSelectionTheme: TextSelectionThemeData(selectionColor: Colors.grey, selectionHandleColor: Colors.grey),
        bottomSheetTheme: BottomSheetThemeData(backgroundColor: Colors.transparent ),
      ),
      // home: GlobalVariable.isSettingPage ? parentHomePage(key: UniqueKey(),currentPage: ParentDrawerSections.settings,title:S.current.settings) : AuthPage(),
      home: AuthPage(),
    );
  }

}


class FallbackCupertinoLocalisationsDelegate extends LocalizationsDelegate<CupertinoLocalizations> {
  const FallbackCupertinoLocalisationsDelegate();

  @override
  bool isSupported(Locale locale) => true;

  @override
  Future<CupertinoLocalizations> load(Locale locale) =>
      DefaultCupertinoLocalizations.load(locale);

  @override
  bool shouldReload(FallbackCupertinoLocalisationsDelegate old) => false;
}