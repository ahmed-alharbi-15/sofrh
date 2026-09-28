import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class RememberMe {
  static const _storage = FlutterSecureStorage();

  static Future<void> save(String email, String password) async {
    await _storage.write(key: 'remember_email', value: email);
    await _storage.write(key: 'remember_password', value: password);
  }

  static Future<void> clear() async {
    await _storage.delete(key: 'remember_email');
    await _storage.delete(key: 'remember_password');
  }

  static Future<Map<String, String>?> load() async {
    final email = await _storage.read(key: 'remember_email');
    final password = await _storage.read(key: 'remember_password');
    if (email == null || password == null) return null;
    return {'email': email, 'password': password};
  }
}