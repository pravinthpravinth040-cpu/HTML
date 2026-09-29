import React, { useState } from 'react';
import {
  Users,
  Search,
  GraduationCap,
  Calendar,
  Clock,
  Flame,
  Award,
  BookOpen,
  FolderGit2,
  ExternalLink,
  Mail,
  UserCheck
} from 'lucide-react';
import { GithubIcon, LinkedInIcon } from '../common/BrandIcons';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../common/EmptyState';
import { StudentProfile } from '../../types';

export const AdminStudentsList: React.FC = () => {
  const { students, careers } = useData();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const filtered = students.filter(
    s =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.college && s.college.toLowerCase().includes(search.toLowerCase())) ||
      (s.degree && s.degree.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
            Registered Student Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real student accounts registered via Supabase Auth. Starts at 0 until students enroll.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300">
          Total Students: <strong className="text-brand-400">{students.length}</strong>
        </div>
      </div>

      {/* Search Input */}
      {students.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students by name, email, college, or degree..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      )}

      {/* Students Table or Empty State */}
      {students.length === 0 ? (
        <EmptyState
          icon="default"
          title="0 Students Registered"
          description="There are currently no student accounts registered in the database. New student accounts created through the registration portal will appear here in real time."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Students Match Search"
          description={`No student records match "${search}".`}
          compact
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">College / Degree</th>
                <th className="p-4">Target Career</th>
                <th className="p-4">Daily Study Goal</th>
                <th className="p-4">Enrolled Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(student => {
                const targetCareer = careers.find(c => c.id === student.targetCareerId);

                return (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center">
                          {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{student.fullName}</p>
                          <p className="text-[11px] text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300">{student.college || 'Not specified'}</p>
                      <p className="text-[11px] text-slate-500">{student.degree || 'Degree pending'}</p>
                    </td>
                    <td className="p-4">
                      {targetCareer ? (
                        <span className="px-2 py-0.5 rounded-md bg-brand-950/50 text-brand-300 border border-brand-800/40 font-medium">
                          {targetCareer.title}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">No career selected</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-300 font-mono">
                      {student.dailyAvailableHours || 2} hrs/day
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">
                Student Profile Telemetry
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">Full Name:</span>
                <p className="text-slate-200 font-bold">{selectedStudent.fullName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Email:</span>
                <p className="text-slate-200">{selectedStudent.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">College & Degree:</span>
                <p className="text-slate-200">
                  {selectedStudent.college || 'N/A'} • {selectedStudent.degree || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Graduation Year:</span>
                <p className="text-slate-200">{selectedStudent.graduationYear || 'Not provided'}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex gap-4">
                {selectedStudent.githubUrl && (
                  <a
                    href={selectedStudent.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <GithubIcon className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {selectedStudent.linkedinUrl && (
                  <a
                    href={selectedStudent.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
                {selectedStudent.portfolioUrl && (
                  <a
                    href={selectedStudent.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
