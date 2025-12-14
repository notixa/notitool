import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { CheckCircleOutlined, FileOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { storageService, Todo, Document } from '../utils/storage';

const Statistics: React.FC = () => {
  const todos = storageService.getTodos();
  const documents = storageService.getDocuments();
  
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = todos.length - completedTodos;
  const completionRate = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;
  
  const todoCategories = ['工作', '学习', '生活', '文档', '其他'];
  const categoryStats = todoCategories.map(category => ({
    category,
    count: todos.filter(todo => todo.category === category).length
  }));
  
  const documentTypes = ['PDF', 'Word', 'Excel', '文本', '其他'];
  const documentStats = documentTypes.map(type => ({
    type,
    count: documents.filter(doc => doc.type === type).length
  }));

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总待办事项"
              value={todos.length}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已完成"
              value={completedTodos}
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待完成"
              value={pendingTodos}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="文档总数"
              value={documents.length}
              prefix={<FileOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="完成进度" style={{ height: '100%' }}>
            <Progress
              type="circle"
              percent={Math.round(completionRate)}
              format={percent => `${percent}%`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p>您已经完成了 {completedTodos} 个待办事项</p>
              <p>还有 {pendingTodos} 个待办事项等待完成</p>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="待办分类统计" style={{ height: '100%' }}>
            {categoryStats.map(({ category, count }) => (
              <div key={category} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{category}</span>
                  <span>{count}</span>
                </div>
                <Progress
                  percent={todos.length > 0 ? Math.round((count / todos.length) * 100) : 0}
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card title="文档类型统计">
            <Row gutter={[16, 16]}>
              {documentStats.map(({ type, count }) => (
                <Col xs={24} sm={12} md={6} key={type}>
                  <Card size="small">
                    <Statistic
                      title={type}
                      value={count}
                      valueStyle={{ color: type === 'PDF' ? '#f5222d' : type === 'Word' ? '#1890ff' : type === 'Excel' ? '#52c41a' : '#722ed1' }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;