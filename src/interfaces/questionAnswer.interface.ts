export interface IQuestionAnswer {
  id?: number | null;
  question: string | null;
  answer: string | null;
  idTopic?: number | null;
}

export interface IQuestionAnswerList {
  id?: number;
  question: string;
  answer: IAnswer[];
  idTopic?: number;
}

interface IAnswer {
  answer: string;
}