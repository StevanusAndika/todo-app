import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './models/index';
import todoRoutes from './routes/todos';
import categoryRoutes from './routes/categories';
import swaggerSpec from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS IMPLEMENTATION - TANPA MENGUBAH KODE LAIN
app.use(cors()); // Hanya ini, tanpa config
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Todo App API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 Server is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint - redirect to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Todo App API - Industrix Coding Challenge',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      health: 'GET /api/health',
      todos: 'GET /api/todos',
      categories: 'GET /api/categories'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. Visit /api-docs for documentation.'
  });
});

// Sync database dan start server
sequelize.sync().then(() => {
  console.log('✅ Database connected successfully');
  
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(' TODO APP BACKEND STARTED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log(` Server running on port ${PORT}`);
    console.log(` API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(`Todos API: http://localhost:${PORT}/api/todos`);
    console.log(`Categories API: http://localhost:${PORT}/api/categories`);
    console.log(`CORS Enabled for: http://localhost:3000`);
    console.log('='.repeat(60));
  });
}).catch(error => {
  console.error('❌ Database connection failed:', error);
});

export default app;