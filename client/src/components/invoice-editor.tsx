


import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Save, Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";
import { generateInvoicePDF, type ThemeName } from "@/lib/pdfGenerator";

// Props interface ko update kiya gaya hai
interface InvoiceEditorProps {
  theme: string;
  user: User;
  initialData?: any;
  logoUrl?: string | null;
}
import fileIcon from "../attached_assets/file.png";


interface InvoiceItem {
  date: string;
  qty: number;
  price: number;
}

export function InvoiceEditor({ theme, user, initialData, logoUrl }: InvoiceEditorProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Saare form fields ke liye states
  const [companyName, setCompanyName] = useState("Your Company");
  const [companyTagline, setCompanyTagline] = useState("Professional Services");
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("#0001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceTitle, setInvoiceTitle] = useState("Invoice"); // <-- FIX: Naya state title ke liye
  const [items, setItems] = useState<InvoiceItem[]>([
    { date: new Date().toISOString().split('T')[0], qty: 1, price: 100 }
  ]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [tax, setTax] = useState("0%");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || 'Your Company');
      setCompanyTagline(initialData.companyTagline || 'Professional Services');
      setClientName(initialData.clientName || '');
      setInvoiceNumber(initialData.invoiceNumber || '#0001');
      setAddress(initialData.address || '');
      setPhone(initialData.phone || '');
      setInvoiceTitle(initialData.invoiceTitle || 'Invoice');
      
      if (initialData.items && initialData.items.length > 0) {
        setItems(initialData.items);
      }
    }
  }, [initialData]);

  const addItem = () => {
    setItems([...items, { date: new Date().toISOString().split('T')[0], qty: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  const handleDownloadPDF = async () => {
    if (!clientName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a client name before downloading PDF",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateInvoicePDF({
        companyName,
        companyTagline,
        clientName,
        invoiceNumber,
        invoiceDate,
        invoiceTitle, // <-- FIX: Naya title PDF generator ko bhejein
        items: items.map(item => ({
          date: item.date,
          quantity: item.qty,
          price: Math.round(item.price * 100),
        })),
        totalAmount: Math.round(totalAmount * 100),
        amountPaid: Math.round(amountPaid * 100),
        tax,
        address,
        phone,
        logoUrl,
        theme: theme as ThemeName,
      });

      toast({
        title: "PDF Downloaded!",
        description: "Your invoice PDF has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!clientName.trim()) {
        throw new Error("Client name is required");
      }
      if (items.length === 0) {
        throw new Error("At least one item is required");
      }

      await apiRequest("POST", "/api/invoices", {
        logoUrl: logoUrl,
        invoiceNumber,
        invoiceTitle,
        theme,
        companyName,
        companyTagline,
        clientName,
        invoiceDate,
        items,
        totalAmount: Math.round(totalAmount * 100),
        amountPaid: Math.round(amountPaid * 100),
        tax,
        address,
        phone
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Invoice saved!",
        description: "Your invoice has been saved successfully",
      });
      setLocation('/');
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to save invoice",
        variant: "destructive",
      });
    },
  });

  // Theme configurations
  const getThemeStyles = () => {
    const themes: Record<string, any> = {
      default: { bg: '#ffffff', primary: '#f59e0b', text: '#1f2937', border: '#d1d5db' },
      blue: { bg: '#ffffff', primary: '#2563eb', text: '#1f2937', border: '#d1d5db' },
      green: { bg: '#ffffff', primary: '#16a34a', text: '#1f2937', border: '#d1d5db' },
      purple: { bg: '#ffffff', primary: '#4f46e5', text: '#1f2937', border: '#d1d5db' },
      slate: { bg: '#374151', primary: '#9ca3af', text: '#f9fafb', border: '#4b5563' },
      ocean: { bg: '#0c4a6e', primary: '#7dd3fc', text: '#f0f9ff', border: '#0369a1' },
      sunset: { bg: '#7c2d12', primary: '#fdba74', text: '#fff7ed', border: '#9a3412' },
      mint: { bg: '#f0fdfa', primary: '#14b8a6', text: '#0f766e', border: '#ccfbf1' },
      lavender: { bg: '#f5f3ff', primary: '#8b5cf6', text: '#5b21b6', border: '#ede9fe' },
      blush: { bg: '#fff1f2', primary: '#f43f5e', text: '#be123c', border: '#ffe4e6' },
      graphite: { bg: '#f9fafb', primary: '#3b82f6', text: '#1f2937', border: '#d1d5db' },
      seaside: { bg: '#FAF8F1', primary: '#34656D', text: '#334443', border: '#FAEAB1' },
      vibrant: { bg: '#E9E3DF', primary: '#FF7A30', text: '#000000', border: '#465C88' },
      pastel: { bg: '#FAF7F3', primary: '#D9A299', text: '#A07855', border: '#F0E4D3' },
      rose: { bg: '#EEEEEE', primary: '#B9375D', text: '#B9375D', border: '#E7D3D3' },
      lime: { bg: '#FFFADC', primary: '#B6F500', text: '#98CD00', border: '#B6F500' },
    };
    return themes[theme] || themes.default;
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Edit Form */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Company Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                data-testid="input-company-name"
              />
            </div>
            <div>
              <Label htmlFor="companyTagline">Tagline</Label>
              <Input
                id="companyTagline"
                value={companyTagline}
                onChange={(e) => setCompanyTagline(e.target.value)}
                data-testid="input-company-tagline"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                data-testid="input-address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-testid="input-phone"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Invoice Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                data-testid="input-client-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceTitle">Invoice Title</Label>
                <Input
                  id="invoiceTitle"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  data-testid="input-invoice-title"
                />
              </div>
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  data-testid="input-invoice-number"
                />
              </div>
            </div>
             <div>
                <Label htmlFor="invoiceDate">Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  data-testid="input-invoice-date"
                />
              </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Items</h3>
            <Button size="sm" onClick={addItem} data-testid="button-add-item">
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(e) => updateItem(index, 'date', e.target.value)}
                    data-testid={`input-item-date-${index}`}
                  />
                </div>
                <div className="w-20">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)}
                    data-testid={`input-item-qty-${index}`}
                  />
                </div>
                <div className="w-28">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    data-testid={`input-item-price-${index}`}
                  />
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  data-testid={`button-remove-item-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amountPaid">Amount Paid (₹)</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  data-testid="input-amount-paid"
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax (%)</Label>
                <Input
                  id="tax"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  data-testid="input-tax"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={handleDownloadPDF}
            data-testid="button-download-pdf"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            data-testid="button-save-invoice"
          >
            <Save className="w-5 h-5 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Invoice"}
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-24 h-fit">
        <h3 className="text-lg font-semibold text-foreground mb-4">Live Preview</h3>
        <div
          className="rounded-lg shadow-xl p-8 space-y-6"
          style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}
        >
          
         <div className="flex items-center gap-4 pb-6 border-b" style={{ borderColor: themeStyles.border }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="w-16 h-16 object-contain rounded-lg" />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: themeStyles.primary }}>
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold" style={{ color: themeStyles.primary }}>{companyName}</h2>
              <p className="text-sm opacity-75">{companyTagline}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{invoiceTitle}</h3> 
              </div>
              <div className="text-right text-sm opacity-75">
                <div>Date: {invoiceDate}</div>
                <div>Invoice to: {clientName || "Client Name"}</div>
                <div>Invoice no: {invoiceNumber}</div>
              </div>
            </div>

     {/* yaha se remove kiya gya line  */}
            <table className="w-full text-sm">
              <thead>
                <tr className="opacity-60">
                  <th className="text-left pb-2">DATE</th>
                  <th className="text-center pb-2">QTY</th>
                  <th className="text-right pb-2">PRICE</th>
                </tr>
              </thead>
              <tbody>
               {/* // line hatne ke liey code se badal dein */}
{items.map((item, index) => (
  <tr key={index} className={index === items.length - 1 ? "" : "border-b"} style={{ borderColor: themeStyles.border }}>
    <td className="py-2">{item.date}</td>
    <td className="text-center py-2">{item.qty}</td>
    <td className="text-right py-2">₹{(item.price).toFixed(2)}</td>
  </tr>
))}
              </tbody>
            </table>

            <div className="border-t-2 border-dashed my-4" style={{ borderColor: themeStyles.border }}></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center font-['Dancing_Script'] text-3xl" style={{ color: themeStyles.primary }}>
                Thank You!
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>TOTAL ITEMS:</span>
                  <span className="font-semibold">{totalQty}</span>
                </div>
                <div className="flex justify-between">
                  <span>TOTAL AMOUNT:</span>
                  <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>AMOUNT PAID:</span>
                  <span className="font-semibold">₹{amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TAX:</span>
                  <span className="font-semibold">{tax}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t" style={{ borderColor: themeStyles.border }}>
                  <span>AMOUNT DUE:</span>
                  <span>₹{(totalAmount - amountPaid).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* // icon add kr diya  naye code se badal dein: */}
{(address || phone) && (
  <>
    <div className="border-t-2 border-dashed my-4" style={{ borderColor: themeStyles.border }}></div>
    <div className="text-xs opacity-75 space-y-2">
      {address && (
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{address}</span>
        </p>
      )}
      {phone && (
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>Phone: {phone}</span>
        </p>
      )}
    </div>
  </>
)}
          </div>
        </div>
      </div>
    </div>
  );
}