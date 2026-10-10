/**
 * Companion coverage for the loading skeleton state: the skeleton must
 * render accessible placeholders so the fetching list announces itself
 * to assistive tech and the grid keeps its shape.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BountyCardSkeleton } from '../components/BountyCardSkeleton';

describe('BountyCardSkeleton', () => {
  it('renders an accessible loading status', () => {
    const { getByTestId } = render(<BountyCardSkeleton index={0} />);
    const el = getByTestId('bounty-card-skeleton-0');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el).toHaveAttribute('aria-label', 'Loading bounty');
  });

  it('carries the card shell classes so it slots into the bounty grid', () => {
    const { getByTestId } = render(<BountyCardSkeleton index={2} />);
    const el = getByTestId('bounty-card-skeleton-2');
    expect(el).toHaveClass('glass-panel', 'bounty-card', 'bounty-card-skeleton');
  });

  it('is inert while loading: no interactive elements inside', () => {
    const { container, getByTestId } = render(<BountyCardSkeleton />);
    const el = getByTestId('bounty-card-skeleton-0');
    expect(el).toHaveClass('bounty-card-skeleton'); // pointer-events: none via CSS
    expect(container.querySelector('button, a, input')).toBeNull();
  });
});
