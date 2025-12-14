import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { GithubOutlined, SettingOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

interface AppHeaderProps {
  onSettingsClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onSettingsClick }) => {
  return (
    <Header 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 24px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Title level={3} style={{ margin: 0, color: 'white' }}>
        🚀 NotiTool - 个人效率工具
      </Title>
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