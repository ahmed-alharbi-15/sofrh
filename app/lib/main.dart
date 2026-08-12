import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'screens/countries_screen.dart';
import 'screens/events_screen.dart';
import 'screens/recipes_screen.dart';
import 'screens/plan_screen.dart';
import 'screens/profile_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final isLoggedIn = prefs.getString('sofrah_email') != null;
  runApp(SofrahApp(isLoggedIn: isLoggedIn));
}

const String baseUrl = 'https://sofrh-1.onrender.com';
const Color primary = Color(0xFF32127A);
const Color accent  = Color(0xFFF28500);
const Color bgColor = Color(0xFFFAF5EB);

class SofrahApp extends StatelessWidget {
  final bool isLoggedIn;
  const SofrahApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'سفرة',
      debugShowCheckedModeBanner: false,
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
      home: Directionality(
        textDirection: TextDirection.rtl,
        child: isLoggedIn ? const MainScreen() : const LoginScreen(),
      ),
    );
  }
}

// ───────────────────────────── MAIN SCREEN ─────────────────────────────
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
      MaterialPageRoute(builder: (_) => const Directionality(
        textDirection: TextDirection.rtl,
        child: LoginScreen(),
      )),
      (_) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final screens = <Widget>[
      const _HomeTab(),
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
        selectedLabelStyle: const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 11),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'الرئيسية'),
          BottomNavigationBarItem(icon: Icon(Icons.public_rounded), label: 'الدول'),
          BottomNavigationBarItem(icon: Icon(Icons.event_rounded), label: 'الفعاليات'),
          BottomNavigationBarItem(icon: Icon(Icons.restaurant_menu_rounded), label: 'الوصفات'),
          BottomNavigationBarItem(icon: Icon(Icons.map_rounded), label: 'خطتي'),
        ],
      ),
    );
  }
}

// ───────────────────────────── HOME TAB ─────────────────────────────
class _HomeTab extends StatelessWidget {
  const _HomeTab();

  void _jumpTo(BuildContext context, int index) {
    final state = context.findAncestorStateOfType<_MainScreenState>();
    state?.setState(() => state._index = index);
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          backgroundColor: primary,
          title: const Text(
            'سفرة',
            style: TextStyle(
              color: accent,
              fontSize: 28,
              fontWeight: FontWeight.bold,
              fontFamily: 'NotoSansArabic',
            ),
          ),
          centerTitle: false,
          actions: [
            IconButton(
              icon: const Icon(Icons.person_rounded, color: Colors.white),
              onPressed: () => Navigator.push(context, MaterialPageRoute(
                builder: (_) => ProfileScreen(onLogout: () async {
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.clear();
                  if (!context.mounted) return;
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const Directionality(
                      textDirection: TextDirection.rtl,
                      child: LoginScreen(),
                    )),
                    (_) => false,
                  );
                }),
              )),
            ),
          ],
        ),
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Hero ──
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(24, 36, 24, 36),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [primary, Color(0xFF1a0f2e)],
                    begin: Alignment.topRight,
                    end: Alignment.bottomLeft,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text(
                      'سافر وتذوّق',
                      textAlign: TextAlign.right,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'NotoSansArabic',
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'اكتشف وجهات وماكولات من مختلف أنحاء العالم',
                      textAlign: TextAlign.right,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.72),
                        fontSize: 14,
                        fontFamily: 'NotoSansArabic',
                      ),
                    ),
                    const SizedBox(height: 28),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        _stat('+190', 'دولة'),
                        const SizedBox(width: 32),
                        _stat('+700', 'فعالية'),
                        const SizedBox(width: 32),
                        _stat('+300', 'وصفة'),
                      ],
                    ),
                  ],
                ),
              ),
              // ── Cards ──
              Padding(
                padding: const EdgeInsets.all(16),
                child: GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.1,
                  children: [
                    _QuickCard(
                      title: 'الدول',
                      desc: 'اكتشف أجمل الوجهات',
                      icon: Icons.public,
                      onTap: () => _jumpTo(context, 1),
                    ),
                    _QuickCard(
                      title: 'الفعاليات',
                      desc: 'فعاليات عالمية مميزة',
                      icon: Icons.event,
                      onTap: () => _jumpTo(context, 2),
                    ),
                    _QuickCard(
                      title: 'الوصفات',
                      desc: 'نكهات من كل العالم',
                      icon: Icons.restaurant,
                      onTap: () => _jumpTo(context, 3),
                    ),
                    _QuickCard(
                      title: 'خطتي',
                      desc: 'خطط رحلتك المثالية',
                      icon: Icons.map,
                      onTap: () => _jumpTo(context, 4),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _stat(String number, String label) => Column(
    children: [
      Text(number,
          style: const TextStyle(
              color: accent, fontSize: 22, fontWeight: FontWeight.bold)),
      const SizedBox(height: 2),
      Text(label,
          style: TextStyle(
              color: Colors.white.withOpacity(0.65),
              fontSize: 12,
              fontFamily: 'NotoSansArabic')),
    ],
  );
}


class _QuickCard extends StatelessWidget {
  final String title, desc;
  final IconData icon;
  final VoidCallback onTap;
  const _QuickCard({required this.title, required this.desc,
    required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Icon(icon, color: primary, size: 34),
              const SizedBox(height: 10),
              Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold,
                  color: primary, fontFamily: 'NotoSansArabic')),
              const SizedBox(height: 4),
              Text(desc, style: const TextStyle(fontSize: 11, color: Colors.grey,
                  fontFamily: 'NotoSansArabic'), textAlign: TextAlign.right),
            ],
          ),
        ),
      ),
    );
  }
}

// ───────────────────────────── LOGIN SCREEN ─────────────────────────────
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  bool _loading = false;
  bool _showPass = false;

  Future<void> _login() async {
    if (_emailCtrl.text.isEmpty || _passCtrl.text.isEmpty) {
      _err('يرجى ملء جميع الحقول');
      return;
    }
    setState(() => _loading = true);
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': _emailCtrl.text.trim(), 'password': _passCtrl.text}),
      );
      final data = jsonDecode(res.body);
      if (res.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('sofrah_email', _emailCtrl.text.trim());
        await prefs.setString('sofrah_username', data['username'] ?? '');
        if (!mounted) return;
        Navigator.pushAndRemoveUntil(context,
          MaterialPageRoute(builder: (_) => const Directionality(
            textDirection: TextDirection.rtl, child: MainScreen())),
          (_) => false);
      } else {
        _err(data['detail'] ?? 'خطأ في تسجيل الدخول');
      }
    } catch (_) { _err('فشل الاتصال بالسيرفر'); }
    setState(() => _loading = false);
  }

  void _err(String msg) => ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg, style: const TextStyle(fontFamily: 'NotoSansArabic')),
          backgroundColor: Colors.red[700]));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(28),
          child: Column(children: [
            const Text('سفرة', style: TextStyle(fontSize: 52,
                fontWeight: FontWeight.bold, color: primary)),
            const SizedBox(height: 6),
            const Text('أهلاً بك مجدداً 👋',
                style: TextStyle(color: Colors.grey, fontSize: 16, fontFamily: 'NotoSansArabic')),
            const SizedBox(height: 36),
            _field('البريد الإلكتروني', _emailCtrl,
                keyboardType: TextInputType.emailAddress),
            const SizedBox(height: 16),
            TextField(
              controller: _passCtrl, obscureText: !_showPass,
              decoration: _deco('كلمة المرور').copyWith(
                suffixIcon: IconButton(
                  icon: Icon(_showPass ? Icons.visibility_off : Icons.visibility),
                  onPressed: () => setState(() => _showPass = !_showPass),
                ),
              ),
            ),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity, height: 52,
              child: ElevatedButton(
                onPressed: _loading ? null : _login,
                style: ElevatedButton.styleFrom(
                  backgroundColor: primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: _loading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('دخول', style: TextStyle(fontSize: 18, color: Colors.white,
                        fontFamily: 'NotoSansArabic')),
              ),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const SignupScreen())),
              child: const Text('ما عندك حساب؟ إنشاء حساب جديد',
                  style: TextStyle(color: accent, fontFamily: 'NotoSansArabic')),
            ),
          ]),
        ),
      ),
    );
  }

  Widget _field(String label, TextEditingController ctrl,
      {TextInputType? keyboardType}) =>
      TextField(controller: ctrl, keyboardType: keyboardType,
          decoration: _deco(label));

  InputDecoration _deco(String label) => InputDecoration(
    labelText: label,
    labelStyle: const TextStyle(fontFamily: 'NotoSansArabic'),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: primary, width: 2),
    ),
  );
}

// ───────────────────────────── SIGNUP SCREEN ─────────────────────────────
class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameCtrl  = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  bool _loading = false;
  bool _showPass = false;

  Future<void> _signup() async {
    if ([_nameCtrl, _emailCtrl, _phoneCtrl, _passCtrl].any((c) => c.text.isEmpty)) {
      _err('يرجى ملء جميع الحقول');
      return;
    }
    setState(() => _loading = true);
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': _nameCtrl.text.trim(),
          'email': _emailCtrl.text.trim(),
          'phone': _phoneCtrl.text.trim(),
          'password': _passCtrl.text,
        }),
      );
      final data = jsonDecode(res.body);
      if (res.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('sofrah_email', _emailCtrl.text.trim());
        await prefs.setString('sofrah_username', _nameCtrl.text.trim());
        if (!mounted) return;
        Navigator.pushAndRemoveUntil(context,
          MaterialPageRoute(builder: (_) => const Directionality(
            textDirection: TextDirection.rtl, child: MainScreen())),
          (_) => false);
      } else {
        _err(data['detail'] ?? 'خطأ في إنشاء الحساب');
      }
    } catch (_) { _err('فشل الاتصال بالسيرفر'); }
    setState(() => _loading = false);
  }

  void _err(String msg) => ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg, style: const TextStyle(fontFamily: 'NotoSansArabic')),
          backgroundColor: Colors.red[700]));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: primary,
        title: const Text('إنشاء حساب',
            style: TextStyle(color: Colors.white, fontFamily: 'NotoSansArabic')),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          const SizedBox(height: 8),
          _field('الاسم', _nameCtrl),
          const SizedBox(height: 16),
          _field('البريد الإلكتروني', _emailCtrl, keyboardType: TextInputType.emailAddress),
          const SizedBox(height: 16),
          _field('رقم الجوال', _phoneCtrl, keyboardType: TextInputType.phone),
          const SizedBox(height: 16),
          TextField(
            controller: _passCtrl, obscureText: !_showPass,
            decoration: _deco('كلمة المرور').copyWith(
              suffixIcon: IconButton(
                icon: Icon(_showPass ? Icons.visibility_off : Icons.visibility),
                onPressed: () => setState(() => _showPass = !_showPass),
              ),
            ),
          ),
          const SizedBox(height: 28),
          SizedBox(
            width: double.infinity, height: 52,
            child: ElevatedButton(
              onPressed: _loading ? null : _signup,
              style: ElevatedButton.styleFrom(
                backgroundColor: primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: _loading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('إنشاء الحساب',
                      style: TextStyle(fontSize: 18, color: Colors.white, fontFamily: 'NotoSansArabic')),
            ),
          ),
        ]),
      ),
    );
  }

  Widget _field(String label, TextEditingController ctrl, {TextInputType? keyboardType}) =>
      TextField(controller: ctrl, keyboardType: keyboardType, decoration: _deco(label));

  InputDecoration _deco(String label) => InputDecoration(
    labelText: label,
    labelStyle: const TextStyle(fontFamily: 'NotoSansArabic'),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: primary, width: 2),
    ),
  );
}
