import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/api_service.dart';
import '../theme_notifier.dart';

const Color primary   = Color(0xFF32127A);
const Color accent    = Color(0xFFF28500);
const Color lightBg   = Color(0xFFFAF5EB);
const Color darkBg    = Color(0xFF0B0933);
const Color darkCard  = Color(0xFF1a1040);
const Color darkInput = Color(0xFF2a1f5e);

// ─────────────────────────── MAIN SCREEN ────────────────────────────────
class CountriesScreen extends StatefulWidget {
  const CountriesScreen({super.key});
  @override
  State<CountriesScreen> createState() => _CountriesScreenState();
}

class _CountriesScreenState extends State<CountriesScreen> {
  List<dynamic> _all = [];
  List<dynamic> _filtered = [];
  bool _loading = true;
  String _search = '';
  String _continent = 'all';

  final Map<String, String> _continentLabels = {
    'all': 'الكل',
    'africa': 'أفريقيا',
    'asia': 'آسيا',
    'europe': 'أوروبا',
    'north-america': 'أمريكا الشمالية',
    'south-america': 'أمريكا الجنوبية',
    'oceania': 'أوقيانوسيا',
  };

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await ApiService.getCountries();
      setState(() { _all = data; _loading = false; });
      _applyFilter();
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  void _applyFilter() {
    setState(() {
      _filtered = _all.where((c) {
        final matchSearch  = _search.isEmpty || (c['name'] ?? '').contains(_search);
        final matchContinent = _continent == 'all' || (c['continent'] ?? '') == _continent;
        return matchSearch && matchContinent;
      }).toList();
    });
  }

  void _showCountryModal(BuildContext ctx, dynamic country) {
    final h = MediaQuery.sizeOf(ctx).height;
    showModalBottomSheet(
      context: ctx,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => SizedBox(
        height: h * 0.9,
        child: _CountryModal(country: country),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final searchFill = isDark ? darkInput : Colors.white;

    return Scaffold(
      backgroundColor: isDark ? darkBg : lightBg,
      appBar: SofrahAppBar(
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(100),
          child: Column(children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: TextField(
                textAlign: TextAlign.right,
                decoration: InputDecoration(
                  hintText: 'ابحث عن دولة...',
                  hintStyle: const TextStyle(fontFamily: 'NotoSansArabic'),
                  filled: true,
                  fillColor: searchFill,
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none),
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: accent, width: 2)),
                  prefixIcon: const Icon(Icons.search),
                ),
                onChanged: (v) { _search = v; _applyFilter(); },
              ),
            ),
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 8),
                children: _continentLabels.entries.map((e) => Padding(
                  padding: const EdgeInsets.only(left: 6),
                  child: ChoiceChip(
                    label: Text(e.value,
                        style: const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 12)),
                    selected: _continent == e.key,
                    selectedColor: accent,
                    onSelected: (_) { _continent = e.key; _applyFilter(); },
                  ),
                )).toList(),
              ),
            ),
            const SizedBox(height: 6),
          ]),
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _filtered.isEmpty
              ? const Center(
                  child: Text('لا توجد نتائج',
                      style: TextStyle(fontFamily: 'NotoSansArabic')))
              : GridView.builder(
                  padding: const EdgeInsets.all(12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2, childAspectRatio: 0.85,
                      crossAxisSpacing: 10, mainAxisSpacing: 10),
                  itemCount: _filtered.length,
                  itemBuilder: (ctx, i) => _CountryCard(
                    country: _filtered[i],
                    onTap: () => _showCountryModal(ctx, _filtered[i]),
                  ),
                ),
    );
  }
}

// ─────────────────────────── COUNTRY CARD ───────────────────────────────
class _CountryCard extends StatefulWidget {
  final dynamic country;
  final VoidCallback onTap;
  const _CountryCard({required this.country, required this.onTap});

  @override
  State<_CountryCard> createState() => _CountryCardState();
}

class _CountryCardState extends State<_CountryCard> {
  bool _saved = false;

  Future<void> _toggleSave() async {
    final email = emailNotifier.value;
    if (email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('سجّل دخولك أولاً لحفظ المفضلة',
            style: TextStyle(fontFamily: 'NotoSansArabic')),
        backgroundColor: Colors.orange,
      ));
      return;
    }
    try {
      await ApiService.saveFavorite(
        email: email,
        type: 'country',
        id:   widget.country['id']  ?? '',
        name: widget.country['name'] ?? '',
        img:  widget.country['img']  ?? '',
      );
      if (!mounted) return;
      setState(() => _saved = true);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('✅ تم حفظ ${widget.country['name']}',
            style: const TextStyle(fontFamily: 'NotoSansArabic')),
        backgroundColor: Colors.green[700],
        duration: const Duration(seconds: 2),
      ));
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('فشل الحفظ', style: TextStyle(fontFamily: 'NotoSansArabic')),
        backgroundColor: Colors.red,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    final img = 'https://sofrh.vercel.app${widget.country['img'] ?? ''}';
    return GestureDetector(
      onTap: widget.onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(fit: StackFit.expand, children: [
          // Background image
          CachedNetworkImage(imageUrl: img, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(color: primary)),
          // Gradient overlay
          Container(decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter, end: Alignment.bottomCenter,
              colors: [Colors.transparent, Colors.black.withOpacity(0.75)]),
          )),
          // Bookmark button — top-left corner
          Positioned(
            top: 8, left: 8,
            child: GestureDetector(
              onTap: _toggleSave,
              child: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.45),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  _saved ? Icons.bookmark : Icons.bookmark_border,
                  color: _saved ? accent : Colors.white,
                  size: 20,
                ),
              ),
            ),
          ),
          // Name + description
          Positioned(bottom: 10, right: 10, left: 10,
            child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text(widget.country['name'] ?? '', textAlign: TextAlign.right,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                      fontSize: 14, fontFamily: 'NotoSansArabic')),
              if ((widget.country['description'] ?? '').isNotEmpty)
                Text(widget.country['description'], textAlign: TextAlign.right,
                    maxLines: 1, overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11)),
            ]),
          ),
        ]),
      ),
    );
  }
}

// ─────────────────────────── COUNTRY MODAL ──────────────────────────────
class _CountryModal extends StatefulWidget {
  final dynamic country;
  const _CountryModal({required this.country});

  @override
  State<_CountryModal> createState() => _CountryModalState();
}

class _CountryModalState extends State<_CountryModal>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;
  Map<String, dynamic>? _data;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
    _load();
  }

  Future<void> _load() async {
    try {
      final d = await ApiService.getCountry(widget.country['id'] ?? '');
      if (mounted) setState(() { _data = d; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() { _tabs.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final modalBg = isDark ? darkCard : Colors.white;
    final img = 'https://sofrh.vercel.app${widget.country['img'] ?? ''}';

    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      child: Container(
        color: modalBg,
        child: Column(children: [
          // ── Image header ──────────────────────────────────────────
          Stack(children: [
            CachedNetworkImage(
              imageUrl: img, height: 200, width: double.infinity, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(height: 200, color: primary),
            ),
            Container(
              height: 200,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter, end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Colors.black.withOpacity(0.72)]),
              ),
            ),
            Positioned(
              top: 12, right: 12,
              child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.45),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.close, color: Colors.white, size: 20),
                ),
              ),
            ),
            Positioned(
              bottom: 14, right: 16, left: 16,
              child: Text(widget.country['name'] ?? '',
                  textAlign: TextAlign.right,
                  style: const TextStyle(
                      color: Colors.white, fontSize: 22,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'NotoSansArabic')),
            ),
          ]),
          // ── Tab bar ───────────────────────────────────────────────
          Material(
            color: modalBg,
            child: TabBar(
              controller: _tabs,
              labelColor: accent,
              unselectedLabelColor: isDark ? Colors.white54 : Colors.grey,
              indicatorColor: accent,
              labelStyle: const TextStyle(fontFamily: 'NotoSansArabic', fontWeight: FontWeight.bold),
              tabs: const [
                Tab(text: 'المدن'),
                Tab(text: 'الأكلات'),
                Tab(text: 'الفعاليات'),
              ],
            ),
          ),
          // ── Tab content ───────────────────────────────────────────
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _data == null
                    ? const Center(
                        child: Text('تعذّر تحميل البيانات',
                            style: TextStyle(fontFamily: 'NotoSansArabic')))
                    : TabBarView(controller: _tabs, children: [
                        _ModalCitiesList(
                            cities: List.from(_data!['cities'] ?? []),
                            isDark: isDark),
                        _ModalFoodGrid(
                            foods: List.from(_data!['foods'] ?? []),
                            isDark: isDark),
                        _ModalEventsList(
                            events: List.from(_data!['events'] ?? []),
                            isDark: isDark),
                      ]),
          ),
        ]),
      ),
    );
  }
}

// ── Cities list inside modal ─────────────────────────────────────────────
class _ModalCitiesList extends StatelessWidget {
  final List cities;
  final bool isDark;
  const _ModalCitiesList({required this.cities, required this.isDark});

  @override
  Widget build(BuildContext context) {
    if (cities.isEmpty) {
      return const Center(child: Text('لا توجد مدن', style: TextStyle(fontFamily: 'NotoSansArabic')));
    }
    final cardBg = isDark ? darkInput : const Color(0xFFF3E8D2);
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: cities.length,
      itemBuilder: (_, i) {
        final c   = cities[i];
        final img = 'https://sofrh.vercel.app${c['img'] ?? ''}';
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          color: cardBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          clipBehavior: Clip.antiAlias,
          child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            CachedNetworkImage(
              imageUrl: img, height: 130, width: double.infinity, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(height: 130, color: primary.withOpacity(0.3)),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text(c['name'] ?? '', textAlign: TextAlign.right,
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15,
                        fontFamily: 'NotoSansArabic',
                        color: isDark ? Colors.white : primary)),
                if ((c['desc'] ?? '').isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(c['desc'], textAlign: TextAlign.right, maxLines: 2,
                      style: TextStyle(
                          color: isDark ? Colors.white70 : Colors.grey[700],
                          fontSize: 12)),
                ],
              ]),
            ),
          ]),
        );
      },
    );
  }
}

// ── Foods grid inside modal ──────────────────────────────────────────────
class _ModalFoodGrid extends StatelessWidget {
  final List foods;
  final bool isDark;
  const _ModalFoodGrid({required this.foods, required this.isDark});

  @override
  Widget build(BuildContext context) {
    if (foods.isEmpty) {
      return const Center(child: Text('لا توجد أكلات', style: TextStyle(fontFamily: 'NotoSansArabic')));
    }
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2, childAspectRatio: 0.85,
          crossAxisSpacing: 10, mainAxisSpacing: 10),
      itemCount: foods.length,
      itemBuilder: (_, i) {
        final f   = foods[i];
        final img = 'https://sofrh.vercel.app${f['img'] ?? ''}';
        return ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: Stack(fit: StackFit.expand, children: [
            CachedNetworkImage(imageUrl: img, fit: BoxFit.cover,
                errorWidget: (_, __, ___) => Container(color: primary.withOpacity(0.3))),
            Container(decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter, end: Alignment.bottomCenter,
                colors: [Colors.transparent, Colors.black.withOpacity(0.72)]),
            )),
            Positioned(bottom: 8, right: 8, left: 8,
              child: Text(f['name'] ?? '', textAlign: TextAlign.right,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                      fontSize: 13, fontFamily: 'NotoSansArabic'))),
          ]),
        );
      },
    );
  }
}

// ── Events list inside modal ─────────────────────────────────────────────
class _ModalEventsList extends StatelessWidget {
  final List events;
  final bool isDark;
  const _ModalEventsList({required this.events, required this.isDark});

  @override
  Widget build(BuildContext context) {
    if (events.isEmpty) {
      return const Center(child: Text('لا توجد فعاليات', style: TextStyle(fontFamily: 'NotoSansArabic')));
    }
    final cardBg = isDark ? darkInput : const Color(0xFFF3E8D2);
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: events.length,
      itemBuilder: (_, i) {
        final e   = events[i];
        final img = 'https://sofrh.vercel.app${e['img'] ?? ''}';
        return Card(
          margin: const EdgeInsets.only(bottom: 10),
          color: cardBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          clipBehavior: Clip.antiAlias,
          child: Row(children: [
            CachedNetworkImage(
              imageUrl: img, width: 80, height: 70, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(
                  width: 80, height: 70, color: primary.withOpacity(0.3)),
            ),
            Expanded(child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text(e['name'] ?? '', textAlign: TextAlign.right,
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13,
                        fontFamily: 'NotoSansArabic',
                        color: isDark ? Colors.white : Colors.black87)),
                if ((e['info'] ?? '').isNotEmpty)
                  Text(e['info'], maxLines: 1, textAlign: TextAlign.right,
                      style: TextStyle(
                          color: isDark ? Colors.white60 : Colors.grey[600],
                          fontSize: 12)),
              ]),
            )),
          ]),
        );
      },
    );
  }
}
