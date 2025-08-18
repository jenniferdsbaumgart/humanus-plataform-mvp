export interface CareerLevel {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'next' | 'future';
  completedDate?: string;
  progressPercent?: number;
  requirements: string[];
  skills: string[];
  responsibilities: string[];
}

export interface CareerPlan {
  currentLevel: string;
  currentLevelId: string;
  nextLevel: string;
  nextLevelId: string;
  overallProgress: number;
  levels: CareerLevel[];
  totalExperience: number; // em meses
  specializations: string[];
}

export interface CareerPlanData {
  plan: CareerPlan;
}