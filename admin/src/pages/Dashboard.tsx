import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, List, Typography, Spin, message } from 'antd';
import { experimentApi } from '@/services/api';
import { Experiment } from '@shared/types';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    draft: 0,
    paused: 0,
    ended: 0
  });

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const data = await experimentApi.listExperiments();
      setExperiments(data);
      
      // 计算统计数据
      const total = data.length;
      const running = data.filter(exp => exp.status === 'running').length;
      const draft = data.filter(exp => exp.status === 'draft').length;
      const paused = data.filter(exp => exp.status === 'paused').length;
      const ended = data.filter(exp => exp.status === 'ended').length;
      
      setStats({ total, running, draft, paused, ended });
    } catch (error) {
      message.error('获取实验数据失败');
      console.error('Error fetching experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'green';
      case 'draft':
        return 'blue';
      case 'paused':
        return 'orange';
      case 'ended':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return '运行中';
      case 'draft':
        return '草稿';
      case 'paused':
        return '暂停';
      case 'ended':
        return '已结束';
      default:
        return status;
    }
  };

  return (
    <div>
      <Title level={2}>仪表盘</Title>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="实验统计" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="总实验数"
                    value={stats.total}
                    prefix="📊"
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="运行中"
                    value={stats.running}
                    prefix="🚀"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="草稿"
                    value={stats.draft}
                    prefix="📝"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="已结束"
                    value={stats.ended}
                    prefix="🏁"
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="实验状态分布" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Progress
                    percent={stats.total > 0 ? (stats.running / stats.total) * 100 : 0}
                    status="success"
                    format={(percent) => `${getStatusText('running')}: ${Math.round(percent || 0)}%`}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Progress
                    percent={stats.total > 0 ? (stats.draft / stats.total) * 100 : 0}
                    status="active"
                    format={(percent) => `${getStatusText('draft')}: ${Math.round(percent || 0)}%`}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Progress
                    percent={stats.total > 0 ? (stats.paused / stats.total) * 100 : 0}
                    status="normal"
                    format={(percent) => `${getStatusText('paused')}: ${Math.round(percent || 0)}%`}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Progress
                    percent={stats.total > 0 ? (stats.ended / stats.total) * 100 : 0}
                    status="exception"
                    format={(percent) => `${getStatusText('ended')}: ${Math.round(percent || 0)}%`}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="最近实验" bordered={false}>
              <List
                dataSource={experiments.slice(0, 5)}
                renderItem={(experiment) => (
                  <List.Item
                    actions={[
                      <Tag color={getStatusColor(experiment.status)} key="status">
                        {getStatusText(experiment.status)}
                      </Tag>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Text strong>{experiment.name}</Text>
                      }
                      description={
                        <div>
                          <Text>{experiment.description || '无描述'}</Text>
                          <br />
                          <Text type="secondary">
                            创建时间: {new Date(experiment.createdAt).toLocaleString()}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
              {experiments.length === 0 && (
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '20px 0' }}>
                  暂无实验数据
                </Text>
              )}
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboard;