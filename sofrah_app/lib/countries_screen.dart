import 'package:flutter/material.dart';
import 'app_colors.dart';

class Country {
  final String name;
  final String continent;
  final String imageUrl;

  const Country({
    required this.name,
    required this.continent,
    required this.imageUrl,
  });
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

  final List<Country> _countries = const [
    Country(
      name: 'اليابان',
      continent: 'آسيا',
      imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Countries1.jpg',
    ),
    Country(
      name: 'مصر',
      continent: 'أفريقيا',
      imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Countries1.jpg',
    ),
    Country(
      name: 'فرنسا',
      continent: 'أوروبا',
      imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Countries1.jpg',
    ),
    Country(
      name: 'كندا',
      continent: 'أمريكا الشمالية',
      imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Countries1.jpg',
    ),
    Country(
      name: 'البرازيل',
      continent: 'أمريكا الجنوبية',
      imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Countries1.jpg',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final cardColor = isDark ? AppColors.darkCard : AppColors.lightCard;
    final textColor = isDark ? AppColors.darkText : AppColors.textOnBackground;

    final filteredCountries = _countries.where((country) {
      final matchesSearch = country.name.contains(_searchQuery);
      final matchesContinent =
          _selectedContinent == 'الكل' || country.continent == _selectedContinent;
      return matchesSearch && matchesContinent;
    }).toList();

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
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        mainAxisSpacing: 16,
                        crossAxisSpacing: 16,
                        childAspectRatio: 0.8,
                      ),
                      itemCount: filteredCountries.length,
                      itemBuilder: (context, index) {
                        final country = filteredCountries[index];
                        return CountryCard(country: country);
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
              textAlign: TextAlign.center,
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