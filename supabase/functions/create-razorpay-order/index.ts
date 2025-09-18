import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Currency conversion utilities
const SUPPORTED_CURRENCIES = {
  USD: { smallestUnit: 100 }, // cents
  INR: { smallestUnit: 100 }, // paisa
  EUR: { smallestUnit: 100 }, // cents
  GBP: { smallestUnit: 100 }, // pence
  CAD: { smallestUnit: 100 }, // cents
  AUD: { smallestUnit: 100 }, // cents
  SGD: { smallestUnit: 100 }, // cents
  JPY: { smallestUnit: 1 },   // no subdivision
};

function convertToSmallestUnit(amount: number, currency: string): number {
  const currencyInfo = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES];
  if (!currencyInfo) {
    console.warn(`Unsupported currency: ${currency}, defaulting to cents`);
    return Math.round(amount * 100);
  }
  return Math.round(amount * currencyInfo.smallestUnit);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { planName, currency = 'USD', amount } = await req.json();
    
    if (!planName || typeof amount !== 'number') {
      return new Response(JSON.stringify({ error: 'Missing required fields: planName and amount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const keyId = "rzp_test_RJEqZ6yz448YZM";
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!keySecret) {
      console.error('Missing RAZORPAY_KEY_SECRET environment variable');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle free plan
    if (amount === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Free plan activated',
        amount: 0,
        currency: currency
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Convert amount to smallest unit for payment processor
    const amountInSmallestUnit = convertToSmallestUnit(amount, currency);

    console.log(`Creating Razorpay order for plan: ${planName}, amount: ${amount} ${currency} (${amountInSmallestUnit} smallest units)`);

    // Validate currency support by Razorpay
    const supportedRazorpayCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'JPY'];
    if (!supportedRazorpayCurrencies.includes(currency)) {
      return new Response(JSON.stringify({ 
        error: 'Currency not supported by payment processor',
        supportedCurrencies: supportedRazorpayCurrencies
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInSmallestUnit,
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: { 
          planName,
          originalAmount: amount,
          currency: currency,
          convertedAmount: amountInSmallestUnit
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Razorpay API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to create order',
        details: errorText 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const order = await response.json();
    console.log('Razorpay order created successfully:', order.id, `Amount: ${amountInSmallestUnit} ${currency}`);

    return new Response(JSON.stringify({ 
      ...order, 
      keyId,
      originalAmount: amount,
      convertedAmount: amountInSmallestUnit
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-razorpay-order function:', error);
    return new Response(JSON.stringify({ 
      error: 'Unexpected error creating order',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});