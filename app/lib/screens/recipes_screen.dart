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

class RecipesScreen extends StatefulWidget {
  const RecipesScreen({super.key});
  @override
  State<RecipesScreen> createState() => _RecipesScreenState();
}

class _RecipesScreenState extends State<RecipesScreen> {
  List<dynamic> _recipes = [];
  bool _loading = true;
  String _filter = 'all';
  String _search = '';

  final Map<String, String> _filters = {
    'all': 'الكل',
    'main-foods': 'رئيسية',
    'sweets': 'حلويات',
    'snacks': 'سناكات',
  };

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final data = await ApiService.getRecipes(filter: _filter, q: _search);
      setState(() { _recipes = data; _loading = false; });
    } catch (_) { setState(() => _loading = false); }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final scaffoldBg = isDark ? darkBg : lightBg;
    final searchFill = isDark ? darkInput : Colors.white;

    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: SofrahAppBar(
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(96),
          child: Column(children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: TextField(
                textAlign: TextAlign.right,
                decoration: InputDecoration(
                  hintText: 'ابحث عن وصفة...',
                  filled: true,
                  fillColor: searchFill,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: accent, width: 2),
                  ),
                  prefixIcon: const Icon(Icons.search),
                ),
                onSubmitted: (v) { _search = v; _load(); },
              ),
            ),
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 8),
                children: _filters.entries.map((e) => Padding(
                  padding: const EdgeInsets.only(left: 6),
                  child: ChoiceChip(
                    label: Text(e.value,
                        style: const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 12)),
                    selected: _filter == e.key,
                    selectedColor: accent,
                    onSelected: (_) { _filter = e.key; _load(); },
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
          : _recipes.isEmpty
              ? const Center(
                  child: Text('لا توجد وصفات',
                      style: TextStyle(fontFamily: 'NotoSansArabic')))
              : GridView.builder(
                  padding: const EdgeInsets.all(12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.78,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                  ),
                  itemCount: _recipes.length,
                  itemBuilder: (_, i) => _RecipeCard(
                    recipe: _recipes[i],
                    onTap: () => _showDetail(context, _recipes[i]),
                  ),
                ),
    );
  }

  void _showDetail(BuildContext context, dynamic recipe) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? darkCard : lightBg;
    final img = 'https://sofrh.vercel.app${recipe['img'] ?? ''}';
    final ingredients = List<String>.from(recipe['ingredients'] ?? []);
    final steps = List<String>.from(recipe['steps'] ?? []);
    final spices = List<String>.from(recipe['spices'] ?? []);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        builder: (_, ctrl) => Container(
          decoration: BoxDecoration(
            color: sheetBg,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: ListView(controller: ctrl, padding: EdgeInsets.zero, children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              child: CachedNetworkImage(
                imageUrl: img, height: 220, width: double.infinity, fit: BoxFit.cover,
                errorWidget: (_, __, ___) => Container(
                    height: 220, color: isDark ? darkCard : Colors.grey[300]),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text(recipe['name'] ?? '', textAlign: TextAlign.right,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold,
                        fontFamily: 'NotoSansArabic', color: primary)),
                if ((recipe['country'] ?? '').isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(recipe['country'],
                      style: TextStyle(
                          color: isDark ? Colors.white60 : Colors.grey[600],
                          fontSize: 13)),
                ],
                if (ingredients.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  _sectionTitle('🥘 المكونات'),
                  const SizedBox(height: 8),
                  Wrap(
                    alignment: WrapAlignment.end, spacing: 6, runSpacing: 6,
                    children: ingredients.map((ing) => Chip(
                      label: Text(ing,
                          style: const TextStyle(fontSize: 11, fontFamily: 'NotoSansArabic')),
                      backgroundColor: const Color(0xFFF3E8D2),
                      padding: EdgeInsets.zero,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    )).toList(),
                  ),
                ],
                if (spices.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  _sectionTitle('🌶️ التوابل'),
                  const SizedBox(height: 8),
                  Wrap(
                    alignment: WrapAlignment.end, spacing: 6, runSpacing: 6,
                    children: spices.map((s) => Chip(
                      label: Text(s,
                          style: const TextStyle(fontSize: 11, fontFamily: 'NotoSansArabic')),
                      backgroundColor: const Color(0xFFFFE8D2),
                      padding: EdgeInsets.zero,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    )).toList(),
                  ),
                ],
                if (steps.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  _sectionTitle('📋 طريقة التحضير'),
                  const SizedBox(height: 8),
                  ...steps.asMap().entries.map((e) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Expanded(
                          child: Text(e.value, textAlign: TextAlign.right,
                              style: TextStyle(
                                  fontSize: 13,
                                  color: isDark ? Colors.white70 : Colors.grey[800],
                                  fontFamily: 'NotoSansArabic')),
                        ),
                        const SizedBox(width: 8),
                        CircleAvatar(
                          radius: 12, backgroundColor: primary,
                          child: Text('${e.key + 1}',
                              style: const TextStyle(color: Colors.white, fontSize: 11)),
                        ),
                      ],
                    ),
                  )),
                ],
                const SizedBox(height: 24),
              ]),
            ),
          ]),
        ),
      ),
    );
  }

  Widget _sectionTitle(String t) => Text(t,
      style: const TextStyle(
          fontWeight: FontWeight.bold, fontSize: 15,
          fontFamily: 'NotoSansArabic', color: primary));
}

class _RecipeCard extends StatefulWidget {
  final dynamic recipe;
  final VoidCallback onTap;
  const _RecipeCard({required this.recipe, required this.onTap});

  @override
  State<_RecipeCard> createState() => _RecipeCardState();
}

class _RecipeCardState extends State<_RecipeCard> {
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
        type:  'recipe',
        id:    widget.recipe['id']   ?? '',
        name:  widget.recipe['name'] ?? '',
        img:   widget.recipe['img']  ?? '',
      );
      if (!mounted) return;
      setState(() => _saved = true);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('✅ تم حفظ ${widget.recipe['name']}',
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
    final img = 'https://sofrh.vercel.app${widget.recipe['img'] ?? ''}';
    return GestureDetector(
      onTap: widget.onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Stack(fit: StackFit.expand, children: [
          CachedNetworkImage(imageUrl: img, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(color: Colors.grey[300])),
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
                  size: 18,
                ),
              ),
            ),
          ),
          // Name + country
          Positioned(bottom: 8, right: 8, left: 8,
            child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text(widget.recipe['name'] ?? '', textAlign: TextAlign.right,
                  style: const TextStyle(color: Colors.white,
                      fontWeight: FontWeight.bold, fontSize: 13,
                      fontFamily: 'NotoSansArabic')),
              if ((widget.recipe['country'] ?? '').isNotEmpty)
                Text(widget.recipe['country'], textAlign: TextAlign.right,
                    style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11)),
            ]),
          ),
        ]),
      ),
    );
  }
}
