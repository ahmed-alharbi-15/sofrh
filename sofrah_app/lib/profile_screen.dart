import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'user_session.dart';
import 'avatar_service.dart';
import 'account_avatar.dart';
import 'favorites_service.dart';
import 'settings_screen.dart';

class _FavTab {
  final String label;
  final String type;
  final IconData icon;
  final String emptyText;

  const _FavTab(this.label, this.type, this.icon, this.emptyText);
}

const List<_FavTab> _favTabs = [
  _FavTab('خططي', 'plan', Icons.map_outlined, 'ما عندك خطط محفوظة'),
  _FavTab('الدول', 'country', Icons.public, 'ما عندك دول محفوظة'),
  _FavTab('المدن', 'city', Icons.location_city, 'ما عندك مدن محفوظة'),
  _FavTab('الفعاليات', 'event', Icons.event, 'ما عندك فعاليات محفوظة'),
  _FavTab('الوصفات', 'recipe', Icons.restaurant_menu, 'ما عندك وصفات محفوظة'),
];

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  late TabController _tabController;
  String _userName = '';
  String _userEmail = '';
  String _avatarUrl = '';

  Map<String, List<FavoriteItem>> _favorites = {};
  bool _loadingFavorites = true;
  bool _favoritesFailed = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _tabController = TabController(length: _favTabs.length, vsync: this);
    _loadUser();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _tabController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _loadFavorites(showSpinner: false);
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
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

    _loadFavorites();

    if (email.isEmpty) return;
    final remoteAvatar = await AvatarService.fetchAvatar(email);
    if (remoteAvatar == null || !mounted) return;
    await UserSession.saveAvatar(remoteAvatar);
    if (!mounted) return;
    setState(() => _avatarUrl = remoteAvatar);
  }

  Future<void> _loadFavorites({
    bool showSpinner = true,
    bool notifyOnError = false,
  }) async {
    final email = _userEmail.isNotEmpty
        ? _userEmail
        : (await UserSession.getUserEmail() ?? '');

    if (email.isEmpty) {
      if (mounted) setState(() => _loadingFavorites = false);
      return;
    }

    if (showSpinner && mounted) {
      setState(() {
        _loadingFavorites = true;
        _favoritesFailed = false;
      });
    }

    final result = await FavoritesService.fetch(email);
    if (!mounted) return;

    if (result == null) {
      setState(() {
        _loadingFavorites = false;
        _favoritesFailed = true;
      });
      if (notifyOnError) _showMessage('تعذر تحديث المفضلة');
      return;
    }

    setState(() {
      _favorites = result;
      _loadingFavorites = false;
      _favoritesFailed = false;
    });
  }

  Future<void> _removeFavorite(String type, FavoriteItem item) async {
    final list = _favorites[type];
    if (list == null) return;
    final index = list.indexOf(item);
    if (index < 0) return;

    setState(() => list.removeAt(index));

    final ok = await FavoritesService.remove(
      email: _userEmail,
      type: type,
      id: item.id,
    );
    if (ok || !mounted) return;

    setState(() {
      list.insert(index > list.length ? list.length : index, item);
    });
    _showMessage('تعذر الحذف، حاول مرة ثانية');
  }

  Future<void> _logout() async {
    await UserSession.clearUser();
    if (mounted) {
      Navigator.pop(context);
    }
  }

  Widget _favoriteCard(
    _FavTab tab,
    FavoriteItem item,
    Color cardColor,
    Color textColor,
  ) {
    final placeholder = Container(
      width: 84,
      height: 84,
      color: AppColors.primary.withValues(alpha: 0.15),
      child: Icon(tab.icon, color: AppColors.primary),
    );

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: const BorderRadiusDirectional.horizontal(
                start: Radius.circular(14),
              ),
              child: item.imageUrl.isEmpty
                  ? placeholder
                  : CachedNetworkImage(
                      imageUrl: item.imageUrl,
                      width: 84,
                      height: 84,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => placeholder,
                      errorWidget: (context, url, error) => placeholder,
                    ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Text(
                  item.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            IconButton(
              tooltip: 'إزالة من المفضلة',
              onPressed: () => _removeFavorite(tab.type, item),
              icon: const Icon(Icons.delete_outline, color: Colors.red),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFavoritesTab(_FavTab tab, Color cardColor, Color textColor) {
    final items = _favorites[tab.type] ?? [];

    if (_loadingFavorites && _favorites.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    Widget message(IconData icon, String text) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          const SizedBox(height: 60),
          Icon(icon, size: 48, color: textColor.withValues(alpha: 0.4)),
          const SizedBox(height: 12),
          Text(
            text,
            textAlign: TextAlign.center,
            style: TextStyle(color: textColor.withValues(alpha: 0.7)),
          ),
          if (_favoritesFailed && _favorites.isEmpty)
            Center(
              child: TextButton(
                onPressed: () => _loadFavorites(),
                child: const Text('إعادة المحاولة'),
              ),
            ),
        ],
      );
    }

    Widget body;
    if (_favoritesFailed && _favorites.isEmpty) {
      body = message(Icons.cloud_off_outlined, 'تعذر تحميل المفضلة');
    } else if (items.isEmpty) {
      body = message(tab.icon, tab.emptyText);
    } else {
      body = ListView.separated(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (context, index) =>
            _favoriteCard(tab, items[index], cardColor, textColor),
      );
    }

    return RefreshIndicator(
      color: AppColors.accent,
      onRefresh: () =>
          _loadFavorites(showSpinner: false, notifyOnError: true),
      child: body,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final cardColor = isDark ? AppColors.darkCard : AppColors.lightCard;
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
                      Row(
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
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.arrow_forward, color: Colors.white),
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
              tabs: _favTabs.map((t) {
                final count = _favorites[t.type]?.length ?? 0;
                return Tab(text: count > 0 ? '${t.label} ($count)' : t.label);
              }).toList(),
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: _favTabs
                    .map((t) => _buildFavoritesTab(t, cardColor, textColor))
                    .toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}