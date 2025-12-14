import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
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

const { Content } = Layout;

const App: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('navigation');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setSelectedMenu('navigation');
  };

  const handleLogout = () => {
    storageService.logout();
    setIsLoggedIn(false);
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
      <AppHeader />
      <Layout>
        <Sidebar 
          selectedKey={selectedMenu} 
          onMenuClick={setSelectedMenu}
          onLogout={handleLogout}
        />
        <Content style={{ 
          background: '#f5f5f5', 
          padding: '0',
          overflow: 'auto'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;