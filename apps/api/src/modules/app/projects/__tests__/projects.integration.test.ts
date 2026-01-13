import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8000';

let authToken: string;
let testProjectId: string;
let testTaskId: string;

describe('Projects API Integration Tests', () => {
  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@kaven.dev',
      password: 'Admin@123',
    });
    authToken = loginResponse.data.accessToken;
  });

  describe('GET /api/app/projects', () => {
    it('should return list of projects with pagination', async () => {
      const response = await axios.get(`${API_URL}/api/app/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(response.data).toHaveProperty('meta');
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.meta).toHaveProperty('total');
      expect(response.data.meta).toHaveProperty('page');
      expect(response.data.meta).toHaveProperty('limit');
      expect(response.data.meta).toHaveProperty('totalPages');
    });

    it('should filter projects by spaceId', async () => {
      const response = await axios.get(`${API_URL}/api/app/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { spaceId: 'some-space-id' },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
    });

    it('should support pagination parameters', async () => {
      const response = await axios.get(`${API_URL}/api/app/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page: 1, limit: 5 },
      });

      expect(response.status).toBe(200);
      expect(response.data.meta.page).toBe(1);
      expect(response.data.meta.limit).toBe(5);
    });
  });

  describe('POST /api/app/projects', () => {
    it('should create a new project', async () => {
      const newProject = {
        name: 'Test Project',
        description: 'Integration test project',
        color: '#FF5733',
      };

      const response = await axios.post(
        `${API_URL}/api/app/projects`,
        newProject,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(newProject.name);
      expect(response.data.description).toBe(newProject.description);
      expect(response.data).toHaveProperty('tenantId');
      expect(response.data).toHaveProperty('createdById');

      testProjectId = response.data.id;
    });

    it('should reject project without name', async () => {
      try {
        await axios.post(
          `${API_URL}/api/app/projects`,
          { description: 'No name' },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /api/app/projects/:id', () => {
    it('should return project details', async () => {
      const response = await axios.get(
        `${API_URL}/api/app/projects/${testProjectId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testProjectId);
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('createdBy');
      expect(response.data).toHaveProperty('tasks');
    });

    it('should return 404 for non-existent project', async () => {
      try {
        await axios.get(
          `${API_URL}/api/app/projects/non-existent-id`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /api/app/projects/:id', () => {
    it('should update project', async () => {
      const updates = {
        name: 'Updated Test Project',
        description: 'Updated description',
      };

      const response = await axios.put(
        `${API_URL}/api/app/projects/${testProjectId}`,
        updates,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updates.name);
      expect(response.data.description).toBe(updates.description);
    });
  });

  describe('Tenant Isolation', () => {
    it('should only return projects from user tenant', async () => {
      const response = await axios.get(`${API_URL}/api/app/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      
      // All projects should have the same tenantId
      const projects = response.data.data;
      if (projects.length > 0) {
        const firstTenantId = projects[0].tenantId;
        projects.forEach((project: any) => {
          expect(project.tenantId).toBe(firstTenantId);
        });
      }
    });
  });

  describe('DELETE /api/app/projects/:id', () => {
    it('should delete project', async () => {
      const response = await axios.delete(
        `${API_URL}/api/app/projects/${testProjectId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      expect(response.status).toBe(204);

      // Verify project is deleted
      try {
        await axios.get(
          `${API_URL}/api/app/projects/${testProjectId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});

describe('Tasks API Integration Tests', () => {
  beforeAll(async () => {
    // Create a project for task tests
    const projectResponse = await axios.post(
      `${API_URL}/api/app/projects`,
      { name: 'Task Test Project', description: 'For task testing' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    testProjectId = projectResponse.data.id;
  });

  afterAll(async () => {
    // Cleanup: delete test project (cascades to tasks)
    await axios.delete(`${API_URL}/api/app/projects/${testProjectId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  });

  describe('POST /api/app/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Integration test task',
        projectId: testProjectId,
        status: 'TODO',
        priority: 'MEDIUM',
      };

      const response = await axios.post(
        `${API_URL}/api/app/tasks`,
        newTask,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(newTask.title);
      expect(response.data.projectId).toBe(testProjectId);
      expect(response.data).toHaveProperty('tenantId');

      testTaskId = response.data.id;
    });
  });

  describe('GET /api/app/tasks', () => {
    it('should return list of tasks', async () => {
      const response = await axios.get(`${API_URL}/api/app/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(response.data).toHaveProperty('meta');
      expect(Array.isArray(response.data.data)).toBe(true);
    });

    it('should filter tasks by projectId', async () => {
      const response = await axios.get(`${API_URL}/api/app/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { projectId: testProjectId },
      });

      expect(response.status).toBe(200);
      const tasks = response.data.data;
      tasks.forEach((task: any) => {
        expect(task.projectId).toBe(testProjectId);
      });
    });
  });

  describe('PUT /api/app/tasks/:id', () => {
    it('should update task status', async () => {
      const response = await axios.put(
        `${API_URL}/api/app/tasks/${testTaskId}`,
        { status: 'IN_PROGRESS' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('IN_PROGRESS');
    });
  });

  describe('DELETE /api/app/tasks/:id', () => {
    it('should delete task', async () => {
      const response = await axios.delete(
        `${API_URL}/api/app/tasks/${testTaskId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      expect(response.status).toBe(204);
    });
  });
});
