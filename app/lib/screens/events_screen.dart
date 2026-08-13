import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/api_service.dart';
import '../theme_notifier.dart';
import '../widgets/sofrah_appbar.dart';

const Color primary   = Color(0xFF32127A);
const Color accent    = Color(0xFFF28500);
const Color lightBg   = Color(0xFFFAF5EB);
const Color darkBg    = Color(0xFF0B0933);
const Color darkCard  = Color(0xFF1a1040);
const Color darkInput = Color(0xFF2a1f5e);

// ─────────────────────────── MAIN SCREEN ────────────────────────────────
class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});
  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  List<dynamic> _events = [];
  bool _loading = true;
  String _filter = 'all';
  String _search = '';

  final Map<String, String> _filters = {
    'all': 'الكل',
    'food&cafe': 'مطاعم',
    'Beaches&seas': 'شواطئ',
    'Safari&mountains': 'سفاري',
    'evnents&resorts': 'فعاليات',
    'Museums and landmarks': 'متاحف',
    'cultural': 'ثقافية',
  };

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final data = await ApiService.getEvents(filter: _filter, q: _search);
      setState(() { _events = data; _loading = false; });
    } catch (_) { setState(() => _loading = false); }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final searchFill = isDark ? darkInput : Colors.white;

    return Scaffold(
      backgroundColor: isDark ? darkBg : lightBg,
      appBar: SofrahAppBar(
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(96),
          child: Column(children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: TextField(
                textAlign: TextAlign.right,
                decoration: InputDecoration(
                  hintText: 'ابحث عن فعالية...',
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
          : _events.isEmpty
              ? const Center(
                  child: Text('لا توجد فعاليات',
                      style: TextStyle(fontFamily: 'NotoSansArabic')))
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: _events.length,
                  itemBuilder: (_, i) => _EventCard(event: _events[i]),
                ),
    );
  }
}

// ─────────────────────────── EVENT CARD ─────────────────────────────────
class _EventCard extends StatefulWidget {
  final dynamic event;
  const _EventCard({required this.event});

  @override
  State<_EventCard> createState() => _EventCardState();
}

class _EventCardState extends State<_EventCard> {
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
        type:  'event',
        id:    widget.event['id']   ?? '',
        name:  widget.event['name'] ?? '',
        img:   widget.event['img']  ?? '',
      );
      if (!mounted) return;
      setState(() => _saved = true);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('✅ تم حفظ ${widget.event['name']}',
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

  void _showModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.88,
        maxChildSize: 0.97,
        minChildSize: 0.5,
        builder: (_, ctrl) => _EventModalSheet(
          event: widget.event, scrollCtrl: ctrl),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final img     = 'https://sofrh.vercel.app${widget.event['img'] ?? ''}';
    final name    = (widget.event['name']    ?? '') as String;
    final country = (widget.event['country'] ?? '') as String;
    final date    = (widget.event['date']    ?? '') as String;

    return GestureDetector(
      onTap: _showModal,
      child: Card(
        margin: const EdgeInsets.only(bottom: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        clipBehavior: Clip.antiAlias,
        child: SizedBox(
          height: 220,
          child: Stack(fit: StackFit.expand, children: [
            // ── Full cover image ────────────────────────────────
            CachedNetworkImage(
              imageUrl: img,
              fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(color: darkCard),
            ),
            // ── Gradient overlay ────────────────────────────────
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Color(0xCC000000)],
                  stops: [0.3, 1.0],
                ),
              ),
            ),
            // ── 🎫 Save button — top-left ───────────────────────
            Positioned(
              top: 10, left: 10,
              child: GestureDetector(
                onTap: _toggleSave,
                child: Container(
                  padding: const EdgeInsets.all(7),
                  decoration: BoxDecoration(
                    color: _saved
                        ? accent.withOpacity(0.9)
                        : Colors.black.withOpacity(0.45),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text('🎫',
                      style: TextStyle(fontSize: 18)),
                ),
              ),
            ),
            // ── Bottom: name + country/date badges ──────────────
            Positioned(
              bottom: 0, right: 0, left: 0,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      name,
                      textAlign: TextAlign.right,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        fontFamily: 'NotoSansArabic',
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 7),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        if (date.isNotEmpty) _badge('📅 $date'),
                        if (date.isNotEmpty && country.isNotEmpty)
                          const SizedBox(width: 6),
                        if (country.isNotEmpty) _badge('📍 $country'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ]),
        ),
      ),
    );
  }

  Widget _badge(String text) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    decoration: BoxDecoration(
      color: Colors.black.withOpacity(0.50),
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: Colors.white24, width: 0.8),
    ),
    child: Text(
      text,
      style: const TextStyle(
        color: Colors.white,
        fontSize: 11,
        fontFamily: 'NotoSansArabic',
      ),
    ),
  );
}

// ─────────────────────────── EVENT MODAL SHEET ──────────────────────────
class _EventModalSheet extends StatelessWidget {
  final dynamic event;
  final ScrollController scrollCtrl;
  const _EventModalSheet({required this.event, required this.scrollCtrl});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? darkCard : Colors.white;
    final textClr = isDark ? Colors.white : Colors.black87;
    final subClr  = isDark ? Colors.white70 : Colors.grey[700]!;
    final img = 'https://sofrh.vercel.app${event['img'] ?? ''}';

    // Parse activities (pipe-delimited: icon|price|icon|price…)
    final actRaw = (event['activities'] ?? '').toString();
    final actParts = actRaw.isNotEmpty ? actRaw.split('|') : <String>[];
    final activities = <Map<String, String>>[];
    for (var k = 0; k + 1 < actParts.length; k += 2) {
      activities.add({'icon': actParts[k], 'price': actParts[k + 1]});
    }

    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      child: Container(
        color: sheetBg,
        child: ListView(controller: scrollCtrl, padding: EdgeInsets.zero, children: [
          // ── Image ────────────────────────────────────────────────
          Stack(children: [
            CachedNetworkImage(
              imageUrl: img, height: 240, width: double.infinity, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(height: 240, color: primary),
            ),
            Container(
              height: 240,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter, end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Colors.black.withOpacity(0.7)]),
              ),
            ),
            Positioned(
              top: 12, right: 12,
              child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.45), shape: BoxShape.circle),
                  child: const Icon(Icons.close, color: Colors.white, size: 20),
                ),
              ),
            ),
            Positioned(
              bottom: 14, right: 16, left: 16,
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text(event['name'] ?? '', textAlign: TextAlign.right,
                    style: const TextStyle(color: Colors.white, fontSize: 20,
                        fontWeight: FontWeight.bold, fontFamily: 'NotoSansArabic')),
                if ((event['country'] ?? '').isNotEmpty)
                  Text(event['country'],
                      style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13)),
              ]),
            ),
          ]),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              // ── Date & location row ─────────────────────────────
              if ((event['date'] ?? '').isNotEmpty || (event['location'] ?? '').isNotEmpty)
                Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                  if ((event['location'] ?? '').isNotEmpty)
                    _tag('📍 ${event['location']}', accent.withOpacity(0.15), accent, isDark),
                  const SizedBox(width: 8),
                  if ((event['date'] ?? '').isNotEmpty)
                    _tag('📅 ${event['date']}', primary.withOpacity(0.1), primary, isDark),
                ]),
              const SizedBox(height: 12),

              // ── Description ──────────────────────────────────────
              if ((event['desc'] ?? '').isNotEmpty) ...[
                Text(event['desc'], textAlign: TextAlign.right,
                    style: TextStyle(fontSize: 14, color: subClr,
                        fontFamily: 'NotoSansArabic', height: 1.6)),
                const SizedBox(height: 16),
              ],

              // ── Details grid ─────────────────────────────────────
              _sectionTitle('تفاصيل الرحلة', isDark),
              const SizedBox(height: 10),
              Wrap(spacing: 10, runSpacing: 10, alignment: WrapAlignment.end, children: [
                if ((event['duration'] ?? '').isNotEmpty)
                  _infoChip('⏱️', 'المدة', event['duration'], isDark),
                if ((event['weather'] ?? '').isNotEmpty)
                  _infoChip('🌤️', 'الطقس', event['weather'], isDark),
                if ((event['airport'] ?? '').isNotEmpty)
                  _infoChip('✈️', 'المطار', event['airport'], isDark),
                if ((event['stay'] ?? '').isNotEmpty)
                  _infoChip('🏨', 'الإقامة', event['stay'], isDark),
              ]),
              const SizedBox(height: 16),

              // ── Activities ────────────────────────────────────────
              if (activities.isNotEmpty) ...[
                _sectionTitle('الأنشطة', isDark),
                const SizedBox(height: 10),
                ...activities.map((a) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                    if ((a['price'] ?? '').isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: accent.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(a['price'] ?? '',
                            style: TextStyle(color: accent, fontSize: 12,
                                fontFamily: 'NotoSansArabic')),
                      ),
                    const SizedBox(width: 8),
                    Text(a['icon'] ?? '',
                        style: TextStyle(fontSize: 14, color: textClr,
                            fontFamily: 'NotoSansArabic')),
                  ]),
                )),
                const SizedBox(height: 16),
              ],

              // ── Pricing ───────────────────────────────────────────
              _sectionTitle('التكاليف التقديرية', isDark),
              const SizedBox(height: 10),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? darkInput : const Color(0xFFF3E8D2),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  if ((event['hotel_price'] ?? '').isNotEmpty)
                    _priceRow('🏨 الفندق', event['hotel_price'], isDark),
                  if ((event['event_fee'] ?? '').isNotEmpty)
                    _priceRow('🎫 رسوم الفعالية', event['event_fee'], isDark),
                  if ((event['total'] ?? '').isNotEmpty) ...[
                    Divider(color: isDark ? Colors.white30 : Colors.grey[400]),
                    _priceRow('💰 الإجمالي', event['total'], isDark, bold: true),
                  ],
                ]),
              ),
              const SizedBox(height: 24),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _sectionTitle(String t, bool isDark) => Text(t,
      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16,
          fontFamily: 'NotoSansArabic',
          color: isDark ? Colors.white : primary));

  Widget _tag(String label, Color bg, Color fg, bool isDark) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
    child: Text(label,
        style: TextStyle(color: fg, fontSize: 12, fontFamily: 'NotoSansArabic')),
  );

  Widget _infoChip(String emoji, String label, String value, bool isDark) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
    decoration: BoxDecoration(
      color: isDark ? darkInput : const Color(0xFFF3E8D2),
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
      Text('$emoji $label',
          style: TextStyle(fontSize: 11,
              color: isDark ? Colors.white54 : Colors.grey[600],
              fontFamily: 'NotoSansArabic')),
      const SizedBox(height: 2),
      Text(value,
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : primary,
              fontFamily: 'NotoSansArabic')),
    ]),
  );

  Widget _priceRow(String label, String value, bool isDark, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(value,
            style: TextStyle(
                fontSize: bold ? 15 : 13,
                fontWeight: bold ? FontWeight.bold : FontWeight.normal,
                color: bold ? accent : (isDark ? Colors.white : Colors.black87),
                fontFamily: 'NotoSansArabic')),
        Text(label,
            style: TextStyle(
                fontSize: bold ? 15 : 13,
                fontWeight: bold ? FontWeight.bold : FontWeight.normal,
                color: isDark ? Colors.white70 : Colors.black87,
                fontFamily: 'NotoSansArabic')),
      ]),
    );
  }
}
