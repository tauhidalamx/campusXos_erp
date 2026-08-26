import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { FeeService } from './fee.service';
import { TimetableService } from './timetable.service';

@Controller('api/academic')
export class AcademicController {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly feeService: FeeService,
    private readonly timetableService: TimetableService
  ) {}

  @Get('clearance')
  async getStudentClearance(@Query('studentId') studentId: string) {
    return this.registrationService.getClearanceStatus(studentId);
  }

  @Post('fee-assessment')
  async assessFees(@Body() body: { studentId: string; courseCount: number; hasHostel: boolean; hasTransport: boolean }) {
    return this.feeService.calculateFees(body.studentId, body.courseCount, body.hasHostel, body.hasTransport);
  }

  @Post('register')
  async registerSemester(@Body() body: { studentId: string; courseCodes: string[]; semester: string; academicYear: string }) {
    const conflict = this.timetableService.detectScheduleConflict(body.courseCodes);
    if (conflict.hasConflict) {
      return { success: false, error: conflict.message };
    }
    
    // Simulate anchoring to SQLite and returning status
    return {
      success: true,
      message: 'Semester registration processed successfully.',
      status: 'PENDING_APPROVAL',
      creditCount: body.courseCodes.length * 3
    };
  }

  @Post('approve')
  async signApproval(@Body() body: { studentId: string; session: string; step: string; approver: string; comments?: string }) {
    return this.registrationService.recordApprovalStep(body.studentId, body.session, body.step, body.approver, body.comments);
  }
}
