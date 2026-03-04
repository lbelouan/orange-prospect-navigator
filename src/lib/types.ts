export type FunctionType = 'IT' | 'Security' | 'Procurement' | 'Finance' | 'Business';
export type SeniorityLevel = 'C-level' | 'VP' | 'Head' | 'Manager' | 'Director';
export type EdgeType = 'knows' | 'worked_with' | 'introduced_by' | 'reports_to' | 'influences' | 'involved_in_deal';
export type SourceType = 'CRM' | 'meeting' | 'email' | 'manual' | 'inferred';

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  region: string;
}

export interface Person {
  id: string;
  name: string;
  title: string;
  function: FunctionType;
  seniority: SeniorityLevel;
  confidence: number;
  companyId: string;
  isOrangeEmployee?: boolean;
  // Computed scores
  influenceScore?: number;
  relationshipScore?: number;
  accessScore?: number;
  globalScore?: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  recencyDays: number;
  interactionCount: number;
  sourceType: SourceType;
  confidence: number;
}

export interface Account {
  company: Company;
  people: Person[];
  edges: Edge[];
  // KPIs
  networkCoverage?: number;
  politicalRisk?: 'low' | 'medium' | 'high';
  globalScore?: number;
}

export interface IntroPath {
  steps: Person[];
  confidence: number;
  description: string;
}

export interface ActionItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  category: string;
}
