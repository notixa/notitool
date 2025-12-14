import React, { useState, useEffect } from 'react';
import { Card, Upload, Button, List, Tag, Space, Modal, Input, Select, message, Tree, Dropdown, Menu } from 'antd';
import { 
  UploadOutlined, 
  FileOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { storageService, Document, Folder } from '../utils/storage';
import DocumentReader from './DocumentReader';

const { Option } = Select;
const { Search } = Input;

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<(Folder & { children: Folder[] })[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isReaderVisible, setIsReaderVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [contextMenuDocument, setContextMenuDocument] = useState<Document | null>(null);

  const categories = ['全部', 'PDF', 'Word', 'Excel', '文本', '其他'];

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    refreshDocuments();
  }, [selectedFolder]);

  const refreshData = () => {
    refreshDocuments();
    refreshFolders();
  };

  const refreshDocuments = () => {
    setDocuments(storageService.getDocumentsByFolder(selectedFolder));
  };

  const refreshFolders = () => {
    setFolders(storageService.getFolderTree());
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const fileData = e.target?.result as string;
      const base64Data = fileData.split(',')[1]; // 移除data:mime;base64,前缀
      
      let content = '';
      if (getFileType(file.name) === '文本') {
        // 对于文本文件，存储可读内容用于预览
        const textReader = new FileReader();
        textReader.onload = (textEvent) => {
          content = textEvent.target?.result as string;
          saveDocument(file, base64Data, content);
        };
        textReader.readAsText(file);
      } else {
        // 对于其他文件类型，只存储基本信息
        content = `${getFileType(file.name)}文件 - ${(file.size / 1024).toFixed(2)} KB`;
        saveDocument(file, base64Data, content);
      }
    };

    reader.readAsDataURL(file);
    return false; // 阻止默认上传行为
  };

  const saveDocument = (file: File, fileData: string, content: string) => {
    try {
      storageService.addDocument({
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        category: getFileCategory(file.name),
        content: content.substring(0, 1000),
        fileData: fileData,
        folderId: selectedFolder
      });
      
      refreshDocuments();
      message.success('文档上传成功！');
    } catch (error) {
      message.error('文档上传失败');
    }
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'PDF';
      case 'doc':
      case 'docx': return 'Word';
      case 'xls':
      case 'xlsx': return 'Excel';
      case 'txt': return '文本';
      default: return '其他';
    }
  };

  const getFileCategory = (filename: string): string => {
    return getFileType(filename);
  };

  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewVisible(true);
  };

  const handleDelete = (id: string) => {
    if (storageService.deleteDocument(id)) {
      refreshDocuments();
      message.success('文档删除成功！');
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      message.error('请输入文件夹名称');
      return;
    }
    
    try {
      storageService.addFolder(newFolderName.trim(), selectedFolder);
      refreshFolders();
      setNewFolderName('');
      setIsCreateFolderModalVisible(false);
      message.success('文件夹创建成功！');
    } catch (error) {
      message.error('文件夹创建失败');
    }
  };

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolder(folderId);
  };

  const handleReadDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsReaderVisible(true);
  };

  const handleMoveDocument = (documentId: string, folderId: string | null) => {
    if (storageService.moveDocumentToFolder(documentId, folderId)) {
      refreshDocuments();
      message.success('文档移动成功！');
    } else {
      message.error('文档移动失败');
    }
  };

  const renderFolderTree = (folders: (Folder & { children: Folder[] })[]): any[] => {
    return folders.map(folder => ({
      title: folder.name,
      key: folder.id,
      icon: <FolderOutlined />,
      children: folder.children.length > 0 ? renderFolderTree(folder.children) : undefined,
      onClick: () => handleFolderSelect(folder.id)
    }));
  };

  const getDocumentMenu = (document: Document) => (
    <Menu>
      <Menu.Item
        key="read"
        icon={<EyeOutlined />}
        onClick={() => handleReadDocument(document)}
      >
        阅读
      </Menu.Item>
      <Menu.Item
        key="preview"
        icon={<EyeOutlined />}
        onClick={() => handlePreview(document)}
      >
        预览
      </Menu.Item>
      <Menu.SubMenu
        key="move"
        title="移动到文件夹"
        icon={<SwapOutlined />}
      >
        <Menu.Item
          key="root"
          onClick={() => handleMoveDocument(document.id, null)}
        >
          根目录
        </Menu.Item>
        {folders.map(folder => (
          <Menu.Item
            key={folder.id}
            onClick={() => handleMoveDocument(document.id, folder.id)}
          >
            {folder.name}
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDelete(document.id)}
      >
        删除
      </Menu.Item>
    </Menu>
  );

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="content-container">
      <Card
        title="📁 文档管理"
        extra={
          <Space>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => setIsCreateFolderModalVisible(true)}
            >
              新建文件夹
            </Button>
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              multiple
            >
              <Button icon={<UploadOutlined />}>上传文档</Button>
            </Upload>
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* 文件夹树 */}
          <div style={{ width: '250px', borderRight: '1px solid #f0f0f0', paddingRight: '16px' }}>
            <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>文件夹</div>
            <Tree
              showIcon
              treeData={[
                {
                  title: '根目录',
                  key: 'root',
                  icon: <FolderOpenOutlined />,
                  selected: selectedFolder === null,
                  onClick: () => handleFolderSelect(null),
                  children: renderFolderTree(folders)
                }
              ]}
              style={{ background: 'transparent' }}
            />
          </div>

          {/* 文档列表 */}
          <div style={{ flex: 1 }}>
            <Space style={{ marginBottom: '16px', width: '100%' }}>
              <Search
                placeholder="搜索文档..."
                allowClear
                enterButton
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
              />
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: '150px' }}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Space>

        <List
              dataSource={filteredDocuments}
              locale={{ emptyText: '暂无文档，点击上方按钮上传' }}
              renderItem={(doc) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => handleReadDocument(doc)}
                    >
                      阅读
                    </Button>,
                    <Dropdown overlay={getDocumentMenu(doc)} trigger={['click']}>
                      <Button type="link" icon={<MoreOutlined />}>
                        更多
                      </Button>
                    </Dropdown>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FileOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                    title={
                      <Space>
                        <span 
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleReadDocument(doc)}
                        >
                          {doc.name}
                        </span>
                        <Tag color="blue" className="category-tag">{doc.type}</Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <span>大小: {(doc.size / 1024).toFixed(2)} KB</span>
                        <span>上传时间: {new Date(doc.uploadTime).toLocaleString()}</span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </Card>

      <Modal
        title="文档预览"
        visible={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedDocument && (
          <div>
            <p><strong>文件名:</strong> {selectedDocument.name}</p>
            <p><strong>类型:</strong> {selectedDocument.type}</p>
            <p><strong>大小:</strong> {(selectedDocument.size / 1024).toFixed(2)} KB</p>
            <div className="document-preview">
              {selectedDocument.content || '无法预览此文件类型'}
            </div>
          </div>
        )}
      </Modal>

      {/* 创建文件夹模态框 */}
      <Modal
        title="新建文件夹"
        open={isCreateFolderModalVisible}
        onOk={handleCreateFolder}
        onCancel={() => {
          setIsCreateFolderModalVisible(false);
          setNewFolderName('');
        }}
        okText="创建"
        cancelText="取消"
      >
        <Input
          placeholder="请输入文件夹名称"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onPressEnter={handleCreateFolder}
        />
      </Modal>

      {/* 文档阅读器 */}
      <DocumentReader
        visible={isReaderVisible}
        document={selectedDocument}
        onClose={() => {
          setIsReaderVisible(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
};

export default DocumentManager;