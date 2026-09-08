'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEPARTMENTS,
  FACULTY,
  COURSES,
  STUDENTS,
  TRANSACTIONS,
  EXAMS,
  ANNOUNCEMENTS,
  RECENT_ACTIVITIES,
  getPersistentData,
  savePersistentData
} from '../lib/seedData';

const DbContext = createContext(null);

export function DbProvider({ children }) {
  // Synchronous initial state hydration: 0ms delay, instant UI render
  const [students, setStudents] = useState(() => getPersistentData('students', STUDENTS));
  const [faculty, setFaculty] = useState(() => getPersistentData('faculty', FACULTY));
  const [courses, setCourses] = useState(() => getPersistentData('courses', COURSES));
  const [departments, setDepartments] = useState(() => getPersistentData('departments', DEPARTMENTS));
  const [transactions, setTransactions] = useState(() => getPersistentData('transactions', TRANSACTIONS));
  const [exams, setExams] = useState(() => getPersistentData('exams', EXAMS));
  const [announcements, setAnnouncements] = useState(() => getPersistentData('announcements', ANNOUNCEMENTS));
  const [activities, setActivities] = useState(() => RECENT_ACTIVITIES);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fast background revalidation (SWR pattern)
  const refreshFromSource = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check window.UniversityDB if present
    const db = window.UniversityDB;
    if (db) {
      if (typeof db.getStudents === 'function') setStudents(db.getStudents());
      if (typeof db.getFaculty === 'function') setFaculty(db.getFaculty());
      if (typeof db.getCourses === 'function') setCourses(db.getCourses());
      if (typeof db.getDepartments === 'function') setDepartments(db.getDepartments());
      if (typeof db.getTransactions === 'function') setTransactions(db.getTransactions());
      if (typeof db.getExams === 'function') setExams(db.getExams());
      if (typeof db.getAnnouncements === 'function') setAnnouncements(db.getAnnouncements());
      if (typeof db.getActivities === 'function') setActivities(db.getActivities());
    }

    // Fast non-blocking background fetch from API sync with 2s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    fetch('/api/db/sync', { signal: controller.signal })
      .then(res => res.json())
      .then(res => {
        clearTimeout(timeoutId);
        if (res && res.success && res.data && Array.isArray(res.data.kv_store)) {
          res.data.kv_store.forEach(item => {
            try {
              if (item.key && item.value) {
                const val = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                if (item.key === 'students' && Array.isArray(val)) setStudents(val);
                if (item.key === 'faculty' && Array.isArray(val)) setFaculty(val);
                if (item.key === 'courses' && Array.isArray(val)) setCourses(val);
                if (item.key === 'departments' && Array.isArray(val)) setDepartments(val);
                if (item.key === 'transactions' && Array.isArray(val)) setTransactions(val);
                if (item.key === 'exams' && Array.isArray(val)) setExams(val);
                if (item.key === 'announcements' && Array.isArray(val)) setAnnouncements(val);
                savePersistentData(item.key, val);
              }
            } catch (e) {}
          });
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
      });
  }, []);

  useEffect(() => {
    refreshFromSource();

    // Listen to tab and internal storage events for instant sync
    const handleStorage = (e) => {
      if (e.key && e.key.startsWith('campusx_db_')) {
        const field = e.key.replace('campusx_db_', '');
        try {
          const parsed = JSON.parse(e.newValue);
          if (field === 'students') setStudents(parsed);
          if (field === 'faculty') setFaculty(parsed);
          if (field === 'courses') setCourses(parsed);
          if (field === 'departments') setDepartments(parsed);
          if (field === 'transactions') setTransactions(parsed);
          if (field === 'exams') setExams(parsed);
          if (field === 'announcements') setAnnouncements(parsed);
        } catch (err) {}
      }
    };

    const handleCustomSync = (e) => {
      if (e.detail) {
        const { key, data } = e.detail;
        if (key === 'students') setStudents(data);
        if (key === 'faculty') setFaculty(data);
        if (key === 'courses') setCourses(data);
        if (key === 'departments') setDepartments(data);
        if (key === 'transactions') setTransactions(data);
        if (key === 'exams') setExams(data);
        if (key === 'announcements') setAnnouncements(data);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('campusx_db_sync_event', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('campusx_db_sync_event', handleCustomSync);
    };
  }, [refreshFromSource]);

  // Non-blocking sync dispatcher to server API
  const asyncApiSync = (key, data) => {
    if (typeof fetch !== 'undefined') {
      fetch('/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      }).catch(() => {});
    }
  };

  // Optimistic Student Modifiers
  const addStudent = (stu) => {
    setStudents(prev => {
      const next = [...prev, stu];
      savePersistentData('students', next);
      asyncApiSync('students', next);
      if (typeof window !== 'undefined' && window.UniversityDB?.addStudent) {
        window.UniversityDB.addStudent(stu);
      }
      return next;
    });
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updatedData } : s);
      savePersistentData('students', next);
      asyncApiSync('students', next);
      if (typeof window !== 'undefined' && window.UniversityDB?.updateStudent) {
        window.UniversityDB.updateStudent(id, updatedData);
      }
      return next;
    });
  };

  const deleteStudent = (id) => {
    setStudents(prev => {
      const next = prev.filter(s => s.id !== id);
      savePersistentData('students', next);
      asyncApiSync('students', next);
      if (typeof window !== 'undefined' && window.UniversityDB?.deleteStudent) {
        window.UniversityDB.deleteStudent(id);
      }
      return next;
    });
  };

  // Optimistic Transaction Modifiers
  const addTransaction = (tx) => {
    setTransactions(prev => {
      const next = [tx, ...prev];
      savePersistentData('transactions', next);
      asyncApiSync('transactions', next);
      if (typeof window !== 'undefined' && window.UniversityDB?.addTransaction) {
        window.UniversityDB.addTransaction(tx);
      }
      return next;
    });
  };

  // Optimistic Announcement Modifiers
  const addAnnouncement = (ann) => {
    setAnnouncements(prev => {
      const next = [ann, ...prev];
      savePersistentData('announcements', next);
      asyncApiSync('announcements', next);
      if (typeof window !== 'undefined' && window.UniversityDB?.addAnnouncement) {
        window.UniversityDB.addAnnouncement(ann);
      }
      return next;
    });
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => {
      const next = prev.filter(a => a.id !== id);
      savePersistentData('announcements', next);
      asyncApiSync('announcements', next);
      return next;
    });
  };

  // Optimistic Faculty Modifiers
  const addFaculty = (fac) => {
    setFaculty(prev => {
      const next = [...prev, fac];
      savePersistentData('faculty', next);
      asyncApiSync('faculty', next);
      if (typeof window !== 'undefined' && window.UniversityDB?.addFaculty) {
        window.UniversityDB.addFaculty(fac);
      }
      return next;
    });
  };

  const updateFaculty = (id, updatedData) => {
    setFaculty(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updatedData } : f);
      savePersistentData('faculty', next);
      asyncApiSync('faculty', next);
      if (typeof window !== 'undefined' && window.UniversityDB?.updateFaculty) {
        window.UniversityDB.updateFaculty(id, updatedData);
      }
      return next;
    });
  };

  const deleteFaculty = (id) => {
    setFaculty(prev => {
      const next = prev.filter(f => f.id !== id);
      savePersistentData('faculty', next);
      asyncApiSync('faculty', next);
      return next;
    });
  };

  // Optimistic Course Modifiers
  const addCourse = (crs) => {
    setCourses(prev => {
      const next = [...prev, crs];
      savePersistentData('courses', next);
      asyncApiSync('courses', next);
      if (typeof window !== 'undefined' && window.UniversityDB?.addCourse) {
        window.UniversityDB.addCourse(crs);
      }
      return next;
    });
  };

  const updateCourse = (code, updatedData) => {
    setCourses(prev => {
      const next = prev.map(c => c.code === code ? { ...c, ...updatedData } : c);
      savePersistentData('courses', next);
      asyncApiSync('courses', next);
      return next;
    });
  };

  const deleteCourse = (code) => {
    setCourses(prev => {
      const next = prev.filter(c => c.code !== code);
      savePersistentData('courses', next);
      asyncApiSync('courses', next);
      return next;
    });
  };

  // Optimistic Exam Modifiers
  const addExam = (ex) => {
    setExams(prev => {
      const next = [...prev, ex];
      savePersistentData('exams', next);
      asyncApiSync('exams', next);
      return next;
    });
  };

  const updateExam = (code, updatedData) => {
    setExams(prev => {
      const next = prev.map(e => e.code === code ? { ...e, ...updatedData } : e);
      savePersistentData('exams', next);
      asyncApiSync('exams', next);
      return next;
    });
  };

  const deleteExam = (code) => {
    setExams(prev => {
      const next = prev.filter(e => e.code !== code);
      savePersistentData('exams', next);
      asyncApiSync('exams', next);
      return next;
    });
  };

  // Optimistic Department Modifiers
  const addDepartment = (dept) => {
    setDepartments(prev => {
      const next = [...prev, dept];
      savePersistentData('departments', next);
      asyncApiSync('departments', next);
      return next;
    });
  };

  const updateDepartment = (code, updatedData) => {
    setDepartments(prev => {
      const next = prev.map(d => d.code === code ? { ...d, ...updatedData } : d);
      savePersistentData('departments', next);
      asyncApiSync('departments', next);
      return next;
    });
  };

  const deleteDepartment = (code) => {
    setDepartments(prev => {
      const next = prev.filter(d => d.code !== code);
      savePersistentData('departments', next);
      asyncApiSync('departments', next);
      return next;
    });
  };

  const addActivity = (act) => {
    setActivities(prev => [act, ...prev]);
  };

  return (
    <DbContext.Provider value={{
      students,
      faculty,
      courses,
      transactions,
      exams,
      announcements,
      activities,
      departments,
      isSyncing,
      refreshData: refreshFromSource,
      addStudent,
      updateStudent,
      deleteStudent,
      addTransaction,
      addAnnouncement,
      deleteAnnouncement,
      addFaculty,
      updateFaculty,
      deleteFaculty,
      addCourse,
      updateCourse,
      deleteCourse,
      addExam,
      updateExam,
      deleteExam,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addActivity
    }}>
      {children}
    </DbContext.Provider>
  );
}

export function useDb() {
  const context = useContext(DbContext);
  if (!context) {
    // Return instant static fallback if called outside provider
    return {
      students: STUDENTS,
      faculty: FACULTY,
      courses: COURSES,
      departments: DEPARTMENTS,
      transactions: TRANSACTIONS,
      exams: EXAMS,
      announcements: ANNOUNCEMENTS,
      activities: RECENT_ACTIVITIES,
      isSyncing: false,
      refreshData: () => {},
      addStudent: () => {},
      updateStudent: () => {},
      deleteStudent: () => {},
      addTransaction: () => {},
      addAnnouncement: () => {},
      deleteAnnouncement: () => {},
      addFaculty: () => {},
      updateFaculty: () => {},
      deleteFaculty: () => {},
      addCourse: () => {},
      updateCourse: () => {},
      deleteCourse: () => {},
      addExam: () => {},
      updateExam: () => {},
      deleteExam: () => {},
      addDepartment: () => {},
      updateDepartment: () => {},
      deleteDepartment: () => {},
      addActivity: () => {}
    };
  }
  return context;
}
