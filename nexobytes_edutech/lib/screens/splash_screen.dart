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
    return Material(
      child: Container(
        width: MediaQuery.of(context).size.width,
        height: MediaQuery.of(context).size.height,
        decoration: BoxDecoration(
            color: Color(0xFF0000EE)
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(16.0),
              child: Image.asset('assets/images/splash_logo.png'),
            ),
            Text('Nexobytes',
              style: TextStyle(
                  fontFamily: 'Nunito',
                  color: Colors.white,
                  fontSize: 26
              ),
            )
          ],
        ),
      ),
    );
  }
}
