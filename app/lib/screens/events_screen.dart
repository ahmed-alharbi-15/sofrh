import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/api_service.dart';

const Color primary = Color(0xFF32127A);
const Color accent  = Color(0xFFF28500);
const Color bgColor = Color(0xFFFAF5EB);

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
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: primary,
        title: const Text('الفعاليات', style: TextStyle(color: Colors.white, fontFamily: 'NotoSansArabic')),
        centerTitle: true,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(96),
          child: Column(children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: TextField(
                textAlign: TextAlign.right,
                decoration: InputDecoration(
                  hintText: 'ابحث عن فعالية...',
                  filled: true, fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  prefixIcon: const Icon(Icons.search),
                ),
                onSubmitted: (v) { _search = v; _load(); },
              ),
            ),
            SizedBox(
              height: 40,
              child: ListView(scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 8),
                children: _filters.entries.map((e) => Padding(
                  padding: const EdgeInsets.only(left: 6),
                  child: ChoiceChip(
                    label: Text(e.value, style: const TextStyle(fontFamily: 'NotoSansArabic', fontSize: 12)),
                    selected: _filter == e.key,
                    selectedColor: accent,
                    onSelected: (_) { _filter = e.key; _load(); },
                  ),
                )).toList()),
            ),
            const SizedBox(height: 6),
          ]),
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _events.length,
              itemBuilder: (_, i) => _EventCard(event: _events[i]),
            ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final dynamic event;
  const _EventCard({required this.event});

  @override
  Widget build(BuildContext context) {
    final img = 'https://sofrh.vercel.app${event['img'] ?? ''}';
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      clipBehavior: Clip.antiAlias,
      child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
        CachedNetworkImage(imageUrl: img, height: 180, width: double.infinity,
          fit: BoxFit.cover, errorWidget: (_, __, ___) => Container(height: 180, color: Colors.grey[300])),
        Padding(
          padding: const EdgeInsets.all(12),
          child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Text(event['name'] ?? '', textAlign: TextAlign.right,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'NotoSansArabic')),
            const SizedBox(height: 4),
            Row(mainAxisAlignment: MainAxisAlignment.end, children: [
              Text(event['country'] ?? '', style: TextStyle(color: Colors.grey[600], fontSize: 13)),
              const SizedBox(width: 8),
              Text(event['date'] ?? '', style: TextStyle(color: Colors.grey[600], fontSize: 13)),
            ]),
            if ((event['desc'] ?? '').isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(event['desc'], textAlign: TextAlign.right, maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: Colors.grey[700], fontSize: 13)),
            ],
            const SizedBox(height: 8),
            if ((event['location'] ?? '').isNotEmpty)
              _infoRow('📍', event['location']),
            if ((event['total'] ?? '').isNotEmpty)
              _infoRow('💰', event['total']),
          ]),
        ),
      ]),
    );
  }

  Widget _infoRow(String icon, String text) => Padding(
    padding: const EdgeInsets.only(bottom: 2),
    child: Row(mainAxisAlignment: MainAxisAlignment.end,
      children: [Text(text, style: const TextStyle(fontSize: 13, fontFamily: 'NotoSansArabic')),
        const SizedBox(width: 4), Text(icon)]),
  );
}
