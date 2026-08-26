import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaEventsService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'campusx-erp-platform',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('✓ Connected to CampusX Kafka Event Bus.');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  // --- Academic Event Publishers ---
  async emitAdmissionEvent(studentId: string, name: string, department: string) {
    await this.emit('admissions-topic', 'ADMISSION_REGISTERED', { studentId, name, department });
  }

  async emitAssignmentPublishedEvent(assignmentId: string, courseCode: string, title: string) {
    await this.emit('assignments-topic', 'ASSIGNMENT_PUBLISHED', { assignmentId, courseCode, title });
  }

  async emitSubmissionSubmittedEvent(studentId: string, assignmentId: string, ipfsHash: string) {
    await this.emit('assignments-topic', 'ASSIGNMENT_SUBMITTED', { studentId, assignmentId, ipfsHash });
  }

  async emitMarksEnteredEvent(studentId: string, courseCode: string, score: number) {
    await this.emit('grading-topic', 'MARKS_RECORDED', { studentId, courseCode, score });
  }

  async emitGradeLockedEvent(studentId: string, semester: number, cgpa: number) {
    await this.emit('grading-topic', 'GRADE_LOCKED', { studentId, semester, cgpa });
  }

  async emitExamScheduledEvent(examId: string, courseCode: string, examDate: Date) {
    await this.emit('exams-topic', 'EXAM_SCHEDULED', { examId, courseCode, examDate });
  }

  async emitHallAllocatedEvent(examId: string, studentId: string, hall: string, seat: string) {
    await this.emit('exams-topic', 'SEATING_ALLOCATED', { examId, studentId, hall, seat });
  }

  async emitDegreeIssuedEvent(studentId: string, degreeName: string, certHash: string) {
    await this.emit('credentials-topic', 'DEGREE_ISSUED', { studentId, degreeName, certHash });
  }

  async emitRegistrationSubmittedEvent(studentId: string, semester: string, academicYear: string) {
    await this.emit('registration-topic', 'REGISTRATION_SUBMITTED', { studentId, semester, academicYear });
  }

  async emitFeeClearanceIssuedEvent(studentId: string, invoiceId: string, amount: number) {
    await this.emit('finance-topic', 'FEE_CLEARANCE_ISSUED', { studentId, invoiceId, amount });
  }

  async emitTimetableGeneratedEvent(session: string, timetableHash: string) {
    await this.emit('timetables-topic', 'TIMETABLE_GENERATED', { session, timetableHash });
  }

  // Generic publisher
  private async emit(topic: string, eventType: string, payload: any) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: eventType,
            value: JSON.stringify({
              type: eventType,
              timestamp: new Date().toISOString(),
              data: payload,
            }),
          },
        ],
      });
    } catch (error) {
      console.error(`Failed to publish event to Kafka [Topic: ${topic}]:`, error);
    }
  }
}
