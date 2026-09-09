import 'package:flutter/material.dart';
import 'app_colors.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF32127A),
                  Color(0xFF1a0f2e),
                ],
              ),
            ),
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
                        text: 'سافر و ',
                        style: TextStyle(color: Colors.white),
                      ),
                      TextSpan(
                        text: 'تذوق',
                        style: TextStyle(color: AppColors.accent),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'اكتشف وجهات وماكولات من مختلف أنحاء العالم',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: const [
                    HeroStat(number: '+١٩٠', label: 'دولة'),
                    HeroStat(number: '+١٢٠٠', label: 'فعالية'),
                    HeroStat(number: '+١١٥٠', label: 'وصفة'),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                 
                  Expanded(
                    child: GridView.count(
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      children: const [
                        HomeCategoryCard(
                          title: 'الدول',
                          imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Countries1.jpg',
                        ),
                        HomeCategoryCard(
                          title: 'الوصفات',
                          imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/food10.jpg',
                        ),
                        HomeCategoryCard(
                          title: 'الفعاليات',
                          imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/events1.jpg',
                        ),
                        HomeCategoryCard(
                          title: 'خطتي',
                          imageUrl: 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/plan.jpg',
                        ),
                      ],
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

class HomeCategoryCard extends StatelessWidget {
  final String title;
  final String imageUrl;

  const HomeCategoryCard({
    super.key,
    required this.title,
    required this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.network(
            imageUrl,
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
            bottom: 12,
            right: 12,
            left: 12,
            child: Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class HeroStat extends StatelessWidget {
  final String number;
  final String label;

  const HeroStat({
    super.key,
    required this.number,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          number,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 13,
          ),
        ),
      ],
    );
  }
}