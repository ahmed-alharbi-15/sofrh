import 'package:flutter/material.dart';
import 'app_colors.dart';

class AccountAvatar extends StatelessWidget {
  final String name;
  final String avatarUrl;
  final double radius;

  const AccountAvatar({
    super.key,
    required this.name,
    required this.avatarUrl,
    this.radius = 16,
  });

  @override
  Widget build(BuildContext context) {
    final hasImage = avatarUrl.isNotEmpty;
    return CircleAvatar(
      radius: radius,
      backgroundColor: hasImage ? Colors.white24 : AppColors.accent,
      backgroundImage: hasImage ? NetworkImage(avatarUrl) : null,
      child: hasImage
          ? null
          : (name.isEmpty
              ? Icon(Icons.person, color: Colors.white, size: radius)
              : Text(
                  String.fromCharCode(name.runes.first),
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: radius * 0.9,
                  ),
                )),
    );
  }
}