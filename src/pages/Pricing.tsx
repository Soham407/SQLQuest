import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
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

  const handlePayment = (plan: typeof plans[0]) => {
    if (plan.price === 0) {
      toast.success("Welcome to SQL Quest Interactive Free!");
      return;
    }

    // Razorpay configuration
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual key
      amount: plan.razorpayAmount, // Amount in paise
      currency: "INR",
      name: "SQL Quest Interactive",
      description: `${plan.name} Plan Subscription`,
      image: "/favicon.ico", // Your logo
      handler: function (response: any) {
        // Payment successful
        toast.success("Payment successful! Welcome to " + plan.name + "!");
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);
        
        // Here you would typically:
        // 1. Send payment details to your backend for verification
        // 2. Update user's subscription status
        // 3. Redirect to dashboard or success page
      },
      prefill: {
        name: "John Doe", // You can get this from user context
        email: "john@example.com", // You can get this from user context
        contact: "9999999999" // You can get this from user context
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