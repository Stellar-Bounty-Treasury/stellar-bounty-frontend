/**
 * Issue: test: Add Vitest component test for BountyCard status badge rendering
 *
 * Covers the BountyCard status badge (the `<span className="status-badge ...">`
 * in the card header): which label it renders ("Open" vs "Funded") and which
 * CSS modifier it carries (`status-open` vs `status-funded`), for each
 * combination of `status` and funded/target amounts.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BountyCard } from '../components/BountyCard';
import { Bounty } from '../types';

const baseBounty: Bounty = {
  id: 42,
  title: 'Fix the docs',
  description: 'Update the onboarding guide',
  creator_address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCD',
  target_amount: 1000,
  funded_amount: 0,
  status: 'open',
  created_at: '2026-10-08T00:00:00Z',
  updated_at: '2026-10-08T00:00:00Z',
  milestones: [],
};

const noop = vi.fn();

function badge(bounty: Bounty): HTMLElement {
  const { container } = render(
    <BountyCard bounty={bounty} onFundClick={noop} onViewDetailsClick={noop} />
  );
  const el = container.querySelector(`#bounty-status-${bounty.id}`);
  expect(el).not.toBeNull();
  return el as HTMLElement;
}

describe('BountyCard status badge', () => {
  it('renders "Open" with the status-open class for an unfunded open bounty', () => {
    const el = badge({ ...baseBounty });
    expect(el).toHaveTextContent('Open');
    expect(el).toHaveClass('status-badge', 'status-open');
    expect(el).not.toHaveClass('status-funded');
  });

  it('renders "Funded" with the status-funded class when status is funded', () => {
    const el = badge({ ...baseBounty, status: 'funded' });
    expect(el).toHaveTextContent('Funded');
    expect(el).toHaveClass('status-badge', 'status-funded');
    expect(el).not.toHaveClass('status-open');
  });

  it('renders "Funded" when funded_amount reaches the target even if status is still open', () => {
    const el = badge({ ...baseBounty, funded_amount: 1000 });
    expect(el).toHaveTextContent('Funded');
    expect(el).toHaveClass('status-funded');
  });

  it('renders "Funded" when funded_amount exceeds the target', () => {
    const el = badge({ ...baseBounty, funded_amount: 1500 });
    expect(el).toHaveTextContent('Funded');
    expect(el).toHaveClass('status-funded');
  });

  it('renders "Open" for a partially funded open bounty', () => {
    const el = badge({ ...baseBounty, funded_amount: 450 });
    expect(el).toHaveTextContent('Open');
    expect(el).toHaveClass('status-open');
  });

  it('badge is labelled with the bounty-specific id', () => {
    const { container } = render(
      <BountyCard bounty={baseBounty} onFundClick={noop} onViewDetailsClick={noop} />
    );
    expect(container.querySelector('#bounty-status-42')).toHaveTextContent('Open');
  });

  it('exposes the badge to assistive tech via its text content', () => {
    const { container } = render(
      <BountyCard bounty={{ ...baseBounty, status: 'funded' }} onFundClick={noop} onViewDetailsClick={noop} />
    );
    // The Fund action button also reads "Funded", so target the badge by id.
    expect(container.querySelector('#bounty-status-42')).toHaveTextContent('Funded');
  });
});
