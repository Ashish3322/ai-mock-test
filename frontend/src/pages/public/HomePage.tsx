import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Brain,
  CheckCircle2,
  BarChart3,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  Bot,
  Zap,
  Award,
  Terminal,
  PlayCircle,
  HelpCircle,
  ListChecks,
  BookOpen,
} from 'lucide-react';
import { rolesApi } from '../../services/api';
import { Role } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    rolesApi
      .getAll(true)
      .then((data) => setRoles(data))
      .catch((err) => console.error('Failed to load roles', err))
      .finally(() => setLoadingRoles(false));
  }, []);

  const handleRoleStart = (roleId: number) => {
    if (isAuthenticated) {
      navigate(`/start-interview?roleId=${roleId}`);
    } else {
      navigate(`/login?redirect=/start-interview?roleId=${roleId}`);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Feedback',
      description:
        'Instant multi-metric evaluation of your technical answers assessing correctness, relevance, completeness, and communication clarity.',
      tag: 'LLM Evaluator',
    },
    {
      icon: Briefcase,
      title: 'Role-Based Interviews',
      description:
        'Tailored question sets for Java Developer, React Frontend, Backend Systems, Full Stack, Python, Data Analyst, and Behavioral HR tracks.',
      tag: '8+ Tracks',
    },
    {
      icon: Zap,
      title: 'Instant Performance Analysis',
      description:
        'Receive immediate structured breakdowns with explicit strengths, missed technical nuances, and areas to improve before the next question.',
      tag: 'Real-time',
    },
    {
      icon: Clock,
      title: 'Interview History',
      description:
        'Every practice session is persistently recorded with full question-by-question logs, answers, and evaluations for post-interview review.',
      tag: 'Persistent',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description:
        'Visual radar breakdowns and trend charts displaying your evolution in conceptual depth, communication, and technical readiness over time.',
      tag: 'Analytics',
    },
    {
      icon: HelpCircle,
      title: 'Technical + HR Questions',
      description:
        'Comprehensive balance of data structures, architecture, framework internals, SQL queries, and STAR behavioral scenarios.',
      tag: 'Balanced Bank',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Role',
      description: 'Select your target engineering or analyst domain and desired difficulty level.',
    },
    {
      number: '02',
      title: 'Start Interview',
      description: 'Step into a distraction-free, timed mock session mimicking authentic tech interviews.',
    },
    {
      number: '03',
      title: 'Answer Questions',
      description: 'Articulate your solution, architecture choices, or STAR story in the response editor.',
    },
    {
      number: '04',
      title: 'Get AI Feedback',
      description: 'Unlock immediate scores, identified strengths, model answers, and improvement tips.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-28">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Campus Placement Preparation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Practice Interviews.{' '}
                <span className="block bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Build Confidence.
                </span>{' '}
                Get AI-Powered Feedback.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Prepare for your next technical interview with realistic role-based interviews and instant AI feedback. Master technical depth, communication clarity, and situational judgment.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/questions"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Interview Q&A (Answers)</span>
                </Link>

                <Link
                  to="/mcq"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-slate-100 hover:text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <ListChecks className="w-4 h-4 text-indigo-400" />
                  <span>MCQ Practice Arena</span>
                </Link>

                <Link
                  to={isAuthenticated ? '/start-interview' : '/login'}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
                >
                  <PlayCircle className="w-4 h-4 text-cyan-400" />
                  <span>Mock Simulator</span>
                </Link>
              </div>

              {/* Statistics Strip */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center lg:text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">10K+</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Practice Sessions</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">50+</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Interview Topics</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">AI</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Instant Feedback</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">24/7</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Available On-Demand</p>
                </div>
              </div>
            </div>

            {/* Right Column: AI Interview Simulator Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl shadow-indigo-500/10">
                {/* Simulator Window Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-800/80 text-[11px] font-mono text-indigo-300">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Interviewer • Active</span>
                  </div>
                </div>

                {/* Question Bubble */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px]">
                        Java Developer • Question 3/10
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300">
                        Medium
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-100">
                      "Explain the difference between HashMap and Hashtable in Java."
                    </p>
                  </div>

                  {/* Candidate Answer Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Candidate Response</span>
                      <span className="font-mono text-emerald-400">01:45</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed">
                      "HashMap is non-synchronized and faster, allowing one null key. Hashtable is legacy, thread-safe, and does not allow null keys..."
                    </p>
                  </div>

                  {/* AI Evaluation Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">AI Evaluation Score</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        8.5 / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Correctness</span>
                        <span className="font-bold text-slate-200">8 / 10</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Clarity</span>
                        <span className="font-bold text-slate-200">9 / 10</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-emerald-400 flex items-center space-x-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Good distinction between thread safety and null handling.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Specialized Preparation Sections Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span>Two Specialized Preparation Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Choose Your Preparation Mode
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Whether you want in-depth conceptual study with long-form model answers or rapid-fire MCQ practice, both sections are fully equipped and managed by administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Interview Questions & Answers */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 shadow-xl flex flex-col justify-between space-y-6 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Section 1 • Role-Based Interview Q&A
              </span>
              <h3 className="text-2xl font-bold text-white font-heading">
                Detailed Technical Questions & Long Answers
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore dedicated question banks organized strictly by job role. Study multi-paragraph model answers, key expected keywords, and conceptual architectural explanations for Frontend, Backend, Flutter, Java, Python, and Data Analyst roles.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Frontend Developer',
                  'Backend Developer',
                  'Full Stack Developer',
                  'Flutter Developer',
                  'Java Developer',
                  'Python Developer',
                  'Data Analyst',
                  'HR / Behavioral',
                ].map((r) => (
                  <span
                    key={r}
                    className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/80"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/questions"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <span>Browse Questions & Answers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-400">Long-form answers</span>
            </div>
          </div>

          {/* Card 2: MCQs Practice Arena */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-indigo-500/40 shadow-xl flex flex-col justify-between space-y-6 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <ListChecks className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Section 2 • MCQ Practice Arena
              </span>
              <h3 className="text-2xl font-bold text-white font-heading">
                Multiple-Choice Questions with Explanations
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Practice high-yield technical and placement MCQs with 4 options, instant correct answer validation, technical explanations, and timed quiz modes across 8 core engineering tracks.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Java & OOPs',
                  'React & Frontend',
                  'Python Internals',
                  'Database & SQL',
                  'Backend Systems',
                  'Campus Aptitude',
                  'C++ Low-Level',
                  'Cloud & DevOps',
                ].map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/mcq"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <span>Enter MCQ Practice Arena</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-400">Practice & Timed Modes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-800/50 text-indigo-400 text-xs font-medium">
            <span>Built For Placement Success</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Interview Engine
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Everything you need to transition from passive reading to active, realistic interview practice under interview conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all hover:bg-slate-900 hover:-translate-y-1 duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MCQ Practice Showcase Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-y border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-indigo-950/20 to-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Description & Track Pills */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <ListChecks className="w-4 h-4" /> Dedicated MCQ Arena
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Master Technical & Placement MCQs with Real-Time Explanations
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Test your conceptual depth before your mock interview. Practice high-frequency multiple-choice questions covering Java internals, React hooks, Python GIL, SQL indexing, and aptitude.
              </p>

              {/* Track tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  '☕ Core Java & OOPs',
                  '⚛️ React 19 & JS',
                  '🐍 Python Internals',
                  '🗄️ SQL & Indexing',
                  '🚀 System Design & APIs',
                  '🧠 Placement Aptitude',
                ].map((trackName, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/70 text-xs font-medium text-slate-200"
                  >
                    {trackName}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/mcq"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <ListChecks className="w-4 h-4" />
                  <span>Open MCQ Practice Arena</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant Answers & Explanations</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Card Mockup */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl shadow-indigo-950/40 relative">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold uppercase">
                    Sample Question • Java OOP
                  </span>
                  <span className="text-emerald-400 font-medium">Practice Mode</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                  Which principle is violated when a subclass cannot substitute for its base class without breaking correctness?
                </h3>

                <div className="space-y-2.5 text-sm">
                  {[
                    { label: 'A', text: 'Single Responsibility Principle (SRP)', correct: false },
                    { label: 'B', text: 'Open/Closed Principle (OCP)', correct: false },
                    { label: 'C', text: 'Liskov Substitution Principle (LSP)', correct: true, selected: true },
                    { label: 'D', text: 'Dependency Inversion Principle (DIP)', correct: false },
                  ].map((opt, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                        opt.correct
                          ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                          opt.correct ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.correct ? '✓' : opt.label}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{opt.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
                  <p className="font-semibold mb-0.5">Explanation:</p>
                  <p className="text-slate-300">
                    Liskov Substitution Principle (LSP) requires that objects of a superclass can be replaced with objects of a subclass without affecting the correctness of the program.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 border-y border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Simulate an end-to-end technical interview in four intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((st, i) => (
              <div key={i} className="relative space-y-4 p-5 rounded-xl bg-slate-900/40 border border-slate-800">
                <span className="text-3xl font-extrabold text-indigo-500/50 font-mono">{st.number}</span>
                <h3 className="text-lg font-bold text-white">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Roles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-medium">
              <span>Tailored Tracks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Supported Roles & Tracks
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Practice specialized technical questions and behavioral scenarios aligned with campus hiring tests.
            </p>
          </div>

          <Link
            to="/start-interview"
            className="flex items-center space-x-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View all tracks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingRoles ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <RoleIcon name={role.icon || role.slug} className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                      {role.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{role.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                    {role.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    to={`/questions?role=${role.slug}`}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View Interview Q&A</span>
                  </Link>

                  <button
                    onClick={() => handleRoleStart(role.id)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-transparent text-xs font-semibold transition-all group-hover:shadow-lg group-hover:shadow-indigo-600/20 cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Take Mock Interview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-8 sm:p-12 lg:p-16 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Free Campus Student Edition</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to prepare for your next interview?
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Gain the confidence and technical precision demanded by top recruiters. Practice role-specific questions and unlock granular AI evaluation today.
          </p>

          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/start-interview' : '/register'}
              className="inline-flex items-center space-x-2.5 px-9 py-4 rounded-xl bg-white text-slate-950 font-bold text-base shadow-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Practicing Now</span>
              <ArrowRight className="w-5 h-5 text-indigo-600" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
