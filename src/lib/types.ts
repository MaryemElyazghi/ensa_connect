export type UserRole = 'student' | 'tutor' | 'admin';

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface StudentProfileData {
  program: string;
  level: string;
  difficultSubjects: string[];
}

export interface StudentUser extends BaseUser, StudentProfileData {
  role: 'student';
}

export interface TutorProfileData {
  teachableSubjects: string[];
  experience: string; // e.g., "2 ans d'expérience en mathématiques niveau lycée"
  availability: string; // Simple text for now, e.g. "Soirs de semaine, weekends"
  bio?: string;
}

export interface TutorUser extends BaseUser, TutorProfileData {
  role: 'tutor';
}

export type User = StudentUser | TutorUser | BaseUser; // BaseUser for admin or generic user

export interface TutoringRequest {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  level: string; // Student's current level for the subject
  description: string; // More details about help needed
  studentAvailability: string; // e.g., "Mardi et Jeudi après 17h"
  status: 'pending' | 'matched' | 'active' | 'completed' | 'cancelled';
  tutorId?: string;
  tutorName?: string;
  scheduledTime?: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface SessionFeedback {
  id: string;
  requestId: string; // Link to TutoringRequest
  studentId: string;
  tutorId: string;
  rating: number; // 1-5
  studentComments?: string;
  tutorComments?: string; // Tutor might also add notes
  topicsCovered: string;
  sessionDate: string; // ISO date string
  durationMinutes?: number;
}

export interface LearningMaterialSuggestion {
  studentMaterials: string[];
  tutorMaterials: string[];
  explanation: string;
}
