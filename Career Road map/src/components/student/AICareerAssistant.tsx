import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Key,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { askAICareerAssistant, AIContext } from '../../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AICareerAssistant: React.FC = () => {
  const { profile } = useAuth();
  const {
    selectedCareer,
    topics,
    completedTopicIds,
    projects,
    projectProgress,
    studySessions,
    currentStreak,
  } = useData();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: `Hello ${profile?.fullName || 'there'}! I am your AI Career Mentor. I have direct access to your real database progress in CareerPath.\n\nAsk me:\n• *"What should I study today?"*\n• *"How much progress have I made?"*\n• *"Give me a project idea for my career track"*\n• *"Create a custom study plan"*\n• *"Prepare interview questions"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: 'msg_' + Date.now().toString(36),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    const completedTopicsList = topics.filter(t => completedTopicIds.includes(t.id));
    const pendingTopicsList = topics.filter(t => !completedTopicIds.includes(t.id) && t.status === 'published');

    const context: AIContext = {
      studentProfile: profile,
      selectedCareer,
      completedTopics: completedTopicsList,
      pendingTopics: pendingTopicsList,
      projects,
      projectProgress,
      studySessions,
      currentStreak,
    };

    try {
      const response = await askAICareerAssistant(textToSend, context, customKey);
      const aiMsg: Message = {
        id: 'msg_ai_' + Date.now().toString(36),
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'msg_err_' + Date.now().toString(36),
        sender: 'assistant',
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'What should I study today?',
    'How much progress have I made?',
    'Give me a project idea',
    'Prepare interview questions',
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100">AI Career Assistant</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Context-Aware
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Answers grounded strictly in your real database progress & roadmap
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKeyModal(!showKeyModal)}
          className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>API Key {customKey ? '(Active)' : '(Optional)'}</span>
        </button>
      </div>

      {/* Optional Custom API Key Modal */}
      {showKeyModal && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
          <span className="font-semibold text-slate-200 block">
            Custom OpenAI / Gemini API Key (Optional)
          </span>
          <p className="text-slate-400 text-[11px]">
            The AI Career Mentor already includes an intelligent built-in contextual engine. If you want direct GPT-4o-mini generation, paste your key below (stored in-memory only).
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={customKey}
              onChange={e => setCustomKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={() => setShowKeyModal(false)}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/10'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <span
                className={`block text-[10px] mt-2 font-mono ${
                  msg.sender === 'user' ? 'text-brand-200 text-right' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-400" />
              Analyzing your real roadmap data...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2 pt-1">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your AI Career Mentor..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50 transition-all shadow-lg shadow-brand-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
