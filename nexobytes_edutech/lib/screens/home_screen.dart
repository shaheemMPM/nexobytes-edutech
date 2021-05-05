import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nexobytes_edutech/classes/shared_preference.dart';
import 'package:nexobytes_edutech/screens/video_subjects_screen.dart';
import 'package:nexobytes_edutech/screens/material_subject_screen.dart';

class HomeScreen extends StatefulWidget {
  final username, name, classId, className, createdAt, createdBy;
  HomeScreen({
    this.username, this.className, this.name, this.classId, this.createdAt, this.createdBy
  });

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {

  bool isLoading = false;
  SharedPref sharedPref = SharedPref();

  Future<bool> _onBackPressed() {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            backgroundColor: Color(0xFF262222),
            title: Text('Are you sure?'),
            content: Text('You are going to exit the application'),
            actions: <Widget>[
              TextButton(
                child: Text(
                  'NO',
                  style: TextStyle(color: Color(0xFFFE0000)),
                ),
                onPressed: () {
                  Navigator.of(context).pop(false);
                },
              ),
              TextButton(
                child: Text(
                  'YES',
                  style: TextStyle(color: Color(0xFFFE0000)),
                ),
                onPressed: () {
                  SystemNavigator.pop();
                },
              ),
            ],
          );
        }
    );
    return Future.value(false);
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: WillPopScope(
          onWillPop: _onBackPressed,
          child: SingleChildScrollView(
            child: SafeArea(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    SizedBox(
                      height: 30,
                    ),
                    Text(
                      welcomeNote(widget.name),
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF262222),
                        fontSize: 30,
                      ),
                    ),
                    SizedBox(
                      height: 30,
                    ),
                    Wrap(
                      spacing: 20,
                      runSpacing: 20,
                      children: <Widget>[
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(
                                MaterialPageRoute(
                                    builder: (BuildContext context) => VideoSubjectScreen(
                                      classId: widget.classId,
                                      className: widget.className,
                                    )
                                )
                            );
                          },
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              width: MediaQuery.of(context).size.width / 2 - 30,
                              height: MediaQuery.of(context).size.height / 4 - 20,
                              child: Stack(
                                fit: StackFit.expand,
                                children: <Widget>[
                                  Hero(
                                    tag: 'assets/images/cat1.png',
                                    child: Image.asset(
                                      'assets/images/cat1.png',
                                      fit: BoxFit.fill,
                                    ),
                                  ),
                                  Positioned(
                                    top: 15,
                                    left: 15,
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Hero(
                                          tag: "video_class",
                                          child: Text(
                                            'Video Class',
                                            style: TextStyle(
                                              color: Color(0xFF262222),
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(
                                MaterialPageRoute(
                                    builder: (BuildContext context) => MaterialSubjectScreen(
                                      classId: widget.classId,
                                      className: widget.className,
                                    )
                                )
                            );
                          },
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              width: MediaQuery.of(context).size.width / 2 - 30,
                              height: MediaQuery.of(context).size.height / 4 - 20,
                              child: Stack(
                                fit: StackFit.expand,
                                children: <Widget>[
                                  Hero(
                                    tag: 'assets/images/cat2.png',
                                    child: Image.asset(
                                      'assets/images/cat2.png',
                                      fit: BoxFit.fill,
                                    ),
                                  ),
                                  Positioned(
                                    top: 15,
                                    left: 15,
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Hero(
                                          tag: "material_subjects",
                                          child: Text(
                                            'Notes',
                                            style: TextStyle(
                                              color: Color(0xFF262222),
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        GestureDetector(
                          onTap: () {
                            print("Timetables pressed");
                            // Navigator.of(context).push(
                            //     MaterialPageRoute(
                            //         builder: (BuildContext context) => TimeTable(
                            //           course: widget.course,
                            //           id: widget.id,
                            //         )
                            //     )
                            // );
                          },
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              width: MediaQuery.of(context).size.width / 2 - 30,
                              height: MediaQuery.of(context).size.height / 4 - 20,
                              child: Stack(
                                fit: StackFit.expand,
                                children: <Widget>[
                                  Hero(
                                    tag: 'assets/images/cat3.png',
                                    child: Image.asset(
                                      'assets/images/cat3.png',
                                      fit: BoxFit.fill,
                                    ),
                                  ),
                                  Positioned(
                                    top: 15,
                                    left: 15,
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(
                                          'Time Table',
                                          style: TextStyle(
                                            color: Color(0xFF262222),
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        GestureDetector(
                          onTap: () {
                            print("Student profile pressed");
                            // Navigator.of(context).push(
                            //     MaterialPageRoute(
                            //         builder: (BuildContext context) => TimeTable(
                            //           course: widget.course,
                            //           id: widget.id,
                            //         )
                            //     )
                            // );
                          },
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              width: MediaQuery.of(context).size.width / 2 - 30,
                              height: MediaQuery.of(context).size.height / 4 - 20,
                              child: Stack(
                                fit: StackFit.expand,
                                children: <Widget>[
                                  Hero(
                                    tag: 'assets/images/cat4.png',
                                    child: Image.asset(
                                      'assets/images/cat4.png',
                                      fit: BoxFit.fill,
                                    ),
                                  ),
                                  Positioned(
                                    top: 15,
                                    left: 15,
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(
                                          'Student Profile',
                                          style: TextStyle(
                                            color: Color(0xFF262222),
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        SizedBox(height: 20.0,)

                      ],
                    ),
                  ],
                ),
              ),
            ),
          )
      ),
    );
  }

  String welcomeNote (String name) {
    var subList = name.split(' ');
    for (int i = 0; i < subList.length; i++){
      if (subList[i] == ""){
        subList.removeAt(i);
      }
    }
    return 'Hey '+subList[0]+',';
  }

}