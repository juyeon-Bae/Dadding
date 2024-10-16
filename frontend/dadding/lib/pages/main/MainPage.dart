import 'package:dadding/pages/main/ChatPage.dart';
import 'package:dadding/pages/main/HomePage.dart';
import 'package:dadding/pages/main/PostPage.dart';
import 'package:dadding/pages/main/ProfilePage.dart';
import 'package:dadding/pages/notification/NotificationPage.dart';
import 'package:dadding/widgets/MyAppBar.dart';
import 'package:dadding/widgets/MyBottomNavigationBar.dart';
import 'package:flutter/material.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _currentIndex = 0;
  final pages = [
    const HomePage(),
    const PostPage(),
    const ChatPage(),
    const ProfilePage(),
  ];

  @override
  void initState() {
    super.initState();
  }

  void _navigateToNotificationPage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const NotificationPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: MyAppBar(
          onNotificationPressed: _navigateToNotificationPage,
        ),
      ),      body: pages[_currentIndex],
      bottomNavigationBar: MyBottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}