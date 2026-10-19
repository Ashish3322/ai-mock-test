export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ROLE_STUDENT' | 'ROLE_ADMIN' | string;
  targetRole: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: string;
  targetRole: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  difficulty: string;
  active: boolean;
  createdAt: string;
}

export interface Question {
  id: number;
  roleId: number;
  roleName?: string;
  category: string;
  questionText: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  expectedTopics?: string;
  modelAnswer?: string;
  active: boolean;
}

export interface ResponseDetail {
  responseId: number;
  questionId: number;
  questionText: string;
  category: string;
  difficulty: string;
  modelAnswer: string;
  candidateAnswer: string;
  timeTakenSeconds: number;
  score: number;
  correctness: number;
  relevance: number;
  completeness: number;
  clarity: number;
  feedbackText: string;
  strengths: string[];
  weaknesses: string[];
}

export interface InterviewSession {
  id: number;
  roleId: number;
  roleName: string;
  roleIcon: string;
  difficulty: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  overallScore: number;
  correctnessAvg: number;
  relevanceAvg: number;
  completenessAvg: number;
  clarityAvg: number;
  overallRecommendation?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | string;
  startedAt: string;
  completedAt?: string;
  currentQuestion?: Question;
  responses: ResponseDetail[];
}

export interface DashboardStats {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  completedSessions: number;
  recentInterviews: InterviewSession[];
  skillsBreakdown: Record<string, number>;
  strengths: string[];
  areasToImprove: string[];
}

export interface AdminStats {
  totalUsers: number;
  totalInterviews: number;
  totalQuestions: number;
  averageScore: number;
}

export interface McqQuestion {
  id: number;
  track: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface McqTrackInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionCount: number;
}
