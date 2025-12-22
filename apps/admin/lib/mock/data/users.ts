/**
 * Mock Users Data
 * Generated using mock generators
 */

import { _mock } from '../generators';

export type MockUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
  company: string;
};

export const MOCK_USERS: MockUser[] = Array.from({ length: 24 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  email: _mock.email(index),
  phone: _mock.phone(index),
  cpf: _mock.cpf(index),
  avatar: _mock.avatar(index),
  role: _mock.role(index),
  status: _mock.status(index),
  createdAt: _mock.time(index),
  company: _mock.company(index),
}));
