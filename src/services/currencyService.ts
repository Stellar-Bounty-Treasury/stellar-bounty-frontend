export type SupportedCurrency = 'XLM' | 'USD' | 'USDC' | 'EURC';

export interface ExchangeRates {
  XLM_USD: number;
  USDC_USD: number;
  EURC_USD: number;
}

export const DEFAULT_RATES: ExchangeRates = {
  XLM_USD: 0.12,
  USDC_USD: 1.0,
  EURC_USD: 1.08,
};

export class CurrencyService {
  private rates: ExchangeRates = { ...DEFAULT_RATES };

  public convertXlm(amountXlm: number, target: SupportedCurrency): number {
    if (target === 'XLM') return amountXlm;
    const usdVal = amountXlm * this.rates.XLM_USD;
    if (target === 'USD') return usdVal;
    if (target === 'USDC') return usdVal / this.rates.USDC_USD;
    if (target === 'EURC') return usdVal / this.rates.EURC_USD;
    return amountXlm;
  }

  public formatConverted(amountXlm: number, target: SupportedCurrency): string {
    const converted = this.convertXlm(amountXlm, target);
    if (target === 'USD') {
      return '$' + converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + target;
  }
}

export const currencyService = new CurrencyService();
