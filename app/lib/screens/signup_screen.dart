import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme_notifier.dart';
import '../services/api_service.dart';
import 'login_screen.dart';

const Color primary = Color(0xFF32127A);
const Color accent  = Color(0xFFF28500);

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameCtrl    = TextEditingController();
  final _emailCtrl   = TextEditingController();
  final _phoneCtrl   = TextEditingController();
  final _passCtrl    = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _loading      = false;
  bool _showPass     = false;
  bool _showConfirm  = false;

  Future<void> _signup() async {
    if (_nameCtrl.text.trim().length < 4) {
      _err('اسم المستخدم يجب أن يكون 4 خانات على الأقل'); return;
    }
    if (_emailCtrl.text.trim().isEmpty) { _err('أدخل البريد الإلكتروني'); return; }
    if (_passCtrl.text.isEmpty) { _err('أدخل كلمة المرور'); return; }
    if (_passCtrl.text != _confirmCtrl.text) { _err('كلمتا المرور غير متطابقتين'); return; }

    setState(() => _loading = true);
    try {
      await ApiService.signup(
        _nameCtrl.text.trim(),
        _emailCtrl.text.trim(),
        _passCtrl.text,
        _phoneCtrl.text.trim(),
      );
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('sofrah_email', _emailCtrl.text.trim());
      await prefs.setString('sofrah_username', _nameCtrl.text.trim());
      emailNotifier.value    = _emailCtrl.text.trim();
      usernameNotifier.value = _nameCtrl.text.trim();
      if (!mounted) return;
      Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (_) => const LoginScreen()));
    } catch (e) {
      _err(e.toString().replaceAll('Exception: ', ''));
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
    _nameCtrl.dispose(); _emailCtrl.dispose();
    _phoneCtrl.dispose(); _passCtrl.dispose(); _confirmCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg   = isDark ? const Color(0xFF1a1040) : Colors.white;
    final inputBg  = isDark ? const Color(0xFF2a1f5e) : Colors.white;
    final labelClr = isDark ? const Color(0xFFE0E0E0) : primary;
    final subClr   = isDark ? const Color(0xFFE0E0E0).withOpacity(0.7) : const Color(0xFF9b7a5e);

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: isDark ? const Color(0xFF0B0933) : const Color(0xFFF0EBE0),
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
              padding: const EdgeInsets.all(36),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Image.asset('assets/logo7.png', height: 72),
                  const SizedBox(height: 16),
                  Text('إنشاء حساب',
                      style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold,
                          color: isDark ? const Color(0xFFE0E0E0) : primary,
                          fontFamily: 'NotoSansArabic')),
                  const SizedBox(height: 6),
                  Text('انضم إلى سفرة واستكشف العالم',
                      style: TextStyle(fontSize: 15, color: subClr,
                          fontFamily: 'NotoSansArabic')),
                  const SizedBox(height: 24),
                  _field('اسم المستخدم (4 خانات على الأقل)', _nameCtrl,
                      'اسم الحساب', inputBg, labelClr, isDark),
                  const SizedBox(height: 14),
                  _field('البريد الإلكتروني', _emailCtrl, 'example@email.com',
                      inputBg, labelClr, isDark, keyboardType: TextInputType.emailAddress),
                  const SizedBox(height: 14),
                  _field('رقم الجوال (اختياري)', _phoneCtrl, '05xxxxxxxx',
                      inputBg, labelClr, isDark, keyboardType: TextInputType.phone),
                  const SizedBox(height: 14),
                  _passField('كلمة المرور (تبدأ بحرف كبير ورقم)', _passCtrl,
                      _showPass, (v) => setState(() => _showPass = v), inputBg, labelClr, isDark),
                  const SizedBox(height: 14),
                  _passField('تأكيد كلمة المرور', _confirmCtrl,
                      _showConfirm, (v) => setState(() => _showConfirm = v), inputBg, labelClr, isDark),
                  const SizedBox(height: 22),
                  SizedBox(
                    width: double.infinity, height: 52,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _signup,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: _loading
                          ? const SizedBox(height: 22, width: 22,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                          : const Text('إنشاء الحساب',
                              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold,
                                  color: Colors.white, fontFamily: 'NotoSansArabic')),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    GestureDetector(
                      onTap: () => Navigator.pushReplacement(context,
                          MaterialPageRoute(builder: (_) => const LoginScreen())),
                      child: const Text('تسجيل الدخول',
                          style: TextStyle(color: accent, fontWeight: FontWeight.bold,
                              fontFamily: 'NotoSansArabic')),
                    ),
                    Text(' عندك حساب؟',
                        style: TextStyle(color: subClr, fontFamily: 'NotoSansArabic')),
                  ]),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _field(String label, TextEditingController ctrl, String hint,
      Color inputBg, Color labelClr, bool isDark, {TextInputType? keyboardType}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
      Text(label,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
              color: labelClr, fontFamily: 'NotoSansArabic')),
      const SizedBox(height: 6),
      TextField(
        controller: ctrl, keyboardType: keyboardType, textAlign: TextAlign.right,
        decoration: _deco(hint, inputBg, isDark),
      ),
    ]);
  }

  Widget _passField(String label, TextEditingController ctrl, bool show,
      ValueChanged<bool> onToggle, Color inputBg, Color labelClr, bool isDark) {
    return Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
      Text(label,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
              color: labelClr, fontFamily: 'NotoSansArabic')),
      const SizedBox(height: 6),
      TextField(
        controller: ctrl, obscureText: !show,
        textDirection: TextDirection.ltr,
        decoration: _deco('••••••••', inputBg, isDark).copyWith(
          suffixIcon: IconButton(
            icon: Text(show ? '🙈' : '👁️', style: const TextStyle(fontSize: 18)),
            onPressed: () => onToggle(!show),
          ),
        ),
      ),
    ]);
  }

  InputDecoration _deco(String hint, Color fillColor, bool isDark) => InputDecoration(
    hintText: hint,
    hintStyle: TextStyle(color: Colors.grey.withOpacity(0.6)),
    filled: true, fillColor: fillColor,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: isDark ? accent.withOpacity(0.3) : primary.withOpacity(0.1))),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
            color: isDark ? accent.withOpacity(0.3) : primary.withOpacity(0.1), width: 2)),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: accent, width: 2)),
  );
}
