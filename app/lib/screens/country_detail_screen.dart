import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/api_service.dart';
import '../theme_notifier.dart';
import '../widgets/sofrah_appbar.dart';

const Color primary  = Color(0xFF32127A);
const Color accent   = Color(0xFFF28500);
const Color bgColor  = Color(0xFFFAF5EB);
const Color darkBg   = Color(0xFF0B0933);
const Color darkCard = Color(0xFF1a1040);

// ─────────────────────── MAIN SCREEN ────────────────────────────────────
class CountryDetailScreen extends StatefulWidget {
  final String countryId;
  final String countryName;
  const CountryDetailScreen(
      {super.key, required this.countryId, required this.countryName});
  @override
  State<CountryDetailScreen> createState() => _CountryDetailScreenState();
}

class _CountryDetailScreenState extends State<CountryDetailScreen>
    with SingleTickerProviderStateMixin {
  Map<String, dynamic>? _data;
  bool _loading = true;
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
    _load();
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final d = await ApiService.getCountry(widget.countryId);
      setState(() {
        _data = d;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      backgroundColor: isDark ? darkBg : bgColor,
      appBar: SofrahAppBar(
        bottom: TabBar(
          controller: _tabs,
          labelColor: accent,
          unselectedLabelColor: Colors.white70,
          indicatorColor: accent,
          tabs: const [
            Tab(text: 'المدن'),
            Tab(text: 'الأكلات'),
            Tab(text: 'الفعاليات'),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _data == null
              ? const Center(child: Text('تعذّر تحميل البيانات'))
              : TabBarView(controller: _tabs, children: [
                  _CitiesTab(
                      cities: List.from(_data!['cities'] ?? []),
                      isDark: isDark),
                  _FoodsTab(
                      foods: List.from(_data!['foods'] ?? []),
                      isDark: isDark),
                  _EventsTab(
                      events: List.from(_data!['events'] ?? []),
                      isDark: isDark),
                ]),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  SHARED MODAL HELPERS
// ═══════════════════════════════════════════════════════════════════════════

Widget _dragHandle(bool isDark) => Center(
      child: Container(
        margin: const EdgeInsets.only(top: 12, bottom: 8),
        width: 40,
        height: 4,
        decoration: BoxDecoration(
          color: isDark ? Colors.white24 : Colors.grey[300],
          borderRadius: BorderRadius.circular(2),
        ),
      ),
    );

class _ModalSection extends StatelessWidget {
  final String icon, title;
  final List<String> items;
  final bool isDark;
  const _ModalSection(
      {required this.icon,
      required this.title,
      required this.items,
      required this.isDark});

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();
    final chipBg =
        isDark ? accent.withValues(alpha: 0.18) : const Color(0xFFF3E8D2);
    final chipTxt = isDark ? Colors.white70 : primary;
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
        Row(mainAxisAlignment: MainAxisAlignment.end, children: [
          Text('$icon  $title',
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'NotoSansArabic',
                  color: isDark ? Colors.white : primary)),
        ]),
        const SizedBox(height: 8),
        Wrap(
          alignment: WrapAlignment.end,
          spacing: 6,
          runSpacing: 6,
          children: items
              .map((item) => Chip(
                    label: Text(item,
                        style: TextStyle(
                            fontSize: 12,
                            fontFamily: 'NotoSansArabic',
                            color: chipTxt)),
                    backgroundColor: chipBg,
                    padding: EdgeInsets.zero,
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ))
              .toList(),
        ),
      ]),
    );
  }
}

class _ModalSteps extends StatelessWidget {
  final List<String> steps;
  final bool isDark;
  const _ModalSteps({required this.steps, required this.isDark});

  @override
  Widget build(BuildContext context) {
    if (steps.isEmpty) return const SizedBox.shrink();
    return Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
      Text('👨‍🍳  طريقة التحضير',
          style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              fontFamily: 'NotoSansArabic',
              color: isDark ? Colors.white : primary)),
      const SizedBox(height: 10),
      ...steps.asMap().entries.map((e) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Expanded(
                    child: Text(e.value,
                        textAlign: TextAlign.right,
                        style: TextStyle(
                            fontSize: 13,
                            height: 1.55,
                            color:
                                isDark ? Colors.white70 : Colors.grey[700],
                            fontFamily: 'NotoSansArabic')),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    width: 26,
                    height: 26,
                    decoration: const BoxDecoration(
                        color: accent, shape: BoxShape.circle),
                    child: Center(
                      child: Text('${e.key + 1}',
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold)),
                    ),
                  ),
                ]),
          )),
    ]);
  }
}

class _InfoTag extends StatelessWidget {
  final String text;
  final bool isDark;
  const _InfoTag({required this.text, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: isDark ? Colors.white10 : const Color(0xFFF3E8D2),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(text,
          style: TextStyle(
              fontSize: 12,
              fontFamily: 'NotoSansArabic',
              color: isDark ? Colors.white70 : primary)),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label, value;
  final bool isDark;
  const _DetailRow(
      {required this.icon,
      required this.label,
      required this.value,
      required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
        Flexible(
          child: Text(value,
              textAlign: TextAlign.right,
              style: TextStyle(
                  fontSize: 13,
                  color: isDark ? Colors.white60 : Colors.grey[700])),
        ),
        const SizedBox(width: 8),
        Text(label,
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                fontFamily: 'NotoSansArabic',
                color: isDark ? Colors.white : Colors.black87)),
        const SizedBox(width: 6),
        Icon(icon, size: 17, color: accent),
      ]),
    );
  }
}

class _PricingCard extends StatelessWidget {
  final dynamic event;
  final bool isDark;
  const _PricingCard({required this.event, required this.isDark});

  Widget _row(String label, String value, bool isDark,
      {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(value,
            style: TextStyle(
                fontSize: isTotal ? 15 : 13,
                fontWeight:
                    isTotal ? FontWeight.bold : FontWeight.normal,
                color: isTotal
                    ? accent
                    : (isDark ? Colors.white70 : Colors.grey[700]))),
        Text(label,
            style: TextStyle(
                fontSize: isTotal ? 14 : 13,
                fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
                fontFamily: 'NotoSansArabic',
                color: isDark ? Colors.white : Colors.black87)),
      ]),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool hasData = (event['hotel_price'] ?? '').isNotEmpty ||
        (event['event_fee'] ?? '').isNotEmpty ||
        (event['total'] ?? '').isNotEmpty;
    if (!hasData) return const SizedBox.shrink();
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? Colors.white10 : const Color(0xFFFFF8F0),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: accent.withValues(alpha: 0.3)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
        Text('💰  التكاليف التقريبية',
            style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                fontFamily: 'NotoSansArabic',
                color: isDark ? Colors.white : primary)),
        const SizedBox(height: 10),
        if ((event['hotel_price'] ?? '').isNotEmpty)
          _row('الإقامة', event['hotel_price'], isDark),
        if ((event['event_fee'] ?? '').isNotEmpty)
          _row('رسوم الفعالية', event['event_fee'], isDark),
        if ((event['total'] ?? '').isNotEmpty) ...[
          Divider(color: isDark ? Colors.white24 : Colors.grey[300]),
          _row('الإجمالي التقريبي', event['total'], isDark,
              isTotal: true),
        ],
      ]),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  MODAL LAUNCHERS
// ═══════════════════════════════════════════════════════════════════════════

void _showCityModal(BuildContext context, dynamic city, bool isDark) {
  final cardBg = isDark ? darkCard : Colors.white;
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => DraggableScrollableSheet(
      initialChildSize: 0.78,
      maxChildSize: 0.95,
      minChildSize: 0.45,
      builder: (_, ctrl) => Container(
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius:
              const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: ListView(
          controller: ctrl,
          children: [
            _dragHandle(isDark),
            if ((city['img'] ?? '').isNotEmpty)
              CachedNetworkImage(
                imageUrl: 'https://sofrh.vercel.app${city['img']}',
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorWidget: (_, __, ___) => Container(
                    height: 200,
                    color: primary.withValues(alpha: 0.3)),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(city['name'] ?? '',
                        textAlign: TextAlign.right,
                        style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'NotoSansArabic',
                            color: isDark ? Colors.white : primary)),
                    if ((city['desc'] ?? '').isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Text(city['desc'],
                          textAlign: TextAlign.right,
                          style: TextStyle(
                              fontSize: 13,
                              height: 1.6,
                              color: isDark
                                  ? Colors.white70
                                  : Colors.grey[700],
                              fontFamily: 'NotoSansArabic')),
                    ],
                    Divider(
                        color:
                            isDark ? Colors.white12 : Colors.grey[200],
                        height: 28),
                    _ModalSection(
                        icon: '🏛️',
                        title: 'الوجهات التاريخية',
                        items: List<String>.from(city['historic'] ?? []),
                        isDark: isDark),
                    _ModalSection(
                        icon: '🍽️',
                        title: 'المطاعم',
                        items:
                            List<String>.from(city['restaurants'] ?? []),
                        isDark: isDark),
                    _ModalSection(
                        icon: '☕',
                        title: 'المقاهي',
                        items: List<String>.from(city['cafes'] ?? []),
                        isDark: isDark),
                    _ModalSection(
                        icon: '📅',
                        title: 'الفعاليات',
                        items: List<String>.from(city['events'] ?? []),
                        isDark: isDark),
                    const SizedBox(height: 8),
                  ]),
            ),
          ],
        ),
      ),
    ),
  );
}

void _showFoodModal(BuildContext context, dynamic food, bool isDark) {
  final cardBg = isDark ? darkCard : Colors.white;
  final ingredients = List<String>.from(food['ingredients'] ?? []);
  final spices = List<String>.from(food['spices'] ?? []);
  final steps = List<String>.from(food['steps'] ?? []);

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => DraggableScrollableSheet(
      initialChildSize: 0.78,
      maxChildSize: 0.95,
      minChildSize: 0.45,
      builder: (_, ctrl) => Container(
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius:
              const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: ListView(
          controller: ctrl,
          children: [
            _dragHandle(isDark),
            if ((food['img'] ?? '').isNotEmpty)
              CachedNetworkImage(
                imageUrl: 'https://sofrh.vercel.app${food['img']}',
                height: 220,
                width: double.infinity,
                fit: BoxFit.cover,
                errorWidget: (_, __, ___) => Container(
                    height: 220,
                    color: primary.withValues(alpha: 0.3)),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(food['name'] ?? '',
                        textAlign: TextAlign.right,
                        style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'NotoSansArabic',
                            color: isDark ? Colors.white : primary)),
                    if ((food['info'] ?? '').isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Text(food['info'],
                          textAlign: TextAlign.right,
                          style: TextStyle(
                              fontSize: 13,
                              height: 1.6,
                              color: isDark
                                  ? Colors.white70
                                  : Colors.grey[700],
                              fontFamily: 'NotoSansArabic')),
                    ],
                    if (ingredients.isNotEmpty ||
                        spices.isNotEmpty ||
                        steps.isNotEmpty)
                      Divider(
                          color:
                              isDark ? Colors.white12 : Colors.grey[200],
                          height: 28),
                    _ModalSection(
                        icon: '🥗',
                        title: 'المكونات',
                        items: ingredients,
                        isDark: isDark),
                    _ModalSection(
                        icon: '🌿',
                        title: 'البهارات والتوابل',
                        items: spices,
                        isDark: isDark),
                    if (steps.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      _ModalSteps(steps: steps, isDark: isDark),
                    ],
                    if (ingredients.isEmpty &&
                        spices.isEmpty &&
                        steps.isEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        child: Text('لا توجد تفاصيل إضافية للوصفة',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                color: isDark
                                    ? Colors.white54
                                    : Colors.grey,
                                fontFamily: 'NotoSansArabic')),
                      ),
                    const SizedBox(height: 16),
                  ]),
            ),
          ],
        ),
      ),
    ),
  );
}

void _showEventModal(BuildContext context, dynamic event, bool isDark) {
  final cardBg = isDark ? darkCard : Colors.white;
  final raw = (event['activities'] ?? '').toString();
  final activities = raw.isNotEmpty
      ? raw.split('|').where((s) => s.trim().isNotEmpty).toList()
      : <String>[];

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => DraggableScrollableSheet(
      initialChildSize: 0.78,
      maxChildSize: 0.95,
      minChildSize: 0.45,
      builder: (_, ctrl) => Container(
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius:
              const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: ListView(
          controller: ctrl,
          children: [
            _dragHandle(isDark),
            if ((event['img'] ?? '').isNotEmpty)
              CachedNetworkImage(
                imageUrl: 'https://sofrh.vercel.app${event['img']}',
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorWidget: (_, __, ___) => Container(
                    height: 200,
                    color: primary.withValues(alpha: 0.3)),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(event['name'] ?? '',
                        textAlign: TextAlign.right,
                        style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'NotoSansArabic',
                            color: isDark ? Colors.white : primary)),
                    const SizedBox(height: 10),
                    Wrap(
                      alignment: WrapAlignment.end,
                      spacing: 8,
                      runSpacing: 6,
                      children: [
                        if ((event['date'] ?? '').isNotEmpty)
                          _InfoTag(
                              text: '📅 ${event['date']}',
                              isDark: isDark),
                        if ((event['location'] ?? '').isNotEmpty)
                          _InfoTag(
                              text: '📍 ${event['location']}',
                              isDark: isDark),
                        if ((event['duration'] ?? '').isNotEmpty)
                          _InfoTag(
                              text: '⏱️ ${event['duration']}',
                              isDark: isDark),
                        if ((event['weather'] ?? '').isNotEmpty)
                          _InfoTag(
                              text: '☀️ ${event['weather']}',
                              isDark: isDark),
                      ],
                    ),
                    if ((event['info'] ?? event['desc'] ?? '').isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Text(event['info'] ?? event['desc'] ?? '',
                          textAlign: TextAlign.right,
                          style: TextStyle(
                              fontSize: 13,
                              height: 1.6,
                              color: isDark
                                  ? Colors.white70
                                  : Colors.grey[700],
                              fontFamily: 'NotoSansArabic')),
                    ],
                    Divider(
                        color:
                            isDark ? Colors.white12 : Colors.grey[200],
                        height: 28),
                    if ((event['airport'] ?? '').isNotEmpty)
                      _DetailRow(
                          icon: Icons.flight_land_rounded,
                          label: 'أقرب مطار',
                          value: event['airport'],
                          isDark: isDark),
                    if ((event['stay'] ?? '').isNotEmpty)
                      _DetailRow(
                          icon: Icons.hotel_rounded,
                          label: 'السكن المقترح',
                          value: event['stay'],
                          isDark: isDark),
                    if (activities.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      _ModalSection(
                          icon: '🎯',
                          title: 'الأنشطة والتجارب',
                          items: activities,
                          isDark: isDark),
                    ],
                    _PricingCard(event: event, isDark: isDark),
                    const SizedBox(height: 16),
                  ]),
            ),
          ],
        ),
      ),
    ),
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  CITIES TAB
// ═══════════════════════════════════════════════════════════════════════════

class _CitiesTab extends StatelessWidget {
  final List cities;
  final bool isDark;
  const _CitiesTab({required this.cities, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final cardBg  = isDark ? darkCard : Colors.white;
    final textClr = isDark ? Colors.white : Colors.black87;
    final subClr  = isDark ? Colors.white60 : Colors.grey[700]!;

    if (cities.isEmpty) return const Center(child: Text('لا توجد مدن'));
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: cities.length,
      itemBuilder: (_, i) {
        final c   = cities[i];
        final img = 'https://sofrh.vercel.app${c['img'] ?? ''}';
        return GestureDetector(
          onTap: () => _showCityModal(context, c, isDark),
          child: Card(
            margin: const EdgeInsets.only(bottom: 12),
            color: cardBg,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16)),
            clipBehavior: Clip.antiAlias,
            child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Stack(children: [
                CachedNetworkImage(
                    imageUrl: img,
                    height: 160,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorWidget: (_, __, ___) => Container(
                        height: 160,
                        color: primary.withValues(alpha: 0.3))),
                Positioned(
                  bottom: 0, left: 0, right: 0,
                  child: Container(
                    height: 48,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.55)
                        ],
                      ),
                    ),
                  ),
                ),
                const Positioned(
                  bottom: 8, left: 12,
                  child: Row(children: [
                    Icon(Icons.touch_app, color: Colors.white70, size: 14),
                    SizedBox(width: 4),
                    Text('اضغط للتفاصيل',
                        style: TextStyle(
                            color: Colors.white70,
                            fontSize: 11,
                            fontFamily: 'NotoSansArabic')),
                  ]),
                ),
              ]),
              Padding(
                padding: const EdgeInsets.all(12),
                child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Text(c['name'] ?? '',
                      textAlign: TextAlign.right,
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          fontFamily: 'NotoSansArabic',
                          color: textClr)),
                  const SizedBox(height: 4),
                  Text(c['desc'] ?? '',
                      textAlign: TextAlign.right,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: subClr, fontSize: 13)),
                  const SizedBox(height: 8),
                  Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                    _QuickCount(
                        count: (c['historic'] ?? []).length, icon: '🏛️'),
                    const SizedBox(width: 14),
                    _QuickCount(
                        count: (c['restaurants'] ?? []).length, icon: '🍽️'),
                    const SizedBox(width: 14),
                    _QuickCount(
                        count: (c['cafes'] ?? []).length, icon: '☕'),
                  ]),
                ]),
              ),
            ]),
          ),
        );
      },
    );
  }
}

class _QuickCount extends StatelessWidget {
  final int count;
  final String icon;
  const _QuickCount({required this.count, required this.icon});

  @override
  Widget build(BuildContext context) {
    if (count == 0) return const SizedBox.shrink();
    return Row(mainAxisSize: MainAxisSize.min, children: [
      Text(icon, style: const TextStyle(fontSize: 13)),
      const SizedBox(width: 3),
      Text('$count',
          style: const TextStyle(
              fontSize: 12, color: accent, fontWeight: FontWeight.bold)),
    ]);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  FOODS TAB
// ═══════════════════════════════════════════════════════════════════════════

class _FoodsTab extends StatelessWidget {
  final List foods;
  final bool isDark;
  const _FoodsTab({required this.foods, required this.isDark});

  @override
  Widget build(BuildContext context) {
    if (foods.isEmpty) return const Center(child: Text('لا توجد أكلات'));
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.85,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10),
      itemCount: foods.length,
      itemBuilder: (_, i) {
        final f   = foods[i];
        final img = 'https://sofrh.vercel.app${f['img'] ?? ''}';
        return GestureDetector(
          onTap: () => _showFoodModal(context, f, isDark),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Stack(fit: StackFit.expand, children: [
              CachedNetworkImage(
                  imageUrl: img,
                  fit: BoxFit.cover,
                  errorWidget: (_, __, ___) =>
                      Container(color: Colors.grey[300])),
              Container(
                  decoration: BoxDecoration(
                      gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.78),
                  ]))),
              Positioned(
                bottom: 8, right: 8, left: 8,
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(f['name'] ?? '',
                          textAlign: TextAlign.right,
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                              fontFamily: 'NotoSansArabic')),
                      if ((f['info'] ?? '').isNotEmpty)
                        Text(f['info'],
                            textAlign: TextAlign.right,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.8),
                                fontSize: 11)),
                      const SizedBox(height: 5),
                      Align(
                        alignment: Alignment.centerRight,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: accent.withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text('الوصفة ←',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontFamily: 'NotoSansArabic',
                                  fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ]),
              ),
            ]),
          ),
        );
      },
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  EVENTS TAB
// ═══════════════════════════════════════════════════════════════════════════

class _EventsTab extends StatelessWidget {
  final List events;
  final bool isDark;
  const _EventsTab({required this.events, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final cardBg  = isDark ? darkCard : Colors.white;
    final textClr = isDark ? Colors.white : Colors.black87;
    final subClr  = isDark ? Colors.white60 : Colors.grey[600]!;

    if (events.isEmpty) return const Center(child: Text('لا توجد فعاليات'));
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: events.length,
      itemBuilder: (_, i) {
        final e   = events[i];
        final img = 'https://sofrh.vercel.app${e['img'] ?? ''}';
        return GestureDetector(
          onTap: () => _showEventModal(context, e, isDark),
          child: Card(
            margin: const EdgeInsets.only(bottom: 10),
            color: cardBg,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14)),
            clipBehavior: Clip.antiAlias,
            child: Row(children: [
              CachedNetworkImage(
                  imageUrl: img,
                  width: 90,
                  height: 90,
                  fit: BoxFit.cover,
                  errorWidget: (_, __, ___) => Container(
                      width: 90,
                      height: 90,
                      color: primary.withValues(alpha: 0.3))),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 10),
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(e['name'] ?? '',
                            textAlign: TextAlign.right,
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                fontFamily: 'NotoSansArabic',
                                color: textClr)),
                        if ((e['info'] ?? '').isNotEmpty) ...[
                          const SizedBox(height: 3),
                          Text(e['info'],
                              textAlign: TextAlign.right,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(color: subClr, fontSize: 12)),
                        ],
                        if ((e['date'] ?? '').isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Text('📅 ${e['date']}',
                              style: TextStyle(
                                  color: accent,
                                  fontSize: 11,
                                  fontFamily: 'NotoSansArabic')),
                        ],
                        const SizedBox(height: 4),
                        Align(
                          alignment: Alignment.centerRight,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: accent.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text('التفاصيل ←',
                                style: TextStyle(
                                    color: accent,
                                    fontSize: 11,
                                    fontFamily: 'NotoSansArabic',
                                    fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ]),
                ),
              ),
            ]),
          ),
        );
      },
    );
  }
}
