import 'packege:flutter/material.dart';

void main(){
  runApp(const MyApp());
}

class MyApp extends Statelesswidget {
  const MyApp({super.key});

  @override
  Widget build(Buildcontext context ) {
    return MaterialApp(
      title:'سفرة'.
      theme: ThemeData(
      colorScheme: ColorScheme.formSeed(
        
      )
      )
    )
  }
}