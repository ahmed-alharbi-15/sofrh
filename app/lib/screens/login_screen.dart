import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../theme_notifier.dart';
import 'signup_screen.dart';

const Color primary = Color(0xFF32127A);
const Color accent  = Color(0xFFF28500);
const Color bgLight = Color(0xFFFAF5EB);
const Color bgDark  = Color(0xFF0B0933);
const String baseUrl = 'https://sofrh-1.onrender.com';

class LoginScreen extends StatefulWidget {
  final VoidCallback? onLoginSuccess;
  const LoginScreen({super.key, this.onLoginSuccess});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  bool _loading  = false;
  bool _showPass = false;

  Future<void> _login() async {
    if (_emailCtrl.text.trim().isEmpty || _passCtrl.text.isEmpty) {
      _err('يرجى ملء جميع الحقول');
      return;
    }
    setState(() => _loading = true);
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _emailCtrl.text.trim(),
          'password': _passCtrl.text,
        }),
      );
      final data = jsonDecode(res.body);
      if (res.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('sofrah_email', _emailCtrl.text.trim());
        await prefs.setString('sofrah_username', data['username'] ?? '');
        emailNotifier.value    = _emailCtrl.text.trim();
        usernameNotifier.value = data['username'] ?? '';
        if (!mounted) return;
        if (widget.onLoginSuccess != null) {
          widget.onLoginSuccess!();
        } else {
          Navigator.pop(context);
        }
      } else {
        _err(data['detail'] ?? 'خطأ في تسجيل الدخول');
      }
    } catch (_) {
      _err('فشل الاتصال بالسيرفر');
    }
    if (mounted) setState(() => _loading = false);
  }

  void _err(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg, style: const TextStyle(fontFamily: 'NotoSansArabic')),
      backgroundColor: Colors.red[700],
    ));
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg  = isDark ? const Color(0xFF1a1040) : Colors.white;
    final inputBg = isDark ? const Color(0xFF2a1f5e) : Colors.white;
    final labelColor = isDark ? const Color(0xFFE0E0E0) : primary;
    final subColor = isDark ? const Color(0xFFE0E0E0).withOpacity(0.7) : const Color(0xFF9b7a5e);
    final scaffoldBg = isDark
        ? bgDark
        : const Color(0xFFF0EBE0);

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: scaffoldBg,
        appBar: AppBar(
          backgroundColor: primary,
          title: Image.asset('assets/logo7.png', height: 40),
          centerTitle: true,
          actions: [const ThemeToggleBtn()],
          leading: Navigator.canPop(context)
              ? IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
                  onPressed: () => Navigator.pop(context))
              : null,
        ),
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Container(
              width: double.infinity,
              constraints: const BoxConstraints(maxWidth: 420),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: primary.withOpacity(0.12),
                    blurRadius: 60,
                    offset: const Offset(0, 20),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // لوغو
                  Image.asset('assets/logo7.png', height: 80),
                  const SizedBox(height: 20),
                  Text('تسجيل الدخول',
                      style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold,
                          color: isDark ? const Color(0xFFE0E0E0) : primary,
                          fontFamily: 'NotoSansArabic')),
                  const SizedBox(height: 8),
                  Text('أهلاً بك مجدداً في سفرة',
                      style: TextStyle(fontSize: 15, color: subColor,
                          fontFamily: 'NotoSansArabic')),
                  const SizedBox(height: 28),
                  // البريد الإلكتروني
                  _inputGroup(
                    label: 'البريد الإلكتروني',
                    controller: _emailCtrl,
                    hint: 'example@email.com',
                    keyboardType: TextInputType.emailAddress,
                    inputBg: inputBg,
                    labelColor: labelColor,
                    isDark: isDark,
                  ),
                  const SizedBox(height: 16),
                  // كلمة المرور
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('كلمة المرور',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600,
                              color: labelColor, fontFamily: 'NotoSansArabic')),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _passCtrl,
                        obscureText: !_showPass,
                        textDirection: TextDirection.ltr,
                        decoration: _inputDeco('••••••••', inputBg, isDark).copyWith(
                          suffixIcon: IconButton(
                            icon: Text(_showPass ? '🙈' : '👁️',
                                style: const TextStyle(fontSize: 18)),
                            onPressed: () => setState(() => _showPass = !_showPass),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 22),
                  // زر دخول
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _login,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: _loading
                          ? const SizedBox(height: 22, width: 22,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                          : const Text('دخول',
                              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold,
                                  color: Colors.white, fontFamily: 'NotoSansArabic')),
                    ),
                  ),
                  const SizedBox(height: 20),
                  // رابط إنشاء حساب
                  Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    GestureDetector(
                      onTap: () => Navigator.pushReplacement(context,
                          MaterialPageRoute(builder: (_) => const SignupScreen())),
                      child: const Text('إنشاء حساب',
                          style: TextStyle(color: accent, fontWeight: FontWeight.bold,
                              fontFamily: 'NotoSansArabic')),
                    ),
                    Text(' ما عندك حساب؟',
                        style: TextStyle(color: subColor, fontFamily: 'NotoSansArabic')),
                  ]),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _inputGroup({
    required String label,
    required TextEditingController controller,
    required String hint,
    required Color inputBg,
    required Color labelColor,
    required bool isDark,
    TextInputType? keyboardType,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(label,
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600,
                color: labelColor, fontFamily: 'NotoSansArabic')),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          textAlign: TextAlign.right,
          decoration: _inputDeco(hint, inputBg, isDark),
        ),
      ],
    );
  }

  InputDecoration _inputDeco(String hint, Color fillColor, bool isDark) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: Colors.grey.withOpacity(0.6)),
      filled: true,
      fillColor: fillColor,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
            color: isDark ? accent.withOpacity(0.3) : primary.withOpacity(0.1)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
            color: isDark ? accent.withOpacity(0.3) : primary.withOpacity(0.1), width: 2),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: accent, width: 2),
      ),
    );
  }
}
