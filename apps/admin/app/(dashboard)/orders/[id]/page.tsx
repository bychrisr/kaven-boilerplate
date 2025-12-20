'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Mock data
    setOrder({
      id: orderId,
      number: `ORD-${String(orderId).padStart(5, '0')}`,
      customer: 'Customer 1',
      email: 'customer1@example.com',
      status: 'delivered',
      total: 750,
      items: [
        { name: 'Product A', quantity: 2, price: 250 },
        { name: 'Product B', quantity: 1, price: 250 }
      ],
      shippingAddress: '123 Main St, San Francisco, CA 94102',
      createdAt: '2025-01-20'
    });
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-gray-900">${order.total}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Shipping Address</h3>
            <p className="text-gray-600">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Order Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-medium text-gray-900">{order.number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium text-gray-900">{order.customer}</p>
                <p className="text-sm text-gray-600">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block px-2 py-1 bg-success-light text-success-dark rounded text-sm font-medium">
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">{order.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
