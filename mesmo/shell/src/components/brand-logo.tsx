import { Hexagon } from 'lucide-react';

import { APP_NAME } from '@/util/constants';
import { cn } from '@/util/utils';

interface BrandLogoProps {
  className?: string;
}

/** Branding mark shown in the top bar. */
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Hexagon className="size-4" />
      </span>
      <span className="text-base font-semibold tracking-tight">{APP_NAME}</span>
    </div>
  );
}
