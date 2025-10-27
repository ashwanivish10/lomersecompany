// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useLocation } from "wouter";
// import {
//   LayoutDashboard, Users, Crown, CreditCard, Settings, BarChart3, HelpCircle, LogOut, FileText, Plus,User
// } from "lucide-react";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
// } from "@/components/ui/dialog";

// // --- STEP 1: Dock aur uske items ko import/define karein ---
// import Dock from "@/components/Dock";
// import type { DockItemData } from "@/components/Dock";

// const mainMenuItems = [
//   { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
//   { href: "/choose-template", label: "Create Invoice", icon: <FileText className="size-5" /> },
//   { href: "/clients", label: "Clients", icon: <Users className="size-5" /> },
//   { href: "/profile", label: "Profile", icon: <User className="size-5" /> }, // Assuming User icon is needed
//   { href: "/reports", label: "Reports", icon: <BarChart3 className="size-5" /> },
// ];
// const footerMenuItems = [
//   { href: "/settings", label: "Settings", icon: <Settings className="size-5" /> },
//   { href: "/help", label: "Help", icon: <HelpCircle className="size-5" /> },
// ];
// // -----------------------------------------------------------

// // Mock data (jab tak API nahi banti)
// const mockClients = [
//   { id: "1", name: "Acme Corp", email: "contact@acme.com", phone: "123-456-7890" },
//   { id: "2", name: "Stark Industries", email: "tony@stark.com", phone: "987-654-3210" },
// ];

// export default function ClientsPage() {
//   const { user, isLoading } = useAuth();
//   const { toast } = useToast();
//   const [, setLocation] = useLocation();
//   const [isAddClientOpen, setIsAddClientOpen] = useState(false);

//   // Form state for new client
//   const [newClientName, setNewClientName] = useState("");
//   const [newClientEmail, setNewClientEmail] = useState("");
//   const [newClientPhone, setNewClientPhone] = useState("");
//   const [newClientAddress, setNewClientAddress] = useState("");
//   const [newClientCompany, setNewClientCompany] = useState("");


//   useEffect(() => {
//     if (!isLoading && !user) {
//       setLocation("/signin");
//     }
//   }, [user, isLoading, setLocation]);
  
//   const handleAddClient = () => {
//     console.log("Adding new client:", { newClientName, newClientEmail });
//     toast({ title: "Client Added! (Mock)" });
//     setIsAddClientOpen(false); // Modal band karein
//     // Form reset karein
//     setNewClientName("");
//     setNewClientEmail("");
//     setNewClientPhone("");
//     setNewClientAddress("");
//     setNewClientCompany("");
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
//     return <div className="min-h-screen flex items-center justify-center">...loading</div>;
//   }
//   if (!user) return null;

//   const isSubscribed = user.subscriptionStatus === 'active';
//   const dockItems = getDockItems(isSubscribed);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground">
//       {/* Sidebar ki jagah Dock aa gaya hai */}
//       <Dock items={dockItems} />

//       {/* --- STEP 3: Main content mein padding-left add karein --- */}
//       <main className="container mx-auto px-6 py-8 pl-24 sm:pl-28">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//               Clients
//             </h1>
//             <p className="text-muted-foreground">
//               Manage your customers and their details.
//             </p>
//           </div>
          
//           <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
//             <DialogTrigger asChild>
//               <Button size="lg">
//                 <Plus className="w-5 h-5 mr-2" />
//                 Add New Client
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader><DialogTitle>Add a New Client</DialogTitle></DialogHeader>
//               <div className="space-y-4 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="clientName">Name</Label>
//                   <Input id="clientName" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="clientEmail">Email</Label>
//                   <Input id="clientEmail" type="email" value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="clientPhone">Phone</Label>
//                   <Input id="clientPhone" value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} />
//                 </div>
//                  <div className="space-y-2">
//                   <Label htmlFor="clientCompany">Company Name</Label>
//                   <Input id="clientCompany" value={newClientCompany} onChange={(e) => setNewClientCompany(e.target.value)} />
//                 </div>
//                  <div className="space-y-2">
//                   <Label htmlFor="clientAddress">Address</Label>
//                   <Input id="clientAddress" value={newClientAddress} onChange={(e) => setNewClientAddress(e.target.value)} />
//                 </div>
//                 <Button onClick={handleAddClient} className="w-full">Save Client</Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <Card>
//           <CardHeader><CardTitle>Client List</CardTitle></CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Phone</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {mockClients.map((client) => (
//                   <TableRow 
//                     key={client.id} 
//                     className="cursor-pointer" 
//                     onClick={() => setLocation(`/clients/${client.id}`)}
//                   >
//                     <TableCell className="font-medium">{client.name}</TableCell>
//                     <TableCell>{client.email}</TableCell>
//                     <TableCell>{client.phone}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // Keep for user check, though AppLayout handles it
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import {
  Plus // --- YEH HAI UPDATE: Sirf 'Plus' icon rakha ---
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

// --- YEH HAI UPDATE: AppLayout ko import kiya ---
import AppLayout from "@/components/AppLayout";

// --- YEH HAI UPDATE: Dock, menu items, aur dock se related icons hata diye gaye ---

// Mock data (wahi hai)
const mockClients = [
  { id: "1", name: "Acme Corp", email: "contact@acme.com", phone: "123-456-7890" },
  { id: "2", name: "Stark Industries", email: "tony@stark.com", phone: "987-654-3210" },
];

export default function ClientsPage() {
  const { user, isLoading } = useAuth(); // AppLayout handles loading, but we can use 'user'
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  // Form state for new client (wahi hai)
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");

  // --- YEH HAI UPDATE: Auth redirect wala useEffect hata diya gaya ---

  // Page-specific handler (wahi hai)
  const handleAddClient = () => {
    console.log("Adding new client:", { newClientName, newClientEmail });
    toast({ title: "Client Added! (Mock)" });
    setIsAddClientOpen(false); // Modal band karein
    // Form reset karein
    setNewClientName("");
    setNewClientEmail("");
    setNewClientPhone("");
    setNewClientAddress("");
    setNewClientCompany("");
  };

  // --- YEH HAI UPDATE: getDockItems, dockItems, aur loading/!user checks hata diye gaye ---

  // --- YEH HAI UPDATE: Page header ko define kiya, DialogTrigger ke saath ---
  const ClientsPageHeader = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Clients
        </h1>
        <p className="text-muted-foreground">
          Manage your customers and their details.
        </p>
      </div>
      
      {/* DialogTrigger ko header ka hissa banaya */}
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Add New Client
        </Button>
      </DialogTrigger>
    </div>
  );

  return (
    // --- YEH HAI UPDATE: Page ko Dialog aur AppLayout mein wrap kiya ---
    <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
      <AppLayout pageHeader={ClientsPageHeader}>
        
        {/* Saare wrapper divs (min-h-screen, main) hata diye gaye hain */}
        
        <Card>
          <CardHeader><CardTitle>Client List</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No clients added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  mockClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className="cursor-pointer" 
                      onClick={() => setLocation(`/clients/${client.id}`)} // This route needs to be defined
                    >
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{client.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog Content ko layout ke andar render kiya */}
        <DialogContent>
          <DialogHeader><DialogTitle>Add a New Client</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Name</Label>
              <Input id="clientName" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input id="clientEmail" type="email" value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Phone</Label>
              <Input id="clientPhone" value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="clientCompany">Company Name</Label>
              <Input id="clientCompany" value={newClientCompany} onChange={(e) => setNewClientCompany(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Input id="clientAddress" value={newClientAddress} onChange={(e) => setNewClientAddress(e.target.value)} />
            </div>
            <Button onClick={handleAddClient} className="w-full">Save Client</Button>
          </div>
        </DialogContent>

      </AppLayout>
    </Dialog>
  );
}
