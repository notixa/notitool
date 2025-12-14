import React from 'react';
import { Layout, Menu, Dropdown, Button, Avatar } from 'antd';
import { 
  GlobalOutlined,
  CheckSquareOutlined, 
  FileOutlined, 
  BarChartOutlined,
  SettingOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { storageService } from '../utils/storage';

const { Sider } = Layout;

interface SidebarProps {
  selectedKey: string;
  onMenuClick: (key: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedKey, onMenuClick, onLogout }) => {
  const currentUser = storageService.getCurrentUser();
  
  const menuItems = [
    {
      key: 'navigation',
      icon: <GlobalOutlined />,
      label: '网站导航',
    },
    {
      key: 'todos',
      icon: <CheckSquareOutlined />,
      label: '待办事项',
    },
    {
      key: 'documents',
      icon: <FileOutlined />,
      label: '文档管理',
    },
    {
      key: 'notes',
      icon: <BookOutlined />,
      label: '笔记管理',
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: '统计分析',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: onLogout,
    },
  ];

  return (
    <Sider 
      width={250} 
      style={{ 
        background: '#fff', 
        borderRight: '1px solid #f0f0f0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button 
            type="text" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              style={{ marginBottom: '8px' }}
            />
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {currentUser?.username || '用户'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {currentUser?.email || ''}
            </div>
          </Button>
        </Dropdown>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => onMenuClick(key)}
        style={{ 
          height: 'calc(100% - 120px)', 
          borderRight: 0,
          paddingTop: '16px'
        }}
      />
    </Sider>
  );
};

export default Sidebar;