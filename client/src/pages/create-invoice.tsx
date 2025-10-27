// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Upload, PlusCircle, Trash2, LayoutDashboard, Users, Crown, CreditCard, User, Settings, BarChart3, HelpCircle, LogOut, FileText } from "lucide-react";
// import { useLocation } from "wouter";

// // --- STEP 1: Saare components ko import karein ---
// import Dock from "@/components/Dock";
// import type { DockItemData } from "@/components/Dock";
// import InvoicePreview from "@/components/InvoicePreview";
// import type { InvoiceData } from "@/components/InvoicePreview";
// import { AIPoweredInput } from "@/components/AIPoweredInput";
// import AppBreadcrumb from "@/components/AppBreadcrumb"; // Breadcrumb import kiya

// // Dock items ka configuration
// const mainMenuItems = [
//   { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
//   { href: "/choose-template", label: "Create Invoice", icon: <FileText className="size-5" /> },
//   { href: "/clients", label: "Clients", icon: <Users className="size-5" /> },
//   { href: "/reports", label: "Reports", icon: <BarChart3 className="size-5" /> },
//   { href: "/profile", label: "Profile", icon: <User className="size-5" /> },
// ];
// const footerMenuItems = [
//   { href: "/settings", label: "Settings", icon: <Settings className="size-5" /> },
//   { href: "/help", label: "Help", icon: <HelpCircle className="size-5" /> },
// ];
// // ----------------------------------------------------

// const BLANK_INVOICE: InvoiceData = {
//   invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
//   invoiceDate: new Date().toLocaleDateString('en-CA'),
//   dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
//   from: { name: '', address: '', email: '' },
//   to: { name: '', company: '', address: '', email: '' },
//   items: [{ description: '', quantity: 1, price: 0 }],
//   subtotal: 0, tax: 0, total: 0,
//   notes: 'Thank you for your business!',
// };


// export default function CreateInvoice() {
//   const { user, isLoading } = useAuth();
//   const { toast } = useToast();
//   const [location, setLocation] = useLocation();

//   const searchParams = new URLSearchParams(window.location.search);
//   const templateFromUrl = searchParams.get('template') || 'classic';
//   const themeFromUrl = searchParams.get('theme') || 'default';
  
//   // Naya Check: Kya yeh 'bhookhad-baba' template hai?
//   const isSpecialTemplate = templateFromUrl.toLowerCase() === 'bhookhad-baba';

//   const [invoiceData, setInvoiceData] = useState<InvoiceData>(BLANK_INVOICE);
//   const [logoUrl, setLogoUrl] = useState<string | null>(null);

//   const logoInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (user) {
//       setInvoiceData(prev => ({
//         ...prev,
//         from: {
//           name: user.companyName || user.name || '',
//           address: "123 Your Street, Your City", // TODO: Isko user profile se laayein
//           email: user.email || '',
//         }
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     // Total calculation ko tabhi chalayein jab special template na ho,
//     // kyunki woh apna logic khud handle kar sakta hai.
//     if (!isSpecialTemplate) {
//       const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
//       const tax = subtotal * 0.18;
//       const total = subtotal + tax;
//       setInvoiceData(prev => ({ ...prev, subtotal, tax, total }));
//     }
//   }, [invoiceData.items, isSpecialTemplate]);

//   useEffect(() => {
//     if (!isLoading && !user) {
//       setLocation("/signin");
//     }
//   }, [user, isLoading, setLocation]);
  
//   // Form update handlers
//   const handleInvoiceDataChange = (field: keyof InvoiceData, value: any) => setInvoiceData(prev => ({ ...prev, [field]: value }));
//   const handlePartyChange = (party: 'from' | 'to', field: string, value: string) => setInvoiceData(prev => ({ ...prev, [party]: { ...prev[party], [field]: value } }));
//   const handleItemChange = (index: number, field: keyof InvoiceData['items'][0], value: any) => {
//     const newItems = [...invoiceData.items];
//     newItems[index] = { ...newItems[index], [field]: value };
//     setInvoiceData(prev => ({ ...prev, items: newItems }));
//   };
//   const handleAddItem = () => setInvoiceData(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, price: 0 }] }));
//   const handleRemoveItem = (index: number) => {
//     if (invoiceData.items.length <= 1) return;
//     setInvoiceData(prev => ({ ...prev, items: invoiceData.items.filter((_, i) => i !== index) }));
//   };
//   const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => { /* ... logo upload logic ... */ };
  
//   // Dock items ka logic
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
  
//   if (isLoading) return <div className="minh-screen flex items-center justify-center">...Loading...</div>;
//   if (!user) return null;
  
//   const isSubscribed = user.subscriptionStatus === 'active';
//   const dockItems = getDockItems(isSubscribed);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground">
//       <Dock items={dockItems} />
      
//       {/* Header hata diya gaya hai */}
//       <div className="pl-24 sm:pl-28"> {/* Sirf padding rakhi hai */}
//         <main className="container mx-auto px-4 py-8">
          
//           {/* Breadcrumb add kar diya gaya hai */}
//           <AppBreadcrumb />

//           <div className="grid lg:grid-cols-2 gap-8">
//             {/* Left Column: Editor Form */}
//             <div className="space-y-6">
              
//               {/* Logo Upload Button (ab yahaan aa gaya hai) */}
//               <Card>
//                 <CardContent className="pt-6">
//                   <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
//                   <Button onClick={() => logoInputRef.current?.click()} variant="outline" size="sm" className="w-full">
//                     <Upload className="w-4 h-4 mr-2" /> Upload Your Logo
//                   </Button>
//                 </CardContent>
//               </Card>

//               {/* Sirf 'bhookhad-baba' template ke alawa baaki sab ke liye form dikhega */}
//               {!isSpecialTemplate && (
//                 <>
//                   <Card>
//                     <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
//                     <CardContent className="grid sm:grid-cols-3 gap-4">
//                       <div className="space-y-1">
//                         <Label htmlFor="invoiceNumber">Invoice #</Label>
//                         <Input id="invoiceNumber" value={invoiceData.invoiceNumber} onChange={(e) => handleInvoiceDataChange('invoiceNumber', e.target.value)} />
//                       </div>
//                       <div className="space-y-1">
//                         <Label htmlFor="invoiceDate">Date</Label>
//                         <Input id="invoiceDate" type="date" value={invoiceData.invoiceDate} onChange={(e) => handleInvoiceDataChange('invoiceDate', e.target.value)} />
//                       </div>
//                       <div className="space-y-1">
//                         <Label htmlFor="dueDate">Due Date</Label>
//                         <Input id="dueDate" type="date" value={invoiceData.dueDate} onChange={(e) => handleInvoiceDataChange('dueDate', e.target.value)} />
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader><CardTitle>Billed To</CardTitle></CardHeader>
//                     <CardContent className="grid sm:grid-cols-2 gap-4">
//                       <div className="space-y-1">
//                         <Label htmlFor="clientName">Client Name</Label>
//                         <Input id="clientName" value={invoiceData.to.name} onChange={(e) => handlePartyChange('to', 'name', e.target.value)} />
//                       </div>
//                       <div className="space-y-1">
//                         <Label htmlFor="clientCompany">Company Name</Label>
//                         <Input id="clientCompany" value={invoiceData.to.company} onChange={(e) => handlePartyChange('to', 'company', e.target.value)} />
//                       </div>
//                       <div className="space-y-1 col-span-2">
//                         <Label htmlFor="clientAddress">Address</Label>
//                         <Input id="clientAddress" value={invoiceData.to.address} onChange={(e) => handlePartyChange('to', 'address', e.target.value)} />
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader><CardTitle>Items</CardTitle></CardHeader>
//                     <CardContent className="space-y-4">
//                       {invoiceData.items.map((item, index) => (
//                         <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 rounded-lg bg-muted/50">
//                           <div className="col-span-6 space-y-1">
//                             <Label htmlFor={`item-desc-${index}`}>Description</Label>
//                             <AIPoweredInput
//                               value={item.description}
//                               onChange={(newValue) => handleItemChange(index, 'description', newValue)}
//                               placeholder="e.g., Website Design"
//                             />
//                           </div>
//                           <div className="col-span-2 space-y-1">
//                             <Label htmlFor={`item-qty-${index}`}>Qty</Label>
//                             <Input id={`item-qty-${index}`} type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} />
//                           </div>
//                           <div className="col-span-3 space-y-1">
//                             <Label htmlFor={`item-price-${index}`}>Price</Label>
//                             <Input id={`item-price-${index}`} type="number" min="0" value={item.price} onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))} />
//                           </div>
//                           <div className="col-span-1">
//                             <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
//                               <Trash2 className="w-4 h-4 text-destructive" />
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
//                       <Button variant="outline" onClick={handleAddItem}>
//                         <PlusCircle className="w-4 h-4 mr-2" /> Add Item
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//             </div>

//             <div className={isSpecialTemplate ? "lg:col-span-3" : "lg:col-span-1 h-fit lg:sticky top-8"}>
//               <InvoicePreview
//                 data={isSpecialTemplate ? null : invoiceData} // Special template apna data khud manage karega
//                 logoUrl={logoUrl}
//                 theme={themeFromUrl}
//                 template={templateFromUrl}
//                 setData={setInvoiceData} // Special template ko data update karne ke liye
//               />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// --- YEH HAI UPDATE: Sirf page ke liye zaroori icons rakhe ---
import { Upload, PlusCircle, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

// --- YEH HAI UPDATE: AppLayout ko import kiya ---
import AppLayout from "@/components/AppLayout"; 

// --- YEH HAI UPDATE: Page-specific components wahi hain ---
import InvoicePreview from "@/components/InvoicePreview";
import type { InvoiceData } from "@/components/InvoicePreview";
import { AIPoweredInput } from "@/components/AIPoweredInput";
import AppBreadcrumb from "@/components/AppBreadcrumb"; // Breadcrumb wahi hai

// --- YEH HAI UPDATE: Dock, menu items, aur dock se related icons hata diye gaye ---

// BLANK_INVOICE constant wahi hai
const BLANK_INVOICE: InvoiceData = {
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  invoiceDate: new Date().toLocaleDateString('en-CA'),
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
  from: { name: '', address: '', email: '' },
  to: { name: '', company: '', address: '', email: '' },
  items: [{ description: '', quantity: 1, price: 0 }],
  subtotal: 0, tax: 0, total: 0,
  notes: 'Thank you for your business!',
};


export default function CreateInvoice() {
  // --- YEH HAI UPDATE: 'isLoading' hata diya gaya, AppLayout handle karta hai ---
  const { user } = useAuth(); 
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Page-specific logic wahi hai
  const searchParams = new URLSearchParams(window.location.search);
  const templateFromUrl = searchParams.get('template') || 'classic';
  const themeFromUrl = searchParams.get('theme') || 'default';
  const isSpecialTemplate = templateFromUrl.toLowerCase() === 'bhookhad-baba';

  const [invoiceData, setInvoiceData] = useState<InvoiceData>(BLANK_INVOICE);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Page-specific effects wahi hain
  useEffect(() => {
    if (user) {
      setInvoiceData(prev => ({
        ...prev,
        from: {
          name: user.companyName || user.name || '',
          address: "123 Your Street, Your City", // TODO: Isko user profile se laayein
          email: user.email || '',
        }
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isSpecialTemplate) {
      const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
      const tax = subtotal * 0.18; // Example tax
      const total = subtotal + tax;
      setInvoiceData(prev => ({ ...prev, subtotal, tax, total }));
    }
  }, [invoiceData.items, isSpecialTemplate]);

  // --- YEH HAI UPDATE: Auth redirect wala useEffect hata diya gaya ---
  
  // Page-specific handlers wahi hain
  const handleInvoiceDataChange = (field: keyof InvoiceData, value: any) => setInvoiceData(prev => ({ ...prev, [field]: value }));
  const handlePartyChange = (party: 'from' | 'to', field: string, value: string) => setInvoiceData(prev => ({ ...prev, [party]: { ...prev[party], [field]: value } }));
  const handleItemChange = (index: number, field: keyof InvoiceData['items'][0], value: any) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };
  const handleAddItem = () => setInvoiceData(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, price: 0 }] }));
  const handleRemoveItem = (index: number) => {
    if (invoiceData.items.length <= 1) return;
    setInvoiceData(prev => ({ ...prev, items: invoiceData.items.filter((_, i) => i !== index) }));
  };
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
  };
  
  // --- YEH HAI UPDATE: getDockItems, dockItems, aur loading/!user checks hata diye gaye ---
 
  return (
    // --- YEH HAI UPDATE: Page ko AppLayout mein wrap kiya ---
    <AppLayout pageHeader={<AppBreadcrumb />}>
      
      {/* Saare wrapper divs (min-h-screen, main) hata diye gaye hain */}
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Editor Form */}
        <div className="space-y-6">
          
          <Card>
            <CardContent className="pt-6">
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <Button onClick={() => logoInputRef.current?.click()} variant="outline" size="sm" className="w-full">
                <Upload className="w-4 h-4 mr-2" /> Upload Your Logo
              </Button>
            </CardContent>
          </Card>

          {/* Logic to hide form for special template (wahi hai) */}
          {!isSpecialTemplate && (
            <>
              <Card>
                <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="invoiceNumber">Invoice #</Label>
                    <Input id="invoiceNumber" value={invoiceData.invoiceNumber} onChange={(e) => handleInvoiceDataChange('invoiceNumber', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="invoiceDate">Date</Label>
                    <Input id="invoiceDate" type="date" value={invoiceData.invoiceDate} onChange={(e) => handleInvoiceDataChange('invoiceDate', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={invoiceData.dueDate} onChange={(e) => handleInvoiceDataChange('dueDate', e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Billed To</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" value={invoiceData.to.name} onChange={(e) => handlePartyChange('to', 'name', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="clientCompany">Company Name</Label>
                    <Input id="clientCompany" value={invoiceData.to.company} onChange={(e) => handlePartyChange('to', 'company', e.target.value)} />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="clientAddress">Address</Label>
                    <Input id="clientAddress" value={invoiceData.to.address} onChange={(e) => handlePartyChange('to', 'address', e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Items</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {invoiceData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 rounded-lg border bg-background">
                      <div className="col-span-12 sm:col-span-6 space-y-1">
                        <Label htmlFor={`item-desc-${index}`}>Description</Label>
                        <AIPoweredInput
                          value={item.description}
                          onChange={(newValue) => handleItemChange(index, 'description', newValue)}
                          placeholder="e.g., Website Design"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-1">
                        <Label htmlFor={`item-qty-${index}`}>Qty</Label>
                        <Input id={`item-qty-${index}`} type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} />
                      </div>
                      <div className="col-span-5 sm:col-span-3 space-y-1">
                        <Label htmlFor={`item-price-${index}`}>Price</Label>
                        <Input id={`item-price-${index}`} type="number" min="0" value={item.price} onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))} />
                      </div>
                      <div className="col-span-3 sm:col-span-1 flex items-end justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddItem}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Item
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Right Column: Preview (logic wahi hai) */}
        <div className={isSpecialTemplate ? "lg:col-span-2" : "lg:col-span-1 h-fit lg:sticky top-8"}>
          <InvoicePreview
            data={isSpecialTemplate ? null : invoiceData}
            logoUrl={logoUrl}
            theme={themeFromUrl}
            template={templateFromUrl}
            setData={setInvoiceData}
          />
        </div>
      </div>
    </AppLayout>
  );
}