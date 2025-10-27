// import React, { useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useLocation } from "wouter";
// import AppLayout from "@/components/AppLayout";
// import {
//   LayoutDashboard,
//   Users,
//   Crown,
//   CreditCard,
//   Settings,
//   BarChart3,
//   HelpCircle,
//   LogOut,
//   FileText,
//   Calendar,
//   Plus,
//   User,
//   Trash2,
// } from "lucide-react";
// import type { Invoice } from "@shared/schema";
// import { queryClient, apiRequest } from "@/lib/queryClient";
// import { isUnauthorizedError } from "@/lib/authUtils";

// // Dock component ko import karein
// import Dock from "@/components/Dock";
// import type { DockItemData } from "@/components/Dock";
// // Logo ke liye fileIcon ko import karein
// import fileIcon from "@/attached_assets/file.png";


// // Dock ke saare items yahaan define hain
// const mainMenuItems = [
//   { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
//   { href: "/choose-template", label: "Create Invoice", icon: <FileText className="size-5" /> },
//   { href: "/clients", label: "Clients", icon: <Users className="size-5" /> },
//   { href: "/Profile", label: "Profile", icon: <User className="size-5" /> },
//   { href: "/reports", label: "Reports", icon: <BarChart3 className="size-5" /> },
// ];

// const footerMenuItems = [
//   { href: "/settings", label: "Settings", icon: <Settings className="size-5" /> },
//   { href: "/help", label: "Help", icon: <HelpCircle className="size-5" /> },
// ];


// export default function Dashboard() {
//   const { user, isLoading } = useAuth();
//   const { toast } = useToast();
//   const [, setLocation] = useLocation();

//   const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
//     queryKey: ["/api/invoices"], enabled: !!user,
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => apiRequest("DELETE", `/api/invoices/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
//       toast({ title: "Invoice deleted successfully" });
//     },
//     onError: (error: Error) => {
//       if (isUnauthorizedError(error)) {
//         setLocation("/signin");
//         return;
//       }
//       toast({ title: "Error", description: "Failed to delete invoice", variant: "destructive" });
//     },
//   });

//   useEffect(() => {
//     if (!isLoading && !user) {
//       toast({
//         title: "Unauthorized",
//         description: "You have been logged out. Please sign in.",
//         variant: "destructive",
//       });
//       setLocation("/signin");
//     }
//   }, [user, isLoading, toast, setLocation]);

//   // Dock ke liye final items array banayein
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
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   if (!user) return null;

//   const isSubscribed = user.subscriptionStatus === 'active';
//   const dockItems = getDockItems(isSubscribed);

//   const stats = [
//     { label: "Total Invoices", value: invoices.length, icon: <FileText className="w-5 h-5" /> },
//     { label: "This Month", value: invoices.filter(inv => new Date(inv.createdAt!).getMonth() === new Date().getMonth()).length, icon: <Calendar className="w-5 h-5" /> },
//     { label: "Plan", value: isSubscribed ? (user.subscriptionTier === 'yearly' ? 'Yearly Pro' : 'Monthly Pro') : 'Free', icon: <CreditCard className="w-5 h-5" /> },
//   ];

//   return (
    
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground transition-colors">
//       <Dock items={dockItems} />

//       <main className="container mx-auto px-6 py-8 pl-24 sm:pl-28">
        
//         {/* --- YEH HAI UPDATE: Header Section with Logo, Name, and User Avatar --- */}
//         <div className="flex justify-between items-center mb-10">
//             <div className="flex items-center gap-4">
//                 <img src={fileIcon} alt="Lomerse Logo" className="w-12 h-12 rounded-lg" />
//                 <div>
//                     <h1 className="text-3xl md:text-4xl font-bold text-foreground">
//                         Lomerse
//                     </h1>
//                     {/* <p className="text-muted-foreground mt-1">
//                         Welcome back, {user.name?.split(" ")[0]}!
//                     </p> */}
//                 </div>
//             </div>
//             <div className="flex items-center gap-3">
//                 <div className="hidden sm:flex flex-col text-right">
//                     <span className="font-semibold">{user.name}</span>
//                     <span className="text-sm text-muted-foreground">{user.email}</span>
//                 </div>
//                 <Avatar className="h-12 w-12 border-2 border-border">
//                     <AvatarImage src={user.avatarUrl} alt={user.name} />
//                     <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
//                 </Avatar>
//             </div>
//         </div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//           {stats.map((stat, index) => (
//             <Card key={index} className="p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
//                 {stat.icon}
//               </div>
//               <div className="text-3xl font-bold">{stat.value}</div>
//             </Card>
//           ))}
//         </div>

//         <div className="flex flex-wrap gap-4 mb-10">
//           <Button size="lg" onClick={() => setLocation("/choose-template")}>
//             <Plus className="w-5 h-5 mr-2" />
//             Create New Invoice
//           </Button>
//           {!isSubscribed && (
//             <Button size="lg" variant="outline" onClick={() => setLocation("/subscription")}>
//               <Crown className="w-5 h-5 mr-2" />
//               Upgrade to Pro
//             </Button>
//           )}
//         </div>

//         <div>
//           <h2 className="text-2xl font-semibold mb-6">Recent Invoices</h2>
//           {invoicesLoading ? (
//             <div className="flex justify-center py-12">...Loading...</div>
//           ) : invoices.length === 0 ? (
//             <Card className="p-10 text-center border-dashed border-2">
//               <FileText className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
//               <p className="text-muted-foreground mb-4">Let's create your first one!</p>
//               <Button onClick={() => setLocation("/choose-template")}>
//                 <Plus className="w-4 h-4 mr-2" /> Create Invoice
//               </Button>
//             </Card>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {invoices.map((invoice) => (
//                 <Card key={invoice.id} className="p-6 hover:shadow-lg transition-shadow">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h4 className="text-lg font-semibold mb-1">{invoice.clientName}</h4>
//                       <p className="text-sm font-bold text-primary">₹{invoice.totalAmount?.toFixed(2)}</p>
//                     </div>
//                     <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(invoice.id!)}>
//                       <Trash2 className="w-5 h-5 text-red-500" />
//                     </Button>
//                   </div>
//                   <div className="mt-4 pt-4 border-t border-dashed">
//                       <p className="text-xs text-muted-foreground">Invoice #: {invoice.invoiceNumber}</p>
//                       <p className="text-xs text-muted-foreground">
//                         Created: {new Date(invoice.createdAt!).toLocaleDateString()}
//                       </p>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }



import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import {
  Crown,
  CreditCard,
  FileText,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";
import type { Invoice } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import fileIcon from "@/attached_assets/file.png";

// --- Import the AppLayout ---
import AppLayout from "@/components/AppLayout";

// This is the unique header for the Dashboard page
const DashboardHeader = () => {
  const { user } = useAuth(); // AppLayout already checks if user exists

  return (
    <div className="flex justify-between items-center">
      {/* Left side: Logo and Title */}
      <div className="flex items-center gap-3">
        <img src={fileIcon} alt="Lomerse Logo" className="w-12 h-12 rounded-lg" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Lomerse
          </h1>
        </div>
      </div>
      
      {/* Right side: User Avatar (hidden on mobile, handled by Sheet) */}
      <div className="hidden md:flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="font-semibold">{user!.name}</span>
          <span className="text-sm text-muted-foreground">{user!.email}</span>
        </div>
        <Avatar className="h-12 w-12 border-2 border-border">
          <AvatarImage src={user!.avatarUrl} alt={user!.name} />
          <AvatarFallback>{user!.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};


export default function Dashboard() {
  const { user } = useAuth(); // Still need this for subscription status
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"], enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Invoice deleted successfully" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        setLocation("/signin");
        return;
      }
      toast({ title: "Error", description: "Failed to delete invoice", variant: "destructive" });
    },
  });

  // AppLayout handles loading, so we can assume 'user' exists here.
  const isSubscribed = user!.subscriptionStatus === 'active';

  const stats = [
    { label: "Total Invoices", value: invoices.length, icon: <FileText className="w-5 h-5" /> },
    { label: "This Month", value: invoices.filter(inv => new Date(inv.createdAt!).getMonth() === new Date().getMonth()).length, icon: <Calendar className="w-5 h-5" /> },
    { label: "Plan", value: isSubscribed ? (user!.subscriptionTier === 'yearly' ? 'Yearly Pro' : 'Monthly Pro') : 'Free', icon: <CreditCard className="w-5 h-5" /> },
  ];

  return (
    // Pass the unique header to the layout
    <AppLayout pageHeader={<DashboardHeader />}>
      
      {/* NO <Dock>, NO <main>, NO <div min-h-screen...
        Just the page content.
      */}
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <Button size="lg" onClick={() => setLocation("/choose-template")}>
          <Plus className="w-5 h-5 mr-2" />
          Create New Invoice
        </Button>
        {!isSubscribed && (
          <Button size="lg" variant="outline" onClick={() => setLocation("/subscription")}>
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Pro
          </Button>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Recent Invoices</h2>
        {invoicesLoading ? (
          <div className="flex justify-center py-12">...Loading...</div>
        ) : invoices.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-2">
            <FileText className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground mb-4">Let's create your first one!</p>
            <Button onClick={() => setLocation("/choose-template")}>
              <Plus className="w-4 h-4 mr-2" /> Create Invoice
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{invoice.clientName}</h4>
                    <p className="text-sm font-bold text-primary">₹{invoice.totalAmount?.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(invoice.id!)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed">
                  <p className="text-xs text-muted-foreground">Invoice #: {invoice.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(invoice.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}