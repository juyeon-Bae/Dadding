import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebviewMainController extends GetxController {
  late final WebViewController controller;

  @override
  void onInit() {
    super.onInit();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.transparent)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            debugPrint('progressing $progress');
          },
          onPageStarted: (String url) {
            debugPrint(url);
          },
          onPageFinished: (String url) {
            debugPrint('Page Finished');
          },
          onWebResourceError: (WebResourceError error) {},
        ),
      )
      ..loadRequest(Uri.parse('http://192.168.1.40:3000/'));
  }

  WebViewController getController() {
    return controller;
  }
}