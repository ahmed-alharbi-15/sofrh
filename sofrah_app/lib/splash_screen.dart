import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'app_colors.dart';

class SplashScreen extends StatefulWidget {
  final Widget next;

  const SplashScreen({super.key, required this.next});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  static const String _logoAsset = 'assets/icon/app_icon.png';

  late final AnimationController _intro;
  late final AnimationController _orbit;
  late final AnimationController _pulse;

  late final Animation<double> _logoScale;
  late final Animation<double> _logoFade;
  late final Animation<double> _orbitFade;
  late final Animation<double> _textFade;
  late final Animation<Offset> _textSlide;

  bool _finished = false;

  @override
  void initState() {
    super.initState();

    _intro = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..forward();
    _orbit = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3500),
    )..repeat();
    _pulse = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _logoScale = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(
        parent: _intro,
        curve: const Interval(0.0, 0.6, curve: Curves.easeOutBack),
      ),
    );
    _logoFade = CurvedAnimation(
      parent: _intro,
      curve: const Interval(0.0, 0.35, curve: Curves.easeOut),
    );
    _orbitFade = CurvedAnimation(
      parent: _intro,
      curve: const Interval(0.3, 0.7, curve: Curves.easeOut),
    );
    _textFade = CurvedAnimation(
      parent: _intro,
      curve: const Interval(0.6, 1.0, curve: Curves.easeOut),
    );
    _textSlide = Tween<Offset>(
      begin: const Offset(0, 0.4),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _intro,
        curve: const Interval(0.6, 1.0, curve: Curves.easeOut),
      ),
    );

    _run();
  }

  @override
  void dispose() {
    _intro.dispose();
    _orbit.dispose();
    _pulse.dispose();
    super.dispose();
  }

  Future<void> _run() async {
    // نبقي الشاشة مدة معقولة، ونصحّي السيرفر بنفس الوقت
    await Future.wait([
      Future.delayed(const Duration(milliseconds: 2600)),
      _warmUpServer(),
    ]);
    if (!mounted) return;
    setState(() => _finished = true);
  }

  /// طلب خفيف يصحّي سيرفر Render، وما نستنى أكثر من 6 ثواني
  Future<void> _warmUpServer() async {
    try {
      await http
          .get(Uri.parse('https://sofrh-1.onrender.com/countries'))
          .timeout(const Duration(seconds: 6));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 600),
      switchInCurve: Curves.easeOut,
      layoutBuilder: (currentChild, previousChildren) {
        return Stack(
          fit: StackFit.expand,
          children: [
            ...previousChildren,
            ?currentChild,
          ],
        );
      },
      child: _finished
          ? KeyedSubtree(key: const ValueKey('app'), child: widget.next)
          : KeyedSubtree(key: const ValueKey('splash'), child: _buildSplash()),
    );
  }

  Widget _buildSplash() {
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
            _buildLogo(),
            const SizedBox(height: 36),
            _buildBrand(),
          ],
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return SizedBox(
      width: 180,
      height: 180,
      child: Stack(
        alignment: Alignment.center,
        clipBehavior: Clip.none,
        children: [
          FadeTransition(
            opacity: _orbitFade,
            child: RotationTransition(
              turns: _orbit,
              child: SizedBox(
                width: 170,
                height: 170,
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Positioned.fill(
                      child: CustomPaint(painter: _DashedCirclePainter()),
                    ),
                    Positioned(
                      top: -12,
                      left: 170 / 2 - 12,
                      child: Transform.rotate(
                        angle: math.pi / 2,
                        child: const _PlaneIcon(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          FadeTransition(
            opacity: _logoFade,
            child: ScaleTransition(
              scale: _logoScale,
              child: AnimatedBuilder(
                animation: _pulse,
                builder: (context, child) {
                  final t = Curves.easeInOut.transform(_pulse.value);
                  return Transform.scale(
                    scale: 1.0 + 0.04 * t,
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(26),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.accent
                                .withValues(alpha: 0.2 + 0.25 * t),
                            blurRadius: 24 + 16 * t,
                          ),
                        ],
                      ),
                      child: child,
                    ),
                  );
                },
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(26),
                  child: Image.asset(
                    _logoAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: AppColors.primary,
                      child: const Icon(
                        Icons.flight_takeoff,
                        color: Colors.white,
                        size: 44,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBrand() {
    return FadeTransition(
      opacity: _textFade,
      child: SlideTransition(
        position: _textSlide,
        child: Column(
          children: [
            const Text(
              'سفرة',
              style: TextStyle(
                color: Colors.white,
                fontSize: 34,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            RichText(
              text: const TextSpan(
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                children: [
                  TextSpan(
                    text: 'سافر و ',
                    style: TextStyle(color: Colors.white70),
                  ),
                  TextSpan(
                    text: 'تذوق',
                    style: TextStyle(color: AppColors.accent),
                  ),
                ],
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
