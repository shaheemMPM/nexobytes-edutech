import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nexobytes_edutech/constants/subjects.dart';
import 'package:nexobytes_edutech/screens/pdf_display_screen.dart';
import 'package:nexobytes_edutech/classes/note.dart';
import 'package:nexobytes_edutech/classes/error.dart';
import 'package:http/http.dart' as http;

class MaterialNoteScreen extends StatefulWidget {
  final chapterId, chapterName, subjectId, subjectName;

  const MaterialNoteScreen({
    this.chapterId, this.chapterName, this.subjectId, this.subjectName
  });

  @override
  _MaterialNoteScreenState createState() => _MaterialNoteScreenState();
}

class _MaterialNoteScreenState extends State<MaterialNoteScreen> {

  bool isLoading = true;
  bool isVideo = true;
  List<Note> notes = [];

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
      Uri.parse("https://nexobytes-edutech.herokuapp.com/api/v1/subject/"+widget.subjectId+"/materials/"+widget.chapterId),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      }
    );
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body)['data'];
      data.forEach((subject) {
        Note temp = new Note(
            id: subject['id'],
            title: subject['title'],
            publish: subject['publish'],
            url: subject['url']
        );
        notes.add(temp);
      });
      if (notes.length == 0) {
        setState(() {
          isVideo = false;
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
        isVideo = false;
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
                    getTitle(widget.subjectName, widget.chapterName),
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
                        : !isVideo
                        ? Stack(
                      children: <Widget>[
                        Padding(
                          padding: const EdgeInsets.all(30),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text("There is no note in this chapter as of now",
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
                              Text("Notes",
                                  style: kTitleTextStyle),
                              SizedBox(height: 30),
                              Column(
                                  children: notes.asMap().map((ind, value) => MapEntry(ind,
                                      CourseContent(number: subjectIndex(ind), url: value.url, title: value.title, publish: value.publish))).values.toList()
                              ),

                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ))
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

  String getTitle (String subject, String chapter) {
    String result = "NOTES / "+subject.substring(0, 3).toUpperCase()+" / "+chapter.substring(0, 5).toUpperCase();
    return result;
  }

}


class CourseContent extends StatelessWidget {
  final String number;
  final String title;
  final String url;
  final int publish;

  const CourseContent({Key? key, required this.number, required this.title, required this.url, required this.publish})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: (){
        Navigator.of(context).push(
            MaterialPageRoute(
                builder: (BuildContext context) => PdfDisplayScreen(
                  url: url,
                  title: title,
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
                fontSize: 28,
              ),
            ),
            SizedBox(width: 20),
            Expanded(
                child: Text(
                  title,
                  overflow: TextOverflow.ellipsis,
                  style: kSubtitleTextSyule.copyWith(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                )),
            // Spacer(),
            Container(
              margin: EdgeInsets.only(left: 20),
              height: 35,
              width: 35,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: kGreenColor.withOpacity(1),
              ),
              child: Icon(Icons.picture_as_pdf, color: Colors.white),
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
