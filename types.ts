
export interface Pillar {
  stem: string;
  branch: string;
}

export interface BaziPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface BaziAnalysis {
  mingZhu: string;
  personality: string;
  career: string;
  relationship: string;
  health: string;
  summary: string;
}

export interface BaziData {
  pillars: BaziPillars;
  analysis: BaziAnalysis;
}
