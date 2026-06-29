import { CandidateCard } from '../components/candidate-card';
import { useCandidates } from '../query/use-candidates';

/** Full-page view for the Candidates module — the shell's default view. */
export function CandidatesPage() {
  const { data: candidates, isPending, isError } = useCandidates();

  return (
    <section className="mx-auto w-full max-w-3xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
        <p className="text-sm text-muted-foreground">
          People currently in the selection process.
        </p>
      </header>

      {isPending && (
        <p className="text-sm text-muted-foreground">Loading candidates…</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Something went wrong loading candidates.
        </p>
      )}

      {candidates && (
        <ul className="flex flex-col gap-3">
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <CandidateCard candidate={candidate} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default CandidatesPage;
