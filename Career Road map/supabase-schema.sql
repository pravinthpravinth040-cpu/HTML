-- ==============================================================================
-- CareerPath Database Schema
-- Platform: Supabase / PostgreSQL
-- Policy: Starts 100% EMPTY. NO DEMO DATA. NO HARDCODED RECORDS.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    role user_role DEFAULT 'student',
    college TEXT DEFAULT '',
    degree TEXT DEFAULT '',
    department TEXT DEFAULT '',
    year_of_study TEXT DEFAULT '',
    semester TEXT DEFAULT '',
    graduation_year TEXT DEFAULT '',
    career_goal TEXT DEFAULT '',
    target_career_id UUID,
    daily_available_hours NUMERIC DEFAULT 2,
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    portfolio_url TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Career Paths
CREATE TABLE IF NOT EXISTS public.career_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Compass',
    category TEXT DEFAULT 'Engineering',
    difficulty TEXT DEFAULT 'Beginner to Advanced',
    estimated_duration TEXT DEFAULT '6 Months',
    required_skills TEXT[] DEFAULT '{}',
    color_gradient TEXT DEFAULT 'from-indigo-600 to-brand-500',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Roadmaps
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_path_id UUID NOT NULL REFERENCES public.career_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    cover_image_url TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'Intermediate',
    estimated_duration TEXT DEFAULT '6 Months',
    learning_objectives TEXT[] DEFAULT '{}',
    skills_covered TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    version TEXT DEFAULT '1.0',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished', 'archived')),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Roadmap Phases
CREATE TABLE IF NOT EXISTS public.roadmap_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    phase_image_url TEXT DEFAULT '',
    learning_objectives TEXT[] DEFAULT '{}',
    skills_covered TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    estimated_duration TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Modules / Courses
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_id UUID NOT NULL REFERENCES public.roadmap_phases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    course_image_url TEXT DEFAULT '',
    estimated_duration TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'Intermediate',
    learning_objectives TEXT[] DEFAULT '{}',
    sort_order INT DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Topics
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'Beginner',
    estimated_learning_time_minutes INT DEFAULT 45,
    learning_objectives TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    sort_order INT DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Study Materials
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    career_path_id UUID REFERENCES public.career_paths(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    material_type TEXT NOT NULL CHECK (material_type IN ('Video', 'PDF', 'Article', 'Documentation', 'Website', 'GitHub Repository', 'Course', 'Notes', 'Assignment')),
    url TEXT DEFAULT '',
    file_path TEXT DEFAULT '',
    duration_minutes INT DEFAULT 30,
    difficulty TEXT DEFAULT 'Beginner',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    estimated_duration_minutes INT DEFAULT 30,
    difficulty TEXT DEFAULT 'Beginner',
    deadline TIMESTAMPTZ,
    sort_order INT DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Task Progress
CREATE TABLE IF NOT EXISTS public.task_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    notes TEXT DEFAULT '',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, task_id)
);

-- 12. Material Progress
CREATE TABLE IF NOT EXISTS public.material_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES public.study_materials(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, material_id)
);

-- 13. Study Sessions (Study Timer)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_seconds INT NOT NULL,
    mode TEXT DEFAULT '25_min' CHECK (mode IN ('25_min', '50_min', 'custom')),
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'Intermediate',
    passing_score INT DEFAULT 70,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_option_index INT NOT NULL DEFAULT 0,
    explanation TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. Quiz Attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    answers JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_path_id UUID REFERENCES public.career_paths(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Intermediate',
    required_skills TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    estimated_duration TEXT DEFAULT '2 Weeks',
    requirements TEXT[] DEFAULT '{}',
    resources JSONB DEFAULT '[]'::jsonb,
    deadline TIMESTAMPTZ,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. Project Progress
CREATE TABLE IF NOT EXISTS public.project_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'planning', 'development', 'testing', 'completed')),
    github_url TEXT DEFAULT '',
    live_demo_url TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    screenshots TEXT[] DEFAULT '{}',
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, project_id)
);

-- 19. Skills Directory
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 20. Student Skills
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    proficiency_level INT DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
    verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, skill_name)
);

-- 21. Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Award',
    badge_color TEXT DEFAULT 'amber',
    criteria_type TEXT NOT NULL,
    criteria_value INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 22. Student Achievements
CREATE TABLE IF NOT EXISTS public.student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- 23. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 24. AI Tools Directory
CREATE TABLE IF NOT EXISTS public.ai_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'Productivity',
    url TEXT NOT NULL,
    pricing TEXT DEFAULT 'Freemium' CHECK (pricing IN ('Free', 'Paid', 'Freemium')),
    use_case TEXT DEFAULT '',
    skill_level TEXT DEFAULT 'All Levels',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 25. AI Conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 26. Admin Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_roadmaps_career ON public.roadmaps(career_path_id);
CREATE INDEX IF NOT EXISTS idx_phases_roadmap ON public.roadmap_phases(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_modules_phase ON public.modules(phase_id);
CREATE INDEX IF NOT EXISTS idx_topics_module ON public.topics(module_id);
CREATE INDEX IF NOT EXISTS idx_materials_topic ON public.study_materials(topic_id);
CREATE INDEX IF NOT EXISTS idx_tasks_topic ON public.tasks(topic_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_user ON public.task_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_material_progress_user ON public.material_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_progress_user ON public.project_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view their own profile; Admins can view and manage all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

-- Published Content: Public/students can read published content; Admins have full CRUD
CREATE POLICY "Anyone can read published careers" ON public.career_paths FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage careers" ON public.career_paths FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published roadmaps" ON public.roadmaps FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage roadmaps" ON public.roadmaps FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published phases" ON public.roadmap_phases FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage phases" ON public.roadmap_phases FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published modules" ON public.modules FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published topics" ON public.topics FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage topics" ON public.topics FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published materials" ON public.study_materials FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage materials" ON public.study_materials FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published tasks" ON public.tasks FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage tasks" ON public.tasks FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published quizzes" ON public.quizzes FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage quizzes" ON public.quizzes FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read quiz questions" ON public.quiz_questions FOR SELECT USING (EXISTS (SELECT 1 FROM public.quizzes WHERE quizzes.id = quiz_questions.quiz_id AND (quizzes.status = 'published' OR public.is_admin())));
CREATE POLICY "Admins manage quiz questions" ON public.quiz_questions FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published projects" ON public.projects FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read published AI tools" ON public.ai_tools FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage AI tools" ON public.ai_tools FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins manage achievements" ON public.achievements FOR ALL USING (public.is_admin());

-- User Progress: Only owner can access and modify
CREATE POLICY "User task progress" ON public.task_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User material progress" ON public.material_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User project progress" ON public.project_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User skills" ON public.student_skills FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User achievements" ON public.student_achievements FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User AI conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Admin logs: Admins only
CREATE POLICY "Admins view logs" ON public.admin_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins insert logs" ON public.admin_logs FOR INSERT WITH CHECK (public.is_admin());

-- ==============================================================================
-- TRIGGER FOR AUTOMATIC PROFILE CREATION ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- NO SEED/DEMO DATA
-- Database begins completely empty. Content is created by Admin through the UI.
-- ==============================================================================
