export interface Reviewer {
  name: string;
  credentials: string;
  title: string;
  imageUrl?: string;
}

export const EDITORIAL_TEAM: Reviewer = {
  name: 'HealthCheck Editorial Team',
  credentials: '',
  title: 'Editorial Review Board',
};

// Placeholder for when a real advisor is added
const _PLACEHOLDER_REVIEWER: Reviewer = {
  name: 'HealthCheck Editorial Team',
  credentials: '',
  title: 'Evidence-Based Review',
};
