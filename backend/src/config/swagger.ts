import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo App API - Industrix Coding Challenge',
      version: '1.0.0',
      description: `
# 🚀 Todo App API Documentation

A full-stack todo application backend API built for Industrix Full Stack Engineer Intern Coding Challenge.

## 📋 Features
- **Todo Management**: CRUD operations for todos
- **Category Management**: CRUD operations for categories  
- **Advanced Filtering**: Search, filter by status, category, priority
- **Pagination**: Efficient data loading
- **RESTful API**: Clean and consistent endpoints

## 🔐 Authentication
No authentication required for this challenge version.

## 🛠️ Technologies
- Node.js + Express + TypeScript
- PostgreSQL + Sequelize ORM
- Swagger for API documentation
`,
      contact: {
        name: 'API Support',
        email: 'support@todoapp.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Frontend Development Server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Todos',
        description: 'Todo management operations'
      },
      {
        name: 'Categories',
        description: 'Category management operations'
      }
    ],
    components: {
      schemas: {
        // Todo Schema
        Todo: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'Auto-generated todo ID'
            },
            title: {
              type: 'string',
              example: 'Complete coding challenge',
              description: 'Todo title (required)'
            },
            description: {
              type: 'string',
              example: 'Build a full-stack todo application for Industrix',
              description: 'Todo description'
            },
            completed: {
              type: 'boolean',
              example: false,
              default: false,
              description: 'Completion status'
            },
            category_id: {
              type: 'integer',
              example: 1,
              description: 'Reference to category ID'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              default: 'medium',
              example: 'high',
              description: 'Priority level with color indicators'
            },
            due_date: {
              type: 'string',
              format: 'date-time',
              example: '2024-08-03T23:59:59.000Z',
              description: 'Due date in ISO format'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:00:00.000Z',
              description: 'Creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:00:00.000Z',
              description: 'Last update timestamp'
            },
            category: {
              $ref: '#/components/schemas/Category'
            }
          }
        },
        
        // Category Schema
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'Auto-generated category ID'
            },
            name: {
              type: 'string',
              example: 'Work',
              description: 'Category name (required, unique)'
            },
            color: {
              type: 'string',
              example: '#3B82F6',
              default: '#3B82F6',
              description: 'Color code in hex format'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:00:00.000Z',
              description: 'Creation timestamp'
            }
          }
        },

        // Pagination Schema
        Pagination: {
          type: 'object',
          properties: {
            current_page: {
              type: 'integer',
              example: 1
            },
            per_page: {
              type: 'integer',
              example: 10
            },
            total: {
              type: 'integer',
              example: 25
            },
            total_pages: {
              type: 'integer',
              example: 3
            }
          }
        },

        // API Response Schema
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            pagination: {
              $ref: '#/components/schemas/Pagination'
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Todo not found'
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Todo deleted successfully'
            }
          }
        },

        // Error Response Schema
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Internal server error'
            }
          }
        }
      },
      
      // Parameters
      parameters: {
        // Pagination Parameters
        PageParam: {
          in: 'query',
          name: 'page',
          schema: { 
            type: 'integer', 
            minimum: 1, 
            default: 1 
          },
          description: 'Page number for pagination'
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          schema: { 
            type: 'integer', 
            minimum: 1, 
            maximum: 100, 
            default: 10 
          },
          description: 'Number of items per page'
        },
        
        // Filtering Parameters
        SearchParam: {
          in: 'query',
          name: 'search',
          schema: { type: 'string' },
          description: 'Search todos by title (case-insensitive)'
        },
        CompletedParam: {
          in: 'query',
          name: 'completed',
          schema: { type: 'boolean' },
          description: 'Filter by completion status (true/false)'
        },
        CategoryIdParam: {
          in: 'query',
          name: 'category_id',
          schema: { type: 'integer' },
          description: 'Filter by category ID'
        },
        PriorityParam: {
          in: 'query',
          name: 'priority',
          schema: { 
            type: 'string', 
            enum: ['low', 'medium', 'high'] 
          },
          description: 'Filter by priority level'
        },
        
        // Path Parameters
        IdParam: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Resource ID'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'] // Path to API files
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;