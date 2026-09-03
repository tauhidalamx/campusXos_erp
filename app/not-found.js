import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Page Not Found in CampusX OS</p>
      <Link href="/login" style={{ padding: '0.75rem 1.5rem', background: '#4f46e5', color: '#fff', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600 }}>
        Return to Login
      </Link>
    </div>
  );
}
