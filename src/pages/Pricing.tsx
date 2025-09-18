import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Star, Zap, Crown, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/hooks/useCurrency";
import { convertToSmallestUnit, SUPPORTED_CURRENCIES } from "@/lib/currency";

// Razorpay response interface
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Razorpay options interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    plan: string;
    features: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

// Razorpay instance interface
interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const Pricing = () => {
  const { 
    currency, 
    convertedPrices, 
    loading: currencyLoading, 
    error: currencyError,
    formatPrice,
    setCurrency 
  } = useCurrency();

  const plans = [
    {
      name: "Free",
      basePrice: 0,
      price: convertedPrices.Free,
      description: "Perfect for getting started with SQL",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Access to basic lessons",
        "Interactive SQL sandbox",
        "Progress tracking",
        "Community support"
      ],
      buttonText: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      basePrice: 9,
      price: convertedPrices.Pro,
      description: "Advanced features for serious learners",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "All Free features",
        "Advanced SQL lessons",
        "Personalized learning path",
        "Priority support",
        "Certificate of completion",
        "Offline access"
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Pro Plus",
      basePrice: 39,
      price: convertedPrices["Pro Plus"],
      description: "Complete SQL mastery with premium features",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "All Pro features",
        "1-on-1 mentorship sessions",
        "Custom project reviews",
        "Job placement assistance",
        "Exclusive masterclasses",
        "Lifetime access",
        "Priority feature requests"
      ],
      buttonText: "Go Pro Plus",
      popular: false,
    }
  ];

  // Create a master list of all unique features
  const allFeatures = Array.from(
    new Set(
      plans.flatMap(plan => plan.features)
    )
  );

  const handlePayment = async (plan: typeof plans[0]) => {
    if (plan.price === 0) {
      toast.success("Welcome to SQL Quest Interactive Free!");
      return;
    }

    try {
      // Call Supabase edge function to create Razorpay order
      const { data: order, error: createError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { 
          planName: plan.name,
          currency: currency,
          amount: plan.price,
        }
      });

      if (createError || !order) {
        toast.error("Failed to start payment. Try again.");
        console.error("Create order failed:", createError);
        return;
      }

      if (order.amount === 0) {
        toast.success(order.message || "Free plan activated!");
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "SQL Quest Interactive",
        description: `${plan.name} Plan Subscription - ${formatPrice(plan.price)}`,
        image: "/SQL_LOGO.png",
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Call Supabase edge function to verify payment
            const { data: verifyResult, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            });

            if (verifyError || !verifyResult?.valid) {
              toast.error("Payment verification failed");
              console.error("Verification error:", verifyError || verifyResult);
              return;
            }

            toast.success(`Payment successful! Welcome to ${plan.name}!`);
          } catch (e) {
            toast.error("Could not verify payment");
            console.error("Payment verification error:", e);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999"
        },
        notes: {
          plan: plan.name,
          currency: currency,
          originalPrice: `$${plan.basePrice}`,
          localPrice: formatPrice(plan.price),
          features: plan.features.join(", ")
        },
        theme: {
          color: "hsl(var(--primary))"
        },
        modal: {
          ondismiss: function() {
            toast.error("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
      console.error("Payment error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your SQL Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Select the perfect plan to accelerate your SQL learning and advance your career
          </p>
          
          {/* Currency Selector */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <Select value={currency} onValueChange={setCurrency} disabled={currencyLoading}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
                  <SelectItem key={code} value={code}>
                    {info.symbol} {info.name} ({code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currencyLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading currency data...</span>
            </div>
          )}

          {currencyError && (
            <p className="text-destructive text-sm">
              {currencyError}. Showing USD prices.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''} transition-all duration-300 hover:shadow-lg`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                  </span>
                  {plan.price !== 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {plan.basePrice !== plan.price && currency !== 'USD' && (
                        <span>≈ ${plan.basePrice} USD</span>
                      )}
                      <span className="block">/month</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePayment(plan)}
                  disabled={currencyLoading}
                >
                  {currencyLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Feature Comparison</CardTitle>
              <CardDescription className="text-center">
                Compare all features across our plans at a glance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Feature</TableHead>
                    <TableHead className="text-center font-semibold">
                      Free<br />
                      <span className="text-sm font-normal text-muted-foreground">
                        {formatPrice(0)}
                      </span>
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Pro<br />
                      <span className="text-sm font-normal text-muted-foreground">
                        {formatPrice(convertedPrices.Pro)}
                      </span>
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Pro Plus<br />
                      <span className="text-sm font-normal text-muted-foreground">
                        {formatPrice(convertedPrices["Pro Plus"])}
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allFeatures.map((feature) => (
                    <TableRow key={feature}>
                      <TableCell className="font-semibold">{feature}</TableCell>
                      <TableCell className="text-center">
                        {plans[0].features.includes(feature) && (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {plans[1].features.includes(feature) && (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {plans[2].features.includes(feature) && (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans come with a 7-day money-back guarantee. No questions asked.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Prices shown in {SUPPORTED_CURRENCIES[currency]?.name || currency} • Real-time currency conversion
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;