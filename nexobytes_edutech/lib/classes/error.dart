class Error {
  final String message;

  Error({this.message="Undefined"});

  factory Error.fromJson(Map<String, dynamic> json) {
    return Error(
        message: json['message']
    );
  }
}