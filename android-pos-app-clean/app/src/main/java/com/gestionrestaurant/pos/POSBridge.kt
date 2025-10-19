package com.gestionrestaurant.pos

import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView

class POSBridge(private val context: Context, private val webView: WebView) {

    @JavascriptInterface
    fun printReceipt(receiptJson: String) {
        // Simulate printing - in a real app you'd call USB/Bluetooth printer APIs
        // We'll callback into JS with success true
        val script = "handlePrintResponse(true)"
        webView.post { webView.evaluateJavascript(script, null) }
    }

    @JavascriptInterface
    fun openCashDrawer() {
        // Simulate opening cash drawer
        webView.post { webView.evaluateJavascript("console.log('TIROIR: ouvert');", null) }
    }

    @JavascriptInterface
    fun log(message: String) {
        android.util.Log.d("POSBridge", message)
    }
}
