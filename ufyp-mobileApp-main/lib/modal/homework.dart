class Homework {
  String chinese;
  String english;
  String mathematics;
  String generalStudies;
  String other;
  String? id;

  Homework({
    required this.chinese,
    required this.english,
    required this.mathematics,
    required this.generalStudies,
    required this.other,
    this.id,
  });

  @override
  String toString() {
    return 'Chinese: $chinese, English: $english, Mathematics: $mathematics, General Studies: $generalStudies ,Other: $other';
  }


  factory Homework.fromJson(Map<String, dynamic> json) {
    return Homework(
      id: json['id'],
      chinese: json['chi'],
      english: json['eng'],
      mathematics: json['math'],
      generalStudies: json['gs'],
      other: json['other'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'chi': chinese,
      'eng': english,
      'math': mathematics,
      'gs': generalStudies,
      'other': other,
    };
  }
}