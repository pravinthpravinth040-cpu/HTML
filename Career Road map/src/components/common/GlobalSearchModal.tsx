import React, { useState, useEffect } from 'react';
import { Search, X, Compass, Map, BookOpen, FolderGit2, Wrench, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, targetId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const { careers, roadmaps, topics, materials, projects, aiTools } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search published records strictly from real data
  const filteredCareers = q ? careers.filter(c => c.status === 'published' && (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))) : [];
  const filteredTopics = q ? topics.filter(t => t.status === 'published' && (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) : [];
  const filteredMaterials = q ? materials.filter(m => m.status === 'published' && (m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))) : [];
  const filteredProjects = q ? projects.filter(p => p.status === 'published' && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))) : [];
  const filteredAiTools = q ? aiTools.filter(t => t.status === 'published' && (t.toolName.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) : [];

  const totalResults =
    filteredCareers.length +
    filteredTopics.length +
    filteredMaterials.length +
    filteredProjects.length +
    filteredAiTools.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        {/* Input */}
        <div className="relative border-b border-slate-800 p-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search published careers, roadmap topics, materials, projects, AI tools..."
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords to search live database records.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No published database records match &quot;{query}&quot;.
            </div>
          ) : (
            <>
              {filteredCareers.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Careers ({filteredCareers.length})
                  </span>
                  <div className="space-y-1">
                    {filteredCareers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onNavigate('careers');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-indigo-400" />
                          <div>
                            <p className="font-semibold text-slate-200">{c.title}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{c.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredTopics.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Topics ({filteredTopics.length})
                  </span>
                  <div className="space-y-1">
                    {filteredTopics.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onNavigate('roadmap');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Map className="w-4 h-4 text-cyan-400" />
                          <div>
                            <p className="font-semibold text-slate-200">{t.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{t.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredMaterials.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Study Materials ({filteredMaterials.length})
                  </span>
                  <div className="space-y-1">
                    {filteredMaterials.map(m => (
                      <button
                        key={m.id}
                        onClick={() => {
                          onNavigate('materials');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="font-semibold text-slate-200">{m.title}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{m.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Projects ({filteredProjects.length})
                  </span>
                  <div className="space-y-1">
                    {filteredProjects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onNavigate('projects');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-pink-400" />
                          <div>
                            <p className="font-semibold text-slate-200">{p.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{p.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredAiTools.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    AI Tools ({filteredAiTools.length})
                  </span>
                  <div className="space-y-1">
                    {filteredAiTools.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onNavigate('ai-tools');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="font-semibold text-slate-200">{t.toolName}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{t.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
