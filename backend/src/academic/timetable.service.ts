import { Injectable } from '@nestjs/common';

export interface ScheduleSlot {
  courseCode: string;
  dayOfWeek: string; // e.g. "Monday", "Wednesday"
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  room: string;
}

@Injectable()
export class TimetableService {

  private databaseSlots: ScheduleSlot[] = [
    { courseCode: 'CS101', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30', room: 'LH-101' },
    { courseCode: 'CS101', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'LH-101' },
    { courseCode: 'CS202', dayOfWeek: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'LH-102' },
    { courseCode: 'CS202', dayOfWeek: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'LH-102' },
    { courseCode: 'CS302', dayOfWeek: 'Monday', startTime: '11:00', endTime: '12:30', room: 'LH-203' },
    { courseCode: 'CS302', dayOfWeek: 'Wednesday', startTime: '11:00', endTime: '12:30', room: 'LH-203' }
  ];

  // Fetch timetable slots for chosen courses
  getTimetableForCourses(courseCodes: string[]): ScheduleSlot[] {
    return this.databaseSlots.filter(slot => courseCodes.includes(slot.courseCode));
  }

  // Detect time overlap conflicts between selected courses
  detectScheduleConflict(courseCodes: string[]): { hasConflict: boolean; message?: string } {
    const slots = this.getTimetableForCourses(courseCodes);
    
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const slotA = slots[i];
        const slotB = slots[j];
        
        if (slotA.dayOfWeek === slotB.dayOfWeek) {
          // simple overlap comparison assuming HH:MM format
          if (
            (slotA.startTime >= slotB.startTime && slotA.startTime < slotB.endTime) ||
            (slotB.startTime >= slotA.startTime && slotB.startTime < slotA.endTime)
          ) {
            return {
              hasConflict: true,
              message: `Timetable conflict detected between ${slotA.courseCode} and ${slotB.courseCode} on ${slotA.dayOfWeek} at ${slotA.startTime}-${slotA.endTime}`
            };
          }
        }
      }
    }

    return { hasConflict: false };
  }
}
