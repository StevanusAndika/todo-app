import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space, Tag } from 'antd';
import { Todo, TodoFormData } from '../types';
import { useTodo } from '../contexts/TodoContext';
import moment from 'moment';
import Swal from 'sweetalert2';

const { TextArea } = Input;
const { Option } = Select;

interface TodoFormProps {
  visible: boolean;
  onCancel: () => void;
  editingTodo?: Todo | null;
}

const TodoForm: React.FC<TodoFormProps> = ({ visible, onCancel, editingTodo }) => {
  const [form] = Form.useForm();
  const { addTodo, updateTodo, categories, loading } = useTodo();

  useEffect(() => {
    if (visible) {
      if (editingTodo) {
        form.setFieldsValue({
          ...editingTodo,
          due_date: editingTodo.due_date ? moment(editingTodo.due_date) : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingTodo, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const formData: TodoFormData = {
        title: values.title,
        description: values.description,
        category_id: values.category_id,
        priority: values.priority,
        due_date: values.due_date ? values.due_date.toISOString() : undefined,
      };

      if (editingTodo) {
        // Konfirmasi untuk edit
        const result = await Swal.fire({
          title: 'Update Todo?',
          html: `Anda akan mengupdate todo: <strong>"${editingTodo.title}"</strong>`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1890ff',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Ya, Update',
          cancelButtonText: 'Batal',
          reverseButtons: true,
          background: '#fff',
          customClass: {
            popup: 'sweet-alert-popup'
          }
        });

        if (result.isConfirmed) {
          await updateTodo(editingTodo.id, formData);
          await Swal.fire({
            title: 'Berhasil!',
            text: 'Todo berhasil diupdate',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          form.resetFields();
          onCancel();
        }
      } else {
        // Untuk create langsung simpan
        await addTodo(formData);
        await Swal.fire({
          title: 'Berhasil!',
          text: 'Todo baru berhasil dibuat',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        form.resetFields();
        onCancel();
      }
    } catch (error: any) {
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Gagal menyimpan todo. Periksa form Anda.',
        icon: 'error',
        confirmButtonColor: '#ff4d4f',
      });
    }
  };

  const handleCancel = () => {
    if (form.isFieldsTouched()) {
      Swal.fire({
        title: 'Batal Edit?',
        text: 'Perubahan yang belum disimpan akan hilang.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4d4f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Batal',
        cancelButtonText: 'Lanjut Edit',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          form.resetFields();
          onCancel();
        }
      });
    } else {
      form.resetFields();
      onCancel();
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#52c41a' },
    { value: 'medium', label: 'Medium', color: '#faad14' },
    { value: 'high', label: 'High', color: '#f5222d' },
  ];

  return (
    <Modal
      title={
        <Space>
          {editingTodo ? 'Edit Todo' : 'Buat Todo Baru'}
          {editingTodo && (
            <Tag color="blue">Editing: {editingTodo.title}</Tag>
          )}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Batal
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {editingTodo ? 'Update Todo' : 'Buat Todo'}
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priority: 'medium',
        }}
      >
        <Form.Item
          name="title"
          label="Judul Todo"
          rules={[
            { required: true, message: 'Masukkan judul todo' },
            { min: 3, message: 'Judul minimal 3 karakter' }
          ]}
        >
          <Input 
            placeholder="Apa yang ingin Anda lakukan?" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Deskripsi (Opsional)"
        >
          <TextArea
            rows={3}
            placeholder="Tambahkan deskripsi detail..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Space style={{ width: '100%' }} size="middle">
          <Form.Item
            name="category_id"
            label="Kategori"
            rules={[{ required: true, message: 'Pilih kategori' }]}
            style={{ flex: 1 }}
          >
            <Select 
              placeholder="Pilih Kategori" 
              size="large"
              optionLabelProp="label"
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id} label={category.name}>
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
          </Form.Item>

          <Form.Item
            name="priority"
            label="Prioritas"
            style={{ flex: 1 }}
          >
            <Select placeholder="Pilih Prioritas" size="large">
              {priorityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Space>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: option.color,
                      }}
                    />
                    {option.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Space>

        <Form.Item
          name="due_date"
          label="Tanggal Jatuh Tempo (Opsional)"
        >
          <DatePicker
            style={{ width: '100%' }}
            size="large"
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder="Pilih tanggal dan waktu"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodoForm;