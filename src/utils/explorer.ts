export type StellarNetwork = 'testnet' | 'public' | 'futurenet';

const BASE_EXPLORER_URLS: Record<StellarNetwork, string> = {
  testnet: 'https://stellar.expert/explorer/testnet',
  public: 'https://stellar.expert/explorer/public',
  futurenet: 'https://stellar.expert/explorer/futurenet',
};

export function getExplorerTxUrl(txHash: string, network: StellarNetwork = 'testnet'): string {
  if (!txHash) return '';
  return `${BASE_EXPLORER_URLS[network]}/tx/${encodeURIComponent(txHash.trim())}`;
}

export function getExplorerAccountUrl(address: string, network: StellarNetwork = 'testnet'): string {
  if (!address) return '';
  return `${BASE_EXPLORER_URLS[network]}/account/${encodeURIComponent(address.trim())}`;
}

export function getExplorerContractUrl(contractId: string, network: StellarNetwork = 'testnet'): string {
  if (!contractId) return '';
  return `${BASE_EXPLORER_URLS[network]}/contract/${encodeURIComponent(contractId.trim())}`;
}

export function getExplorerLedgerUrl(ledger: number | string, network: StellarNetwork = 'testnet'): string {
  if (!ledger) return '';
  return `${BASE_EXPLORER_URLS[network]}/ledger/${encodeURIComponent(String(ledger).trim())}`;
}
