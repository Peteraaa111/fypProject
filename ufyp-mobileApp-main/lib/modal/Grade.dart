class Grade {
  String chinese;
  String english;
  String mathematics;
  String generalStudies;

  Grade({
    required this.chinese,
    required this.english,
    required this.mathematics,
    required this.generalStudies,
  });

  @override
  String toString() {
    return 'Chinese: $chinese, English: $english, Mathematics: $mathematics, General Studies: $generalStudies';
  }
}

class ClassGrade {
  String chinese;
  String english;
  String mathematics;
  String generalStudies;
  String studentNameChi;
  String studentNameEng;
  String? totalGrade;

  ClassGrade({
    required this.chinese,
    required this.english,
    required this.mathematics,
    required this.generalStudies,
    required this.studentNameChi,
    required this.studentNameEng,
    this.totalGrade,
  });

  factory ClassGrade.fromJson(Map<String, dynamic> json) {
    int totalGrade = int.parse(json['chi']) + int.parse(json['eng']) + int.parse(json['math']) + int.parse(json['gs']);
    return ClassGrade(
      chinese: json['chi'],
      english: json['eng'],
      mathematics: json['math'],
      generalStudies: json['gs'],
      studentNameChi: json['studentChiName'],
      studentNameEng: json['studentEngName'],
      totalGrade: totalGrade.toString(),
    );
  }
}