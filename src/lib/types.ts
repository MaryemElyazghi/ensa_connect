export type UserRole = 'student' | 'tutor' | 'admin';

export interface BaseUser {
  id: string; // Corresponds to MongoDB _id
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  // password field should not be here, it's for backend only
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
  experience: string; 
  availability: string; 
  bio?: string;
}

export interface TutorUser extends BaseUser, TutorProfileData {
  role: 'tutor';
}

export type User = StudentUser | TutorUser | BaseUser; 

export interface TutoringRequest {
  id: string; // Corresponds to MongoDB _id
  studentId: string; // Store as string, can be ObjectId in DB
  studentName: string;
  subject: string;
  level: string; 
  description: string; 
  studentAvailability: string; 
  status: 'pending' | 'matched' | 'active' | 'completed' | 'cancelled';
  tutorId?: string; // Store as string, can be ObjectId in DB
  tutorName?: string;
  scheduledTime?: string; 
  createdAt: string; 
  updatedAt?: string;
  // Consider adding student and tutor objects if populated
  student?: StudentUser;
  tutor?: TutorUser;
}

export interface SessionFeedback {
  id: string; // Corresponds to MongoDB _id
  requestId: string; 
  studentId: string;
  tutorId: string;
  rating: number; 
  studentComments?: string;
  tutorComments?: string; 
  topicsCovered: string;
  sessionDate: string; 
  durationMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
}
