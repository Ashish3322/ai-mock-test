import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  HelpCircle,
  Briefcase,
  History,
  TrendingUp,
  Shield,
  ArrowRight,
  Plus,
  ListChecks,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminStats } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load admin stats', err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      subtext: 'Registered candidates & admins',
      icon: Users,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      link: '/admin/users',
    },
    {
      title: 'Total Interviews',
      value: stats?.totalInterviews || 0,
      subtext: 'Completed & active sessions',
      icon: History,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      link: '/admin/interviews',
    },
    {
      title: 'Total Questions',
      value: stats?.totalQuestions || 0,
      subtext: 'Categorized question bank items',
      icon: HelpCircle,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      link: '/admin/questions',
    },
    {
      title: 'Platform Avg Score',
      value: `${stats?.averageScore || 0}%`,
      subtext: 'Mean score across all completed tests',
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      link: '/admin/interviews',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
            <Shield className="w-7 h-7 text-amber-400" />
            <span>Admin Overview</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            System metrics, question bank status, and candidate activity across the platform.
          </p>
        </div>

        <Link
          to="/admin/questions"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all shadow-md group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
                {card.value}
              </div>
              <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/mcqs"
          className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ListChecks className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            MCQ Question Bank
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create, view, and manage multiple-choice placement questions across 8 technical tracks.
          </p>
          <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1 pt-2">
            <span>Manage MCQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/questions"
          className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
            Manage Interview Questions
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create, modify, and calibrate model answers for technical mock interview questions.
          </p>
          <span className="text-xs font-semibold text-indigo-400 flex items-center space-x-1 pt-2">
            <span>Open Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/roles"
          className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
            Manage Interview Roles
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Define new target roles, adjust difficulty ratings, and configure domain slugs.
          </p>
          <span className="text-xs font-semibold text-cyan-400 flex items-center space-x-1 pt-2">
            <span>Open Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/users"
          className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
            View Registered Users
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Audit registered candidates, primary career tracks, and platform enrollment dates.
          </p>
          <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1 pt-2">
            <span>Open Users</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
};
