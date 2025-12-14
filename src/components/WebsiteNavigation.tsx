import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Modal, 
  Form, 
  Select, 
  message, 
  Space, 
  Typography, 
  Row, 
  Col,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  DragOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { storageService } from '../utils/storage';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface WebsiteItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
  description?: string;
  position: number;
  createdAt: Date;
  userId: string;
}

interface PresetWebsite {
  name: string;
  url: string;
  icon: string;
  category: string;
  description: string;
}

const presetWebsites: PresetWebsite[] = [
  {
    name: 'Google',
    url: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico',
    category: '搜索引擎',
    description: '全球最大的搜索引擎'
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'https://github.com/favicon.ico',
    category: '开发工具',
    description: '全球最大的代码托管平台'
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    icon: 'https://stackoverflow.com/favicon.ico',
    category: '开发工具',
    description: '程序员问答社区'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com',
    icon: 'https://www.youtube.com/favicon.ico',
    category: '娱乐',
    description: '全球最大的视频分享平台'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: 'https://twitter.com/favicon.ico',
    category: '社交媒体',
    description: '微博客社交媒体平台'
  },
  {
    name: 'Bilibili',
    url: 'https://www.bilibili.com',
    icon: 'https://www.bilibili.com/favicon.ico',
    category: '娱乐',
    description: '中国领先的年轻人文化社区'
  },
  {
    name: '知乎',
    url: 'https://www.zhihu.com',
    icon: 'https://www.zhihu.com/favicon.ico',
    category: '知识',
    description: '综合性中文问答社区'
  },
  {
    name: '淘宝',
    url: 'https://www.taobao.com',
    icon: 'https://www.taobao.com/favicon.ico',
    category: '购物',
    description: '中国最大的网上购物平台'
  }
];

const categories = ['全部', '搜索引擎', '开发工具', '社交媒体', '娱乐', '购物', '知识', '新闻', '工具', '其他'];

// 可排序的网站卡片组件
const SortableWebsiteCard: React.FC<{
  website: WebsiteItem;
  onEdit: (website: WebsiteItem) => void;
  onDelete: (websiteId: string) => void;
  onOpen: (url: string) => void;
}> = ({ website, onEdit, onDelete, onOpen }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: website.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        hoverable
        size="small"
        style={{ 
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        bodyStyle={{ padding: '16px' }}
        onClick={() => onOpen(website.url)}
        actions={[
          <div key="drag" {...listeners} style={{ cursor: 'grab' }}>
            <Tooltip title="拖动排序">
              <DragOutlined />
            </Tooltip>
          </div>,
          <Tooltip key="edit" title="编辑">
            <EditOutlined onClick={(e) => { e.stopPropagation(); onEdit(website); }} />
          </Tooltip>,
          <Popconfirm
            key="delete"
            title="确定删除这个网站吗？"
            onConfirm={(e) => { e?.stopPropagation(); onDelete(website.id); }}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <DeleteOutlined onClick={(e) => e.stopPropagation()} />
            </Tooltip>
          </Popconfirm>,
        ]}
      >
        <div style={{ marginBottom: '8px' }}>
          <img 
            src={website.icon} 
            alt={website.name}
            style={{ 
              width: '48px', 
              height: '48px', 
              objectFit: 'cover',
              borderRadius: '8px'
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/48?text=🌐';
            }}
          />
        </div>
        <Title level={5} style={{ margin: '8px 0 4px 0', fontSize: '14px' }}>
          {website.name}
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {website.category}
        </Text>
        {website.description && (
          <Text 
            type="secondary" 
            style={{ 
              fontSize: '11px', 
              display: 'block',
              marginTop: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {website.description}
          </Text>
        )}
      </Card>
    </div>
  );
};

const WebsiteNavigation: React.FC = () => {
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<WebsiteItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<WebsiteItem | null>(null);
  const [presetModalVisible, setPresetModalVisible] = useState(false);
  const [form] = Form.useForm();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWebsites((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // 更新position字段并保存到存储
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          position: index
        }));

        // 批量更新存储
        const currentUser = storageService.getCurrentUser();
        if (currentUser) {
          updatedItems.forEach(site => storageService.updateWebsite(site));
        }

        return updatedItems;
      });
    }
  };

  useEffect(() => {
    loadWebsites();
  }, []);

  useEffect(() => {
    filterWebsites();
  }, [websites, selectedCategory]);

  const loadWebsites = () => {
    try {
      const currentUser = storageService.getCurrentUser();
      if (currentUser) {
        const userWebsites = storageService.getUserWebsites(currentUser.id);
        setWebsites(userWebsites.sort((a, b) => a.position - b.position));
      }
    } catch (error) {
      message.error('加载网站列表失败');
    }
  };

  const filterWebsites = () => {
    if (selectedCategory === '全部') {
      setFilteredWebsites(websites);
    } else {
      setFilteredWebsites(websites.filter(site => site.category === selectedCategory));
    }
  };

  const fetchFavicon = async (url: string): Promise<string> => {
    try {
      const domain = new URL(url).origin;
      return `${domain}/favicon.ico`;
    } catch {
      return 'https://via.placeholder.com/64?text=🌐';
    }
  };

  const handleAddWebsite = async (values: any) => {
    try {
      const currentUser = storageService.getCurrentUser();
      if (!currentUser) {
        message.error('请先登录');
        return;
      }

      const icon = values.icon || await fetchFavicon(values.url);
      const newWebsite: WebsiteItem = {
        id: Date.now().toString(),
        name: values.name,
        url: values.url,
        icon,
        category: values.category,
        description: values.description,
        position: websites.length,
        createdAt: new Date(),
        userId: currentUser.id
      };

      storageService.saveWebsite(newWebsite);
      setWebsites([...websites, newWebsite]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('网站添加成功');
    } catch (error) {
      message.error('添加网站失败');
    }
  };

  const handleEditWebsite = (website: WebsiteItem) => {
    setEditingWebsite(website);
    form.setFieldsValue(website);
    setIsModalVisible(true);
  };

  const handleUpdateWebsite = async (values: any) => {
    try {
      if (!editingWebsite) return;

      const icon = values.icon || editingWebsite.icon;
      const updatedWebsite: WebsiteItem = {
        ...editingWebsite,
        name: values.name,
        url: values.url,
        icon,
        category: values.category,
        description: values.description
      };

      storageService.updateWebsite(updatedWebsite);
      setWebsites(websites.map(site => site.id === updatedWebsite.id ? updatedWebsite : site));
      setIsModalVisible(false);
      setEditingWebsite(null);
      form.resetFields();
      message.success('网站更新成功');
    } catch (error) {
      message.error('更新网站失败');
    }
  };

  const handleDeleteWebsite = (websiteId: string) => {
    try {
      storageService.deleteWebsite(websiteId);
      setWebsites(websites.filter(site => site.id !== websiteId));
      message.success('网站删除成功');
    } catch (error) {
      message.error('删除网站失败');
    }
  };

  const handleAddPresetWebsite = (preset: PresetWebsite) => {
    try {
      const currentUser = storageService.getCurrentUser();
      if (!currentUser) {
        message.error('请先登录');
        return;
      }

      const newWebsite: WebsiteItem = {
        id: Date.now().toString(),
        name: preset.name,
        url: preset.url,
        icon: preset.icon,
        category: preset.category,
        description: preset.description,
        position: websites.length,
        createdAt: new Date(),
        userId: currentUser.id
      };

      storageService.saveWebsite(newWebsite);
      setWebsites([...websites, newWebsite]);
      message.success(`已添加 ${preset.name}`);
    } catch (error) {
      message.error('添加预设网站失败');
    }
  };

  

  const openWebsite = (url: string) => {
    // 确保URL格式正确
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          <GlobalOutlined /> 网站导航
        </Title>
        <Space>
          <Button 
            icon={<PlusOutlined />} 
            onClick={() => setPresetModalVisible(true)}
          >
            添加常用网站
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
          >
            添加网站
          </Button>
        </Space>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Space wrap>
          {categories.map(category => (
            <Button
              key={category}
              type={selectedCategory === category ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </Space>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredWebsites.map(site => site.id)} strategy={verticalListSortingStrategy}>
          <Row gutter={[16, 16]}>
            {filteredWebsites.map((website) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={website.id}>
                <SortableWebsiteCard
                  website={website}
                  onEdit={handleEditWebsite}
                  onDelete={handleDeleteWebsite}
                  onOpen={openWebsite}
                />
              </Col>
            ))}
          </Row>
        </SortableContext>
      </DndContext>

      {filteredWebsites.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <GlobalOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">暂无网站，点击上方按钮添加网站</Text>
          </div>
        </div>
      )}

      <Modal
        title={editingWebsite ? '编辑网站' : '添加网站'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingWebsite(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingWebsite ? handleUpdateWebsite : handleAddWebsite}
        >
          <Form.Item
            name="name"
            label="网站名称"
            rules={[{ required: true, message: '请输入网站名称' }]}
          >
            <Input placeholder="请输入网站名称" />
          </Form.Item>

          <Form.Item
            name="url"
            label="网站地址"
            rules={[
              { required: true, message: '请输入网站地址' },
              { type: 'url', message: '请输入有效的URL' }
            ]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="图标地址"
          >
            <Input placeholder="留空则自动获取网站图标" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.filter(cat => cat !== '全部').map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入网站描述（可选）" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingWebsite ? '更新' : '添加'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingWebsite(null);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加常用网站"
        open={presetModalVisible}
        onCancel={() => setPresetModalVisible(false)}
        footer={null}
        width={800}
      >
        <Row gutter={[16, 16]}>
          {presetWebsites.map((preset) => (
            <Col span={8} key={preset.name}>
              <Card
                hoverable
                size="small"
                onClick={() => handleAddPresetWebsite(preset)}
                style={{ textAlign: 'center', cursor: 'pointer' }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <img 
                    src={preset.icon} 
                    alt={preset.name}
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <Title level={5} style={{ margin: '8px 0 4px 0', fontSize: '14px' }}>
                  {preset.name}
                </Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {preset.category}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default WebsiteNavigation;