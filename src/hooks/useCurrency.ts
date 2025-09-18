import { useState, useEffect } from 'react';
import { 
  detectUserCurrency, 
  fetchExchangeRates, 
  convertPrice, 
  formatPrice,
  BASE_PRICES_USD,
  type ExchangeRates 
} from '@/lib/currency';

export interface ConvertedPrices {
  Free: number;
  Pro: number;
  'Pro Plus': number;
}

export interface CurrencyHook {
  currency: string;
  exchangeRates: ExchangeRates | null;
  convertedPrices: ConvertedPrices;
  loading: boolean;
  error: string | null;
  formatPrice: (amount: number) => string;
  setCurrency: (currency: string) => void;
}

export function useCurrency(): CurrencyHook {
  const [currency, setCurrency] = useState<string>('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [convertedPrices, setConvertedPrices] = useState<ConvertedPrices>({
    Free: 0,
    Pro: 9,
    'Pro Plus': 39,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize currency detection and fetch exchange rates
  useEffect(() => {
    async function initializeCurrency() {
      try {
        setLoading(true);
        setError(null);

        // Detect user's currency
        const detectedCurrency = detectUserCurrency();
        setCurrency(detectedCurrency);

        // Fetch exchange rates
        const rates = await fetchExchangeRates('USD');
        setExchangeRates(rates);

        // Convert prices
        const converted: ConvertedPrices = {
          Free: 0,
          Pro: convertPrice(BASE_PRICES_USD.Pro, detectedCurrency, rates),
          'Pro Plus': convertPrice(BASE_PRICES_USD['Pro Plus'], detectedCurrency, rates),
        };
        
        setConvertedPrices(converted);
      } catch (err) {
        setError('Failed to load currency data');
        console.error('Currency initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initializeCurrency();
  }, []);

  // Update prices when currency changes
  useEffect(() => {
    if (exchangeRates) {
      const converted: ConvertedPrices = {
        Free: 0,
        Pro: convertPrice(BASE_PRICES_USD.Pro, currency, exchangeRates),
        'Pro Plus': convertPrice(BASE_PRICES_USD['Pro Plus'], currency, exchangeRates),
      };
      
      setConvertedPrices(converted);
    }
  }, [currency, exchangeRates]);

  const formatPriceForCurrency = (amount: number): string => {
    return formatPrice(amount, currency);
  };

  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  return {
    currency,
    exchangeRates,
    convertedPrices,
    loading,
    error,
    formatPrice: formatPriceForCurrency,
    setCurrency: handleSetCurrency,
  };
}