import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nexobytes_edutech/constants/subjects.dart';
import 'package:intl/intl.dart';
import 'package:nexobytes_edutech/classes/error.dart';
import 'package:nexobytes_edutech/screens/login_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class StudentProfileScreen extends StatefulWidget {
  final username, name, className, createdAt;
  const StudentProfileScreen({
    this.username, this.name, this.className, this.createdAt
});

  @override
  _StudentProfileScreenState createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen> {

  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: EdgeInsets.only(left: 15, top: 15),
              child: GestureDetector(
                child: Icon(Icons.arrow_back_ios),
                onTap: () {
                  Navigator.of(context).pop();
                },
              ),
            ),
            SizedBox(height: 30),
            Padding(
              padding: EdgeInsets.only(left: 15),
              child: ClipPath(
                clipper: BestSellerClipper(),
                child: Container(
                  color: kBestSellerColor,
                  padding: EdgeInsets.only(
                      left: 10, top: 5, right: 20, bottom: 5),
                  child: Text(
                    'USER PROFILE',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(height: 60),
            Expanded(
                child: SingleChildScrollView(
                  child: Container(
                    margin: EdgeInsets.only(left: 3, right: 3),
                    width: double.infinity,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.all(Radius.circular(50)),
                      boxShadow: [
                        BoxShadow(
                            color: Colors.grey,
                            blurRadius: 5.0,
                            offset: Offset(0, -1)
                        ),
                      ],
                      color: Colors.white,
                    ),
                    child: Stack(
                      children: <Widget>[
                        Padding(
                          padding: const EdgeInsets.all(30),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text("Details",
                                  style: kTitleTextStyle),
                              SizedBox(height: 30),
                              Column(
                                  children: [
                                    CourseContent(
                                      number: "01",
                                      duration: "username",
                                      title: widget.username
                                    ),
                                  ],
                              ),
                              Column(
                                children: [
                                  CourseContent(
                                      number: "02",
                                      duration: "name",
                                      title: widget.name
                                  ),
                                ],
                              ),
                              Column(
                                children: [
                                  CourseContent(
                                      number: "03",
                                      duration: "class name",
                                      title: widget.className
                                  ),
                                ],
                              ),
                              Column(
                                children: [
                                  CourseContent(
                                      number: "04",
                                      duration: "createdAt",
                                      title: getDateTimeFromTimestamp(widget.createdAt)
                                  ),
                                ],
                              ),

                              GestureDetector(
                                onTap: userLogout,
                                child: Container(
                                  alignment: Alignment.center,
                                  height: 56,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(40),
                                    color: kBlueColor,
                                  ),
                                  child: isLoading ? Center(child: CircularProgressIndicator(color: Colors.white,),) : Text(
                                    "Logout",
                                    style: kSubtitleTextSyule.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              )
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                )
            )
          ],
        ),
      ),
    );
  }

  Future<void> userLogout() async {
    setState(() {
      isLoading = true;
    });
    final prefs = await SharedPreferences.getInstance();
    String username = widget.username;
    String password = prefs.getString('log_key').toString();

    final http.Response response = await http.post(Uri.parse("https://nexobytes-edutech.herokuapp.com/api/v1/user/logout"),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'username': username,
        'password': password
      }),
    );
    if (response.statusCode == 200) {
      Navigator.of(context).push(
          MaterialPageRoute(
              builder: (BuildContext context) => LoginScreen()
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

  String getDateTimeFromTimestamp(int timestamp) {
    var date = DateTime.fromMillisecondsSinceEpoch(timestamp);
    var formattedDate = DateFormat.yMMMd().format(date);
    return formattedDate.toString();
  }

}

class CourseContent extends StatelessWidget {
  final String number;
  final String duration;
  final String title;
  const CourseContent({
    Key? key,
    required this.number,
    required this.duration,
    required this.title
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 30),
      child: Row(
        children: <Widget>[
          Text(
            number,
            style: kHeadingextStyle.copyWith(
              color: kTextColor.withOpacity(.15),
              fontSize: 32,
            ),
          ),
          SizedBox(width: 20),
          RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: "$duration\n",
                  style: TextStyle(
                    color: kTextColor.withOpacity(.5),
                    fontSize: 18,
                  ),
                ),
                TextSpan(
                  text: title,
                  style: kSubtitleTextSyule.copyWith(
                    fontWeight: FontWeight.w600,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          Spacer(),
        ],
      ),
    );
  }
}

class BestSellerClipper extends CustomClipper<Path> {
  @override
  getClip(Size size) {
    var path = Path();
    path.lineTo(size.width - 20, 0);
    path.lineTo(size.width, size.height / 2);
    path.lineTo(size.width - 20, size.height);
    path.lineTo(0, size.height);
    path.lineTo(0, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper oldClipper) {
    return false;
  }
}
