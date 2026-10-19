import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Code, Terminal, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">AI Interview Prep</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered placement interview practice platform designed for college engineering students and job seekers. Real role-based simulations with instant evaluative feedback.
          </p>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 py-1 px-2.5 rounded-full w-max">
            <Code className="w-3.5 h-3.5" />
            <span>Team Coffee & Code • MMDU</span>
          </div>
        </div>

        {/* Roles */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Supported Tracks</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/start-interview" className="hover:text-indigo-400 transition-colors">Java Developer</Link></li>
            <li><Link to="/start-interview" className="hover:text-indigo-400 transition-colors">Frontend & React</Link></li>
            <li><Link to="/start-interview" className="hover:text-indigo-400 transition-colors">Backend & Systems</Link></li>
            <li><Link to="/start-interview" className="hover:text-indigo-400 transition-colors">Full Stack Developer</Link></li>
            <li><Link to="/start-interview" className="hover:text-indigo-400 transition-colors">Python Developer</Link></li>
            <li><Link to="/start-interview" className="hover:text-indigo-400 transition-colors">HR & Behavioral</Link></li>
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/questions" className="text-indigo-300 hover:text-white transition-colors font-medium">Interview Questions & Answers</Link></li>
            <li><Link to="/mcq" className="text-indigo-300 hover:text-white transition-colors font-medium">MCQ Practice Arena</Link></li>
            <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Features & Capabilities</Link></li>
            <li><Link to="/about" className="hover:text-indigo-400 transition-colors">Project Synopsis & Team</Link></li>
            <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Student Dashboard</Link></li>
            <li><Link to="/history" className="hover:text-indigo-400 transition-colors">Interview Reports & History</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link></li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Architecture</h4>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">React 19</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">TypeScript</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Vite</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Spring Boot 3</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Java 21</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">MySQL / MariaDB</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Spring Security & JWT</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">AI Evaluation Engine</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 AI Interview Prep Platform. All rights reserved.</p>
        <p className="flex items-center space-x-1">
          <span>Engineered for campus placements & mock simulations</span>
        </p>
      </div>
    </footer>
  );
};
