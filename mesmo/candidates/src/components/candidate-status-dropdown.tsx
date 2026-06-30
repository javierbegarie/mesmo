import { Dropdown, toast } from '@mesmo/ui-kit';

import type { Candidate, CandidateStatus } from '../util/types';
import { STATUS_LABELS } from '../util/status';
import { getAllowedTransitions } from '../util/status-machine';
import { useCandidatesBackendStore } from '../store/candidates-backend';

/**
 * Status changer for a candidate. Offers only the transitions allowed by the
 * state machine; with none available it renders disabled.
 */
export function CandidateStatusDropdown({
  candidate,
}: {
  candidate: Candidate;
}) {
  const setStatus = useCandidatesBackendStore((state) => state.setStatus);

  const items = getAllowedTransitions(candidate).map((status) => ({
    label: STATUS_LABELS[status],
    value: status,
  }));

  const handleSelect = (value: string) => {
    const result = setStatus(candidate.id, value as CandidateStatus);
    if (result === 'conflict') {
      toast.error(
        `${candidate.name}'s status was already updated elsewhere. Showing the latest.`,
      );
    }
  };

  return (
    <Dropdown
      items={items}
      onSelect={handleSelect}
      placeholder="Change status"
      disabledPlaceholder="No changes available"
    />
  );
}
