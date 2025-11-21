import React, { useState } from 'react';
import { 
  Input, 
  Select, 
  Space, 
  Button, 
  DatePicker, 
  Card,
  Collapse,
  Tag,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined,
  CalendarOutlined,
  SortAscendingOutlined 
} from '@ant-design/icons';
import { useTodo } from '../contexts/TodoContext';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const SearchBar: React.FC = () => {
  const { filters, setFilters, categories } = useTodo();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handler untuk berbagai jenis filter
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

  const handleDateRangeFilter = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setFilters({
        start_date: dates[0].startOf('day').toISOString(),
        end_date: dates[1].endOf('day').toISOString(),
      });
    } else {
      setFilters({
        start_date: undefined,
        end_date: undefined,
      });
    }
  };

  const handleSortChange = (value: string) => {
    const [sort_by, sort_order] = value.split('_');
    setFilters({ sort_by, sort_order: sort_order as 'asc' | 'desc' });
  };

  // Clear semua filter
  const clearAllFilters = () => {
    setFilters({
      search: '',
      completed: undefined,
      category_id: undefined,
      priority: undefined,
      start_date: undefined,
      end_date: undefined,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    setShowAdvanced(false);
  };

  // Cek apakah ada filter aktif
  const hasActiveFilters = 
    filters.search || 
    filters.completed !== undefined || 
    filters.category_id || 
    filters.priority || 
    filters.start_date || 
    filters.end_date;

  // Hitung jumlah filter aktif
  const activeFilterCount = [
    filters.search,
    filters.completed !== undefined,
    filters.category_id,
    filters.priority,
    filters.start_date,
    filters.end_date,
  ].filter(Boolean).length;

  // Options untuk sorting
  const sortOptions = [
    { value: 'created_at_desc', label: 'Terbaru' },
    { value: 'created_at_asc', label: 'Terlama' },
    { value: 'title_asc', label: 'Judul A-Z' },
    { value: 'title_desc', label: 'Judul Z-A' },
    { value: 'priority_desc', label: 'Prioritas Tinggi' },
    { value: 'priority_asc', label: 'Prioritas Rendah' },
    { value: 'due_date_asc', label: 'Deadline Terdekat' },
    { value: 'due_date_desc', label: 'Deadline Jauh' },
  ];

  // Convert string dates to Dayjs objects for RangePicker value
  const getRangePickerValue = (): [Dayjs | null, Dayjs | null] => {
    if (filters.start_date && filters.end_date) {
      return [dayjs(filters.start_date), dayjs(filters.end_date)];
    }
    return [null, null];
  };

  return (
    <Card 
      size="small" 
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Search Bar Utama */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Search
            placeholder="Cari todos berdasarkan judul atau deskripsi..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            defaultValue={filters.search}
            style={{ flex: 1 }}
          />
          
          <Tooltip title="Filter Lanjutan">
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setShowAdvanced(!showAdvanced)}
              type={showAdvanced ? "primary" : "default"}
            >
              Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </Tooltip>

          {hasActiveFilters && (
            <Tooltip title="Clear Semua Filter">
              <Button 
                icon={<ClearOutlined />} 
                onClick={clearAllFilters}
                danger
              >
                Clear
              </Button>
            </Tooltip>
          )}
        </div>

        {/* Filter Dasar */}
        <Space wrap style={{ width: '100%' }}>
          <Select
            placeholder="Status"
            style={{ width: 140 }}
            onChange={handleStatusFilter}
            value={filters.completed === undefined ? 'all' : filters.completed ? 'completed' : 'pending'}
            allowClear
          >
            <Option value="all">Semua Status</Option>
            <Option value="completed">Selesai</Option>
            <Option value="pending">Belum Selesai</Option>
          </Select>

          <Select
            placeholder="Kategori"
            style={{ width: 160 }}
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
            placeholder="Prioritas"
            style={{ width: 130 }}
            onChange={handlePriorityFilter}
            value={filters.priority || undefined}
            allowClear
          >
            <Option value="high">
              <Tag color="red">High</Tag>
            </Option>
            <Option value="medium">
              <Tag color="orange">Medium</Tag>
            </Option>
            <Option value="low">
              <Tag color="green">Low</Tag>
            </Option>
          </Select>

          <Select
            placeholder="Urutkan"
            style={{ width: 190 }}
            onChange={handleSortChange}
            value={`${filters.sort_by}_${filters.sort_order}`}
            suffixIcon={<SortAscendingOutlined />}
          >
            {sortOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Space>

        {/* Filter Lanjutan */}
        {showAdvanced && (
          <Collapse 
            defaultActiveKey={['1']}
            ghost
            style={{ background: '#000000ff', borderRadius: '8px' }}
          >
            <Panel 
              header={
                <Space>
                  <FilterOutlined />
                  <span>Filter Lanjutan</span>
                  <Tag color="blue">Date Range</Tag>
                </Space>
              } 
              key="1"
            >
              <Space direction="vertical" style={{ width: '100%', color: '#000000ff' }} size="middle">
                <div>
                  <strong style={{ marginBottom: '8px', display: 'block' }}>
                    <CalendarOutlined /> Filter Berdasarkan Tanggal Dibuat:
                  </strong>
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    placeholder={['Tanggal Mulai', 'Tanggal Akhir']}
                    onChange={handleDateRangeFilter}
                    value={getRangePickerValue()}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Filter todos berdasarkan range tanggal dibuat
                  </div>
                </div>

                {/* Display Active Filters */}
                {hasActiveFilters && (
                  <div>
                    <strong style={{ marginBottom: '8px', display: 'block' }}>
                      Filter Aktif:
                    </strong>
                    <Space wrap>
                      {filters.search && (
                        <Tag closable onClose={() => setFilters({ search: '' })}>
                          Pencarian: "{filters.search}"
                        </Tag>
                      )}
                      {filters.completed !== undefined && (
                        <Tag 
                          closable 
                          onClose={() => setFilters({ completed: undefined })}
                          color={filters.completed ? 'green' : 'orange'}
                        >
                          Status: {filters.completed ? 'Selesai' : 'Belum Selesai'}
                        </Tag>
                      )}
                      {filters.category_id && (
                        <Tag 
                          closable 
                          onClose={() => setFilters({ category_id: undefined })}
                          color={categories.find(c => c.id === filters.category_id)?.color}
                        >
                          Kategori: {categories.find(c => c.id === filters.category_id)?.name}
                        </Tag>
                      )}
                      {filters.priority && (
                        <Tag 
                          closable 
                          onClose={() => setFilters({ priority: undefined })}
                          color={
                            filters.priority === 'high' ? 'red' : 
                            filters.priority === 'medium' ? 'orange' : 'green'
                          }
                        >
                          Prioritas: {filters.priority}
                        </Tag>
                      )}
                      {filters.start_date && filters.end_date && (
                        <Tag 
                          closable 
                          onClose={() => setFilters({ start_date: undefined, end_date: undefined })}
                          color="blue"
                        >
                          Tanggal: {dayjs(filters.start_date).format('DD MMM')} - {dayjs(filters.end_date).format('DD MMM YYYY')}
                        </Tag>
                      )}
                    </Space>
                  </div>
                )}
              </Space>
            </Panel>
          </Collapse>
        )}
      </Space>
    </Card>
  );
};

export default SearchBar;