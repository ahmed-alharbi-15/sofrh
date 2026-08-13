import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/api_service.dart';
import '../theme_notifier.dart';

const Color primary  = Color(0xFF32127A);
const Color accent   = Color(0xFFF28500);
const Color bgColor  = Color(0xFFFAF5EB);
const Color darkBg   = Color(0xFF0B0933);
const Color darkCard = Color(0xFF1a1040);

class CountryDetailScreen extends StatefulWidget {
  final String countryId;
  final String countryName;
  const CountryDetailScreen({super.key, required this.countryId, required this.countryName});
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

  Future<void> _load() async {
    try {
      final d = await ApiService.getCountry(widget.countryId);
      setState(() { _data = d; _loading = false; });
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
                  _CitiesTab(cities: List.from(_data!['cities'] ?? [])),
                  _FoodsTab(foods: List.from(_data!['foods'] ?? [])),
                  _EventsTab(events: List.from(_data!['events'] ?? [])),
                ]),
    );
  }
}

// ─── Cities ──────────────────────────────────────────────────────
class _CitiesTab extends StatelessWidget {
  final List cities;
  const _CitiesTab({required this.cities});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg  = isDark ? darkCard : Colors.white;
    final textClr = isDark ? Colors.white : Colors.black87;
    final subClr  = isDark ? Colors.white60 : Colors.grey[700]!;
    if (cities.isEmpty) return const Center(child: Text('لا توجد مدن'));
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: cities.length,
      itemBuilder: (_, i) {
        final c = cities[i];
        final img = 'https://sofrh.vercel.app${c['img'] ?? ''}';
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          color: cardBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          clipBehavior: Clip.antiAlias,
          child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            CachedNetworkImage(imageUrl: img, height: 160, width: double.infinity,
              fit: BoxFit.cover, errorWidget: (_, __, ___) => Container(height: 160, color: primary.withOpacity(0.3))),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text(c['name'] ?? '', textAlign: TextAlign.right,
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'NotoSansArabic', color: textClr)),
                const SizedBox(height: 4),
                Text(c['desc'] ?? '', textAlign: TextAlign.right, maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: subClr, fontSize: 13)),
                const SizedBox(height: 8),
                _TagRow(label: '🏛️ المعالم', items: List<String>.from(c['historic'] ?? []), isDark: isDark),
                _TagRow(label: '🍽️ المطاعم', items: List<String>.from(c['restaurants'] ?? []), isDark: isDark),
                _TagRow(label: '☕ المقاهي',  items: List<String>.from(c['cafes'] ?? []), isDark: isDark),
              ]),
            ),
          ]),
        );
      },
    );
  }
}

class _TagRow extends StatelessWidget {
  final String label;
  final List<String> items;
  final bool isDark;
  const _TagRow({required this.label, required this.items, this.isDark = false});

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();
    final chipBg  = isDark ? accent.withOpacity(0.15) : const Color(0xFFF3E8D2);
    final chipTxt = isDark ? Colors.white70 : primary;
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
        Text(label, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13,
            fontFamily: 'NotoSansArabic', color: isDark ? Colors.white : Colors.black87)),
        const SizedBox(height: 4),
        Wrap(alignment: WrapAlignment.end, spacing: 6, runSpacing: 4, children: items.map((t) =>
          Chip(label: Text(t, style: TextStyle(fontSize: 11, fontFamily: 'NotoSansArabic', color: chipTxt)),
            backgroundColor: chipBg, padding: EdgeInsets.zero,
            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
        ).toList()),
      ]),
    );
  }
}

// ─── Foods ───────────────────────────────────────────────────────
class _FoodsTab extends StatelessWidget {
  final List foods;
  const _FoodsTab({required this.foods});

  @override
  Widget build(BuildContext context) {
    if (foods.isEmpty) return const Center(child: Text('لا توجد أكلات'));
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2, childAspectRatio: 0.85, crossAxisSpacing: 10, mainAxisSpacing: 10),
      itemCount: foods.length,
      itemBuilder: (_, i) {
        final f = foods[i];
        final img = 'https://sofrh.vercel.app${f['img'] ?? ''}';
        return ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: Stack(fit: StackFit.expand, children: [
            CachedNetworkImage(imageUrl: img, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(color: Colors.grey[300])),
            Container(decoration: BoxDecoration(
              gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
                colors: [Colors.transparent, Colors.black.withOpacity(0.7)]))),
            Positioned(bottom: 8, right: 8, left: 8, child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(f['name'] ?? '', textAlign: TextAlign.right,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                        fontSize: 13, fontFamily: 'NotoSansArabic')),
                if ((f['info'] ?? '').isNotEmpty)
                  Text(f['info'], textAlign: TextAlign.right, maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11)),
              ],
            )),
          ]),
        );
      },
    );
  }
}

// ─── Events ──────────────────────────────────────────────────────
class _EventsTab extends StatelessWidget {
  final List events;
  const _EventsTab({required this.events});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg  = isDark ? darkCard : Colors.white;
    final textClr = isDark ? Colors.white : Colors.black87;
    final subClr  = isDark ? Colors.white60 : Colors.grey[600]!;
    if (events.isEmpty) return const Center(child: Text('لا توجد فعاليات'));
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: events.length,
      itemBuilder: (_, i) {
        final e = events[i];
        final img = 'https://sofrh.vercel.app${e['img'] ?? ''}';
        return Card(
          margin: const EdgeInsets.only(bottom: 10),
          color: cardBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          clipBehavior: Clip.antiAlias,
          child: Row(children: [
            CachedNetworkImage(imageUrl: img, width: 90, height: 80, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(width: 90, height: 80, color: primary.withOpacity(0.3))),
            Expanded(child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text(e['name'] ?? '', textAlign: TextAlign.right,
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13,
                        fontFamily: 'NotoSansArabic', color: textClr)),
                if ((e['info'] ?? '').isNotEmpty)
                  Text(e['info'], textAlign: TextAlign.right, maxLines: 2,
                    style: TextStyle(color: subClr, fontSize: 12)),
              ]),
            )),
          ]),
        );
      },
    );
  }
}
