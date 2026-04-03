import React from 'react';
import ABTestSDKComponent from '../components/ABTestSDKComponent';

const SDKTestPage: React.FC = () => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>A/B测试SDK使用示例</h1>
        <p style={{ color: '#666' }}>
          本页面演示如何使用A/B测试SDK，默认渲染一个SDK实例并测试用户上下文和页面路由。
        </p>
      </div>

      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>SDK实例</h2>
        <ABTestSDKComponent />
      </div>
    </div>
  );
};

export default SDKTestPage;