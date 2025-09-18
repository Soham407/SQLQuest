import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Star, Zap, Crown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const plans = [
    {
      name: "Free",
      price: 0,
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
      razorpayAmount: 0
    },
    {
      name: "Pro",
      price: "TBD",
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
      razorpayAmount: 2999 // ₹29.99 (you can change this later)
    },
    {
      name: "Pro Plus",
      price: "TBD",
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
      razorpayAmount: 4999 // ₹49.99 (you can change this later)
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
        body: { planName: plan.name }
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
        currency: order.currency || "INR",
        name: "SQL Quest Interactive",
        description: `${plan.name} Plan Subscription`,
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

            toast.success("Payment successful! Welcome to " + plan.name + "!");
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan to accelerate your SQL learning and advance your career
          </p>
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
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price !== 0 && <span className="text-muted-foreground">/month</span>}
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
                >
                  {plan.buttonText}
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
                    <TableHead className="text-center font-semibold">Free</TableHead>
                    <TableHead className="text-center font-semibold">Pro</TableHead>
                    <TableHead className="text-center font-semibold">Pro Plus</TableHead>
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
        </div>
      </div>
    </div>
  );
};

export default Pricing;