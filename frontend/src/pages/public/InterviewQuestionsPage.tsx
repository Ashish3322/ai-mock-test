import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Copy,
  Check,
  Tag,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { rolesApi, questionsApi } from '../../services/api';
import { Role, Question } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';
import { useToast } from '../../context/ToastContext';

export const InterviewQuestionsPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<number | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { success } = useToast();

  useEffect(() => {
    Promise.all([rolesApi.getAll(true), questionsApi.getAll()])
      .then(([rData, qData]) => {
        setRoles(rData);
        setQuestions(qData);

        // Check if roleId or role query param exists
        const roleParam = searchParams.get('role');
        const roleIdParam = searchParams.get('roleId');

        if (roleIdParam) {
          const matched = rData.find((r) => r.id === Number(roleIdParam));
          if (matched) setSelectedRoleId(matched.id);
        } else if (roleParam) {
          const matched = rData.find(
            (r) => r.slug.toLowerCase() === roleParam.toLowerCase() || r.name.toLowerCase().includes(roleParam.toLowerCase())
          );
          if (matched) setSelectedRoleId(matched.id);
        }
      })
      .catch((err) => {
        console.error('Failed to load interview questions & roles', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentRole = useMemo(() => {
    if (selectedRoleId === 'ALL') return null;
    return roles.find((r) => r.id === selectedRoleId) || null;
  }, [roles, selectedRoleId]);

  const categories = useMemo(() => {
    const relevant =
      selectedRoleId === 'ALL'
        ? questions
        : questions.filter((q) => q.roleId === selectedRoleId);
    const set = new Set<string>();
    relevant.forEach((q) => {
      if (q.category) set.add(q.category);
    });
    return Array.from(set).sort();
  }, [questions, selectedRoleId]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesRole = selectedRoleId === 'ALL' || q.roleId === selectedRoleId;
      const matchesDifficulty =
        selectedDifficulty === 'ALL' || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchesCategory =
        selectedCategory === 'ALL' || q.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchTerm.trim() ||
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.modelAnswer && q.modelAnswer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (q.expectedTopics && q.expectedTopics.toLowerCase().includes(searchTerm.toLowerCase())) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesRole && matchesDifficulty && matchesCategory && q.active !== false;
    });
  }, [questions, selectedRoleId, selectedDifficulty, selectedCategory, searchTerm]);

  const toggleExpand = (id: number) => {
    setExpandedQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectRole = (roleId: number | 'ALL') => {
    setSelectedRoleId(roleId);
    setSelectedCategory('ALL');
    if (roleId === 'ALL') {
      setSearchParams({});
    } else {
      const r = roles.find((item) => item.id === roleId);
      if (r) setSearchParams({ role: r.slug });
    }
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Model answer copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const expandAll = () => {
    const map: Record<number, boolean> = {};
    filteredQuestions.forEach((q) => {
      map[q.id] = true;
    });
    setExpandedQuestionIds(map);
  };

  const collapseAll = () => {
    setExpandedQuestionIds({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Section 1: Technical Interview Q&A Repository</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-heading">
            Role-Based Interview Questions & Answers
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Master your technical rounds with comprehensive questions, multi-paragraph model answers, and expected concept breakdowns curated for top engineering roles.
          </p>
        </div>

        {/* Roles Navigation Pills / Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Job Role / Track:
            </span>
            <span className="text-xs text-slate-400">
              {roles.length} Roles Available
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            <button
              onClick={() => handleSelectRole('ALL')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedRoleId === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-400/40'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>All Roles ({questions.length})</span>
            </button>

            {roles.map((role) => {
              const roleQuestionCount = questions.filter((q) => q.roleId === role.id && q.active !== false).length;
              const isSelected = selectedRoleId === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-400/40'
                      : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <RoleIcon name={role.icon || role.slug} className="w-4 h-4" />
                  <span>{role.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isSelected ? 'bg-indigo-700/60 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {roleQuestionCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Banner (If a specific role is selected) */}
        {currentRole && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-slate-900/40 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <RoleIcon name={currentRole.icon || currentRole.slug} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-white font-heading">{currentRole.name}</h2>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      currentRole.difficulty === 'Hard'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                        : currentRole.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {currentRole.difficulty || 'Medium'} Track
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  {currentRole.description}
                </p>
              </div>
            </div>

            <Link
              to={`/start-interview?roleId=${currentRole.id}`}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all shrink-0 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Take AI Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions, model answers, keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Expand / Collapse All */}
          <div className="sm:col-span-2 flex items-center justify-end space-x-2">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Expand all answers"
            >
              Expand All
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Collapse all answers"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredQuestions.length}</strong> questions
            {selectedRoleId !== 'ALL' && currentRole ? ` for ${currentRole.name}` : ''}
          </span>
          <Link
            to="/mcq"
            className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1"
          >
            <span>Prefer MCQs? Try MCQ Practice Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Questions Cards List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
            <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-slate-200">No questions match your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or selecting a different role or difficulty level.
            </p>
            <button
              onClick={() => {
                setSelectedRoleId('ALL');
                setSelectedDifficulty('ALL');
                setSelectedCategory('ALL');
                setSearchTerm('');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = !!expandedQuestionIds[q.id];
              const roleName = q.roleName || roles.find((r) => r.id === q.roleId)?.name || 'General';

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'bg-slate-900/90 border-indigo-500/40 shadow-xl'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  {/* Card Header / Prompt */}
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-5 sm:p-6 cursor-pointer select-none flex items-start justify-between gap-4"
                  >
                    <div className="space-y-2.5 flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                          Q{idx + 1}
                        </span>

                        <span className="text-[11px] px-2.5 py-0.5 rounded-md font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {roleName}
                        </span>

                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium">
                          {q.category}
                        </span>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            q.difficulty === 'Hard'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                        {q.questionText}
                      </h3>
                    </div>

                    {/* Expand Toggle Button */}
                    <div className="flex items-center space-x-2 pt-1 shrink-0">
                      <span className="text-xs text-indigo-400 font-medium hidden sm:inline-block">
                        {isExpanded ? 'Hide Answer' : 'View Answer'}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isExpanded ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Model Answer Section */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-slate-800/80 space-y-4">
                      {/* Expected Keywords / Topics */}
                      {q.expectedTopics && (
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                            <Tag className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Key Concepts Evaluated:</span>
                          </span>
                          {q.expectedTopics.split(',').map((topic, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[11px] font-medium border border-slate-700/80"
                            >
                              {topic.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Model Answer Body */}
                      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Comprehensive Model Answer & Explanation</span>
                          </div>

                          {q.modelAnswer && (
                            <button
                              onClick={() => handleCopy(q.id, q.modelAnswer || '')}
                              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                              {copiedId === q.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                          {q.modelAnswer || 'No detailed model answer has been provided for this question yet.'}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <span className="text-xs text-slate-400">
                          Recommended answer for standard technical interview rounds.
                        </span>

                        <Link
                          to={`/start-interview?roleId=${q.roleId}`}
                          className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Practice this in Mock Interview Simulator</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-cyan-900/30 border border-indigo-500/20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white font-heading">
            Ready to test your answers in a real simulation?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Our AI interviewer listens to your responses, transcribes them in real time, and scores your conceptual depth against industry standards.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/start-interview"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start AI Mock Interview</span>
            </Link>
            <Link
              to="/mcq"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
            >
              <span>Practice MCQs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionsPage;
