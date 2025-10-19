package com.gestionrestaurant.pos

import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.pos_webview)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true

        val posBridge = POSBridge(this, webView)
        webView.addJavascriptInterface(posBridge, "AndroidPOS")

        webView.loadUrl("file:///android_asset/pos_ui.html")
    }
}
