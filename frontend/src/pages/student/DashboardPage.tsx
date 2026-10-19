import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlayCircle,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ListChecks,
} from 'lucide-react';
import { dashboardApi } from '../../services/api';
import { DashboardStats } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { RoleIcon } from '../../components/common/RoleIcon';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    dashboardApi
      .getStudentStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load student dashboard stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-28 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-2xl bg-slate-900 border border-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-900 border border-slate-800" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Interviews',
      value: stats?.totalInterviews || 0,
      subtext: 'Practice sessions initiated',
      icon: Clock,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Average Score',
      value: `${stats?.averageScore || 0}%`,
      subtext: 'Mean platform score',
      icon: TrendingUp,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Best Score',
      value: `${stats?.bestScore || 0}%`,
      subtext: 'Personal record',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Completed Sessions',
      value: stats?.completedSessions || 0,
      subtext: 'Full evaluations submitted',
      icon: CheckCircle2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  const skillEntries = Object.entries(stats?.skillsBreakdown || {});

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner / Welcome Strip */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/30 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Goal: {user?.targetRole || 'Software Engineer'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to simulate your next technical round?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Practice realistic questions with instant AI feedback and detailed evaluation metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/start-interview"
            className="inline-flex items-center justify-center space-x-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-cyan-400 transition-all hover:scale-105 active:scale-95"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Start Interview</span>
          </Link>
          <Link
            to="/mcq"
            className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-indigo-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-all shadow-md"
          >
            <ListChecks className="w-4 h-4 text-indigo-400" />
            <span>Practice MCQs</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{card.value}</p>
              <p className="text-xs text-slate-400">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Grid: Skills Progress & Recent Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Interviews (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Interviews</h3>
              <p className="text-xs text-slate-400">Your latest practice performance records</p>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!stats?.recentInterviews || stats.recentInterviews.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">No interview sessions attempted yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Begin your first mock technical round to build your personalized skill report.
              </p>
              <Link
                to="/start-interview"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recentInterviews.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 font-medium text-slate-200">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <RoleIcon name={session.roleIcon} className="w-3.5 h-3.5" />
                          </div>
                          <span>{session.roleName}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-400">
                        {new Date(session.startedAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-slate-100">
                          {session.overallScore ? `${session.overallScore}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            session.status === 'COMPLETED'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {session.status === 'COMPLETED' ? (
                          <Link
                            to={`/report/${session.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all font-semibold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Report</span>
                          </Link>
                        ) : (
                          <Link
                            to={`/interview/${session.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 transition-all font-semibold"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Skills Progress Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Skills Proficiency</span>
            </h3>
            <p className="text-xs text-slate-400">Calculated across attempted interview responses</p>
          </div>

          <div className="space-y-4">
            {skillEntries.map(([skill, val]) => (
              <div key={skill} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{skill}</span>
                  <span className="font-bold text-indigo-400">{Math.round(val)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, val))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              to="/progress"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-center space-x-1 w-full py-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/30 transition-colors"
            >
              <span>Explore Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Strengths & Areas to Improve Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Demonstrated Strengths</h4>
              <p className="text-[11px] text-slate-400">Recognized by AI evaluator in recent responses</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {stats?.strengths?.map((str, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Areas to Improve</h4>
              <p className="text-[11px] text-slate-400">Focus on these nuances during upcoming sessions</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {stats?.areasToImprove?.map((area, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
