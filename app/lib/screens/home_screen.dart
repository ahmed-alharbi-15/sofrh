import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../theme_notifier.dart';
import '../widgets/sofrah_appbar.dart';
import 'profile_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

// ── Colours ────────────────────────────────────────────────────────────────
const Color primary  = Color(0xFF32127A);
const Color accent   = Color(0xFFF28500);
const Color lightBg  = Color(0xFFFAF5EB);
const Color darkBg   = Color(0xFF0B0933);
const Color darkCard = Color(0xFF1a1040);

// ── Card image URLs ────────────────────────────────────────────────────────
const String _baseImg = 'https://sofrh.vercel.app/img/';

// ─────────────────────────────── HOME SCREEN ──────────────────────────────
class HomeScreen extends StatelessWidget {
  /// Called when the user taps a nav chip — passes the BottomNavBar index.
  final void Function(int) jumpTo;
  final VoidCallback onLogout;

  const HomeScreen({
    super.key,
    required this.jumpTo,
    required this.onLogout,
  });

  // ── Profile navigation ──────────────────────────────────────────────────
  void _openProfile(BuildContext ctx) {
    Navigator.push(
      ctx,
      MaterialPageRoute(
        builder: (_) => Directionality(
          textDirection: TextDirection.rtl,
          child: ProfileScreen(onLogout: () async {
            final prefs = await SharedPreferences.getInstance();
            await prefs.clear();
            usernameNotifier.value = '';
            emailNotifier.value    = '';
            onLogout();
          }),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark     = Theme.of(context).brightness == Brightness.dark;
    final sectionsBg = isDark ? darkBg : lightBg;

    return Scaffold(
      backgroundColor: sectionsBg,
      appBar: SofrahAppBar(
        onAvatarTap: () => _openProfile(context),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. Hero
            _HeroSection(onStart: () => jumpTo(1)),
            // 2. Section cards 2×2
            _SectionsGrid(jumpTo: jumpTo, isDark: isDark),
            // 3. About "عن سفرة"
            _AboutSection(isDark: isDark),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────── HERO ─────────────────────────────────────
class _HeroSection extends StatelessWidget {
  final VoidCallback? onStart;
  const _HeroSection({this.onStart});

  @override
  Widget build(BuildContext context) {
    final screenH  = MediaQuery.of(context).size.height;
    final statusH  = MediaQuery.of(context).padding.top;
    final heroH    = screenH - kToolbarHeight - statusH;

    return Container(
      width: double.infinity,
      height: heroH,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF32127A), Color(0xFF1a0f2e)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // ── العنوان ──────────────────────────────────────────────
          RichText(
            textAlign: TextAlign.center,
            text: const TextSpan(
              style: TextStyle(
                fontSize: 46,
                fontWeight: FontWeight.bold,
                fontFamily: 'NotoSansArabic',
                color: Colors.white,
                height: 1.2,
              ),
              children: [
                TextSpan(text: 'سافر '),
                TextSpan(
                  text: 'وتذوق',
                  style: TextStyle(color: accent),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // ── الوصف ────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 36),
            child: Text(
              'اكتشف وجهات وأكلات من مختلف أنحاء العالم',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.65),
                fontSize: 14,
                fontFamily: 'NotoSansArabic',
                height: 1.6,
              ),
            ),
          ),
          const SizedBox(height: 44),

          // ── الإحصائيات ───────────────────────────────────────────
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              _Stat(number: '+190', label: 'دولة'),
              _StatDivider(),
              _Stat(number: '+700', label: 'فعالية'),
              _StatDivider(),
              _Stat(number: '+300', label: 'وصفة'),
            ],
          ),
          const SizedBox(height: 48),

          // ── زر ابدأ رحلتك ─────────────────────────────────────────
          GestureDetector(
            onTap: onStart,
            child: Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 40, vertical: 15),
              decoration: BoxDecoration(
                color: accent,
                borderRadius: BorderRadius.circular(50),
                boxShadow: [
                  BoxShadow(
                    color: accent.withValues(alpha: 0.4),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: const Text(
                'ابدأ رحلتك',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'NotoSansArabic',
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String number, label;
  const _Stat({required this.number, required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(children: [
        Text(
          number,
          style: const TextStyle(
            color: accent,
            fontSize: 26,
            fontWeight: FontWeight.bold,
            fontFamily: 'NotoSansArabic',
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.6),
            fontSize: 12,
            fontFamily: 'NotoSansArabic',
          ),
        ),
      ]),
    );
  }
}

class _StatDivider extends StatelessWidget {
  const _StatDivider();

  @override
  Widget build(BuildContext context) => Container(
        width: 1,
        height: 44,
        color: Colors.white.withValues(alpha: 0.15),
      );
}

// ────────────────────────────── SECTIONS GRID ─────────────────────────────
class _SectionsGrid extends StatelessWidget {
  final void Function(int) jumpTo;
  final bool isDark;
  const _SectionsGrid({required this.jumpTo, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final bg = isDark ? darkBg : lightBg;
    return Container(
      color: bg,
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        const SizedBox(height: 8),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          crossAxisSpacing: 14,
          mainAxisSpacing: 14,
          childAspectRatio: 0.78,
          children: [
            _SectionCard(
              title:    'الوصفات',
              desc:     'تذوق نكهات متنوعة من وصفات عالمية سهلة و لذيذة.',
              btnLabel: 'استكشاف',
              imgUrl:   '${_baseImg}food10.jpg',
              onTap:    () => jumpTo(3),
            ),
            _SectionCard(
              title:    'الفعاليات',
              desc:     'عِش أجواء فعاليات عالمية ممتعة… وكلها بمواعيدها السنوية.',
              btnLabel: 'استكشاف',
              imgUrl:   '${_baseImg}events1.jpg',
              onTap:    () => jumpTo(2),
            ),
            _SectionCard(
              title:    'الدول',
              desc:     'تعرف على نكهات وأجواء كل دولة بلمحة سريعة.',
              btnLabel: 'استكشاف',
              imgUrl:   '${_baseImg}Countries1.jpg',
              onTap:    () => jumpTo(1),
            ),
            _SectionCard(
              title:    'خطتي',
              desc:     'خطط رحلتك المثالية واكتشف أفضل الوجهات حسب ميزانيتك.',
              btnLabel: 'ابدأ خطتك',
              imgUrl:   '${_baseImg}plan.jpg',
              onTap:    () => jumpTo(4),
            ),
          ],
        ),
        const SizedBox(height: 8),
      ]),
    );
  }
}

// ── Section card — matches .card in CSS ────────────────────────────────────
class _SectionCard extends StatelessWidget {
  final String title, desc, btnLabel, imgUrl;
  final VoidCallback onTap;
  const _SectionCard({
    required this.title, required this.desc,
    required this.btnLabel, required this.imgUrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(fit: StackFit.expand, children: [
          // Background image — .card background: #150A35
          CachedNetworkImage(
            imageUrl: imgUrl,
            fit: BoxFit.cover,
            color: const Color(0xFF150A35),
            colorBlendMode: BlendMode.multiply,
            errorWidget: (_, __, ___) =>
                Container(color: const Color(0xFF150A35)),
          ),
          // Gradient overlay — matches .card-overlay
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Color(0xE112082A),
                ],
                stops: [0.2, 1.0],
              ),
            ),
          ),
          // Content — matches .card-content
          Positioned(
            bottom: 0, right: 0, left: 0,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Title — .card-label
                  Text(title,
                      textAlign: TextAlign.right,
                      style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          fontFamily: 'NotoSansArabic',
                          height: 1.2)),
                  const SizedBox(height: 5),
                  // Description — .text
                  Text(desc,
                      textAlign: TextAlign.right,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                          color: Colors.white.withOpacity(0.65),
                          fontSize: 11,
                          fontFamily: 'NotoSansArabic',
                          height: 1.5)),
                  const SizedBox(height: 10),
                  // Button — .section-btn
                  Align(
                    alignment: Alignment.centerRight,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 6),
                      decoration: BoxDecoration(
                        color: accent.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(50),
                      ),
                      child: Text(btnLabel,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              fontFamily: 'NotoSansArabic')),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ]),
      ),
    );
  }
}

// ──────────────────────────── ABOUT SECTION ───────────────────────────────
class _AboutSection extends StatelessWidget {
  final bool isDark;
  const _AboutSection({required this.isDark});

  @override
  Widget build(BuildContext context) {
    final bg     = isDark ? darkCard : Colors.white;
    final textClr = isDark ? Colors.white : primary;
    final subClr  = isDark ? Colors.white60 : const Color(0xFF9b7a5e);

    final features = [
      ('🌍', 'اكتشف', 'دول وثقافات متنوعة من حول العالم'),
      ('🍽️', 'تذوق', 'وصفات شهية وأكلات شعبية أصيلة'),
      ('📅', 'خطط', 'رحلتك المثالية حسب ميزانيتك'),
    ];

    return Container(
      color: bg,
      padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
        // Section heading
        Text('عن سفرة',
            style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                fontFamily: 'NotoSansArabic',
                color: textClr)),
        const SizedBox(height: 8),
        Text(
          'وجهتك للسفر والطعام حول العالم — دليل شامل يجمع بين\nاكتشاف الدول والوصفات والفعاليات في مكان واحد.',
          textAlign: TextAlign.center,
          style: TextStyle(
              fontSize: 13,
              fontFamily: 'NotoSansArabic',
              color: subClr,
              height: 1.6),
        ),
        const SizedBox(height: 28),
        // Feature row
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: features.map((f) => _FeatureChip(
            emoji:   f.$1,
            title:   f.$2,
            desc:    f.$3,
            isDark:  isDark,
          )).toList(),
        ),
      ]),
    );
  }
}

class _FeatureChip extends StatelessWidget {
  final String emoji, title, desc;
  final bool isDark;
  const _FeatureChip(
      {required this.emoji, required this.title,
       required this.desc,   required this.isDark});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 95,
      child: Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
        Container(
          width: 52, height: 52,
          decoration: BoxDecoration(
            color: accent.withOpacity(0.12),
            shape: BoxShape.circle,
          ),
          child: Center(
              child: Text(emoji, style: const TextStyle(fontSize: 24))),
        ),
        const SizedBox(height: 8),
        Text(title,
            style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                fontFamily: 'NotoSansArabic',
                color: isDark ? Colors.white : primary)),
        const SizedBox(height: 4),
        Text(desc,
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 10,
                fontFamily: 'NotoSansArabic',
                color: isDark ? Colors.white54 : Colors.grey[600])),
      ]),
    );
  }
}

