# Todo App Backend

Backend API untuk aplikasi Todo List yang dibangun dengan Node.js, Express, TypeScript, dan PostgreSQL.

## 🚀 Fitur

- ✅ Manajemen Todo (CRUD)
- ✅ Kategori Todo dengan warna
- ✅ Filter dan pencarian todo
- ✅ Prioritas todo (low, medium, high)
- ✅ Due date untuk todo
- ✅ Dokumentasi API dengan Swagger
- ✅ CORS enabled untuk frontend
- ✅ Database migration dengan Sequelize

## 🛠️ Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js dengan TypeScript
- **Database**: PostgreSQL dengan Sequelize ORM
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest & Supertest
- **Migration**: Sequelize CLI

## 📋 Prerequisites

- Node.js (v16 atau lebih tinggi)
- PostgreSQL
- npm atau yarn

## ⚙️ Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/StevanusAndika/todo-app
   cd todo-app/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Buat file `.env` di root directory:
   ```env
   DB_USER=postgres
   DB_PASSWORD=password
   DB_NAME=todo_app
   DB_HOST=localhost
   DB_PORT=5432
   PORT=5000
   NODE_ENV=development
   ```

4. **Setup Database**
   ```bash
   # Buat database di PostgreSQL
   createdb todo_app
   
   # Jalankan migrations
   npm run migrate:up
   ```

## 🚀 Menjalankan Aplikasi

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing
```bash
# Run semua tests
npm test

# Run tests dengan watch mode
npm run test:watch

# Run tests dengan coverage
npm run test:coverage

# Run tests spesifik
npm run test:categories
npm run test:todos
npm run test:health
```

## 📊 Database Migration & Seeding

```bash
# Buat migration baru
npx sequelize-cli migration:generate --name 

# Jalankan migrations
npm run migrate:up

# Rollback migration
npm run migrate:down

# Reset semua migrations
npm run migrate:reset

# Buat seed baru
npm run seed:create

# Jalankan semua seeds
npm run seed:up
```

## 📚 API Documentation

Setelah menjalankan server, buka: http://localhost:5000/api-docs

### Endpoints Utama

#### Todos
- `GET /api/todos` - Get semua todos dengan pagination & filter
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

#### Health Check
- `GET /api/health` - Check status server

## 🎯 Contoh Request

### Create Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Belajar TypeScript",
    "description": "Mempelajari dasar TypeScript",
    "category_id": 1,
    "priority": "high",
    "due_date": "2024-12-31T23:59:59.000Z"
  }'
```

### Create Category
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work",
    "color": "#3B82F6"
  }'
```

## 🗄️ Database Schema

### Categories Table
```sql
id: INTEGER (Primary Key)
name: STRING(100) (Unique)
color: STRING(7) (Default: #3B82F6)
created_at: TIMESTAMP
```

### Todos Table
```sql
id: INTEGER (Primary Key)
title: STRING(255) (Required)
description: TEXT
completed: BOOLEAN (Default: false)
category_id: INTEGER (Foreign Key)
priority: ENUM('low', 'medium', 'high') (Default: 'medium')
due_date: DATE
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

## 🧪 Testing

```bash
# Run semua tests
npm test

# Run tests dengan watch mode
npm run test:watch

# Run tests dengan coverage
npm run test:coverage

# Run tests untuk categories
npm run test:categories

# Run tests untuk todos
npm run test:todos

# Run tests untuk health check
npm run test:health
```

## 📁 Struktur Project

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Database configuration
│   │   └── swagger.ts       # Swagger documentation
│   ├── migrations/          # Database migrations
│   ├── models/              # Sequelize models
│   ├── routes/              # API routes
│   ├── tests/               # Test files
│   │   ├── categories.test.ts
│   │   ├── todos.test.ts
│   │   └── health.test.ts
│   └── app.ts              # Main application file
├── dist/                   # Compiled JavaScript files
├── .env                    # Environment variables
├── .sequelizerc           # Sequelize configuration
└── package.json
```

## 🔧 Scripts Available

- `npm run dev` - Jalankan development server dengan nodemon
- `npm run build` - Build project TypeScript ke JavaScript
- `npm start` - Jalankan production server
- `npm test` - Jalankan semua tests dengan Jest
- `npm run test:watch` - Jalankan tests dalam watch mode
- `npm run test:coverage` - Jalankan tests dengan coverage report
- `npm run migrate:up` - Jalankan database migrations
- `npm run migrate:down` - Rollback migration terakhir
- `npm run migrate:reset` - Reset semua database migrations
- `npm run migrate:create` - Buat migration file baru
- `npm run seed:create` - Buat seed file baru
- `npm run seed:up` - Jalankan semua seeders

## 📦 Dependencies

### Production Dependencies
- `bcryptjs` - Password hashing
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables management
- `express` - Web framework
- `pg` - PostgreSQL client
- `sequelize` - ORM for PostgreSQL
- `sequelize-typescript` - TypeScript support for Sequelize
- `swagger-jsdoc` - Swagger documentation generator
- `swagger-ui-express` - Swagger UI for Express

### Development Dependencies
- `@types/*` - TypeScript definitions
- `jest` - Testing framework
- `nodemon` - Development server with auto-reload
- `sequelize-cli` - Sequelize command line interface
- `supertest` - HTTP assertion testing
- `ts-jest` - TypeScript preprocessor for Jest
- `ts-node` - TypeScript execution for Node.js
- `typescript` - TypeScript compiler

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Stevanus Andika Galih Setiawan

## 🙏 Acknowledgments

- Express.js 
- Sequelize ORM 
- TypeScript 
- Jest testing framework 