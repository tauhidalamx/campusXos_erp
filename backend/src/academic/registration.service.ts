import { Injectable } from '@nestjs/common';

export interface ClearanceStatus {
  hasBacklogs: boolean;
  hasDisciplinaryHolds: boolean;
  libraryCleared: boolean;
  hostelCleared: boolean;
  transportCleared: boolean;
  previousSemGpa: number;
}

@Injectable()
export class RegistrationService {

  // Query student profile checks
  async getClearanceStatus(studentId: string): Promise<ClearanceStatus> {
    // Return typical academic validation payload
    return {
      hasBacklogs: studentId === 'STU003', // KBIR has backlog
      hasDisciplinaryHolds: false,
      libraryCleared: true,
      hostelCleared: true,
      transportCleared: true,
      previousSemGpa: 3.78
    };
  }

  // Verify course prereq constraints
  async verifyCourseEligibility(studentId: string, courseCode: string): Promise<{ eligible: boolean; reason?: string }> {
    if (courseCode === 'CS401' && studentId === 'STU003') {
      return { eligible: false, reason: 'Requires CS202 prerequisite completed with at least B grade.' };
    }
    return { eligible: true };
  }

  // Credit limit validation (e.g. max 18 credits)
  validateCreditLimit(courseCredits: number[], limit: number = 18): boolean {
    const total = courseCredits.reduce((sum, c) => sum + c, 0);
    return total <= limit;
  }

  // Process approval tracker signatures
  async recordApprovalStep(
    studentId: string,
    session: string,
    step: string, // ADVISOR, HOD, DEAN, REGISTRAR
    approver: string,
    comments?: string
  ): Promise<{ success: boolean; txHash: string }> {
    const txHash = '0x_appr_' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    console.log(`[Approval Chain] Student: ${studentId} Session: ${session} Step: ${step} Approved by: ${approver} Comments: ${comments || 'None'}`);
    return { success: true, txHash };
  }
}
