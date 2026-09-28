import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'home_screen.dart';
import 'login_screen.dart';
import 'countries_screen.dart';
import 'events_screen.dart';
import 'recipes_screen.dart';
import 'trip_planner_screen.dart';
import 'user_session.dart';
import 'avatar_service.dart';
import 'account_avatar.dart';
import 'profile_screen.dart';

class _Account {
  final String name;
  final String email;
  final String avatarUrl;

  const _Account(this.name, this.email, this.avatarUrl);
}

class MainNavigation extends StatefulWidget {
  final VoidCallback onToggleTheme;

  const MainNavigation({super.key, required this.onToggleTheme});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation>
    with WidgetsBindingObserver {
  int _currentIndex = 0;
  _Account? _account;

  final List<Widget> _screens = [
    const HomeScreen(),
    const CountriesScreen(),
    const EventsScreen(),
    const RecipesScreen(),
    const TripPlannerScreen(),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadAccount();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _loadAccount();
    }
  }

  Future<void> _loadAccount() async {
    final loggedIn = await UserSession.isLoggedIn();
    if (!loggedIn) {
      if (mounted) setState(() => _account = null);
      return;
    }

    final name = await UserSession.getUserName() ?? '';
    final email = await UserSession.getUserEmail() ?? '';
    final cachedAvatar = await UserSession.getAvatar() ?? '';
    if (!mounted) return;
    setState(() => _account = _Account(name, email, cachedAvatar));

    if (email.isEmpty) return;
    final remoteAvatar = await AvatarService.fetchAvatar(email);
    if (remoteAvatar == null || !mounted) return;
    if (_account?.email != email) return;
    if (remoteAvatar != cachedAvatar) {
      await UserSession.saveAvatar(remoteAvatar);
      if (!mounted) return;
      setState(() => _account = _Account(name, email, remoteAvatar));
    }
  }

  Widget _menuTile({
    required IconData icon,
    required String label,
    required Color iconColor,
    required Color textColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(7),
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, size: 18, color: iconColor),
            ),
            const SizedBox(width: 12),
            Text(
              label,
              style: TextStyle(
                color: textColor,
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _showAccountMenu(_Account account) async {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final menuColor = isDark ? AppColors.darkCard : AppColors.lightCard;
    final textColor = isDark ? AppColors.darkText : AppColors.textOnBackground;

    final value = await showGeneralDialog<String>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'إغلاق',
      barrierColor: Colors.black38,
      transitionDuration: const Duration(milliseconds: 180),
      pageBuilder: (dialogContext, animation, secondaryAnimation) {
        final top =
            MediaQuery.of(dialogContext).padding.top + kToolbarHeight + 6;

        return Directionality(
          textDirection: TextDirection.rtl,
          child: Align(
            alignment: Alignment.topCenter,
            child: Padding(
              padding: EdgeInsets.only(top: top),
              child: Material(
                color: menuColor,
                elevation: 10,
                shadowColor: Colors.black.withValues(alpha: 0.3),
                clipBehavior: Clip.antiAlias,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(
                    color: isDark
                        ? AppColors.accent.withValues(alpha: 0.3)
                        : Colors.black.withValues(alpha: 0.05),
                  ),
                ),
                child: SizedBox(
                  width: 280,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 20, 16, 16),
                        child: Column(
                          children: [
                            AccountAvatar(
                              name: account.name,
                              avatarUrl: account.avatarUrl,
                              radius: 30,
                            ),
                            const SizedBox(height: 10),
                            Text(
                              account.name.isEmpty ? 'حسابي' : account.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: textColor,
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              account.email,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: textColor.withValues(alpha: 0.6),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Divider(
                        height: 1,
                        color: textColor.withValues(alpha: 0.1),
                      ),
                      _menuTile(
                        icon: Icons.person_outline,
                        label: 'الملف الشخصي',
                        iconColor: AppColors.accent,
                        textColor: textColor,
                        onTap: () => Navigator.pop(dialogContext, 'profile'),
                      ),
                      _menuTile(
                        icon: Icons.logout,
                        label: 'تسجيل خروج',
                        iconColor: Colors.red,
                        textColor: Colors.red,
                        onTap: () => Navigator.pop(dialogContext, 'logout'),
                      ),
                      const SizedBox(height: 4),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        final curved = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOut,
        );
        return FadeTransition(
          opacity: curved,
          child: ScaleTransition(
            scale: Tween<double>(begin: 0.95, end: 1.0).animate(curved),
            alignment: Alignment.topCenter,
            child: child,
          ),
        );
      },
    );

    if (!mounted || value == null) return;

    if (value == 'profile') {
      await Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const ProfileScreen()),
      );
      if (!mounted) return;
      _loadAccount();
    } else if (value == 'logout') {
      final messenger = ScaffoldMessenger.of(context);
      await UserSession.clearUser();
      if (!mounted) return;
      setState(() => _account = null);
      messenger.showSnackBar(
        const SnackBar(content: Text('تم تسجيل الخروج')),
      );
    }
  }

  Widget _buildAccountButton() {
    final account = _account;

    if (account == null) {
      return GestureDetector(
        onTap: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const LoginScreen()),
          );
          if (!mounted) return;
          _loadAccount();
        },
        child: const CircleAvatar(
          radius: 16,
          backgroundColor: Colors.white24,
          child: Icon(Icons.person, color: Colors.white, size: 20),
        ),
      );
    }

    return GestureDetector(
      onTap: () => _showAccountMenu(account),
      child: AccountAvatar(
        name: account.name,
        avatarUrl: account.avatarUrl,
        radius: 16,
      ),
    );
  }

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
        title: _buildAccountButton(),
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
        unselectedItemColor: Theme.of(context).brightness == Brightness.dark
            ? AppColors.darkText
            : AppColors.textOnBackground,
        backgroundColor: Theme.of(context).brightness == Brightness.dark
            ? AppColors.darkCard
            : AppColors.lightCard,
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