class Timetable {
  String id;
  String timetable;
  int createdAt;
  String createdBy;
  String classId;
  String className;
  int date;

  Timetable({
    required this.id,
    required this.timetable,
    this.createdAt=0,
    this.createdBy="",
    this.classId = "",
    this.className="",
    required this.date,
  });
}