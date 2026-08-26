import { Injectable } from '@nestjs/common';

export interface HallDetails {
  hallNumber: string;
  building: string;
  capacity: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  courses: string[];
}

export interface FacultyRecord {
  id: string;
  name: string;
  department: string;
  workload: number; // current allocated counts
}

@Injectable()
export class AllocationEngine {

  /**
   * Automatic seating planner allocating students of courses to halls without conflicts.
   */
  allocateHalls(
    courseCode: string,
    enrolledStudents: StudentRecord[],
    availableHalls: HallDetails[]
  ): Array<{ studentId: string; hallNumber: string; seatNumber: string; qrHash: string }> {
    const allocations: Array<{ studentId: string; hallNumber: string; seatNumber: string; qrHash: string }> = [];
    
    // Filter students enrolled in the target course
    const courseStudents = enrolledStudents.filter(student => 
      student.courses.includes(courseCode)
    );

    let studentIndex = 0;
    let hallIndex = 0;

    while (studentIndex < courseStudents.length && hallIndex < availableHalls.length) {
      const hall = availableHalls[hallIndex];
      let seatCount = 0;

      while (seatCount < hall.capacity && studentIndex < courseStudents.length) {
        const student = courseStudents[studentIndex];
        const seatNumber = `H-${hall.hallNumber}-S-${seatCount + 1}`;
        const qrHash = `0x_qr_${courseCode}_${student.id}_${hall.hallNumber}_${seatCount + 1}`;

        allocations.push({
          studentId: student.id,
          hallNumber: hall.hallNumber,
          seatNumber,
          qrHash
        });

        seatCount++;
        studentIndex++;
      }

      if (seatCount >= hall.capacity) {
        hallIndex++; // move to next hall if capacity is reached
      }
    }

    return allocations;
  }

  /**
   * Examiner and invigilator scheduling coordinator with subject expertise constraints.
   */
  allocateExaminers(
    courseCode: string,
    department: string,
    facultyList: FacultyRecord[]
  ): Array<{ facultyId: string; role: string }> {
    const assignments: Array<{ facultyId: string; role: string }> = [];

    // Filter faculty belonging to the same department as priority
    const deptFaculty = facultyList
      .filter(f => f.department === department)
      .sort((a, b) => a.workload - b.workload); // lowest workload first

    if (deptFaculty.length >= 1) {
      // Allocate Chief Superintendent
      assignments.push({
        facultyId: deptFaculty[0].id,
        role: 'CHIEF_SUPERINTENDENT'
      });
      deptFaculty[0].workload++;
    }

    if (deptFaculty.length >= 2) {
      // Allocate Invigilators
      assignments.push({
        facultyId: deptFaculty[1].id,
        role: 'INVIGILATOR'
      });
      deptFaculty[1].workload++;
    }

    // fallback check: allocate observer from a different department if needed
    const otherFaculty = facultyList
      .filter(f => f.department !== department)
      .sort((a, b) => a.workload - b.workload);

    if (otherFaculty.length >= 1) {
      assignments.push({
        facultyId: otherFaculty[0].id,
        role: 'EXTERNAL_OBSERVER'
      });
      otherFaculty[0].workload++;
    }

    return assignments;
  }
}
