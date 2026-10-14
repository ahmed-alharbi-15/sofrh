import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'city.dart';

Widget _cityImage(String url) {
  final fallback = Container(color: AppColors.primary.withValues(alpha: 0.3));
  if (url.isEmpty) return fallback;
  return CachedNetworkImage(
    imageUrl: url,
    fit: BoxFit.cover,
    placeholder: (context, url) =>
        Container(color: AppColors.primary.withValues(alpha: 0.15)),
    errorWidget: (context, url, error) => fallback,
  );
}

/// قسم "المدن" داخل صفحة الدولة
class CitiesSection extends StatefulWidget {
  final String countrySlug;

  const CitiesSection({super.key, required this.countrySlug});

  @override
  State<CitiesSection> createState() => _CitiesSectionState();
}

class _CitiesSectionState extends State<CitiesSection> {
  Future<List<City>>? _future;

  @override
  void initState() {
    super.initState();
    if (widget.countrySlug.isNotEmpty) {
      _future = fetchCities(widget.countrySlug);
    }
  }

  @override
  Widget build(BuildContext context) {
    final future = _future;
    if (future == null) return const SizedBox.shrink();

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? AppColors.darkText : AppColors.textOnBackground;

    return FutureBuilder<List<City>>(
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
              'تعذر تحميل المدن',
              style: TextStyle(color: textColor.withValues(alpha: 0.6)),
            ),
          );
        }

        final cities = snapshot.data ?? [];
        if (cities.isEmpty) return const SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
              child: Text(
                'المدن (${cities.length})',
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
                itemCount: cities.length,
                separatorBuilder: (context, index) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  return SizedBox(
                    width: 165,
                    child: CityCard(city: cities[index]),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}

class CityCard extends StatelessWidget {
  final City city;

  const CityCard({super.key, required this.city});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CityDetailsScreen(city: city),
          ),
        );
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          fit: StackFit.expand,
          children: [
            _cityImage(city.imageUrl),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.7),
                  ],
                ),
              ),
            ),
            Positioned(
              bottom: 12,
              right: 12,
              left: 12,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    city.arabicName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  if (city.englishName.isNotEmpty)
                    Text(
                      city.englishName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
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
      ),
    );
  }
}

class CityDetailsScreen extends StatelessWidget {
  final City city;

  const CityDetailsScreen({super.key, required this.city});

  Widget _section({
    required IconData icon,
    required String title,
    required List<String> items,
    required Color cardColor,
    required Color textColor,
  }) {
    if (items.isEmpty) return const SizedBox.shrink();

    final rows = <Widget>[];
    for (var i = 0; i < items.length; i++) {
      if (i > 0) {
        rows.add(Divider(height: 1, color: textColor.withValues(alpha: 0.08)));
      }
      rows.add(
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Text(
            items[i],
            style: TextStyle(color: textColor, fontSize: 14.5, height: 1.5),
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 22, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.accent, size: 22),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  color: textColor,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Column(children: rows),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final cardColor = isDark ? AppColors.darkCard : AppColors.lightCard;
    final textColor = isDark ? AppColors.darkText : AppColors.textOnBackground;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: bgColor,
        body: CustomScrollView(
          slivers: [
            SliverAppBar(
              pinned: true,
              expandedHeight: 260,
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              automaticallyImplyLeading: false,
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
                titlePadding: const EdgeInsetsDirectional.only(
                  start: 64,
                  end: 16,
                  bottom: 16,
                ),
                title: Text(
                  city.arabicName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    _cityImage(city.imageUrl),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black.withValues(alpha: 0.25),
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.7),
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
                  if (city.englishName.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                      child: Text(
                        city.englishName,
                        style: const TextStyle(
                          color: AppColors.accent,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  if (city.description.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: cardColor,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          city.description,
                          style: TextStyle(
                            color: textColor,
                            fontSize: 15,
                            height: 1.7,
                          ),
                        ),
                      ),
                    ),
                  _section(
                    icon: Icons.account_balance,
                    title: 'المعالم التاريخية',
                    items: city.historic,
                    cardColor: cardColor,
                    textColor: textColor,
                  ),
                  _section(
                    icon: Icons.restaurant,
                    title: 'المطاعم',
                    items: city.restaurants,
                    cardColor: cardColor,
                    textColor: textColor,
                  ),
                  _section(
                    icon: Icons.local_cafe,
                    title: 'المقاهي',
                    items: city.cafes,
                    cardColor: cardColor,
                    textColor: textColor,
                  ),
                  _section(
                    icon: Icons.local_activity,
                    title: 'الأنشطة والفعاليات',
                    items: city.activities,
                    cardColor: cardColor,
                    textColor: textColor,
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