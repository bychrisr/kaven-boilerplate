/**
 * Mock Tenants Data
 * Generated using mock generators
 */

import { _mock } from '../generators';

export type MockTenant = {
  id: string;
  name: string;
  domain: string;
  cnpj: string;
  email: string;
  phone: string;
  status: string;
  plan: string;
  usersCount: number;
  createdAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

const plans = ['free', 'basic', 'pro', 'enterprise'];

export const MOCK_TENANTS: MockTenant[] = Array.from({ length: 12 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.company(index),
  domain: _mock.domain(index),
  cnpj: _mock.cnpj(index),
  email: _mock.email(index),
  phone: _mock.phone(index),
  status: _mock.status(index),
  plan: plans[index % plans.length],
  usersCount: 5 + (index * 3),
  createdAt: _mock.time(index),
  address: _mock.address(index),
}));
