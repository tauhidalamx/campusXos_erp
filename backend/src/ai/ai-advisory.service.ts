import { Injectable } from '@nestjs/common';

@Injectable()
export class AiAdvisoryService {

  /**
   * Generates assignment questions based on subject syllabus and level
   */
  async generateAssignmentQuestions(courseCode: string, topics: string[], level: string): Promise<string[]> {
    console.log(`[AI] Generating questions for ${courseCode} topic list: ${topics.join(', ')} (${level})`);
    
    // Simulate AI LLM Response
    return [
      `Design an optimized execution model for ${topics[0] || 'advanced data graphs'} explaining memory layouts.`,
      `Analyze performance bottlenecks of multi-threaded architectures operating under ${topics[1] || 'distributed locks'}.`,
      `Evaluate zero-knowledge proof protocols under custom polynomial bounds.`
    ];
  }

  /**
   * Generates grading rubric table parameters
   */
  async generateRubrics(criteriaName: string): Promise<Array<{ level: string; points: number; description: string }>> {
    return [
      { level: 'Exceptional', points: 4, description: 'Shows profound conceptual understanding with zero architectural errors.' },
      { level: 'Proficient', points: 3, description: 'Complete implementation with minor optimization drawbacks.' },
      { level: 'Basic', points: 2, description: 'Core requirements met but lacks proper unit test coverage.' },
      { level: 'Needs Improvement', points: 1, description: 'Uncompilable code structures or major gaps.' }
    ];
  }

  /**
   * AI assisted evaluator checking submission files
   */
  async evaluateSubmission(submissionContent: string, criteria: string): Promise<{ score: number; feedback: string }> {
    const wordCount = submissionContent.split(/\s+/).length;
    let score = 75;
    let feedback = "Paper structure is well outlined, but requires deeper proof formulas.";

    if (wordCount > 500) {
      score = 92;
      feedback = "Excellent analysis detailing performance graphs, rubrics criteria fulfilled.";
    } else if (wordCount < 100) {
      score = 45;
      feedback = "Insufficient content length. Gaps in background research.";
    }

    return { score, feedback };
  }

  /**
   * Predicts final course grade based on student progress statistics
   */
  predictGradeOutcome(cgpa: number, attendancePercent: number, midTermScore: number): { predictedGrade: string; riskLevel: string } {
    const scoreSum = (cgpa / 4) * 30 + (attendancePercent / 100) * 30 + (midTermScore / 100) * 40;
    
    let predictedGrade = 'F';
    let riskLevel = 'CRITICAL_RISK';

    if (scoreSum >= 90) {
      predictedGrade = 'A+';
      riskLevel = 'LOW';
    } else if (scoreSum >= 80) {
      predictedGrade = 'A';
      riskLevel = 'LOW';
    } else if (scoreSum >= 70) {
      predictedGrade = 'B';
      riskLevel = 'MEDIUM';
    } else if (scoreSum >= 50) {
      predictedGrade = 'C';
      riskLevel = 'HIGH';
    }

    // Attendance safeguard
    if (attendancePercent < 70) {
      predictedGrade = 'F';
      riskLevel = 'HIGH_ATTENDANCE_WARN';
    }

    return { predictedGrade, riskLevel };
  }
}
