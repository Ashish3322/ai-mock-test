import React, { useState, useEffect } from 'react';
import {
  ListChecks,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Filter,
  CheckCircle2,
  HelpCircle,
  Code2,
  Save,
} from 'lucide-react';
import { adminApi, mcqApi } from '../../services/api';
import { McqQuestion } from '../../types';
import { useToast } from '../../context/ToastContext';

const TRACK_OPTIONS = [
  { id: 'java', label: 'Java & OOPs' },
  { id: 'react', label: 'Frontend & React' },
  { id: 'python', label: 'Python' },
  { id: 'database', label: 'Database & SQL' },
  { id: 'backend', label: 'Backend & Systems' },
  { id: 'aptitude', label: 'Aptitude & Logic' },
  { id: 'cpp', label: 'C++ & Low-Level' },
  { id: 'cloud', label: 'Cloud & DevOps' },
];

export const AdminMcqPage: React.FC = () => {
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('ALL');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('ALL');

  // Modal State for Add / Edit MCQ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<McqQuestion | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [track, setTrack] = useState('java');
  const [category, setCategory] = useState('Core Java');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionText, setQuestionText] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [explanation, setExplanation] = useState('');

  const { success, error } = useToast();

  const loadData = () => {
    adminApi
      .getAdminMcqs()
      .then((data) => setQuestions(data))
      .catch((err) => {
        console.error('Failed to load MCQs', err);
        error('Could not load MCQ repository.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingQuestion(null);
    setTrack('java');
    setCategory('Core Java');
    setDifficulty('Medium');
    setQuestionText('');
    setCodeSnippet('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswerIndex(0);
    setExplanation('');
    setIsModalOpen(true);
  };

  const openEditModal = (q: McqQuestion) => {
    setEditingQuestion(q);
    setTrack(q.track.toLowerCase());
    setCategory(q.category);
    setDifficulty(q.difficulty);
    setQuestionText(q.question);
    setCodeSnippet(q.codeSnippet || '');
    setOptionA(q.options?.[0] || '');
    setOptionB(q.options?.[1] || '');
    setOptionC(q.options?.[2] || '');
    setOptionD(q.options?.[3] || '');
    setCorrectAnswerIndex(q.correctAnswerIndex ?? 0);
    setExplanation(q.explanation);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim() || !explanation.trim()) {
      error('Please fill in all required question, options, and explanation fields.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        track,
        category,
        difficulty,
        question: questionText,
        codeSnippet: codeSnippet.trim() ? codeSnippet : undefined,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswerIndex,
        explanation,
      };

      if (editingQuestion) {
        await adminApi.updateMcq(editingQuestion.id, payload);
        success('MCQ question updated successfully!');
      } else {
        await adminApi.createMcq(payload);
        success('New MCQ successfully added to question bank.');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this MCQ question?')) return;

    try {
      await adminApi.deleteMcq(id);
      success('Question deleted.');
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      error('Failed to delete question.');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrack = selectedTrackFilter === 'ALL' || q.track.toLowerCase() === selectedTrackFilter.toLowerCase();
    const matchesDiff = selectedDifficultyFilter === 'ALL' || q.difficulty.toLowerCase() === selectedDifficultyFilter.toLowerCase();
    return matchesSearch && matchesTrack && matchesDiff;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading">
            MCQ Question Bank
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage practice questions across all engineering tracks. Total: {questions.length} questions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keywords, category, or explanation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedTrackFilter}
            onChange={(e) => setSelectedTrackFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Tracks</option>
            {TRACK_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedDifficultyFilter}
            onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions List Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading questions...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No MCQ questions match your current filters.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Track & Category</th>
                  <th className="px-5 py-3.5">Difficulty</th>
                  <th className="px-5 py-3.5">Question & Answer</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-5 py-4 text-xs font-mono text-slate-500">{q.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-indigo-400 text-xs uppercase tracking-wider">
                          {q.track}
                        </span>
                        <span className="text-white text-sm mt-0.5">{q.category}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-lg">
                      <p className="font-medium text-slate-200 line-clamp-2">{q.question}</p>
                      {q.options && q.options[q.correctAnswerIndex] && (
                        <p className="text-xs text-emerald-400 mt-1 line-clamp-1">
                          ✓ Correct: {q.options[q.correctAnswerIndex]}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(q)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit question"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit MCQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white font-heading">
                {editingQuestion ? 'Edit MCQ Question' : 'Add New MCQ Question'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Track */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">Track</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {TRACK_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Collections"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Difficulty */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">Question Text</label>
                <textarea
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the question statement..."
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Code Snippet (Optional) */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="Optional code snippet to accompany the question..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Options & Correct Answer
                </label>

                {[
                  { label: 'A', value: optionA, setter: setOptionA, idx: 0 },
                  { label: 'B', value: optionB, setter: setOptionB, idx: 1 },
                  { label: 'C', value: optionC, setter: setOptionC, idx: 2 },
                  { label: 'D', value: optionD, setter: setOptionD, idx: 3 },
                ].map((opt) => (
                  <div key={opt.label} className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctAnswerIndex === opt.idx}
                      onChange={() => setCorrectAnswerIndex(opt.idx)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      title="Select as correct answer"
                    />
                    <span className="w-6 text-xs font-bold text-slate-400">{opt.label}</span>
                    <input
                      type="text"
                      value={opt.value}
                      onChange={(e) => opt.setter(e.target.value)}
                      placeholder={`Option ${opt.label} text`}
                      required
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
                <p className="text-xs text-slate-400">Select the radio button beside the correct option.</p>
              </div>

              {/* Explanation */}
              <div className="space-y-1 pt-1">
                <label className="block text-xs font-medium text-slate-300">Technical Explanation</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why the correct answer is right and other options are incorrect..."
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMcqPage;
