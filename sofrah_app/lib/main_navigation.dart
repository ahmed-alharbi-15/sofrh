import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'home_screen.dart';

class MainNavigation extends StatefulWidget {
  final VoidCallback onToggleTheme;

  const MainNavigation({super.key, required this.onToggleTheme});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    Center(child: Text('الدول')),
    Center(child: Text('الفعاليات')),
    Center(child: Text('الوصفات')),
    Center(child: Text('خطتي')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.textOnPrimary,
        centerTitle: true,
        leadingWidth: 96,
        leading: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.notifications_outlined),
            ),
            IconButton(
              onPressed: widget.onToggleTheme,
              icon: const Icon(Icons.dark_mode_outlined),
            ),
          ],
        ),
        title: const CircleAvatar(
          radius: 16,
          backgroundColor: Colors.white24,
          child: Icon(Icons.person, color: Colors.white, size: 20),
        ),
        actions: [
          Image.network(
            'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/logo-img.PNG',
            height: 28,
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        selectedItemColor: AppColors.accent,
        unselectedItemColor: AppColors.textOnBackground,
        backgroundColor: AppColors.lightCard,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'الرئيسية',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.public),
            label: 'الدول',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.event),
            label: 'الفعاليات',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.restaurant_menu),
            label: 'الوصفات',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: 'خطتي',
          ),
        ],
      ),
    );
  }
}