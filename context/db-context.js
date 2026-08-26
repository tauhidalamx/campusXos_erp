'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const DbContext = createContext(null);

export function DbProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [exams, setExams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDbData = () => {
      const db = window.UniversityDB;
      if (db) {
        setStudents([...(db.getStudents?.() || [])]);
        setFaculty([...(db.getFaculty?.() || [])]);
        setCourses([...(db.getCourses?.() || [])]);
        setTransactions([...(db.getTransactions?.() || [])]);
        setExams([...(db.getExams?.() || [])]);
        setAnnouncements([...(db.getAnnouncements?.() || [])]);
        setActivities([...(db.getActivities?.() || [])]);
        setDepartments([...(db.getDepartments?.() || [])]);
        return true;
      }
      return false;
    };

    if (typeof window !== 'undefined') {
      if (!loadDbData()) {
        const interval = setInterval(() => {
          if (loadDbData()) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
  }, []);

  const addStudent = (stu) => {
    setStudents(prev => {
      const next = [...prev, stu];
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.addStudent(stu);
      }
      return next;
    });
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updatedData } : s);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.updateStudent(id, updatedData);
      }
      return next;
    });
  };

  const deleteStudent = (id) => {
    setStudents(prev => {
      const next = prev.filter(s => s.id !== id);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.deleteStudent(id);
      }
      return next;
    });
  };

  const addTransaction = (tx) => {
    setTransactions(prev => {
      const next = [tx, ...prev];
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.addTransaction(tx);
      }
      return next;
    });
  };

  const addAnnouncement = (ann) => {
    setAnnouncements(prev => {
      const next = [ann, ...prev];
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.addAnnouncement(ann);
      }
      return next;
    });
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => {
      const next = prev.filter(a => a.id !== id);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        const list = window.UniversityDB.getAnnouncements();
        const idx = list.findIndex(ann => ann.id === id);
        if (idx !== -1) {
          list.splice(idx, 1);
        }
      }
      return next;
    });
  };

  const addFaculty = (fac) => {
    setFaculty(prev => {
      const next = [...prev, fac];
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.addFaculty(fac);
      }
      return next;
    });
  };

  const updateFaculty = (id, updatedData) => {
    setFaculty(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updatedData } : f);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.updateFaculty(id, updatedData);
      }
      return next;
    });
  };

  const deleteFaculty = (id) => {
    setFaculty(prev => {
      const next = prev.filter(f => f.id !== id);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.deleteFaculty(id);
      }
      return next;
    });
  };

  const addCourse = (crs) => {
    setCourses(prev => {
      const next = [...prev, crs];
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.addCourse(crs);
      }
      return next;
    });
  };

  const updateCourse = (code, updatedData) => {
    setCourses(prev => {
      const next = prev.map(c => c.code === code ? { ...c, ...updatedData } : c);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.updateCourse(code, updatedData);
      }
      return next;
    });
  };

  const deleteCourse = (code) => {
    setCourses(prev => {
      const next = prev.filter(c => c.code !== code);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.deleteCourse(code);
      }
      return next;
    });
  };

  const addExam = (ex) => {
    setExams(prev => {
      const next = [...prev, ex];
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.addExam(ex);
      }
      return next;
    });
  };

  const updateExam = (code, updatedData) => {
    setExams(prev => {
      const next = prev.map(e => e.code === code ? { ...e, ...updatedData } : e);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.updateExam(code, updatedData);
      }
      return next;
    });
  };

  const deleteExam = (code) => {
    setExams(prev => {
      const next = prev.filter(e => e.code !== code);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.deleteExam(code);
      }
      return next;
    });
  };

  const addDepartment = (dept) => {
    setDepartments(prev => {
      const next = [...prev, dept];
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.addDepartment(dept);
      }
      return next;
    });
  };

  const updateDepartment = (code, updatedData) => {
    setDepartments(prev => {
      const next = prev.map(d => d.code === code ? { ...d, ...updatedData } : d);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.updateDepartment(code, updatedData);
      }
      return next;
    });
  };

  const deleteDepartment = (code) => {
    setDepartments(prev => {
      const next = prev.filter(d => d.code !== code);
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.deleteDepartment(code);
      }
      return next;
    });
  };

  const addActivity = (act) => {
    setActivities(prev => {
      const next = [act, ...prev];
      if (typeof window !== 'undefined' && window.UniversityDB) {
        window.UniversityDB.addActivity(act);
      }
      return next;
    });
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
      addStudent,
      updateStudent,
      deleteStudent,
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
      addTransaction,
      addAnnouncement,
      deleteAnnouncement,
      addActivity
    }}>
      {children}
    </DbContext.Provider>
  );
}

export function useDb() {
  return useContext(DbContext);
}
