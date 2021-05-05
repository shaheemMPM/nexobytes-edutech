import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nexobytes_edutech/animations/fade_animation.dart';
import 'package:nexobytes_edutech/classes/error.dart';
import 'package:nexobytes_edutech/classes/shared_preference.dart';
import 'package:nexobytes_edutech/classes/student.dart';
import 'package:nexobytes_edutech/screens/home_screen.dart';
import 'package:http/http.dart' as http;

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {

  final _userNameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool isLoading = false;
  SharedPref sharedPref = SharedPref();

  Future<bool> _onWillPop() {
    showDialog(context: context,
        builder: (context) => AlertDialog(
          title: Text('Are you sure?'),
          content: Text('Do you want to exit the app'),
          actions: [
            TextButton(onPressed: () => Navigator.of(context).pop(false),
                child: Text('No')),
            TextButton(onPressed: () => SystemNavigator.pop(),
                child: Text('Yes'))
          ],
        ));
      return Future.value(false);
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: WillPopScope(
          onWillPop: _onWillPop,
          child: isLoading ? Center(child: CircularProgressIndicator()) :
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                SizedBox(height: 130.0),
                Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    Column(
                      children: <Widget>[
                        FadeAnimation(1, Text("Login", style: TextStyle(
                            fontSize: 30,
                            fontWeight: FontWeight.bold
                        ),)),
                        SizedBox(height: 20.0),
                        FadeAnimation(1.2, Text("Login to your account", style: TextStyle(
                            fontSize: 15,
                            color: Colors.grey[700]
                        ),)),
                        SizedBox(height: 20.0),
                      ],
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 40),
                      child: Column(
                        children: <Widget>[
                          FadeAnimation(1.2, makeInput(label: "Username", control: _userNameController)),
                          FadeAnimation(1.3, makeInput(label: "Password", control: _passwordController, obscureText: true)),
                        ],
                      ),
                    ),
                    FadeAnimation(1.4, Padding(
                      padding: EdgeInsets.symmetric(horizontal: 40),
                      child: Container(
                        padding: EdgeInsets.only(top: 3, left: 3),
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(50),
                            border: Border(
                              bottom: BorderSide(color: Colors.black),
                              top: BorderSide(color: Colors.black),
                              left: BorderSide(color: Colors.black),
                              right: BorderSide(color: Colors.black),
                            )
                        ),
                        child: MaterialButton(
                          minWidth: double.infinity,
                          height: 60,
                          onPressed: userLogin,
                          color: Color(0xFF0000EE),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(50)
                          ),
                          child: Text("Login", style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 18,
                              color: Colors.white
                          ),),
                        ),
                      ),
                    )
                    ),
                    SizedBox(height: 30.0)
                  ],
                ),
              ],
            ),
          ),
        )
    );
  }

  Widget makeInput({label, control, obscureText = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(label, style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w400,
            color: Colors.black87
        ),),
        SizedBox(height: 5,),
        TextField(
          obscureText: obscureText,
          controller: control,
          decoration: InputDecoration(
            contentPadding: EdgeInsets.symmetric(vertical: 0, horizontal: 10),
            enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(color: Colors.grey.shade400)
            ),
            border: OutlineInputBorder(
                borderSide: BorderSide(color: Colors.grey.shade400)
            ),
          ),
        ),
        SizedBox(height: 30,),
      ],
    );
  }

  Future<void> userLogin() async {
    setState(() {
      isLoading = true;
    });
    String username = _userNameController.text.trim();
    String password = _passwordController.text.trim();

    if (username == '' || password == ''){
      Fluttertoast.showToast(
          msg: "Enter a valid username and password",
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color(0xFFFE0000),
          textColor: Colors.white,
          fontSize: 16.0
      );
      setState(() {
        isLoading = false;
      });
      return;
    }

    final http.Response response = await http.post(Uri.parse("https://nexobytes-edutech.herokuapp.com/api/v1/user/login"),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'username': username,
        'password': password
      }),
    );
    if (response.statusCode == 200) {
      Student currentStd =  Student.fromJson(json.decode(response.body)['data']);
      var currentStudentJson = currentStd.toJson();
      sharedPref.save('auth_data', json.encode(currentStudentJson));
      sharedPref.save('log_key', password);
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
    } else {
      Error error =  Error.fromJson(json.decode(response.body));
      Fluttertoast.showToast(
          msg: error.message,
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color(0xFFFE0000),
          textColor: Colors.white,
          fontSize: 16.0
      );
      setState(() {
        isLoading = false;
      });
    }
    setState(() {
      isLoading = false;
    });
  }

}