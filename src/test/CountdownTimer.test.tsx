import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CountdownTimer } from '../components/CountdownTimer';

describe('CountdownTimer Component', () => {
  const fixedNow = new Date('2026-10-14T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders countdown timer with days and hours in badge variant', () => {
    // 3 days and 6 hours ahead
    const deadline = new Date(fixedNow.getTime() + (3 * 24 + 6) * 60 * 60 * 1000).toISOString();

    render(<CountdownTimer deadline={deadline} id="test-timer" variant="badge" />);

    const timer = screen.getByRole('timer');
    expect(timer).toBeInTheDocument();
    expect(timer).toHaveTextContent('3d 6h');
    expect(timer).toHaveClass('timer-normal');
  });

  it('renders detailed variant with full remaining text', () => {
    // 5 days and 2 hours ahead
    const deadline = new Date(fixedNow.getTime() + (5 * 24 + 2) * 60 * 60 * 1000).toISOString();

    render(<CountdownTimer deadline={deadline} id="test-timer" variant="detailed" />);

    const timer = screen.getByRole('timer');
    expect(timer).toBeInTheDocument();
    expect(timer).toHaveTextContent('5d 2h remaining');
    expect(timer).toHaveClass('timer-detailed');
  });

  it('displays urgency warning styling when deadline is under 24 hours', () => {
    // 10 hours ahead
    const deadline = new Date(fixedNow.getTime() + 10 * 60 * 60 * 1000).toISOString();

    render(<CountdownTimer deadline={deadline} id="test-timer" variant="badge" />);

    const timer = screen.getByRole('timer');
    expect(timer).toHaveClass('timer-urgent');
    expect(timer).toHaveTextContent('10h 0m');
  });

  it('displays critical warning styling when deadline is under 3 hours', () => {
    // 1 hour and 30 minutes ahead
    const deadline = new Date(fixedNow.getTime() + 90 * 60 * 1000).toISOString();

    render(<CountdownTimer deadline={deadline} id="test-timer" variant="badge" />);

    const timer = screen.getByRole('timer');
    expect(timer).toHaveClass('timer-critical');
    expect(timer).toHaveTextContent('1h 30m');
  });

  it('displays expired status badge when deadline has elapsed', () => {
    // 1 hour in the past
    const pastDeadline = new Date(fixedNow.getTime() - 60 * 60 * 1000).toISOString();

    render(<CountdownTimer deadline={pastDeadline} id="test-timer" variant="badge" />);

    const timer = screen.getByRole('status');
    expect(timer).toHaveClass('timer-expired');
    expect(timer).toHaveTextContent('Expired');
  });

  it('displays completed status when bounty status is completed', () => {
    const deadline = new Date(fixedNow.getTime() + 24 * 60 * 60 * 1000).toISOString();

    render(<CountdownTimer deadline={deadline} status="completed" id="test-timer" />);

    const statusEl = screen.getByRole('status');
    expect(statusEl).toHaveClass('timer-completed');
    expect(statusEl).toHaveTextContent('Completed');
  });

  it('falls back to created_at + 14 days when deadline is not provided', () => {
    // created_at 2 days ago -> 12 days remaining
    const createdAt = new Date(fixedNow.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

    render(<CountdownTimer createdAt={createdAt} id="test-timer" variant="badge" />);

    const timer = screen.getByRole('timer');
    expect(timer).toHaveTextContent('12d 0h');
  });

  it('updates remaining time as time advances', () => {
    // 2 hours and 1 minute ahead
    const deadline = new Date(fixedNow.getTime() + 121 * 60 * 1000).toISOString();

    render(<CountdownTimer deadline={deadline} id="test-timer" variant="badge" />);

    expect(screen.getByRole('timer')).toHaveTextContent('2h 1m');

    // Advance clock by 2 minutes
    act(() => {
      vi.advanceTimersByTime(2 * 60 * 1000);
    });

    expect(screen.getByRole('timer')).toHaveTextContent('1h 59m');
  });
});
