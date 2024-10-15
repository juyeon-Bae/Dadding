import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class MyBottomNavigationBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const MyBottomNavigationBar({
    Key? key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      backgroundColor: const Color(0xffffffff),
      currentIndex: currentIndex,
      onTap: onTap,
      type: BottomNavigationBarType.fixed,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: "홈",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.location_on),
          label: "게시글",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.chat),
          label: "채팅",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.people),
          label: "마이페이지",
        ),
      ],
      selectedItemColor: const Color(0xff3B6DFF),
      unselectedItemColor: const Color(0xffD1D2D1),
    );
  }
}