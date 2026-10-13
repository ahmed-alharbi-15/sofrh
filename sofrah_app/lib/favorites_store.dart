import 'package:flutter/foundation.dart';
import 'favorites_service.dart';

/// مخزن مشترك لحالة المفضلة (ChangeNotifier بدون مكتبات خارجية).
/// استخدم AnimatedBuilder(animation: FavoritesStore.instance, ...) لإعادة البناء تلقائياً.
class FavoritesStore extends ChangeNotifier {
  FavoritesStore._();
  static final instance = FavoritesStore._();

  // type → مجموعة المعرّفات المحفوظة
  final Map<String, Set<String>> _favIds = {};
  bool _isLoaded = false;

  bool get isLoaded => _isLoaded;

  bool isFavorite(String type, String id) {
    if (id.isEmpty) return false;
    return _favIds[type]?.contains(id) ?? false;
  }

  /// يحمّل المفضلة من الباك إند ويُحدّث الحالة.
  Future<void> load(String email) async {
    if (email.isEmpty) return;
    final result = await FavoritesService.fetch(email);
    if (result == null) return;
    _applyMap(result);
    _isLoaded = true;
    notifyListeners();
  }

  /// يزامن الحالة من نتيجة fetch موجودة (بدون طلب إضافي).
  void syncFromItems(Map<String, List<FavoriteItem>> items) {
    _applyMap(items);
    _isLoaded = true;
    notifyListeners();
  }

  void _applyMap(Map<String, List<FavoriteItem>> items) {
    _favIds.clear();
    items.forEach((type, list) {
      _favIds[type] = list.map((e) => e.id).toSet();
    });
  }

  /// يمسح الحالة عند تسجيل الخروج.
  void clear() {
    _favIds.clear();
    _isLoaded = false;
    notifyListeners();
  }

  /// تبديل المفضلة مع تحديث متفائل.
  /// يرجع رسالة الخطأ أو null لو نجح.
  Future<String?> toggle({
    required String type,
    required String id,
    required String name,
    required String img,
    required String email,
  }) async {
    // [DEBUG TEMP] — مؤقت لتشخيص المشاكل، احذفه بعد التحقق
    debugPrint('[FavStore] toggle ▶ type=$type  id="$id"');
    if (id.isEmpty) return 'تعذر حفظ هذا العنصر'; // slug غير متاح بعد
    if (email.isEmpty) return 'سجّل دخولك أول عشان تحفظ';

    final set = _favIds.putIfAbsent(type, () => {});
    final wasFavorite = set.contains(id);

    // تحديث متفائل فوري
    if (wasFavorite) {
      set.remove(id);
    } else {
      set.add(id);
    }
    notifyListeners();

    // طلب الباك إند
    bool ok;
    if (wasFavorite) {
      ok = await FavoritesService.remove(email: email, type: type, id: id);
    } else {
      ok = await FavoritesService.add(
          email: email, type: type, id: id, name: name, img: img);
    }

    // [DEBUG TEMP] — مؤقت
    debugPrint('[FavStore] toggle ◀ ok=$ok  wasFavorite=$wasFavorite');
    if (!ok) {
      // تراجع لو فشل الطلب
      if (wasFavorite) {
        set.add(id);
      } else {
        set.remove(id);
      }
      notifyListeners();
      return wasFavorite ? 'تعذر إزالة المفضلة' : 'تعذر إضافة المفضلة';
    }
    return null;
  }
}
