class Subject {
  String id;
  int createdAt;
  String classId;
  String className;
  String createdBy;
  String name;

  Subject({
    required this.id,
    required this.name,
    this.createdBy="",
    this.createdAt=0,
    required this.classId,
    this.className=""
  });
}