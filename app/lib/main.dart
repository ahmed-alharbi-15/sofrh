import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/countries_screen.dart';
import 'screens/events_screen.dart';
import 'screens/recipes_screen.dart';
import 'screens/plan_screen.dart';
import 'screens/login_screen.dart';
import 'theme_notifier.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await loadUserState();
  runApp(const SofrahApp());
}

const Color primary = Color(0xFF32127A);
const Color accent  = Color(0xFFF28500);
const Color bgColor = Color(0xFFFAF5EB);

// ─────────────────────────────── APP ──────────────────────────────────────
class SofrahApp extends StatelessWidget {
  const SofrahApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeModeNotifier,
      builder: (_, mode, __) => MaterialApp(
        title: 'سفرة',
        debugShowCheckedModeBanner: false,
        themeMode: mode,

        // ── Light theme ────────────────────────────────────────────
        theme: ThemeData(
          colorScheme: const ColorScheme(
            brightness: Brightness.light,
            primary: Color(0xFF32127A),
            onPrimary: Colors.white,
            secondary: Color(0xFFF28500),
            onSecondary: Colors.white,
            error: Colors.red,
            onError: Colors.white,
            surface: Color(0xFFFAF5EB),
            onSurface: Color(0xFF32127A),
          ),
          scaffoldBackgroundColor: const Color(0xFFFAF5EB),
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF32127A),
            foregroundColor: Colors.white,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF32127A),
              foregroundColor: Colors.white,
            ),
          ),
          fontFamily: 'NotoSansArabic',
        ),

        // ── Dark theme ─────────────────────────────────────────────
        darkTheme: ThemeData(
          colorScheme: const ColorScheme(
            brightness: Brightness.dark,
            primary: Color(0xFF32127A),
            onPrimary: Colors.white,
            secondary: Color(0xFFF28500),
            onSecondary: Colors.white,
            error: Colors.red,
            onError: Colors.white,
            surface: Color(0xFF1a1040),
            onSurface: Color(0xFFE0E0E0),
          ),
          scaffoldBackgroundColor: const Color(0xFF0B0933),
          cardColor: const Color(0xFF1a1040),
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF32127A),
            foregroundColor: Colors.white,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF32127A),
              foregroundColor: Colors.white,
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: const Color(0xFF2a1f5e),
            labelStyle: const TextStyle(color: Color(0xFFE0E0E0)),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFF28500)),
            ),
          ),
          fontFamily: 'NotoSansArabic',
        ),

        home: const Directionality(
          textDirection: TextDirection.rtl,
          child: MainScreen(),
        ),
      ),
    );
  }
}

// ─────────────────────────────── MAIN SCREEN ──────────────────────────────
class MainScreen extends StatefulWidget {
  const MainScreen({super.key});
  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _index = 0;

  void _logout() {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (_) => const Directionality(
          textDirection: TextDirection.rtl,
          child: LoginScreen(),
        ),
      ),
      (_) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final screens = <Widget>[
      HomeScreen(
        jumpTo:   (i) => setState(() => _index = i),
        onLogout: _logout,
      ),
      const CountriesScreen(),
      const EventsScreen(),
      const RecipesScreen(),
      const PlanScreen(),
    ];

    return Scaffold(
      body: IndexedStack(index: _index, children: screens),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
        backgroundColor: primary,
        selectedItemColor: accent,
        unselectedItemColor: Colors.white54,
        type: BottomNavigationBarType.fixed,
        selectedLabelStyle:
            const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 11),
        unselectedLabelStyle:
            const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 11),
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded), label: 'الرئيسية'),
          BottomNavigationBarItem(
              icon: Icon(Icons.public_rounded), label: 'الدول'),
          BottomNavigationBarItem(
              icon: Icon(Icons.event_rounded), label: 'الفعاليات'),
          BottomNavigationBarItem(
              icon: Icon(Icons.restaurant_menu_rounded), label: 'الوصفات'),
          BottomNavigationBarItem(
              icon: Icon(Icons.map_rounded), label: 'خطتي'),
        ],
      ),
    );
  }
}
