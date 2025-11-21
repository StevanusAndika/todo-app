import React, { useState } from 'react';
import { 
  Card, 
  List, 
  Tag, 
  Button, 
  Modal, 
  Form, 
  Input, 
  ColorPicker, 
  Space, 
  Empty,
  Tooltip 
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { Category } from '../types';
import { useTodo } from '../contexts/TodoContext';
import Swal from 'sweetalert2';

const CategoryManager: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { categories, createCategory, updateCategory, deleteCategory, todos } = useTodo();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        Swal.fire({
          title: 'Berhasil!',
          text: `Kategori "${values.name}" berhasil diupdate`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await createCategory(values);
        Swal.fire({
          title: 'Berhasil!',
          text: `Kategori "${values.name}" berhasil dibuat`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
      
      form.resetFields();
      setModalVisible(false);
      setEditingCategory(null);
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Gagal menyimpan kategori',
        icon: 'error',
        confirmButtonColor: '#ff4d4f',
      });
    }
  };

  const handleEdit = (category: Category) => {
    Swal.fire({
      title: 'Edit Kategori?',
      html: `Anda akan mengedit kategori: <strong>"${category.name}"</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1890ff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Edit',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      background: '#fff',
      customClass: {
        popup: 'sweet-alert-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingCategory(category);
        form.setFieldsValue(category);
        setModalVisible(true);
      }
    });
  };

  const handleDelete = async (category: Category) => {
    // Cek apakah kategori digunakan oleh todo
    const todosUsingCategory = todos.filter(todo => todo.category_id === category.id);
    
    if (todosUsingCategory.length > 0) {
      await Swal.fire({
        title: 'Tidak Dapat Dihapus',
        html: `
          <div style="text-align: left;">
            <p>Kategori <strong>"${category.name}"</strong> digunakan oleh <strong>${todosUsingCategory.length} todo</strong>.</p>
            <p style="color: #ffffff; font-size: 14px; margin-top: 10px;">
              ⚠️ Pindahkan todo ke kategori lain terlebih dahulu sebelum menghapus kategori ini.
            </p>
            ${todosUsingCategory.length > 0 ? `
              <div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 6px;">
                <strong>Todo yang menggunakan kategori ini:</strong>
                <ul style="margin: 8px 0; padding-left: 20px;">
                  ${todosUsingCategory.slice(0, 3).map(todo => 
                    `<li>${todo.title}</li>`
                  ).join('')}
                  ${todosUsingCategory.length > 3 ? `<li>... dan ${todosUsingCategory.length - 3} lainnya</li>` : ''}
                </ul>
              </div>
            ` : ''}
          </div>
        `,
        icon: 'error',
        confirmButtonColor: '#ff4d4f',
        confirmButtonText: 'Mengerti',
        width: 500
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Hapus Kategori?',
      html: `Kategori <strong>"${category.name}"</strong> akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      background: '#fff',
      customClass: {
        popup: 'sweet-alert-popup'
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(category.id);
        await Swal.fire({
          title: 'Terhapus!',
          text: `Kategori "${category.name}" berhasil dihapus.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error: any) {
        await Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Gagal menghapus kategori',
          icon: 'error',
          confirmButtonColor: '#ff4d4f',
        });
      }
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const getCategoryUsage = (categoryId: number) => {
    return todos.filter(todo => todo.category_id === categoryId).length;
  };

  return (
    <>
      <Card
        className="app-card"
        title={
          <Space>
            <span style={{ color: '#333333' }}>Manajemen Kategori</span>
            <Tag color="blue">{categories.length} Kategori</Tag>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
            size="middle"
          >
            Tambah Kategori
          </Button>
        }
        styles={{
          body: { padding: '16px' }
        }}
      >
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Empty
              description="Belum ada kategori"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleAdd}>
                Buat Kategori Pertama
              </Button>
            </Empty>
          </div>
        ) : (
          <List
            dataSource={categories}
            renderItem={category => {
              const usageCount = getCategoryUsage(category.id);
              const canDelete = usageCount === 0;
              
              return (
                <List.Item>
                  <Card
                    size="small"
                    className="app-card"
                    style={{ 
                      width: '100%', 
                      margin: '8px 0',
                      borderLeft: `4px solid ${category.color}` 
                    }}
                    styles={{
                      body: { padding: '16px' }
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <Space size="middle" wrap>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: category.color,
                              border: '2px solid rgba(255, 255, 255, 0.8)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '15px', color: '#333333' }}>
                              {category.name}
                            </div>
                            <Space size={8} style={{ marginTop: '4px' }}>
                              <Tag color={category.color} style={{ border: 'none', fontSize: '11px', margin: 0 }}>
                                {category.color}
                              </Tag>
                              <Tag color={usageCount > 0 ? 'green' : 'default'} style={{ fontSize: '11px', margin: 0 }}>
                                {usageCount} todo
                              </Tag>
                            </Space>
                          </div>
                        </div>
                      </Space>
                      
                      <Space size="small">
                        <Tooltip title="Edit Kategori">
                          <Button 
                            type="primary"
                            ghost
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(category)}
                            size="small"
                          >
                            <span className="mobile-hidden">Edit</span>
                          </Button>
                        </Tooltip>
                        
                        <Tooltip title={canDelete ? "Hapus Kategori" : "Tidak dapat dihapus karena digunakan oleh todo"}>
                          <Button 
                            type="primary"
                            danger
                            ghost
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDelete(category)}
                            size="small"
                            disabled={!canDelete}
                          >
                            <span className="mobile-hidden">Hapus</span>
                          </Button>
                        </Tooltip>
                      </Space>
                    </div>
                    
                    {!canDelete && (
                      <div style={{ 
                        marginTop: '8px', 
                        padding: '8px 12px', 
                        background: '#ff4d4f', 
                        border: '1px solid #ff4d4f',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#ffffff', // TEXT PUTIH
                        fontWeight: '500'
                      }}>
                        <ExclamationCircleOutlined style={{ marginRight: '4px', color: '#ffffff' }} />
                        Kategori ini digunakan oleh {usageCount} todo. Pindahkan todo ke kategori lain untuk menghapus.
                      </div>
                    )}
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      <Modal
        title={
          <Space>
            <span style={{ color: '#333333' }}>
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </span>
            {editingCategory && (
              <Tag color="blue">Editing: {editingCategory.name}</Tag>
            )}
          </Space>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={editingCategory ? 'Update' : 'Simpan'}
        cancelText="Batal"
        destroyOnClose={false}
        styles={{
          body: { padding: '20px 0' }
        }}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={<span style={{ color: '#333333' }}>Nama Kategori</span>}
            rules={[
              { required: true, message: 'Masukkan nama kategori' },
              { min: 2, message: 'Nama kategori minimal 2 karakter' },
              { max: 20, message: 'Nama kategori maksimal 20 karakter' }
            ]}
          >
            <Input 
              placeholder="Contoh: Work, Personal, Shopping..." 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="color"
            label={<span style={{ color: '#333333' }}>Warna Kategori</span>}
            rules={[{ required: true, message: 'Pilih warna untuk kategori' }]}
            initialValue="#1890ff"
          >
            <ColorPicker
              showText
              format="hex"
              presets={[
                {
                  label: 'Warna Recommended',
                  colors: [
                    '#1890ff', '#52c41a', '#faad14', '#f5222d',
                    '#722ed1', '#eb2f96', '#13c2c2', '#a0d911',
                    '#fa8c16', '#eb2f96', '#2f54eb', '#fa541c'
                  ],
                },
              ]}
              panelRender={(_, { components: { Presets } }) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Presets />
                </div>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryManager;