// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useLocation } from "wouter";
// import {
//   LayoutDashboard, Users, Crown, CreditCard, Settings, BarChart3, HelpCircle, LogOut, FileText, User, Save
// } from "lucide-react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";

// import Dock from "@/components/Dock";
// import type { DockItemData } from "@/components/Dock";

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

// export default function ProfilePage() {
//   const { user, isLoading } = useAuth();
//   const { toast } = useToast();
//   const [, setLocation] = useLocation();
//   const queryClient = useQueryClient();

//   const [name, setName] = useState(user?.name || "");
//   const [companyName, setCompanyName] = useState(user?.companyName || "");

//   useEffect(() => {
//     if (!isLoading && !user) {
//       setLocation("/signin");
//     }
//     if (user) {
//       setName(user.name || "");
//       setCompanyName(user.companyName || "");
//     }
//   }, [user, isLoading, setLocation]);

//   // --- YEH HAI UPDATE: Profile update karne ke liye mutation ---
//   const updateProfileMutation = useMutation({
//     mutationFn: (updatedProfile: { name: string; companyName: string }) => {
//       // Backend API ko call karein
//       return apiRequest("PUT", "/api/profile", updatedProfile);
//     },
//     onSuccess: () => {
//       toast({ title: "Profile Updated Successfully!" });
//       // User data ko refresh karein taaki poore app mein update ho jaaye
//       queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
//     },
//     onError: () => {
//       toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
//     }
//   });

//   const handleSave = () => {
//     // 'mutate' function ko call karke data backend par bhejein
//     updateProfileMutation.mutate({ name, companyName });
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
//     return <div className="min-h-screen flex items-center justify-center">...Loading...</div>;
//   }
//   if (!user) return null;

//   const isSubscribed = user.subscriptionStatus === 'active';
//   const dockItems = getDockItems(isSubscribed);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground">
//       <Dock items={dockItems} />

//       <main className="container mx-auto px-6 py-8 pl-24 sm:pl-28">
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//             My Profile
//           </h1>
//           <p className="text-muted-foreground">
//             Update your personal and company details.
//           </p>
//         </div>

//         <Card className="max-w-2xl">
//           <CardHeader>
//             <CardTitle>Profile Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email Address</Label>
//               <Input id="email" value={user.email} disabled />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="companyName">Company Name</Label>
//               <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Lomerse Inc." />
//             </div>
//             <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
//               {updateProfileMutation.isPending ? "Saving..." : <> <Save className="w-4 h-4 mr-2"/> Save Changes</>}
//             </Button>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Save } from "lucide-react"; // --- YEH HAI UPDATE: Sirf 'Save' icon rakha ---
// import { useMutation, useQueryClient } from "@tanstack/react/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// --- YEH HAI UPDATE: AppLayout ko import kiya ---
import AppLayout from "@/components/AppLayout";

// --- YEH HAI UPDATE: Dock, menu items, aur baaki ke icons hata diye gaye ---

export default function ProfilePage() {
  const { user, isLoading } = useAuth(); // isLoading ko rakha, taaki initial state set ho sake
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // --- Page-specific state wahi hai ---
  const [name, setName] = useState(user?.name || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");

  // --- YEH HAI UPDATE: Auth redirect wala useEffect hata diya gaya ---
  useEffect(() => {
    // Yeh effect ab sirf 'user' data aane par form fields ko set karega
    if (user) {
      setName(user.name || "");
      setCompanyName(user.companyName || "");
    }
  }, [user]); // isLoading aur setLocation dependencies se hata diye gaye

  // --- Page-specific mutation wahi hai ---
  const updateProfileMutation = useMutation({
    mutationFn: (updatedProfile: { name: string; companyName: string }) => {
      return apiRequest("PUT", "/api/profile", updatedProfile);
    },
    onSuccess: () => {
      toast({ title: "Profile Updated Successfully!" });
      queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
    }
  });

  // --- Page-specific handler wahi hai ---
  const handleSave = () => {
    updateProfileMutation.mutate({ name, companyName });
  };
  
  // --- YEH HAI UPDATE: getDockItems, dockItems, aur loading/!user checks hata diye gaye ---

  // --- YEH HAI UPDATE: Page header ko define kiya ---
  const ProfilePageHeader = (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
        My Profile
      </h1>
      <p className="text-muted-foreground">
        Update your personal and company details.
      </p>
    </div>
  );
  
  // AppLayout loading state handle karta hai,
  // lekin humein 'user' ke load hone ka wait karna pad sakta hai taaki form default values se bhare.
  // Agar 'user' null hai jab component render hota hai, 'name' aur 'companyName' empty rahenge.
  // 'useEffect' isko handle kar lega.
  
  return (
    // --- YEH HAI UPDATE: Page ko AppLayout mein wrap kiya ---
    <AppLayout pageHeader={ProfilePageHeader}>
      
      {/* Saare wrapper divs (min-h-screen, main) hata diye gaye hain */}
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.Ttarget.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            {/* AppLayout loading handle karta hai, isliye hum 'user.email' ko safely access kar sakte hain.
              isLoading check optional hai, lekin safety ke liye rakha ja sakta hai.
            */}
            <Input id="email" value={isLoading ? "Loading..." : user?.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Lomerse Inc." />
          </div>
          <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? "Saving..." : <> <Save className="w-4 h-4 mr-2"/> Save Changes</>}
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}