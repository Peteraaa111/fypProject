import 'package:flutter/material.dart';
import 'package:my_app/generated/l10n.dart';

class ContactsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: <Widget>[
          _buildImageCard(),
          _buildInfoCard(),
        ],
      ),
    );
  }

  Widget _buildImageCard() {
    return Padding(
      padding: EdgeInsets.all(8.0),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15.0), // Add border radius here
        ),
        elevation: 5, // Add shadow here
        child: ClipRRect(
          borderRadius: BorderRadius.circular(15.0), // Also add border radius to the ClipRRect
          child: Image(
            image: AssetImage('lib/images/appMapImage.png'),
            fit: BoxFit.cover, // This will make the image cover the entire card
          ),
        ),
      ),
    );
  }

  Widget _buildInfoCard() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Card(
        child: Column(
          children: <Widget>[
            _buildInfoRow(Icons.info, S.current.aboutUs, 20.0, FontWeight.bold),
            _buildInfoRow(Icons.home, S.current.addressLabel + ": " + S.current.addressWord, 16.0),
            _buildInfoRow(Icons.phone, S.current.ContactUsNumber+": +852 3442-7654", 16.0),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text, double fontSize, [FontWeight? fontWeight]) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
      child: Row(
        children: <Widget>[
          Icon(icon, size: fontSize),
          SizedBox(width: 10.0), // Add some spacing between the icon and the text
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: fontSize,
                fontWeight: fontWeight,
              ),
            ),
          ),
        ],
      ),
    );
  }
}