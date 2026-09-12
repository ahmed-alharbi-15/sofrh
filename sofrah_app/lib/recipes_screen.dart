import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:cached_network_image/cached_network_image.dart';
import 'app_colors.dart';

String normalizeArabicText(String text) {
  return text
      .replaceAll('أ', 'ا')
      .replaceAll('إ', 'ا')
      .replaceAll('آ', 'ا')
      .replaceAll('ى', 'ا')
      .replaceAll('ة', 'ه');
}

class RecipeItem {
  final String title;
  final String category;
  final String imageUrl;
  final String country;

  const RecipeItem({
    required this.title,
    required this.category,
    required this.imageUrl,
    required this.country,
  });

  factory RecipeItem.fromJson(Map<String, dynamic> json) {
    return RecipeItem(
      title: json['title'] ?? '',
      category: json['category'] ?? '',
      imageUrl: 'https://sofrh.vercel.app${json['image_url'] ?? ''}',
      country: json['country'] ?? '',
    );
  }
}

Future<List<RecipeItem>> fetchRecipes() async {
  final response = await http.get(
    Uri.parse('https://sofrh-1.onrender.com/recipes'),
  );

  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
    return data.map((item) => RecipeItem.fromJson(item)).toList();
  } else {
    throw Exception('فشل تحميل الوصفات');
  }
}

class RecipesScreen extends StatefulWidget {
  const RecipesScreen({super.key});

  @override
  State<RecipesScreen> createState() => _RecipesScreenState();
}

class _RecipesScreenState extends State<RecipesScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'الكل';

  final List<String> _categories = ['الكل', 'رئيسية', 'حلويات', 'سناكات'];

  late Future<List<RecipeItem>> _recipesFuture;

  @override
  void initState() {
    super.initState();
    _recipesFuture = fetchRecipes();
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
                          text: 'وصفات ',
                          style: TextStyle(color: Colors.white),
                        ),
                        TextSpan(
                          text: 'كل العالم',
                          style: TextStyle(color: AppColors.accent),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'استمتع بنكهات ووصفات متنوعة من مختلف دول العالم',
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
                      hintText: 'ابحث عن وصفة...',
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
                      itemCount: _categories.length,
                      separatorBuilder: (context, index) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final category = _categories[index];
                        final isSelected = category == _selectedCategory;
                        return ChoiceChip(
                          label: Text(category),
                          selected: isSelected,
                          onSelected: (_) {
                            setState(() {
                              _selectedCategory = category;
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
                    child: FutureBuilder<List<RecipeItem>>(
                      future: _recipesFuture,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.waiting) {
                          return const Center(child: CircularProgressIndicator());
                        }
                        if (snapshot.hasError) {
                          return Center(
                            child: Text(
                              'حدث خطأ بتحميل الوصفات',
                              style: TextStyle(color: textColor),
                            ),
                          );
                        }

                        final allRecipes = snapshot.data ?? [];
                        final filteredRecipes = allRecipes.where((recipe) {
                          final matchesSearch = normalizeArabicText(recipe.title)
                              .contains(normalizeArabicText(_searchQuery));
                          final matchesCategory = _selectedCategory == 'الكل' ||
                              recipe.category == _selectedCategory;
                          return matchesSearch && matchesCategory;
                        }).toList();

                        if (filteredRecipes.isEmpty) {
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
                          itemCount: filteredRecipes.length,
                          itemBuilder: (context, index) {
                            return RecipeCard(recipe: filteredRecipes[index]);
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

class RecipeCard extends StatelessWidget {
  final RecipeItem recipe;

  const RecipeCard({super.key, required this.recipe});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: Stack(
        fit: StackFit.expand,
        children: [
          CachedNetworkImage(
            imageUrl: recipe.imageUrl,
            fit: BoxFit.cover,
            placeholder: (context, url) => Container(
              color: AppColors.primary.withValues(alpha: 0.15),
              child: const Center(
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),
            errorWidget: (context, url, error) {
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
              icon: const Icon(Icons.restaurant_outlined, color: Colors.white),
            ),
          ),
          Positioned(
            bottom: 12,
            right: 12,
            left: 12,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  recipe.title,
                  textAlign: TextAlign.right,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                if (recipe.country.isNotEmpty)
                  Text(
                    recipe.country,
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}