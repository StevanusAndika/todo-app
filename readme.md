# Todo App - Aplikasi Fullstack

Aplikasi Todo List lengkap dengan backend API (Node.js + Express + TypeScript) dan frontend (React + TypeScript + Ant Design).

## 📋 Fitur yang Diimplementasikan

### ✅ Fitur Backend
- RESTful API dengan TypeScript
- PostgreSQL dengan Sequelize ORM
- Migrasi database & seeding
- Dokumentasi API Swagger
- Operasi CRUD untuk Todos dan Categories
- Filtering, sorting, dan pagination
- Penanganan error yang komprehensif
- Unit testing dengan Jest

### ✅ Fitur Frontend
- React 19 dengan TypeScript
- Desain responsif dengan Ant Design
- Operasi CRUD real-time
- Filter berdasarkan status, kategori, dan prioritas
- Pencarian todos
- Sortir berdasarkan berbagai field
- Konfirmasi dengan SweetAlert2

## 🚀 Panduan Setup Lengkap (Step-by-Step)

### Persyaratan
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
DB_PASSWORD=password_kamu
DB_NAME=todo_app
DB_HOST=localhost
DB_PORT=5432
PORT=5000
NODE_ENV=development
```

#### 2.4 Jalankan Migrasi Database
```bash
npm run migrate:up
```

#### 2.5 Jalankan Server Backend
```bash
# Mode development
npm run dev

# Mode production
npm run build
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

#### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Konfigurasi Environment (Opsional)
Buat file `.env` di folder `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=Todo App
```

#### 3.3 Jalankan Frontend (Development)
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 4. Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Dokumentasi API**: http://localhost:5000/api-docs

## 🐳 Setup Docker (Alternatif)

### Dengan Docker Compose
```bash
# Build dan jalankan semua services
docker-compose up -d --build

# Akses aplikasi
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## 🧪 Menjalankan Tests

### Tests Backend
```bash
cd backend
npm test              # Jalankan semua tests
npm run test:watch    # Watch mode
npm run test:coverage # Dengan laporan coverage
```

### Tests Frontend
```bash
cd frontend
npm run dev         # Code linting
npm run build        # Build production
```

## 📚 Dokumentasi API

### Endpoints

#### Todos
- `GET /api/todos` - Dapatkan semua todos dengan filter & pagination
- `GET /api/todos/:id` - Dapatkan todo by ID
- `POST /api/todos` - Buat todo baru
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle status completed
- `DELETE /api/todos/:id` - Hapus todo

#### Categories
- `GET /api/categories` - Dapatkan semua categories
- `POST /api/categories` - Buat category baru
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Hapus category

### Contoh Request
```bash
# Buat todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Belajar TypeScript",
    "description": "Mempelajari dasar TypeScript",
    "category_id": 1,
    "priority": "high"
  }'
```

## ❓ Jawaban Pertanyaan Teknis

### Pertanyaan Desain Database

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
- Timestamps untuk melacak pembuatan dan update
- Color field untuk pembedaan visual

#### 2. Pagination dan Filtering di Database

**Implementasi Pagination:**
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

**Query Filtering:**
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

### Pertanyaan Keputusan Teknis

#### 1. Implementasi Desain Responsif

**Breakpoints yang Digunakan:**
```css
/* Mobile First Approach */
/* Perangkat kecil (landscape phones, 576px ke atas) */
@media (min-width: 576px) { ... }

/* Perangkat medium (tablets, 768px ke atas) */
@media (min-width: 768px) { ... }



```

**Adaptasi UI:**
- Mobile: Layout single column, sidebar collapsed
- Tablet: Layout dua kolom
- Desktop: Layout lengkap dengan sidebar expanded

**Komponen Ant Design:**
- `Grid` dan `Row/Col` untuk layout responsif
- `Table` dengan scroll responsif
- `Modal` yang menyesuaikan ukuran layar
- `Drawer` untuk navigasi mobile

#### 2. Struktur Komponen React

**Hierarki Komponen:**
```
App
├── Components
│   ├── CategoryManager
│   ├── Pagination
│   ├── SearchBar
│   ├── TodoForm
│   └── TodoList
```

**Manajemen State:**
```typescript
// Centralized state dengan React Context API
const { 
  todos, 
  filters, 
  setFilters, 
  pagination, 
  setPagination 
} = useTodo();
```

**State Filtering & Pagination:**
```typescript
interface FilterState {
  search: string;
  completed?: boolean;
  category_id?: number;
  priority?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
```

#### 3. Arsitektur Backend

**Struktur Folder:**
```
backend/
├── src/
│   ├── config/         # Konfigurasi database & environment
│   ├── controllers/    # Logic bisnis
│   ├── models/         # Model database
│   ├── routes/         # Rute API
│   ├── middleware/     # Middleware kustom
│   ├── utils/          # Fungsi utility
│   └── app.ts         # Inisialisasi aplikasi
├── migrations/         # Migrasi database
├── tests/             # Unit tests
└── package.json
```

**Penanganan Error:**
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

#### 4. Validasi Data

**Validasi Backend:**
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

**Validasi Frontend:**
```typescript
// Form validation dengan Ant Design
<Form.Item
  name="title"
  label="Judul Todo"
  rules={[
    { required: true, message: 'Masukkan judul todo!' },
    { min: 1, message: 'Judul minimal 1 karakter' },
    { max: 255, message: 'Judul tidak boleh lebih dari 255 karakter' }
  ]}
>
  <Input />
</Form.Item>
```

### Pertanyaan Testing & Kualitas

#### 1. Implementasi Unit Test

**Functions/Methods yang Di-test:**
- Endpoints API (GET, POST, PUT, DELETE)
- Operasi database (create, read, update, delete)
- Layanan business logic
- Fungsi utility

**Struktur Test:**
```javascript
describe('Todo API', () => {
  describe('GET /api/todos', () => {
    it('seharusnya mengembalikan semua todos', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
```

**Edge Cases:**
- Data input tidak valid
- Resource yang tidak ada
- Error koneksi database
- Kegagalan validasi

#### 2. Improvements untuk Masa Depan

**Technical Debt:**
- [ ] Implementasi sistem logging yang proper
- [ ] Tambahkan rate limiting untuk API
- [ ] Implementasi caching layer
- [ ] Tambahkan database connection pooling

**Improvement Fitur:**
- [ ] Autentikasi user & authorization
- [ ] Upload file untuk attachments
- [ ] Update real-time dengan WebSocket
- [ ] Fungsi export/import
- [ ] Reporting & analytics lanjutan

**Peluang Refactoring:**
- [ ] Ekstrak utility umum ke shared package
- [ ] Implementasi repository pattern untuk data access
- [ ] Tambahkan integration tests yang komprehensif
- [ ] Optimasi query database dengan advanced indexing

## 🎯 Implementasi React Context API

### Struktur Context yang Diimplementasikan

```typescript
// contexts/TodoContext.tsx
interface TodoState {
  todos: Todo[];
  categories: Category[];
  loading: boolean;
  pagination: PaginationState;
  filters: FilterState;
}

interface TodoContextType extends TodoState {
  // Data fetching
  fetchTodos: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  
  // CRUD operations
  addTodo: (data: TodoFormData) => Promise<void>;
  updateTodo: (id: number, data: Partial<TodoFormData>) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  
  // State management
  setFilters: (filters: Partial<FilterState>) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  
  // Category operations
  createCategory: (data: { name: string; color: string }) => Promise<void>;
  updateCategory: (id: number, data: { name: string; color: string }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}
```

### Keunggulan Implementasi Context API:
- ✅ **State terpusat** untuk seluruh aplikasi
- ✅ **Type safety** dengan TypeScript
- ✅ **Performance optimized** dengan useReducer
- ✅ **Clean separation** antara state logic dan UI components
- ✅ **Easy to use** dengan custom hook `useTodo()`

## 🔧 Sistem Filtering Lanjutan

### Fitur Filtering yang Diimplementasikan:
- ✅ **Pencarian teks** - berdasarkan judul dan deskripsi
- ✅ **Filter status** - semua, selesai, belum selesai
- ✅ **Filter kategori** - pilih berdasarkan kategori
- ✅ **Filter prioritas** - high, medium, low
- ✅ **Filter tanggal** - range tanggal dibuat
- ✅ **Sorting lanjutan** - berbagai opsi pengurutan
- ✅ **Visual filter tags** - tampilkan filter aktif
- ✅ **Clear all filters** - reset semua filter

## 📞 Support

Jika mengalami masalah saat setup, silakan:
1. Periksa logs di terminal untuk pesan error
2. Pastikan PostgreSQL berjalan dan database dibuat
3. Verifikasi environment variables sudah sesuai
4. Buka issue di GitHub repository
5. Hubungi email: stevcomp58@gmail.com

## 📄 License

MIT License

## 📁 Struktur File

```
todo-app/
├── README.md                 # File ini (dokumentasi fullstack)
├── backend/
│   ├── README.md            # Dokumentasi spesifik backend
│   └── ...
├── frontend/
│   ├── README.md            # Dokumentasi spesifik frontend  
│   └── ...
└── docker-compose.yml
```

---

