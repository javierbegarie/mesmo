import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowLeft, Mail, Phone, Globe, Building2, MapPin } from 'lucide-react';
import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router';
import { Avatar, toast } from '@mesmo/ui-kit';

import { CandidateStatusBadge } from '../components/candidate-status-badge';
import { CandidateStatusDropdown } from '../components/candidate-status-dropdown';
import { useCandidate } from '../hooks/use-candidate';
import { useCandidatePosts } from '../query/use-candidate-posts';
import type { CandidateDetail } from '../util/types';

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });

/** Full detail view for a single candidate, including their posts. */
export function CandidateDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const navigate = useNavigate();

  const { candidate, isPending, isError } = useCandidate(id);

  // We don't refetch a single candidate — it comes from the backend store. So
  // any failure to show one (load error or unknown id, including deep links)
  // means we bounce back to the list with an explanation.
  const resolved = !isPending;
  const failed = resolved && (isError || !candidate);

  // Guard so we toast + redirect exactly once (also tames StrictMode's
  // double-invoked effects in dev).
  const handled = useRef(false);

  useEffect(() => {
    if (!failed || handled.current) return;
    handled.current = true;
    toast.error(
      isError
        ? "We couldn't load that candidate right now."
        : "That candidate doesn't exist.",
    );
    navigate({ to: '/' });
  }, [failed, isError, navigate]);

  // Going back through history returns to the list with its filters (which
  // live in the URL); only fall back to the list route on a fresh deep link.
  const goBack = () =>
    canGoBack ? router.history.back() : navigate({ to: '/' });

  return (
    <section className="mx-auto flex h-full w-full max-w-6xl flex-col p-6">
      <button
        type="button"
        onClick={goBack}
        className="mb-6 inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to candidates
      </button>

      {isPending && (
        <p className="text-sm text-muted-foreground">Loading candidate…</p>
      )}

      {candidate && (
        <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
          <div className="lg:w-1/2">
            <CandidateProfile candidate={candidate} />
          </div>
          <CandidatePosts id={id} />
        </div>
      )}
    </section>
  );
}

function CandidateProfile({ candidate }: { candidate: CandidateDetail }) {
  return (
    <article className="rounded-xl border bg-card p-6">
      <header className="flex items-start gap-4">
        <Avatar name={candidate.name} size={64} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {candidate.name}
            </h1>
            <CandidateStatusBadge status={candidate.status} />
          </div>
          <p className="text-sm text-muted-foreground">@{candidate.username}</p>
          <p className="text-sm text-muted-foreground">
            Submitted {dateFormatter.format(new Date(candidate.submittedAt))}
          </p>
        </div>
        <CandidateStatusDropdown candidate={candidate} />
      </header>

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoRow icon={<Mail className="size-4" />} label="Email">
          <a
            href={`mailto:${candidate.email}`}
            className="hover:underline"
          >
            {candidate.email}
          </a>
        </InfoRow>
        <InfoRow icon={<Phone className="size-4" />} label="Phone">
          {candidate.phone}
        </InfoRow>
        <InfoRow icon={<Globe className="size-4" />} label="Website">
          <a
            href={`https://${candidate.website}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {candidate.website}
          </a>
        </InfoRow>
        <InfoRow icon={<MapPin className="size-4" />} label="City">
          {candidate.city}
        </InfoRow>
        <InfoRow icon={<Building2 className="size-4" />} label="Company">
          <span>{candidate.company}</span>
          <span className="block text-xs italic text-muted-foreground">
            “{candidate.catchPhrase}”
          </span>
        </InfoRow>
      </dl>
    </article>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="text-sm break-words">{children}</dd>
      </div>
    </div>
  );
}

function CandidatePosts({ id }: { id: string }) {
  const { data: posts, isPending, isError } = useCandidatePosts(id);

  return (
    <div className="flex min-h-0 flex-col lg:w-1/2">
      <h2 className="mb-3 shrink-0 text-lg font-semibold tracking-tight">
        Posts{posts ? ` (${posts.length})` : ''}
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {isPending && (
          <p className="text-sm text-muted-foreground">Loading posts…</p>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            It was not possible to fetch the candidate posts right now.
          </p>
        )}

        {posts && posts.length === 0 && (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        )}

        {posts && posts.length > 0 && (
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.id} className="rounded-lg border bg-card p-4">
                <h3 className="font-medium capitalize">{post.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CandidateDetailPage;
