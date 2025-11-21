import React from 'react';
import { Pagination as AntPagination } from 'antd';
import { useTodo } from '../contexts/TodoContext';

const Pagination: React.FC = () => {
  const { pagination, setPagination } = useTodo();

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      current: page,
      pageSize: pageSize || pagination.pageSize,
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginTop: 24,
      padding: '16px 0'
    }}>
      <AntPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger
        showQuickJumper
        showTotal={(total, range) => 
          `${range[0]}-${range[1]} of ${total} items`
        }
      />
    </div>
  );
};

export default Pagination;