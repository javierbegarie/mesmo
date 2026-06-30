import { filterCandidates } from './filter-candidates';
import type { Candidate } from './types';

const CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Ada Lovelace',
    email: 'ada@analytical.engine',
    company: 'Analytical Engine',
    status: 'approved',
    submittedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Alan Turing',
    email: 'alan@bletchley.uk',
    company: 'Bletchley',
    status: 'pending',
    submittedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Grace Hopper',
    email: 'grace@navy.mil',
    company: 'US Navy',
    status: 'rejected',
    submittedAt: '2025-03-01T00:00:00.000Z',
  },
];

describe('filterCandidates', () => {
  it('returns everything with empty filters', () => {
    expect(filterCandidates(CANDIDATES, { text: '', statuses: [] })).toHaveLength(
      3,
    );
  });

  it('matches text against name (case-insensitive)', () => {
    const result = filterCandidates(CANDIDATES, { text: 'ada', statuses: [] });
    expect(result.map((c) => c.id)).toEqual(['1']);
  });

  it('matches text against email', () => {
    const result = filterCandidates(CANDIDATES, {
      text: 'navy.mil',
      statuses: [],
    });
    expect(result.map((c) => c.id)).toEqual(['3']);
  });

  it('filters by selected statuses', () => {
    const result = filterCandidates(CANDIDATES, {
      text: '',
      statuses: ['pending', 'rejected'],
    });
    expect(result.map((c) => c.id)).toEqual(['2', '3']);
  });

  it('combines text and status filters', () => {
    const result = filterCandidates(CANDIDATES, {
      text: 'a',
      statuses: ['approved'],
    });
    expect(result.map((c) => c.id)).toEqual(['1']);
  });
});
