export interface Template {
  id: string;
  title: string;
  objective: string;
  participants: string[];
  duration: string;
  materials: string[];
  structure: {
    frames: Array<{
      name: string;
      description: string;
      elements: string[];
    }>;
    connections: string[];
  };
  facilitation: Array<{
    step: number;
    action: string;
    time: string;
    coaching_tip: string;
  }>;
  coaching_tips: string[];
  variations: string[];
  createdAt: string;
}