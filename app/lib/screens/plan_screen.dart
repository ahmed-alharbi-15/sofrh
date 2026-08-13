import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/api_service.dart';
import 'country_detail_screen.dart';
import '../widgets/sofrah_appbar.dart';

const Color primary   = Color(0xFF32127A);
const Color accent    = Color(0xFFF28500);
const Color lightBg   = Color(0xFFFAF5EB);
const Color darkBg    = Color(0xFF0B0933);
const Color darkCard  = Color(0xFF1a1040);

class PlanScreen extends StatefulWidget {
  const PlanScreen({super.key});
  @override
  State<PlanScreen> createState() => _PlanScreenState();
}

class _PlanScreenState extends State<PlanScreen> {
  List<dynamic> _allCountries = [];
  List<dynamic> _results = [];
  bool _loading = true;
  bool _searched = false;

  double _budget = 5000;
  int _days = 7;
  String _continent = 'all';
  final Set<String> _tripTypes = {};

  final Map<String, String> _continentLabels = {
    'all': 'الكل',
    'asia': 'آسيا',
    'europe': 'أوروبا',
    'africa': 'أفريقيا',
    'north-america': 'أمريكا الشمالية',
    'south-america': 'أمريكا الجنوبية',
    'oceania': 'أوقيانوسيا',
  };

  final Map<String, String> _typeIcons = {
    'شاطئ': '🏖️',
    'جبال': '⛰️',
    'ثقافة': '🏛️',
    'طعام': '🍽️',
    'مغامرة': '🧗',
    'تسوق': '🛍️',
  };

  @override
  void initState() {
    super.initState();
    _loadCountries();
  }

  Future<void> _loadCountries() async {
    try {
      final data = await ApiService.getCountries();
      setState(() { _allCountries = data; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  void _search() {
    final filtered = _allCountries.where((c) {
      if (_continent != 'all' && (c['continent'] ?? '') != _continent) return false;
      return true;
    }).toList();

    filtered.shuffle();
    setState(() {
      _results = filtered.take(12).toList();
      _searched = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final scaffoldBg = isDark ? darkBg : lightBg;
    final cardColor = isDark ? darkCard : Colors.white;

    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: const SofrahAppBar(),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                _sectionCard(
                  title: '💰 الميزانية التقريبية (ريال)',
                  cardColor: cardColor,
                  isDark: isDark,
                  child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text('${_budget.round()} ﷼',
                          style: const TextStyle(fontSize: 18,
                              fontWeight: FontWeight.bold, color: primary)),
                      Text('الميزانية',
                          style: TextStyle(
                              color: isDark ? Colors.white60 : Colors.grey,
                              fontFamily: 'NotoSansArabic')),
                    ]),
                    Slider(
                      value: _budget,
                      min: 1000, max: 50000, divisions: 49,
                      activeColor: accent,
                      inactiveColor: isDark ? Colors.white24 : Colors.grey[300],
                      onChanged: (v) => setState(() => _budget = v),
                    ),
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text('50,000 ﷼',
                          style: TextStyle(fontSize: 11,
                              color: isDark ? Colors.white54 : Colors.grey)),
                      Text('1,000 ﷼',
                          style: TextStyle(fontSize: 11,
                              color: isDark ? Colors.white54 : Colors.grey)),
                    ]),
                  ]),
                ),
                const SizedBox(height: 12),
                _sectionCard(
                  title: '📅 عدد أيام الرحلة',
                  cardColor: cardColor,
                  isDark: isDark,
                  child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text('$_days يوم',
                          style: const TextStyle(fontSize: 18,
                              fontWeight: FontWeight.bold, color: primary)),
                      Text('المدة',
                          style: TextStyle(
                              color: isDark ? Colors.white60 : Colors.grey,
                              fontFamily: 'NotoSansArabic')),
                    ]),
                    Slider(
                      value: _days.toDouble(),
                      min: 3, max: 30, divisions: 27,
                      activeColor: accent,
                      inactiveColor: isDark ? Colors.white24 : Colors.grey[300],
                      onChanged: (v) => setState(() => _days = v.round()),
                    ),
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text('30 يوم',
                          style: TextStyle(fontSize: 11,
                              color: isDark ? Colors.white54 : Colors.grey)),
                      Text('3 أيام',
                          style: TextStyle(fontSize: 11,
                              color: isDark ? Colors.white54 : Colors.grey)),
                    ]),
                  ]),
                ),
                const SizedBox(height: 12),
                _sectionCard(
                  title: '🌍 المنطقة الجغرافية',
                  cardColor: cardColor,
                  isDark: isDark,
                  child: Wrap(
                    alignment: WrapAlignment.end,
                    spacing: 6, runSpacing: 6,
                    children: _continentLabels.entries.map((e) => ChoiceChip(
                      label: Text(e.value,
                          style: const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 12)),
                      selected: _continent == e.key,
                      selectedColor: accent,
                      onSelected: (_) => setState(() => _continent = e.key),
                    )).toList(),
                  ),
                ),
                const SizedBox(height: 12),
                _sectionCard(
                  title: '✨ نوع الرحلة',
                  cardColor: cardColor,
                  isDark: isDark,
                  child: Wrap(
                    alignment: WrapAlignment.end,
                    spacing: 6, runSpacing: 6,
                    children: _typeIcons.entries.map((e) => FilterChip(
                      label: Text('${e.value} ${e.key}',
                          style: const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 12)),
                      selected: _tripTypes.contains(e.key),
                      selectedColor: accent,
                      checkmarkColor: primary,
                      onSelected: (sel) => setState(() {
                        if (sel) _tripTypes.add(e.key); else _tripTypes.remove(e.key);
                      }),
                    )).toList(),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton.icon(
                    onPressed: _search,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primary,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14)),
                    ),
                    icon: const Icon(Icons.search, color: Colors.white),
                    label: const Text('ابحث عن وجهات',
                        style: TextStyle(color: Colors.white, fontSize: 16,
                            fontFamily: 'NotoSansArabic')),
                  ),
                ),
                if (_searched) ...[
                  const SizedBox(height: 24),
                  const Divider(),
                  const SizedBox(height: 8),
                  Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                    Text('${_results.length} وجهة مقترحة',
                        style: const TextStyle(fontWeight: FontWeight.bold,
                            fontSize: 15, fontFamily: 'NotoSansArabic', color: primary)),
                    const SizedBox(width: 8),
                    const Text('🗺️', style: TextStyle(fontSize: 18)),
                  ]),
                  const SizedBox(height: 12),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2, childAspectRatio: 0.85,
                      crossAxisSpacing: 10, mainAxisSpacing: 10,
                    ),
                    itemCount: _results.length,
                    itemBuilder: (_, i) => _PlanCountryCard(country: _results[i]),
                  ),
                ],
                const SizedBox(height: 24),
              ]),
            ),
    );
  }

  Widget _sectionCard({
    required String title,
    required Widget child,
    required Color cardColor,
    required bool isDark,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: cardColor,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text(title,
              style: const TextStyle(fontWeight: FontWeight.bold,
                  fontSize: 14, fontFamily: 'NotoSansArabic', color: primary)),
          const SizedBox(height: 12),
          child,
        ]),
      ),
    );
  }
}

class _PlanCountryCard extends StatelessWidget {
  final dynamic country;
  const _PlanCountryCard({required this.country});

  @override
  Widget build(BuildContext context) {
    final img = 'https://sofrh.vercel.app${country['img'] ?? ''}';
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(
        builder: (_) => CountryDetailScreen(
          countryId: country['id'] ?? '',
          countryName: country['name'] ?? '',
        ),
      )),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Stack(fit: StackFit.expand, children: [
          CachedNetworkImage(imageUrl: img, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(color: primary)),
          Container(decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter, end: Alignment.bottomCenter,
              colors: [Colors.transparent, Colors.black.withOpacity(0.75)]),
          )),
          Positioned(bottom: 8, right: 8, left: 8,
            child: Text(country['name'] ?? '', textAlign: TextAlign.right,
                style: const TextStyle(color: Colors.white,
                    fontWeight: FontWeight.bold, fontSize: 13,
                    fontFamily: 'NotoSansArabic')),
          ),
        ]),
      ),
    );
  }
}
