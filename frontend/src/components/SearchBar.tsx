import React from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useTodo } from '../contexts/TodoContext';

const { Search } = Input;
const { Option } = Select;

const SearchBar: React.FC = () => {
  const { filters, setFilters, categories } = useTodo();

  const handleSearch = (value: string) => {
    setFilters({ search: value });
  };

  const handleStatusFilter = (value: string | null) => {
    setFilters({ 
      completed: value === 'all' ? undefined : value === 'completed' 
    });
  };

  const handleCategoryFilter = (value: number | null) => {
    setFilters({ category_id: value || undefined });
  };

  const handlePriorityFilter = (value: string | null) => {
    setFilters({ priority: value || undefined });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      completed: undefined,
      category_id: undefined,
      priority: undefined,
    });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Search
        placeholder="Search todos..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleSearch}
        defaultValue={filters.search}
        style={{ marginBottom: 16 }}
      />
      
      <Space wrap>
        <Select
          placeholder="Status"
          style={{ width: 120 }}
          onChange={handleStatusFilter}
          value={filters.completed === undefined ? 'all' : filters.completed ? 'completed' : 'pending'}
          allowClear
        >
          <Option value="all">All</Option>
          <Option value="completed">Completed</Option>
          <Option value="pending">Pending</Option>
        </Select>

        <Select
          placeholder="Category"
          style={{ width: 150 }}
          onChange={handleCategoryFilter}
          value={filters.category_id || undefined}
          allowClear
        >
          {categories.map(category => (
            <Option key={category.id} value={category.id}>
              <Space>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: category.color,
                  }}
                />
                {category.name}
              </Space>
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Priority"
          style={{ width: 120 }}
          onChange={handlePriorityFilter}
          value={filters.priority || undefined}
          allowClear
        >
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Select>

        <Button 
          icon={<FilterOutlined />} 
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </Space>
    </Space>
  );
};

export default SearchBar;