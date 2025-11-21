# README.md untuk Fullstack Todo App

**File:** `README.md` (di root project)

```markdown
# Todo App - Fullstack Application

Aplikasi Todo List lengkap dengan backend API (Node.js + Express + TypeScript) dan frontend (React + TypeScript + Ant Design).

## 📋 Fitur yang Diimplementasikan

### ✅ Backend Features
- RESTful API dengan TypeScript
- PostgreSQL dengan Sequelize ORM
- Database migrations & seeding
- Swagger API documentation
- CRUD operations untuk Todos dan Categories
- Filtering, sorting, dan pagination
- Error handling yang komprehensif
- Unit testing dengan Jest

### ✅ Frontend Features
- React 19 dengan TypeScript
- Responsive design dengan Ant Design
- CRUD operations real-time
- Filtering by status, kategori, dan prioritas
- Pencarian todos
- Sort by berbagai field
- Konfirmasi dengan SweetAlert2

## 🚀 Panduan Setup Lengkap (Step-by-Step)

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/StevanusAndika/todo-app
cd todo-app
```

### 2. Setup Backend

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Setup Database PostgreSQL
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE todo_app;
\q
```

#### 2.3 Konfigurasi Environment
Buat file `.env` di folder `backend/`:
```env
DB_USER=postgres
DB_PASSWORD=password_anda
DB_NAME=todo_app
DB_HOST=localhost
DB_PORT=5432
PORT=5000
NODE_ENV=development
```

#### 2.4 Jalankan Database Migrations
```bash
npm run migrate:up
```

#### 2.5 Jalankan Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Konfigurasi Environment (Opsional)
Buat file `.env` di folder `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=Todo App
```

#### 3.3 Jalankan Frontend
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 4. Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 🐳 Docker Setup (Alternatif)

### Dengan Docker Compose
```bash
# Build dan jalankan semua services
docker-compose up -d --build

# Akses aplikasi
# Frontend: http://localhost
# Backend: http://localhost:3000
```

## 🧪 Menjalankan Tests

### Backend Tests
```bash
cd backend
npm test              # Run semua tests
npm run test:watch    # Watch mode
npm run test:coverage # Dengan coverage report
```

### Frontend Tests
```bash
cd frontend
npm run lint         # Code linting
npm run build        # Build production
```

## 📚 API Documentation

### Endpoints

#### Todos
- `GET /api/todos` - Get semua todos dengan filter & pagination
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create todo baru
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle status completed
- `DELETE /api/todos/:id` - Delete todo

#### Categories
- `GET /api/categories` - Get semua categories
- `POST /api/categories` - Create category baru
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Contoh Request
```bash
# Create todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Belajar TypeScript",
    "description": "Mempelajari dasar TypeScript",
    "category_id": 1,
    "priority": "high"
  }'
```

## ❓ Jawaban Technical Questions

### Database Design Questions

#### 1. Tables yang Dibuat dan Alasannya

**Tables:**
- `categories` - Menyimpan kategori todo dengan warna
- `todos` - Menyimpan data todo dengan relasi ke categories

**Struktur Tables:**
```sql
-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todos table  
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  category_id INTEGER REFERENCES categories(id),
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Alasan Desain:**
- Relasi one-to-many antara categories dan todos
- Enum untuk priority memastikan data konsisten
- Timestamps untuk tracking creation dan update
- Color field untuk visual differentiation

#### 2. Pagination dan Filtering di Database

**Pagination Implementation:**
```javascript
// Menggunakan Sequelize pagination
const getTodos = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  return await Todo.findAndCountAll({
    include: [Category],
    where: filterConditions,
    order: sortOrder,
    limit,
    offset
  });
};
```

**Filtering Queries:**
```sql
-- Filter by status dan kategori
SELECT * FROM todos 
WHERE completed = false 
AND category_id = 1 
ORDER BY created_at DESC 
LIMIT 10 OFFSET 0;

-- Search by title
SELECT * FROM todos 
WHERE title ILIKE '%belajar%' 
ORDER BY priority DESC, due_date ASC;
```

**Indexes yang Ditambahkan:**
```sql
CREATE INDEX idx_todos_category_id ON todos(category_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_due_date ON todos(due_date);
```

### Technical Decision Questions

#### 1. Responsive Design Implementation

**Breakpoints yang Digunakan:**
```css
/* Mobile First Approach */
/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) { ... }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { ... }

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) { ... }
```

**Adaptasi UI:**
- Mobile: Single column, collapsed sidebar
- Tablet: Two column layout
- Desktop: Full layout dengan sidebar permanen

**Ant Design Components:**
- `Grid` dan `Row/Col` untuk responsive layout
- `Table` dengan responsive scroll
- `Modal` yang menyesuaikan ukuran layar
- `Drawer` untuk mobile navigation

#### 2. React Component Structure

**Component Hierarchy:**
```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── MainContent
│       ├── TodoFilters
│       ├── TodoList
│       │   ├── TodoItem
│       │   └── PriorityBadge
│       └── TodoForm
```

**State Management:**
```typescript
// Centralized state dengan React hooks
const [todos, setTodos] = useState<Todo[]>([]);
const [filters, setFilters] = useState<FilterState>({
  status: 'all',
  category: null,
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc'
});
```

**Filtering & Pagination State:**
```typescript
interface FilterState {
  status: 'all' | 'active' | 'completed';
  category: number | null;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}
```

#### 3. Backend Architecture

**Struktur Folder:**
```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── utils/          # Helper functions
```

**Error Handling Approach:**
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error' 
  });
});
```

#### 4. Data Validation

**Backend Validation:**
```javascript
// Menggunakan Sequelize validation
const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    validate: {
      isIn: [['low', 'medium', 'high']]
    }
  }
});
```

**Frontend Validation:**
```typescript
// Form validation dengan Ant Design
<Form.Item
  name="title"
  label="Title"
  rules={[
    { required: true, message: 'Please input todo title!' },
    { min: 1, message: 'Title must be at least 1 character' },
    { max: 255, message: 'Title cannot exceed 255 characters' }
  ]}
>
  <Input />
</Form.Item>
```

### Testing & Quality Questions

#### 1. Unit Test Implementation

**Functions/Methods yang Di-test:**
- API endpoints (GET, POST, PUT, DELETE)
- Database operations (create, read, update, delete)
- Business logic services
- Utility functions

**Test Structure:**
```javascript
describe('Todo API', () => {
  describe('GET /api/todos', () => {
    it('should return all todos', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
```

**Edge Cases:**
- Invalid input data
- Non-existent resources
- Database connection errors
- Validation failures

#### 2. Improvements untuk Masa Depan

**Technical Debt:**
- [ ] Implement proper logging system
- [ ] Add rate limiting untuk API
- [ ] Implement caching layer
- [ ] Add database connection pooling

**Feature Improvements:**
- [ ] User authentication & authorization
- [ ] File upload untuk attachments
- [ ] Real-time updates dengan WebSocket
- [ ] Export/import functionality
- [ ] Advanced reporting & analytics

**Refactoring Opportunities:**
- [ ] Extract common utilities ke shared package
- [ ] Implement repository pattern untuk data access
- [ ] Add comprehensive integration tests
- [ ] Optimize database queries dengan advanced indexing

## 📞 Support

Jika mengalami masalah saat setup, silakan:
1. Check logs di terminal untuk error messages
2. Pastikan PostgreSQL berjalan dan database dibuat
3. Verifikasi environment variables sudah sesuai
4. Buka issue di GitHub repository

## 📄 License

MIT License
```

## 📁 File Structure yang Dibuat:

```
todo-app/
├── README.md                 # File ini (fullstack documentation)
├── backend/
│   ├── README.md            # Backend-specific documentation
│   └── ... (source code)
├── frontend/
│   ├── README.md            # Frontend-specific documentation  
│   └── ... (source code)
└── docker-compose.yml
```

Setiap bagian (backend, frontend, fullstack) memiliki README.md terpisah dengan instruksi yang detail dan spesifik untuk konteks masing-masing.