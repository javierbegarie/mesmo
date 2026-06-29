/** Domain types for the Candidates module. */

export type CandidateStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: CandidateStage;
}
