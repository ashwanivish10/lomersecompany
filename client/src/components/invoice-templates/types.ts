
export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  from: { name: string; address: string; email: string; };
  to: { name: string; company?: string; address: string; email?: string; };
  items: { description: string; quantity: number; price: number; }[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
}

// --- YAHAN UPDATE KAREIN ---
// Ab har theme ke paas 3 alag-alag style classes hongi
export interface ThemeClasses {
  primary: string;       // Headings aur Total Amount ke text color ke liye
  bgAccent: string;      // Table ke header jaise background ke liye
  borderAccent: string;  // Total ke neeche border jaise accents ke liye
}
