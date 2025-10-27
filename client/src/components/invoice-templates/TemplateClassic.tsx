import React from 'react';
import type { InvoiceData, ThemeClasses } from './types'; // Ek common type file banayenge

interface TemplateProps {
  data: InvoiceData;
  logoUrl: string | null;
  themeClasses: ThemeClasses;
}

const TemplateClassic: React.FC<TemplateProps> = ({ data, logoUrl, themeClasses }) => {
  return (
    <div className="p-10 bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="h-12 w-auto mb-4" />
          ) : (
            <h1 className={`text-4xl font-bold uppercase ${themeClasses.primary}`}>{data.from.name}</h1>
          )}
          <p className="text-sm text-gray-500">{data.from.address}</p>
          <p className="text-sm text-gray-500">{data.from.email}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold uppercase text-gray-400 dark:text-gray-500">Invoice</h2>
          <p className="text-md font-medium">{data.invoiceNumber}</p>
          <p className="text-sm text-gray-500 mt-2">Date: {data.invoiceDate}</p>
          <p className="text-sm text-gray-500">Due Date: {data.dueDate}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">Bill To</h3>
        <p className="text-lg font-bold text-foreground">{data.to.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{data.to.address}</p>
      </div>

      {/* Items Table */}
      <table className="w-full mb-10">
        {/* <thead className="bg-gray-100 dark:bg-gray-800"> */}
          <thead className={`${themeClasses.bgAccent}`}> {/* bgAccent use kiya */}
          <tr>
            <th className="text-left p-3 text-sm font-semibold uppercase">Description</th>
            <th className="text-center p-3 text-sm font-semibold uppercase">Qty</th>
            <th className="text-right p-3 text-sm font-semibold uppercase">Price</th>
            <th className="text-right p-3 text-sm font-semibold uppercase">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-3">{item.description}</td>
              <td className="text-center p-3">{item.quantity}</td>
              <td className="text-right p-3">₹{item.price.toFixed(2)}</td>
              <td className="text-right p-3">₹{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-10">
        <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>GST (18%)</span>
                <span>₹{data.tax.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between text-xl font-bold pt-2 border-t ${themeClasses.primary}`}>
                <span>Total</span>
                <span>₹{data.total.toFixed(2)}</span>
            </div>
        </div>
      </div>
      
      {/* Notes */}
      <div>
        <h4 className="font-semibold mb-2">Notes</h4>
        <p className="text-xs text-gray-500">{data.notes}</p>
      </div>
    </div>
  );
};

export default TemplateClassic;
