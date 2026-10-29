export interface Sep7PayParams {
  destination: string;
  amount?: number | string;
  memo?: string;
  memoType?: 'MEMO_TEXT' | 'MEMO_ID';
  assetCode?: string;
  assetIssuer?: string;
}

export function buildSep7PayUri(params: Sep7PayParams): string {
  const query = new URLSearchParams();
  query.set('destination', params.destination);
  if (params.amount) query.set('amount', String(params.amount));
  if (params.memo) query.set('memo', params.memo);
  if (params.memoType) query.set('memo_type', params.memoType);
  if (params.assetCode) query.set('asset_code', params.assetCode);
  if (params.assetIssuer) query.set('asset_issuer', params.assetIssuer);

  return 'web+stellar:pay?' + query.toString();
}

export function parseSep7Uri(uri: string): Partial<Sep7PayParams> | null {
  if (!uri || !uri.startsWith('web+stellar:pay?')) return null;
  const rawQuery = uri.replace('web+stellar:pay?', '');
  const params = new URLSearchParams(rawQuery);

  return {
    destination: params.get('destination') || '',
    amount: params.get('amount') || undefined,
    memo: params.get('memo') || undefined,
    assetCode: params.get('asset_code') || undefined,
  };
}
