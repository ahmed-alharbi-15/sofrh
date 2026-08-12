import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/api_service.dart';
import 'country_detail_screen.dart';

const Color primary = Color(0xFF32127A);
const Color accent  = Color(0xFFF28500);
const Color bgColor = Color(0xFFFAF5EB);

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
        final matchSearch = _search.isEmpty ||
            (c['name'] ?? '').contains(_search);
        final matchContinent = _continent == 'all' ||
            (c['continent'] ?? '') == _continent;
        return matchSearch && matchContinent;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: primary,
        title: const Text('الدول', style: TextStyle(color: Colors.white, fontFamily: 'NotoSansArabic')),
        centerTitle: true,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(100),
          child: Column(children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: TextField(
                textAlign: TextAlign.right,
                decoration: InputDecoration(
                  hintText: 'ابحث عن دولة...',
                  filled: true, fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
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
                    label: Text(e.value, style: const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 12)),
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
          : GridView.builder(
              padding: const EdgeInsets.all(12),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, childAspectRatio: 0.85, crossAxisSpacing: 10, mainAxisSpacing: 10,
              ),
              itemCount: _filtered.length,
              itemBuilder: (ctx, i) => _CountryCard(country: _filtered[i]),
            ),
    );
  }
}

class _CountryCard extends StatelessWidget {
  final dynamic country;
  const _CountryCard({required this.country});

  @override
  Widget build(BuildContext context) {
    final img = 'https://sofrh.vercel.app${country['img'] ?? ''}';
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(
        builder: (_) => CountryDetailScreen(countryId: country['id'], countryName: country['name']),
      )),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(fit: StackFit.expand, children: [
          CachedNetworkImage(imageUrl: img, fit: BoxFit.cover,
            errorWidget: (_, __, ___) => Container(color: primary)),
          Container(decoration: BoxDecoration(
            gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
              colors: [Colors.transparent, Colors.black.withOpacity(0.75)]),
          )),
          Positioned(bottom: 10, right: 10, left: 10, child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(country['name'] ?? '', textAlign: TextAlign.right,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                    fontSize: 14, fontFamily: 'NotoSansArabic')),
              if ((country['description'] ?? '').isNotEmpty)
                Text(country['description'], textAlign: TextAlign.right, maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11)),
            ],
          )),
        ]),
      ),
    );
  }
}
