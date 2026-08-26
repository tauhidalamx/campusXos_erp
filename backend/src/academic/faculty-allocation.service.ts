import { Injectable } from '@nestjs/common';

export interface FacultyWorkload {
  facultyId: string;
  totalHours: number;
  limit: number;
}

export interface SectionDetails {
  sectionName: string;
  courseCode: string;
  classroom: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  theoryFacultyId: string;
  labFacultyId?: string;
}

@Injectable()
export class FacultyAllocationService {
  
  /**
   * Automatically calculate weekly hours allocated for a faculty member and verify limits
   */
  calculateWorkload(
    facultyId: string,
    allocations: Array<{ facultyId: string; assignedHours: number }>,
    weeklyLimit: number = 18
  ): FacultyWorkload {
    const totalHours = allocations
      .filter(a => a.facultyId === facultyId)
      .reduce((sum, item) => sum + item.assignedHours, 0);

    return {
      facultyId,
      totalHours,
      limit: weeklyLimit
    };
  }

  /**
   * Checks if an allocation request causes a weekly limit overload
   */
  isOverloaded(
    facultyId: string,
    allocations: Array<{ facultyId: string; assignedHours: number }>,
    extraHours: number,
    weeklyLimit: number = 18
  ): boolean {
    const current = this.calculateWorkload(facultyId, allocations, weeklyLimit);
    return (current.totalHours + extraHours) > weeklyLimit;
  }

  /**
   * Checks for room and faculty clashes in section schedules
   */
  detectClashes(
    newSection: SectionDetails,
    existingSections: SectionDetails[]
  ): { hasConflict: boolean; message?: string } {
    for (const sec of existingSections) {
      // Check day and time overlap
      if (sec.dayOfWeek === newSection.dayOfWeek) {
        const timeOverlap = 
          (newSection.startTime >= sec.startTime && newSection.startTime < sec.endTime) ||
          (sec.startTime >= newSection.startTime && sec.startTime < newSection.endTime);

        if (timeOverlap) {
          // Classroom clash check
          if (sec.classroom === newSection.classroom && newSection.classroom !== 'None') {
            return {
              hasConflict: true,
              message: `Classroom clash detected: Room ${newSection.classroom} is already booked on ${newSection.dayOfWeek} at ${sec.startTime}-${sec.endTime} by ${sec.courseCode} Section ${sec.sectionName}`
            };
          }

          // Faculty clash check
          if (
            sec.theoryFacultyId === newSection.theoryFacultyId ||
            (sec.labFacultyId && sec.labFacultyId === newSection.theoryFacultyId) ||
            (newSection.labFacultyId && sec.theoryFacultyId === newSection.labFacultyId)
          ) {
            return {
              hasConflict: true,
              message: `Faculty clash detected: Lecturer is already scheduled on ${newSection.dayOfWeek} at ${sec.startTime}-${sec.endTime} in ${sec.courseCode} Section ${sec.sectionName}`
            };
          }
        }
      }
    }
    return { hasConflict: false };
  }

  /**
   * Generates expert AI recommendation scores for courses
   */
  calculateAiRecommendation(
    facultyMember: { id: string; specialization: string; preferredSubjects: string[]; experience: number },
    courseCode: string
  ): { score: number; confidence: string; reason: string } {
    let score = 0.5;
    const reasons: string[] = [];

    // Preferred subjects matching
    if (facultyMember.preferredSubjects.includes(courseCode)) {
      score += 0.25;
      reasons.push('High preference matching');
    }

    // Specialization keyword matching
    const spec = (facultyMember.specialization || '').toLowerCase();
    const prefix = courseCode.substring(0, 2).toLowerCase();
    if (spec.includes(prefix) || spec.includes('computer') && prefix === 'cs') {
      score += 0.15;
      reasons.push('Specialization matches course domain');
    }

    // Experience matching
    if (facultyMember.experience >= 10) {
      score += 0.1;
      reasons.push('High domain lecturing experience');
    }

    const finalScore = Math.min(1.0, Math.max(0.1, score));
    return {
      score: parseFloat(finalScore.toFixed(2)),
      confidence: finalScore > 0.8 ? 'HIGH' : (finalScore > 0.6 ? 'MEDIUM' : 'LOW'),
      reason: reasons.length > 0 ? reasons.join(', ') : 'Eligible faculty candidate'
    };
  }
}
