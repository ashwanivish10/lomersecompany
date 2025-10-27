// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useLocation } from "wouter";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   LayoutDashboard, Users, Crown, CreditCard, Settings, BarChart3, HelpCircle, LogOut, FileText, User, Bell, Palette, Sparkles
// } from "lucide-react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";

// import Dock from "@/components/Dock";
// import type { DockItemData } from "@/components/Dock";
// import { useAppSettings } from "@/contexts/SettingsContext";
// import { useToast } from "@/hooks/use-toast";

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

// export default function SettingsPage() {
//     const { user, isLoading } = useAuth();
//     const [, setLocation] = useLocation();
//     const queryClient = useQueryClient();
//     const { toast } = useToast();
    
//     const { aiSuggestionsEnabled, toggleAISuggestions, darkMode, toggleDarkMode } = useAppSettings();

//     const [notifications, setNotifications] = useState({
//         emailOnPaid: true,
//         emailReminders: false,
//     });

//     // --- YEH HAI UPDATE: Settings save karne ke liye mutation ---
//     const updateSettingsMutation = useMutation({
//         mutationFn: (settings: { aiSuggestionsEnabled?: boolean, darkMode?: boolean }) => {
//             // Backend API /api/settings ko call karein
//             return apiRequest("PUT", "/api/settings", settings);
//         },
//         onSuccess: () => {
//             toast({ title: "Settings Saved!"});
//             // User data ko refresh karein taaki poore app mein update ho jaaye
//             queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
//         },
//         onError: () => {
//             toast({ title: "Error", description: "Could not save settings.", variant: "destructive"});
//         }
//     });

//     const handleAIToggle = () => {
//         // Pehle UI ko turant update karein
//         toggleAISuggestions();
//         // Phir backend par data bhejein
//         updateSettingsMutation.mutate({ aiSuggestionsEnabled: !aiSuggestionsEnabled });
//     };

//     const handleDarkModeToggle = () => {
//         // Pehle UI ko turant update karein
//         toggleDarkMode();
//         // Phir backend par data bhejein
//         updateSettingsMutation.mutate({ darkMode: !darkMode });
//     };
//     // ----------------------------------------------------
    
//     useEffect(() => {
//         const root = window.document.documentElement;
//         root.classList.toggle('dark', darkMode);
//     }, [darkMode]);
    
//     useEffect(() => {
//         if (!isLoading && !user) {
//             setLocation('/signin');
//         }
//     }, [isLoading, user, setLocation]);

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

//     if (isLoading || !user) {
//         return <div className="min-h-screen flex items-center justify-center">...Loading...</div>;
//     }

//     const isSubscribed = user.subscriptionStatus === 'active';
//     const dockItems = getDockItems(isSubscribed);

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground">
//             <Dock items={dockItems} />

//             <main className="container mx-auto px-6 py-8 pl-24 sm:pl-28">
//                 <div className="mb-10">
//                     <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//                         Settings
//                     </h1>
//                     <p className="text-muted-foreground">
//                         Manage your account, preferences, and app settings.
//                     </p>
//                 </div>

//                 <div className="grid gap-8">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Profile</CardTitle>
//                             <CardDescription>Manage your personal and company information.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="flex items-center justify-between">
//                             <p className="text-sm text-muted-foreground">Update your details that appear on invoices.</p>
//                             <Button variant="outline" onClick={() => setLocation('/profile')}>
//                                 <User className="w-4 h-4 mr-2"/>
//                                 Go to Profile
//                             </Button>
//                         </CardContent>
//                     </Card>
                    
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>AI Features</CardTitle>
//                             <CardDescription>Manage intelligent features within the app.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                            <div className="flex items-center justify-between p-4 rounded-lg border">
//                                 <Label htmlFor="ai-suggestions" className="flex items-center gap-3 cursor-pointer">
//                                     <Sparkles className="w-5 h-5 text-yellow-500" />
//                                     <div>
//                                         <span className="font-medium">Enable AI Suggestions</span>
//                                         <p className="text-xs text-muted-foreground">Get automatic suggestions for invoice item descriptions.</p>
//                                     </div>
//                                 </Label>
//                                 <Switch
//                                     id="ai-suggestions"
//                                     checked={aiSuggestionsEnabled}
//                                     onCheckedChange={handleAIToggle}
//                                     disabled={updateSettingsMutation.isPending}
//                                 />
//                            </div>
//                         </CardContent>
//                     </Card>
                    
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Appearance</CardTitle>
//                             <CardDescription>Customize the look and feel of the app.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                            <div className="flex items-center justify-between p-4 rounded-lg border">
//                                 <Label htmlFor="dark-mode" className="flex items-center gap-3 cursor-pointer">
//                                     <Palette className="w-5 h-5" />
//                                     <span>Dark Mode</span>
//                                 </Label>
//                                 <Switch
//                                     id="dark-mode"
//                                     checked={darkMode}
//                                     onCheckedChange={handleDarkModeToggle}
//                                     disabled={updateSettingsMutation.isPending}
//                                 />
//                            </div>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Notifications</CardTitle>
//                             <CardDescription>Manage how you receive notifications.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                            <div className="flex items-center justify-between p-4 rounded-lg border">
//                                 <Label htmlFor="email-paid" className="flex items-center gap-3 cursor-pointer">
//                                     <Bell className="w-5 h-5" />
//                                     <span>Email me when an invoice is paid</span>
//                                 </Label>
//                                 <Switch
//                                     id="email-paid"
//                                     checked={notifications.emailOnPaid}
//                                     onCheckedChange={(checked) => setNotifications(p => ({...p, emailOnPaid: checked}))}
//                                 />
//                            </div>
//                            <div className="flex items-center justify-between p-4 rounded-lg border">
//                                 <Label htmlFor="email-reminders" className="flex items-center gap-3 cursor-pointer">
//                                     <Bell className="w-5 h-5" />
//                                     <span>Send automatic payment reminders</span>
//                                 </Label>
//                                 <Switch
//                                     id="email-reminders"
//                                     checked={notifications.emailReminders}
//                                     onCheckedChange={(checked) => setNotifications(p => ({...p, emailReminders: checked}))}
//                                 />
//                            </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </main>
//         </div>
//     );
// }



import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Settings, // Icon is still used in the header
  User,     // Icon is still used in the content
  Bell, 
  Palette, 
  Sparkles
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// --- YEH HAI UPDATE: AppLayout ko import kiya ---
import AppLayout from "@/components/AppLayout"; 
// --- YEH HAI UPDATE: Dock se related imports hata diye gaye ---

import { useAppSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

// --- YEH HAI UPDATE: mainMenuItems, footerMenuItems, aur getDockItems hata diye gaye ---

export default function SettingsPage() {
    const { user } = useAuth(); // Sirf 'user' ki zaroorat hai
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    
    // Page-specific state and context
    const { aiSuggestionsEnabled, toggleAISuggestions, darkMode, toggleDarkMode } = useAppSettings();
    const [notifications, setNotifications] = useState({
        emailOnPaid: true,
        emailReminders: false,
    });

    // Page-specific mutation
    const updateSettingsMutation = useMutation({
        mutationFn: (settings: { aiSuggestionsEnabled?: boolean, darkMode?: boolean }) => {
            return apiRequest("PUT", "/api/settings", settings);
        },
        onSuccess: () => {
            toast({ title: "Settings Saved!"});
            queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
        },
        onError: () => {
            toast({ title: "Error", description: "Could not save settings.", variant: "destructive"});
        }
    });

    // Page-specific handlers
    const handleAIToggle = () => {
        toggleAISuggestions();
        updateSettingsMutation.mutate({ aiSuggestionsEnabled: !aiSuggestionsEnabled });
    };

    const handleDarkModeToggle = () => {
        toggleDarkMode();
        updateSettingsMutation.mutate({ darkMode: !darkMode });
    };
    
    // Page-specific effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle('dark', darkMode);
    }, [darkMode]);
    
    // --- YEH HAI UPDATE: Auth useEffect aur loading checks hata diye gaye (AppLayout handle karta hai) ---

    // --- YEH HAI UPDATE: Page header ko define kiya ---
    const SettingsPageHeader = (
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and app settings.
        </p>
      </div>
    );

    return (
        // --- YEH HAI UPDATE: Page ko AppLayout mein wrap kiya ---
        <AppLayout pageHeader={SettingsPageHeader}>
            
            {/* Saare wrapper divs (min-h-screen, main) hata diye gaye hain */}
            
            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Manage your personal and company information.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">Update your details that appear on invoices.</p>
                        <Button variant="outline" onClick={() => setLocation('/profile')} className="w-full sm:w-auto">
                            <User className="w-4 h-4 mr-2"/>
                            Go to Profile
                        </Button>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>AI Features</CardTitle>
                        <CardDescription>Manage intelligent features within the app.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4">
                            <Label htmlFor="ai-suggestions" className="flex items-center gap-3 cursor-pointer">
                                <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <div>
                                    <span className="font-medium">Enable AI Suggestions</span>
                                    <p className="text-xs text-muted-foreground">Get automatic suggestions for invoice item descriptions.</p>
                                </div>
                            </Label>
                            <Switch
                                id="ai-suggestions"
                                checked={aiSuggestionsEnabled}
                                onCheckedChange={handleAIToggle}
                                disabled={updateSettingsMutation.isPending}
                            />
                       </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the app.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4">
                            <Label htmlFor="dark-mode" className="flex items-center gap-3 cursor-pointer">
                                <Palette className="w-5 h-5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">Dark Mode</span>
                                  <p className="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
                                </div>
                            </Label>
                            <Switch
                                id="dark-mode"
                                checked={darkMode}
                                onCheckedChange={handleDarkModeToggle}
                                disabled={updateSettingsMutation.isPending}
                            />
                       </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4">
                            <Label htmlFor="email-paid" className="flex items-center gap-3 cursor-pointer">
                                <Bell className="w-5 h-5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">Email me when an invoice is paid</span>
                                  <p className="text-xs text-muted-foreground">Receive an email confirmation upon payment.</p>
                                </div>
                            </Label>
                            <Switch
                                id="email-paid"
                                checked={notifications.emailOnPaid}
                                onCheckedChange={(checked) => setNotifications(p => ({...p, emailOnPaid: checked}))}
                            />
                       </div>
                       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4">
                            <Label htmlFor="email-reminders" className="flex items-center gap-3 cursor-pointer">
                                <Bell className="w-5 h-5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">Send automatic payment reminders</span>
                                  <p className="text-xs text-muted-foreground">Remind clients about overdue invoices (Pro feature).</p>
                                </div>
                            </Label>
                            <Switch
                                id="email-reminders"
                                checked={notifications.emailReminders}
                                onCheckedChange={(checked) => setNotifications(p => ({...p, emailReminders: checked}))}
                                // Example: disabled={!isSubscribed}
                            />
                       </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

