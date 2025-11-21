import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Todo, Category, TodosResponse, TodoFormData } from '../types';
import { todoAPI } from '../services/api';

interface TodoState {
  todos: Todo[];
  categories: Category[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: {
    search: string;
    completed?: boolean;
    category_id?: number;
    priority?: string;
  };
}

type TodoAction =
  | { type: 'SET_TODOS'; payload: TodosResponse }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTERS'; payload: Partial<TodoState['filters']> }
  | { type: 'SET_PAGINATION'; payload: Partial<TodoState['pagination']> }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'TOGGLE_TODO'; payload: number };

const initialState: TodoState = {
  todos: [],
  categories: [],
  loading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    search: '',
  },
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload.data,
        pagination: {
          ...state.pagination,
          current: action.payload.pagination.current_page,
          total: action.payload.pagination.total,
        },
        loading: false,
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, current: 1 }
      };
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    default:
      return state;
  }
};

interface TodoContextType extends TodoState {
  fetchTodos: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addTodo: (data: TodoFormData) => Promise<void>;
  updateTodo: (id: number, data: Partial<TodoFormData>) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  setFilters: (filters: Partial<TodoState['filters']>) => void;
  setPagination: (pagination: Partial<TodoState['pagination']>) => void;
  createCategory: (data: { name: string; color: string }) => Promise<void>;
  updateCategory: (id: number, data: { name: string; color: string }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await todoAPI.getTodos({
        page: state.pagination.current,
        limit: state.pagination.pageSize,
        ...state.filters,
      });
      dispatch({ type: 'SET_TODOS', payload: response });
    } catch (error) {
      console.error('Error fetching todos:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await todoAPI.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: response.data });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addTodo = async (data: TodoFormData) => {
    try {
      const response = await todoAPI.createTodo(data);
      dispatch({ type: 'ADD_TODO', payload: response.data });
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  };

  const updateTodo = async (id: number, data: Partial<TodoFormData>) => {
    try {
      const response = await todoAPI.updateTodo(id, data);
      dispatch({ type: 'UPDATE_TODO', payload: response.data });
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoAPI.deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      await todoAPI.toggleTodo(id);
      dispatch({ type: 'TOGGLE_TODO', payload: id });
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw error;
    }
  };

  const createCategory = async (data: { name: string; color: string }) => {
    try {
      await todoAPI.createCategory(data);
      await fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: number, data: { name: string; color: string }) => {
    try {
      await todoAPI.updateCategory(id, data);
      await fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await todoAPI.deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const setFilters = (filters: Partial<TodoState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setPagination = (pagination: Partial<TodoState['pagination']>) => {
    dispatch({ type: 'SET_PAGINATION', payload: pagination });
  };

  useEffect(() => {
    fetchTodos();
  }, [state.pagination.current, state.filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        ...state,
        fetchTodos,
        fetchCategories,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        setFilters,
        setPagination,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};