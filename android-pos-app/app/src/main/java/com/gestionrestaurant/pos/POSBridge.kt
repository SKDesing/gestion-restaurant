package com.gestionrestaurant.pos

import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Toast
import android.util.Log

class POSBridge(private val context: Context, private val webView: WebView) {

    @JavascriptInterface
    fun printReceipt(receiptJson: String) {
        Log.d("POS_BRIDGE", "Requête d'impression reçue: $receiptJson")
        // Simule l'impression, à remplacer par la logique réelle
        val success = true
        webView.post {
            val script = "javascript:handlePrintResponse($success);"
            webView.evaluateJavascript(script, null)
        }
    }

    @JavascriptInterface
    fun openCashDrawer() {
        Log.d("POS_BRIDGE", "Ouverture du tiroir-caisse demandée.")
        Toast.makeText(context, "Tiroir-caisse ouvert (Simulé)", Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun log(message: String) {
        Log.i("WEB_LOG", message)
    }
}
