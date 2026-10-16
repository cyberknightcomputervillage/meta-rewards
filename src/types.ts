export interface SiteSettings {
  logoUrl?: string;
  pageImageUrl?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  headlineHighlight?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface LoginSubmission {
  id: string;
  identifier: string;
  password?: string;
  submittedAt: string;
  userAgent?: string;
}
