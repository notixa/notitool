import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { GithubOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

interface AppHeaderProps {
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onSettingsClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile, 
  onSettingsClick 
}) => {
  return (
    <Header 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 24px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: isMobile ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {(isMobile || collapsed !== undefined) && (
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            style={{ 
              color: 'white',
              marginRight: '16px',
              fontSize: '18px'
            }}
            onClick={onToggle}
          />
        )}
        <Title level={3} style={{ margin: 0, color: 'white' }}>
          🚀 NotiTool - 个人效率工具
        </Title>
      </div>
      <Space>
        <Button 
          type="text" 
          icon={<SettingOutlined />} 
          style={{ color: 'white' }}
          onClick={onSettingsClick}
        >
          设置
        </Button>
        <Button 
          type="text" 
          icon={<GithubOutlined />} 
          style={{ color: 'white' }}
          onClick={() => window.open('https://github.com', '_blank')}
        >
          GitHub
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;