
import { User, UserRole } from "./auth";

export interface School {
  id: string;
  name: string;
  address: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: "active" | "trial" | "expired";
  trialEndsAt?: string;
  studentsCount: number;
  teachersCount: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  keyStages: string[];
}

export interface LearningContent {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  keyStage: string;
  contentType: "video" | "text" | "quiz" | "activity";
  contentUrl?: string;
  thumbnailUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  contentId: string;
  progress: number;
  score?: number;
  completedAt?: string;
  attempts: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subjectId: string;
  teacherId: string;
  classId?: string;
  studentIds: string[];
  contentIds: string[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: string;
}

export interface Statistic {
  label: string;
  value: number | string;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

export interface DataContextType {
  schools: School[];
  subjects: Subject[];
  learningContent: LearningContent[];
  assignments: Assignment[];
  badges: Badge[];
  userBadges: UserBadge[];
  studentProgress: StudentProgress[];
  users: User[];
  fetchSchools: () => Promise<School[]>;
  fetchUsers: (role?: UserRole) => Promise<User[]>;
  fetchSubjects: () => Promise<Subject[]>;
  fetchLearningContent: (subjectId?: string) => Promise<LearningContent[]>;
  fetchAssignments: (userId: string) => Promise<Assignment[]>;
  fetchBadges: () => Promise<Badge[]>;
  fetchUserBadges: (userId: string) => Promise<UserBadge[]>;
  fetchStudentProgress: (studentId: string) => Promise<StudentProgress[]>;
}
