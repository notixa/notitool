import React, { useState, useEffect } from 'react';
import { Modal, Button, Spin, Alert, Typography, Space } from 'antd';
import { DownloadOutlined, FullscreenOutlined, FullscreenExitOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Document } from '../utils/storage';

const { Title, Text } = Typography;

interface DocumentReaderProps {
  visible: boolean;
  document: Document | null;
  onClose: () => void;
}

const DocumentReader: React.FC<DocumentReaderProps> = ({ visible, document, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (visible && document) {
      loadDocument();
    }
    setZoom(100);
    setError(null);
  }, [visible, document]);

  const loadDocument = () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!document?.fileData) {
        throw new Error('文档数据不存在');
      }
      setLoading(false);
    } catch (err) {
      setError('加载文档失败');
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleDownload = () => {
    if (!document?.fileData) return;
    
    try {
      const byteCharacters = atob(document.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: getContentType(document.type) });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('下载失败');
    }
  };

  const getContentType = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'word':
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'excel':
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'text':
      case 'txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  };

  const renderDocumentContent = () => {
    if (!document) return null;

    const contentStyle = {
      width: '100%',
      height: isFullscreen ? 'calc(100vh - 200px)' : '600px',
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      overflow: 'auto',
      transform: `scale(${zoom / 100})`,
      transformOrigin: 'top left'
    };

    switch (document.type.toLowerCase()) {
      case 'pdf':
        if (document.fileData) {
          const pdfUrl = `data:application/pdf;base64,${document.fileData}`;
          return (
            <iframe
              src={pdfUrl}
              style={contentStyle}
              title="PDF预览"
            />
          );
        }
        return <Alert message="PDF数据不可用" type="error" />;

      case 'text':
      case 'txt':
        return (
          <div
            style={{
              ...contentStyle,
              padding: '16px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          >
            {document.content || '无内容'}
          </div>
        );

      case 'word':
      case 'doc':
      case 'docx':
        if (document.fileData) {
          const docUrl = `data:${getContentType(document.type)};base64,${document.fileData}`;
          return (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docUrl)}`}
              style={contentStyle}
              title="Word文档预览"
            />
          );
        }
        return <Alert message="Word文档预览不可用，请下载查看" type="info" />;

      case 'excel':
      case 'xls':
      case 'xlsx':
        if (document.fileData) {
          const excelUrl = `data:${getContentType(document.type)};base64,${document.fileData}`;
          return (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(excelUrl)}`}
              style={contentStyle}
              title="Excel文档预览"
            />
          );
        }
        return <Alert message="Excel文档预览不可用，请下载查看" type="info" />;

      default:
        return (
          <div style={contentStyle}>
            <Alert message="不支持的文件类型，请下载查看" type="warning" />
          </div>
        );
    }
  };

  return (
    <Modal
      title={
        <Space>
          <span>文档阅读器</span>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {document?.name}
          </Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={isFullscreen ? '100vw' : 1000}
      style={{ top: isFullscreen ? 0 : 20 }}
      footer={[
        <Space key="actions">
          <Button
            icon={<ZoomOutOutlined />}
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            缩小
          </Button>
          <Text>{zoom}%</Text>
          <Button
            icon={<ZoomInOutlined />}
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            放大
          </Button>
          <Button
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? '退出全屏' : '全屏'}
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={!document?.fileData}
          >
            下载
          </Button>
          <Button onClick={onClose}>
            关闭
          </Button>
        </Space>
      ]}
      destroyOnClose
    >
      <div style={{ minHeight: '400px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>加载文档中...</div>
          </div>
        )}
        
        {error && (
          <Alert
            message="加载失败"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}
        
        {!loading && !error && renderDocumentContent()}
      </div>
    </Modal>
  );
};

export default DocumentReader;