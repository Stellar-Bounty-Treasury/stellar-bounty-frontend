import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { DemoModeProvider, useDemoMode, DEMO_PERSONAS } from '../context/DemoModeContext';

describe('DemoModeContext', () => {
  it('initializes with Demo Mode active and Alice as creator', () => {
    const { result } = renderHook(() => useDemoMode(), {
      wrapper: ({ children }) => <DemoModeProvider>{children}</DemoModeProvider>,
    });

    expect(result.current.isDemoMode).toBe(true);
    expect(result.current.activePersona.id).toBe('creator');
    expect(result.current.activePersona.name).toBe('Alice Henderson');
  });

  it('switches persona roles seamlessly', () => {
    const { result } = renderHook(() => useDemoMode(), {
      wrapper: ({ children }) => <DemoModeProvider>{children}</DemoModeProvider>,
    });

    act(() => {
      result.current.setPersonaRole('contributor');
    });

    expect(result.current.activePersona.id).toBe('contributor');
    expect(result.current.activePersona.name).toBe('Bob Chen');

    act(() => {
      result.current.setPersonaRole('arbitrator');
    });

    expect(result.current.activePersona.id).toBe('arbitrator');
    expect(result.current.activePersona.name).toBe('Charlie Vance');
  });

  it('allows boosting demo balances with mock faucet', () => {
    const { result } = renderHook(() => useDemoMode(), {
      wrapper: ({ children }) => <DemoModeProvider>{children}</DemoModeProvider>,
    });

    const initialXlm = result.current.activePersona.xlmBalance;
    act(() => {
      result.current.fundMockBalance(1000);
    });

    expect(result.current.activePersona.xlmBalance).toBe(initialXlm + 1000);
  });
});
