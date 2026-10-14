import 'dart:convert';
import 'package:http/http.dart' as http;

/// يبني رابط صورة المدينة. يقبل مسار نسبي (/img/...) أو رابط كامل،
/// ويرمّز المسافات والحروف العربية.
String cityImageUrl(String raw) {
  final path = raw.trim();
  if (path.isEmpty) return '';
  if (path.startsWith('http')) return Uri.encodeFull(path);
  final normalized = path.startsWith('/') ? path : '/$path';
  return Uri.encodeFull('https://sofrh.vercel.app$normalized');
}

/// الحقول في الباك إند نص واحد مفصول بـ |
List<String> _splitList(dynamic value) {
  if (value == null) return [];
  return value
      .toString()
      .split('|')
      .map((e) => e.trim())
      .where((e) => e.isNotEmpty)
      .toList();
}

class City {
  final int id;
  final String slug;
  final String name;
  final String imageUrl;
  final String description;
  final List<String> historic;
  final List<String> restaurants;
  final List<String> cafes;
  final List<String> activities;

  const City({
    required this.id,
    required this.slug,
    required this.name,
    required this.imageUrl,
    required this.description,
    required this.historic,
    required this.restaurants,
    required this.cafes,
    required this.activities,
  });

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      id: json['id'] is int
          ? json['id'] as int
          : int.tryParse('${json['id']}') ?? 0,
      slug: (json['slug'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      imageUrl: cityImageUrl((json['image_url'] ?? '').toString()),
      description: (json['description'] ?? '').toString(),
      historic: _splitList(json['historic']),
      restaurants: _splitList(json['restaurants']),
      cafes: _splitList(json['cafes']),
      activities: _splitList(json['events_list']),
    );
  }

  /// الاسم بالعربي (قبل الشرطة): "أوساكا – Osaka" يرجع "أوساكا"
  String get arabicName => name.split(' – ').first.trim();

  /// الاسم بالإنجليزي (بعد الشرطة)، أو فاضي لو ما فيه
  String get englishName {
    final parts = name.split(' – ');
    return parts.length > 1 ? parts.sublist(1).join(' – ').trim() : '';
  }
}

Future<List<City>> fetchCities(String countrySlug) async {
  final response = await http
      .get(
        Uri.parse(
          'https://sofrh-1.onrender.com/countries/'
          '${Uri.encodeComponent(countrySlug)}/cities',
        ),
      )
      .timeout(const Duration(seconds: 45));

  if (response.statusCode != 200) {
    throw Exception('فشل تحميل المدن');
  }

  final data = jsonDecode(utf8.decode(response.bodyBytes));
  if (data is! List) throw Exception('رد غير متوقع');

  return data
      .whereType<Map>()
      .map((e) => City.fromJson(Map<String, dynamic>.from(e)))
      .toList();
}