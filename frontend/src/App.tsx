import React, { useState } from 'react';
import { Layout, Typography, Button, Space, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TodoProvider, useTodo } from './contexts/TodoContext';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import CategoryManager from './components/CategoryManager';
import { Todo } from './types';
import './styles/App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppContent: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [activeTab, setActiveTab] = useState('todos');

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setEditingTodo(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Todo App
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setFormVisible(true)}
            size="large"
          >
            New Todo
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'todos',
              label: 'Todos',
              children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <SearchBar />
                  <TodoList onEdit={handleEdit} />
                  <Pagination />
                </Space>
              ),
            },
            {
              key: 'categories',
              label: 'Categories',
              children: <CategoryManager />,
            },
          ]}
        />
      </Content>

      <TodoForm
        visible={formVisible}
        onCancel={handleFormClose}
        editingTodo={editingTodo}
      />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
};

export default App;