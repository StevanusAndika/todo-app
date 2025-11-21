import axios from 'axios';
import type { Todo, TodosResponse, Category, TodoFormData, FilterState } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoAPI = {
  // Todos dengan advanced filtering
  getTodos: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    completed?: boolean;
    category_id?: number;
    priority?: string;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<TodosResponse> => 
    api.get('/todos', { params }).then(res => res.data),

  getTodo: (id: number): Promise<{ data: Todo }> =>
    api.get(`/todos/${id}`).then(res => res.data),

  createTodo: (data: TodoFormData): Promise<{ data: Todo }> =>
    api.post('/todos', data).then(res => res.data),

  updateTodo: (id: number, data: Partial<TodoFormData>): Promise<{ data: Todo }> =>
    api.put(`/todos/${id}`, data).then(res => res.data),

  deleteTodo: (id: number): Promise<void> =>
    api.delete(`/todos/${id}`),

  toggleTodo: (id: number): Promise<{ data: Todo }> =>
    api.patch(`/todos/${id}/toggle`).then(res => res.data),

  // Categories
  getCategories: (): Promise<{ data: Category[] }> =>
    api.get('/categories').then(res => res.data),

  createCategory: (data: { name: string; color: string }): Promise<{ data: Category }> =>
    api.post('/categories', data).then(res => res.data),

  updateCategory: (id: number, data: { name: string; color: string }): Promise<{ data: Category }> =>
    api.put(`/categories/${id}`, data).then(res => res.data),

  deleteCategory: (id: number): Promise<void> =>
    api.delete(`/categories/${id}`),
};