class photoSelectAcitivity{
    String id;
    String date;
    String name;

    photoSelectAcitivity({
      required this.id,
      required this.date,
      required this.name,
    });
}

class Photo{
  int id;
  String name;
  String url;


  Photo({
    required this.id,
    required this.name,
    required this.url,
  });
}