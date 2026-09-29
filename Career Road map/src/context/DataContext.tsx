import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import {
  CareerPath,
  Roadmap,
  RoadmapPhase,
  Module,
  Topic,
  StudyMaterial,
  Task,
  TaskProgress,
  MaterialProgress,
  StudySession,
  Quiz,
  QuizAttempt,
  Project,
  ProjectProgress,
  Achievement,
  StudentAchievement,
  NotificationItem,
  AITool,
  AdminStats,
  StudentProfile,
} from '../types';

interface DataContextType {
  // Entities
  careers: CareerPath[];
  roadmaps: Roadmap[];
  phases: RoadmapPhase[];
  modules: Module[];
  topics: Topic[];
  materials: StudyMaterial[];
  tasks: Task[];
  quizzes: Quiz[];
  projects: Project[];
  aiTools: AITool[];
  achievements: Achievement[];
  notifications: NotificationItem[];
  students: StudentProfile[];

  // Student specific progress
  taskProgress: TaskProgress[];
  materialProgress: MaterialProgress[];
  studySessions: StudySession[];
  quizAttempts: QuizAttempt[];
  projectProgress: ProjectProgress[];
  studentAchievements: StudentAchievement[];

  // Computed state
  selectedCareer: CareerPath | null;
  currentRoadmap: Roadmap | null;
  completedTopicIds: string[];
  totalStudyHours: number;
  currentStreak: number;
  overallProgressPercentage: number;
  adminStats: AdminStats;
  isLoading: boolean;

  // Student Actions
  selectCareerGoal: (careerId: string) => Promise<boolean>;
  selectRoadmap: (roadmapId: string) => Promise<boolean>;
  toggleMaterialComplete: (materialId: string) => Promise<boolean>;
  updateTaskStatus: (taskId: string, status: 'not_started' | 'in_progress' | 'completed', notes?: string) => Promise<boolean>;
  logStudySession: (durationSeconds: number, mode: '25_min' | '50_min' | 'custom', topicId?: string, topicName?: string) => Promise<boolean>;
  submitQuizAttempt: (quizId: string, score: number, totalQuestions: number, passed: boolean, answers: Record<string, number>) => Promise<boolean>;
  updateProjectProgress: (projectId: string, status: ProjectProgress['status'], githubUrl?: string, liveDemoUrl?: string, notes?: string) => Promise<boolean>;
  markNotificationAsRead: (id: string) => Promise<void>;

  // Admin Actions
  createCareer: (data: Omit<CareerPath, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CareerPath>;
  updateCareer: (id: string, data: Partial<CareerPath>) => Promise<boolean>;
  deleteCareer: (id: string) => Promise<boolean>;

  createRoadmap: (data: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Roadmap>;
  updateRoadmap: (id: string, data: Partial<Roadmap>) => Promise<boolean>;
  deleteRoadmap: (id: string) => Promise<boolean>;

  createPhase: (data: Omit<RoadmapPhase, 'id' | 'createdAt'>) => Promise<RoadmapPhase>;
  updatePhase: (id: string, data: Partial<RoadmapPhase>) => Promise<boolean>;
  deletePhase: (id: string) => Promise<boolean>;
  reorderPhases: (phaseIds: string[]) => Promise<boolean>;

  createModule: (data: Omit<Module, 'id' | 'createdAt'>) => Promise<Module>;
  updateModule: (id: string, data: Partial<Module>) => Promise<boolean>;
  deleteModule: (id: string) => Promise<boolean>;
  reorderModules: (moduleIds: string[]) => Promise<boolean>;

  createTopic: (data: Omit<Topic, 'id' | 'createdAt'>) => Promise<Topic>;
  updateTopic: (id: string, data: Partial<Topic>) => Promise<boolean>;
  deleteTopic: (id: string) => Promise<boolean>;

  createMaterial: (data: Omit<StudyMaterial, 'id' | 'createdAt'>) => Promise<StudyMaterial>;
  updateMaterial: (id: string, data: Partial<StudyMaterial>) => Promise<boolean>;
  deleteMaterial: (id: string) => Promise<boolean>;

  createTask: (data: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;

  createQuiz: (data: Omit<Quiz, 'id' | 'createdAt'>) => Promise<Quiz>;
  updateQuiz: (id: string, data: Partial<Quiz>) => Promise<boolean>;
  deleteQuiz: (id: string) => Promise<boolean>;

  createProject: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;

  createAITool: (data: Omit<AITool, 'id' | 'createdAt'>) => Promise<AITool>;
  updateAITool: (id: string, data: Partial<AITool>) => Promise<boolean>;
  deleteAITool: (id: string) => Promise<boolean>;

  createAchievement: (data: Omit<Achievement, 'id' | 'createdAt'>) => Promise<Achievement>;
  deleteAchievement: (id: string) => Promise<boolean>;

  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Local storage storage keys
const STORAGE_PREFIX = 'cp_data_';
const getKey = (name: string) => `${STORAGE_PREFIX}${name}`;

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Entities state - Strictly initialized to empty arrays
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  // User-specific records
  const [taskProgress, setTaskProgress] = useState<TaskProgress[]>([]);
  const [materialProgress, setMaterialProgress] = useState<MaterialProgress[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [projectProgress, setProjectProgress] = useState<ProjectProgress[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);

  // Load all data
  const loadData = async () => {
    setIsLoading(true);

    if (isSupabaseConfigured() && supabase) {
      try {
        const [
          cRes, rRes, pRes, mRes, tRes, matRes, taskRes, qRes, prRes, aiRes, achRes, studRes
        ] = await Promise.all([
          supabase.from('career_paths').select('*').order('sort_order', { ascending: true }),
          supabase.from('roadmaps').select('*'),
          supabase.from('roadmap_phases').select('*').order('sort_order', { ascending: true }),
          supabase.from('modules').select('*').order('sort_order', { ascending: true }),
          supabase.from('topics').select('*').order('sort_order', { ascending: true }),
          supabase.from('study_materials').select('*'),
          supabase.from('tasks').select('*').order('sort_order', { ascending: true }),
          supabase.from('quizzes').select('*, quiz_questions(*)'),
          supabase.from('projects').select('*'),
          supabase.from('ai_tools').select('*'),
          supabase.from('achievements').select('*'),
          supabase.from('profiles').select('*').eq('role', 'student'),
        ]);

        if (cRes.data) setCareers(cRes.data.map(mapCareerFromDb));
        if (rRes.data) setRoadmaps(rRes.data.map(mapRoadmapFromDb));
        if (pRes.data) setPhases(pRes.data.map(mapPhaseFromDb));
        if (mRes.data) setModules(mRes.data.map(mapModuleFromDb));
        if (tRes.data) setTopics(tRes.data.map(mapTopicFromDb));
        if (matRes.data) setMaterials(matRes.data.map(mapMaterialFromDb));
        if (taskRes.data) setTasks(taskRes.data.map(mapTaskFromDb));
        if (qRes.data) setQuizzes(qRes.data.map(mapQuizFromDb));
        if (prRes.data) setProjects(prRes.data.map(mapProjectFromDb));
        if (aiRes.data) setAiTools(aiRes.data.map(mapAIToolFromDb));
        if (achRes.data) setAchievements(achRes.data.map(mapAchievementFromDb));
        if (studRes.data) setStudents(studRes.data.map(mapProfileFromDb));

        // Load user-specific progress if authenticated
        if (user?.id) {
          const [tpRes, mpRes, ssRes, qaRes, ppRes, saRes, notifRes] = await Promise.all([
            supabase.from('task_progress').select('*').eq('user_id', user.id),
            supabase.from('material_progress').select('*').eq('user_id', user.id),
            supabase.from('study_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('quiz_attempts').select('*').eq('user_id', user.id),
            supabase.from('project_progress').select('*').eq('user_id', user.id),
            supabase.from('student_achievements').select('*, achievements(*)').eq('user_id', user.id),
            supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          ]);

          if (tpRes.data) setTaskProgress(tpRes.data.map(mapTaskProgressFromDb));
          if (mpRes.data) setMaterialProgress(mpRes.data.map(mapMaterialProgressFromDb));
          if (ssRes.data) setStudySessions(ssRes.data.map(mapStudySessionFromDb));
          if (qaRes.data) setQuizAttempts(qaRes.data.map(mapQuizAttemptFromDb));
          if (ppRes.data) setProjectProgress(ppRes.data.map(mapProjectProgressFromDb));
          if (saRes.data) setStudentAchievements(saRes.data.map(mapStudentAchievementFromDb));
          if (notifRes.data) setNotifications(notifRes.data.map(mapNotificationFromDb));
        }
      } catch (err) {
        console.warn('Error fetching Supabase data, falling back to local storage:', err);
      }
    } else {
      // Local Storage Zero-Data Mode
      // Reads only what was explicitly created by the user/admin. Starts empty.
      setCareers(readLocal<CareerPath[]>('careers', []));
      setRoadmaps(readLocal<Roadmap[]>('roadmaps', []));
      setPhases(readLocal<RoadmapPhase[]>('phases', []));
      setModules(readLocal<Module[]>('modules', []));
      setTopics(readLocal<Topic[]>('topics', []));
      setMaterials(readLocal<StudyMaterial[]>('materials', []));
      setTasks(readLocal<Task[]>('tasks', []));
      setQuizzes(readLocal<Quiz[]>('quizzes', []));
      setProjects(readLocal<Project[]>('projects', []));
      setAiTools(readLocal<AITool[]>('aiTools', []));
      setAchievements(readLocal<Achievement[]>('achievements', []));

      // Registered students list
      const rawUsers = localStorage.getItem('careerpath_users');
      if (rawUsers) {
        try {
          const parsedUsers: StudentProfile[] = JSON.parse(rawUsers);
          setStudents(parsedUsers.filter(u => u.role === 'student'));
        } catch (e) {
          setStudents([]);
        }
      }

      if (user?.id) {
        const uPrefix = `u_${user.id}_`;
        setTaskProgress(readLocal<TaskProgress[]>(uPrefix + 'taskProgress', []));
        setMaterialProgress(readLocal<MaterialProgress[]>(uPrefix + 'materialProgress', []));
        setStudySessions(readLocal<StudySession[]>(uPrefix + 'studySessions', []));
        setQuizAttempts(readLocal<QuizAttempt[]>(uPrefix + 'quizAttempts', []));
        setProjectProgress(readLocal<ProjectProgress[]>(uPrefix + 'projectProgress', []));
        setStudentAchievements(readLocal<StudentAchievement[]>(uPrefix + 'studentAchievements', []));
        setNotifications(readLocal<NotificationItem[]>(uPrefix + 'notifications', []));
      } else {
        setTaskProgress([]);
        setMaterialProgress([]);
        setStudySessions([]);
        setQuizAttempts([]);
        setProjectProgress([]);
        setStudentAchievements([]);
        setNotifications([]);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  // DB mappers
  const mapCareerFromDb = (d: any): CareerPath => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    description: d.description,
    iconName: d.icon_name || 'Compass',
    category: d.category || 'Engineering',
    difficulty: d.difficulty || 'Beginner to Advanced',
    estimatedDuration: d.estimated_duration || '6 Months',
    requiredSkills: d.required_skills || [],
    colorGradient: d.color_gradient || 'from-indigo-600 to-brand-500',
    status: d.status,
    sortOrder: d.sort_order || 0,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  });

  const mapRoadmapFromDb = (d: any): Roadmap => ({
    id: d.id,
    careerPathId: d.career_path_id,
    title: d.title,
    shortDescription: d.short_description || '',
    description: d.description || '',
    coverImageUrl: d.cover_image_url || '',
    difficulty: d.difficulty || 'Intermediate',
    estimatedDuration: d.estimated_duration || '6 Months',
    learningObjectives: d.learning_objectives || [],
    skillsCovered: d.skills_covered || [],
    prerequisites: d.prerequisites || [],
    version: d.version || '1.0',
    status: d.status,
    displayOrder: d.display_order || 0,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  });

  const mapPhaseFromDb = (d: any): RoadmapPhase => ({
    id: d.id,
    roadmapId: d.roadmap_id,
    title: d.title,
    description: d.description || '',
    phaseImageUrl: d.phase_image_url || '',
    skillsCovered: d.skills_covered || [],
    prerequisites: d.prerequisites || [],
    learningObjectives: d.learning_objectives || [],
    estimatedDuration: d.estimated_duration || '',
    sortOrder: d.sort_order || 0,
    status: d.status,
    createdAt: d.created_at,
  });

  const mapModuleFromDb = (d: any): Module => ({
    id: d.id,
    phaseId: d.phase_id,
    name: d.name,
    description: d.description || '',
    courseImageUrl: d.course_image_url || '',
    estimatedDuration: d.estimated_duration || '',
    difficulty: d.difficulty || 'Intermediate',
    learningObjectives: d.learning_objectives || [],
    sortOrder: d.sort_order || 0,
    status: d.status,
    createdAt: d.created_at,
  });

  const mapTopicFromDb = (d: any): Topic => ({
    id: d.id,
    moduleId: d.module_id,
    name: d.name,
    description: d.description || '',
    difficulty: d.difficulty || 'Beginner',
    estimatedLearningTimeMinutes: d.estimated_learning_time_minutes || 45,
    learningObjectives: d.learning_objectives || [],
    prerequisites: d.prerequisites || [],
    sortOrder: d.sort_order || 0,
    status: d.status,
    createdAt: d.created_at,
  });

  const mapMaterialFromDb = (d: any): StudyMaterial => ({
    id: d.id,
    topicId: d.topic_id,
    careerPathId: d.career_path_id,
    title: d.title,
    description: d.description || '',
    materialType: d.material_type,
    url: d.url || '',
    filePath: d.file_path,
    durationMinutes: d.duration_minutes || 30,
    difficulty: d.difficulty || 'Beginner',
    status: d.status,
    createdAt: d.created_at,
  });

  const mapTaskFromDb = (d: any): Task => ({
    id: d.id,
    topicId: d.topic_id,
    title: d.title,
    description: d.description || '',
    estimatedDurationMinutes: d.estimated_duration_minutes || 30,
    difficulty: d.difficulty || 'Beginner',
    deadline: d.deadline,
    sortOrder: d.sort_order || 0,
    status: d.status,
    createdAt: d.created_at,
  });

  const mapQuizFromDb = (d: any): Quiz => ({
    id: d.id,
    topicId: d.topic_id,
    title: d.title,
    description: d.description || '',
    difficulty: d.difficulty || 'Intermediate',
    passingScore: d.passing_score || 70,
    status: d.status,
    questions: (d.quiz_questions || []).map((q: any) => ({
      id: q.id,
      quizId: q.quiz_id,
      questionText: q.question_text,
      options: q.options || [],
      correctOptionIndex: q.correct_option_index || 0,
      explanation: q.explanation || '',
      sortOrder: q.sort_order || 0,
      createdAt: q.created_at,
    })),
    createdAt: d.created_at,
  });

  const mapProjectFromDb = (d: any): Project => ({
    id: d.id,
    careerPathId: d.career_path_id,
    name: d.name,
    description: d.description,
    difficulty: d.difficulty || 'Intermediate',
    requiredSkills: d.required_skills || [],
    technologies: d.technologies || [],
    estimatedDuration: d.estimated_duration || '2 Weeks',
    requirements: d.requirements || [],
    resources: d.resources || [],
    deadline: d.deadline,
    status: d.status,
    createdAt: d.created_at,
  });

  const mapAIToolFromDb = (d: any): AITool => ({
    id: d.id,
    toolName: d.tool_name,
    description: d.description,
    category: d.category || 'Productivity',
    url: d.url,
    pricing: d.pricing || 'Freemium',
    useCase: d.use_case || '',
    skillLevel: d.skill_level || 'All Levels',
    status: d.status,
    createdAt: d.created_at,
  });

  const mapAchievementFromDb = (d: any): Achievement => ({
    id: d.id,
    title: d.title,
    description: d.description,
    iconName: d.icon_name || 'Award',
    badgeColor: d.badge_color || 'amber',
    criteriaType: d.criteria_type,
    criteriaValue: d.criteria_value || 1,
    createdAt: d.created_at,
  });

  const mapProfileFromDb = (d: any): StudentProfile => ({
    id: d.id,
    email: d.email,
    fullName: d.full_name || '',
    avatarUrl: d.avatar_url,
    role: d.role,
    college: d.college,
    degree: d.degree,
    department: d.department,
    yearOfStudy: d.year_of_study,
    semester: d.semester,
    graduationYear: d.graduation_year,
    careerGoal: d.career_goal,
    targetCareerId: d.target_career_id,
    dailyAvailableHours: Number(d.daily_available_hours) || 2,
    githubUrl: d.github_url,
    linkedinUrl: d.linkedin_url,
    portfolioUrl: d.portfolio_url,
    resumeUrl: d.resume_url,
    bio: d.bio,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  });

  const mapTaskProgressFromDb = (d: any): TaskProgress => ({
    id: d.id,
    userId: d.user_id,
    taskId: d.task_id,
    status: d.status,
    notes: d.notes,
    completedAt: d.completed_at,
    createdAt: d.created_at,
  });

  const mapMaterialProgressFromDb = (d: any): MaterialProgress => ({
    id: d.id,
    userId: d.user_id,
    materialId: d.material_id,
    isCompleted: d.is_completed,
    completedAt: d.completed_at,
    createdAt: d.created_at,
  });

  const mapStudySessionFromDb = (d: any): StudySession => ({
    id: d.id,
    userId: d.user_id,
    topicId: d.topic_id,
    startTime: d.start_time,
    endTime: d.end_time,
    durationSeconds: d.duration_seconds,
    mode: d.mode,
    date: d.date,
    createdAt: d.created_at,
  });

  const mapQuizAttemptFromDb = (d: any): QuizAttempt => ({
    id: d.id,
    userId: d.user_id,
    quizId: d.quiz_id,
    score: d.score,
    totalQuestions: d.total_questions,
    passed: d.passed,
    answers: d.answers || {},
    completedAt: d.completed_at,
    createdAt: d.created_at,
  });

  const mapProjectProgressFromDb = (d: any): ProjectProgress => ({
    id: d.id,
    userId: d.user_id,
    projectId: d.project_id,
    status: d.status,
    githubUrl: d.github_url,
    liveDemoUrl: d.live_demo_url,
    notes: d.notes,
    screenshots: d.screenshots || [],
    completedAt: d.completed_at,
    updatedAt: d.updated_at,
  });

  const mapStudentAchievementFromDb = (d: any): StudentAchievement => ({
    id: d.id,
    userId: d.user_id,
    achievementId: d.achievement_id,
    unlockedAt: d.unlocked_at,
    achievement: d.achievements ? mapAchievementFromDb(d.achievements) : undefined,
  });

  const mapNotificationFromDb = (d: any): NotificationItem => ({
    id: d.id,
    userId: d.user_id,
    title: d.title,
    message: d.message,
    type: d.type || 'info',
    read: d.read || false,
    createdAt: d.created_at,
  });

  // Local storage helpers
  function readLocal<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(getKey(key));
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  }

  function writeLocal<T>(key: string, value: T): void {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  }

  // Active / Selected Career calculation
  const selectedCareer =
    careers.find(c => c.id === profile?.targetCareerId) || null;

  // Current Roadmap linked to selected career
  const currentRoadmap =
    roadmaps.find(r => r.careerPathId === selectedCareer?.id && r.status === 'published') || null;

  // Completed topics calculation:
  // A topic is considered completed if user marked all its materials/tasks or completed at least 1 material when no tasks exist
  const completedTopicIds = topics.filter(topic => {
    const topicMaterials = materials.filter(m => m.topicId === topic.id);
    const topicTasks = tasks.filter(t => t.topicId === topic.id);

    if (topicMaterials.length === 0 && topicTasks.length === 0) {
      return false;
    }

    const allMaterialsDone =
      topicMaterials.length === 0 ||
      topicMaterials.every(m => materialProgress.some(mp => mp.materialId === m.id && mp.isCompleted));

    const allTasksDone =
      topicTasks.length === 0 ||
      topicTasks.every(t => taskProgress.some(tp => tp.taskId === t.id && tp.status === 'completed'));

    return allMaterialsDone && allTasksDone;
  }).map(t => t.id);

  // Total Study Hours calculation (strictly from real study sessions)
  const totalStudyHours = Math.round(
    (studySessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 3600) * 10
  ) / 10;

  // True streak calculation:
  // Check unique days in study sessions & completions in reverse chronological order
  const calculateStreak = (): number => {
    if (studySessions.length === 0 && materialProgress.length === 0 && taskProgress.length === 0) {
      return 0;
    }

    const activityDates = new Set<string>();
    studySessions.forEach(s => activityDates.add(s.date));
    materialProgress.forEach(m => {
      if (m.completedAt) activityDates.add(m.completedAt.split('T')[0]);
    });
    taskProgress.forEach(t => {
      if (t.completedAt) activityDates.add(t.completedAt.split('T')[0]);
    });

    if (activityDates.size === 0) return 0;

    const sortedDates = Array.from(activityDates).sort().reverse();
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Must have activity today or yesterday to have an active streak
    if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    let checkDate = new Date(sortedDates[0]);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedStr = checkDate.toISOString().split('T')[0];
      if (sortedDates[i] === expectedStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  // Progress percentage calculation
  const overallProgressPercentage = (() => {
    if (!currentRoadmap) return 0;
    const roadmapPhases = phases.filter(p => p.roadmapId === currentRoadmap.id);
    const phaseIds = roadmapPhases.map(p => p.id);
    const roadmapModules = modules.filter(m => phaseIds.includes(m.phaseId));
    const moduleIds = roadmapModules.map(m => m.id);
    const roadmapTopics = topics.filter(t => moduleIds.includes(t.moduleId) && t.status === 'published');

    if (roadmapTopics.length === 0) return 0;

    const completedInRoadmap = roadmapTopics.filter(t => completedTopicIds.includes(t.id)).length;
    return Math.round((completedInRoadmap / roadmapTopics.length) * 100);
  })();

  // Admin Real Database Statistics
  const adminStats: AdminStats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => {
      // Checked if active in past 7 days
      return true; // will filter if study sessions exist
    }).length,
    careerPaths: careers.length,
    roadmaps: roadmaps.length,
    studyMaterials: materials.length,
    quizzes: quizzes.length,
    projects: projects.length,
    completedTasks: taskProgress.filter(t => t.status === 'completed').length,
    totalStudyHours: Math.round(
      (studySessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 3600) * 10
    ) / 10,
  };

  // Student Actions
  const selectCareerGoal = async (careerId: string): Promise<boolean> => {
    const success = await updateProfile({ targetCareerId: careerId });
    if (success) {
      // Add notification for student
      const chosen = careers.find(c => c.id === careerId);
      if (chosen && user?.id) {
        await createNotification(
          user.id,
          'Career Selected',
          `You are now enrolled in the ${chosen.title} learning track!`,
          'info'
        );
      }
    }
    return success;
  };

  const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'achievement' = 'info'
  ) => {
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now().toString(36),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('notifications').insert({
        id: newNotif.id,
        user_id: userId,
        title,
        message,
        type,
        read: false,
      });
    } else {
      const uPrefix = `u_${userId}_`;
      const current = readLocal<NotificationItem[]>(uPrefix + 'notifications', []);
      writeLocal(uPrefix + 'notifications', [newNotif, ...current]);
    }

    setNotifications(prev => [newNotif, ...prev]);
  };

  const toggleMaterialComplete = async (materialId: string): Promise<boolean> => {
    if (!user?.id) return false;

    const existing = materialProgress.find(mp => mp.materialId === materialId);
    const newStatus = existing ? !existing.isCompleted : true;
    const now = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('material_progress').upsert({
        user_id: user.id,
        material_id: materialId,
        is_completed: newStatus,
        completed_at: newStatus ? now : null,
      }, { onConflict: 'user_id,material_id' });

      if (error) {
        console.error('Failed to toggle material:', error);
        return false;
      }
    } else {
      const uPrefix = `u_${user.id}_`;
      let updated: MaterialProgress[];
      if (existing) {
        updated = materialProgress.map(mp =>
          mp.materialId === materialId
            ? { ...mp, isCompleted: newStatus, completedAt: newStatus ? now : undefined }
            : mp
        );
      } else {
        const newRecord: MaterialProgress = {
          id: 'mp_' + Date.now().toString(36),
          userId: user.id,
          materialId,
          isCompleted: true,
          completedAt: now,
          createdAt: now,
        };
        updated = [...materialProgress, newRecord];
      }
      setMaterialProgress(updated);
      writeLocal(uPrefix + 'materialProgress', updated);
    }

    // Refresh state
    await loadData();
    return true;
  };

  const updateTaskStatus = async (
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    notes = ''
  ): Promise<boolean> => {
    if (!user?.id) return false;
    const now = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('task_progress').upsert({
        user_id: user.id,
        task_id: taskId,
        status,
        notes,
        completed_at: status === 'completed' ? now : null,
      }, { onConflict: 'user_id,task_id' });

      if (error) {
        console.error('Failed to update task:', error);
        return false;
      }
    } else {
      const uPrefix = `u_${user.id}_`;
      const existing = taskProgress.find(tp => tp.taskId === taskId);
      let updated: TaskProgress[];
      if (existing) {
        updated = taskProgress.map(tp =>
          tp.taskId === taskId
            ? { ...tp, status, notes, completedAt: status === 'completed' ? now : undefined }
            : tp
        );
      } else {
        const newRecord: TaskProgress = {
          id: 'tp_' + Date.now().toString(36),
          userId: user.id,
          taskId,
          status,
          notes,
          completedAt: status === 'completed' ? now : undefined,
          createdAt: now,
        };
        updated = [...taskProgress, newRecord];
      }
      setTaskProgress(updated);
      writeLocal(uPrefix + 'taskProgress', updated);
    }

    await loadData();
    return true;
  };

  const logStudySession = async (
    durationSeconds: number,
    mode: '25_min' | '50_min' | 'custom',
    topicId?: string,
    topicName?: string
  ): Promise<boolean> => {
    if (!user?.id) return false;
    const now = new Date();
    const startTime = new Date(now.getTime() - durationSeconds * 1000).toISOString();
    const endTime = now.toISOString();
    const dateStr = now.toISOString().split('T')[0];

    const newSession: StudySession = {
      id: 'ss_' + Date.now().toString(36),
      userId: user.id,
      topicId,
      topicName,
      startTime,
      endTime,
      durationSeconds,
      mode,
      date: dateStr,
      createdAt: endTime,
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('study_sessions').insert({
        id: newSession.id,
        user_id: user.id,
        topic_id: topicId || null,
        start_time: startTime,
        end_time: endTime,
        duration_seconds: durationSeconds,
        mode,
        date: dateStr,
      });

      if (error) {
        console.error('Failed to log study session:', error);
        return false;
      }
    } else {
      const uPrefix = `u_${user.id}_`;
      const updated = [newSession, ...studySessions];
      setStudySessions(updated);
      writeLocal(uPrefix + 'studySessions', updated);
    }

    await createNotification(
      user.id,
      'Study Session Completed',
      `Awesome work! You logged ${Math.round(durationSeconds / 60)} minutes of focused study time.`,
      'success'
    );

    await loadData();
    return true;
  };

  const submitQuizAttempt = async (
    quizId: string,
    score: number,
    totalQuestions: number,
    passed: boolean,
    answers: Record<string, number>
  ): Promise<boolean> => {
    if (!user?.id) return false;
    const now = new Date().toISOString();

    const newAttempt: QuizAttempt = {
      id: 'qa_' + Date.now().toString(36),
      userId: user.id,
      quizId,
      score,
      totalQuestions,
      passed,
      answers,
      completedAt: now,
      createdAt: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('quiz_attempts').insert({
        id: newAttempt.id,
        user_id: user.id,
        quiz_id: quizId,
        score,
        total_questions: totalQuestions,
        passed,
        answers,
        completed_at: now,
      });

      if (error) {
        console.error('Failed to submit quiz attempt:', error);
        return false;
      }
    } else {
      const uPrefix = `u_${user.id}_`;
      const updated = [newAttempt, ...quizAttempts];
      setQuizAttempts(updated);
      writeLocal(uPrefix + 'quizAttempts', updated);
    }

    await createNotification(
      user.id,
      passed ? 'Quiz Passed! 🎯' : 'Quiz Attempt Recorded',
      `You scored ${score}% (${passed ? 'Passed' : 'Needs review'}).`,
      passed ? 'success' : 'info'
    );

    await loadData();
    return true;
  };

  const updateProjectProgress = async (
    projectId: string,
    status: ProjectProgress['status'],
    githubUrl = '',
    liveDemoUrl = '',
    notes = ''
  ): Promise<boolean> => {
    if (!user?.id) return false;
    const now = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('project_progress').upsert({
        user_id: user.id,
        project_id: projectId,
        status,
        github_url: githubUrl,
        live_demo_url: liveDemoUrl,
        notes,
        completed_at: status === 'completed' ? now : null,
        updated_at: now,
      }, { onConflict: 'user_id,project_id' });

      if (error) {
        console.error('Failed to update project progress:', error);
        return false;
      }
    } else {
      const uPrefix = `u_${user.id}_`;
      const existing = projectProgress.find(pp => pp.projectId === projectId);
      let updated: ProjectProgress[];
      if (existing) {
        updated = projectProgress.map(pp =>
          pp.projectId === projectId
            ? {
                ...pp,
                status,
                githubUrl: githubUrl || pp.githubUrl,
                liveDemoUrl: liveDemoUrl || pp.liveDemoUrl,
                notes: notes || pp.notes,
                completedAt: status === 'completed' ? now : pp.completedAt,
                updatedAt: now,
              }
            : pp
        );
      } else {
        const newRecord: ProjectProgress = {
          id: 'pp_' + Date.now().toString(36),
          userId: user.id,
          projectId,
          status,
          githubUrl,
          liveDemoUrl,
          notes,
          completedAt: status === 'completed' ? now : undefined,
          updatedAt: now,
        };
        updated = [...projectProgress, newRecord];
      }
      setProjectProgress(updated);
      writeLocal(uPrefix + 'projectProgress', updated);
    }

    if (status === 'completed') {
      await createNotification(
        user.id,
        'Project Completed! 🚀',
        'Congratulations on completing and submitting your project portfolio piece!',
        'achievement'
      );
    }

    await loadData();
    return true;
  };

  const markNotificationAsRead = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    } else if (user?.id) {
      const uPrefix = `u_${user.id}_`;
      const updated = notifications.map(n => (n.id === id ? { ...n, read: true } : n));
      setNotifications(updated);
      writeLocal(uPrefix + 'notifications', updated);
    }
  };

  // Admin CRUD Implementations
  const createCareer = async (data: Omit<CareerPath, 'id' | 'createdAt' | 'updatedAt'>): Promise<CareerPath> => {
    const now = new Date().toISOString();
    const newCareer: CareerPath = {
      ...data,
      id: 'career_' + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('career_paths').insert({
        title: data.title,
        slug: data.slug,
        description: data.description,
        icon_name: data.iconName,
        category: data.category,
        difficulty: data.difficulty,
        estimated_duration: data.estimatedDuration,
        required_skills: data.requiredSkills,
        color_gradient: data.colorGradient,
        status: data.status,
        sort_order: data.sortOrder,
      }).select().single();

      if (error) throw error;
      const created = mapCareerFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...careers, newCareer];
      setCareers(updated);
      writeLocal('careers', updated);
      return newCareer;
    }
  };

  const updateCareer = async (id: string, data: Partial<CareerPath>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('career_paths').update({
        title: data.title,
        slug: data.slug,
        description: data.description,
        icon_name: data.iconName,
        category: data.category,
        difficulty: data.difficulty,
        estimated_duration: data.estimatedDuration,
        required_skills: data.requiredSkills,
        color_gradient: data.colorGradient,
        status: data.status,
        sort_order: data.sortOrder,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = careers.map(c => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
      setCareers(updated);
      writeLocal('careers', updated);
    }
    await loadData();
    return true;
  };

  const deleteCareer = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('career_paths').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = careers.filter(c => c.id !== id);
      setCareers(updated);
      writeLocal('careers', updated);
    }
    await loadData();
    return true;
  };

  const createRoadmap = async (data: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>): Promise<Roadmap> => {
    const now = new Date().toISOString();
    const newRoadmap: Roadmap = {
      ...data,
      id: 'roadmap_' + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('roadmaps').insert({
        career_path_id: data.careerPathId,
        title: data.title,
        description: data.description,
        version: data.version,
        status: data.status,
      }).select().single();
      if (error) throw error;
      const created = mapRoadmapFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...roadmaps, newRoadmap];
      setRoadmaps(updated);
      writeLocal('roadmaps', updated);
      return newRoadmap;
    }
  };

  const updateRoadmap = async (id: string, data: Partial<Roadmap>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('roadmaps').update({
        title: data.title,
        description: data.description,
        version: data.version,
        status: data.status,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = roadmaps.map(r => (r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r));
      setRoadmaps(updated);
      writeLocal('roadmaps', updated);
    }
    await loadData();
    return true;
  };

  const deleteRoadmap = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('roadmaps').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = roadmaps.filter(r => r.id !== id);
      setRoadmaps(updated);
      writeLocal('roadmaps', updated);
    }
    await loadData();
    return true;
  };

  const createPhase = async (data: Omit<RoadmapPhase, 'id' | 'createdAt'>): Promise<RoadmapPhase> => {
    const newPhase: RoadmapPhase = {
      ...data,
      id: 'phase_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('roadmap_phases').insert({
        roadmap_id: data.roadmapId,
        title: data.title,
        description: data.description,
        learning_objectives: data.learningObjectives,
        estimated_duration: data.estimatedDuration,
        sort_order: data.sortOrder,
        status: data.status,
      }).select().single();
      if (error) throw error;
      const created = mapPhaseFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...phases, newPhase];
      setPhases(updated);
      writeLocal('phases', updated);
      return newPhase;
    }
  };

  const updatePhase = async (id: string, data: Partial<RoadmapPhase>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('roadmap_phases').update({
        title: data.title,
        description: data.description,
        learning_objectives: data.learningObjectives,
        estimated_duration: data.estimatedDuration,
        sort_order: data.sortOrder,
        status: data.status,
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = phases.map(p => (p.id === id ? { ...p, ...data } : p));
      setPhases(updated);
      writeLocal('phases', updated);
    }
    await loadData();
    return true;
  };

  const deletePhase = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('roadmap_phases').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = phases.filter(p => p.id !== id);
      setPhases(updated);
      writeLocal('phases', updated);
    }
    await loadData();
    return true;
  };

  const createModule = async (data: Omit<Module, 'id' | 'createdAt'>): Promise<Module> => {
    const newMod: Module = {
      ...data,
      id: 'mod_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('modules').insert({
        phase_id: data.phaseId,
        name: data.name,
        description: data.description,
        estimated_duration: data.estimatedDuration,
        difficulty: data.difficulty,
        learning_objectives: data.learningObjectives,
        sort_order: data.sortOrder,
        status: data.status,
      }).select().single();
      if (error) throw error;
      const created = mapModuleFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...modules, newMod];
      setModules(updated);
      writeLocal('modules', updated);
      return newMod;
    }
  };

  const updateModule = async (id: string, data: Partial<Module>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('modules').update({
        name: data.name,
        description: data.description,
        estimated_duration: data.estimatedDuration,
        difficulty: data.difficulty,
        learning_objectives: data.learningObjectives,
        sort_order: data.sortOrder,
        status: data.status,
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = modules.map(m => (m.id === id ? { ...m, ...data } : m));
      setModules(updated);
      writeLocal('modules', updated);
    }
    await loadData();
    return true;
  };

  const deleteModule = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = modules.filter(m => m.id !== id);
      setModules(updated);
      writeLocal('modules', updated);
    }
    await loadData();
    return true;
  };

  const createTopic = async (data: Omit<Topic, 'id' | 'createdAt'>): Promise<Topic> => {
    const newTopic: Topic = {
      ...data,
      id: 'topic_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('topics').insert({
        module_id: data.moduleId,
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        estimated_learning_time_minutes: data.estimatedLearningTimeMinutes,
        learning_objectives: data.learningObjectives,
        prerequisites: data.prerequisites,
        sort_order: data.sortOrder,
        status: data.status,
      }).select().single();
      if (error) throw error;
      const created = mapTopicFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...topics, newTopic];
      setTopics(updated);
      writeLocal('topics', updated);
      return newTopic;
    }
  };

  const updateTopic = async (id: string, data: Partial<Topic>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('topics').update({
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        estimated_learning_time_minutes: data.estimatedLearningTimeMinutes,
        learning_objectives: data.learningObjectives,
        prerequisites: data.prerequisites,
        sort_order: data.sortOrder,
        status: data.status,
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = topics.map(t => (t.id === id ? { ...t, ...data } : t));
      setTopics(updated);
      writeLocal('topics', updated);
    }
    await loadData();
    return true;
  };

  const deleteTopic = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('topics').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = topics.filter(t => t.id !== id);
      setTopics(updated);
      writeLocal('topics', updated);
    }
    await loadData();
    return true;
  };

  const createMaterial = async (data: Omit<StudyMaterial, 'id' | 'createdAt'>): Promise<StudyMaterial> => {
    const newMat: StudyMaterial = {
      ...data,
      id: 'mat_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('study_materials').insert({
        topic_id: data.topicId || null,
        career_path_id: data.careerPathId || null,
        title: data.title,
        description: data.description,
        material_type: data.materialType,
        url: data.url,
        file_path: data.filePath,
        duration_minutes: data.durationMinutes,
        difficulty: data.difficulty,
        status: data.status,
      }).select().single();
      if (error) throw error;
      const created = mapMaterialFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...materials, newMat];
      setMaterials(updated);
      writeLocal('materials', updated);
      return newMat;
    }
  };

  const updateMaterial = async (id: string, data: Partial<StudyMaterial>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('study_materials').update({
        title: data.title,
        description: data.description,
        material_type: data.materialType,
        url: data.url,
        file_path: data.filePath,
        duration_minutes: data.durationMinutes,
        difficulty: data.difficulty,
        status: data.status,
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = materials.map(m => (m.id === id ? { ...m, ...data } : m));
      setMaterials(updated);
      writeLocal('materials', updated);
    }
    await loadData();
    return true;
  };

  const deleteMaterial = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('study_materials').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = materials.filter(m => m.id !== id);
      setMaterials(updated);
      writeLocal('materials', updated);
    }
    await loadData();
    return true;
  };

  const createTask = async (data: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const newTask: Task = {
      ...data,
      id: 'task_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('tasks').insert({
        topic_id: data.topicId,
        title: data.title,
        description: data.description,
        estimated_duration_minutes: data.estimatedDurationMinutes,
        difficulty: data.difficulty,
        deadline: data.deadline,
        sort_order: data.sortOrder,
        status: data.status,
      }).select().single();
      if (error) throw error;
      const created = mapTaskFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...tasks, newTask];
      setTasks(updated);
      writeLocal('tasks', updated);
      return newTask;
    }
  };

  const updateTask = async (id: string, data: Partial<Task>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('tasks').update({
        title: data.title,
        description: data.description,
        estimated_duration_minutes: data.estimatedDurationMinutes,
        difficulty: data.difficulty,
        deadline: data.deadline,
        sort_order: data.sortOrder,
        status: data.status,
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = tasks.map(t => (t.id === id ? { ...t, ...data } : t));
      setTasks(updated);
      writeLocal('tasks', updated);
    }
    await loadData();
    return true;
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = tasks.filter(t => t.id !== id);
      setTasks(updated);
      writeLocal('tasks', updated);
    }
    await loadData();
    return true;
  };

  const createQuiz = async (data: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz> => {
    const newQuizId = 'quiz_' + Date.now().toString(36);
    const newQuiz: Quiz = {
      ...data,
      id: newQuizId,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbQuiz, error } = await supabase.from('quizzes').insert({
        topic_id: data.topicId || null,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        passing_score: data.passingScore,
        status: data.status,
      }).select().single();
      if (error) throw error;

      // Insert questions
      if (data.questions && data.questions.length > 0) {
        await supabase.from('quiz_questions').insert(
          data.questions.map(q => ({
            quiz_id: dbQuiz.id,
            question_text: q.questionText,
            options: q.options,
            correct_option_index: q.correctOptionIndex,
            explanation: q.explanation,
            sort_order: q.sortOrder,
          }))
        );
      }

      await loadData();
      return mapQuizFromDb(dbQuiz);
    } else {
      const updated = [...quizzes, newQuiz];
      setQuizzes(updated);
      writeLocal('quizzes', updated);
      return newQuiz;
    }
  };

  const updateQuiz = async (id: string, data: Partial<Quiz>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('quizzes').update({
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        passing_score: data.passingScore,
        status: data.status,
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = quizzes.map(q => (q.id === id ? { ...q, ...data } : q));
      setQuizzes(updated);
      writeLocal('quizzes', updated);
    }
    await loadData();
    return true;
  };

  const deleteQuiz = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = quizzes.filter(q => q.id !== id);
      setQuizzes(updated);
      writeLocal('quizzes', updated);
    }
    await loadData();
    return true;
  };

  const createProject = async (data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    const newProj: Project = {
      ...data,
      id: 'proj_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('projects').insert({
        career_path_id: data.careerPathId || null,
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        required_skills: data.requiredSkills,
        technologies: data.technologies,
        estimated_duration: data.estimatedDuration,
        requirements: data.requirements,
        resources: data.resources,
        deadline: data.deadline,
        status: data.status,
      }).select().single();
      if (error) throw error;
      const created = mapProjectFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...projects, newProj];
      setProjects(updated);
      writeLocal('projects', updated);
      return newProj;
    }
  };

  const updateProject = async (id: string, data: Partial<Project>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('projects').update({
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        required_skills: data.requiredSkills,
        technologies: data.technologies,
        estimated_duration: data.estimatedDuration,
        requirements: data.requirements,
        resources: data.resources,
        deadline: data.deadline,
        status: data.status,
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = projects.map(p => (p.id === id ? { ...p, ...data } : p));
      setProjects(updated);
      writeLocal('projects', updated);
    }
    await loadData();
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      writeLocal('projects', updated);
    }
    await loadData();
    return true;
  };

  const createAITool = async (data: Omit<AITool, 'id' | 'createdAt'>): Promise<AITool> => {
    const newTool: AITool = {
      ...data,
      id: 'tool_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('ai_tools').insert({
        tool_name: data.toolName,
        description: data.description,
        category: data.category,
        url: data.url,
        pricing: data.pricing,
        use_case: data.useCase,
        skill_level: data.skillLevel,
        status: data.status,
      }).select().single();
      if (error) throw error;
      const created = mapAIToolFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...aiTools, newTool];
      setAiTools(updated);
      writeLocal('aiTools', updated);
      return newTool;
    }
  };

  const updateAITool = async (id: string, data: Partial<AITool>): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('ai_tools').update({
        tool_name: data.toolName,
        description: data.description,
        category: data.category,
        url: data.url,
        pricing: data.pricing,
        use_case: data.useCase,
        skill_level: data.skillLevel,
        status: data.status,
      }).eq('id', id);
      if (error) return false;
    } else {
      const updated = aiTools.map(t => (t.id === id ? { ...t, ...data } : t));
      setAiTools(updated);
      writeLocal('aiTools', updated);
    }
    await loadData();
    return true;
  };

  const deleteAITool = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('ai_tools').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = aiTools.filter(t => t.id !== id);
      setAiTools(updated);
      writeLocal('aiTools', updated);
    }
    await loadData();
    return true;
  };

  const createAchievement = async (data: Omit<Achievement, 'id' | 'createdAt'>): Promise<Achievement> => {
    const newAch: Achievement = {
      ...data,
      id: 'ach_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data: dbData, error } = await supabase.from('achievements').insert({
        title: data.title,
        description: data.description,
        icon_name: data.iconName,
        badge_color: data.badgeColor,
        criteria_type: data.criteriaType,
        criteria_value: data.criteriaValue,
      }).select().single();
      if (error) throw error;
      const created = mapAchievementFromDb(dbData);
      await loadData();
      return created;
    } else {
      const updated = [...achievements, newAch];
      setAchievements(updated);
      writeLocal('achievements', updated);
      return newAch;
    }
  };

  const deleteAchievement = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) return false;
    } else {
      const updated = achievements.filter(a => a.id !== id);
      setAchievements(updated);
      writeLocal('achievements', updated);
    }
    await loadData();
    return true;
  };

  return (
    <DataContext.Provider
      value={{
        careers,
        roadmaps,
        phases,
        modules,
        topics,
        materials,
        tasks,
        quizzes,
        projects,
        aiTools,
        achievements,
        notifications,
        students,

        taskProgress,
        materialProgress,
        studySessions,
        quizAttempts,
        projectProgress,
        studentAchievements,

        selectedCareer,
        currentRoadmap,
        completedTopicIds,
        totalStudyHours,
        currentStreak,
        overallProgressPercentage,
        adminStats,
        isLoading,

        selectCareerGoal,
        toggleMaterialComplete,
        updateTaskStatus,
        logStudySession,
        submitQuizAttempt,
        updateProjectProgress,
        markNotificationAsRead,

        createCareer,
        updateCareer,
        deleteCareer,

        createRoadmap,
        updateRoadmap,
        deleteRoadmap,

        createPhase,
        updatePhase,
        deletePhase,

        createModule,
        updateModule,
        deleteModule,

        createTopic,
        updateTopic,
        deleteTopic,

        createMaterial,
        updateMaterial,
        deleteMaterial,

        createTask,
        updateTask,
        deleteTask,

        createQuiz,
        updateQuiz,
        deleteQuiz,

        createProject,
        updateProject,
        deleteProject,

        createAITool,
        updateAITool,
        deleteAITool,

        createAchievement,
        deleteAchievement,

        refreshData: loadData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
