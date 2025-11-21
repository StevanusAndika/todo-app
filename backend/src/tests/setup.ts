import { sequelize } from '../models/index';
import { Category, Todo } from '../models/index';

beforeAll(async () => {
  console.log('🔄 Setting up tests...');
  
  // Clear semua data
  await Todo.destroy({ where: {} });
  await Category.destroy({ where: {} });
  
  // Insert base categories dengan ID yang konsisten
  await Category.bulkCreate([
    { id: 1, name: 'TestWork', color: '#3B82F6' },
    { id: 2, name: 'TestPersonal', color: '#10B981' },
    { id: 3, name: 'TestShopping', color: '#F59E0B' },
    { id: 4, name: 'TestHealth', color: '#EF4444' }
  ], { ignoreDuplicates: true });
  
  console.log('✅ Test data setup completed');
});

beforeEach(async () => {
  // Clear hanya todos sebelum setiap test
  await Todo.destroy({ where: {} });
});

afterAll(async () => {
  // Jangan cleanup, biarkan data untuk development
  console.log('✅ All tests completed');
});