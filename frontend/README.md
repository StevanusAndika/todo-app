# Todo App - Frontend

Aplikasi Todo List frontend dibangun dengan React, TypeScript, dan Ant Design. Aplikasi ini menyediakan antarmuka yang responsif dan mudah digunakan untuk mengelola tugas sehari-hari.

## 🎥 Demo Aplikasi

<div align="center">

**📹 VIDEO DEMO: [Klik di sini untuk menonton demo aplikasi](https://drive.google.com/drive/folders/1yMX7zbBaRoZKShEgTwmGBHkZm5I5ZbH1)**

<img src="https://img.icons8.com/color/96/000000/video.png" alt="Video Icon" width="64"/>
<br>
*Klik link di atas untuk membuka video demo di Google Drive*

</div>

**Deskripsi Video:**
Video demo menunjukkan fitur-fitur utama aplikasi termasuk:
- ✅ Operasi CRUD (Buat, Baca, Update, Hapus) todo
- 🏷️ Manajemen kategori dengan warna kustom
- 🔍 Filtering dan pencarian real-time
- 📱 Desain responsif di berbagai ukuran layar
- ⚡ Update data secara real-time
-  😉Context API + efficient rendering
## ✨ Fitur Utama

- ✅ **Manajemen Todo** - Tambah, edit, hapus, dan ubah status todo
- 🏷️ **Kategori** - Kelola kategori dengan warna kustom
- 🔍 **Pencarian & Filter** - Filter berdasarkan status, kategori, dan prioritas
- 📱 **Desain Responsif** - Optimal di desktop, tablet, dan mobile
- 🎨 **UI Modern** - Menggunakan komponen Ant Design
- ⚡ **Update Real-time** - Perubahan langsung ter-refresh
- 📋 **Sorting** - Urutkan berdasarkan berbagai field
- 🗑️ **Konfirmasi** - SweetAlert2 untuk konfirmasi actions

## 🚀 Memulai Cepat

### Persyaratan
- Node.js 18+
- Backend API berjalan di `http://localhost:5000`

### Instalasi

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Setup environment** (opsional)
Buat file `.env` di folder `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=Todo App
```

3. **Jalankan development server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production

```bash
# Build aplikasi untuk production
npm run build
```

## 🏗️ Struktur Project

```
frontend/
├── src/
│   ├── components/
│   │   ├── CategoryManager.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TodoForm.tsx
│   │   └── TodoList.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── todo.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── tsconfig.json
```

## 🎯 Komponen Utama

### TodoList
Komponen utama untuk menampilkan daftar todos dengan fitur:
- Menampilkan list todos dengan status, prioritas, dan kategori
- Toggle status completed/uncompleted
- Edit dan hapus todo
- Layout card yang responsif

### TodoForm
Form untuk membuat dan mengedit todo dengan fields:
- Judul (wajib)
- Deskripsi
- Pemilihan kategori
- Pemilihan prioritas (rendah, sedang, tinggi)
- Picker tanggal jatuh tempo

### CategoryManager
Manajemen kategori dengan:
- Daftar kategori dengan warna kustom
- Form tambah/edit kategori
- Hapus kategori dengan validasi

### SearchBar
Komponen pencarian dan filtering dengan:
- Pencarian teks berdasarkan judul/deskripsi
- Filter berdasarkan status (semua, aktif, selesai)
- Filter berdasarkan kategori
- Sortir berdasarkan berbagai field
- Advanced filtering 


### Pagination
Komponen pagination untuk navigasi halaman:
- Navigasi halaman
- Pemilihan item per halaman
- Desain responsif

## 📱 Desain Responsif

Aplikasi didesain responsif dengan breakpoints:

### Mobile (< 576px)
- Layout single column
- Desain card compact
- Filter collapsed
- Tombol yang mudah disentuh

### Tablet (≥ 576px)
- Layout dua kolom untuk todo list
- Section filter yang expanded
- Komponen ukuran medium

## 🔧 Integrasi API

### Service API (api.ts)
```typescript
import axios from 'axios';
import type { Todo, TodosResponse, Category, TodoFormData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoAPI = {
  // Todos
  getTodos: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    completed?: boolean;
    category_id?: number;
    priority?: string;
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
```

### Definisi Tipe (todo.ts)
```typescript
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category_id?: number;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

interface TodoFormData {
  title: string;
  description?: string;
  category_id?: number;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
}

interface TodosResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

## 🎨 Komponen UI & Styling

Menggunakan **Ant Design** sebagai library komponen utama dengan styling kustom untuk:
- **Cards** - Menampilkan item todo
- **Modals** - Input form
- **Buttons** - Actions dan operations
- **Filters** - Kontrol pencarian dan filter
- **Pagination** - Navigasi halaman

## 🔄 Manajemen State

Manajemen state menggunakan React built-in hooks:
- `useState` untuk local component state
- `useEffect` untuk side effects dan API calls
- Props drilling untuk berbagi data antar komponen



### Error React Version Compatibility
```bash
# Periksa versi React yang terinstall
npm list react react-dom

# Jika perlu downgrade ke React 18:
npm install react@^18.2.0 react-dom@^18.2.0
```

## 📞 Troubleshooting Lainnya

Jika mengalami masalah:

1. **Periksa console browser** untuk pesan error detail
2. **Pastikan semua dependencies** ter-install dengan benar:
```bash
npm install
```
3. **Verifikasi environment variables** sudah sesuai
4. **Restart development server** jika diperlukan
5. **Pastikan backend server berjalan** sebelum frontend
6. **Hubungi**: stevcomp58@gmail.com jika ada error yang tidak bisa diselesaikan

## 🛠️ Development

```bash
# Development mode dengan hot reload
npm run dev

# Build production
npm run build
```

## 🔧 Perbaikan Umum

### Untuk error CORS:
1. Pastikan backend mengizinkan origin frontend
2. Check CORS configuration di backend

### Untuk error koneksi database:
1. Pastikan PostgreSQL berjalan
2. Check connection string di backend
3. Verifikasi migrations sudah dijalankan

---

**Catatan**: 
1. Pastikan backend server berjalan di port 5000 sebelum menjalankan frontend aplikasi
2. Video demo dapat diakses melalui link Google Drive di atas
3. Untuk masalah teknis, silakan hubungi: stevcomp58@gmail.com