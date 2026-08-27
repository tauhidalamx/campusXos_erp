# -*- coding: utf-8 -*-
"""
CAMPUSX OS - Android WebView Hybrid Wrapper
This serves as the main Python entrypoint for the Buildozer webview bootstrap.
It runs a local Flask server that redirects the native Android WebView to the CampusX portal.
"""

import os
import sys
from flask import Flask, redirect, render_template_string

app = Flask(__name__)

# Fallback HTML page if Next.js portal is offline
OFFLINE_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>CAMPUSX OS Portal - Offline</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #F8FAFC;
            color: #0F172A;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            max-width: 400px;
            border: 1px solid #E2E8F0;
        }
        h1 { color: #4F46E5; margin-top: 0; font-size: 24px; }
        p { color: #475569; font-size: 14px; line-height: 1.5; }
        .btn {
            background-color: #4F46E5;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            margin-top: 15px;
            font-weight: bold;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>CAMPUSX OS Portal</h1>
        <p>Connecting to local CampusX ERP Next.js workspace...</p>
        <p style="font-size: 12px; color: #64748B;">Please ensure the Next.js development server is active on your host machine (http://localhost:3000).</p>
        <a href="/" class="btn">Retry Connection</a>
    </div>
</body>
</html>
"""

@app.route('/')
def index():
    # Attempt to redirect to local Next.js portal
    # If Next.js is not active, Flask will redirect and the WebView will retry or show standard error.
    # For Android simulator connecting to host machine, localhost is 10.0.2.2.
    # We will try both or standard localhost.
    return redirect("http://10.0.2.2:3000/connect")

@app.route('/offline')
def offline():
    return render_template_string(OFFLINE_HTML)

if __name__ == '__main__':
    # Under python-for-android webview bootstrap, the app must run on port 5000.
    # The WebView java container automatically points to http://localhost:5000.
    app.run(host='127.0.0.1', port=5000)
