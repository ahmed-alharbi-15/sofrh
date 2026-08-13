import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

// ── Theme ─────────────────────────────────────────────────────────────────
final themeModeNotifier = ValueNotifier<ThemeMode>(ThemeMode.system);

// ── User session ───────────────────────────────────────────────────────────
final usernameNotifier = ValueNotifier<String>('');
final emailNotifier    = ValueNotifier<String>('');

Future<void> loadUserState() async {
  final prefs = await SharedPreferences.getInstance();
  usernameNotifier.value = prefs.getString('sofrah_username') ?? '';
  emailNotifier.value    = prefs.getString('sofrah_email') ?? '';
}

// ── Internal colours (used by AppBar only) ─────────────────────────────────
const Color _kPrimary = Color(0xFF32127A);
const Color _kAccent  = Color(0xFFF28500);

// ── ThemeToggleBtn ─────────────────────────────────────────────────────────
class ThemeToggleBtn extends StatelessWidget {
  const ThemeToggleBtn({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeModeNotifier,
      builder: (_, mode, __) => IconButton(
        tooltip: mode == ThemeMode.dark ? 'الوضع الفاتح' : 'الوضع الداكن',
        icon: Icon(
          mode == ThemeMode.dark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
          color: Colors.white,
        ),
        onPressed: () {
          themeModeNotifier.value =
              mode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
        },
      ),
    );
  }
}

// ── SofrahAppBar ───────────────────────────────────────────────────────────
/// Unified app bar: logo on the visual LEFT, username + avatar on the RIGHT.
/// Pass [bottom] for search bars / tab bars.
/// Pass [extraActions] for screen-specific icon buttons (e.g. logout).
class SofrahAppBar extends StatelessWidget implements PreferredSizeWidget {
  final PreferredSizeWidget? bottom;
  final List<Widget> extraActions;

  const SofrahAppBar({
    super.key,
    this.bottom,
    this.extraActions = const [],
  });

  @override
  Size get preferredSize =>
      Size.fromHeight(kToolbarHeight + (bottom?.preferredSize.height ?? 0));

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: _kPrimary,
      automaticallyImplyLeading: false,
      titleSpacing: 0,
      bottom: bottom,
      title: Directionality(
        // Force LTR so logo is ALWAYS on the visual left.
        textDirection: TextDirection.ltr,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(children: [
            // LEFT — brand logo
            Image.asset('assets/logo7.png', height: 38),
            const Spacer(),
            // Extra screen-level actions (e.g. logout)
            ...extraActions,
            // User badge
            ValueListenableBuilder<String>(
              valueListenable: usernameNotifier,
              builder: (_, uname, __) {
                if (uname.isEmpty) return const SizedBox.shrink();
                return Padding(
                  padding: const EdgeInsets.only(left: 2),
                  child: Row(children: [
                    Text(
                      uname,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontFamily: 'NotoSansArabic'),
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
                            fontSize: 14),
                      ),
                    ),
                  ]),
                );
              },
            ),
            // Theme toggle
            const ThemeToggleBtn(),
          ]),
        ),
      ),
    );
  }
}
