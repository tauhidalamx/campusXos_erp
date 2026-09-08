import React, { Suspense } from 'react';
import Script from 'next/script';
import LayoutShell from './LayoutShell';
import '../styles/main.css';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>CampusX University ERP</title>
        <meta name="description" content="Next-generation administrative, academic, and financial portal." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isLogin = window.location.pathname === '/login' || window.location.pathname === '/auth';
                  var theme = isLogin ? 'light' : (localStorage.getItem('campusx_theme') || 'emerald');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `
          }}
        />
        <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js" defer></script>
        <script src="/js/data.js" defer></script>
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <LayoutShell>{children}</LayoutShell>
        </Suspense>
      </body>
    </html>
  );
}
