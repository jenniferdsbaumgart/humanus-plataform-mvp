export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  type: 'career-planning' | 'feedback' | 'development' | 'performance';
  with: string;
  status: 'scheduled' | 'completed';
  agenda: string[];
  location: string;
  notes: string;
}

export interface ScheduleData {
  meetings: Meeting[];
}