'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChainRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      router.replace(`/blockchain${search}${hash}`);
    }
  }, [router]);

  return (
    <div style={{ background: '#071126', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', color: '#94A3B8' }}>Redirecting to CampusX Chain...</p>
        <div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
