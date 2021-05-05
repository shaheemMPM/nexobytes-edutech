import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nexobytes_edutech/classes/timetable.dart';
import 'package:nexobytes_edutech/constants/subjects.dart';
import 'package:intl/intl.dart';
import 'package:nexobytes_edutech/classes/error.dart';
import 'package:http/http.dart' as http;

class TimetableScreen extends StatefulWidget {
  final classId;
  const TimetableScreen({this.classId});

  @override
  _TimetableScreenState createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> {

  bool isLoading = true;
  bool isTimetable = true;
  List<Timetable> timetables = [];

  read() async {
    try {
      final result = await InternetAddress.lookup('google.com');
      if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
      } else {
        Fluttertoast.showToast(
            msg: "No network found",
            toastLength: Toast.LENGTH_LONG,
            gravity: ToastGravity.BOTTOM,
            backgroundColor: Color(0xFFFE0000),
            textColor: Colors.white,
            fontSize: 16.0);
      }
    } on SocketException catch (_) {
      Fluttertoast.showToast(
          msg: "No network found",
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color(0xFFFE0000),
          textColor: Colors.white,
          fontSize: 16.0);
    }

    final http.Response response = await http.get(
        Uri.parse("https://nexobytes-edutech.herokuapp.com/api/v1/extra/timetables/"+widget.classId),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        }
    );
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body)['data'];
      data.forEach((subject) {
        Timetable temp = new Timetable(
            id: subject['id'],
            timetable: subject['timetable'],
            classId: subject['classId'],
            className: subject['className'],
            createdAt: subject['createdAt'],
            createdBy: subject['createdBy'],
            date: subject['date']
        );
        timetables.add(temp);
      });
      if (timetables.length == 0) {
        setState(() {
          isTimetable = false;
        });
      }
      setState(() {
        isLoading = false;
      });
    } else {
      Error error = Error.fromJson(json.decode(response.body));
      Fluttertoast.showToast(
          msg: error.message,
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color(0xFFFE0000),
          textColor: Colors.white,
          fontSize: 16.0);
      setState(() {
        isLoading = false;
        isTimetable = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    read();
  }

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
                    'TIMETABLES',
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
                    child: isLoading
                        ? Stack(
                      children: <Widget>[
                        Padding(
                          padding: const EdgeInsets.all(30),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              SizedBox(height: 10),
                              Center(child: CircularProgressIndicator()),
                              SizedBox(height: 30),
                            ],
                          ),
                        ),
                      ],
                    )
                        : !isTimetable
                        ? Stack(
                      children: <Widget>[
                        Padding(
                          padding: const EdgeInsets.all(30),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text("There is no timetable in this class as of now",
                                  textAlign: TextAlign.center,
                                  style: kSubtitleTextSyule),
                              SizedBox(height: 30),
                            ],
                          ),
                        ),
                      ],
                    )
                        : Stack(
                      children: <Widget>[
                        Padding(
                          padding: const EdgeInsets.all(30),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Column(
                                  children:
                                  timetables.asMap().map((ind, value) => MapEntry(ind,
                                      CourseContent(number: subjectIndex(ind), duration: getDateTimeFromTimestamp(value.date), title: value.timetable))).values.toList()

                              ),

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

  String subjectIndex (int ind) {
    String result = "";
    if (ind+1 < 9){
      result = '0'+ (ind+1).toString();
    } else {
      result = (ind+1).toString();
    }
    return result;
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
