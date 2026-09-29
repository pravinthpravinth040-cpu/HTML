export type UserRole = 'student' | 'admin';

export interface StudentProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  college?: string;
  degree?: string;
  department?: string;
  yearOfStudy?: string;
  semester?: string;
  graduationYear?: string;
  careerGoal?: string;
  targetCareerId?: string;
  selectedRoadmapId?: string;
  dailyAvailableHours?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface CareerPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconName: string;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  requiredSkills: string[];
  colorGradient?: string;
  status: ContentStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Roadmap {
  id: string;
  careerPathId: string;
  title: string;
  shortDescription?: string;
  description: string;
  coverImageUrl?: string;
  difficulty?: string;
  estimatedDuration?: string;
  learningObjectives?: string[];
  skillsCovered?: string[];
  prerequisites?: string[];
  version?: string;
  status: ContentStatus;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapPhase {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  phaseImageUrl?: string;
  skillsCovered?: string[];
  prerequisites?: string[];
  learningObjectives: string[];
  estimatedDuration: string;
  sortOrder: number;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface Module {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  courseImageUrl?: string;
  estimatedDuration: string;
  difficulty: string;
  learningObjectives: string[];
  sortOrder: number;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface Topic {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  difficulty: string;
  estimatedLearningTimeMinutes: number;
  learningObjectives: string[];
  prerequisites: string[];
  sortOrder: number;
  status: 'draft' | 'published';
  createdAt: string;
}

export type MaterialType =
  | 'Video'
  | 'PDF'
  | 'Article'
  | 'Documentation'
  | 'Website'
  | 'GitHub Repository'
  | 'Course'
  | 'Notes'
  | 'Assignment';

export interface StudyMaterial {
  id: string;
  topicId?: string;
  careerPathId?: string;
  title: string;
  description: string;
  materialType: MaterialType;
  url: string;
  filePath?: string;
  durationMinutes: number;
  difficulty: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface Task {
  id: string;
  topicId?: string;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  difficulty: string;
  deadline?: string;
  sortOrder: number;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface TaskProgress {
  id: string;
  userId: string;
  taskId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  notes?: string;
  completedAt?: string;
  createdAt: string;
}

export interface MaterialProgress {
  id: string;
  userId: string;
  materialId: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  topicId?: string;
  topicName?: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  mode: '25_min' | '50_min' | 'custom';
  date: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  sortOrder: number;
  createdAt: string;
}

export interface Quiz {
  id: string;
  topicId?: string;
  title: string;
  description: string;
  difficulty: string;
  passingScore: number;
  status: 'draft' | 'published';
  questions?: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: Record<string, number>;
  completedAt: string;
  createdAt: string;
}

export type ProjectStatus = 'not_started' | 'planning' | 'development' | 'testing' | 'completed';

export interface Project {
  id: string;
  careerPathId?: string;
  name: string;
  description: string;
  difficulty: string;
  requiredSkills: string[];
  technologies: string[];
  estimatedDuration: string;
  requirements: string[];
  resources: { title: string; url: string }[];
  deadline?: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface ProjectProgress {
  id: string;
  userId: string;
  projectId: string;
  status: ProjectStatus;
  githubUrl?: string;
  liveDemoUrl?: string;
  notes?: string;
  screenshots?: string[];
  completedAt?: string;
  updatedAt: string;
}

export interface SkillProgress {
  id: string;
  userId: string;
  skillName: string;
  proficiencyLevel: number; // 1-5
  verified: boolean;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badgeColor: string;
  criteriaType: 'streak' | 'study_hours' | 'topics_completed' | 'projects_completed' | 'quizzes_passed';
  criteriaValue: number;
  createdAt: string;
}

export interface StudentAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement?: Achievement;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
  read: boolean;
  createdAt: string;
}

export interface AITool {
  id: string;
  toolName: string;
  description: string;
  category: string;
  url: string;
  pricing: 'Free' | 'Paid' | 'Freemium';
  useCase: string;
  skillLevel: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface AIConversationMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  message: string;
  context?: Record<string, any>;
  createdAt: string;
}

export interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  careerPaths: number;
  roadmaps: number;
  studyMaterials: number;
  quizzes: number;
  projects: number;
  completedTasks: number;
  totalStudyHours: number;
}
