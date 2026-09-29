import React, { useState } from 'react';
import {
  Compass,
  Map,
  Layers,
  BookOpen,
  CheckSquare,
  HelpCircle,
  FolderGit2,
  Sparkles,
  Wrench,
  Award,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  Check,
  X,
  FileText
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { uploadStudyMaterialFile } from '../../services/storageService';
import {
  CareerPath,
  Roadmap,
  RoadmapPhase,
  Module,
  Topic,
  StudyMaterial,
  Task,
  Quiz,
  Project,
  AITool,
  Achievement,
  MaterialType
} from '../../types';

interface AdminContentManagerProps {
  initialTab?: string;
  defaultModalType?: string | null;
  onClearDefaultModal?: () => void;
}

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({
  initialTab = 'careers',
  defaultModalType,
  onClearDefaultModal,
}) => {
  const {
    careers, createCareer, updateCareer, deleteCareer,
    roadmaps, createRoadmap, updateRoadmap, deleteRoadmap,
    phases, createPhase, updatePhase, deletePhase,
    modules, createModule, updateModule, deleteModule,
    topics, createTopic, updateTopic, deleteTopic,
    materials, createMaterial, updateMaterial, deleteMaterial,
    tasks, createTask, updateTask, deleteTask,
    quizzes, createQuiz, updateQuiz, deleteQuiz,
    projects, createProject, updateProject, deleteProject,
    aiTools, createAITool, updateAITool, deleteAITool,
    achievements, createAchievement, deleteAchievement,
  } = useData();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Modal creation states
  const [modalType, setModalType] = useState<string | null>(defaultModalType || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms
  const [careerForm, setCareerForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Software Engineering',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '6 Months',
    requiredSkills: '',
    status: 'published' as const,
    sortOrder: 0,
    iconName: 'Compass',
  });

  const [roadmapForm, setRoadmapForm] = useState({
    careerPathId: '',
    title: '',
    description: '',
    version: '1.0',
    status: 'published' as const,
  });

  const [phaseForm, setPhaseForm] = useState({
    roadmapId: '',
    title: '',
    description: '',
    estimatedDuration: '4 Weeks',
    sortOrder: 0,
    status: 'published' as const,
  });

  const [moduleForm, setModuleForm] = useState({
    phaseId: '',
    name: '',
    description: '',
    estimatedDuration: '1 Week',
    difficulty: 'Intermediate',
    sortOrder: 0,
    status: 'published' as const,
  });

  const [topicForm, setTopicForm] = useState({
    moduleId: '',
    name: '',
    description: '',
    difficulty: 'Beginner',
    estimatedLearningTimeMinutes: 45,
    sortOrder: 0,
    status: 'published' as const,
  });

  const [materialForm, setMaterialForm] = useState<{
    topicId: string;
    careerPathId: string;
    title: string;
    description: string;
    materialType: MaterialType;
    url: string;
    durationMinutes: number;
    difficulty: string;
    status: 'published' | 'draft';
  }>({
    topicId: '',
    careerPathId: '',
    title: '',
    description: '',
    materialType: 'Article',
    url: '',
    durationMinutes: 30,
    difficulty: 'Beginner',
    status: 'published',
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [taskForm, setTaskForm] = useState({
    topicId: '',
    title: '',
    description: '',
    estimatedDurationMinutes: 30,
    difficulty: 'Beginner',
    deadline: '',
    sortOrder: 0,
    status: 'published' as const,
  });

  const [quizForm, setQuizForm] = useState({
    topicId: '',
    title: '',
    description: '',
    difficulty: 'Intermediate',
    passingScore: 70,
    status: 'published' as const,
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    explanation: '',
  });

  const [projectForm, setProjectForm] = useState({
    careerPathId: '',
    name: '',
    description: '',
    difficulty: 'Intermediate',
    requiredSkills: '',
    technologies: '',
    estimatedDuration: '2 Weeks',
    status: 'published' as const,
  });

  const [aiToolForm, setAiToolForm] = useState<{
    toolName: string;
    description: string;
    category: string;
    url: string;
    pricing: 'Free' | 'Paid' | 'Freemium';
    useCase: string;
    skillLevel: string;
    status: 'published' | 'draft';
  }>({
    toolName: '',
    description: '',
    category: 'Productivity',
    url: '',
    pricing: 'Freemium',
    useCase: '',
    skillLevel: 'All Levels',
    status: 'published',
  });

  const [achievementForm, setAchievementForm] = useState<{
    title: string;
    description: string;
    iconName: string;
    badgeColor: string;
    criteriaType: 'streak' | 'study_hours' | 'topics_completed' | 'projects_completed' | 'quizzes_passed';
    criteriaValue: number;
  }>({
    title: '',
    description: '',
    iconName: 'Award',
    badgeColor: 'amber',
    criteriaType: 'topics_completed',
    criteriaValue: 5,
  });

  const closeModal = () => {
    setModalType(null);
    if (onClearDefaultModal) onClearDefaultModal();
  };

  // Handlers for submission
  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createCareer({
      title: careerForm.title,
      slug: careerForm.slug || careerForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: careerForm.description,
      category: careerForm.category,
      difficulty: careerForm.difficulty,
      estimatedDuration: careerForm.estimatedDuration,
      requiredSkills: careerForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      status: careerForm.status,
      sortOrder: careerForm.sortOrder,
      iconName: careerForm.iconName,
    });
    setIsSubmitting(false);
    closeModal();
  };

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadmapForm.careerPathId) {
      alert('Please select a parent Career Path');
      return;
    }
    setIsSubmitting(true);
    await createRoadmap({
      careerPathId: roadmapForm.careerPathId,
      title: roadmapForm.title,
      description: roadmapForm.description,
      version: roadmapForm.version,
      status: roadmapForm.status,
    });
    setIsSubmitting(false);
    closeModal();
  };

  const handleCreatePhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseForm.roadmapId) {
      alert('Please select a Roadmap');
      return;
    }
    setIsSubmitting(true);
    await createPhase({
      roadmapId: phaseForm.roadmapId,
      title: phaseForm.title,
      description: phaseForm.description,
      learningObjectives: [],
      estimatedDuration: phaseForm.estimatedDuration,
      sortOrder: phaseForm.sortOrder,
      status: phaseForm.status,
    });
    setIsSubmitting(false);
    closeModal();
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.phaseId) {
      alert('Please select a Phase');
      return;
    }
    setIsSubmitting(true);
    await createModule({
      phaseId: moduleForm.phaseId,
      name: moduleForm.name,
      description: moduleForm.description,
      estimatedDuration: moduleForm.estimatedDuration,
      difficulty: moduleForm.difficulty,
      learningObjectives: [],
      sortOrder: moduleForm.sortOrder,
      status: moduleForm.status,
    });
    setIsSubmitting(false);
    closeModal();
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicForm.moduleId) {
      alert('Please select a Module');
      return;
    }
    setIsSubmitting(true);
    await createTopic({
      moduleId: topicForm.moduleId,
      name: topicForm.name,
      description: topicForm.description,
      difficulty: topicForm.difficulty,
      estimatedLearningTimeMinutes: topicForm.estimatedLearningTimeMinutes,
      learningObjectives: [],
      prerequisites: [],
      sortOrder: topicForm.sortOrder,
      status: topicForm.status,
    });
    setIsSubmitting(false);
    closeModal();
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalUrl = materialForm.url;
    let filePath: string | undefined = undefined;

    if (uploadedFile) {
      const uploadRes = await uploadStudyMaterialFile(uploadedFile);
      if (uploadRes.url) {
        finalUrl = uploadRes.url;
        filePath = uploadRes.path;
      }
    }

    await createMaterial({
      topicId: materialForm.topicId || undefined,
      careerPathId: materialForm.careerPathId || undefined,
      title: materialForm.title,
      description: materialForm.description,
      materialType: materialForm.materialType,
      url: finalUrl,
      filePath,
      durationMinutes: materialForm.durationMinutes,
      difficulty: materialForm.difficulty,
      status: materialForm.status,
    });

    setIsSubmitting(false);
    setUploadedFile(null);
    closeModal();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createTask({
      topicId: taskForm.topicId || undefined,
      title: taskForm.title,
      description: taskForm.description,
      estimatedDurationMinutes: taskForm.estimatedDurationMinutes,
      difficulty: taskForm.difficulty,
      deadline: taskForm.deadline || undefined,
      sortOrder: taskForm.sortOrder,
      status: taskForm.status,
    });
    setIsSubmitting(false);
    closeModal();
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const questions = [
      {
        id: 'q_' + Date.now().toString(36),
        quizId: '',
        questionText: quizForm.questionText,
        options: [quizForm.optionA, quizForm.optionB, quizForm.optionC, quizForm.optionD].filter(Boolean),
        correctOptionIndex: quizForm.correctIndex,
        explanation: quizForm.explanation,
        sortOrder: 0,
        createdAt: new Date().toISOString(),
      },
    ];

    await createQuiz({
      topicId: quizForm.topicId || undefined,
      title: quizForm.title,
      description: quizForm.description,
      difficulty: quizForm.difficulty,
      passingScore: quizForm.passingScore,
      status: quizForm.status,
      questions,
    });

    setIsSubmitting(false);
    closeModal();
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createProject({
      careerPathId: projectForm.careerPathId || undefined,
      name: projectForm.name,
      description: projectForm.description,
      difficulty: projectForm.difficulty,
      requiredSkills: projectForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      technologies: projectForm.technologies.split(',').map(s => s.trim()).filter(Boolean),
      estimatedDuration: projectForm.estimatedDuration,
      requirements: [],
      resources: [],
      status: projectForm.status,
    });
    setIsSubmitting(false);
    closeModal();
  };

  const handleCreateAITool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createAITool(aiToolForm);
    setIsSubmitting(false);
    closeModal();
  };

  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createAchievement(achievementForm);
    setIsSubmitting(false);
    closeModal();
  };

  const tabs = [
    { id: 'careers', label: 'Careers', icon: Compass, count: careers.length },
    { id: 'roadmaps', label: 'Roadmaps', icon: Map, count: roadmaps.length },
    { id: 'phases', label: 'Phases', icon: Layers, count: phases.length },
    { id: 'modules', label: 'Modules', icon: Layers, count: modules.length },
    { id: 'topics', label: 'Topics', icon: FileText, count: topics.length },
    { id: 'materials', label: 'Materials', icon: BookOpen, count: materials.length },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: tasks.length },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, count: quizzes.length },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: projects.length },
    { id: 'aiTools', label: 'AI Tools', icon: Wrench, count: aiTools.length },
    { id: 'achievements', label: 'Badges', icon: Award, count: achievements.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
            Curriculum & Content Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, publish, and structure real educational resources stored dynamically in Supabase.
          </p>
        </div>

        <button
          onClick={() => setModalType(activeTab)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Record</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {/* Careers Panel */}
        {activeTab === 'careers' && (
          <div className="space-y-3">
            {careers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                No career paths created yet. Click &quot;Add New Record&quot; to create your first career.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careers.map(c => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-200">{c.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            c.status === 'published'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                        <span>{c.category}</span>
                        <span>•</span>
                        <span>{c.estimatedDuration}</span>
                        <span>•</span>
                        <span>{c.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          updateCareer(c.id, {
                            status: c.status === 'published' ? 'draft' : 'published',
                          })
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        title={c.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {c.status === 'published' ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteCareer(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete Career"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Roadmaps Panel */}
        {activeTab === 'roadmaps' && (
          <div className="space-y-3">
            {roadmaps.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                No roadmaps created yet. Click &quot;Add New Record&quot; to link a roadmap to a career path.
              </div>
            ) : (
              roadmaps.map(r => {
                const parentCareer = careers.find(c => c.id === r.careerPathId);
                return (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-200">{r.title}</p>
                      <p className="text-[11px] text-slate-400">
                        Career: {parentCareer?.title || 'Unknown'} • Version: {r.version}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateRoadmap(r.id, {
                            status: r.status === 'published' ? 'draft' : 'published',
                          })
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                      >
                        {r.status === 'published' ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteRoadmap(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Study Materials Panel */}
        {activeTab === 'materials' && (
          <div className="space-y-3">
            {materials.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                No study materials uploaded yet. Click &quot;Add New Record&quot; to attach guides or videos.
              </div>
            ) : (
              materials.map(m => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{m.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                        {m.materialType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {m.description || m.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateMaterial(m.id, {
                          status: m.status === 'published' ? 'draft' : 'published',
                        })
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                    >
                      {m.status === 'published' ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteMaterial(m.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Phases, Modules, Topics, Tasks, Quizzes, Projects, AI Tools tabs */}
        {activeTab !== 'careers' && activeTab !== 'roadmaps' && activeTab !== 'materials' && (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 capitalize">
                Total {activeTab} in Database:
              </span>
              <button
                onClick={() => setModalType(activeTab)}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to {activeTab}
              </button>
            </div>

            {/* List active records for current tab */}
            {activeTab === 'phases' &&
              phases.map(p => (
                <div key={p.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{p.title}</span>
                  <button onClick={() => deletePhase(p.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {activeTab === 'modules' &&
              modules.map(m => (
                <div key={m.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{m.name}</span>
                  <button onClick={() => deleteModule(m.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {activeTab === 'topics' &&
              topics.map(t => (
                <div key={t.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{t.name}</span>
                  <button onClick={() => deleteTopic(t.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {activeTab === 'tasks' &&
              tasks.map(t => (
                <div key={t.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{t.title}</span>
                  <button onClick={() => deleteTask(t.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {activeTab === 'quizzes' &&
              quizzes.map(q => (
                <div key={q.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{q.title}</span>
                  <button onClick={() => deleteQuiz(q.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {activeTab === 'projects' &&
              projects.map(p => (
                <div key={p.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{p.name}</span>
                  <button onClick={() => deleteProject(p.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {activeTab === 'aiTools' &&
              aiTools.map(t => (
                <div key={t.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{t.toolName}</span>
                  <button onClick={() => deleteAITool(t.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {activeTab === 'achievements' &&
              achievements.map(a => (
                <div key={a.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{a.title}</span>
                  <button onClick={() => deleteAchievement(a.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Creation Modal for Any Entity */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-slate-100 capitalize">
                Create {modalType.replace(/([A-Z])/g, ' $1')}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Career Path Form */}
            {(modalType === 'career' || modalType === 'careers') && (
              <form onSubmit={handleCreateCareer} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Career Title</label>
                  <input
                    type="text"
                    required
                    value={careerForm.title}
                    onChange={e => setCareerForm({ ...careerForm, title: e.target.value })}
                    placeholder="e.g. Full-Stack Developer + Software Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={careerForm.description}
                    onChange={e => setCareerForm({ ...careerForm, description: e.target.value })}
                    placeholder="Master modern frontend, backend, databases, and deployment..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Category</label>
                    <input
                      type="text"
                      value={careerForm.category}
                      onChange={e => setCareerForm({ ...careerForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Duration</label>
                    <input
                      type="text"
                      value={careerForm.estimatedDuration}
                      onChange={e => setCareerForm({ ...careerForm, estimatedDuration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={careerForm.requiredSkills}
                    onChange={e => setCareerForm({ ...careerForm, requiredSkills: e.target.value })}
                    placeholder="JavaScript, React, Node.js, SQL, Git"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Create Career'}
                  </button>
                </div>
              </form>
            )}

            {/* Roadmap Form */}
            {(modalType === 'roadmap' || modalType === 'roadmaps') && (
              <form onSubmit={handleCreateRoadmap} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Parent Career</label>
                  <select
                    required
                    value={roadmapForm.careerPathId}
                    onChange={e => setRoadmapForm({ ...roadmapForm, careerPathId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  >
                    <option value="">Select Career...</option>
                    {careers.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Roadmap Title</label>
                  <input
                    type="text"
                    required
                    value={roadmapForm.title}
                    onChange={e => setRoadmapForm({ ...roadmapForm, title: e.target.value })}
                    placeholder="e.g. Standard 6-Month Engineering Curriculum"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={roadmapForm.description}
                    onChange={e => setRoadmapForm({ ...roadmapForm, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Create Roadmap'}
                  </button>
                </div>
              </form>
            )}

            {/* Phase Form */}
            {(modalType === 'phase' || modalType === 'phases') && (
              <form onSubmit={handleCreatePhase} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Parent Roadmap</label>
                  <select
                    required
                    value={phaseForm.roadmapId}
                    onChange={e => setPhaseForm({ ...phaseForm, roadmapId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  >
                    <option value="">Select Roadmap...</option>
                    {roadmaps.map(r => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Phase Title</label>
                  <input
                    type="text"
                    required
                    value={phaseForm.title}
                    onChange={e => setPhaseForm({ ...phaseForm, title: e.target.value })}
                    placeholder="e.g. Phase 1: Core Programming Fundamentals"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Create Phase'}
                  </button>
                </div>
              </form>
            )}

            {/* Module Form */}
            {(modalType === 'module' || modalType === 'modules') && (
              <form onSubmit={handleCreateModule} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Parent Phase</label>
                  <select
                    required
                    value={moduleForm.phaseId}
                    onChange={e => setModuleForm({ ...moduleForm, phaseId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  >
                    <option value="">Select Phase...</option>
                    {phases.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Module Name</label>
                  <input
                    type="text"
                    required
                    value={moduleForm.name}
                    onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })}
                    placeholder="e.g. JavaScript Async & DOM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Create Module'}
                  </button>
                </div>
              </form>
            )}

            {/* Topic Form */}
            {(modalType === 'topic' || modalType === 'topics') && (
              <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Parent Module</label>
                  <select
                    required
                    value={topicForm.moduleId}
                    onChange={e => setTopicForm({ ...topicForm, moduleId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  >
                    <option value="">Select Module...</option>
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Topic Name</label>
                  <input
                    type="text"
                    required
                    value={topicForm.name}
                    onChange={e => setTopicForm({ ...topicForm, name: e.target.value })}
                    placeholder="e.g. Promises, Async/Await & Event Loop"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Create Topic'}
                  </button>
                </div>
              </form>
            )}

            {/* Material Form */}
            {(modalType === 'material' || modalType === 'materials') && (
              <form onSubmit={handleCreateMaterial} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Material Title</label>
                  <input
                    type="text"
                    required
                    value={materialForm.title}
                    onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })}
                    placeholder="e.g. Deep Dive into SQL Indexing & Query Plans"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Material Type</label>
                    <select
                      value={materialForm.materialType}
                      onChange={e => setMaterialForm({ ...materialForm, materialType: e.target.value as MaterialType })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                    >
                      <option value="Article">Article</option>
                      <option value="Documentation">Documentation</option>
                      <option value="PDF">PDF Document</option>
                      <option value="Video">Video Tutorial</option>
                      <option value="GitHub Repository">GitHub Repository</option>
                      <option value="Course">Online Course</option>
                      <option value="Assignment">Assignment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      value={materialForm.durationMinutes}
                      onChange={e => setMaterialForm({ ...materialForm, durationMinutes: parseInt(e.target.value) || 30 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Resource URL (or Web Link)</label>
                  <input
                    type="url"
                    value={materialForm.url}
                    onChange={e => setMaterialForm({ ...materialForm, url: e.target.value })}
                    placeholder="https://developer.mozilla.org/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Upload File (Optional)</label>
                  <input
                    type="file"
                    onChange={e => setUploadedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Uploading...' : 'Publish Material'}
                  </button>
                </div>
              </form>
            )}

            {/* Quiz Form */}
            {(modalType === 'quiz' || modalType === 'quizzes') && (
              <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizForm.title}
                    onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                    placeholder="e.g. JavaScript Asynchronous Foundations Quiz"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Question 1 Text</label>
                  <textarea
                    required
                    rows={2}
                    value={quizForm.questionText}
                    onChange={e => setQuizForm({ ...quizForm, questionText: e.target.value })}
                    placeholder="What is the result of Promise.all() when one promise rejects?"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Option A"
                    value={quizForm.optionA}
                    onChange={e => setQuizForm({ ...quizForm, optionA: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option B"
                    value={quizForm.optionB}
                    onChange={e => setQuizForm({ ...quizForm, optionB: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Option C (Optional)"
                    value={quizForm.optionC}
                    onChange={e => setQuizForm({ ...quizForm, optionC: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Option D (Optional)"
                    value={quizForm.optionD}
                    onChange={e => setQuizForm({ ...quizForm, optionD: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Correct Answer</label>
                    <select
                      value={quizForm.correctIndex}
                      onChange={e => setQuizForm({ ...quizForm, correctIndex: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Passing Score (%)</label>
                    <input
                      type="number"
                      value={quizForm.passingScore}
                      onChange={e => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) || 70 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Publish Quiz'}
                  </button>
                </div>
              </form>
            )}

            {/* Project Form */}
            {(modalType === 'project' || modalType === 'projects') && (
              <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={projectForm.name}
                    onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="e.g. Distributed Task & Workflow Manager"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={projectForm.description}
                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Build a production web application with authentication, WebSocket events, and Postgres RLS."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    placeholder="React, TypeScript, Tailwind CSS, Supabase"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            )}

            {/* AI Tool Form */}
            {(modalType === 'aiTool' || modalType === 'aiTools') && (
              <form onSubmit={handleCreateAITool} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tool Name</label>
                  <input
                    type="text"
                    required
                    value={aiToolForm.toolName}
                    onChange={e => setAiToolForm({ ...aiToolForm, toolName: e.target.value })}
                    placeholder="e.g. v0.dev or Claude Code"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={aiToolForm.description}
                    onChange={e => setAiToolForm({ ...aiToolForm, description: e.target.value })}
                    placeholder="Generative UI system and code synthesizer..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Website URL</label>
                  <input
                    type="url"
                    required
                    value={aiToolForm.url}
                    onChange={e => setAiToolForm({ ...aiToolForm, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Add AI Tool'}
                  </button>
                </div>
              </form>
            )}

            {/* Badges / Achievement Form */}
            {(modalType === 'achievement' || modalType === 'achievements') && (
              <form onSubmit={handleCreateAchievement} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Badge Title</label>
                  <input
                    type="text"
                    required
                    value={achievementForm.title}
                    onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    placeholder="e.g. 7-Day Consistency Warrior"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Description</label>
                  <input
                    type="text"
                    required
                    value={achievementForm.description}
                    onChange={e => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    placeholder="Maintained a 7-day study streak"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Criteria Type</label>
                    <select
                      value={achievementForm.criteriaType}
                      onChange={e => setAchievementForm({ ...achievementForm, criteriaType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                    >
                      <option value="streak">Streak (Days)</option>
                      <option value="study_hours">Study Hours</option>
                      <option value="topics_completed">Topics Mastered</option>
                      <option value="projects_completed">Projects Completed</option>
                      <option value="quizzes_passed">Quizzes Passed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Criteria Target Value</label>
                    <input
                      type="number"
                      value={achievementForm.criteriaValue}
                      onChange={e => setAchievementForm({ ...achievementForm, criteriaValue: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                    {isSubmitting ? 'Creating...' : 'Create Badge'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
