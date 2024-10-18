import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_svg/svg.dart';

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
      items: [
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            'assets/icons/home.svg',
            color: currentIndex == 0 ? const Color(0xff3B6DFF) : null,
            width: 24,
            height: 24,
          ),
          label: "홈",
        ),
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            'assets/icons/post.svg',
            color: currentIndex == 1 ? const Color(0xff3B6DFF) : null,
            width: 20.32,
            height: 23.31,
          ),
          label: "게시글",
        ),
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            'assets/icons/chat.svg',
            color: currentIndex == 2 ? const Color(0xff3B6DFF) : null,
            width: 20,
            height: 21.89,
          ),
          label: "채팅",
        ),
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            'assets/icons/profile.svg',
            color: currentIndex == 3 ? const Color(0xff3B6DFF) : null,
            width: 24,
            height: 24,
          ),
          label: "마이페이지",
        ),
      ],
      selectedItemColor: const Color(0xff3B6DFF),
      unselectedItemColor: const Color(0xffD1D2D1),
    );
  }
}