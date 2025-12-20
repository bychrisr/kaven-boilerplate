'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const invoiceId = params?.id;
  const [invoice, setInvoice] = useState<{
    id: string | string[];
    number: string;
    customer: string;
    amount: number;
    status: string;
    dueDate: string;
    items: Array<{ description: string; quantity: number; price: number }>;
    subtotal: number;
    tax: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    // Mock data - wrapped in setTimeout to avoid setState in effect warning
    const timer = setTimeout(() => {
      setInvoice({
        id: invoiceId || '',
        number: `INV-${String(invoiceId).padStart(4, '0')}`,
        customer: 'Customer 1',
        amount: 1500,
        status: 'paid',
        dueDate: '2025-02-15',
        items: [
          { description: 'Service A', quantity: 2, price: 500 },
          { description: 'Service B', quantity: 1, price: 500 }
        ],
        subtotal: 1500,
        tax: 0,
        total: 1500
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [invoiceId]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
        <div className="flex gap-2">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50">
            Download PDF
          </button>
          <button className="bg-primary-main text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark">
            Send Email
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-gray-600">{invoice.number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Due Date</p>
            <p className="font-medium text-gray-900">{invoice.dueDate}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-1">Bill To:</p>
          <p className="font-medium text-gray-900">{invoice.customer}</p>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead className="border-b-2 border-gray-200">
            <tr>
              <th className="text-left py-2 text-sm font-medium text-gray-600">Description</th>
              <th className="text-right py-2 text-sm font-medium text-gray-600">Qty</th>
              <th className="text-right py-2 text-sm font-medium text-gray-600">Price</th>
              <th className="text-right py-2 text-sm font-medium text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i: number) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 text-gray-900">{item.description}</td>
                <td className="py-3 text-right text-gray-900">{item.quantity}</td>
                <td className="py-3 text-right text-gray-900">${item.price}</td>
                <td className="py-3 text-right text-gray-900">${item.quantity * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">${invoice.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="text-gray-900">${invoice.tax}</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-gray-200">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-gray-900">${invoice.total}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            invoice.status === 'paid' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'
          }`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
