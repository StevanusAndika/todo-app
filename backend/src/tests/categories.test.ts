import request from 'supertest';
import app from '../app';
import { Category, Todo } from '../models/index';

describe('Categories API', () => {
  let server: any;
  let testCategories: Category[];

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => {
      server.on('listening', resolve);
    });
    
    // Get fresh categories data
    testCategories = await Category.findAll();
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const response = await request(server)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'UniqueCategory',
        color: '#FF0000'
      };

      const response = await request(server)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('UniqueCategory');
    });

    it('should return error when name is missing', async () => {
      const response = await request(server)
        .post('/api/categories')
        .send({ color: '#FF0000' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Category name is required');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update category successfully', async () => {
      const category = testCategories[0];

      const updateData = {
        name: 'UpdatedCategoryName',
        color: '#0000FF'
      };

      const response = await request(server)
        .put(`/api/categories/${category.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('UpdatedCategoryName');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(server)
        .put('/api/categories/99999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Category not found');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category successfully', async () => {
      // Create a temporary category to delete
      const tempCategory = await Category.create({ 
        name: 'TempDeleteCategory', 
        color: '#3B82F6' 
      });

      const response = await request(server)
        .delete(`/api/categories/${tempCategory.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Category deleted successfully');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(server)
        .delete('/api/categories/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Category not found');
    });

    it('should handle foreign key constraint error', async () => {
      const category = testCategories[0];
      
      // Create a todo associated with this category
      await Todo.create({
        title: 'Test Todo for Constraint',
        category_id: category.id
      });

      const response = await request(server)
        .delete(`/api/categories/${category.id}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Cannot delete category with associated todos');
    });
  });
});