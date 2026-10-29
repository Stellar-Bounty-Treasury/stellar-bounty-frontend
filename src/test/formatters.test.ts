import { describe, it, expect } from 'vitest';
import { formatAddress, formatStroops, formatXlm, formatPercent } from '../utils/formatters';
import { getExplorerTxUrl, getExplorerAccountUrl, getExplorerContractUrl } from '../utils/explorer';

describe('Frontend Formatters and Explorer Utility Suite', () => {
  it('truncates Stellar public keys with custom lead and tail counts', () => {
    const key = 'GBDOSMGJGGPBIUAORRTYPEWPO5TXTXPQC7FLAP5ZZ4XVYHTDAFBCOMRX';
    expect(formatAddress(key, 6, 4)).toBe('GBDOSM...OMRX');
    expect(formatAddress(key, 4, 4)).toBe('GBDO...OMRX');
    expect(formatAddress('', 6, 4)).toBe('');
  });

  it('converts Stroops to formatted XLM string', () => {
    expect(formatStroops(10_000_000)).toBe('1.00');
    expect(formatStroops('50000000')).toBe('5.00');
    expect(formatStroops(1250)).toBe('0.000125');
  });

  it('formats XLM amounts with decimal precision', () => {
    expect(formatXlm(1500.5)).toBe('1,500.50');
    expect(formatXlm('250.75')).toBe('250.75');
    expect(formatXlm(0)).toBe('0.00');
  });

  it('formats basis points to percentage', () => {
    expect(formatPercent(250)).toBe('2.50%');
    expect(formatPercent(10000)).toBe('100.00%');
    expect(formatPercent(50)).toBe('0.50%');
  });

  it('generates Stellar Expert URLs for Testnet and Public networks', () => {
    const hash = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
    expect(getExplorerTxUrl(hash, 'testnet')).toContain('stellar.expert/explorer/testnet/tx/' + hash);
    expect(getExplorerTxUrl(hash, 'public')).toContain('stellar.expert/explorer/public/tx/' + hash);

    const addr = 'GBDOSMGJGGPBIUAORRTYPEWPO5TXTXPQC7FLAP5ZZ4XVYHTDAFBCOMRX';
    expect(getExplorerAccountUrl(addr, 'testnet')).toContain('stellar.expert/explorer/testnet/account/' + addr);

    const contract = 'CADMWQPCCQP27UHQU4JG3C6V5I3UFNNC4DVOMSK2GUJFA6Q2PNW36S52';
    expect(getExplorerContractUrl(contract, 'testnet')).toContain('stellar.expert/explorer/testnet/contract/' + contract);
  });
});
