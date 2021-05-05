class Chapter {
  String id;
  String name;
  int createdAt;
  String createdBy;
  String classId;
  String className;
  String subjectId;
  String subjectName;

  Chapter({
    required this.id,
    required this.name,
    this.createdAt=0,
    this.createdBy="",
    this.classId = "",
    this.className="",
    this.subjectId="",
    this.subjectName=""
  });
}