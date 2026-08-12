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
  static Future<List<dynamic>> getEvents({String filter = 'all', String q = ''}) async {
    final uri = Uri.parse('$baseUrl/events').replace(
      queryParameters: {'filter': filter, 'q': q},
    );
    final res = await http.get(uri);
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('فشل تحميل الفعاليات');
  }

  // ─── Recipes ─────────────────────────────────────────
  static Future<List<dynamic>> getRecipes({String filter = 'all', String q = ''}) async {
    final uri = Uri.parse('$baseUrl/recipes').replace(
      queryParameters: {'filter': filter, 'q': q},
    );
    final res = await http.get(uri);
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('فشل تحميل الوصفات');
  }

  // ─── Auth ─────────────────────────────────────────────
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(res.body);
    if (res.statusCode == 200) return data;
    throw Exception(data['detail'] ?? 'خطأ في تسجيل الدخول');
  }

  static Future<Map<String, dynamic>> register(
      String username, String email, String password, String phone) async {
    final res = await http.post(
      Uri.parse('$baseUrl/register'),
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
      Uri.parse('$baseUrl/favorites'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'type': type, 'id': id, 'name': name, 'img': img}),
    );
  }

  static Future<void> removeFavorite({
    required String email,
    required String type,
    required String id,
  }) async {
    await http.delete(
      Uri.parse('$baseUrl/favorites'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'type': type, 'id': id}),
    );
  }
}
