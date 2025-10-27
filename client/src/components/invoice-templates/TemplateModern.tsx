import React from 'react';
import type { InvoiceData, ThemeClasses } from './types';

interface TemplateProps {
  data: InvoiceData;
  logoUrl: string | null;
  themeClasses: ThemeClasses;
}

const TemplateModern: React.FC<TemplateProps> = ({ data, logoUrl, themeClasses }) => {
  return (
    // Side banner ab bgAccent se color lega
    <div className="flex text-black dark:text-white" data-template-content>
      <div className={`w-20 ${themeClasses.bgAccent}`}></div>
      
      <div className="flex-1 p-10 bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="h-16 w-auto mb-4" />
            ) : (
              // Heading primary color use karega
              <h1 className={`text-3xl font-bold uppercase ${themeClasses.primary}`}>{data.from.name}</h1>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-light uppercase text-gray-400 dark:text-gray-500 tracking-widest">Invoice</h2>
            <p className="text-md mt-2">{data.invoiceNumber}</p>
          </div>
        </div>

        {/* From/To Details */}
        <div className="grid grid-cols-2 gap-10 mb-12">
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">From</h3>
            <p className="font-bold">{data.from.name}</p>
            <p className="text-sm">{data.from.address}</p>
            <p className="text-sm">{data.from.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">For</h3>
            <p className="font-bold">{data.to.name}</p>
            <p className="text-sm">{data.to.address}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-10">
          <thead>
            {/* Table ka border ab borderAccent se color lega */}
            <tr className={`border-b-2 ${themeClasses.borderAccent}`}>
              <th className="text-left pb-3 text-sm font-semibold uppercase">Description</th>
              <th className="text-center pb-3 text-sm font-semibold uppercase">Qty</th>
              <th className="text-right pb-3 text-sm font-semibold uppercase">Price</th>
              <th className="text-right pb-3 text-sm font-semibold uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 pr-3 font-medium">{item.description}</td>
                <td className="text-center py-3">{item.quantity}</td>
                <td className="text-right py-3">₹{item.price.toFixed(2)}</td>
                <td className="text-right py-3">₹{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end mb-10">
          {/* Totals ka background ab bgAccent se color lega */}
          <div className={`w-full max-w-sm p-6 rounded-lg ${themeClasses.bgAccent}`}>
            <div className="flex justify-between text-md">
              <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
              <span className="font-medium">₹{data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-md mt-2">
              <span className="text-gray-700 dark:text-gray-300">GST (18%)</span>
              <span className="font-medium">₹{data.tax.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between text-2xl font-bold pt-4 mt-4 border-t-2 ${themeClasses.borderAccent} ${themeClasses.primary}`}>
              <span>Total</span>
              <span>₹{data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModern;

