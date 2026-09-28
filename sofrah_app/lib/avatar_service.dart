import 'dart:convert';
import 'package:http/http.dart' as http;

class AvatarService {
  static const String _base = 'https://sofrh-1.onrender.com';

  /// يرجّع رابط الصورة، أو '' لو ما رفع صورة، أو null لو تعذر الاتصال.
  static Future<String?> fetchAvatar(String email) async {
    try {
      final response = await http
          .get(Uri.parse('$_base/avatar/${Uri.encodeComponent(email)}'))
          .timeout(const Duration(seconds: 30));
      if (response.statusCode != 200) return null;
      final data = jsonDecode(utf8.decode(response.bodyBytes));
      if (data is Map) return (data['avatar'] ?? '').toString();
      return null;
    } catch (_) {
      return null;
    }
  }

  /// يرفع الصورة ويرجّع الرابط الجديد، أو null لو فشل الرفع.
  static Future<String?> uploadAvatar({
    required String username,
    required String filePath,
  }) async {
    try {
      final uri = Uri.parse('$_base/upload-avatar')
          .replace(queryParameters: {'username': username});
      final request = http.MultipartRequest('POST', uri);
      request.files.add(await http.MultipartFile.fromPath('file', filePath));
      final streamed = await request.send().timeout(const Duration(seconds: 60));
      final response = await http.Response.fromStream(streamed);
      if (response.statusCode != 200) return null;
      final data = jsonDecode(utf8.decode(response.bodyBytes));
      if (data is Map && data['url'] != null) return data['url'].toString();
      return null;
    } catch (_) {
      return null;
    }
  }
}