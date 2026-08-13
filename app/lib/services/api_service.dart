import 'dart:convert';
import 'package:http/http.dart' as http;

const String baseUrl = 'https://sofrh-1.onrender.com';

class ApiService {
  // ─── Countries ───────────────────────────────────────
  static Future<List<dynamic>> getCountries() async {
    final res = await http.get(Uri.parse('$baseUrl/countries'));
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('فشل تحميل الدول');
  }

  static Future<Map<String, dynamic>> getCountry(String id) async {
    final res = await http.get(Uri.parse('$baseUrl/countries/$id'));
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('فشل تحميل تفاصيل الدولة');
  }

  // ─── Events ──────────────────────────────────────────
  static Future<List<dynamic>> getEvents(
      {String filter = 'all', String q = ''}) async {
    final uri = Uri.parse('$baseUrl/events')
        .replace(queryParameters: {'filter': filter, 'q': q});
    final res = await http.get(uri);
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('فشل تحميل الفعاليات');
  }

  // ─── Recipes ─────────────────────────────────────────
  static Future<List<dynamic>> getRecipes(
      {String filter = 'all', String q = ''}) async {
    final uri = Uri.parse('$baseUrl/recipes')
        .replace(queryParameters: {'filter': filter, 'q': q});
    final res = await http.get(uri);
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('فشل تحميل الوصفات');
  }

  // ─── Auth ─────────────────────────────────────────────
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    final res = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(res.body);
    if (res.statusCode == 200) return data;
    throw Exception(data['detail'] ?? 'خطأ في تسجيل الدخول');
  }

  static Future<Map<String, dynamic>> signup(
      String username, String email, String password, String phone) async {
    final res = await http.post(
      Uri.parse('$baseUrl/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'phone': phone,
      }),
    );
    final data = jsonDecode(res.body);
    if (res.statusCode == 200) return data;
    throw Exception(data['detail'] ?? 'خطأ في إنشاء الحساب');
  }

  // ─── Favorites ───────────────────────────────────────
  static Future<List<dynamic>> getFavorites(String email) async {
    final res = await http.get(Uri.parse('$baseUrl/favorites/$email'));
    if (res.statusCode == 200) return jsonDecode(res.body);
    return [];
  }

  static Future<void> saveFavorite({
    required String email,
    required String type,
    required String id,
    required String name,
    required String img,
  }) async {
    await http.post(
      Uri.parse('$baseUrl/favorites/add'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(
          {'email': email, 'type': type, 'id': id, 'name': name, 'img': img}),
    );
  }

  static Future<void> removeFavorite({
    required String email,
    required String type,
    required String id,
  }) async {
    await http.delete(
      Uri.parse('$baseUrl/favorites/remove'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'type': type, 'id': id}),
    );
  }

  // ─── Profile ─────────────────────────────────────────
  /// Uploads an avatar image and returns the Cloudinary URL.
  static Future<String> uploadAvatar({
    required String email,
    required String filePath,
  }) async {
    final request =
        http.MultipartRequest('POST', Uri.parse('$baseUrl/upload-avatar'));
    request.fields['email'] = email;
    request.files.add(await http.MultipartFile.fromPath('file', filePath));
    final streamed = await request.send();
    final body = await streamed.stream.bytesToString();
    final data = jsonDecode(body);
    if (streamed.statusCode == 200) return data['url'] ?? '';
    throw Exception(data['detail'] ?? 'فشل رفع الصورة');
  }

  /// Updates the display name for [email].
  static Future<void> updateProfile({
    required String email,
    required String username,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/update-profile'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'username': username}),
    );
    if (res.statusCode != 200) {
      final data = jsonDecode(res.body);
      throw Exception(data['detail'] ?? 'فشل تحديث الملف الشخصي');
    }
  }
}
