import { Controller, Post, Body } from '@nestjs/common';
import { FacultyAllocationService, SectionDetails, SectionDetails as NewSection } from './faculty-allocation.service';

@Controller('api/academic/allocation')
export class FacultyAllocationController {
  constructor(private readonly allocationService: FacultyAllocationService) {}

  @Post('validate')
  async validateWorkload(
    @Body() body: { facultyId: string; allocations: Array<{ facultyId: string; assignedHours: number }>; extraHours: number; limit?: number }
  ) {
    const isOverloaded = this.allocationService.isOverloaded(
      body.facultyId,
      body.allocations,
      body.extraHours,
      body.limit || 18
    );
    const details = this.allocationService.calculateWorkload(
      body.facultyId,
      body.allocations,
      body.limit || 18
    );
    return { success: true, isOverloaded, details };
  }

  @Post('clash-detect')
  async detectClashes(
    @Body() body: { newSection: SectionDetails; existingSections: SectionDetails[] }
  ) {
    const check = this.allocationService.detectClashes(body.newSection, body.existingSections);
    return { success: true, hasConflict: check.hasConflict, message: check.message };
  }

  @Post('ai-recommend')
  async getAiRecommendations(
    @Body() body: { faculty: { id: string; specialization: string; preferredSubjects: string[]; experience: number }; courseCode: string }
  ) {
    const rec = this.allocationService.calculateAiRecommendation(body.faculty, body.courseCode);
    return { success: true, recommendation: rec };
  }
}
