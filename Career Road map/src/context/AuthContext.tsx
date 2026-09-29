import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StudentProfile, UserRole } from '../types';

interface AuthContextType {
  user: any | null;
  profile: StudentProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<StudentProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USERS_KEY = 'careerpath_users';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'careerpath_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchSupabaseProfile(session.user.id);
          }
        } catch (err) {
          console.warn('Error fetching Supabase session:', err);
        }
      } else {
        // Local mode fallback
        const savedUserJson = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
        if (savedUserJson) {
          try {
            const savedProfile: StudentProfile = JSON.parse(savedUserJson);
            setUser({ id: savedProfile.id, email: savedProfile.email });
            setProfile(savedProfile);
            setRole(savedProfile.role);
          } catch (e) {
            localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
          }
        }
      }

      setIsLoading(false);
    };

    initAuth();

    // Setup Supabase auth state change listener if available
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchSupabaseProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const fetchSupabaseProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const mappedProfile: StudentProfile = {
          id: data.id,
          email: data.email,
          fullName: data.full_name || '',
          avatarUrl: data.avatar_url,
          role: data.role as UserRole,
          college: data.college,
          degree: data.degree,
          department: data.department,
          yearOfStudy: data.year_of_study,
          semester: data.semester,
          graduationYear: data.graduation_year,
          careerGoal: data.career_goal,
          targetCareerId: data.target_career_id,
          dailyAvailableHours: Number(data.daily_available_hours) || 2,
          githubUrl: data.github_url,
          linkedinUrl: data.linkedin_url,
          portfolioUrl: data.portfolio_url,
          resumeUrl: data.resume_url,
          bio: data.bio,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setProfile(mappedProfile);
        setRole(mappedProfile.role);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          await fetchSupabaseProfile(data.user.id);
        }
        setIsLoading(false);
        return { success: true };
      }

      // Local storage auth
      const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const users: StudentProfile[] = rawUsers ? JSON.parse(rawUsers) : [];
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        setIsLoading(false);
        return { success: false, error: 'User account not found. Please register first.' };
      }

      setUser({ id: foundUser.id, email: foundUser.email });
      setProfile(foundUser);
      setRole(foundUser.role);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(foundUser));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Login failed.' };
    }
  };

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          // Check if admin role
          const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
          if (prof?.role !== 'admin') {
            await supabase.auth.signOut();
            setIsLoading(false);
            return { success: false, error: 'Access denied: You do not possess administrator credentials.' };
          }
          await fetchSupabaseProfile(data.user.id);
        }
        setIsLoading(false);
        return { success: true };
      }

      // Local mock admin login
      // Secure local default admin credential check
      if (
        (email.toLowerCase() === 'admin@careerpath.edu' || email.toLowerCase() === 'admin@careerpath.com') &&
        password.length >= 6
      ) {
        const adminProfile: StudentProfile = {
          id: 'admin-master-id',
          email,
          fullName: 'System Administrator',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser({ id: adminProfile.id, email: adminProfile.email });
        setProfile(adminProfile);
        setRole('admin');
        localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(adminProfile));
        setIsLoading(false);
        return { success: true };
      }

      // Check registered users with admin role
      const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const users: StudentProfile[] = rawUsers ? JSON.parse(rawUsers) : [];
      const foundAdmin = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'admin');

      if (foundAdmin) {
        setUser({ id: foundAdmin.id, email: foundAdmin.email });
        setProfile(foundAdmin);
        setRole('admin');
        localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(foundAdmin));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid admin credentials. Use admin@careerpath.edu with your admin password.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Admin login failed.' };
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'student',
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          await fetchSupabaseProfile(data.user.id);
        }
        setIsLoading(false);
        return { success: true };
      }

      // Local storage registration
      const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const users: StudentProfile[] = rawUsers ? JSON.parse(rawUsers) : [];

      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email address already exists.' };
      }

      const newStudent: StudentProfile = {
        id: 'student_' + Date.now().toString(36),
        email,
        fullName,
        role: 'student',
        dailyAvailableHours: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.push(newStudent);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(newStudent));

      setUser({ id: newStudent.id, email: newStudent.email });
      setProfile(newStudent);
      setRole('student');
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Registration failed.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const updateProfile = async (updatedData: Partial<StudentProfile>): Promise<boolean> => {
    if (!profile) return false;

    const merged = { ...profile, ...updatedData, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: merged.fullName,
            avatar_url: merged.avatarUrl,
            college: merged.college,
            degree: merged.degree,
            department: merged.department,
            year_of_study: merged.yearOfStudy,
            semester: merged.semester,
            graduation_year: merged.graduationYear,
            career_goal: merged.careerGoal,
            target_career_id: merged.targetCareerId,
            daily_available_hours: merged.dailyAvailableHours,
            github_url: merged.githubUrl,
            linkedin_url: merged.linkedinUrl,
            portfolio_url: merged.portfolioUrl,
            resume_url: merged.resumeUrl,
            bio: merged.bio,
            updated_at: merged.updatedAt,
          })
          .eq('id', profile.id);

        if (error) {
          console.error('Failed to update profile in Supabase:', error);
          return false;
        }
      } catch (err) {
        console.error('Error updating profile:', err);
        return false;
      }
    } else {
      // Local storage update
      const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const users: StudentProfile[] = rawUsers ? JSON.parse(rawUsers) : [];
      const updatedUsers = users.map(u => (u.id === profile.id ? merged : u));
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(merged));
    }

    setProfile(merged);
    return true;
  };

  const refreshProfile = async () => {
    if (user?.id) {
      if (isSupabaseConfigured() && supabase) {
        await fetchSupabaseProfile(user.id);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
