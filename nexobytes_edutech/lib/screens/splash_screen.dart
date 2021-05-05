import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nexobytes_edutech/screens/login_screen.dart';
import 'package:nexobytes_edutech/classes/student.dart';
import 'package:nexobytes_edutech/screens/home_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shimmer/shimmer.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {

  read(String key) async {
    try{
      final result = await InternetAddress.lookup('google.com');
      if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {}
      else {
        Fluttertoast.showToast(
            msg: "No network found",
            toastLength: Toast.LENGTH_LONG,
            gravity: ToastGravity.BOTTOM,
            backgroundColor: Color(0xFFFE0000),
            textColor: Colors.white,
            fontSize: 16.0
        );
      }
    } on SocketException catch (_) {
      Fluttertoast.showToast(
          msg: "No network found",
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color(0xFFFE0000),
          textColor: Colors.white,
          fontSize: 16.0
      );
    }
    final prefs = await SharedPreferences.getInstance();
    var userData = prefs.getString(key);
    if(userData != '' && userData != null){
      Student currentStd =  Student.fromJson(json.decode(userData));
      print(currentStd);
      Navigator.of(context).push(
          MaterialPageRoute(
              builder: (BuildContext context) => HomeScreen(
                username: currentStd.username,
                name: currentStd.name,
                classId: currentStd.classId,
                className: currentStd.className,
                createdAt: currentStd.createdAt,
                createdBy: currentStd.createdBy,
              )
          )
      );
    }else {
      Navigator.of(context).push(
          MaterialPageRoute(
              builder: (BuildContext context) => LoginScreen()
          )
      );
    }

  }

  Future<void> load (){
    return Future.delayed(Duration(milliseconds: 3000)).then((value) => {
      read('auth_data')
    });
  }

  @override
  void initState() {
    super.initState();
    load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            Opacity(
              opacity: 0.5,
              child: Image.asset('assets/images/bg.png'),
            ),
            Center(
                child: Shimmer.fromColors(
                  period: Duration(milliseconds: 1000),
                  baseColor: Color(0xFF00FF00),
                  highlightColor: Color(0xFF00F8FC),
                  child: Container(
                    padding: EdgeInsets.all(16.0),
                    child: Image.asset('assets/images/full_logo.png'),
                  ),
                )
            )
          ],
        ),
      ),
    );
  }
}
