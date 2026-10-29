import { useState, useEffect } from 'react';
import { SupportedCurrency, currencyService } from '../services/currencyService';

const CURRENCY_STORAGE_KEY = 'stellar_bounty_currency';

export function useCurrency() {
  const [currency, setCurrency] = useState<SupportedCurrency>('XLM');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as SupportedCurrency;
      if (saved && ['XLM', 'USD', 'USDC', 'EURC'].includes(saved)) {
        setCurrency(saved);
      }
    } catch {}
  }, []);

  const changeCurrency = (c: SupportedCurrency) => {
    setCurrency(c);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    } catch {}
  };

  const formatAmount = (amountXlm: number) => {
    return currencyService.formatConverted(amountXlm, currency);
  };

  return { currency, changeCurrency, formatAmount };
}
