import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, Tag, Space, Modal, Form, Select, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { storageService, Note } from '../utils/storage';

const { TextArea } = Input;
const { Option } = Select;

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [form] = Form.useForm();

  const categories = ['全部', '工作', '学习', '生活', '技术', '灵感', '其他'];

  useEffect(() => {
    refreshNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, selectedCategory]);

  const refreshNotes = () => {
    setNotes(storageService.getNotes());
  };

  const filterNotes = () => {
    if (selectedCategory === '全部') {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(notes.filter(note => note.category === selectedCategory));
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    form.setFieldsValue({
      ...note,
      tags: note.tags.join(', ')
    });
    setIsModalVisible(true);
  };

  const handlePreviewNote = (note: Note) => {
    setPreviewNote(note);
    setIsPreviewVisible(true);
  };

  const handleDeleteNote = (id: string) => {
    if (storageService.deleteNote(id)) {
      refreshNotes();
      message.success('笔记删除成功！');
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const tags = values.tags ? values.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];
      
      if (editingNote) {
        storageService.updateNote(editingNote.id, {
          ...values,
          tags
        });
        message.success('笔记更新成功！');
      } else {
        storageService.addNote({
          ...values,
          tags
        });
        message.success('笔记添加成功！');
      }
      refreshNotes();
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="content-container">
      <Card
        title="📚 笔记管理"
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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNote}>
              添加笔记
            </Button>
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <List
          dataSource={filteredNotes}
          locale={{ emptyText: '暂无笔记，点击上方按钮添加' }}
          renderItem={(note) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreviewNote(note)}
                >
                  预览
                </Button>,
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditNote(note)}
                >
                  编辑
                </Button>,
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteNote(note.id)}
                >
                  删除
                </Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <span style={{ textDecoration: note.title ? 'none' : 'line-through' }}>
                      {note.title || '无标题'}
                    </span>
                    <Tag color="blue">{note.category}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      {note.content ? note.content.substring(0, 100) + '...' : '无内容'}
                    </div>
                    <Space wrap>
                      {note.tags.map((tag, index) => (
                        <Tag key={index} color="green" style={{ fontSize: '12px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                      创建时间: {new Date(note.createdAt).toLocaleString()}
                      {note.updatedAt !== note.createdAt && (
                        <span> • 更新时间: {new Date(note.updatedAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 添加/编辑笔记模态框 */}
      <Modal
        title={editingNote ? '编辑笔记' : '添加笔记'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入笔记标题' }]}
              >
                <Input placeholder="笔记标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select placeholder="选择分类">
                  {categories.filter(cat => cat !== '全部').map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="content"
            label="内容 (支持 Markdown 格式)"
            rules={[{ required: true, message: '请输入笔记内容' }]}
          >
            <TextArea
              rows={12}
              placeholder="支持 Markdown 语法，如 # 标题、**粗体**、*斜体*、[链接](url) 等"
            />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
          >
            <Input placeholder="用逗号分隔多个标签，如: React, TypeScript, 前端" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 预览笔记模态框 */}
      <Modal
        title={`预览: ${previewNote?.title}`}
        visible={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {previewNote && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <Tag color="blue">{previewNote.category}</Tag>
                {previewNote.tags.map((tag, index) => (
                  <Tag key={index} color="green">
                    {tag}
                  </Tag>
                ))}
              </Space>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                创建时间: {new Date(previewNote.createdAt).toLocaleString()}
                {previewNote.updatedAt !== previewNote.createdAt && (
                  <span> • 更新时间: {new Date(previewNote.updatedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px', 
              padding: '16px',
              minHeight: '300px',
              background: '#fafafa'
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {previewNote.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Notes;