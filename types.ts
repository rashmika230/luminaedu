
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type CourseStream = 'Physical Science' | 'Biological Science' | 'Commerce' | 'Arts' | 'Technology' | 'Professional';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  studentId: string;
  avatar: string;
  email?: string;
  status?: 'active' | 'suspended';
  joinedDate?: string;
  isAnnualPaid?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'reading' | 'quiz';
  contentUrl?: string;
  duration?: string;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface LiveSession {
  id: string;
  courseId: string;
  title: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  zoomId?: string;
  zoomPasscode?: string;
  instructor: string;
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  image: string;
  progress: number;
  nextSession: string;
  description?: string;
  category?: CourseStream;
  status?: 'published' | 'draft' | 'archived';
  enrolledCount?: number;
  modules?: Module[];
  price?: number; 
  isPurchased?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'alert' | 'info' | 'class';
  priority?: 'high' | 'normal';
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'missed';
}

export enum AppRoute {
  HOME = 'home',
  TIMETABLE = 'timetable',
  EVALUATION = 'evaluation',
  QA_BOARD = 'qa-board',
  STORE = 'store',
  SETTINGS = 'settings',
  ADMIN_COURSES = 'admin-courses',
  ADMIN_USERS = 'admin-users',
  ADMIN_REPORTS = 'admin-reports',
  CONTENT_MANAGER = 'content-manager',
  LIVE_SCHEDULER = 'live-scheduler'
}
