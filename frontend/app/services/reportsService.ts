import { api } from './apiClient';
import type { StudentReportResponse, StudentTokenListResponse } from './types';

export interface StudentListItem {
  student_id: string;
}

export interface StudentListResponse {
  students: StudentListItem[];
}

export const reportsService = {
  getByToken(token: string): Promise<StudentReportResponse> {
    return api.get<StudentReportResponse>(`/api/v1/reports/${token}`, { auth: false });
  },

  listTokens(examId: string): Promise<StudentTokenListResponse> {
    return api.get<StudentTokenListResponse>(`/api/v1/exams/${examId}/reports/tokens`);
  },

  /** List all students who have computed results for an exam (instructor, no tokens needed) */
  listStudents(examId: string): Promise<StudentListResponse> {
    return api.get<StudentListResponse>(`/api/v1/exams/${examId}/students`);
  },

  /** Fetch a student report directly by student ID (instructor, no token needed) */
  getByStudentId(examId: string, studentId: string): Promise<StudentReportResponse> {
    return api.get<StudentReportResponse>(`/api/v1/exams/${examId}/students/${studentId}/report`);
  },
};
