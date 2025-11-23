import { Question, AnswerValue } from './types';

export const QUESTIONS: Question[] = [
  // Cabeça e Sentidos
  { id: 1, text: "Teve dor de cabeça?", category: 'Cabeça' },
  { id: 2, text: "Teve sensação de desmaio?", category: 'Cabeça' },
  { id: 3, text: "Teve tontura?", category: 'Cabeça' },
  { id: 4, text: "Seus olhos têm lacrimejado ou coçado?", category: 'Olhos' },
  { id: 5, text: "Seus olhos têm ficado inchados, vermelhos ou com os cílios colando?", category: 'Olhos' },
  { id: 6, text: "Teve bolsas ou olheiras abaixo dos olhos?", category: 'Olhos' },
  { id: 7, text: "Teve visão borrada ou em túnel? (Desconsidere miopia e astigmatismo)", category: 'Olhos' },
  { id: 8, text: "Sentiu coceira no ouvido?", category: 'Ouvidos' },
  { id: 9, text: "Sentiu dores ou teve infecções no ouvido?", category: 'Ouvidos' },
  { id: 10, text: "Retirou fluido purulento do ouvido?", category: 'Ouvidos' },
  { id: 11, text: "Sentiu zumbido ou perda de audição?", category: 'Ouvidos' },
  
  // Respiratório Superior
  { id: 12, text: "Seu nariz tem ficado entupido?", category: 'Respiratório Sup.' },
  { id: 13, text: "Teve sinusite?", category: 'Respiratório Sup.' },
  { id: 14, text: "Teve rinite?", category: 'Respiratório Sup.' },
  { id: 15, text: "Teve ataques de espirros?", category: 'Respiratório Sup.' },
  { id: 16, text: "Teve muco(meleca) no nariz?", category: 'Respiratório Sup.' },
  
  // Garganta e Boca
  { id: 17, text: "Teve tosse crônica?", category: 'Garganta' },
  { id: 18, text: "Teve pigarro (necessidade de limpar a garganta)?", category: 'Garganta' },
  { id: 19, text: "Teve dor de garganta, rouquidão ou ficou sem voz?", category: 'Garganta' },
  { id: 20, text: "Teve inchaço nos lábios, língua ou nas gengivas?", category: 'Boca' },
  { id: 21, text: "Teve aftas?", category: 'Boca' },

  // Pele
  { id: 22, text: "Teve espinhas?", category: 'Pele' },
  { id: 23, text: "Teve feridas que coçam ou erupções?", category: 'Pele' },
  { id: 24, text: "Sua pele ficou seca ou ressecada?", category: 'Pele' },
  { id: 25, text: "Teve perda de cabelo?", category: 'Pele' },
  { id: 26, text: "Teve vermelhidão na pele ou sentido calorões?", category: 'Pele' },
  { id: 27, text: "Tem suado muito sem fazer exercício?", category: 'Pele' },

  // Cardíaco
  { id: 28, text: "Sentiu batimentos irregulares no coração?", category: 'Cardíaco' },

  // Sistema Respiratório / Energia
  { id: 29, text: "Sentiu falta de ar ao realizar pequenas tarefas?", category: 'Resp. / Energia' },
  { id: 30, text: "Sentiu aperto no peito ao respirar?", category: 'Resp. / Energia' },
  { id: 31, text: "Teve crises de cansaço extremo sem explicação?", category: 'Resp. / Energia' },
  { id: 32, text: "Teve dificuldade para dormir ou sono leve?", category: 'Resp. / Energia' },
  { id: 33, text: "Acordou cansado mesmo após dormir bem?", category: 'Resp. / Energia' },
  { id: 34, text: "Sentiu sonolência excessiva durante o dia?", category: 'Resp. / Energia' },

  // Sistema Digestivo
  { id: 35, text: "Sentiu azia ou queimação no estômago?", category: 'Digestivo' },
  { id: 36, text: "Teve náuseas após as refeições?", category: 'Digestivo' },
  { id: 37, text: "Sentiu inchaço abdominal?", category: 'Digestivo' },
  { id: 38, text: "Teve gases excessivos?", category: 'Digestivo' },
  { id: 39, text: "Teve constipação intestinal?", category: 'Digestivo' },
  { id: 40, text: "Teve diarreia recorrente?", category: 'Digestivo' },
  { id: 41, text: "Sentiu dor abdominal após comer?", category: 'Digestivo' },
  { id: 42, text: "Sentiu sensação de digestão lenta?", category: 'Digestivo' },

  // Sistema Muscular e Articular
  { id: 43, text: "Sentiu dores musculares sem realizar esforço?", category: 'Muscular' },
  { id: 44, text: "Sentiu rigidez ao acordar?", category: 'Muscular' },
  { id: 45, text: "Sentiu dores nas articulações?", category: 'Muscular' },
  { id: 46, text: "Teve câimbras frequentes?", category: 'Muscular' },
  { id: 47, text: "Sentiu fraqueza muscular durante o dia?", category: 'Muscular' },

  // Sistema Neurológico / Humor
  { id: 48, text: "Teve dificuldade de concentração?", category: 'Neurológico' },
  { id: 49, text: "Teve lapsos de memória?", category: 'Neurológico' },
  { id: 50, text: "Teve irritabilidade sem motivo aparente?", category: 'Neurológico' },
  { id: 51, text: "Sentiu ansiedade repentina?", category: 'Neurológico' },
  { id: 52, text: "Teve dificuldade para relaxar?", category: 'Neurológico' },
  { id: 53, text: "Sentiu alteração repentina de humor?", category: 'Neurológico' },

  // Sistema Imunológico
  { id: 54, text: "Pegou resfriados com facilidade?", category: 'Imunológico' },
  { id: 55, text: "Sentiu febre baixa sem explicação?", category: 'Imunológico' },
  { id: 56, text: "Teve infecções recorrentes na pele?", category: 'Imunológico' },
  { id: 57, text: "Sentiu aumento na sensibilidade a alergias?", category: 'Imunológico' },
  { id: 58, text: "Sentiu coceiras pelo corpo sem causa aparente?", category: 'Imunológico' },

  // Metabolismo / Peso
  { id: 59, text: "Ganhou peso rapidamente sem mudar a alimentação?", category: 'Metabolismo' },
  { id: 60, text: "Perdeu peso rapidamente sem mudar a alimentação?", category: 'Metabolismo' },
  { id: 61, text: "Sentiu fome excessiva?", category: 'Metabolismo' },
  { id: 62, text: "Sentiu diminuição repentina do apetite?", category: 'Metabolismo' },
  { id: 63, text: "Sentiu sede excessiva ao longo do dia?", category: 'Metabolismo' },
];

export const ANSWER_OPTIONS = [
  { label: AnswerValue.NAO, value: AnswerValue.NAO, score: 0, color: 'bg-slate-700 hover:bg-slate-600' },
  { label: AnswerValue.OCASIONALMENTE, value: AnswerValue.OCASIONALMENTE, score: 1, color: 'bg-blue-600 hover:bg-blue-500' },
  { label: AnswerValue.FREQUENTEMENTE, value: AnswerValue.FREQUENTEMENTE, score: 3, color: 'bg-brand hover:bg-brand-light' },
];