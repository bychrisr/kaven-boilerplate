import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user.service';

// Mocks
const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../../../lib/prisma', () => ({
  default: prismaMock,
}));

vi.mock('../../../lib/bcrypt', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password'),
}));

import { hashPassword } from '../../../lib/bcrypt';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const input = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role: 'USER' as const,
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-123',
        email: input.email,
        name: input.name,
        role: input.role,
        tenantId: null,
      });

      // Act
      const result = await userService.createUser(input);

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: input.email } });
      expect(hashPassword).toHaveBeenCalledWith(input.password);
      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(result.email).toBe(input.email);
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const input = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
      };

      prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      // Act & Assert
      await expect(userService.createUser(input)).rejects.toThrow('Email já cadastrado');
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('listUsers', () => {
    it('should return paginated users', async () => {
      // Arrange
      const mockUsers = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];
      const total = 20;

      prismaMock.user.findMany.mockResolvedValue(mockUsers);
      prismaMock.user.count.mockResolvedValue(total);

      // Act
      const result = await userService.listUsers(undefined, 1, 10);

      // Assert
      expect(prismaMock.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 10,
      }));
      expect(result.users).toEqual(mockUsers);
      expect(result.pagination.total).toBe(total);
      expect(result.pagination.totalPages).toBe(2);
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user', async () => {
      // Arrange
      const userId = 'user-123';
      prismaMock.user.findUnique.mockResolvedValue({ id: userId });

      // Act
      await userService.deleteUser(userId);

      // Assert
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser('non-existent')).rejects.toThrow('Usuário não encontrado');
    });
  });
});
