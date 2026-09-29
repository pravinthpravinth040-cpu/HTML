import {
  CareerPath,
  RoadmapPhase,
  Module,
  Topic,
  StudyMaterial,
  Quiz,
  Project,
  AITool,
  Achievement,
  StudentProfile,
  SkillProgress,
  StudySession,
  NotificationItem,
  Roadmap,
  Task
} from '../types';

/**
 * CRITICAL REQUIREMENT ENFORCEMENT:
 * The platform starts completely EMPTY.
 * No demo careers, no demo roadmaps, no demo study materials, no fake users.
 * All records are created dynamically by Admin through the UI or fetched from Supabase.
 */

export const initialCareers: CareerPath[] = [];
export const initialRoadmaps: Roadmap[] = [];
export const initialPhases: RoadmapPhase[] = [];
export const initialModules: Module[] = [];
export const initialTopics: Topic[] = [];
export const initialMaterials: StudyMaterial[] = [];
export const initialTasks: Task[] = [];
export const initialQuizzes: Quiz[] = [];
export const initialProjects: Project[] = [];
export const initialAITools: AITool[] = [];
export const initialAchievements: Achievement[] = [];
export const initialStudents: StudentProfile[] = [];
export const initialSkills: SkillProgress[] = [];
export const initialStudySessions: StudySession[] = [];
export const initialNotifications: NotificationItem[] = [];
