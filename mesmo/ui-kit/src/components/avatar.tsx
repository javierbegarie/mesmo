import { User } from 'lucide-react';

interface AvatarProps {
  /** When provided, initials are shown; otherwise a placeholder icon. */
  name?: string;
  /** Diameter in pixels. */
  size?: number;
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Agnostic, self-contained avatar. Renders initials from `name`, falling back
 * to a placeholder icon. Sizing uses inline styles so it never collides with
 * the consumer's utility classes.
 */
export function Avatar({ name, size = 40, className = '' }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground ${className}`}
    >
      {name ? (
        <span style={{ fontSize: Math.round(size * 0.4) }}>
          {initials(name)}
        </span>
      ) : (
        <User style={{ width: size * 0.5, height: size * 0.5 }} />
      )}
    </span>
  );
}
