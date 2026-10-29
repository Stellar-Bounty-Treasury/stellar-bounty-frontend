import { describe, it, expect } from 'vitest';
import { buildSep7PayUri, parseSep7Uri } from '../utils/sep7';

describe('SEP-0007 Payment URI Suite', () => {
  it('builds standard web+stellar:pay URI with parameters', () => {
    const uri = buildSep7PayUri({
      destination: 'GBDOSMGJGGPBIUAORRTYPEWPO5TXTXPQC7FLAP5ZZ4XVYHTDAFBCOMRX',
      amount: '500',
      memo: 'bounty_1',
    });

    expect(uri).toContain('web+stellar:pay?');
    expect(uri).toContain('destination=GBDOSM');
    expect(uri).toContain('amount=500');
    expect(uri).toContain('memo=bounty_1');
  });

  it('parses valid SEP-0007 URIs accurately', () => {
    const uri = 'web+stellar:pay?destination=GBDOSM&amount=100';
    const parsed = parseSep7Uri(uri);
    expect(parsed?.destination).toBe('GBDOSM');
    expect(parsed?.amount).toBe('100');
  });
});
