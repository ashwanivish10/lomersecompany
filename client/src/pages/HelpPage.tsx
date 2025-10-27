// import React from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useLocation } from "wouter";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
// import {
//   LayoutDashboard, Users, Crown, CreditCard, Settings, BarChart3, HelpCircle, LogOut, FileText, Mail, BookOpen
// } from "lucide-react";

// // Dock aur uske items
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

// // FAQ ke liye aam sawaal-jawaab
// const faqs = [
//     {
//         question: "How do I create a new invoice?",
//         answer: "You can create a new invoice by clicking on the 'Create Invoice' icon in the dock. This will first take you to the template selection page, then to the theme selection page, and finally to the editor."
//     },
//     {
//         question: "How can I add my company logo?",
//         answer: "On the final invoice editor page, you'll find an 'Upload Logo' button in the header. Click it to upload your company's logo, which will then appear on the invoice preview."
//     },
//     {
//         question: "How do I upgrade to a Pro plan?",
//         answer: "Click on the 'Upgrade to Pro' or 'Subscription' icon in the dock. This will take you to the subscription page where you can choose and pay for a plan."
//     },
//     {
//         question: "Can I save a client's details?",
//         answer: "Yes! Go to the 'Clients' page from the dock. You can add new clients, and their details will be saved for future invoices."
//     }
// ];

// export default function HelpPage() {
//     const { user, isLoading } = useAuth();
//     const [, setLocation] = useLocation();

//     // Dock ke liye logic
//     const getDockItems = (isSubscribed: boolean): DockItemData[] => [
//         ...mainMenuItems.map(item => ({...item, onClick: () => setLocation(item.href)})),
//         ...footerMenuItems.map(item => ({...item, onClick: () => setLocation(item.href)})),
//         isSubscribed ? {
//             href: "/subscription", label: "Subscription", icon: <CreditCard className="size-5" />,
//             onClick: () => setLocation("/subscription"),
//         } : {
//             href: "/subscription", label: "Upgrade to Pro", icon: <Crown className="size-5 text-yellow-500" />,
//             onClick: () => setLocation("/subscription"),
//         },
//         {
//             href: "/auth/logout", label: "Sign Out", icon: <LogOut className="size-5 text-red-500" />,
//             onClick: () => { window.location.href = "/auth/logout"; },
//         },
//     ];

//     if (isLoading) {
//         return <div className="min-h-screen flex items-center justify-center">...Loading...</div>;
//     }
//     if (!user) {
//         // Auth check ke liye useEffect/redirect use karna better hai
//         return null;
//     }

//     const isSubscribed = user.subscriptionStatus === 'active';
//     const dockItems = getDockItems(isSubscribed);

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground">
//             <Dock items={dockItems} />

//             <main className="container mx-auto px-6 py-8 pl-24 sm:pl-28">
//                 <div className="mb-10">
//                     <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//                         Help & Support
//                     </h1>
//                     <p className="text-muted-foreground">
//                         Find answers to common questions and get in touch with our team.
//                     </p>
//                 </div>

//                 <div className="grid lg:grid-cols-3 gap-8">
//                     {/* Left Column: FAQ Section */}
//                     <div className="lg:col-span-2">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Frequently Asked Questions</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <Accordion type="single" collapsible className="w-full">
//                                     {faqs.map((faq, index) => (
//                                         <AccordionItem value={`item-${index}`} key={index}>
//                                             <AccordionTrigger>{faq.question}</AccordionTrigger>
//                                             <AccordionContent>
//                                                 {faq.answer}
//                                             </AccordionContent>
//                                         </AccordionItem>
//                                     ))}
//                                 </Accordion>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Right Column: Contact & Docs */}
//                     <div className="lg:col-span-1">
//                         <Card className="sticky top-24">
//                             <CardHeader>
//                                 <CardTitle>Contact Support</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <p className="text-sm text-muted-foreground">
//                                     Can't find the answer you're looking for? Our team is here to help.
//                                 </p>
//                                 <a href="mailto:support@lomerse.com" className="w-full">
//                                     <Button variant="default" className="w-full">
//                                         <Mail className="w-4 h-4 mr-2" />
//                                         Email Support
//                                     </Button>
//                                 </a>
//                                 <a href="/docs" onClick={(e) => { e.preventDefault(); alert("Documentation page coming soon!"); }} className="w-full">
//                                    <Button variant="outline" className="w-full">
//                                        <BookOpen className="w-4 h-4 mr-2" />
//                                        Read Documentation
//                                    </Button>
//                                 </a>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }


import React from "react";
// --- YEH HAI UPDATE: useAuth aur useLocation hata diye gaye ---
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Mail, BookOpen // --- YEH HAI UPDATE: Sirf content ke icons rakhe gaye ---
} from "lucide-react";

// --- YEH HAI UPDATE: AppLayout ko import kiya ---
import AppLayout from "@/components/AppLayout"; 

// --- YEH HAI UPDATE: Dock, mainMenuItems, footerMenuItems, aur getDockItems hata diye gaye ---

// FAQ data wahi hai
const faqs = [
    {
        question: "How do I create a new invoice?",
        answer: "You can create a new invoice by clicking on the 'Create Invoice' icon in the dock. This will first take you to the template selection page, then to the theme selection page, and finally to the editor."
    },
    {
        question: "How can I add my company logo?",
        answer: "On the final invoice editor page, you'll find an 'Upload Logo' button in the header. Click it to upload your company's logo, which will then appear on the invoice preview."
    },
    {
        question: "How do I upgrade to a Pro plan?",
        answer: "Click on the 'Upgrade to Pro' or 'Subscription' icon in the dock. This will take you to the subscription page where you can choose and pay for a plan."
    },
    {
        question: "Can I save a client's details?",
        answer: "Yes! Go to the 'Clients' page from the dock. You can add new clients, and their details will be saved for future invoices."
    }
];

export default function HelpPage() {
    // --- YEH HAI UPDATE: Saare hooks aur logic (useAuth, useLocation, getDockItems, loading checks) hata diye gaye ---

    // --- YEH HAI UPDATE: Page header ko define kiya ---
    const HelpPageHeader = (
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Help & Support
        </h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get in touch with our team.
        </p>
      </div>
    );

    return (
        // --- YEH HAI UPDATE: Page ko AppLayout mein wrap kiya ---
        <AppLayout pageHeader={HelpPageHeader}>
            
            {/* Saare wrapper divs (min-h-screen, main) hata diye gaye hain */}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: FAQ Section */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Contact & Docs */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Contact Support</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Can't find the answer you're looking for? Our team is here to help.
                            </p>
                            <a href="mailto:support@lomerse.com" className="w-full">
                                <Button variant="default" className="w-full">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email Support
                                </Button>
                            </a>
                            <a href="/docs" onClick={(e) => { e.preventDefault(); alert("Documentation page coming soon!"); }} className="w-full">
                               <Button variant="outline" className="w-full">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Read Documentation
                               </Button>
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}