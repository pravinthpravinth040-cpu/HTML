import { StudentProfile, StudySession, ProjectProgress, Project, Topic } from '../types';

export interface ReadinessCategory {
  name: string;
  score: number; // 0 to 100
  weight: number; // Percentage contribution (e.g. 25%)
  explanation: string;
  status: 'insufficient' | 'needs_work' | 'good' | 'excellent';
  icon: string;
}

export interface ReadinessReport {
  overallScore: number;
  hasSufficientData: boolean;
  emptyReason?: string;
  categories: ReadinessCategory[];
  recommendations: string[];
}

export const calculateCareerReadiness = (
  profile: StudentProfile | null,
  totalTopics: Topic[],
  completedTopicIds: string[],
  projects: Project[],
  projectProgressList: ProjectProgress[],
  studySessions: StudySession[],
  currentStreak: number,
  averageQuizScore: number,
  quizAttemptsCount: number
): ReadinessReport => {
  // If there are zero published topics and zero projects, or student has zero activity
  const totalPublishedTopics = totalTopics.filter(t => t.status === 'published').length;
  const totalPublishedProjects = projects.filter(p => p.status === 'published').length;

  const totalActions =
    completedTopicIds.length +
    projectProgressList.length +
    studySessions.length +
    quizAttemptsCount;

  if (totalPublishedTopics === 0 && totalPublishedProjects === 0) {
    return {
      overallScore: 0,
      hasSufficientData: false,
      emptyReason: 'No published roadmap modules or projects exist yet. Once the administrator publishes learning content and you begin studying, your career readiness score will be calculated dynamically.',
      categories: [],
      recommendations: [
        'Check back once the administrator publishes the career roadmap.',
        'Complete your student profile with your GitHub, LinkedIn, and degree details.',
      ],
    };
  }

  if (totalActions === 0) {
    return {
      overallScore: 0,
      hasSufficientData: false,
      emptyReason: 'Not enough data to calculate career readiness. You have not completed any topics, quizzes, projects, or study sessions yet.',
      categories: [],
      recommendations: [
        'Select a career path to get started.',
        'Complete your first study topic in the roadmap.',
        'Log a 25-minute Pomodoro study session.',
        'Add your GitHub repository and resume to your profile.',
      ],
    };
  }

  // 1. Learning Progress (Weight: 25%)
  const topicProgressPct = totalPublishedTopics > 0
    ? Math.round((completedTopicIds.length / totalPublishedTopics) * 100)
    : 0;
  const learningExplanation = totalPublishedTopics > 0
    ? `${completedTopicIds.length} of ${totalPublishedTopics} roadmap topics completed (${topicProgressPct}%).`
    : 'No roadmap topics published yet.';

  // 2. Practical Projects (Weight: 25%)
  const completedProjects = projectProgressList.filter(p => p.status === 'completed').length;
  const projectPct = totalPublishedProjects > 0
    ? Math.round((completedProjects / totalPublishedProjects) * 100)
    : 0;
  const projectExplanation = totalPublishedProjects > 0
    ? `${completedProjects} of ${totalPublishedProjects} assigned projects completed and deployed (${projectPct}%).`
    : 'No projects assigned yet in current roadmap.';

  // 3. Quiz & Technical Mastery (Weight: 15%)
  const quizPct = quizAttemptsCount > 0 ? Math.min(100, Math.round(averageQuizScore)) : 0;
  const quizExplanation = quizAttemptsCount > 0
    ? `Average score of ${averageQuizScore}% across ${quizAttemptsCount} real quiz attempts.`
    : 'No quizzes taken yet. Pass topic quizzes to verify your domain skills.';

  // 4. GitHub & Portfolio (Weight: 15%)
  let githubScore = 0;
  const githubReasons: string[] = [];
  if (profile?.githubUrl && profile.githubUrl.trim().length > 5) {
    githubScore += 50;
    githubReasons.push('GitHub linked');
  } else {
    githubReasons.push('GitHub missing');
  }
  if (profile?.portfolioUrl && profile.portfolioUrl.trim().length > 5) {
    githubScore += 50;
    githubReasons.push('Portfolio URL verified');
  } else {
    githubReasons.push('Portfolio URL missing');
  }
  const githubExplanation = githubReasons.join(', ') + `.`;

  // 5. Resume & Professional Profile (Weight: 10%)
  let resumeScore = 0;
  const resumeReasons: string[] = [];
  if (profile?.resumeUrl && profile.resumeUrl.trim().length > 5) {
    resumeScore += 50;
    resumeReasons.push('Resume uploaded');
  } else {
    resumeReasons.push('Resume missing');
  }
  if (profile?.college && profile.degree) {
    resumeScore += 30;
    resumeReasons.push('Academics completed');
  }
  if (profile?.linkedinUrl && profile.linkedinUrl.trim().length > 5) {
    resumeScore += 20;
    resumeReasons.push('LinkedIn linked');
  }
  const resumeExplanation = resumeReasons.join(', ') + `.`;

  // 6. Study Consistency & Streak (Weight: 10%)
  // 7-day streak gives 100%, 3-day streak gives 50%, 1-day gives 20%
  let consistencyScore = 0;
  if (currentStreak >= 7) consistencyScore = 100;
  else if (currentStreak >= 5) consistencyScore = 80;
  else if (currentStreak >= 3) consistencyScore = 55;
  else if (currentStreak >= 1) consistencyScore = 25;
  else consistencyScore = 0;

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + Math.round(s.durationSeconds / 60), 0);
  const consistencyExplanation = `${currentStreak} day learning streak. ${totalStudyMinutes} recorded study minutes across ${studySessions.length} sessions.`;

  // Categories array with exact weights
  const categories: ReadinessCategory[] = [
    {
      name: 'Learning Progress',
      score: topicProgressPct,
      weight: 25,
      explanation: learningExplanation,
      status: topicProgressPct >= 75 ? 'excellent' : topicProgressPct >= 40 ? 'good' : 'needs_work',
      icon: 'BookOpen',
    },
    {
      name: 'Practical Projects',
      score: projectPct,
      weight: 25,
      explanation: projectExplanation,
      status: projectPct >= 75 ? 'excellent' : projectPct >= 40 ? 'good' : 'needs_work',
      icon: 'FolderGit2',
    },
    {
      name: 'Quiz & Domain Knowledge',
      score: quizPct,
      weight: 15,
      explanation: quizExplanation,
      status: quizPct >= 75 ? 'excellent' : quizPct >= 50 ? 'good' : 'needs_work',
      icon: 'HelpCircle',
    },
    {
      name: 'GitHub & Portfolio',
      score: githubScore,
      weight: 15,
      explanation: githubExplanation,
      status: githubScore === 100 ? 'excellent' : githubScore >= 50 ? 'good' : 'needs_work',
      icon: 'Github',
    },
    {
      name: 'Resume & Profile',
      score: resumeScore,
      weight: 10,
      explanation: resumeExplanation,
      status: resumeScore >= 80 ? 'excellent' : resumeScore >= 50 ? 'good' : 'needs_work',
      icon: 'FileCheck2',
    },
    {
      name: 'Study Consistency',
      score: consistencyScore,
      weight: 10,
      explanation: consistencyExplanation,
      status: consistencyScore >= 80 ? 'excellent' : consistencyScore >= 50 ? 'good' : 'needs_work',
      icon: 'Flame',
    },
  ];

  // Weighted overall calculation: sum(score * weight / 100)
  const weightedOverall = Math.round(
    categories.reduce((acc, cat) => acc + (cat.score * cat.weight) / 100, 0)
  );

  const recommendations: string[] = [];
  if (topicProgressPct < 50) recommendations.push('Continue progressing through the roadmap modules and marking topics complete.');
  if (projectPct < 50 && totalPublishedProjects > 0) recommendations.push('Work on an active project and link your GitHub repository.');
  if (quizAttemptsCount === 0) recommendations.push('Attempt quizzes attached to your completed topics to test your retention.');
  if (githubScore < 50) recommendations.push('Add your GitHub profile URL in your profile settings.');
  if (resumeScore < 50) recommendations.push('Add your resume link or file to your student profile.');
  if (currentStreak < 3) recommendations.push('Log study sessions daily using the built-in timer to build a strong study streak.');

  return {
    overallScore: weightedOverall,
    hasSufficientData: true,
    categories,
    recommendations: recommendations.slice(0, 4),
  };
};
