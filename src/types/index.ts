export interface Product {
  id: string;
  name: string;
  description: string;
}

export interface BusinessObjective {
  id: string;
  name: string;
  description: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
}

export interface PromptType {
  id: string;
  name: string;
  description: string;
  prompt: (segment: string, product: string, objective: string) => string;
  icon: string;
}

export interface SWOTResponse {
  id: string;
  segmentId: string;
  promptTypeId: string;
  content: string;
  timestamp: string;
  product: string;
  objective: string;
}

export interface AnalysisSession {
  id: string;
  product: Product;
  objective: BusinessObjective;
  segments: Segment[];
  responses: SWOTResponse[];
  createdAt: string;
}
