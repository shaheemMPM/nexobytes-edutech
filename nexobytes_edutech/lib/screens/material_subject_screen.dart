import 'dart:convert';
import 'dart:io';

import 'package:fluttertoast/fluttertoast.dart';
import 'package:nexobytes_edutech/constants/subjects.dart';
import 'package:nexobytes_edutech/screens/material_chapters_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:nexobytes_edutech/classes/error.dart';
import 'package:nexobytes_edutech/classes/subject.dart';
import 'package:http/http.dart' as http;

class MaterialSubjectScreen extends StatefulWidget {
  final classId, className;

  MaterialSubjectScreen({this.classId, this.className});

  @override
  _MaterialSubjectScreenState createState() => _MaterialSubjectScreenState();
}

class _MaterialSubjectScreenState extends State<MaterialSubjectScreen> {
  bool isLoading = true;
  bool isSubject = true;
  List<Subject> subjects = [];

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

    final http.Response response = await http.post(
      Uri.parse("https://nexobytes-edutech.herokuapp.com/api/v1/subject"),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{"classId": widget.classId}),
    );
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body)['data'];
      data.forEach((subject) {
        Subject temp = new Subject(
            id: subject['id'],
            name: subject['name'],
            classId: subject['classId'],
            className: subject['className'],
            createdAt: subject['createdAt'],
            createdBy: subject['createdBy']);
        subjects.add(temp);
      });
      if (subjects.length == 0) {
        setState(() {
          isSubject = false;
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
        isSubject = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    read();
  }

  //0xFFF5F4EF
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: Color(0xFFFFFFFF),
          image: DecorationImage(
            image: AssetImage("assets/images/cat2.png"),
            alignment: Alignment.topRight,
          ),
        ),
        child: Column(
          children: <Widget>[
            Padding(
              padding: EdgeInsets.only(left: 20, top: 50, right: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      GestureDetector(
                        child: SvgPicture.asset("assets/icons/arrow-left.svg"),
                        onTap: () {
                          Navigator.of(context).pop();
                        },
                      ),
                    ],
                  ),
                  SizedBox(height: 30),
                  ClipPath(
                    clipper: BestSellerClipper(),
                    child: Container(
                      color: kBestSellerColor,
                      padding: EdgeInsets.only(
                          left: 10, top: 5, right: 20, bottom: 5),
                      child: Text(
                        "Subjects".toUpperCase(),
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Hero(
                      tag: "material_subjects",
                      child: Text("Notes", style: kHeadingextStyle)),
                  SizedBox(height: 16),
                  Row(
                    children: <Widget>[
                      SvgPicture.asset("assets/icons/person.svg"),
                      SizedBox(width: 5),
                      Text(widget.className),
                      SizedBox(width: 20),
                      SvgPicture.asset("assets/icons/star.svg"),
                      SizedBox(width: 5),
                      Text(subjects.length.toString())
                    ],
                  ),
                  SizedBox(height: 40),
                ],
              ),
            ),
            SizedBox(height: 60),
            Expanded(
                child: SingleChildScrollView(
                  child: Container(
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
                        : !isSubject
                        ? Stack(
                      children: <Widget>[
                        Padding(
                          padding: const EdgeInsets.all(30),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text("There is no subject in this class as of now",
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
                              Text("Course Content",
                                  style: kTitleTextStyle),
                              SizedBox(height: 30),
                              Column(
                                  children: subjects.asMap().map((ind, value) => MapEntry(ind,
                                      CourseContent(number: subjectIndex(ind), subjectId: value.id, title: value.name))).values.toList()
                              ),

                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                )),
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
}

class CourseContent extends StatelessWidget {
  final String number;
  final String title;
  final String subjectId;

  const CourseContent({Key? key, required this.number, required this.title, required this.subjectId})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: (){
        Navigator.of(context).push(
            MaterialPageRoute(
                builder: (BuildContext context) => MaterialChapterScreen(
                  subjectId: subjectId,
                  subjectName: title,
                )
            )
        );
      },
      child: Padding(
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
            Expanded(
                child: Text(
                  title,
                  overflow: TextOverflow.ellipsis,
                  style: kSubtitleTextSyule.copyWith(
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                    height: 1.5,
                  ),
                )),
            // Spacer(),
            Container(
              margin: EdgeInsets.only(left: 20),
              height: 40,
              width: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: kGreenColor.withOpacity(1),
              ),
              child: Icon(Icons.sticky_note_2, color: Colors.white),
            )
          ],
        ),
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
