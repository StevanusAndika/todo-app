import request from 'supertest';
import app from '../app';
import { Todo, Category } from '../models/index';

describe('Todos API', () => {
  let server: any;
  let testCategory: Category;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => {
      server.on('listening', resolve);
    });
    
    // Get first category for testing
    testCategory = await Category.findOne() as Category;
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });

  describe('GET /api/todos', () => {
    it('should return empty array when no todos', async () => {
      const response = await request(server)
        .get('/api/todos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all todos with pagination', async () => {
      await Todo.bulkCreate([
        {
          title: 'Test Todo 1',
          category_id: testCategory.id,
          priority: 'high'
        },
        {
          title: 'Test Todo 2', 
          category_id: testCategory.id,
          priority: 'medium'
        }
      ]);

      const response = await request(server)
        .get('/api/todos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo successfully', async () => {
      const todoData = {
        title: 'Learn TypeScript',
        description: 'Study TypeScript fundamentals',
        category_id: testCategory.id,
        priority: 'high'
      };

      const response = await request(server)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

      expect(response.body.data.title).toBe('Learn TypeScript');
      expect(response.body.data.priority).toBe('high');
    });

    it('should return error when title is missing', async () => {
      const response = await request(server)
        .post('/api/todos')
        .send({
          description: 'No title provided',
          category_id: testCategory.id
        })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });

    it('should create todo with default values', async () => {
      const response = await request(server)
        .post('/api/todos')
        .send({
          title: 'Simple Todo'
        })
        .expect(201);

      expect(response.body.data.completed).toBe(false);
      expect(response.body.data.priority).toBe('medium');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update todo successfully', async () => {
      const todo = await Todo.create({
        title: 'Original Title',
        category_id: testCategory.id
      });

      const updateData = {
        title: 'Updated Title',
        completed: true
      };

      const response = await request(server)
        .put(`/api/todos/${todo.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(server)
        .put('/api/todos/99999')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete todo successfully', async () => {
      const todo = await Todo.create({
        title: 'Todo to delete',
        category_id: testCategory.id
      });

      const response = await request(server)
        .delete(`/api/todos/${todo.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Todo deleted successfully');
    });
  });
});