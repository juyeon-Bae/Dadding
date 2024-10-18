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
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: MyAppBar(
          onNotificationPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const NotificationPage()),
            );
          },
        ),
      ),
      body: pages[_currentIndex],
      floatingActionButton: SizedBox(
        width: 58.09,
        height: 58.09, 
        child: FloatingActionButton(
          backgroundColor: const Color(0xff3B6DFF),
          onPressed: () {},
          shape: const CircleBorder(),
          child: const Icon(Icons.add, color: Colors.white, size: 36),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
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