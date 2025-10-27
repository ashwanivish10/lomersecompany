import React from 'react';
import type { InvoiceData, ThemeClasses } from './types';

interface TemplateProps {
  data: InvoiceData;
  logoUrl: string | null;
  themeClasses: ThemeClasses;
}

const TemplateMinimal: React.FC<TemplateProps> = ({ data, logoUrl, themeClasses }) => {
  return (
    <div className="p-12 bg-white dark:bg-gray-900 text-black dark:text-white font-sans">
      {/* Header */}
      <div className="grid grid-cols-2 items-start mb-16">
        <div>
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="h-10 w-auto mb-4" />
          ) : (
            <h1 className={`text-2xl font-bold uppercase tracking-wider ${themeClasses.primary}`}>{data.from.name}</h1>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-light text-gray-800 dark:text-gray-200">INVOICE</h2>
          <p className="text-sm text-gray-500 mt-2">{data.invoiceNumber}</p>
        </div>
      </div>

      {/* From/To Details */}
      <div className="grid grid-cols-3 gap-10 mb-16 text-sm">
        <div>
          <h3 className="font-semibold text-gray-500 mb-2">Billed To</h3>
          <p className="font-bold text-gray-800 dark:text-gray-200">{data.to.name}</p>
          <p className="text-gray-600 dark:text-gray-400">{data.to.address}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500 mb-2">From</h3>
          <p className="font-bold text-gray-800 dark:text-gray-200">{data.from.name}</p>
          <p className="text-gray-600 dark:text-gray-400">{data.from.address}</p>
        </div>
        <div className="text-right">
            <p className="font-semibold text-gray-500">Date Issued</p>
            <p className="text-gray-800 dark:text-gray-200">{data.invoiceDate}</p>
            <p className="font-semibold text-gray-500 mt-2">Due Date</p>
            <p className="text-gray-800 dark:text-gray-200">{data.dueDate}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-16 text-sm">
        <thead className="border-b-2 border-gray-300 dark:border-gray-600">
          <tr>
            <th className="text-left py-3 font-semibold uppercase text-gray-500 tracking-wider">Description</th>
            <th className="text-center py-3 font-semibold uppercase text-gray-500 tracking-wider">Qty</th>
            <th className="text-right py-3 font-semibold uppercase text-gray-500 tracking-wider">Price</th>
            <th className="text-right py-3 font-semibold uppercase text-gray-500 tracking-wider">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-4 pr-3 font-medium text-gray-800 dark:text-gray-200">{item.description}</td>
              <td className="text-center py-4 text-gray-600 dark:text-gray-400">{item.quantity}</td>
              <td className="text-right py-4 text-gray-600 dark:text-gray-400">₹{item.price.toFixed(2)}</td>
              <td className="text-right py-4 font-medium text-gray-800 dark:text-gray-200">₹{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">₹{data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">GST (18%)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">₹{data.tax.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between text-2xl font-bold pt-3 mt-3 border-t-2 border-gray-300 dark:border-gray-600 ${themeClasses.primary}`}>
                <span>Total Due</span>
                <span>₹{data.total.toFixed(2)}</span>
            </div>
        </div>
      </div>
      
      {/* Footer Notes */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h4 className={`text-lg font-semibold mb-2 ${themeClasses.primary}`}>Thank You!</h4>
        <p className="text-xs text-gray-500">{data.notes}</p>
      </div>
    </div>
  );
};

export default TemplateMinimal;
