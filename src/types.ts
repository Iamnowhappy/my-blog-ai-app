export enum GenerationState {
  IDLE = 'IDLE',
  SUGGESTING_TITLES = 'SUGGESTING_TITLES',
  GENERATING_TEXT = 'GENERATING_TEXT',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
}

export interface GeneratedPost {
  title: string;
  // Final HTML content with images embedded
  content: string; 
  tags: string[];
  qna: { question: string; answer: string }[];
}

export interface ManualPostPayload {
    title: string;
    contentTemplate: string;
    imagePrompts: string[];
    tags: string[];
    qna: { question: string; answer: string }[];
}