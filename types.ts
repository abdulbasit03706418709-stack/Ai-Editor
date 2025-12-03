export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string; // Full data URL
  mimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationResult {
  imageUrl: string | null;
  text: string | null;
}

export type EditorToolCategory = 'ENHANCE' | 'BACKGROUND' | 'STYLE' | 'CUSTOM';

export interface EditorTool {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
  category: EditorToolCategory;
  requiresInput?: boolean;
  inputLabel?: string;
}
