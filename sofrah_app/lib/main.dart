import 'package:flutter/material.dart';

void main(){
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context ) {
    return MaterialApp(
      title:'سفرة',
      theme: ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF32127A),
        brightness: Brightness.light,
        primary: const Color(0xFF32127A),
        secondary: const Color(0xFFF28500),
        surface: const Color(0xFFFAF5EB),
      ),
      scaffoldBackgroundColor: const Color(0xFFFAF5EB),
      useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF32127A),
          brightness: Brightness.dark,
          primary: const Color(0xFF32127A),
          secondary: const Color(0xFFF28500),
          surface: const Color(0xFF1a1040),
        ),
        scaffoldBackgroundColor: const Color(0xFF0B0933),
        useMaterial3: true,
      ).
      themeMode: ThemeMode.system,
      home: const Scaffold(
        body: Center(
          child: MyToggleButton(),
        )
      )
    );
  }
}

class MyToggleButton extends StatelessWidget {
  const MyToggleButton({super.key});

  @override 
  State <MyToggleButton> creatState() =>_MyToggleButton();
}
