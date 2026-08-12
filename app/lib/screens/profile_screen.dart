import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

const Color primary = Color(0xFF32127A);
const Color accent  = Color(0xFFF28500);
const Color bgColor = Color(0xFFFAF5EB);

class ProfileScreen extends StatefulWidget {
  final VoidCallback onLogout;
  const ProfileScreen({super.key, required this.onLogout});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with SingleTickerProviderStateMixin {
  String _username = '';
  String _email = '';
  List<dynamic> _favorites = [];
  bool _loading = true;
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final email = prefs.getString('sofrah_email') ?? '';
    final username = prefs.getString('sofrah_username') ?? '';
    setState(() { _email = email; _username = username; });

    if (email.isNotEmpty) {
      try {
        final favs = await ApiService.getFavorites(email);
        setState(() { _favorites = favs; _loading = false; });
      } catch (_) { setState(() => _loading = false); }
    } else {
      setState(() => _loading = false);
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    widget.onLogout();
  }

  List<dynamic> _favByType(String type) =>
      _favorites.where((f) => f['type'] == type).toList();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: primary,
        title: const Text('البروفايل', style: TextStyle(color: Colors.white, fontFamily: 'NotoSansArabic')),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => showDialog(
              context: context,
              builder: (_) => AlertDialog(
                title: const Text('تسجيل الخروج', style: TextStyle(fontFamily: 'NotoSansArabic')),
                content: const Text('هل أنت متأكد من تسجيل الخروج؟',
                    style: TextStyle(fontFamily: 'NotoSansArabic')),
                actions: [
                  TextButton(onPressed: () => Navigator.pop(context),
                      child: const Text('إلغاء')),
                  TextButton(onPressed: () { Navigator.pop(context); _logout(); },
                      child: const Text('خروج', style: TextStyle(color: Colors.red))),
                ],
              ),
            ),
          ),
        ],
        bottom: TabBar(
          controller: _tabs,
          labelColor: accent,
          unselectedLabelColor: Colors.white70,
          indicatorColor: accent,
          tabs: const [
            Tab(text: 'دول'),
            Tab(text: 'فعاليات'),
            Tab(text: 'وصفات'),
          ],
        ),
      ),
      body: Column(children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          color: Colors.white,
          child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text(_username.isNotEmpty ? _username : 'المستخدم',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold,
                      fontFamily: 'NotoSansArabic', color: primary)),
              const SizedBox(height: 2),
              Text(_email, style: TextStyle(fontSize: 13, color: Colors.grey[600])),
              const SizedBox(height: 4),
              Text('${_favorites.length} مفضلة',
                  style: const TextStyle(fontSize: 12, color: accent)),
            ]),
            const SizedBox(width: 14),
            CircleAvatar(
              radius: 32,
              backgroundColor: accent,
              child: Text(
                _username.isNotEmpty ? _username[0].toUpperCase() : '؟',
                style: const TextStyle(fontSize: 26, color: primary, fontWeight: FontWeight.bold),
              ),
            ),
          ]),
        ),
        Expanded(
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : TabBarView(controller: _tabs, children: [
                  _FavList(items: _favByType('country'), emptyMsg: 'لا توجد دول محفوظة'),
                  _FavList(items: _favByType('event'), emptyMsg: 'لا توجد فعاليات محفوظة'),
                  _FavList(items: _favByType('recipe'), emptyMsg: 'لا توجد وصفات محفوظة'),
                ]),
        ),
      ]),
    );
  }
}

class _FavList extends StatelessWidget {
  final List<dynamic> items;
  final String emptyMsg;
  const _FavList({required this.items, required this.emptyMsg});

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        const Icon(Icons.bookmark_border, size: 56, color: Colors.grey),
        const SizedBox(height: 12),
        Text(emptyMsg, style: const TextStyle(color: Colors.grey, fontFamily: 'NotoSansArabic')),
      ]));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: items.length,
      itemBuilder: (_, i) {
        final item = items[i];
        final img = 'https://sofrh.vercel.app${item['img'] ?? ''}';
        return Card(
          margin: const EdgeInsets.only(bottom: 10),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          clipBehavior: Clip.antiAlias,
          child: Row(children: [
            CachedNetworkImage(
              imageUrl: img, width: 80, height: 72, fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(
                width: 80, height: 72, color: primary,
                child: const Icon(Icons.image_not_supported, color: Colors.white38),
              ),
            ),
            Expanded(child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text(item['name'] ?? '', textAlign: TextAlign.right,
                    style: const TextStyle(fontWeight: FontWeight.bold,
                        fontSize: 14, fontFamily: 'NotoSansArabic')),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: accent.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(_typeLabel(item['type']),
                      style: const TextStyle(fontSize: 11, color: primary, fontFamily: 'NotoSansArabic')),
                ),
              ]),
            )),
          ]),
        );
      },
    );
  }

  String _typeLabel(String? type) {
    switch (type) {
      case 'country': return '🌍 دولة';
      case 'event': return '🎫 فعالية';
      case 'recipe': return '🍽️ وصفة';
      default: return type ?? '';
    }
  }
}
