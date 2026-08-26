'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LibraryPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'issued'
  const [activeKebabId, setActiveKebabId] = useState(null);

  const [books, setBooks] = useState([
    { id: 'BK001', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', copies: 5, category: 'Computer Science', location: 'Rack A-3' },
    { id: 'BK002', title: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig', copies: 3, category: 'Artificial Intelligence', location: 'Rack B-1' },
    { id: 'BK003', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', copies: 4, category: 'Database Systems', location: 'Rack A-5' },
    { id: 'BK004', title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', copies: 2, category: 'Software Eng', location: 'Rack C-2' },
    { id: 'BK005', title: 'Principles of Neural Science', author: 'Eric Kandel', copies: 1, category: 'Bioinformatics', location: 'Rack D-4' }
  ]);

  const [issuedBooks, setIssuedBooks] = useState([
    { id: 'ISS001', bookTitle: 'Introduction to Algorithms', studentName: 'Alex Rivera', issueDate: '2026-06-01', dueDate: '2026-06-15', status: 'Active' },
    { id: 'ISS002', bookTitle: 'The Pragmatic Programmer', studentName: 'Aria Nakamura', issueDate: '2026-06-05', dueDate: '2026-06-19', status: 'Active' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleReserveBook = (title) => {
    alert(`Reservation request submitted for "${title}". You will receive a notification when it is ready for pickup.`);
  };

  const handleReturnBook = (id) => {
    if (confirm('Mark this book as returned?')) {
      setIssuedBooks(prev => prev.filter(b => b.id !== id));
      alert('Book marked as returned.');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Library Management</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Browse cataloged textbooks, monitor borrow histories, and manage book reservations.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-brand-border pb-3 shrink-0">
        <button 
          className={`text-sm font-semibold pb-2 border-b-2 cursor-pointer transition-all hover:text-white ${activeTab === 'catalog' ? 'active border-brand-primary text-white' : 'border-transparent text-brand-text-muted'}`}
          onClick={() => setActiveTab('catalog')}
        >
          Book Catalog
        </button>
        <button 
          className={`text-sm font-semibold pb-2 border-b-2 cursor-pointer transition-all hover:text-white ${activeTab === 'issued' ? 'active border-brand-primary text-white' : 'border-transparent text-brand-text-muted'}`}
          onClick={() => setActiveTab('issued')}
        >
          Issued Books Log
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Search bar */}
          <div className="card animate-fade-in p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <input 
              type="text" 
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl w-full outline-none" 
              placeholder="Search books by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Book Catalog Table */}
          <div className="table-container animate-fade-in overflow-x-auto bg-brand-bg-secondary border border-brand-border rounded-2xl relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">Available Copies</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(b => (
                  <tr key={b.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                    <td className="p-4">
                      <div className="font-semibold text-brand-text-main">{b.title}</div>
                      <code className="text-[0.65rem] text-brand-text-muted font-mono">{b.id}</code>
                    </td>
                    <td className="p-4 text-brand-text-muted">{b.author}</td>
                    <td className="p-4">{b.category}</td>
                    <td className="p-4 text-brand-text-muted font-mono text-xs">{b.location}</td>
                    <td className="p-4 text-center font-bold text-brand-accent-emerald">{b.copies}</td>
                    <td className="p-4 text-right relative">
                      <button 
                        className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center"
                        onClick={() => setActiveKebabId(activeKebabId === b.id ? null : b.id)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      {activeKebabId === b.id && (
                        <div className="absolute right-4 top-12 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-36 text-left p-1.5 animate-scale-up">
                          <button 
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-text-main hover:bg-white/[0.05] rounded-lg cursor-pointer"
                            onClick={() => { setActiveKebabId(null); handleReserveBook(b.title); }}
                          >
                            Reserve Book
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Issued books list */
        <div className="table-container animate-fade-in overflow-x-auto bg-brand-bg-secondary border border-brand-border rounded-2xl relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                <th className="p-4">Book Title</th>
                <th className="p-4">Borrowed By</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map(b => (
                <tr key={b.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                  <td className="p-4 font-semibold text-brand-text-main">{b.bookTitle}</td>
                  <td className="p-4 text-brand-text-muted">{b.studentName}</td>
                  <td className="p-4 font-mono text-xs">{b.issueDate}</td>
                  <td className="p-4 font-mono text-xs text-brand-accent-amber">{b.dueDate}</td>
                  <td className="p-4 text-right relative">
                    <button 
                      className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center"
                      onClick={() => setActiveKebabId(activeKebabId === b.id ? null : b.id)}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    {activeKebabId === b.id && (
                      <div className="absolute right-4 top-12 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-36 text-left p-1.5 animate-scale-up">
                        {currentUser.role === 'admin' ? (
                          <button 
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-accent-emerald hover:bg-brand-accent-emerald/10 rounded-lg cursor-pointer"
                            onClick={() => { setActiveKebabId(null); handleReturnBook(b.id); }}
                          >
                            Mark Returned
                          </button>
                        ) : (
                          <span className="block px-3 py-2 text-[0.7rem] text-brand-text-muted">No Actions Available</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
