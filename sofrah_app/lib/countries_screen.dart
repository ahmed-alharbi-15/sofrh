import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'app_colors.dart';


String normalizeArabic(String text) {
  return text
      .replaceAll('أ', 'ا')
      .replaceAll('إ', 'ا')
      .replaceAll('آ', 'ا')
      .replaceAll('ى', 'ا')
      .replaceAll('ة', 'ه');
}

class Country {
  final String name;
  final String continent;
  final String imageUrl;

  const Country({
    required this.name,
    required this.continent,
    required this.imageUrl,
  });

  factory Country.fromJson(Map<String, dynamic> json) {
    return Country(
      name: json['name'] ?? '',
      continent: json['continent'] ?? '',
      imageUrl: 'https://sofrh.vercel.app${json['image_url'] ?? ''}',
    );
  }
}

Future<List<Country>> fetchCountries() async {
  final response = await http.get(
    Uri.parse('https://sofrh-1.onrender.com/countries'),
  );

  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
    return data.map((item) => Country.fromJson(item)).toList();
  } else {
    throw Exception('فشل تحميل الدول');
  }
}

class CountriesScreen extends StatefulWidget {
  const CountriesScreen({super.key});

  @override
  State<CountriesScreen> createState() => _CountriesScreenState();
}

class _CountriesScreenState extends State<CountriesScreen> {
  String _searchQuery = '';
  String _selectedContinent = 'الكل';

  final List<String> _continents = [
    'الكل',
    'أفريقيا',
    'آسيا',
    'أوروبا',
    'أمريكا الشمالية',
    'أمريكا الجنوبية',
    'أوقيانوسيا',
  ];

  late Future<List<Country>> _countriesFuture;

  @override
  void initState() {
    super.initState();
    _countriesFuture = fetchCountries();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final cardColor = isDark ? AppColors.darkCard : AppColors.lightCard;
    final textColor = isDark ? AppColors.darkText : AppColors.textOnBackground;

    return Scaffold(
      backgroundColor: bgColor,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF32127A),
                  Color(0xFF1a0f2e),
                ],
              ),
            ),
            child: SafeArea(
              bottom: false,
              child: Column(
                children: [
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                      children: [
                        TextSpan(
                          text: 'رحلات ',
                          style: TextStyle(color: Colors.white),
                        ),
                        TextSpan(
                          text: 'بلا حدود',
                          style: TextStyle(color: AppColors.accent),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'اكتشف أجمل الوجهات السياحية حول العالم',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    onChanged: (value) {
                      setState(() {
                        _searchQuery = value;
                      });
                    },
                    style: TextStyle(color: textColor),
                    decoration: InputDecoration(
                      hintText: 'ابحث عن دولة...',
                      prefixIcon: const Icon(Icons.search),
                      filled: true,
                      fillColor: cardColor,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 40,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _continents.length,
                      separatorBuilder: (context, index) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final continent = _continents[index];
                        final isSelected = continent == _selectedContinent;
                        return ChoiceChip(
                          label: Text(continent),
                          selected: isSelected,
                          onSelected: (_) {
                            setState(() {
                              _selectedContinent = continent;
                            });
                          },
                          selectedColor: AppColors.accent,
                          backgroundColor: cardColor,
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : textColor,
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: FutureBuilder<List<Country>>(
                      future: _countriesFuture,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.waiting) {
                          return const Center(child: CircularProgressIndicator());
                        }
                        if (snapshot.hasError) {
                          return Center(
                            child: Text(
                              'حدث خطأ بتحميل الدول',
                              style: TextStyle(color: textColor),
                            ),
                          );
                        }

                        final allCountries = snapshot.data ?? [];
                        final filteredCountries = allCountries.where((country) {
                          final matchesSearch = normalizeArabic(country.name)
                              .contains(normalizeArabic(_searchQuery));
                          final matchesContinent = _selectedContinent == 'الكل' ||
                              country.continent == _selectedContinent;
                          return matchesSearch && matchesContinent;
                        }).toList();

                        if (filteredCountries.isEmpty) {
                          return Center(
                            child: Text(
                              'لا توجد نتائج',
                              style: TextStyle(color: textColor),
                            ),
                          );
                        }

                        return GridView.builder(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 16,
                            crossAxisSpacing: 16,
                            childAspectRatio: 0.8,
                          ),
                          itemCount: filteredCountries.length,
                          itemBuilder: (context, index) {
                            return CountryCard(country: filteredCountries[index]);
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class CountryCard extends StatelessWidget {
  final Country country;

  const CountryCard({super.key, required this.country});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.network(
            country.imageUrl,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return Container(color: AppColors.primary.withValues(alpha: 0.3));
            },
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Colors.black.withValues(alpha: 0.6),
                ],
              ),
            ),
          ),
          Positioned(
            top: 8,
            left: 8,
            child: IconButton(
              onPressed: () {},
              icon: const Icon(Icons.push_pin_outlined, color: Colors.white),
            ),
          ),
          Positioned(
            bottom: 12,
            right: 12,
            left: 12,
            child: Text(
              country.name,
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
