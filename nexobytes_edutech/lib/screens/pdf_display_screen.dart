import 'package:flutter/material.dart';
import 'package:pdf_viewer_jk/pdf_viewer_jk.dart';

class PdfDisplayScreen extends StatefulWidget {
  final url, title;
  const PdfDisplayScreen({
    this.url, this.title
});

  @override
  _PdfDisplayScreenState createState() => _PdfDisplayScreenState();
}

class _PdfDisplayScreenState extends State<PdfDisplayScreen> {
  bool _isLoading = true;
  late PDFDocument document;

  @override
  void initState() {
    super.initState();
    loadDocument();
  }

  loadDocument() async {
    setState(() {
      _isLoading = true;
    });
    document = await PDFDocument.fromURL(widget.url);
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Color(0xFF0000EE),
        leading: IconButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          icon: Icon(Icons.arrow_back_ios, color: Colors.white),
        ),
      ),
      body: Center(
        child: _isLoading ? Center(child: CircularProgressIndicator())
            :PDFViewer(document: document)
      )
    );
  }
}
