

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Your themes...
export const THEMES = {
  default: { type: "color", pageBg: "white", primary: "#f59e0b", textDark: "#1f2937", textMedium: "#4b5563", textLight: "#6b7280", border: "#d1d5db", headerBg: "#f9fafb" },
  blue: { type: "color", pageBg: "white", primary: "#2563eb", textDark: "#1f2937", textMedium: "#4b5563", textLight: "#6b7280", border: "#d1d5db", headerBg: "#f9fafb" },
  green: { type: "color", pageBg: "white", primary: "#16a34a", textDark: "#1f2937", textMedium: "#4b5563", textLight: "#6b7280", border: "#d1d5db", headerBg: "#f9fafb" },
  purple: { type: "color", pageBg: "white", primary: "#4f46e5", textDark: "#1f2937", textMedium: "#4b5563", textLight: "#6b7280", border: "#d1d5db", headerBg: "#f9fafb" },
  slate: { type: "color", pageBg: "#374151", primary: "#9ca3af", textDark: "#f9fafb", textMedium: "#d1d5db", textLight: "#9ca3af", border: "#4b5563", headerBg: "#4b5563" },
  ocean: { type: "color", pageBg: "#0c4a6e", primary: "#7dd3fc", textDark: "#f0f9ff", textMedium: "#e0f2fe", textLight: "#bae6fd", border: "#0369a1", headerBg: "#075985" },
  sunset: { type: "color", pageBg: "#7c2d12", primary: "#fdba74", textDark: "#fff7ed", textMedium: "#ffedd5", textLight: "#fed7aa", border: "#9a3412", headerBg: "#9a3412" },
  mint: { type: "color", pageBg: "#f0fdfa", primary: "#14b8a6", textDark: "#0f766e", textMedium: "#115e59", textLight: "#134e4a", border: "#ccfbf1", headerBg: "rgba(204, 251, 241, 0.5)" },
  lavender: { type: "color", pageBg: "#f5f3ff", primary: "#8b5cf6", textDark: "#5b21b6", textMedium: "#6d28d9", textLight: "#7c3aed", border: "#ede9fe", headerBg: "rgba(237, 233, 254, 0.5)" },
  blush: { type: "color", pageBg: "#fff1f2", primary: "#f43f5e", textDark: "#be123c", textMedium: "#9f1239", textLight: "#881337", border: "#ffe4e6", headerBg: "rgba(255, 228, 230, 0.5)" },
  graphite: { type: "gradient", pageBg: "linear-gradient(to bottom right, #f9fafb, #e5e7eb)", primary: "#3b82f6", textDark: "#1f2937", textMedium: "#4b5563", textLight: "#6b7280", border: "#d1d5db", headerBg: "rgba(255,255,255,0.5)" },
  seaside: { type: "color", pageBg: "#FAF8F1", primary: "#34656D", textDark: "#334443", textMedium: "#34656D", textLight: "#34656D", border: "#FAEAB1", headerBg: "rgba(250, 234, 177, 0.3)" },
  vibrant: { type: "color", pageBg: "#E9E3DF", primary: "#FF7A30", textDark: "#000000", textMedium: "#465C88", textLight: "#465C88", border: "#465C88", headerBg: "rgba(70, 92, 136, 0.1)" },
  pastel: { type: "color", pageBg: "#FAF7F3", primary: "#D9A299", textDark: "#A07855", textMedium: "#D9A299", textLight: "#DCC5B2", border: "#F0E4D3", headerBg: "rgba(240, 228, 211, 0.4)" },
  rose: { type: "color", pageBg: "#EEEEEE", primary: "#B9375D", textDark: "#B9375D", textMedium: "#D25D5D", textLight: "#D25D5D", border: "#E7D3D3", headerBg: "rgba(231, 211, 211, 0.4)" },
  lime: { type: "color", pageBg: "#FFFADC", primary: "#B6F500", textDark: "#98CD00", textMedium: "#A4DD00", textLight: "#A4DD00", border: "#B6F500", headerBg: "rgba(182, 245, 0, 0.2)" },
};

export type ThemeName = keyof typeof THEMES;

export interface InvoiceData {
  companyName: string;
  companyTagline?: string;
  logoUrl?: string | null;
  clientName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceTitle: string;
  items: Array<{
    date: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  amountPaid: number;
  tax: string;
  address?: string;
  phone?: string;
  theme: ThemeName;
}

export async function generateInvoicePDF(invoiceData: InvoiceData) {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "450px";
  document.body.appendChild(container);

  const theme = THEMES[invoiceData.theme] || THEMES.default;
  const totalQty = invoiceData.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${theme.textMedium}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; flex-shrink: 0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
  const phoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${theme.textMedium}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; flex-shrink: 0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;

  container.innerHTML = `
    <div style="background: ${theme.pageBg}; padding: 2rem; font-family: 'Poppins', sans-serif; max-width: 450px;">
      <div style="display: flex; align-items: center; margin-bottom: 2.5rem; border-bottom: 2px solid ${theme.border}; padding-bottom: 1.5rem;">
        ${invoiceData.logoUrl ? `<img src="${invoiceData.logoUrl}" style="height: 4rem; width: auto; max-width: 6rem; object-fit: contain; margin-right: 1.5rem;" />` : ""}
        <div>
          <h1 style="font-size: 1.5rem; font-weight: bold; color: ${theme.primary}; margin: 0; line-height: 1.2;">${invoiceData.companyName}</h1>
          ${invoiceData.companyTagline ? `<p style="color: ${theme.textLight}; margin: 0.25rem 0 0 0; font-size: 0.875rem;">${invoiceData.companyTagline}</p>` : ""}
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
        <div>
          <h2 style="font-size: 1.875rem; font-weight: bold; color: ${theme.textDark}; margin: 0;">${invoiceData.invoiceTitle}</h2>
        </div>
        <div style="text-align: right; color: ${theme.textMedium}; font-size: 0.875rem;">
          <p style="margin: 0.25rem 0;"><strong>Date:</strong> ${invoiceData.invoiceDate}</p>
          <p style="margin: 0.25rem 0;"><strong>Invoice to:</strong> ${invoiceData.clientName}</p>
          <p style="margin: 0.25rem 0;"><strong>Invoice no:</strong> ${invoiceData.invoiceNumber}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: ${theme.headerBg};">
            <th style="padding: 0.75rem; text-align: left; color: ${theme.textDark}; font-weight: 600; font-size: 0.75rem;">DATE</th>
            <th style="padding: 0.75rem; text-align: center; color: ${theme.textDark}; font-weight: 600; font-size: 0.75rem;">QTY</th>
            <th style="padding: 0.75rem; text-align: right; color: ${theme.textDark}; font-weight: 600; font-size: 0.75rem;">PRICE</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.items.map((item, idx) =>
            `<tr style="${idx === invoiceData.items.length - 1 ? "" : `border-bottom: 1px solid ${theme.border};`}">
              <td style="padding: 0.75rem; color: ${theme.textMedium}; font-size: 0.875rem;">${item.date}</td>
              <td style="padding: 0.75rem; text-align: center; color: ${theme.textMedium}; font-size: 0.875rem;">${item.quantity}</td>
              <td style="padding: 0.75rem; text-align: right; color: ${theme.textMedium}; font-size: 0.875rem;">₹${(item.price / 100).toFixed(2)}</td>
            </tr>`
          ).join("")}
        </tbody>
      </table>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1.25rem;">
        <div style="width: 50%; text-align: center;">
          <p style="font-family: 'Dancing Script', cursive; font-size: 2.5rem; color: ${theme.primary}; transform: rotate(-10deg); opacity: 0.85; margin: 0;">Thank You!</p>
        </div>
        <div style="width: 50%; color: ${theme.textMedium}; font-size: 0.875rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span>TOTAL TIFFIN:</span><span style="font-weight: 600;">${totalQty}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span>TOTAL AMOUNT:</span><span style="font-weight: 600;">₹${(invoiceData.totalAmount / 100).toFixed(2)}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span>AMOUNT PAID:</span><span style="font-weight: 600;">₹${(invoiceData.amountPaid / 100).toFixed(2)}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span>TAX:</span><span style="font-weight: 600;">${invoiceData.tax}</span></div>
          <div style="border-top: 1px solid ${theme.border}; margin: 0.5rem 0; padding-top: 0.5rem; display: flex; justify-content: space-between; font-weight: bold; font-size: 1.125rem; color: ${theme.textDark};"><span>AMOUNT DUE:</span><span>₹${((invoiceData.totalAmount - invoiceData.amountPaid) / 100).toFixed(2)}</span></div>
        </div>
      </div>
      
      ${invoiceData.address || invoiceData.phone ? `
        <div style="border-top: 2px dashed ${theme.border}; margin-top: 2rem; padding-top: 1rem;">
          <div style="color: ${theme.textMedium}; font-size: 0.75rem;">
            ${invoiceData.address ? `<p style="display: flex; align-items: center; margin: 0.5rem 0;">${locationIcon}<span>${invoiceData.address}</span></p>` : ''}
            ${invoiceData.phone ? `<p style="display: flex; align-items: center; margin: 0.5rem 0;">${phoneIcon}<span>Phone: ${invoiceData.phone}</span></p>` : ''}
          </div>
        </div>
      ` : ""}
    </div>
  `;

  const createPdf = async () => {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [450, canvas.height / 2],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 450, canvas.height / 2);
    pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
  };

  const logoImageElement = container.querySelector("img");

  if (logoImageElement) {
    setTimeout(() => {
      createPdf();
    }, 500);
  } else {
    createPdf();
  }
}