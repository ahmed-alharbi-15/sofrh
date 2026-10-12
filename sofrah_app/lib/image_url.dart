/// Converts a raw image path from the API into a fully resolved,
/// properly encoded URL ready for CachedNetworkImage / Image.network.
///
/// • ''          → ''
/// • 'https://…' → returned unchanged (already a full URL)
/// • '/img/…'    → prepended with https://sofrh.vercel.app and
///                  Uri.encodeFull applied to handle spaces & Arabic chars.
String resolveImageUrl(String raw) {
  if (raw.isEmpty) return '';
  if (raw.startsWith('http')) return raw;
  final path = raw.startsWith('/') ? raw : '/$raw';
  return Uri.encodeFull('https://sofrh.vercel.app$path');
}
