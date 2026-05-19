export type StepId = 
  | 'emergency'
  | 'care-needs'
  | 'abuse-risk'
  | 'unable-to-protect'
  | 'msp'
  | 'referral-needed'
  | 'no-referral-needed'
  | 'other-support';

export interface Step {
  id: StepId;
  question: string;
  description?: string;
  options: Option[];
}

export interface Option {
  label: string;
  nextStepId: StepId;
  variant?: 'primary' | 'secondary' | 'danger';
}
