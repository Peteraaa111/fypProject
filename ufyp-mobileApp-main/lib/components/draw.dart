import 'dart:async';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';


class Signature extends StatefulWidget {
  final Color color;
  final double strokeWidth;
  final CustomPainter? backgroundPainter;
  final Function? onSign;


  Signature({
    this.color = Colors.black,
    this.strokeWidth = 5.0,
    this.backgroundPainter,
    this.onSign,
    Key? key,
  }) : super(key: key);

  SignatureState createState() => SignatureState();

  static SignatureState? of(BuildContext context) {
    return context.findAncestorStateOfType<SignatureState>();
  }
}

class ColoredPoint {
  final Offset point;
  final Color color;
  ColoredPoint({required this.point, required this.color});
}


class _SignaturePainter extends CustomPainter {
  final double strokeWidth;
  final List<ColoredPoint?> points;

  late Paint _linePaint;

  _SignaturePainter({required this.points, required this.strokeWidth}) {
    _linePaint = Paint()
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;
  }

  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < points.length - 1; i++) {
      if (points[i] != null && points[i + 1] != null) {
        _linePaint.color = points[i]!.color;
        canvas.drawLine(points[i]!.point, points[i + 1]!.point, _linePaint);
      }
    }
  }

  @override
  bool shouldRepaint(_SignaturePainter other) => other.points != points;
}

class SignatureState extends State<Signature> {
  List<ColoredPoint?> _points = <ColoredPoint?>[];
  _SignaturePainter? _painter;
  late Size _lastSize;
  List<List<ColoredPoint?>> _pointsHistory = []; // Stack of points history
  SignatureState();

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) => afterFirstLayout(context));
    _painter = _SignaturePainter(points: _points, strokeWidth: widget.strokeWidth);
    return ClipRect(
      child: CustomPaint(
        painter: widget.backgroundPainter,
        foregroundPainter: _painter,
        child: GestureDetector(
          onVerticalDragStart: _onDragStart,
          onVerticalDragUpdate: _onDragUpdate,
          onVerticalDragEnd: _onDragEnd,
          onPanStart: _onDragStart,
          onPanUpdate: _onDragUpdate,
          onPanEnd: _onDragEnd,
          onTapDown: _onTapDown,
          onTapUp: _onTapUp,
        ),
      ),
    );
  }

  void _onTapDown(TapDownDetails details) {
    RenderBox referenceBox = context.findRenderObject() as RenderBox;
    Offset localPosition = referenceBox.globalToLocal(details.globalPosition);
    // setState(() {
    //   _pointsHistory.add(List.from(_points)); 
    //   _points = List.from(_points)..add(localPosition)..add(localPosition);
    // });
  }

  void _onTapUp(TapUpDetails details) {
    RenderBox referenceBox = context.findRenderObject() as RenderBox;
    Offset localPosition = referenceBox.globalToLocal(details.globalPosition);
    // setState(() {
    //   _pointsHistory.add(List.from(_points)); 
    //   _points = List.from(_points)..add(localPosition);
    //   if (widget.onSign != null) {
    //     widget.onSign!();
    //   }
    // });
    // _points.add(null);
  }

  void _onDragStart(DragStartDetails details) {
    RenderBox referenceBox = context.findRenderObject() as RenderBox;
    Offset localPosition = referenceBox.globalToLocal(details.globalPosition);
    setState(() {
      _pointsHistory.add(List.from(_points)); 
      _points = List.from(_points)..add(ColoredPoint(point: localPosition, color: widget.color))..add(ColoredPoint(point: localPosition, color: widget.color));
    });
  }

  void _onDragUpdate(DragUpdateDetails details) {
    RenderBox referenceBox = context.findRenderObject() as RenderBox;
    Offset localPosition = referenceBox.globalToLocal(details.globalPosition);

    setState(() {
      _points = List.from(_points)..add(ColoredPoint(point: localPosition, color: widget.color));
      if (widget.onSign != null) {
        widget.onSign!();
      }
    });
  }

  void _onDragEnd(DragEndDetails details) {
    _points.add(null);
  }


  void undo() {
    if (_pointsHistory.isNotEmpty) {
      setState(() {
        _points = _pointsHistory.removeLast(); // Remove last points from history
      });
    }
  }

  Future<ui.Image> getData() {
    var recorder = ui.PictureRecorder();
    var origin = Offset(0.0, 0.0);
    var paintBounds = Rect.fromPoints(_lastSize.topLeft(origin), _lastSize.bottomRight(origin));
    var canvas = Canvas(recorder, paintBounds);
    if (widget.backgroundPainter != null) {
      widget.backgroundPainter!.paint(canvas, _lastSize);
    }
    _painter!.paint(canvas, _lastSize);
    var picture = recorder.endRecording();
    return picture.toImage(_lastSize.width.round(), _lastSize.height.round());
  }

  void clear() {
    setState(() {
      _points = [];
    });
  }

  bool get hasHistory => _pointsHistory.isNotEmpty;

  int get pointsHistoryLength => _pointsHistory.length;
  
  bool get hasPoints => _points.length > 0;

  List<ColoredPoint?> get points => _points;

  afterFirstLayout(BuildContext context) {
    _lastSize = context.size!;
  }
}
