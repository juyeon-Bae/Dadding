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
    return ClipRRect( 
      borderRadius: const BorderRadius.only(
        topLeft: Radius.circular(15),
        topRight: Radius.circular(15),
      ),
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: const Color(0xFFE8E8E8),
            width: 2.0,
          ),
        ),
        child: SizedBox(
          height: 78,
          child: BottomNavigationBar(
            backgroundColor: const Color(0xFFFFFFFF),
            currentIndex: currentIndex,
            onTap: onTap,
            items: [
              BottomNavigationBarItem(
                icon: SvgPicture.asset(
                  'assets/icons/my.svg',
                  width: 28,
                  height: 28,
                  color: currentIndex == 0 ? const Color(0xff0062FF) : null,
                ),
                label: "마이페이지",
              ),
              BottomNavigationBarItem(
                icon: SvgPicture.asset(
                  'assets/icons/message.svg',
                  width: 28,
                  height: 28,
                  color: currentIndex == 1 ? const Color(0xff0062FF) : null,
                ),
                label: "채팅",
              ),
            ],
            selectedItemColor: const Color(0xff0062FF),
          ),
        ),
      ),
    );
  }
}