// import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { FileText, Check, Crown, CreditCard, LogOut, LayoutDashboard, Users, BarChart3, Settings, HelpCircle } from "lucide-react";
// import { useLocation } from "wouter";
// import { apiRequest, queryClient } from "@/lib/queryClient";

// // --- STEP 1: Dock aur uske items ko import/define karein ---
// import Dock from "@/components/Dock";
// import type { DockItemData } from "@/components/Dock";

// const mainMenuItems = [
//   { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
//   { href: "/choose-template", label: "Create Invoice", icon: <FileText className="size-5" /> },
//   { href: "/clients", label: "Clients", icon: <Users className="size-5" /> },
//   { href: "/reports", label: "Reports", icon: <BarChart3 className="size-5" /> },
// ];
// const footerMenuItems = [
//   { href: "/settings", label: "Settings", icon: <Settings className="size-5" /> },
//   { href: "/help", label: "Help", icon: <HelpCircle className="size-5" /> },
// ];
// // -----------------------------------------------------------

// // Custom hook to dynamically load Razorpay script
// const useRazorpayScript = () => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => setIsLoaded(true);
//     document.body.appendChild(script);
//     return () => { document.body.removeChild(script); };
//   }, []);
//   return isLoaded;
// };

// export default function Subscription() {
//   const { user, isLoading } = useAuth();
//   const { toast } = useToast();
//   const [, setLocation] = useLocation();
//   const isRazorpayLoaded = useRazorpayScript();

//   useEffect(() => {
//     if (!isLoading && !user) {
//       setLocation("/signin");
//     }
//   }, [user, isLoading, setLocation]);

//   const handlePayment = async (plan: 'monthly' | 'yearly') => {
//     // ... (handlePayment logic jaisa tha waisa hi)
//   };

//   // --- STEP 2: Dock ke liye logic add karein ---
//   const getDockItems = (isSubscribed: boolean): DockItemData[] => [
//     ...mainMenuItems.map(item => ({...item, onClick: () => setLocation(item.href)})),
//     ...footerMenuItems.map(item => ({...item, onClick: () => setLocation(item.href)})),
//     isSubscribed ? {
//         href: "/subscription", label: "Subscription", icon: <CreditCard className="size-5" />,
//         onClick: () => setLocation("/subscription"),
//     } : {
//         href: "/subscription", label: "Upgrade to Pro", icon: <Crown className="size-5 text-yellow-500" />,
//         onClick: () => setLocation("/subscription"),
//     },
//     {
//         href: "/auth/logout", label: "Sign Out", icon: <LogOut className="size-5 text-red-500" />,
//         onClick: () => { window.location.href = "/auth/logout"; },
//     },
//   ];
//   // ----------------------------------------------

//   if (isLoading) {
//     return <div className="min-h-screen flex items-center justify-center">...Loading...</div>;
//   }
//   if (!user) return null;

//   const isSubscribed = user.subscriptionStatus === 'active';
//   const dockItems = getDockItems(isSubscribed);

//   const pricingPlans = [
//     {
//       name: "Monthly Pro", price: "₹399", period: "per month",
//       description: "Perfect for growing businesses",
//       features: [
//         "All Premium & Pro invoice templates",
//         "Unlimited invoices",
//         "Advanced customization",
//         "Priority support",
//       ],
//       planType: "monthly" as const, popular: true
//     },
//     {
//       name: "Yearly Pro", price: "₹3,999", period: "per year",
//       description: "Save over 15% annually",
//       features: [
//         "Everything in Monthly Pro",
//         "2 months free (included in price)",
//         "Early access to new features",
//         "Invoice analytics (coming soon)",
//       ],
//       planType: "yearly" as const, popular: false, badge: "BEST VALUE"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground">
//       {/* Sidebar ki jagah Dock aa gaya hai */}
//       <Dock items={dockItems} />

//       {/* --- STEP 3: Main content mein padding-left add karein --- */}
//       <main className="container mx-auto px-6 py-8 pl-24 sm:pl-28">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-foreground mb-4">
//               {isSubscribed ? 'Manage Your Subscription' : 'Upgrade to Pro'}
//             </h1>
//             <p className="text-lg text-muted-foreground">
//               {isSubscribed
//                 ? `You're currently on the ${user.subscriptionTier} plan.`
//                 : 'Unlock all premium themes and unlimited invoices.'}
//             </p>
//           </div>

//           {isSubscribed ? (
//             <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
//                   <Crown className="w-6 h-6 text-primary" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-foreground mb-2">Active Pro Subscription</h3>
//                   <p className="text-sm text-muted-foreground mb-4">
//                     You have access to all premium features, including all templates and unlimited invoice generation.
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <Badge variant="secondary">
//                       {user.subscriptionTier === 'yearly' ? 'Yearly Pro - ₹3,999/year' : 'Monthly Pro - ₹399/month'}
//                     </Badge>
//                     {user.subscriptionEndsAt && (
//                       <span className="text-sm text-muted-foreground">
//                         Renews on {new Date(user.subscriptionEndsAt).toLocaleDateString()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-8">
//               {pricingPlans.map((plan, index) => (
//                 <Card
//                   key={index}
//                   className={`p-8 space-y-6 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
//                 >
//                   {plan.badge && ( <Badge className="absolute -top-3 left-1/2 -translate-x-12">{plan.badge}</Badge> )}
//                   {plan.popular && !plan.badge && ( <Badge className="absolute -top-3 left-1/2 -translate-x-12">MOST POPULAR</Badge> )}
//                   <div>
//                     <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
//                     <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-4xl font-bold text-foreground">{plan.price}</span>
//                       <span className="text-muted-foreground">{plan.period}</span>
//                     </div>
//                   </div>
//                   <ul className="space-y-3">
//                     {plan.features.map((feature, featureIndex) => (
//                       <li key={featureIndex} className="flex items-start gap-2">
//                         <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
//                         <span className="text-sm text-foreground">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   <Button
//                     className="w-full"
//                     size="lg"
//                     onClick={() => handlePayment(plan.planType)}
//                   >
//                     <CreditCard className="w-5 h-5 mr-2" />
//                     Subscribe Now
//                   </Button>
//                 </Card>
//               ))}
//             </div>
//           )}

//           <div className="mt-12 text-center">
//             <p className="text-sm text-muted-foreground mb-4">
//               Need help? Contact us at support@lomerse.com
//             </p>
//             <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//               <Check className="w-4 h-4 text-primary" />
//               <span>Secure payment powered by Razorpay</span>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Check, Crown, CreditCard } from "lucide-react"; // Removed unused FileText
// // import { useLocation } from "wouter"; // Removed unused import
// import { apiRequest, queryClient } from "@/lib/queryClient";
// import AppLayout from "@/components/AppLayout";

// // Custom hook to dynamically load Razorpay script
// const useRazorpayScript = () => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => setIsLoaded(true);
//     document.body.appendChild(script);
//     return () => { document.body.removeChild(script); };
//   }, []);
//   return isLoaded;
// };

// export default function Subscription() {
//   const { user, isLoading } = useAuth();
//   const { toast } = useToast();
//   // const [, setLocation] = useLocation(); // Removed unused variable
//   const isRazorpayLoaded = useRazorpayScript();

//   const handlePayment = async (plan: 'monthly' | 'yearly' | 'single') => {
//     if (!isRazorpayLoaded || !user) {
//         toast({ title: "Error", description: "Payment service is not loaded or you are not logged in.", variant: "destructive" });
//         return;
//     }

//     try {
//         // 1. Create Order (Backend se { orderId, amount, currency, keyId } aa raha hai)
//         const response = await apiRequest("POST", "/api/payment/create-order", { plan });

//         // response se JSON data nikalein
//         if (!response.ok) { // Check karein agar 200 OK nahin hai
//             throw new Error("Server responded with an error");
//         }
//         const order = await response.json(); // YEH HAI ASLI FIX

//         // Check karein ki backend se data sahi aaya hai
//         if (!order || !order.orderId || !order.keyId || !order.amount) {
//             console.error("Invalid order data received from server:", order);
//             toast({ title: "Order Creation Failed", description: "Received invalid data from server.", variant: "destructive" });
//             return;
//         }

//         // 2. Setup Razorpay Options
//         const options = {
//             key: order.keyId, // Backend se aa rahi Key ID use karein
//             amount: order.amount,
//             currency: order.currency,
//             name: "Lomerse",
//             description: plan === 'yearly' ? "Yearly Subscription" : (plan === 'monthly' ? "Monthly Subscription" : "Pay Per Invoice"),
//             order_id: order.orderId, // Backend se aa raha 'orderId' (capital I) use karein
//             handler: async function (response: any) {
//                 // 3. Verify Payment
//                 try {
//                     await apiRequest("POST", "/api/payment/verify-payment", {
//                         razorpay_order_id: response.razorpay_order_id,
//                         razorpay_payment_id: response.razorpay_payment_id,
//                         razorpay_signature: response.razorpay_signature,
//                     });
                    
//                     toast({ title: "Payment Successful!", description: "Welcome to Pro!" });
//                     queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
//                 } catch (verifyError) {
//                     toast({ title: "Payment Verification Failed", description: "Please contact support.", variant: "destructive" });
//                 }
//             },
//             prefill: {
//                 name: user.name || "",
//                 email: user.email,
//             },
//             theme: {
//                 color: "#16a34a"
//             }
//         };

//         // 4. Open Razorpay Checkout
//         const rzp = new (window as any).Razorpay(options);
//         rzp.open();

//     } catch (error) {
//       console.error("Payment initiation error:", error); // Console mein error check karne ke liye
//         toast({ title: "Order Creation Failed", description: "Could not initiate payment. Please try again.", variant: "destructive" });
//     }
//   };
//   // --- FUNCTION ENDS ---

//   if (isLoading || !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         ...Loading...
//       </div>
//     );
//   }

//   const isSubscribed = user.subscriptionStatus === 'active';

//   const pricingPlans = [
//     {
//       name: "Pay Per Invoice",
//       price: "₹19",
//       period: "per invoice",
//       description: "Perfect for occasional invoicing",
//       features: [
//         "All basic themes (4 themes)",
//         "PDF download",
//         "Editable fields",
//         "Basic customization"
//       ],
//       planType: "single" as const,
//       cta: "Get Started",
//       variant: "outline" as const,
//       popular: false
//     },
//     {
//       name: "Monthly Pro", price: "₹399", period: "per month",
//       description: "Perfect for growing businesses",
//       features: [
//         "All Premium & Pro invoice templates",
//         "Unlimited invoices",
//         "Advanced customization",
//         "Priority support",
//       ],
//       planType: "monthly" as const, popular: true,
//       cta: "Subscribe Now",
//       variant: "default" as const,
//     },
//     {
//       name: "Yearly Pro", price: "₹3,999", period: "per year",
//       description: "Save over 15% annually",
//       features: [
//         "Everything in Monthly Pro",
//         "2 months free (included in price)",
//         "Early access to new features",
//         "Invoice analytics (coming soon)",
//       ],
//       planType: "yearly" as const, popular: false, badge: "BEST VALUE",
//       cta: "Subscribe Now",
//       variant: "default" as const,
//     }
//   ];

//   const SubscriptionPageHeader = (
//     <div className="text-center">
//       <h1 className="text-4xl font-bold text-foreground mb-4">
//         {isSubscribed ? 'Manage Your Subscription' : 'Upgrade to Pro'}
//       </h1>
//       <p className="text-lg text-muted-foreground">
//         {isSubscribed
//           ? `You're currently on the ${user.subscriptionTier} plan.`
//          : 'Unlock all premium themes and unlimited invoices.'}
//       </p>
//     </div>
//   );

//   return (
//     <AppLayout pageHeader={SubscriptionPageHeader}>
//       <div className="max-w-7xl mx-auto">
//         {isSubscribed ? (
//           <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
//             <div className="flex items-start gap-4">
//               <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
//                 <Crown className="w-6 h-6 text-primary" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-foreground mb-2">Active Pro Subscription</h3>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   You have access to all premium features, including all templates and unlimited invoice generation.
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <Badge variant="secondary">
//                     {user.subscriptionTier === 'yearly' ? 'Yearly Pro - ₹3,999/year' : 'Monthly Pro - ₹3,999/month'}
//                   </Badge>
//                   {user.subscriptionEndsAt && (
//                     <span className="text-sm text-muted-foreground">
//                       Renews on {new Date(user.subscriptionEndsAt).toLocaleDateString()}
//                     </span> 
//                   )}
//                 </div> {/* CORRECTED: Removed extra </D> */}
//               </div>
//             </div>
//           </Card>
//         ) : (
//           <div className="grid md:grid-cols-3 gap-8">
//             {pricingPlans.map((plan, index) => (
//               <Card
//                 key={index}
//                 className={`p-8 space-y-6 relative flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}
//               >
//                 {plan.badge && ( <Badge className="absolute -top-3 left-1/2 -translate-x-12">{plan.badge}</Badge> )}
//                 {plan.popular && !plan.badge && ( <Badge className="absolute -top-3 left-1/2 -translate-x-12">MOST POPULAR</Badge> )}
                
//                   <div className="flex-grow">
//                       <div>
//                         <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
//                         <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
//                         <div className="flex items-baseline gap-2">
//                           <span className="text-4xl font-bold text-foreground">{plan.price}</span>
//                           {/* CORRECTED: Removed "Enter" text */}
//                           <span className="text-muted-foreground">{plan.period}</span>
//                         </div>
//                       </div>
//                       <ul className="space-y-3 mt-6">
//                         {plan.features.map((feature, featureIndex) => (
//                           <li key={featureIndex} className="flex items-start gap-2">
//                             <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
//                             <span className="text-sm text-foreground">{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                   </div> {/* CORRECTED: Removed "CH" text */}

//                 <Button
//                   className="w-full mt-6"
//                   size="lg"
//                     variant={plan.variant}
//                   onClick={() => handlePayment(plan.planType)}
//                   disabled={!isRazorpayLoaded || isLoading}
//                 >
//                   <CreditCard className="w-5 h-5 mr-2" />
//                   {/* CORRECTED: Removed "s" text */}
//                   {isRazorpayLoaded ? plan.cta : 'Loading Gateway...'}
//                 </Button>
//               </Card>
//             ))}
//           </div>
//         )}

//         <div className="mt-12 text-center">
//           <p className="text-sm text-muted-foreground mb-4">
//             Need help? Contact us at support@lomerse.com
//           </p>
//           <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//             {/* CORRECTED: Removed "Player" text */}
//             <Check className="w-4 h-4 text-primary" />
//             <span>Secure payment powered by Razorpay</span>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }


import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, CreditCard } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AppLayout from "@/components/AppLayout";

// ✅ Razorpay script loader
const useRazorpayScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  return isLoaded;
};

export default function Subscription() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const isRazorpayLoaded = useRazorpayScript();

  const handlePayment = async (plan: "monthly" | "yearly" | "single") => {
    console.log("PAYMENT BUTTON CLICKED, SENDING PLAN:", plan);
    if (!isRazorpayLoaded || !user) {
      toast({
        title: "Error",
        description: "Payment service not loaded or user not logged in.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 🔹 Step 1: Create order
      const response = await apiRequest("POST", "/api/payment/create-order", { plan });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const order = await response.json();

      if (!order?.orderId || !order?.keyId || !order?.amount) {
        toast({
          title: "Order Creation Failed",
          description: "Invalid order data from server.",
          variant: "destructive",
        });
        return;
      }

      // 🔹 Step 2: Razorpay options
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Lomerse",
        description:
          plan === "yearly"
            ? "Yearly Subscription"
            : plan === "monthly"
            ? "Monthly Subscription"
            : "Pay Per Invoice",
        order_id: order.orderId,
        handler: async function (paymentResponse: any) {
          try {
            // 🔹 Step 3: Verify payment
            await apiRequest("POST", "/api/payment/verify-payment", {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            // 🔹 Step 4: Refresh user data
            await queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });

            toast({
              title: "Payment Successful!",
              description: "Subscription activated. Redirecting...",
            });

            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email,
        },
        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new (window as any).Razorpay(options);

      // 🔹 Payment failure handling
      rzp.on("payment.failed", function (paymentFailedResponse: any) {
        console.error("Payment Failed:", paymentFailedResponse);
        toast({
          title: "Payment Failed",
          description:
            paymentFailedResponse.error?.description || "Your payment could not be processed.",
          variant: "destructive",
        });
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Order Creation Failed",
        description: "Could not initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ...Loading...
      </div>
    );
  }

  const isSubscribed = user.subscriptionStatus === "active";

  const pricingPlans = [
    {
      name: "Pay Per Invoice",
      price: "₹19",
      period: "per invoice",
      description: "Perfect for occasional invoicing",
      features: [
        "Access all basic & premium themes",
        "1 Invoice Download",
        "Editable fields",
        "Basic customization",
      ],
      planType: "single" as const,
      cta: "Get Started",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Monthly Pro",
      price: "₹399",
      period: "per month",
      description: "Perfect for growing businesses",
      features: [
        "All Premium & Pro invoice templates",
        "Unlimited invoices",
        "Advanced customization",
        "Priority support",
      ],
      planType: "monthly" as const,
      cta: "Subscribe Now",
      variant: "default" as const,
      popular: true,
    },
    {
      name: "Yearly Pro",
      price: "₹3,999",
      period: "per year",
      description: "Save over 15% annually",
      features: [
        "Everything in Monthly Pro",
        "2 months free",
        "Early access to new features",
        "Invoice analytics (coming soon)",
      ],
      planType: "yearly" as const,
      cta: "Subscribe Now",
      variant: "default" as const,
      popular: false,
      badge: "BEST VALUE",
    },
  ];

  const SubscriptionPageHeader = (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-foreground mb-4">
        {isSubscribed ? "Manage Your Subscription" : "Upgrade to Pro"}
      </h1>
      <p className="text-lg text-muted-foreground">
        {isSubscribed
          ? `You're on the ${user.subscriptionTier} plan.`
          : "Unlock all premium themes and unlimited invoices."}
      </p>
    </div>
  );

  return (
    <AppLayout pageHeader={SubscriptionPageHeader}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {isSubscribed ? (
          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Active Pro Subscription</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You have access to all premium templates and unlimited invoices.
                </p>
                <Badge variant="secondary">
                  {user.subscriptionTier === "yearly"
                    ? "Yearly Pro - ₹3,999/year"
                    : "Monthly Pro - ₹399/month"}
                </Badge>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 space-y-6 relative flex flex-col ${
                  plan.popular ? "border-primary shadow-lg" : "border"
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-semibold">
                    {plan.badge}
                  </Badge>
                )}
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 h-10">{plan.description}</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full mt-8"
                  size="lg"
                  variant={plan.variant}
                  onClick={() => handlePayment(plan.planType)}
                  disabled={!isRazorpayLoaded || isLoading}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isRazorpayLoaded ? plan.cta : "Loading..."}
                </Button>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need help? Contact us at support@lomerse.com
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-primary" />
            <span>Secure payment powered by Razorpay</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

const PLAN_PRICES = {
  monthly: 39900,
  yearly: 399900,
};
