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
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.textOnPrimary,
        title: const Text('سفرة'),
      ),
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
                    HeroStat(number: '+194', label: 'دولة'),
                    HeroStat(number: '+1163', label: 'فعالية'),
                    HeroStat(number: '+1150', label: 'وصفة'),
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
                  const SizedBox(height: 8),
                  Text(
                    'وين نسافر اليوم؟',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: AppColors.textOnBackground,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: GridView.count(
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      children: const [
                        HomeCategoryCard(title: 'الدول', icon: Icons.public),
                        HomeCategoryCard(title: 'الوصفات', icon: Icons.restaurant_menu),
                        HomeCategoryCard(title: 'الفعاليات', icon: Icons.event),
                        HomeCategoryCard(title: 'خطتي', icon: Icons.map),
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
  final IconData icon;

  const HomeCategoryCard({
    super.key,
    required this.title,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.lightCard,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 36, color: AppColors.accent),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              color: AppColors.textOnBackground,
              fontWeight: FontWeight.w600,
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