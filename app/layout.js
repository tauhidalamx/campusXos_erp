import React, { Suspense } from 'react';
import Script from 'next/script';
import LayoutShell from './LayoutShell';
import '../styles/main.css';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>CampusX University ERP</title>
        <meta name="description" content="Next-generation administrative, academic, and financial portal." />
        <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js" strategy="beforeInteractive" />
        <Script src="/js/data.js" strategy="beforeInteractive" />
      </head>
      <body>
        <Suspense fallback={null}>
          <LayoutShell>{children}</LayoutShell>
        </Suspense>
      </body>
    </html>
  );
}
