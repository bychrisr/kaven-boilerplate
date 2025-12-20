'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    tenantId: ''
  });

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        if (response.ok) {
          const user = await response.json();
          setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId || ''
          });
        }
      } catch (error) {
        console.error('Fetch user error:', error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('User updated successfully!');
        router.push('/users');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      alert('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit User</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
            >
              <option value="USER">User</option>
              <option value="TENANT_ADMIN">Tenant Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-main text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
