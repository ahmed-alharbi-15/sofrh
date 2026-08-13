import 'package:flutter/material.dart';
import '../theme_notifier.dart';
import '../screens/login_screen.dart';

const Color _kPrimary = Color(0xFF32127A);
const Color _kAccent  = Color(0xFFF28500);

/// AppBar موحّد لكل شاشات سفرة.
///
/// الترتيب (LTR مُجبر):
///   [لوغو] ──── [اسم/زر دخول] ──── [🌙/☀️] [←]
///
/// - [bottom]       شريط بحث / تبويبات أسفل الـ toolbar
/// - [extraActions] أزرار خاصة بالشاشة (مثل تسجيل الخروج)
/// - [onAvatarTap]  يُستدعى عند الضغط على أفتار المستخدم
///                  (المتصل مسؤول عن فتح صفحة الملف الشخصي)
class SofrahAppBar extends StatelessWidget implements PreferredSizeWidget {
  final PreferredSizeWidget? bottom;
  final List<Widget> extraActions;
  final VoidCallback? onAvatarTap;

  const SofrahAppBar({
    super.key,
    this.bottom,
    this.extraActions = const [],
    this.onAvatarTap,
  });

  @override
  Size get preferredSize =>
      Size.fromHeight(kToolbarHeight + (bottom?.preferredSize.height ?? 0));

  void _openLogin(BuildContext ctx) {
    Navigator.push(
      ctx,
      MaterialPageRoute(
        builder: (_) => const Directionality(
          textDirection: TextDirection.rtl,
          child: LoginScreen(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final canPop = Navigator.of(context).canPop();

    return AppBar(
      backgroundColor: _kPrimary,
      automaticallyImplyLeading: false,
      titleSpacing: 0,
      bottom: bottom,
      title: Directionality(
        // نُجبر LTR حتى يكون اللوغو دائماً على اليسار البصري
        textDirection: TextDirection.ltr,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            children: [
              // ── يسار: لوغو (يرجع للخلف إن أمكن) ─────────────────
              GestureDetector(
                onTap: canPop ? () => Navigator.of(context).pop() : null,
                child: Image.asset('assets/logo7.png', height: 38),
              ),

              const Spacer(),

              // ── وسط: اسم + أفتار | زر تسجيل دخول ────────────────
              ValueListenableBuilder<String>(
                valueListenable: usernameNotifier,
                builder: (_, uname, __) {
                  if (uname.isEmpty) {
                    // زر تسجيل الدخول
                    return GestureDetector(
                      onTap: () => _openLogin(context),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          border: Border.all(
                              color: Colors.white54, width: 1.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'تسجيل دخول',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontFamily: 'NotoSansArabic',
                          ),
                        ),
                      ),
                    );
                  }
                  // اسم المستخدم + أفتار
                  return GestureDetector(
                    onTap: onAvatarTap,
                    child: Row(children: [
                      Text(
                        uname,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontFamily: 'NotoSansArabic',
                        ),
                      ),
                      const SizedBox(width: 8),
                      CircleAvatar(
                        radius: 17,
                        backgroundColor: _kAccent,
                        child: Text(
                          uname[0].toUpperCase(),
                          style: const TextStyle(
                            color: _kPrimary,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ]),
                  );
                },
              ),

              const Spacer(),

              // ── يمين: إجراءات إضافية + Dark/Light + رجوع ──────────
              ...extraActions,
              const _ThemeEmojiBtn(),
              if (canPop)
                IconButton(
                  icon: const Icon(
                    Icons.arrow_back_ios_new_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                  tooltip: 'رجوع',
                  onPressed: () => Navigator.of(context).pop(),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── زر تبديل الثيم بالإيموجي ──────────────────────────────────────────────
class _ThemeEmojiBtn extends StatelessWidget {
  const _ThemeEmojiBtn();

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeModeNotifier,
      builder: (_, mode, __) => IconButton(
        tooltip:
            mode == ThemeMode.dark ? 'الوضع الفاتح' : 'الوضع الداكن',
        icon: Text(
          mode == ThemeMode.dark ? '☀️' : '🌙',
          style: const TextStyle(fontSize: 20),
        ),
        onPressed: () {
          themeModeNotifier.value =
              mode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
        },
      ),
    );
  }
}
