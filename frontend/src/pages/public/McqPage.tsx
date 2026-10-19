import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Award,
  Layers,
  Code2,
  Coffee,
  Database,
  Server,
  BrainCircuit,
  Filter,
  Check,
  ChevronRight,
  Zap,
  Cpu,
  Cloud,
} from 'lucide-react';
import { mcqApi } from '../../services/api';
import { McqQuestion } from '../../types';

// Fallback comprehensive questions for instant loading
const FALLBACK_QUESTIONS: McqQuestion[] = [
  {
    id: 1,
    track: 'java',
    category: 'Core Java',
    difficulty: 'Medium',
    question: 'What will be the output of the following Java code snippet?',
    codeSnippet: `String s1 = "Hello";
String s2 = new String("Hello");
String s3 = s2.intern();
System.out.println((s1 == s2) + " " + (s1 == s3));`,
    options: ['true true', 'false true', 'false false', 'true false'],
    correctAnswerIndex: 1,
    explanation:
      's1 points to the String literal in the String Constant Pool. s2 points to a newly allocated object in the heap, so (s1 == s2) is false. Calling s2.intern() returns the canonical pool reference which equals s1, so (s1 == s3) is true.',
  },
  {
    id: 2,
    track: 'java',
    category: 'OOP Concepts',
    difficulty: 'Easy',
    question:
      'Which of the following principles is violated when a subclass cannot substitute for its base class without breaking application correctness?',
    options: [
      'Single Responsibility Principle (SRP)',
      'Open/Closed Principle (OCP)',
      'Liskov Substitution Principle (LSP)',
      'Dependency Inversion Principle (DIP)',
    ],
    correctAnswerIndex: 2,
    explanation:
      'The Liskov Substitution Principle (LSP) states that objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.',
  },
  {
    id: 3,
    track: 'java',
    category: 'Collections & Concurrency',
    difficulty: 'Hard',
    question:
      'How does ConcurrentHashMap achieve thread safety without synchronizing entire read operations in Java 8+?',
    options: [
      'By synchronizing the entire table on every access',
      'Using synchronized blocks on bucket head nodes (in Java 8+) and lock-free CAS reads via volatile node pointers',
      'By wrapping each bucket in a ReentrantReadWriteLock',
      'By cloning the internal array on every mutation (CopyOnWrite strategy)',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Since Java 8, ConcurrentHashMap uses CAS (Compare-And-Swap) for empty bucket insertions and synchronizes only on the head node of a hash bucket for collision inserts. Volatile val and next pointers enable fully lock-free concurrent reads.',
  },
  {
    id: 4,
    track: 'java',
    category: 'JVM & Memory',
    difficulty: 'Medium',
    question: 'Where are static variables stored in Java 8 and later versions?',
    options: [
      'PermGen space',
      'Directly on the JVM Call Stack',
      'Metaspace (native memory)',
      'Heap memory (as part of the Class mirror object)',
    ],
    correctAnswerIndex: 3,
    explanation:
      'Since Java 8, PermGen was removed. While class metadata moved to Metaspace (off-heap native memory), static fields and interned Strings were moved into the regular Java Heap as part of the java.lang.Class object.',
  },
  {
    id: 5,
    track: 'react',
    category: 'React Hooks',
    difficulty: 'Medium',
    question: 'What happens when you return a function from the useEffect hook in React?',
    codeSnippet: `useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}, []);`,
    options: [
      'It creates a recursive call cycle',
      'It registers a cleanup function executed before unmounting or before the next effect run',
      'It will re-render the component twice on every state change',
      'It throws a runtime error in StrictMode',
    ],
    correctAnswerIndex: 1,
    explanation:
      'The function returned from useEffect serves as the cleanup phase. React runs it before applying the effect on subsequent renders and when the component unmounts to prevent memory leaks.',
  },
  {
    id: 6,
    track: 'react',
    category: 'JavaScript Core',
    difficulty: 'Medium',
    question: 'What will be printed to the console?',
    codeSnippet: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);`,
    options: ['1, 2, 3, 4', '1, 4, 2, 3', '1, 4, 3, 2', '1, 3, 4, 2'],
    correctAnswerIndex: 2,
    explanation:
      'Synchronous code runs first (1, 4). Microtasks (Promise.then) run immediately after synchronous tasks (3). Macrotasks (setTimeout) run in the subsequent event loop tick (2). Result: 1, 4, 3, 2.',
  },
  {
    id: 7,
    track: 'react',
    category: 'React Performance',
    difficulty: 'Hard',
    question: 'What is the primary difference between useMemo and useCallback in React?',
    options: [
      'useMemo caches JSX elements; useCallback caches Redux actions',
      'useMemo caches a computed value; useCallback caches a function definition',
      'useCallback runs asynchronously; useMemo runs synchronously',
      'There is no difference; useCallback is an alias for useMemo',
    ],
    correctAnswerIndex: 1,
    explanation:
      'useMemo invokes its function and memoizes the returned calculated result. useCallback memoizes the callback function instance itself between renders to avoid unnecessary child re-renders.',
  },
  {
    id: 8,
    track: 'react',
    category: 'CSS & Layout',
    difficulty: 'Easy',
    question: 'In CSS Flexbox, which property aligns items along the cross-axis?',
    options: ['justify-content', 'align-items', 'flex-direction', 'align-content'],
    correctAnswerIndex: 1,
    explanation:
      'align-items aligns flex items along the cross-axis. justify-content aligns items along the main axis.',
  },
  {
    id: 9,
    track: 'python',
    category: 'Python Internals',
    difficulty: 'Medium',
    question: 'What is the output of the following Python snippet?',
    codeSnippet: `def append_item(val, items=[]):
    items.append(val)
    return items

print(append_item(1))
print(append_item(2))`,
    options: [
      '[1] then [2]',
      '[1] then [1, 2]',
      'TypeError: default arguments cannot be mutable',
      '[1, 2] then [1, 2]',
    ],
    correctAnswerIndex: 1,
    explanation:
      'In Python, default parameter expressions are evaluated once when the function is defined, not each time it is called. Since a list is mutable, subsequent calls modify the same list object.',
  },
  {
    id: 10,
    track: 'python',
    category: 'GIL & Concurrency',
    difficulty: 'Hard',
    question: 'What is the Global Interpreter Lock (GIL) in CPython?',
    options: [
      'A lock that ensures multiple processes share RAM without conflicts',
      'A mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously',
      'A hardware-level memory lock for GPU calculations',
      'A security sandbox preventing arbitrary code execution',
    ],
    correctAnswerIndex: 1,
    explanation:
      'The CPython GIL is a mutual-exclusion lock that prevents multiple native threads from executing Python bytecodes at once, making CPU-bound multi-threading limited to a single core in standard CPython.',
  },
  {
    id: 11,
    track: 'python',
    category: 'Data Structures',
    difficulty: 'Easy',
    question:
      'What is the average time complexity of checking membership (item in collection) in a Python set?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswerIndex: 0,
    explanation:
      'Python sets are implemented using hash tables. Under average conditions with reasonable hash distribution, key lookup and membership testing take O(1) constant time.',
  },
  {
    id: 12,
    track: 'database',
    category: 'SQL Queries',
    difficulty: 'Medium',
    question:
      'What is the fundamental difference between the WHERE and HAVING clauses in SQL?',
    options: [
      'WHERE works only on numeric columns; HAVING works on text',
      'WHERE filters rows before aggregation; HAVING filters groups after aggregation',
      'HAVING is an ANSI SQL standard; WHERE is a proprietary MySQL extension',
      'WHERE can use aggregate functions like COUNT(); HAVING cannot',
    ],
    correctAnswerIndex: 1,
    explanation:
      'The WHERE clause filters individual records before any grouping (GROUP BY) takes place. The HAVING clause filters grouped summary records created by aggregate functions (SUM, AVG, COUNT, etc.).',
  },
  {
    id: 13,
    track: 'database',
    category: 'Transactions & ACID',
    difficulty: 'Hard',
    question:
      'Which isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads in standard ANSI SQL?',
    options: [
      'Read Uncommitted',
      'Read Committed',
      'Repeatable Read',
      'Serializable',
    ],
    correctAnswerIndex: 2,
    explanation:
      'Repeatable Read ensures that data read multiple times within a transaction will return the same values (preventing dirty & non-repeatable reads). However, newly inserted rows matching a range query (phantom reads) may still appear.',
  },
  {
    id: 14,
    track: 'database',
    category: 'Indexing',
    difficulty: 'Medium',
    question:
      'Why are B+ Trees preferred over regular B Trees for relational database indexing?',
    options: [
      'B+ Trees consume significantly less disk space for pointers',
      'All data records/pointers are stored strictly in leaf nodes and leaves are linked sequentially, providing efficient range scans',
      'B+ Trees have an O(1) lookup time compared to O(log n) for B Trees',
      'B+ Trees eliminate the need for write locks during inserts',
    ],
    correctAnswerIndex: 1,
    explanation:
      'In a B+ Tree, internal nodes only store navigation keys, allowing higher fan-out. All data resides in leaf nodes, and leaf nodes form a doubly linked list, which dramatically speeds up sequential range queries and full table scans.',
  },
  {
    id: 15,
    track: 'backend',
    category: 'REST & HTTP',
    difficulty: 'Easy',
    question:
      'Which HTTP method is defined as idempotent and used to replace an entire resource representation?',
    options: ['POST', 'PATCH', 'PUT', 'CONNECT'],
    correctAnswerIndex: 2,
    explanation:
      'PUT is idempotent (calling it N times with the same body produces the same end state) and semantically replaces the entire target resource. POST is non-idempotent, and PATCH applies partial modifications.',
  },
  {
    id: 16,
    track: 'backend',
    category: 'System Architecture',
    difficulty: 'Medium',
    question: 'What is the CAP Theorem trade-off during a network partition (P)?',
    options: [
      'You must choose between Consistency (C) and Availability (A)',
      'You must choose between Performance (P) and Durability (D)',
      'You must choose between Scalability (S) and Latency (L)',
      'All three (C, A, and P) can be guaranteed simultaneously using Raft consensus',
    ],
    correctAnswerIndex: 0,
    explanation:
      'The CAP theorem states that in a distributed data store experiencing a network partition (P), the system must choose between returning fresh consistent data (Consistency) or remaining responsive to all requests (Availability).',
  },
  {
    id: 17,
    track: 'backend',
    category: 'Caching Strategies',
    difficulty: 'Hard',
    question:
      'In a Cache-Aside (Lazy Loading) pattern, what steps are taken when a read request occurs?',
    options: [
      'Application reads from cache; if miss, reads from DB, writes result to cache, and returns it',
      'Application writes to cache first; cache asynchronously flushes to DB',
      'Database automatically triggers cache updates on every SQL INSERT/UPDATE',
      'Cache intercepts all network traffic at the reverse-proxy level',
    ],
    correctAnswerIndex: 0,
    explanation:
      'In Cache-Aside, the application first inspects the cache. On a cache hit, it returns the cached object. On a cache miss, it queries the database, writes the fetched record into the cache with a TTL, and returns it to the caller.',
  },
  {
    id: 18,
    track: 'aptitude',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question:
      'A train 240 meters long passes a pole in 24 seconds. How long will it take to pass a platform 650 meters long?',
    options: ['65 seconds', '89 seconds', '100 seconds', '75 seconds'],
    correctAnswerIndex: 1,
    explanation:
      'Speed of the train = Distance / Time = 240 m / 24 s = 10 m/s. To cross the platform, total distance = Train Length + Platform Length = 240 + 650 = 890 m. Time taken = 890 / 10 = 89 seconds.',
  },
  {
    id: 19,
    track: 'aptitude',
    category: 'Probability',
    difficulty: 'Medium',
    question:
      'Two fair dice are thrown simultaneously. What is the probability of getting a sum divisible by 5?',
    options: ['7/36', '1/6', '5/36', '1/4'],
    correctAnswerIndex: 0,
    explanation:
      'Total outcomes = 6 * 6 = 36. Possible sums divisible by 5 are 5 and 10. Pairs for sum 5: (1,4), (2,3), (3,2), (4,1) -> 4 pairs. Pairs for sum 10: (4,6), (5,5), (6,4) -> 3 pairs. Total favorable outcomes = 4 + 3 = 7. Probability = 7/36.',
  },
  {
    id: 20,
    track: 'aptitude',
    category: 'Time and Work',
    difficulty: 'Easy',
    question:
      'A can complete a project in 12 days, and B can complete it in 24 days. If they work together, how many days will they take?',
    options: ['6 days', '8 days', '9 days', '10 days'],
    correctAnswerIndex: 1,
    explanation:
      "A's 1-day work = 1/12. B's 1-day work = 1/24. Combined 1-day work = 1/12 + 1/24 = 3/24 = 1/8. Therefore, together they will finish the work in 8 days.",
  },
];

const TRACKS = [
  { id: 'all', name: 'All Tracks', icon: Layers, color: 'text-indigo-400' },
  { id: 'java', name: 'Java & OOPs', icon: Coffee, color: 'text-amber-400' },
  { id: 'react', name: 'Frontend & React', icon: Code2, color: 'text-cyan-400' },
  { id: 'python', name: 'Python', icon: Sparkles, color: 'text-emerald-400' },
  { id: 'database', name: 'Database & SQL', icon: Database, color: 'text-blue-400' },
  { id: 'backend', name: 'Backend & Systems', icon: Server, color: 'text-purple-400' },
  { id: 'aptitude', name: 'Aptitude & Logic', icon: BrainCircuit, color: 'text-rose-400' },
  { id: 'cpp', name: 'C++ & Low-Level', icon: Cpu, color: 'text-orange-400' },
  { id: 'cloud', name: 'Cloud & DevOps', icon: Cloud, color: 'text-sky-400' },
];

export const McqPage: React.FC = () => {
  const [questions, setQuestions] = useState<McqQuestion[]>(FALLBACK_QUESTIONS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Fetch from backend, fallback if offline
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await mcqApi.getAll();
        if (data && data.length > 0) {
          setQuestions(data);
        }
      } catch (err) {
        console.warn('Backend MCQ API not reachable, using built-in high-yield questions.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Filtered questions based on track and difficulty
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchTrack = selectedTrack === 'all' || q.track.toLowerCase() === selectedTrack.toLowerCase();
      const matchDiff =
        selectedDifficulty === 'all' || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      return matchTrack && matchDiff;
    });
  }, [questions, selectedTrack, selectedDifficulty]);

  // Keep index in bounds when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedTrack, selectedDifficulty]);

  // Timer for test mode
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (mode === 'test' && isTimerRunning && !testSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, isTimerRunning, testSubmitted]);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];
  const totalCount = filteredQuestions.length;

  const handleSelectOption = (optionIndex: number) => {
    if (testSubmitted && mode === 'test') return;
    if (!currentQuestion) return;

    // Start timer on first selection in test mode
    if (mode === 'test' && !isTimerRunning) {
      setIsTimerRunning(true);
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleResetSession = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTestSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  // Score calculations
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = useMemo(() => {
    return filteredQuestions.reduce((acc, q) => {
      return selectedAnswers[q.id] === q.correctAnswerIndex ? acc + 1 : acc;
    }, 0);
  }, [filteredQuestions, selectedAnswers]);

  const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" /> Placement & Technical Rounds
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
              MCQ Practice Arena
            </h1>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              Sharpen your knowledge with curated multiple-choice questions on Java, React, Python, Databases, System Design, and Aptitude.
            </p>
          </div>

          {/* Mode Selector and Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                onClick={() => {
                  setMode('practice');
                  setTestSubmitted(false);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === 'practice'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Practice Mode
              </button>
              <button
                onClick={() => {
                  setMode('test');
                  handleResetSession();
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  mode === 'test'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" /> Timed Quiz Mode
              </button>
            </div>

            <button
              onClick={handleResetSession}
              title="Reset progress"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tracks Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Select Learning Track</span>
            <span>{totalCount} Questions Available</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {TRACKS.map((track) => {
              const Icon = track.icon;
              const isSelected = selectedTrack === track.id;
              const count =
                track.id === 'all'
                  ? questions.length
                  : questions.filter((q) => q.track.toLowerCase() === track.id).length;

              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center group ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-md shadow-indigo-950/20'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-850 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 ${
                      isSelected ? 'text-indigo-400' : track.color
                    }`}
                  />
                  <span className="text-xs font-semibold leading-tight line-clamp-1">{track.name}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">{count} Qs</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Filter & Mode Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          {/* Difficulty Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Difficulty:
            </span>
            {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-slate-750 text-white border border-slate-650'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {diff === 'all' ? 'All' : diff}
              </button>
            ))}
          </div>

          {/* Test Timer & Score Counter */}
          <div className="flex items-center gap-4 text-sm font-medium">
            {mode === 'test' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Timer: {formatTimer(timerSeconds)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-300">
              <span>Answered:</span>
              <span className="font-semibold text-white">
                {answeredCount}/{totalCount}
              </span>
            </div>
            {mode === 'practice' && answeredCount > 0 && (
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                <Check className="w-3.5 h-3.5" />
                <span>Accuracy: {scorePercentage}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {totalCount === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-300">No questions found</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try switching the track or lowering the difficulty filter.
            </p>
            <button
              onClick={() => {
                setSelectedTrack('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left 3 Columns: Active Question Card */}
            <div className="lg:col-span-3 space-y-6">
              {currentQuestion && (
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl relative backdrop-blur-sm">
                  {/* Question Meta Bar */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                        {currentQuestion.category}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${
                          currentQuestion.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : currentQuestion.difficulty === 'Medium'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                      >
                        {currentQuestion.difficulty}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-slate-400">
                      Question <span className="text-white font-bold">{currentIndex + 1}</span> of{' '}
                      <span className="text-slate-300">{totalCount}</span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-normal leading-relaxed font-heading">
                    {currentQuestion.question}
                  </h2>

                  {/* Code snippet container if present */}
                  {currentQuestion.codeSnippet && (
                    <div className="mt-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-inner">
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block"></span>
                          Code Snippet
                        </span>
                        <span>{currentQuestion.track.toUpperCase()}</span>
                      </div>
                      <pre className="p-4 text-sm text-slate-200 font-mono overflow-x-auto leading-relaxed">
                        <code>{currentQuestion.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Options List */}
                  <div className="mt-6 space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswers[currentQuestion.id] === idx;
                      const hasAnswered = selectedAnswers[currentQuestion.id] !== undefined;
                      const isCorrect = idx === currentQuestion.correctAnswerIndex;
                      const revealFeedback =
                        (mode === 'practice' && hasAnswered) || (mode === 'test' && testSubmitted);

                      let optionStyle =
                        'border-slate-800 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-850/80 text-slate-200';
                      let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

                      if (revealFeedback) {
                        if (isCorrect) {
                          optionStyle =
                            'border-emerald-500/50 bg-emerald-950/30 text-emerald-100 shadow-sm shadow-emerald-900/20';
                          badgeStyle = 'bg-emerald-500 text-white border-emerald-400';
                        } else if (isSelected) {
                          optionStyle =
                            'border-rose-500/50 bg-rose-950/30 text-rose-100 shadow-sm shadow-rose-900/20';
                          badgeStyle = 'bg-rose-500 text-white border-rose-400';
                        }
                      } else if (isSelected) {
                        optionStyle =
                          'border-indigo-500 bg-indigo-950/40 text-white shadow-sm shadow-indigo-950/30';
                        badgeStyle = 'bg-indigo-600 text-white border-indigo-400';
                      }

                      const optionLetter = String.fromCharCode(65 + idx);

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group cursor-pointer ${optionStyle}`}
                        >
                          <span
                            className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm transition-all ${badgeStyle}`}
                          >
                            {revealFeedback && isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                            ) : revealFeedback && isSelected && !isCorrect ? (
                              <XCircle className="w-5 h-5 text-rose-300" />
                            ) : (
                              optionLetter
                            )}
                          </span>
                          <span className="mt-0.5 text-base leading-relaxed flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Practice Mode Explanation Box */}
                  {mode === 'practice' && selectedAnswers[currentQuestion.id] !== undefined && (
                    <div className="mt-6 p-5 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
                      <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-2">
                        <HelpCircle className="w-4 h-4" /> Technical Explanation
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {/* Navigation bar below question */}
                  <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 rounded-xl border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {mode === 'test' && !testSubmitted && (
                        <button
                          onClick={() => setTestSubmitted(true)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors shadow-sm"
                        >
                          Finish Quiz
                        </button>
                      )}

                      <button
                        onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                        disabled={currentIndex === totalCount - 1}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Question Navigator & Session Summary */}
            <div className="space-y-6">
              {/* Question Grid Navigator */}
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Question Navigator
                </h3>
                <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
                  {filteredQuestions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentIndex;
                    const isCorrect = selectedAnswers[q.id] === q.correctAnswerIndex;
                    const revealFeedback =
                      (mode === 'practice' && isAnswered) || (mode === 'test' && testSubmitted);

                    let pillStyle =
                      'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:bg-slate-750';
                    if (isCurrent) {
                      pillStyle = 'ring-2 ring-indigo-500 bg-indigo-950 text-white font-bold';
                    } else if (revealFeedback) {
                      pillStyle = isCorrect
                        ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-rose-950 border-rose-500/50 text-rose-300 font-bold';
                    } else if (isAnswered) {
                      pillStyle = 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300 font-medium';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${pillStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-indigo-600/30 border border-indigo-500/50 inline-block"></span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block"></span>
                    <span>Unanswered</span>
                  </div>
                  {((mode === 'practice' && answeredCount > 0) || testSubmitted) && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500 inline-block"></span>
                        <span>Correct</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-rose-950 border border-rose-500 inline-block"></span>
                        <span>Incorrect</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Score / Performance Card */}
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Score Card
                  </h3>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {answeredCount} / {totalCount} ({Math.round((answeredCount / totalCount) * 100 || 0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{
                          width: `${(answeredCount / totalCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Questions:</span>
                      <span className="font-semibold text-white">{totalCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Correct Answers:</span>
                      <span className="font-semibold text-emerald-400">{correctCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Accuracy Rate:</span>
                      <span className="font-semibold text-indigo-400">{scorePercentage}%</span>
                    </div>
                  </div>

                  {testSubmitted && (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Quiz Completed!
                      </span>
                      <p className="text-xl font-bold text-white">
                        {correctCount} / {totalCount}
                      </p>
                      <p className="text-xs text-slate-300">
                        {scorePercentage >= 80
                          ? '🌟 Excellent! You are well-prepared for technical assessments.'
                          : scorePercentage >= 50
                          ? '👍 Good job! Review the explanations to strengthen weaker topics.'
                          : '📚 Keep practicing! Re-read the explanations and try again.'}
                      </p>
                    </div>
                  )}

                  <Link
                    to="/start-interview"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
                  >
                    <span>Ready for AI Mock Interview?</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default McqPage;
