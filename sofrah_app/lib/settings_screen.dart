import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'app_colors.dart';
import 'user_session.dart';
import 'avatar_service.dart';
import 'account_avatar.dart';
import 'remember_me.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  static const String _base = 'https://sofrh-1.onrender.com';

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _currentPasswordController =
      TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  String _savedName = '';
  String _email = '';
  String _avatarUrl = '';
  bool _obscurePasswords = true;
  bool _savingProfile = false;
  bool _changingPassword = false;
  bool _uploadingAvatar = false;

  @override
  void initState() {
    super.initState();
    _loadCurrentData();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _loadCurrentData() async {
    final name = await UserSession.getUserName() ?? '';
    final email = await UserSession.getUserEmail() ?? '';
    final phone = await UserSession.getPhone() ?? '';
    final avatar = await UserSession.getAvatar() ?? '';
    if (!mounted) return;
    setState(() {
      _savedName = name;
      _email = email;
      _avatarUrl = avatar;
      _nameController.text = name;
      _emailController.text = email;
      _phoneController.text = phone;
    });
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  String _detail(http.Response response, String fallback) {
    try {
      final data = jsonDecode(utf8.decode(response.bodyBytes));
      if (data is Map && data['detail'] is String) {
        return data['detail'] as String;
      }
    } catch (_) {}
    return fallback;
  }

  Future<void> _changeAvatar() async {
    final picked = await ImagePicker().pickImage(
      source: ImageSource.gallery,
      maxWidth: 1024,
      imageQuality: 85,
    );
    if (picked == null) return;

    setState(() => _uploadingAvatar = true);
    final url = await AvatarService.uploadAvatar(
      username: _savedName,
      filePath: picked.path,
    );
    if (!mounted) return;
    setState(() => _uploadingAvatar = false);

    if (url == null) {
      _showMessage('تعذر رفع الصورة');
      return;
    }

    await UserSession.saveAvatar(url);
    if (!mounted) return;
    setState(() => _avatarUrl = url);
    _showMessage('تم تحديث الصورة');
  }

  Future<void> _saveProfile() async {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();

    if (name.isEmpty || phone.isEmpty) {
      _showMessage('عبّي الاسم ورقم الجوال');
      return;
    }

    setState(() => _savingProfile = true);

    try {
      final response = await http.post(
        Uri.parse('$_base/update-profile'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': _email,
          'phone': phone,
        }),
      );

      if (!mounted) return;
      setState(() => _savingProfile = false);

      if (response.statusCode == 200) {
        await UserSession.saveUser(name: name, email: _email);
        await UserSession.savePhone(phone);
        if (!mounted) return;
        setState(() => _savedName = name);
        _showMessage('تم حفظ التغييرات');
      } else {
        _showMessage(_detail(response, 'تعذر حفظ التغييرات'));
      }
    } catch (_) {
      if (!mounted) return;
      setState(() => _savingProfile = false);
      _showMessage('تعذر الاتصال بالسيرفر');
    }
  }

  Future<void> _changePassword() async {
    final current = _currentPasswordController.text;
    final next = _newPasswordController.text;
    final confirm = _confirmPasswordController.text;

    if (current.isEmpty || next.isEmpty || confirm.isEmpty) {
      _showMessage('عبّي كل حقول كلمة المرور');
      return;
    }
    if (next != confirm) {
      _showMessage('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    setState(() => _changingPassword = true);

    try {
      final response = await http.post(
        Uri.parse('$_base/change-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'currentPassword': current,
          'newPassword': next,
          'email': _email,
        }),
      );

      if (!mounted) return;
      setState(() => _changingPassword = false);

      if (response.statusCode == 200) {
        final saved = await RememberMe.load();
        if (saved != null && saved['email'] == _email) {
          await RememberMe.save(_email, next);
        }
        if (!mounted) return;
        _currentPasswordController.clear();
        _newPasswordController.clear();
        _confirmPasswordController.clear();
        _showMessage('تم تغيير كلمة المرور');
      } else {
        _showMessage(_detail(response, 'تعذر تغيير كلمة المرور'));
      }
    } catch (_) {
      if (!mounted) return;
      setState(() => _changingPassword = false);
      _showMessage('تعذر الاتصال بالسيرفر');
    }
  }

  Widget _field({
    required TextEditingController controller,
    required String label,
    required Color cardColor,
    required Color textColor,
    TextInputType? keyboardType,
    bool obscure = false,
    bool enabled = true,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscure,
      enabled: enabled,
      style: TextStyle(color: textColor),
      decoration: InputDecoration(
        labelText: label,
        filled: true,
        fillColor: cardColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _spinner() {
    return const SizedBox(
      height: 20,
      width: 20,
      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
    );
  }

  ButtonStyle _buttonStyle() {
    return ElevatedButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: AppColors.textOnPrimary,
      padding: const EdgeInsets.symmetric(vertical: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final cardColor = isDark ? AppColors.darkCard : AppColors.lightCard;
    final textColor = isDark ? AppColors.darkText : AppColors.textOnBackground;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.textOnPrimary,
        title: const Text('الإعدادات'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: AccountAvatar(
                  name: _savedName,
                  avatarUrl: _avatarUrl,
                  radius: 44,
                ),
              ),
              const SizedBox(height: 8),
              TextButton.icon(
                onPressed: _uploadingAvatar ? null : _changeAvatar,
                icon: _uploadingAvatar
                    ? const SizedBox(
                        height: 16,
                        width: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.photo_camera_outlined),
                label: const Text('تغيير الصورة'),
                style: TextButton.styleFrom(foregroundColor: AppColors.accent),
              ),
              const SizedBox(height: 16),
              _field(
                controller: _nameController,
                label: 'الاسم',
                cardColor: cardColor,
                textColor: textColor,
              ),
              const SizedBox(height: 16),
              _field(
                controller: _emailController,
                label: 'البريد الإلكتروني (لا يمكن تغييره)',
                cardColor: cardColor,
                textColor: textColor,
                keyboardType: TextInputType.emailAddress,
                enabled: false,
              ),
              const SizedBox(height: 16),
              _field(
                controller: _phoneController,
                label: 'رقم الجوال',
                cardColor: cardColor,
                textColor: textColor,
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _savingProfile ? null : _saveProfile,
                style: _buttonStyle(),
                child: _savingProfile ? _spinner() : const Text('حفظ التغييرات'),
              ),
              const SizedBox(height: 32),
              Divider(color: textColor.withValues(alpha: 0.2)),
              const SizedBox(height: 16),
              Text(
                'تغيير كلمة المرور',
                style: TextStyle(
                  color: textColor,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'لازم تكون 8 خانات على الأقل وفيها حرف كبير وحرف صغير ورقم',
                style: TextStyle(
                  color: textColor.withValues(alpha: 0.7),
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 16),
              _field(
                controller: _currentPasswordController,
                label: 'كلمة المرور الحالية',
                cardColor: cardColor,
                textColor: textColor,
                obscure: _obscurePasswords,
              ),
              const SizedBox(height: 16),
              _field(
                controller: _newPasswordController,
                label: 'كلمة المرور الجديدة',
                cardColor: cardColor,
                textColor: textColor,
                obscure: _obscurePasswords,
              ),
              const SizedBox(height: 16),
              _field(
                controller: _confirmPasswordController,
                label: 'تأكيد كلمة المرور الجديدة',
                cardColor: cardColor,
                textColor: textColor,
                obscure: _obscurePasswords,
              ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton.icon(
                  onPressed: () {
                    setState(() => _obscurePasswords = !_obscurePasswords);
                  },
                  icon: Icon(
                    _obscurePasswords ? Icons.visibility_off : Icons.visibility,
                    size: 18,
                  ),
                  label: Text(_obscurePasswords ? 'إظهار' : 'إخفاء'),
                  style: TextButton.styleFrom(foregroundColor: textColor),
                ),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: _changingPassword ? null : _changePassword,
                style: _buttonStyle(),
                child: _changingPassword
                    ? _spinner()
                    : const Text('تغيير كلمة المرور'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}