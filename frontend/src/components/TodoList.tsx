import React from 'react';
import { List, Card, Tag, Button, Space, Switch, Typography, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import type { Todo } from '../types';
import { useTodo } from '../contexts/TodoContext';

const { Text, Title } = Typography;

interface TodoListProps {
  onEdit: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onEdit }) => {
  const { todos, loading, toggleTodo, deleteTodo, categories } = useTodo();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const getCategory = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDelete = (todo: Todo) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${todo.title}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTodo(todo.id);
        Swal.fire(
          'Deleted!',
          'Your todo has been deleted.',
          'success'
        );
      }
    });
  };

  if (todos.length === 0 && !loading) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No todos found"
        style={{ margin: '40px 0' }}
      />
    );
  }

  return (
    <List
      loading={loading}
      dataSource={todos}
      renderItem={(todo) => {
        const category = getCategory(todo.category_id);
        
        return (
          <List.Item>
            <Card
              style={{ 
                width: '100%',
                opacity: todo.completed ? 0.7 : 1
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <Switch
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ flexShrink: 0 }}
                />
                
                <div style={{ flex: 1 }}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Title 
                      level={4} 
                      style={{ 
                        margin: 0,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#999' : 'inherit'
                      }}
                    >
                      {todo.title}
                    </Title>
                    
                    {todo.description && (
                      <Text type="secondary" style={{ display: 'block' }}>
                        {todo.description}
                      </Text>
                    )}
                    
                    <Space wrap>
                      <Tag color={getPriorityColor(todo.priority)}>
                        {todo.priority.toUpperCase()}
                      </Tag>
                      
                      {category && (
                        <Tag color={category.color}>
                          {category.name}
                        </Tag>
                      )}
                      
                      {todo.due_date && (
                        <Tag icon={<CalendarOutlined />}>
                          {formatDate(todo.due_date)}
                        </Tag>
                      )}
                    </Space>
                  </Space>
                </div>
                
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(todo)}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(todo)}
                  />
                </Space>
              </div>
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

export default TodoList;