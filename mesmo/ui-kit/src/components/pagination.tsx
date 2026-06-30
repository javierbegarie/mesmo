import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  /** 1-based current page. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  onPageChange: (page: number) => void;
}

/** Agnostic numbered paginator with previous/next controls. */
export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  const control =
    'inline-flex size-9 items-center justify-center rounded-md border text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={isFirst}
        onClick={() => onPageChange(page - 1)}
        className={`${control} bg-background hover:bg-accent hover:text-accent-foreground`}
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((value) => {
        const isCurrent = value === page;
        return (
          <button
            key={value}
            type="button"
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => onPageChange(value)}
            className={`${control} ${
              isCurrent
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {value}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={isLast}
        onClick={() => onPageChange(page + 1)}
        className={`${control} bg-background hover:bg-accent hover:text-accent-foreground`}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
