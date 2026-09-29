import React, { useState } from 'react';
import { Wrench, ExternalLink, Sparkles, Filter, Search, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../common/EmptyState';

export const AIToolsDirectory: React.FC = () => {
  const { aiTools } = useData();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Show only published AI tools
  const publishedTools = aiTools.filter(t => t.status === 'published');

  const categories = ['All', ...Array.from(new Set(publishedTools.map(t => t.category)))];

  const filtered = publishedTools.filter(tool => {
    const matchesCat = categoryFilter === 'All' || tool.category === categoryFilter;
    const matchesSearch =
      tool.toolName.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase()) ||
      tool.useCase.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Wrench className="w-4 h-4" />
            <span>Curated Developer & AI Toolkit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">AI Tools Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Production AI tools, agents, prompt libraries, and code assistants recommended by your administrator.
          </p>
        </div>

        {publishedTools.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300">
            {publishedTools.length} Tools Available
          </div>
        )}
      </div>

      {/* Filter / Search Bar */}
      {publishedTools.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search AI tools by name, use case, or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tools Grid or Empty State */}
      {publishedTools.length === 0 ? (
        <EmptyState
          icon="default"
          title="No AI Tools Published Yet"
          description="Your administrator has not published any AI tools yet. Tools for coding, design, and productivity will appear here once added."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Tools Match Filters"
          description={`No tools found matching "${search}".`}
          compact
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(tool => (
            <div
              key={tool.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {tool.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      tool.pricing === 'Free'
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                        : tool.pricing === 'Freemium'
                        ? 'bg-blue-950/40 text-blue-300 border border-blue-800/40'
                        : 'bg-purple-950/40 text-purple-300 border border-purple-800/40'
                    }`}
                  >
                    {tool.pricing}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100">{tool.toolName}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>

                {tool.useCase && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300">
                    <span className="font-semibold text-brand-400 block text-[10px] uppercase">
                      Recommended Use Case:
                    </span>
                    {tool.useCase}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Level: <strong className="text-slate-400">{tool.skillLevel}</strong>
                </span>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  Visit Tool
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
