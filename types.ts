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

export interface UserContact {
  name: string;
  phone: string;
}

export type ViewState = 'hero' | 'assessment' | 'results';