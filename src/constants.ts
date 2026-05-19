import { Step } from './types';

export const CONTACTS = {
  OPTIONS_ON_CALL: '07980 714025',
  LIVERPOOL_CARELINE: '0151 233 3800',
  EMERGENCY: '999',
  ONLINE_PORTAL: 'https://liverpool.gov.uk/adult-social-care/professional-referrals/safeguarding-adults/report-an-adult-safeguarding-concern/',
};

export const ABUSE_TYPES = [
  'Physical (e.g. hitting, slapping, unexplained marks)',
  'Domestic (including coercive control)',
  'Sexual (e.g. rape, non-consensual acts)',
  'Psychological (e.g. emotional abuse, threats)',
  'Financial or material (e.g. theft, fraud)',
  'Modern slavery (e.g. human trafficking, forced labour)',
  'Discriminatory (e.g. harassment based on protected characteristics)',
  'Organisational (e.g. neglect in a care setting)',
  'Neglect and acts of omission (including medication errors)',
  'Self-neglect (e.g. hoarding, neglecting personal hygiene)',
  'Radicalisation (e.g. risk of being drawn into terrorism)',
  'Hate crime',
  'Mate crime (e.g. exploitation by "friends")',
  'Sexual exploitation',
  'Falls (where neglect or poor care is suspected)',
];

export const STEPS: Record<string, Step & { longDescription?: string }> = {
  emergency: {
    id: 'emergency',
    question: 'Is the person in immediate danger?',
    description: 'If there is an immediate risk of harm or a crime is in progress, you must call emergency services.',
    longDescription: 'Immediate danger includes situations where a person is being physically assaulted, is in need of urgent medical attention, or where a perpetrator is still present and poses a threat.',
    options: [
      { label: 'Yes - Call 999', nextStepId: 'emergency', variant: 'danger' },
      { label: 'No - Continue', nextStepId: 'abuse-risk', variant: 'primary' },
    ],
  },
  'abuse-risk': {
    id: 'abuse-risk',
    question: 'Is the adult experiencing, or at risk of, abuse or neglect?',
    description: 'Consider all forms of abuse: physical (including unexplained marks), sexual, psychological, financial, or discriminatory. This also includes neglect, medication errors, falls (due to poor care), modern slavery, and radicalisation.',
    longDescription: 'Abuse is a violation of an individual’s human and civil rights by any other person or persons. It can consist of a single act or repeated acts. It can be physical, verbal or psychological, it may be an act of neglect or an omission to act, or it may occur when a vulnerable person is persuaded to enter into a financial or sexual transaction to which he or she has not consented, or cannot consent.',
    options: [
      { label: 'Yes', nextStepId: 'unable-to-protect', variant: 'primary' },
      { label: 'No', nextStepId: 'no-referral-needed', variant: 'secondary' },
    ],
  },
  'unable-to-protect': {
    id: 'unable-to-protect',
    question: 'As a result of those care and support needs, is the adult unable to protect themselves?',
    description: 'Are they unable to protect themselves from either the risk of, or the experience of, abuse or neglect?',
    longDescription: 'This is the "third test" of the Section 42 enquiry duty. It asks whether the adult’s care and support needs mean that they are unable to protect themselves from the abuse or neglect. For example, a person with advanced dementia may be unable to protect themselves from financial abuse because they cannot manage their own affairs.',
    options: [
      { label: 'Yes', nextStepId: 'msp', variant: 'primary' },
      { label: 'No', nextStepId: 'no-referral-needed', variant: 'secondary' },
    ],
  },
  msp: {
    id: 'msp',
    question: 'Making Safeguarding Personal (MSP)',
    description: 'Have you spoken to the adult about your concerns? What are their views and wishes? Do they consent to this referral?',
    longDescription: 'Making Safeguarding Personal means it should be person-led and outcome-focused. It engages the person in a conversation about how best to respond to their safeguarding situation in a way that enhances their involvement, choice and control as well as improving quality of life, well-being and safety.',
    options: [
      { label: 'Yes, they consent', nextStepId: 'referral-needed', variant: 'primary' },
      { label: 'No, but it is in their best interests / public interest', nextStepId: 'referral-needed', variant: 'primary' },
      { label: 'No, and they do not consent', nextStepId: 'other-support', variant: 'secondary' },
    ],
  },
  'referral-needed': {
    id: 'referral-needed',
    question: 'Referral Required',
    description: 'The criteria for a Section 42 safeguarding enquiry appear to be met.',
    options: [
      { label: 'Start Over', nextStepId: 'emergency', variant: 'secondary' },
    ],
  },
  'no-referral-needed': {
    id: 'no-referral-needed',
    question: 'Referral Not Required',
    description: 'The statutory criteria for a safeguarding referral may not be met at this time.',
    options: [
      { label: 'Start Over', nextStepId: 'emergency', variant: 'secondary' },
    ],
  },
  'other-support': {
    id: 'other-support',
    question: 'Alternative Support',
    description: 'If the person does not consent and there is no overriding public interest, consider other forms of support or advice.',
    options: [
      { label: 'Start Over', nextStepId: 'emergency', variant: 'secondary' },
    ],
  },
};
