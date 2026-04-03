import React, { useState } from 'react';
import { ABTestSDK, UserContext } from '@abtest/decision-sdk';

const ABTestSDKComponent: React.FC = () => {
  // 表单状态
  const [userId, setUserId] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('device-' + Math.random().toString(36).substr(2, 9));
  const [route, setRoute] = useState<string>('/home');
  
  // SDK状态
  const [sdk, setSdk] = useState<ABTestSDK | null>(null);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 初始化SDK
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('=== 客户端SDK初始化开始 ===');
    console.log('用户ID:', userId);
    console.log('设备ID:', deviceId);
    console.log('页面路由:', route);
    console.log('用户ID类型:', typeof userId);
    console.log('用户ID长度:', userId.length);
    console.log('用户ID是否为空:', userId === '');
    
    try {
      // 检查是否已初始化过SDK，如果是，清除上一个SDK的缓存
      if (sdk) {
        console.log('发现已存在SDK实例，清除缓存...');
        sdk.clearCache();
        console.log('缓存清除完成');
      }
      
      // 创建SDK实例
      const newSdk = new ABTestSDK();
      console.log('SDK实例创建成功');
      
      // 构建用户上下文
      const userContext: UserContext = {
        deviceId,
        userId: userId || undefined
      };
      console.log('用户上下文:', userContext);
      console.log('用户上下文中的userId:', userContext.userId);
      console.log('用户上下文中的userId类型:', typeof userContext.userId);
      
      // 初始化SDK
      console.log('开始初始化SDK...');
      await newSdk.initialize(userContext, route);
      console.log('SDK初始化完成');
      
      // 获取实验数据
      const experimentData = newSdk.getExperiments();
      console.log('获取到的实验数据:', experimentData);
      setExperiments(experimentData);
      
      // 进入页面获取实验结果
      console.log('开始调用enterPage...');
      const experimentResults = newSdk.enterPage(route);
      console.log('enterPage返回的结果:', experimentResults);
      setResults(experimentResults);
      
      // 保存SDK实例
      setSdk(newSdk);
      console.log('=== 客户端SDK初始化完成 ===\n');
      
    } catch (err) {
      console.error('SDK初始化失败:', err);
      setError('初始化SDK失败: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>SDK实例</h3>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>用户ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="登录用户的ID"
          />
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>设备ID:</label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="设备唯一标识"
          />
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>页面路由:</label>
          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="例如: /home, /product/123"
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '初始化中...' : '初始化SDK'}
          </button>
        </div>
      </form>
      
      {error && (
        <div style={{
          color: '#ff4d4f',
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h4>命中该路由的实验数据:</h4>
        {experiments.length > 0 ? (
          experiments.map((experiment, index) => (
            <div key={experiment.id} style={{
              backgroundColor: '#f0f0f0',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '10px',
              borderLeft: '4px solid #1890ff'
            }}>
              <h5 style={{ margin: '0 0 8px 0' }}>实验 {index + 1}: {experiment.name}</h5>
              <div style={{ marginBottom: '4px' }}><strong>实验ID:</strong> {experiment.id}</div>
              <div style={{ marginBottom: '4px' }}><strong>状态:</strong> {experiment.status}</div>
              <div style={{ marginBottom: '4px' }}><strong>层级:</strong> {experiment.layer}</div>
              <div style={{ marginBottom: '4px' }}><strong>流量比例:</strong> {experiment.trafficRatio}%</div>
              {experiment.mutexGroupId && (
                <div style={{ marginBottom: '4px' }}><strong>互斥组ID:</strong> {experiment.mutexGroupId}</div>
              )}
              <div style={{ marginBottom: '4px' }}><strong>优先级:</strong> {experiment.priority}</div>
              <div style={{ marginBottom: '4px' }}><strong>路由规则:</strong> {experiment.routeRules.map((rule: any) => `${rule.type}: ${rule.pattern}`).join(', ')}</div>
              <div style={{ marginTop: '8px' }}>
                <strong>实验组:</strong>
                <ul style={{ margin: '4px 0 0 20px' }}>
                  {experiment.groups.map((group: any) => (
                    <li key={group.id}>
                      {group.name} ({group.ratio}%) {group.isControl && '(对照组)'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '4px',
            border: '1px dashed #d9d9d9',
            textAlign: 'center',
            color: '#999'
          }}>
            暂无命中该路由的实验数据
          </div>
        )}
      </div>
      
      <div>
        <h4>用户命中的分组:</h4>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={result.experimentId} style={{
              backgroundColor: '#f0f0f0',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '10px',
              borderLeft: '4px solid #52c41a'
            }}>
              <h5 style={{ margin: '0 0 8px 0' }}>实验 {index + 1} 命中结果</h5>
              <div style={{ marginBottom: '4px' }}><strong>实验ID:</strong> {result.experimentId}</div>
              <div style={{ marginBottom: '4px' }}><strong>哈希值:</strong> <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{result.hashValue}</span> (0-99)</div>
              <div style={{ marginBottom: '4px' }}><strong>命中分组:</strong> <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{result.groupName}</span> {result.isControl && '(对照组)'}</div>
              <div style={{ marginBottom: '4px' }}><strong>分组ID:</strong> {result.groupId}</div>
              {Object.keys(result.variables).length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <strong>分组变量:</strong>
                  <pre style={{
                    backgroundColor: '#e8f5e8',
                    padding: '8px',
                    borderRadius: '4px',
                    marginTop: '4px',
                    fontSize: '12px'
                  }}>
                    {JSON.stringify(result.variables, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '4px',
            border: '1px dashed #d9d9d9',
            textAlign: 'center',
            color: '#999'
          }}>
            暂无命中的分组数据
          </div>
        )}
      </div>
      
      {experiments.length > 0 && results.length === 0 && (
        <div style={{
          backgroundColor: '#fff2f0',
          padding: '16px',
          borderRadius: '4px',
          border: '1px solid #ffccc7',
          marginTop: '20px'
        }}>
          <h5 style={{ margin: '0 0 12px 0', color: '#cf1322' }}>调试信息</h5>
          <div style={{ marginBottom: '8px' }}><strong>用户标识:</strong> {userId || deviceId}</div>
          <div style={{ marginBottom: '8px' }}><strong>当前路由:</strong> {route}</div>
          <div style={{ marginBottom: '8px' }}><strong>实验数量:</strong> {experiments.length}</div>
          <div style={{ marginBottom: '8px' }}><strong>运行中实验:</strong> {experiments.filter(e => e.status === 'running').length}</div>
          <div style={{ marginBottom: '8px' }}><strong>实验详情:</strong></div>
          <div style={{ paddingLeft: '16px' }}>
            {experiments.map((exp, index) => (
              <div key={exp.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
                <div><strong>{index + 1}. {exp.name}</strong> (ID: {exp.id})</div>
                <div>状态: {exp.status} | 流量比例: {exp.trafficRatio}%</div>
                <div>实验组: {exp.groups.map((g: any) => `${g.name}(${g.ratio}%)`).join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTestSDKComponent;