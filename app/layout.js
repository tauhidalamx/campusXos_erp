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
