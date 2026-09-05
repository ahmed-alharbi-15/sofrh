import 'package:flutter/material.dart';
import 'app_colors.dart';

class HomeScreen extends StatefulWidget{
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createstate() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.textOnPrimary,
        title: const Text('سفرة'),
      ),
      body: padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'وين نسافر اليوم؟',
              style: Theme.of(context). textTheme.headLineSmall?.copywith(
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
                  HomeCategoryCard(title:'الدول', icon: Icons.public),
                  HomeCategoryCard(title:'الوصفات', icon: Icons.restaurant_menu),
                  HomeCategoryCard(title:'الفعاليات', icon: Icons.event),
                  HomeCategoryCard(title:'خطتي', icon: Icons.map),
                ],
              ),
            ),
          ],
        ),
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