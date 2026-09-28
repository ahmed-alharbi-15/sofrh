import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'user_session.dart';
import 'avatar_service.dart';
import 'account_avatar.dart';
import 'settings_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _userName = '';
  String _userEmail = '';
  String _avatarUrl = '';

  final List<String> _tabs = ['خططي', 'الدول', 'المدن', 'الفعاليات', 'الوصفات'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _loadUser();
  }

  Future<void> _loadUser() async {
    final name = await UserSession.getUserName() ?? '';
    final email = await UserSession.getUserEmail() ?? '';
    final cachedAvatar = await UserSession.getAvatar() ?? '';
    if (!mounted) return;
    setState(() {
      _userName = name;
      _userEmail = email;
      _avatarUrl = cachedAvatar;
    });

    if (email.isEmpty) return;
    final remoteAvatar = await AvatarService.fetchAvatar(email);
    if (remoteAvatar == null || !mounted) return;
    await UserSession.saveAvatar(remoteAvatar);
    if (!mounted) return;
    setState(() => _avatarUrl = remoteAvatar);
  }

  Future<void> _logout() async {
    await UserSession.clearUser();
    if (mounted) {
      Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final textColor = isDark ? AppColors.darkText : AppColors.textOnBackground;

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
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
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        onPressed: _logout,
                        icon: const Icon(Icons.logout, color: Colors.white),
                      ),
                      IconButton(
                        onPressed: () async {
                          await Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const SettingsScreen(),
                            ),
                          );
                          if (!mounted) return;
                          _loadUser();
                        },
                        icon: const Icon(Icons.settings, color: Colors.white),
                      ),
                    ],
                  ),
                  AccountAvatar(
                    name: _userName,
                    avatarUrl: _avatarUrl,
                    radius: 40,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _userName.isEmpty ? '...' : _userName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _userEmail,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            TabBar(
              controller: _tabController,
              isScrollable: true,
              labelColor: AppColors.accent,
              unselectedLabelColor: textColor,
              indicatorColor: AppColors.accent,
              tabs: _tabs.map((t) => Tab(text: t)).toList(),
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: _tabs.map((t) {
                  return Center(
                    child: Text(
                      'قريباً: مفضلة $t',
                      style: TextStyle(color: textColor),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}