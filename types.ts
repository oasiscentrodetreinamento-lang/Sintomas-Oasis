
export enum AnswerValue {
  NAO = "Não",
  OCASIONALMENTE = "Ocasionalmente",
  FREQUENTEMENTE = "Frequentemente"
}

export interface Question {
  id: number;
  text: string;
  category: string;
}

export interface StoredAnswer {
  questionId: number;
  questionText: string;
  answer: AnswerValue;
  score: number; // 0 for Não, 1 for Ocasionalmente, 2 for Frequentemente
}

export interface PainEntry {
  bodyPartId: string;
  bodyPartName: string;
  level: number; // 0-10
  notes: string;
}

export type PainMap = Record<string, PainEntry>;

export interface PainHistoryEntry {
  date: string;
  totalScore: number;
  painMap: PainMap;
}

export interface UserProfile {
  name: string;
  email: string;
  birthDate: string;
  gender: 'masculino' | 'feminino';
  history?: HistoryEntry[];
  painHistory?: PainHistoryEntry[];
}

export interface HistoryEntry {
  date: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  answers: StoredAnswer[];
}

export interface UserContact {
  name: string;
  phone: string;
}

export type ViewState = 'hero' | 'registration' | 'selection' | 'assessment' | 'results' | 'pain-mapping' | 'pain-results' | 'history';
