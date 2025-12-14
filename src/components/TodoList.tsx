import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, Tag, Space, Modal, Form, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { storageService, Todo } from '../utils/storage';

const { TextArea } = Input;
const { Option } = Select;

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [form] = Form.useForm();

  const categories = ['全部', '工作', '学习', '生活', '文档', '其他'];

  useEffect(() => {
    refreshTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [todos, selectedCategory]);

  const refreshTodos = () => {
    setTodos(storageService.getTodos());
  };

  const filterTodos = () => {
    if (selectedCategory === '全部') {
      setFilteredTodos(todos);
    } else {
      setFilteredTodos(todos.filter(todo => todo.category === selectedCategory));
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddTodo = () => {
    setEditingTodo(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    form.setFieldsValue(todo);
    setIsModalVisible(true);
  };

  const handleDeleteTodo = (id: string) => {
    if (storageService.deleteTodo(id)) {
      refreshTodos();
      message.success('待办事项删除成功！');
    }
  };

  const handleToggleComplete = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      storageService.updateTodo(id, { completed: !todo.completed });
      refreshTodos();
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingTodo) {
        storageService.updateTodo(editingTodo.id, values);
        message.success('待办事项更新成功！');
      } else {
        storageService.addTodo({
          ...values,
          completed: false
        });
        message.success('待办事项添加成功！');
      }
      refreshTodos();
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="content-container">
      <Card
        title="📝 待办事项"
        extra={
          <Space>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: 120 }}
              placeholder="选择分类"
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTodo}>
              添加待办
            </Button>
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <List
          dataSource={filteredTodos}
          locale={{ emptyText: '暂无待办事项，点击上方按钮添加' }}
          renderItem={(todo) => (
            <List.Item
              className={todo.completed ? 'todo-item-completed' : ''}
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditTodo(todo)}
                />,
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteTodo(todo.id)}
                />
              ]}
            >
              <List.Item.Meta
                title={
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      cursor: 'pointer',
                      color: todo.completed ? '#999' : '#262626'
                    }}
                    onClick={() => handleToggleComplete(todo.id)}
                  >
                    {todo.title}
                  </span>
                }
                description={
                  <Space>
                    <Tag color="blue" className="category-tag">{todo.category}</Tag>
                    {todo.description && (
                      <span style={{ color: '#666' }}>{todo.description}</span>
                    )}
                    <span style={{ color: '#999', fontSize: '12px' }}>
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={editingTodo ? '编辑待办事项' : '添加待办事项'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入待办事项标题" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入描述（可选）" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;