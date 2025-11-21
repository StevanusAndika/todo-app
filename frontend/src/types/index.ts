export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category_id: number;
  category?: Category;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface TodosResponse {
  data: Todo[];
  pagination: PaginationInfo;
}

export interface TodoFormData {
  title: string;
  description: string;
  category_id: number;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
}