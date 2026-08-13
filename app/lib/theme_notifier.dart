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

// ── ThemeToggleBtn (Material icons — used in signup_screen) ───────────────
class ThemeToggleBtn extends StatelessWidget {
  const ThemeToggleBtn({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeModeNotifier,
      builder: (_, mode, __) => IconButton(
        tooltip: mode == ThemeMode.dark ? 'الوضع الفاتح' : 'الوضع الداكن',
        icon: Icon(
          mode == ThemeMode.dark
              ? Icons.light_mode_rounded
              : Icons.dark_mode_rounded,
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
