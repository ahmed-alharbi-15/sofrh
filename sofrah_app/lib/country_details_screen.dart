import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'countries_screen.dart' show Country;
import 'events_screen.dart' show EventItem, EventCard, fetchEvents;
import 'recipes_screen.dart' show RecipeItem, RecipeCard, fetchRecipes;
import 'favorites_store.dart';
import 'user_session.dart';
import 'city_details_screen.dart';

class CountryDetailsScreen extends StatefulWidget {
  final Country country;

  const CountryDetailsScreen({super.key, required this.country});

  @override
  State<CountryDetailsScreen> createState() => _CountryDetailsScreenState();
}

class _CountryDetailsScreenState extends State<CountryDetailsScreen> {
  late final Future<List<EventItem>> _eventsFuture;
  late final Future<List<RecipeItem>> _recipesFuture;
  late final ScrollController _scrollController;

  static const double _expandedHeight = 340;

  @override
  void initState() {
    super.initState();
    final name = widget.country.name.trim();
    _eventsFuture = fetchEvents()
        .then((all) => all.where((e) => e.country.trim() == name).toList());
    _recipesFuture = fetchRecipes()
        .then((all) => all.where((r) => r.country.trim() == name).toList());
    _scrollController = ScrollController();
    _scrollController.addListener(() {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Widget _horizontalSection<T>({
    required String title,
    required Future<List<T>> future,
    required Widget Function(T item) builder,
    required Color textColor,
  }) {
    return FutureBuilder<List<T>>(
      future: future,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Padding(
            padding: EdgeInsets.all(24),
            child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
          );
        }

        if (snapshot.hasError) {
          return Padding(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
            child: Text(
              'تعذر تحميل $title',
              style: TextStyle(color: textColor.withValues(alpha: 0.6)),
            ),
          );
        }

        final items = snapshot.data ?? [];
        if (items.isEmpty) return const SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
              child: Text(
                '$title (${items.length})',
                style: TextStyle(
                  color: textColor,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            SizedBox(
              height: 210,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: items.length,
                separatorBuilder: (context, index) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  return SizedBox(width: 165, child: builder(items[index]));
                },
              ),
            ),
          ],
        );
      },
    );
  }

  Future<void> _toggleFavorite(BuildContext context) async {
    final country = widget.country;
    // ① تحقق من تسجيل الدخول أولاً
    final loggedIn = await UserSession.isLoggedIn();
    if (!context.mounted) return;
    if (!loggedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('سجّل دخولك أول عشان تحفظ')),
      );
      return;
    }
    // ② تحقق من وجود slug
    if (country.slug.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تعذر حفظ هذي الدولة')),
      );
      return;
    }
    final email = await UserSession.getUserEmail() ?? '';
    final err = await FavoritesStore.instance.toggle(
      type: 'country',
      id: country.slug,
      name: country.name,
      img: country.imageUrl,
      email: email,
    );
    if (err != null && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final textColor = isDark ? AppColors.darkText : AppColors.textOnBackground;
    final country = widget.country;
    final statusBarHeight = MediaQuery.of(context).padding.top;
    final heroTextTop = statusBarHeight + kToolbarHeight + 8;

    // حساب ظهور اسم الدولة في الشريط الثابت
    final scrollOffset =
        _scrollController.hasClients ? _scrollController.offset : 0.0;
    final titleOpacity =
        scrollOffset > (_expandedHeight - kToolbarHeight - 20) ? 1.0 : 0.0;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: bgColor,
        body: CustomScrollView(
          controller: _scrollController,
          slivers: [
            SliverAppBar(
              pinned: true,
              expandedHeight: _expandedHeight,
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              automaticallyImplyLeading: false,
              centerTitle: true,
              // الاسم في الشريط الثابت — مخفي في البداية، يظهر عند الطي
              title: AnimatedOpacity(
                opacity: titleOpacity,
                duration: const Duration(milliseconds: 200),
                child: Text(
                  country.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ),
              actions: [
                AnimatedBuilder(
                  animation: FavoritesStore.instance,
                  builder: (ctx, _) {
                    final isFav = FavoritesStore.instance.isFavorite(
                        'country', widget.country.slug);
                    return IconButton(
                      icon: Icon(
                        isFav ? Icons.favorite : Icons.favorite_border,
                        color: isFav ? AppColors.accent : Colors.white,
                      ),
                      onPressed: () => _toggleFavorite(ctx),
                    );
                  },
                ),
              ],
              leading: Padding(
                padding: const EdgeInsets.all(8),
                child: CircleAvatar(
                  backgroundColor: Colors.black38,
                  child: IconButton(
                    padding: EdgeInsets.zero,
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_forward, color: Colors.white),
                  ),
                ),
              ),
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    // صورة الدولة
                    CachedNetworkImage(
                      imageUrl: country.imageUrl,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        color: AppColors.primary.withValues(alpha: 0.3),
                      ),
                      errorWidget: (context, url, error) => Container(
                        color: AppColors.primary.withValues(alpha: 0.5),
                      ),
                    ),
                    // تدرج: غامق من فوق يخف تدريجياً للأسفل لوضوح النص
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          stops: const [0.0, 0.55, 1.0],
                          colors: [
                            Colors.black.withValues(alpha: 0.65),
                            Colors.black.withValues(alpha: 0.15),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                    // الاسم والوصف تحت أزرار الرجوع والمفضلة مباشرة
                    Positioned(
                      top: heroTextTop,
                      left: 0,
                      right: 0,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 28),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              country.name,
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 28,
                                shadows: [
                                  Shadow(
                                    blurRadius: 6,
                                    color: Colors.black54,
                                  ),
                                ],
                              ),
                            ),
                            if (country.description.isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Text(
                                country.description,
                                textAlign: TextAlign.center,
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: Colors.white.withValues(alpha: 0.9),
                                  fontSize: 14,
                                  height: 1.5,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // شريحة القارة
                  if (country.continent.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.accent.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.public,
                              size: 16,
                              color: AppColors.accent,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              country.continent,
                              style: const TextStyle(
                                color: AppColors.accent,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  CitiesSection(countrySlug: country.slug),
                  _horizontalSection<EventItem>(
                    title: 'فعاليات في ${country.name}',
                    future: _eventsFuture,
                    textColor: textColor,
                    builder: (event) => EventCard(event: event),
                  ),
                  _horizontalSection<RecipeItem>(
                    title: 'وصفات من ${country.name}',
                    future: _recipesFuture,
                    textColor: textColor,
                    builder: (recipe) => RecipeCard(recipe: recipe),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
