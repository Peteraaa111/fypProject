class UserNotification {
  String id;
  String contentTC;
  String contentEN;
  String titleEN;
  String titleTC;

  UserNotification({
    required this.id,
    required this.contentTC,
    required this.contentEN,
    required this.titleEN,
    required this.titleTC,
  });

  factory UserNotification.fromJson(Map<String, dynamic> json) {
    return UserNotification(
      id: json['id'],
      contentTC: json['contentTC'],
      contentEN: json['contentEN'],
      titleEN: json['titleEN'],
      titleTC: json['titleTC'],
    );
  }
}