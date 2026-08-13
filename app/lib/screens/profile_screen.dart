import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../theme_notifier.dart';

const Color primary  = Color(0xFF32127A);
const Color accent   = Color(0xFFF28500);
const Color lightBg  = Color(0xFFFAF5EB);
const Color darkBg   = Color(0xFF0B0933);
const Color darkCard = Color(0xFF1a1040);
const Color darkInput= Color(0xFF2a1f5e);
const String _baseUrl = 'https://sofrh-1.onrender.com';

// ─────────────────────────── MAIN SCREEN ────────────────────────────────
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
  String _avatarUrl = '';
  final _picker = ImagePicker();
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
    _loadProfile();
  }

  @override
  void dispose() { _tabs.dispose(); super.dispose(); }

  Future<void> _loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final email    = prefs.getString('sofrah_email') ?? '';
    final username = prefs.getString('sofrah_username') ?? '';
    final avatarUrl = prefs.getString('sofrah_avatar') ?? '';
    setState(() { _email = email; _username = username; _avatarUrl = avatarUrl; });

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
    usernameNotifier.value = '';
    emailNotifier.value    = '';
    widget.onLogout();
  }

  Future<void> _pickAvatar() async {
    if (_email.isEmpty) return;
    final picked = await _picker.pickImage(
        source: ImageSource.gallery, imageQuality: 80);
    if (picked == null) return;
    try {
      final url = await ApiService.uploadAvatar(
          email: _email, filePath: picked.path);
      if (url.isNotEmpty && mounted) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('sofrah_avatar', url);
        setState(() => _avatarUrl = url);
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('فشل رفع الصورة',
              style: TextStyle(fontFamily: 'NotoSansArabic')),
          backgroundColor: Colors.red,
        ));
      }
    }
  }

  List<dynamic> _favByType(String type) =>
      _favorites.where((f) => f['type'] == type).toList();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? darkBg : lightBg,
      appBar: SofrahAppBar(
        extraActions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            tooltip: 'تسجيل الخروج',
            onPressed: _email.isEmpty
                ? null
                : () => showDialog(
                      context: context,
                      builder: (_) => AlertDialog(
                        title: const Text('تسجيل الخروج',
                            style: TextStyle(fontFamily: 'NotoSansArabic')),
                        content: const Text('هل أنت متأكد؟',
                            style: TextStyle(fontFamily: 'NotoSansArabic')),
                        actions: [
                          TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('إلغاء')),
                          TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                                _logout();
                              },
                              child: const Text('خروج',
                                  style: TextStyle(color: Colors.red))),
                        ],
                      ),
                    ),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(children: [
              _buildHeader(isDark),
              _buildTabBar(isDark),
              Expanded(
                child: TabBarView(controller: _tabs, children: [
                  _FavoritesTab(
                    countries: _favByType('country'),
                    cities:    _favByType('city'),
                    events:    _favByType('event'),
                    recipes:   _favByType('recipe'),
                    isDark:    isDark,
                  ),
                  _SettingsTab(
                    email:    _email,
                    username: _username,
                    isDark:   isDark,
                    onUsernameChanged: (name) {
                      setState(() => _username = name);
                      usernameNotifier.value = name;
                    },
                    onLogout: () => showDialog(
                      context: context,
                      builder: (_) => AlertDialog(
                        title: const Text('تسجيل الخروج',
                            style: TextStyle(fontFamily: 'NotoSansArabic')),
                        content: const Text('هل أنت متأكد؟',
                            style: TextStyle(fontFamily: 'NotoSansArabic')),
                        actions: [
                          TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('إلغاء')),
                          TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                                _logout();
                              },
                              child: const Text('خروج',
                                  style: TextStyle(color: Colors.red))),
                        ],
                      ),
                    ),
                  ),
                ]),
              ),
            ]),
    );
  }

  Widget _buildHeader(bool isDark) {
    final headerBg = isDark ? darkCard : Colors.white;
    return Container(
      width: double.infinity,
      color: headerBg,
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
      child: Column(children: [
        // Avatar
        GestureDetector(
          onTap: _pickAvatar,
          child: Stack(clipBehavior: Clip.none, children: [
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: accent, width: 3),
                boxShadow: [BoxShadow(
                    color: primary.withOpacity(0.2),
                    blurRadius: 16,
                    offset: const Offset(0, 6))],
              ),
              child: CircleAvatar(
                radius: 42,
                backgroundColor: accent,
                backgroundImage:
                    _avatarUrl.isNotEmpty ? NetworkImage(_avatarUrl) : null,
                child: _avatarUrl.isEmpty
                    ? Text(
                        _username.isNotEmpty
                            ? _username[0].toUpperCase()
                            : '؟',
                        style: const TextStyle(
                            fontSize: 34,
                            color: primary,
                            fontWeight: FontWeight.bold),
                      )
                    : null,
              ),
            ),
            Positioned(
              bottom: 0, right: 0,
              child: Container(
                width: 28, height: 28,
                decoration: const BoxDecoration(
                    color: accent, shape: BoxShape.circle),
                child: const Icon(Icons.camera_alt,
                    size: 16, color: Colors.white),
              ),
            ),
          ]),
        ),
        const SizedBox(height: 12),
        // Username
        Text(
          _username.isNotEmpty ? _username : 'المستخدم',
          style: TextStyle(
              fontSize: 20, fontWeight: FontWeight.bold,
              fontFamily: 'NotoSansArabic',
              color: isDark ? Colors.white : primary),
        ),
        const SizedBox(height: 4),
        // Email
        Text(
          _email.isNotEmpty ? _email : 'غير مسجّل',
          style: TextStyle(
              fontSize: 13,
              color: isDark ? Colors.white60 : Colors.grey[600]),
        ),
        const SizedBox(height: 16),
        // Stats row
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          _statChip('${_favByType('country').length}', 'دول', isDark),
          _statDivider(isDark),
          _statChip('${_favByType('city').length}', 'مدن', isDark),
          _statDivider(isDark),
          _statChip('${_favByType('event').length}', 'فعاليات', isDark),
          _statDivider(isDark),
          _statChip('${_favByType('recipe').length}', 'وصفات', isDark),
        ]),
      ]),
    );
  }

  Widget _statChip(String count, String label, bool isDark) => Column(children: [
    Text(count,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: accent)),
    Text(label,
        style: TextStyle(fontSize: 11, fontFamily: 'NotoSansArabic',
            color: isDark ? Colors.white60 : Colors.grey[600])),
  ]);

  Widget _statDivider(bool isDark) => Container(
    width: 1, height: 30,
    margin: const EdgeInsets.symmetric(horizontal: 20),
    color: isDark ? Colors.white24 : Colors.grey[300],
  );

  Widget _buildTabBar(bool isDark) {
    return Material(
      color: isDark ? darkCard : Colors.white,
      child: TabBar(
        controller: _tabs,
        labelColor: accent,
        unselectedLabelColor: isDark ? Colors.white54 : Colors.grey,
        indicatorColor: accent,
        labelStyle: const TextStyle(fontFamily: 'NotoSansArabic', fontWeight: FontWeight.bold),
        tabs: const [
          Tab(icon: Icon(Icons.favorite_border), text: 'المفضلة'),
          Tab(icon: Icon(Icons.settings_outlined), text: 'الإعدادات'),
        ],
      ),
    );
  }
}

// ─────────────────────────── FAVORITES TAB ──────────────────────────────
class _FavoritesTab extends StatelessWidget {
  final List<dynamic> countries, cities, events, recipes;
  final bool isDark;
  const _FavoritesTab({
    required this.countries, required this.cities,
    required this.events,    required this.recipes,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    final isEmpty = countries.isEmpty && cities.isEmpty && events.isEmpty && recipes.isEmpty;
    if (isEmpty) {
      return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        const Icon(Icons.bookmark_border, size: 64, color: Colors.grey),
        const SizedBox(height: 16),
        const Text('لا توجد مفضلات بعد',
            style: TextStyle(fontSize: 16, color: Colors.grey, fontFamily: 'NotoSansArabic')),
        const SizedBox(height: 8),
        Text('ابحث واحفظ الدول والفعاليات والوصفات',
            style: TextStyle(fontSize: 13,
                color: isDark ? Colors.white38 : Colors.grey[400],
                fontFamily: 'NotoSansArabic')),
      ]));
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (countries.isNotEmpty) ...[
          _sectionHeader('🌍 الدول المحفوظة', countries.length, isDark),
          ...countries.map((c) => _FavCard(item: c, isDark: isDark)),
          const SizedBox(height: 8),
        ],
        if (cities.isNotEmpty) ...[
          _sectionHeader('🏙️ المدن المحفوظة', cities.length, isDark),
          ...cities.map((c) => _FavCard(item: c, isDark: isDark)),
          const SizedBox(height: 8),
        ],
        if (events.isNotEmpty) ...[
          _sectionHeader('🎫 الفعاليات المحفوظة', events.length, isDark),
          ...events.map((e) => _FavCard(item: e, isDark: isDark)),
          const SizedBox(height: 8),
        ],
        if (recipes.isNotEmpty) ...[
          _sectionHeader('🍽️ الوصفات المحفوظة', recipes.length, isDark),
          ...recipes.map((r) => _FavCard(item: r, isDark: isDark)),
        ],
      ],
    );
  }

  Widget _sectionHeader(String title, int count, bool isDark) => Padding(
    padding: const EdgeInsets.only(bottom: 10, top: 4),
    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: accent.withOpacity(0.15),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text('$count',
            style: const TextStyle(color: accent, fontWeight: FontWeight.bold, fontSize: 12)),
      ),
      Text(title,
          style: TextStyle(
              fontWeight: FontWeight.bold, fontSize: 15,
              fontFamily: 'NotoSansArabic',
              color: isDark ? Colors.white : primary)),
    ]),
  );
}

class _FavCard extends StatelessWidget {
  final dynamic item;
  final bool isDark;
  const _FavCard({required this.item, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final cardBg = isDark ? darkCard : Colors.white;
    final img = 'https://sofrh.vercel.app${item['img'] ?? ''}';
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      clipBehavior: Clip.antiAlias,
      color: cardBg,
      child: Row(children: [
        CachedNetworkImage(
          imageUrl: img, width: 80, height: 72, fit: BoxFit.cover,
          errorWidget: (_, __, ___) => Container(
            width: 80, height: 72, color: primary.withOpacity(0.3),
            child: const Icon(Icons.image_not_supported, color: Colors.white38)),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text(item['name'] ?? '', textAlign: TextAlign.right,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14,
                      fontFamily: 'NotoSansArabic',
                      color: isDark ? Colors.white : Colors.black87)),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: accent.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(_typeLabel(item['type']),
                    style: const TextStyle(fontSize: 11, color: primary,
                        fontFamily: 'NotoSansArabic')),
              ),
            ]),
          ),
        ),
      ]),
    );
  }

  String _typeLabel(String? type) {
    switch (type) {
      case 'country': return '🌍 دولة';
      case 'city':    return '🏙️ مدينة';
      case 'event':   return '🎫 فعالية';
      case 'recipe':  return '🍽️ وصفة';
      default:        return type ?? '';
    }
  }
}

// ─────────────────────────── SETTINGS TAB ───────────────────────────────
class _SettingsTab extends StatefulWidget {
  final String email;
  final String username;
  final bool isDark;
  final VoidCallback onLogout;
  final void Function(String) onUsernameChanged;
  const _SettingsTab({
    required this.email,   required this.username,
    required this.isDark,  required this.onLogout,
    required this.onUsernameChanged,
  });

  @override
  State<_SettingsTab> createState() => _SettingsTabState();
}

class _SettingsTabState extends State<_SettingsTab> {
  final _oldPassCtrl  = TextEditingController();
  final _newPassCtrl  = TextEditingController();
  final _confPassCtrl = TextEditingController();
  final _nameEditCtrl = TextEditingController();
  bool _showOld = false, _showNew = false, _showConf = false;
  bool _loading = false;
  bool _expanded = false;
  bool _nameExpanded = false;
  bool _savingName   = false;

  @override
  void dispose() {
    _oldPassCtrl.dispose();
    _newPassCtrl.dispose();
    _confPassCtrl.dispose();
    _nameEditCtrl.dispose();
    super.dispose();
  }

  Future<void> _saveName() async {
    final newName = _nameEditCtrl.text.trim();
    if (newName.length < 4) {
      _snack('الاسم يجب أن يكون 4 أحرف على الأقل', Colors.red);
      return;
    }
    setState(() => _savingName = true);
    try {
      await ApiService.updateProfile(
          email: widget.email, username: newName);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('sofrah_username', newName);
      if (!mounted) return;
      widget.onUsernameChanged(newName);
      _snack('✅ تم تحديث الاسم بنجاح', Colors.green[700]!);
      setState(() => _nameExpanded = false);
      _nameEditCtrl.clear();
    } catch (e) {
      if (mounted) _snack(e.toString().replaceAll('Exception: ', ''), Colors.red);
    }
    if (mounted) setState(() => _savingName = false);
  }

  Future<void> _changePassword() async {
    if (_newPassCtrl.text != _confPassCtrl.text) {
      _snack('كلمتا المرور غير متطابقتين', Colors.red);
      return;
    }
    if (_newPassCtrl.text.length < 6) {
      _snack('كلمة المرور قصيرة جداً', Colors.red);
      return;
    }
    setState(() => _loading = true);
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/change-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email':        widget.email,
          'old_password': _oldPassCtrl.text,
          'new_password': _newPassCtrl.text,
        }),
      );
      if (!mounted) return;
      if (res.statusCode == 200) {
        _snack('✅ تم تغيير كلمة المرور بنجاح', Colors.green[700]!);
        _oldPassCtrl.clear(); _newPassCtrl.clear(); _confPassCtrl.clear();
        setState(() => _expanded = false);
      } else {
        final data = jsonDecode(res.body);
        _snack(data['detail'] ?? 'فشل تغيير كلمة المرور', Colors.red);
      }
    } catch (_) {
      if (mounted) _snack('فشل الاتصال بالسيرفر', Colors.red);
    }
    if (mounted) setState(() => _loading = false);
  }

  void _snack(String msg, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg, style: const TextStyle(fontFamily: 'NotoSansArabic')),
      backgroundColor: color,
    ));
  }

  @override
  Widget build(BuildContext context) {
    final isDark  = widget.isDark;
    final cardBg  = isDark ? darkCard : Colors.white;
    final inputBg = isDark ? darkInput : Colors.white;
    final labelClr= isDark ? const Color(0xFFE0E0E0) : primary;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // ── Account info card ─────────────────────────────────────
        _settingsCard(
          isDark: isDark,
          cardBg: cardBg,
          child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            _settingRow(
              icon: Icons.person_outline, iconColor: primary,
              title: 'اسم المستخدم', value: widget.username, isDark: isDark),
            Divider(color: isDark ? Colors.white12 : Colors.grey[200]),
            _settingRow(
              icon: Icons.email_outlined, iconColor: accent,
              title: 'البريد الإلكتروني', value: widget.email, isDark: isDark),
          ]),
          title: '👤 معلومات الحساب',
        ),
        const SizedBox(height: 12),

        // ── Change name card ──────────────────────────────────────
        _settingsCard(
          isDark: isDark,
          cardBg: cardBg,
          title: '✏️ تعديل الاسم',
          trailing: IconButton(
            icon: Icon(_nameExpanded ? Icons.expand_less : Icons.expand_more,
                color: isDark ? Colors.white70 : Colors.grey),
            onPressed: () => setState(() {
              _nameExpanded = !_nameExpanded;
              if (_nameExpanded && _nameEditCtrl.text.isEmpty) {
                _nameEditCtrl.text = widget.username;
              }
            }),
          ),
          child: AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
              Divider(color: isDark ? Colors.white12 : Colors.grey[200]),
              const SizedBox(height: 8),
              Text('الاسم الجديد',
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: labelClr,
                      fontFamily: 'NotoSansArabic')),
              const SizedBox(height: 6),
              TextField(
                controller: _nameEditCtrl,
                textAlign: TextAlign.right,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: inputBg,
                  hintText: 'أدخل الاسم الجديد',
                  hintStyle:
                      TextStyle(color: Colors.grey.withOpacity(0.6)),
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 12),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(
                          color: isDark
                              ? accent.withOpacity(0.3)
                              : primary.withOpacity(0.1))),
                  enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(
                          color: isDark
                              ? accent.withOpacity(0.3)
                              : primary.withOpacity(0.1),
                          width: 1.5)),
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide:
                          const BorderSide(color: accent, width: 2)),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _savingName ? null : _saveName,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _savingName
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                              color: Colors.white, strokeWidth: 2.5))
                      : const Text('حفظ الاسم',
                          style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              fontFamily: 'NotoSansArabic')),
                ),
              ),
              const SizedBox(height: 4),
            ]),
            crossFadeState: _nameExpanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 300),
          ),
        ),
        const SizedBox(height: 12),

        // ── Change password card ──────────────────────────────────
        _settingsCard(
          isDark: isDark,
          cardBg: cardBg,
          title: '🔒 تغيير كلمة المرور',
          trailing: IconButton(
            icon: Icon(_expanded ? Icons.expand_less : Icons.expand_more,
                color: isDark ? Colors.white70 : Colors.grey),
            onPressed: () => setState(() => _expanded = !_expanded),
          ),
          child: AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Divider(color: isDark ? Colors.white12 : Colors.grey[200]),
              const SizedBox(height: 8),
              _passField('كلمة المرور الحالية', _oldPassCtrl,
                  _showOld, (v) => setState(() => _showOld = v), inputBg, labelClr, isDark),
              const SizedBox(height: 12),
              _passField('كلمة المرور الجديدة', _newPassCtrl,
                  _showNew, (v) => setState(() => _showNew = v), inputBg, labelClr, isDark),
              const SizedBox(height: 12),
              _passField('تأكيد كلمة المرور', _confPassCtrl,
                  _showConf, (v) => setState(() => _showConf = v), inputBg, labelClr, isDark),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity, height: 48,
                child: ElevatedButton(
                  onPressed: _loading ? null : _changePassword,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _loading
                      ? const SizedBox(width: 20, height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                      : const Text('حفظ كلمة المرور',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold,
                              color: Colors.white, fontFamily: 'NotoSansArabic')),
                ),
              ),
              const SizedBox(height: 4),
            ]),
            crossFadeState: _expanded ? CrossFadeState.showSecond : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 300),
          ),
        ),
        const SizedBox(height: 12),

        // ── App info ─────────────────────────────────────────────
        _settingsCard(
          isDark: isDark,
          cardBg: cardBg,
          title: 'ℹ️ عن التطبيق',
          child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            _settingRow(icon: Icons.info_outline, iconColor: Colors.blue,
                title: 'الإصدار', value: '1.0.0', isDark: isDark),
            Divider(color: isDark ? Colors.white12 : Colors.grey[200]),
            _settingRow(icon: Icons.language, iconColor: Colors.green,
                title: 'الموقع', value: 'sofrh.vercel.app', isDark: isDark),
          ]),
        ),
        const SizedBox(height: 20),

        // ── Logout button ─────────────────────────────────────────
        SizedBox(
          width: double.infinity, height: 52,
          child: OutlinedButton.icon(
            onPressed: widget.onLogout,
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Colors.red, width: 1.5),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            icon: const Icon(Icons.logout, color: Colors.red),
            label: const Text('تسجيل الخروج',
                style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold,
                    fontSize: 15, fontFamily: 'NotoSansArabic')),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _settingsCard({
    required bool isDark,
    required Color cardBg,
    required Widget child,
    required String title,
    Widget? trailing,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: primary.withOpacity(0.07),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          trailing ?? const SizedBox.shrink(),
          Text(title,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15,
                  fontFamily: 'NotoSansArabic',
                  color: isDark ? Colors.white : primary)),
        ]),
        child,
      ]),
    );
  }

  Widget _settingRow({
    required IconData icon, required Color iconColor,
    required String title, required String value,
    required bool isDark,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Flexible(
          child: Text(value, textAlign: TextAlign.left,
              style: TextStyle(fontSize: 13,
                  color: isDark ? Colors.white70 : Colors.grey[700])),
        ),
        Row(children: [
          Text(title,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
                  fontFamily: 'NotoSansArabic',
                  color: isDark ? Colors.white : Colors.black87)),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 16, color: iconColor),
          ),
        ]),
      ]),
    );
  }

  Widget _passField(String label, TextEditingController ctrl, bool show,
      ValueChanged<bool> onToggle, Color inputBg, Color labelClr, bool isDark) {
    return Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
      Text(label,
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600,
              color: labelClr, fontFamily: 'NotoSansArabic')),
      const SizedBox(height: 6),
      TextField(
        controller: ctrl,
        obscureText: !show,
        textDirection: TextDirection.ltr,
        decoration: InputDecoration(
          filled: true, fillColor: inputBg,
          hintText: '••••••••',
          hintStyle: TextStyle(color: Colors.grey.withOpacity(0.6)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide(
                  color: isDark ? accent.withOpacity(0.3) : primary.withOpacity(0.1))),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide(
                  color: isDark ? accent.withOpacity(0.3) : primary.withOpacity(0.1), width: 1.5)),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: accent, width: 2)),
          suffixIcon: IconButton(
            icon: Text(show ? '🙈' : '👁️', style: const TextStyle(fontSize: 16)),
            onPressed: () => onToggle(!show),
          ),
        ),
      ),
    ]);
  }
}
