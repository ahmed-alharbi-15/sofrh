import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'app_colors.dart';

enum LoadingStyle { cinematic, simple }

class LoadingOverlay extends StatefulWidget {
  final String message;
  final LoadingStyle style;

  const LoadingOverlay({
    super.key,
    required this.message,
    this.style = LoadingStyle.cinematic,
  });

  @override
  State<LoadingOverlay> createState() => _LoadingOverlayState();
}

class _LoadingOverlayState extends State<LoadingOverlay>
    with TickerProviderStateMixin {
  static const String _logoCinematic =
      'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/logo-img.PNG';
  static const String _logoSimple =
      'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/logo7.png';

  late final AnimationController _orbit; // 3.5s
  late final AnimationController _ring; // 1.2s
  late final AnimationController _pulse; // 2s
  late final AnimationController _blink; // 1.5s
  late final AnimationController _simplePulse; // 1.5s

  @override
  void initState() {
    super.initState();
    _orbit = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3500),
    )..repeat();
    _ring = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
    _pulse = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _blink = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _simplePulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _orbit.dispose();
    _ring.dispose();
    _pulse.dispose();
    _blink.dispose();
    _simplePulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: widget.style == LoadingStyle.cinematic
          ? _buildCinematic()
          : _buildSimple(),
    );
  }

  Widget _buildCinematic() {
    return Material(
      color: Colors.transparent,
      child: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.center,
            radius: 1.0,
            colors: [Color(0xFF1F0B4D), Color(0xFF0D0422)],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 150,
              height: 150,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  _logoBox(),
                  _spinnerRing(),
                  _orbitWithPlane(),
                ],
              ),
            ),
            const SizedBox(height: 28),
            FadeTransition(
              opacity: Tween<double>(begin: 1.0, end: 0.6).animate(_blink),
              child: Text(
                widget.message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: AppColors.lightBackground,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                  shadows: [
                    Shadow(color: Colors.black54, blurRadius: 10, offset: Offset(0, 2)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _logoBox() {
    return AnimatedBuilder(
      animation: _pulse,
      builder: (context, child) {
        final t = Curves.easeInOut.transform(_pulse.value);
        final scale = 1.0 + 0.05 * t;
        final glow = 0.2 + 0.25 * t;
        return Transform.scale(
          scale: scale,
          child: Container(
            width: 76,
            height: 76,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withValues(alpha: 0.05),
              boxShadow: [
                BoxShadow(
                  color: AppColors.accent.withValues(alpha: glow),
                  blurRadius: 20 + 15 * t,
                ),
              ],
            ),
            alignment: Alignment.center,
            child: child,
          ),
        );
      },
      child: Image.network(
        _logoCinematic,
        width: 58,
        height: 58,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) =>
            const SizedBox(width: 58, height: 58),
      ),
    );
  }

  Widget _spinnerRing() {
    return RotationTransition(
      turns: _ring,
      child: CustomPaint(
        size: const Size(115, 115),
        painter: _RingPainter(),
      ),
    );
  }

  Widget _orbitWithPlane() {
    return RotationTransition(
      turns: _orbit,
      child: SizedBox(
        width: 145,
        height: 145,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned.fill(
              child: CustomPaint(painter: _DashedCirclePainter()),
            ),
            Positioned(
              top: -12,
              left: 145 / 2 - 12,
              child: Transform.rotate(
                angle: math.pi / 2,
                child: const _PlaneIcon(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSimple() {
    return Material(
      color: Colors.transparent,
      child: Container(
        width: double.infinity,
        height: double.infinity,
        color: const Color(0xFF32127A).withValues(alpha: 0.95),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedBuilder(
              animation: _simplePulse,
              builder: (context, child) {
                final t = Curves.easeInOut.transform(_simplePulse.value);
                return Opacity(
                  opacity: 1.0 - 0.3 * t,
                  child: Transform.scale(scale: 1.0 + 0.08 * t, child: child),
                );
              },
              child: ClipOval(
                child: Image.network(
                  _logoSimple,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) =>
                      const SizedBox(width: 80, height: 80),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              widget.message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: AppColors.accent,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PlaneIcon extends StatelessWidget {
  const _PlaneIcon();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: AppColors.accent.withValues(alpha: 0.55),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: const Icon(Icons.flight, color: AppColors.accent, size: 24),
    );
  }
}

class _RingPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    const stroke = 2.5;
    final rect = Offset.zero & size;
    final arc = rect.deflate(stroke / 2);

    final base = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke;

    // الحلقة كاملة شفافة، مع ربع أعلى برتقالي وربع يمين بنص شفافية
    base.color = AppColors.accent;
    canvas.drawArc(arc, -math.pi / 2 - math.pi / 4, math.pi / 2, false, base);

    base.color = AppColors.accent.withValues(alpha: 0.3);
    canvas.drawArc(arc, -math.pi / 4, math.pi / 2, false, base);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _DashedCirclePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..color = AppColors.lightBackground.withValues(alpha: 0.2);

    final radius = size.width / 2 - 0.75;
    final center = size.center(Offset.zero);
    const dashCount = 48;
    const sweep = 2 * math.pi / dashCount;

    for (var i = 0; i < dashCount; i++) {
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        i * sweep,
        sweep * 0.55,
        false,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}