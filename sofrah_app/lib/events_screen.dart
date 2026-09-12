import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:cached_network_image/cached_network_image.dart';
import 'app_colors.dart';

String normalizeArabic(String text) {
  return text
      .replaceAll('أ', 'ا')
      .replaceAll('إ', 'ا')
      .replaceAll('آ', 'ا')
      .replaceAll('ى', 'ا')
      .replaceAll('ة', 'ه');
}

class EventItem {
  final String title;
  final String category;
  final String description;
  final String dateInfo;
  final String imageUrl;
  final String country;

  const EventItem({
    required this.title,
    required this.category,
    required this.description,
    required this.dateInfo,
    required this.imageUrl,
    required this.country,
  });

  factory EventItem.fromJson(Map<String, dynamic> json) {
    return EventItem(
      title: json['title'] ?? '',
      category: json['category'] ?? '',
      description: json['description'] ?? '',
      dateInfo: json['date_info'] ?? '',
      imageUrl: 'https://sofrh.vercel.app${json['image_url'] ?? ''}',
      country: json['country'] ?? '',
    );
  }
}

Future<List<EventItem>> fetchEvents() async {
  final response = await http.get(
    Uri.parse('https://sofrh-1.onrender.com/events'),
  );

  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
    return data.map((item) => EventItem.fromJson(item)).toList();
  } else {
    throw Exception('فشل تحميل الفعاليات');
  }
}

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'الكل';

  final Map<String, String> _categories = {
    'الكل': 'الكل',
    'شواطئ وبحار': 'Beaches&seas',
    'سفاري وجبال': 'Safari&mountains',
    'فعاليات ومنتجعات': 'evnents&resorts',
    'متاحف ومعالم': 'Museums and landmarks',
    'مهرجانات ثقافية': 'cultural',
    'مطاعم ومقاهي': 'food&cafe',
  };

  late Future<List<EventItem>> _eventsFuture;

  @override
  void initState() {
    super.initState();
    _eventsFuture = fetchEvents();
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
                          text: 'فعاليات ',
                          style: TextStyle(color: Colors.white),
                        ),
                        TextSpan(
                          text: 'لا تُنسى',
                          style: TextStyle(color: AppColors.accent),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'اكتشف أفضل الفعاليات والتجارب الممتعة حول العالم',
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
                      hintText: 'ابحث عن فعالية...',
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
                        final label = _categories.keys.elementAt(index);
                        final value = _categories.values.elementAt(index);
                        final isSelected = value == _selectedCategory;
                        return ChoiceChip(
                          label: Text(label),
                          selected: isSelected,
                          onSelected: (_) {
                            setState(() {
                              _selectedCategory = value;
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
                    child: FutureBuilder<List<EventItem>>(
                      future: _eventsFuture,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.waiting) {
                          return const Center(child: CircularProgressIndicator());
                        }
                        if (snapshot.hasError) {
                          return Center(
                            child: Text(
                              'حدث خطأ بتحميل الفعاليات',
                              style: TextStyle(color: textColor),
                            ),
                          );
                        }

                        final allEvents = snapshot.data ?? [];
                        final filteredEvents = allEvents.where((event) {
                          final matchesSearch = normalizeArabic(event.title)
                              .contains(normalizeArabic(_searchQuery));
                          final matchesCategory = _selectedCategory == 'الكل' ||
                              event.category == _selectedCategory;
                          return matchesSearch && matchesCategory;
                        }).toList();

                        if (filteredEvents.isEmpty) {
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
                          itemCount: filteredEvents.length,
                          itemBuilder: (context, index) {
                            return EventCard(event: filteredEvents[index]);
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

class EventCard extends StatelessWidget {
  final EventItem event;

  const EventCard({super.key, required this.event});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: Stack(
        fit: StackFit.expand,
        children: [
          CachedNetworkImage(
            imageUrl: event.imageUrl,
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
              icon: const Icon(Icons.confirmation_number_outlined, color: Colors.white),
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
                  event.title,
                  textAlign: TextAlign.right,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                if (event.country.isNotEmpty)
                  Text(
                    event.country,
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