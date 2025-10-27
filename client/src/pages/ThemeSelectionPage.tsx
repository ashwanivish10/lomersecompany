// import React, { useState } from 'react';
// import { useLocation } from "wouter";
// import { useAuth } from "../hooks/useAuth";
// import { Card } from "../components/ui/card";
// import { Badge } from "../components/ui/badge";
// import { Crown, Lock, CheckCircle, LayoutDashboard, Users, CreditCard, Settings, BarChart3, HelpCircle, LogOut, FileText, User } from "lucide-react";
// import InvoicePreview from "../components/InvoicePreview";
// import { Button } from "../components/ui/button";

// // Dock aur Breadcrumb components
// import Dock from "@/components/Dock";
// import type { DockItemData } from "@/components/Dock";
// import AppBreadcrumb from "@/components/AppBreadcrumb"; // Breadcrumb

// const mainMenuItems = [
//   { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
//   { href: "/choose-template", label: "Create Invoice", icon: <FileText className="size-5" /> },
//   { href: "/clients", label: "Clients", icon: <Users className="size-5" /> },
//   { href: "/profile", label: "Profile", icon: <User className="size-5" /> },
//   { href: "/reports", label: "Reports", icon: <BarChart3 className="size-5" /> },
// ];
// const footerMenuItems = [
//   { href: "/settings", label: "Settings", icon: <Settings className="size-5" /> },
//   { href: "/help", label: "Help", icon: <HelpCircle className="size-5" /> },
// ];

// const themeCategories = {
//   basic: ['default', 'blue', 'green', 'purple'],
//   premium: ['slate', 'ocean', 'sunset'],
//   professional: ['mint', 'lavender', 'blush', 'graphite'],
//   curated: ['seaside', 'vibrant', 'pastel', 'rose', 'lime']
// };

// interface ThemeButtonProps {
//   theme: string;
//   selected: boolean;
//   onClick: () => void;
//   locked: boolean;
// }

// function ThemeButton({ theme, selected, onClick, locked }: ThemeButtonProps) {
//   const themeColors: Record<string, { bg: string; border?: string }> = {
//     default: { bg: '#f59e0b' }, blue: { bg: '#2563eb' }, green: { bg: '#16a34a' }, purple: { bg: '#4f46e5' }, 
//     slate: { bg: '#374151' }, ocean: { bg: '#0c4a6e' }, sunset: { bg: '#7c2d12' }, 
//     mint: { bg: '#f0fdfa', border: '#14b8a6' }, lavender: { bg: '#f5f3ff', border: '#8b5cf6' }, 
//     blush: { bg: '#fff1f2', border: '#f43f5e' }, graphite: { bg: 'linear-gradient(to bottom right, #f9fafb, #e5e7eb)', border: '#9ca3af' }, 
//     seaside: { bg: 'linear-gradient(to right, #FAF8F1 50%, #34656D 50%)', border: '#FAEAB1' }, 
//     vibrant: { bg: 'linear-gradient(to right, #E9E3DF 50%, #FF7A30 50%)', border: '#465C88' }, 
//     pastel: { bg: 'linear-gradient(to right, #FAF7F3 50%, #D9A299 50%)', border: '#F0E4D3' }, 
//     rose: { bg: 'linear-gradient(to right, #EEEEEE 50%, #B9375D 50%)', border: '#E7D3D3' }, 
//     lime: { bg: 'linear-gradient(to right, #FFFADC 50%, #B6F500 50%)', border: '#A4DD00' },
//   };
//   const color = themeColors[theme] || themeColors.default;

//   return (
//     <button 
//       onClick={onClick} 
//       disabled={locked} 
//       className={`relative w-16 h-16 rounded-lg border-2 transition-all ${selected ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-border hover:scale-105'} ${locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`} 
//       style={{ background: color.bg, borderColor: selected ? 'hsl(var(--primary))' : color.border || 'hsl(var(--border))' }} 
//       title={theme.charAt(0).toUpperCase() + theme.slice(1)}
//     >
//       {locked && (<div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg"><Lock className="w-5 h-5 text-white" /></div>)}
//     </button>
//   );
// }


// export default function ThemeSelectionPage() {
//   const { user, isLoading } = useAuth();
//   const [, setLocation] = useLocation();
//   const isSubscribed = user?.subscriptionStatus === 'active';

//   const searchParams = new URLSearchParams(window.location.search);
//   const templateName = searchParams.get('template') || 'classic';

//   const [selectedTheme, setSelectedTheme] = useState('default');

//   const handleThemeSelect = (theme: string) => {
//     const isProTheme = !themeCategories.basic.includes(theme);
//     if (isProTheme && !isSubscribed) {
//       setLocation('/subscription');
//       return;
//     }
//     setSelectedTheme(theme);
//   };

//   const handleFinalize = () => {
//     setLocation(`/create-invoice?template=${templateName}&theme=${selectedTheme}`);
//   };
  
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
  
//   if (isLoading) {
//     return <div className="min-h-screen flex items-center justify-center">...Loading...</div>
//   }
//   if (!user) return null;
  
//   const dockItems = getDockItems(!!isSubscribed);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground">
//       <Dock items={dockItems} />
      
//       {/* --- YEH HAI UPDATE: <header> poori tarah se hata diya gaya hai --- */}
//       <div className="pl-24 sm:pl-28">
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
//           <AppBreadcrumb />

//           <div className="grid lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-1 space-y-8 h-fit lg:sticky top-8">
//                <Card className="p-6">
//                  <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-lg font-semibold text-foreground">Choose Your Color</h2>
//                     {/* Finalize button ko card ke andar move kar diya hai */}
//                     <Button onClick={handleFinalize} size="sm">
//                         Next <CheckCircle className="w-4 h-4 ml-2" />
//                     </Button>
//                  </div>
//                  {Object.entries(themeCategories).map(([category, themes]) => (
//                    <div key={category} className="mb-4 last:mb-0">
//                      <div className="flex items-center gap-2 mb-3">
//                        <h3 className="text-sm font-medium text-muted-foreground capitalize">{category}</h3>
//                        {category !== 'basic' && !isSubscribed && <Badge className="text-xs"><Crown className="w-3 h-3 mr-1" />Pro</Badge>}
//                      </div>
//                      <div className="flex flex-wrap gap-3">
//                        {themes.map((theme) => (
//                          <ThemeButton key={theme} theme={theme} selected={selectedTheme === theme} onClick={() => handleThemeSelect(theme)} locked={category !== 'basic' && !isSubscribed} />
//                        ))}
//                      </div>
//                    </div>
//                  ))}
//                </Card>
//             </div>

//             <div className="lg:col-span-2">
//               <InvoicePreview data={null} logoUrl={null} theme={selectedTheme} template={templateName} />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Crown, Lock, CheckCircle } from "lucide-react";
import InvoicePreview from "../components/InvoicePreview";
import { Button } from "../components/ui/button";

// --- YEH HAI UPDATE: Layout components ---
import AppLayout from "../components/AppLayout"; // AppLayout ko import karein
import AppBreadcrumb from "@/components/AppBreadcrumb"; // Breadcrumb wahi hai

// --- YEH HAI UPDATE: Dock se related imports (mainMenuItems, footerMenuItems, aur icons) hata diye gaye hain ---

// ThemeCategories wahi hai
const themeCategories = {
  basic: ['default', 'blue', 'green', 'purple'],
  premium: ['slate', 'ocean', 'sunset'],
  professional: ['mint', 'lavender', 'blush', 'graphite'],
  curated: ['seaside', 'vibrant', 'pastel', 'rose', 'lime']
};

interface ThemeButtonProps {
  theme: string;
  selected: boolean;
  onClick: () => void;
  locked: boolean;
}

// ThemeButton component (wahi hai)
function ThemeButton({ theme, selected, onClick, locked }: ThemeButtonProps) {
  const themeColors: Record<string, { bg: string; border?: string }> = {
    default: { bg: '#f59e0b' }, blue: { bg: '#2563eb' }, green: { bg: '#16a34a' }, purple: { bg: '#4f46e5' }, 
    slate: { bg: '#374151' }, ocean: { bg: '#0c4a6e' }, sunset: { bg: '#7c2d12' }, 
    mint: { bg: '#f0fdfa', border: '#14b8a6' }, lavender: { bg: '#f5f3ff', border: '#8b5cf6' }, 
    blush: { bg: '#fff1f2', border: '#f43f5e' }, graphite: { bg: 'linear-gradient(to bottom right, #f9fafb, #e5e7eb)', border: '#9ca3af' }, 
    seaside: { bg: 'linear-gradient(to right, #FAF8F1 50%, #34656D 50%)', border: '#FAEAB1' }, 
    vibrant: { bg: 'linear-gradient(to right, #E9E3DF 50%, #FF7A30 50%)', border: '#465C88' }, 
    pastel: { bg: 'linear-gradient(to right, #FAF7F3 50%, #D9A299 50%)', border: '#F0E4D3' }, 
    rose: { bg: 'linear-gradient(to right, #EEEEEE 50%, #B9375D 50%)', border: '#E7D3D3' }, 
    lime: { bg: 'linear-gradient(to right, #FFFADC 50%, #B6F500 50%)', border: '#A4DD00' },
  };
  const color = themeColors[theme] || themeColors.default;

  return (
    <button 
      onClick={onClick} 
      disabled={locked} 
      className={`relative w-16 h-16 rounded-lg border-2 transition-all ${selected ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-border hover:scale-105'} ${locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`} 
      style={{ background: color.bg, borderColor: selected ? 'hsl(var(--primary))' : color.border || 'hsl(var(--border))' }} 
      title={theme.charAt(0).toUpperCase() + theme.slice(1)}
    >
      {locked && (<div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg"><Lock className="w-5 h-5 text-white" /></div>)}
    </button>
  );
}


export default function ThemeSelectionPage() {
  // --- YEH HAI UPDATE: Sirf 'user' ki zaroorat hai ---
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // AppLayout loading/null check handle karta hai, isliye hum maan sakte hain ki 'user' hai
  const isSubscribed = user!.subscriptionStatus === 'active';

  const searchParams = new URLSearchParams(window.location.search);
  const templateName = searchParams.get('template') || 'classic';

  const [selectedTheme, setSelectedTheme] = useState('default');

  // Logic functions (wahi hain)
  const handleThemeSelect = (theme: string) => {
    const isProTheme = !themeCategories.basic.includes(theme);
    if (isProTheme && !isSubscribed) {
      setLocation('/subscription');
      return;
    }
    setSelectedTheme(theme);
  };

  const handleFinalize = () => {
    setLocation(`/create-invoice?template=${templateName}&theme=${selectedTheme}`);
  };
  
  // --- YEH HAI UPDATE: getDockItems, dockItems, isLoading/!user checks, sab hata diye gaye hain ---

  return (
    // --- YEH HAI UPDATE: Page ko AppLayout mein wrap kiya gaya hai ---
    <AppLayout pageHeader={<AppBreadcrumb />}>
      
      {/* Baaki sab layout divs (min-h-screen, pl-24, main) hata diye gaye hain.
        Sirf page ka specific content yahaan rahega.
      */}
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8 h-fit lg:sticky top-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Choose Your Color</h2>
                <Button onClick={handleFinalize} size="sm">
                  Next <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
              {Object.entries(themeCategories).map(([category, themes]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground capitalize">{category}</h3>
                    {category !== 'basic' && !isSubscribed && <Badge className="text-xs"><Crown className="w-3 h-3 mr-1" />Pro</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {themes.map((theme) => (
                      <ThemeButton key={theme} theme={theme} selected={selectedTheme === theme} onClick={() => handleThemeSelect(theme)} locked={category !== 'basic' && !isSubscribed} />
                    ))}
                  </div>
                </div>
              ))}
            </Card>
        </div>

        <div className="lg:col-span-2">
          <InvoicePreview data={null} logoUrl={null} theme={selectedTheme} template={templateName} />
        </div>
      </div>
    </AppLayout>
  );
}