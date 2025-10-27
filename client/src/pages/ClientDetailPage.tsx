// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useLocation, useRoute } from "wouter";
// import {
//   LayoutDashboard, Users, Crown, CreditCard, Settings, BarChart3, HelpCircle, LogOut, FileText, Trash2, Save, User
// } from "lucide-react";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";

// // --- STEP 1: Dock aur uske items ko import/define karein ---
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
// // -----------------------------------------------------------

// // Mock Data
// const mockClientDetail = {
//   id: "1", name: "Acme Corp", email: "contact@acme.com", phone: "123-456-7890",
//   address: "123 Main St, Anytown, USA", companyName: "Acme Corporation",
// };
// const mockClientInvoices = [
//   { id: "inv_001", invoiceNumber: "INV-2025-001", totalAmount: 1500, invoiceDate: "2025-10-15", theme: "Default" },
//   { id: "inv_003", invoiceNumber: "INV-2025-003", totalAmount: 300, invoiceDate: "2025-10-01", theme: "Premium" },
// ];

// export default function ClientDetailPage() {
//   const { user, isLoading: authLoading } = useAuth();
//   const { toast } = useToast();
//   const [, setLocation] = useLocation();
//   const [match, params] = useRoute("/clients/:id");
//   const clientId = params?.id;

//   // Abhi ke liye mock data
//   const client = mockClientDetail;
//   const invoices = mockClientInvoices;
//   const clientLoading = false;
//   const invoicesLoading = false;

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [companyName, setCompanyName] = useState("");

//   useEffect(() => {
//     if (!authLoading && !user) {
//       setLocation("/signin");
//     }
//     if (client) {
//       setName(client.name);
//       setEmail(client.email);
//       setPhone(client.phone);
//       setAddress(client.address);
//       setCompanyName(client.companyName);
//     }
//   }, [authLoading, user, setLocation, client]);

//   const handleUpdateClient = () => toast({ title: "Client Updated! (Mock)" });
//   const handleDeleteClient = () => {
//     toast({ title: "Client Deleted! (Mock)", variant: "destructive" });
//     setLocation("/clients");
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

//   const isLoading = authLoading || clientLoading || invoicesLoading;

//   if (isLoading) {
//     return <div className="min-h-screen flex items-center justify-center">...Loading...</div>;
//   }
//   if (!user || !client) return null;

//   const isSubscribed = user.subscriptionStatus === "active";
//   const dockItems = getDockItems(isSubscribed);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground">
//       <Dock items={dockItems} />

//       {/* --- STEP 3: Main content mein padding-left add karein --- */}
//       <main className="container mx-auto px-6 py-8 pl-24 sm:pl-28">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//               {client.name}
//             </h1>
//             <p className="text-muted-foreground">
//               Manage client details and view their invoice history.
//             </p>
//           </div>
//           <Button variant="destructive" onClick={handleDeleteClient}>
//             <Trash2 className="w-4 h-4 mr-2" />
//             Delete Client
//           </Button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           <Card className="lg:col-span-1 h-fit">
//             <CardHeader><CardTitle>Client Details</CardTitle></CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="companyName">Company Name</Label>
//                 <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="address">Address</Label>
//                 <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
//               </div>
//               <Button onClick={handleUpdateClient} className="w-full">
//                 <Save className="w-4 h-4 mr-2" />
//                 Save Changes
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="lg:col-span-2">
//             <CardHeader><CardTitle>Invoice History</CardTitle></CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Invoice #</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Theme</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {invoices.length === 0 ? (
//                     <TableRow><TableCell colSpan={4} className="text-center">No invoices found.</TableCell></TableRow>
//                   ) : (
//                     invoices.map((invoice) => (
//                       <TableRow key={invoice.id} className="cursor-pointer">
//                         <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
//                         <TableCell>{invoice.invoiceDate}</TableCell>
//                         <TableCell>₹{invoice.totalAmount.toFixed(2)}</TableCell>
//                         <TableCell><Badge variant="secondary">{invoice.theme}</Badge></TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
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
import { useLocation, useRoute } from "wouter";
import {
  Trash2, Save // --- YEH HAI UPDATE: Sirf content ke icons rakhe gaye ---
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// --- YEH HAI UPDATE: AppLayout ko import kiya ---
import AppLayout from "@/components/AppLayout";

// --- YEH HAI UPDATE: Dock, menu items, aur dock se related icons hata diye gaye ---

// Mock Data (wahi hai)
const mockClientDetail = {
  id: "1", name: "Acme Corp", email: "contact@acme.com", phone: "123-456-7890",
  address: "123 Main St, Anytown, USA", companyName: "Acme Corporation",
};
const mockClientInvoices = [
  { id: "inv_001", invoiceNumber: "INV-2025-001", totalAmount: 1500, invoiceDate: "2025-10-15", theme: "Default" },
  { id: "inv_003", invoiceNumber: "INV-2025-003", totalAmount: 300, invoiceDate: "2025-10-01", theme: "Premium" },
];

export default function ClientDetailPage() {
  // --- YEH HAI UPDATE: 'authLoading' hata diya gaya ---
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/clients/:id");
  const clientId = params?.id;

  // Page-specific data loading (wahi hai)
  const client = mockClientDetail;
  const invoices = mockClientInvoices;
  const clientLoading = false;
  const invoicesLoading = false;

  // Page-specific state (wahi hai)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");

  // --- YEH HAI UPDATE: useEffect se auth check hata diya gaya ---
  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setPhone(client.phone);
      setAddress(client.address);
      setCompanyName(client.companyName);
    }
  }, [client]); // Dependencies se authLoading, user, setLocation hata diye gaye

  // Page-specific handlers (wahi hain)
  const handleUpdateClient = () => toast({ title: "Client Updated! (Mock)" });
  const handleDeleteClient = () => {
    toast({ title: "Client Deleted! (Mock)", variant: "destructive" });
    setLocation("/clients");
  };

  // --- YEH HAI UPDATE: getDockItems, dockItems, etc. hata diye gaye ---

  // --- YEH HAI UPDATE: Page-specific loading, authLoading ke bina ---
  const isLoading = clientLoading || invoicesLoading;

  // --- YEH HAI UPDATE: Page header ko define kiya ---
  const ClientPageHeader = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {client?.name || "Loading Client..."}
        </h1>
        <p className="text-muted-foreground">
          Manage client details and view their invoice history.
        </p>
      </div>
      <Button variant="destructive" onClick={handleDeleteClient} className="w-full sm:w-auto">
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Client
      </Button>
    </div>
  );
  
  // --- YEH HAI UPDATE: Auth/loading checks AppLayout handle karta hai ---
  // Page-specific loading check andar rakha jaayega

  return (
    // --- YEH HAI UPDATE: Page ko AppLayout mein wrap kiya ---
    <AppLayout pageHeader={ClientPageHeader}>

      {/* Saare wrapper divs (min-h-screen, main) hata diye gaye hain */}

      {/* --- YEH HAI UPDATE: Page-specific loading check --- */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : !client ? (
        <Card className="p-8 text-center">
          <CardTitle>Client not found</CardTitle>
          <CardContent className="mt-4">
            <p>This client could not be found.</p>
            <Button onClick={() => setLocation("/clients")} className="mt-4">Back to Clients</Button>
          </CardContent>
        </Card>
      ) : (
        // --- YEH HAI UPDATE: Actual page content ---
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 h-fit">
            <CardHeader><CardTitle>Client Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <Button onClick={handleUpdateClient} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Invoice History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead>Theme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No invoices found for this client.</TableCell></TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="cursor-pointer">
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell className="hidden sm:table-cell">{invoice.invoiceDate}</TableCell>
                        <TableCell className="hidden md:table-cell">₹{invoice.totalAmount.toFixed(2)}</TableCell>
                        <TableCell><Badge variant="secondary">{invoice.theme}</Badge></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}