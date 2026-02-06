export enum AppStep {
  Idea = 1,
  Flow = 2,
  Features = 3,
  Data = 4,
  Style = 5,
  Result = 6,
}

export interface AppState {
  // Step 1: Idea
  projectName: string;
  problem: string;
  targetAudience: string[]; // e.g. 'General', 'Kids'
  targetAudienceCustom: string;
  successMetrics: string;

  // Step 2: Flow
  happyPath: string;
  exceptionHandling: string;

  // Step 3: Features
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];

  // Step 4: Data
  dataRequirements: string;
  storageType: 'local' | 'cloud' | 'sheets' | 'none';

  // Step 5: Style
  visualStyle: string; // 'Modern', 'Professional', etc.
  devices: string[]; // 'Mobile', 'Desktop'
  tone: string; // 'Friendly', 'Strict'

  // Step 6: Result
  finalMarkdown: string;
}

export const INITIAL_STATE: AppState = {
  projectName: '',
  problem: '',
  targetAudience: [],
  targetAudienceCustom: '',
  successMetrics: '',
  happyPath: '',
  exceptionHandling: '',
  mustHaveFeatures: [],
  niceToHaveFeatures: [],
  dataRequirements: '',
  storageType: 'cloud',
  visualStyle: 'modern',
  devices: ['mobile'],
  tone: 'friendly',
  finalMarkdown: '',
};
