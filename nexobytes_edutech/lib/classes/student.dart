class Student {
  final String username;
  final String password;
  final String name;
  final String classId;
  final String className;
  final int createdAt;
  final String createdBy;

  Student({
     required this.username, required this.password, this.name="", required this.classId, this.className="", this.createdAt=0, this.createdBy=""
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
        username: json['username'],
        password: json['password'],
        name: json['name'],
        classId: json['classId'],
        className: json['className'],
        createdAt: json['createdAt'],
        createdBy: json['createdBy']
    );
  }

  Map<String, dynamic> toJson() => {
    'username': username,
    'password': password,
    'name': name,
    'classId': classId,
    'className': className,
    'createdAt': createdAt,
    'createdBy': createdBy
  };

}