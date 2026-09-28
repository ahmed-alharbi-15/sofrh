import 'package:shared_preferences/shared_preferences.dart';

class UserSession {
  static Future<void> saveUser({
    required String name,
    required String email,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final previousEmail = prefs.getString('user_email');
    if (previousEmail != null && previousEmail != email) {
      await prefs.remove('user_avatar');
      await prefs.remove('user_phone');
    }
    await prefs.setString('user_name', name);
    await prefs.setString('user_email', email);
    await prefs.setBool('is_logged_in', true);
  }

  static Future<void> saveAvatar(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_avatar', url);
  }

  static Future<void> savePhone(String phone) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_phone', phone);
  }

  static Future<void> clearUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_name');
    await prefs.remove('user_email');
    await prefs.remove('user_avatar');
    await prefs.remove('user_phone');
    await prefs.setBool('is_logged_in', false);
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('is_logged_in') ?? false;
  }

  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_name');
  }

  static Future<String?> getUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_email');
  }

  static Future<String?> getAvatar() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_avatar');
  }

  static Future<String?> getPhone() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_phone');
  }
}