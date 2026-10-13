import 'dart:convert';
import 'package:http/http.dart' as http;
import 'image_url.dart';

class FavoriteItem {
  final String id;
  final String name;
  final String img;

  const FavoriteItem({
    required this.id,
    required this.name,
    required this.img,
  });

  factory FavoriteItem.fromJson(Map<String, dynamic> json) {
    return FavoriteItem(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      img: (json['img'] ?? '').toString(),
    );
  }

  /// يحوّل مسار الصورة النسبي أو الكامل إلى رابط صالح لـ CachedNetworkImage.
  String get imageUrl => resolveImageUrl(img);
}

class FavoritesService {
  static const String _base = 'https://sofrh-1.onrender.com';

  /// يرجّع المفضلة مجمّعة حسب النوع، أو null لو تعذر الاتصال.
  static Future<Map<String, List<FavoriteItem>>?> fetch(String email) async {
    try {
      final response = await http
          .get(Uri.parse('$_base/favorites/${Uri.encodeComponent(email)}'))
          .timeout(const Duration(seconds: 45));
      if (response.statusCode != 200) return null;

      final data = jsonDecode(utf8.decode(response.bodyBytes));
      final favorites = data is Map ? data['favorites'] : null;
      final result = <String, List<FavoriteItem>>{};

      if (favorites is Map) {
        favorites.forEach((key, value) {
          if (value is List) {
            result[key.toString()] = value
                .whereType<Map>()
                .map((e) => FavoriteItem.fromJson(Map<String, dynamic>.from(e)))
                .toList();
          }
        });
      }
      return result;
    } catch (_) {
      return null;
    }
  }

  static Future<bool> add({
    required String email,
    required String type,
    required String id,
    required String name,
    required String img,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$_base/favorites/add'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'email': email,
              'type': type,
              'id': id,
              'name': name,
              'img': img,
            }),
          )
          .timeout(const Duration(seconds: 30));
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  static Future<bool> remove({
    required String email,
    required String type,
    required String id,
  }) async {
    try {
      final response = await http
          .delete(
            Uri.parse('$_base/favorites/remove'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'email': email, 'type': type, 'id': id}),
          )
          .timeout(const Duration(seconds: 30));
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (_) {
      return false;
    }
  }
}