import React, { useState, useEffect } from 'react';
import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import AppHeader from './components/AppHeader';
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList';
import DocumentManager from './components/DocumentManager';
import Statistics from './components/Statistics';
import Notes from './components/Notes';
import WebsiteNavigation from './components/WebsiteNavigation';
import Login from './components/Login';
import { storageService } from './utils/storage';
import './App.css';

const { Content, Sider } = Layout;

const App: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('navigation');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // 初始检查
    handleResize();

    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setSelectedMenu('navigation');
  };

  const handleLogout = () => {
    storageService.logout();
    setIsLoggedIn(false);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'navigation':
        return <WebsiteNavigation />;
      case 'todos':
        return <TodoList />;
      case 'documents':
        return <DocumentManager />;
      case 'notes':
        return <Notes />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return (
          <div style={{ padding: '24px' }}>
            <h2>系统设置</h2>
            <p>设置功能正在开发中...</p>
          </div>
        );
      default:
        return <WebsiteNavigation />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <AppHeader 
        collapsed={collapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          collapsedWidth={isMobile ? 0 : 80}
          style={{ 
            background: '#fff', 
            borderRight: '1px solid #f0f0f0',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            position: isMobile ? 'fixed' : 'relative',
            height: isMobile ? '100vh' : 'auto',
            zIndex: isMobile ? 1000 : 1,
            left: isMobile ? (collapsed ? -250 : 0) : 'auto',
            transition: 'all 0.2s',
          }}
        >
          <Sidebar 
            selectedKey={selectedMenu} 
            onMenuClick={setSelectedMenu}
            onLogout={handleLogout}
            collapsed={collapsed}
            isMobile={isMobile}
          />
        </Sider>
        
        {/* 移动端遮罩层 */}
        {isMobile && !collapsed && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={toggleSidebar}
          />
        )}
        
        <Content style={{ 
          background: '#f5f5f5', 
          padding: '0',
          overflow: 'auto',
          marginLeft: isMobile ? 0 : (collapsed ? 80 : 250),
          marginTop: isMobile ? '64px' : '0',
          transition: 'margin-left 0.2s, margin-top 0.2s',
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;