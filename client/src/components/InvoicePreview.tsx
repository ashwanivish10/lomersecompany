import React, { useRef } from 'react';
import { Download } from 'lucide-react';

// Common types ko import karein
import type { InvoiceData, ThemeClasses } from './invoice-templates/types';
// InvoiceData type ko export karein taaki baaki pages ise use kar sakein
export type { InvoiceData };

// Saare template components ko import karein
import TemplateClassic from './invoice-templates/TemplateClassic';
import TemplateModern from './invoice-templates/TemplateModern';
import TemplateMinimal from './invoice-templates/TemplateMinimal';
import TemplateBhookhadBaba from './invoice-templates/TemplateBhookhadBaba';

// Mock Data (agar data prop null ho toh yeh fallback ki tarah kaam karega)
const mockInvoiceData: InvoiceData = {
  invoiceNumber: 'INV-DEMO-001',
  invoiceDate: new Date().toLocaleDateString('en-CA'), // Format: YYYY-MM-DD
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
  from: {
    name: 'Your Company',
    address: '123 Business Avenue, Metro City',
    email: 'contact@yourcompany.com',
  },
  to: {
    name: 'Client Name',
    company: 'Client Company Inc.',
    address: '456 Corporate Road, Their City',
    email: 'client@example.com',
  },
  items: [
    { description: 'Example Service or Product', quantity: 2, price: 50.00 },
    { description: 'Another Item Description', quantity: 1, price: 75.50 },
  ],
  subtotal: 175.50,
  tax: 31.59, // 18% tax
  total: 207.09,
  notes: 'This is a sample invoice. Your data will appear here. Thank you for your business!',
};

// --- YEH HAI FIX: Expanded Theme colors ka mapping ---
const themes: Record<string, ThemeClasses> = {
    // Basic Themes
    default:  { primary: 'text-yellow-600 dark:text-yellow-400', bgAccent: 'bg-yellow-100 dark:bg-yellow-900/30', borderAccent: 'border-yellow-500' },
    blue:     { primary: 'text-blue-600 dark:text-blue-400',     bgAccent: 'bg-blue-100 dark:bg-blue-900/30',     borderAccent: 'border-blue-500' },
    green:    { primary: 'text-green-600 dark:text-green-400',   bgAccent: 'bg-green-100 dark:bg-green-900/30',   borderAccent: 'border-green-500' },
    purple:   { primary: 'text-indigo-600 dark:text-indigo-400', bgAccent: 'bg-indigo-100 dark:bg-indigo-900/30', borderAccent: 'border-indigo-500' },
    // Premium Themes
    slate:    { primary: 'text-slate-600 dark:text-slate-400',   bgAccent: 'bg-slate-200 dark:bg-slate-700/50',   borderAccent: 'border-slate-500' },
    ocean:    { primary: 'text-cyan-700 dark:text-cyan-400',     bgAccent: 'bg-cyan-100 dark:bg-cyan-900/40',     borderAccent: 'border-cyan-600' },
    sunset:   { primary: 'text-orange-700 dark:text-orange-400', bgAccent: 'bg-orange-100 dark:bg-orange-900/30', borderAccent: 'border-orange-500' },
    // Professional Themes
    mint:     { primary: 'text-emerald-700 dark:text-emerald-400', bgAccent: 'bg-emerald-50 dark:bg-emerald-900/40', borderAccent: 'border-emerald-300' },
    lavender: { primary: 'text-violet-700 dark:text-violet-400',   bgAccent: 'bg-violet-50 dark:bg-violet-900/40',   borderAccent: 'border-violet-300' },
    blush:    { primary: 'text-rose-700 dark:text-rose-400',       bgAccent: 'bg-rose-50 dark:bg-rose-900/40',       borderAccent: 'border-rose-300' },
    graphite: { primary: 'text-gray-800 dark:text-gray-300',       bgAccent: 'bg-gray-100 dark:bg-gray-800/60',     borderAccent: 'border-gray-400' },
    // Curated Themes
    seaside:  { primary: 'text-[#34656D] dark:text-[#a0d2db]',     bgAccent: 'bg-[#FAF8F1] dark:bg-[#34656D]/30',   borderAccent: 'border-[#FAEAB1]' },
    vibrant:  { primary: 'text-[#FF7A30] dark:text-[#ff9a63]',     bgAccent: 'bg-[#E9E3DF] dark:bg-[#465C88]/30',   borderAccent: 'border-[#465C88]' },
    pastel:   { primary: 'text-[#a36d64] dark:text-[#f0e4d3]',     bgAccent: 'bg-[#FAF7F3] dark:bg-[#D9A299]/30',   borderAccent: 'border-[#F0E4D3]' },
    rose:     { primary: 'text-[#B9375D] dark:text-[#f8b4c7]',     bgAccent: 'bg-[#EEEEEE] dark:bg-[#B9375D]/20',   borderAccent: 'border-[#E7D3D3]' },
    lime:     { primary: 'text-[#82b800] dark:text-[#d2ff4d]',     bgAccent: 'bg-[#FFFADC] dark:bg-[#A4DD00]/20',   borderAccent: 'border-[#A4DD00]' },
};

// Props interface definition
interface InvoicePreviewProps {
  data: InvoiceData | null;
  logoUrl: string | null;
  theme: string;
  template: string;
  setData?: React.Dispatch<React.SetStateAction<InvoiceData | null>>;
}

// Helper function to load scripts dynamically
declare global {
  interface Window { jspdf: any; html2canvas: any; }
}
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

// Main Invoice Preview Component
const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, logoUrl, theme, template, setData }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const invoiceDataToRender = data || mockInvoiceData;
  const themeClasses = themes[theme] || themes.default;

  const handleDownloadPDF = async () => {
    const elementToCapture = invoiceRef.current?.querySelector('[data-template-content]');
    if (!elementToCapture) return console.error("Could not find template content.");

    try {
        await Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
        ]);
    } catch (error) {
        console.error("Could not load PDF libraries", error);
        alert("Error downloading PDF. Check connection.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;

    const canvas = await html2canvas(elementToCapture as HTMLElement, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png', 1.0);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width / (96 / 25.4);
    const imgHeight = canvas.height / (96 / 25.4);
    const ratio = imgWidth / imgHeight;
    let finalImgWidth = pdfWidth;
    let finalImgHeight = pdfWidth / ratio;

    if (finalImgHeight > pdfHeight) {
        finalImgHeight = pdfHeight;
        finalImgWidth = pdfHeight * ratio;
    }

    const xPos = (pdfWidth - finalImgWidth) / 2;
    pdf.addImage(imgData, 'PNG', xPos, 0, finalImgWidth, finalImgHeight);
    pdf.save(`invoice-${invoiceDataToRender.invoiceNumber}.pdf`);
  };

  // Function to render the correct template component
  const renderTemplate = () => {
    // BhookhadBaba template is special and manages its own state
    if (template.toLowerCase() === 'bhookhad-baba') {
      return <TemplateBhookhadBaba logoUrl={logoUrl} setData={setData} />;
    }
    // All other templates are display-only and receive standard props
    const props = { data: invoiceDataToRender, logoUrl, themeClasses };
    switch (template.toLowerCase()) {
      case 'modern':
        return <TemplateModern {...props} />;
      case 'minimal':
        return <TemplateMinimal {...props} />;
      case 'classic':
      default:
        return <TemplateClassic {...props} />;
    }
  };

  return (
    <div>
      <div ref={invoiceRef} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-w-4xl mx-auto shadow-lg bg-white dark:bg-gray-900">
           <div data-template-content>
                {renderTemplate()}
           </div>
      </div>

      <div className="text-center mt-8 mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center mx-auto shadow-md"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;