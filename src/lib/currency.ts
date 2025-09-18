// Currency detection and conversion utilities
export interface ExchangeRates {
  [currency: string]: number;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  smallestUnit: number; // For converting to payment processor units (e.g., cents, paisa)
}

// Supported currencies with their smallest unit multipliers
export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', smallestUnit: 100 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', smallestUnit: 100 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', smallestUnit: 100 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', smallestUnit: 100 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', smallestUnit: 100 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', smallestUnit: 100 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', smallestUnit: 100 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', smallestUnit: 1 }, // No cents in JPY
};

// Base prices in USD
export const BASE_PRICES_USD = {
  Free: 0,
  Pro: 9,
  'Pro Plus': 39,
};

// Detect user's preferred currency
export function detectUserCurrency(): string {
  try {
    // Try to get currency from browser locale
    const formatter = new Intl.NumberFormat();
    const options = formatter.resolvedOptions();
    const locale = options.locale;
    
    // Map common locales to currencies
    const localeToCurrency: Record<string, string> = {
      'en-US': 'USD',
      'en-IN': 'INR',
      'hi-IN': 'INR',
      'en-GB': 'GBP',
      'en-EU': 'EUR',
      'de-DE': 'EUR',
      'fr-FR': 'EUR',
      'es-ES': 'EUR',
      'it-IT': 'EUR',
      'en-CA': 'CAD',
      'en-AU': 'AUD',
      'en-SG': 'SGD',
      'ja-JP': 'JPY',
    };

    // Check if we have a direct mapping
    if (localeToCurrency[locale]) {
      return localeToCurrency[locale];
    }

    // Try to extract country code and map it
    const countryCode = locale.split('-')[1];
    if (countryCode) {
      const countryToCurrency: Record<string, string> = {
        'US': 'USD',
        'IN': 'INR',
        'GB': 'GBP',
        'DE': 'EUR',
        'FR': 'EUR',
        'ES': 'EUR',
        'IT': 'EUR',
        'CA': 'CAD',
        'AU': 'AUD',
        'SG': 'SGD',
        'JP': 'JPY',
      };
      
      if (countryToCurrency[countryCode]) {
        return countryToCurrency[countryCode];
      }
    }

    // Default to USD if detection fails
    return 'USD';
  } catch (error) {
    console.warn('Currency detection failed:', error);
    return 'USD';
  }
}

// Fetch exchange rates from a free API
export async function fetchExchangeRates(baseCurrency = 'USD'): Promise<ExchangeRates> {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates:', error);
    
    // Fallback exchange rates (approximate values)
    const fallbackRates: ExchangeRates = {
      USD: 1,
      INR: 83,
      EUR: 0.85,
      GBP: 0.73,
      CAD: 1.35,
      AUD: 1.50,
      SGD: 1.35,
      JPY: 110,
    };
    
    return fallbackRates;
  }
}

// Convert price from USD to target currency
export function convertPrice(usdPrice: number, targetCurrency: string, exchangeRates: ExchangeRates): number {
  if (targetCurrency === 'USD') {
    return usdPrice;
  }
  
  const rate = exchangeRates[targetCurrency];
  if (!rate) {
    console.warn(`Exchange rate not found for ${targetCurrency}, using USD`);
    return usdPrice;
  }
  
  return Math.round(usdPrice * rate * 100) / 100; // Round to 2 decimal places
}

// Convert to payment processor units (cents, paisa, etc.)
export function convertToSmallestUnit(amount: number, currency: string): number {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  if (!currencyInfo) {
    return Math.round(amount * 100); // Default to cents
  }
  
  return Math.round(amount * currencyInfo.smallestUnit);
}

// Format price for display
export function formatPrice(amount: number, currency: string): string {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  if (!currencyInfo) {
    return `$${amount.toFixed(2)}`;
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${currencyInfo.symbol}${amount.toFixed(currency === 'JPY' ? 0 : 2)}`;
  }
}