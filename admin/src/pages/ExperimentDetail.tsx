import React, { useEffect, useState } from 'react';
import { Form, Input, Select, InputNumber, Button, Card, List, Modal, message, Typography, Space, Spin, Row, Col } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { experimentApi } from '@/services/api';
import { Experiment } from '@shared/types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Group {
  id: string;
  name: string;
  ratio: number;
  variables: string;
}

interface RouteRule {
  id: string;
  type: string;
  pattern: string;
}

const ExperimentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [routeRules, setRouteRules] = useState<RouteRule[]>([]);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingRule, setEditingRule] = useState<RouteRule | null>(null);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExperimentDetail();
    }
  }, [id]);

  const fetchExperimentDetail = async () => {
    try {
      setLoading(true);
      const data = await experimentApi.getExperiment(id!);
      setExperiment(data);
      
      // 初始化表单数据
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        status: data.status,
        layer: data.layer,
        trafficRatio: data.trafficRatio,
        mutexGroupId: data.mutexGroupId,
        priority: data.priority
      });
      
      // 处理实验组数据
      setGroups(data.groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        ratio: group.ratio,
        variables: JSON.stringify(group.variables || {}, null, 2)
      })));
      
      // 处理路由规则数据
      setRouteRules(data.routeRules.map((rule: any) => ({
        id: rule.id,
        type: rule.type,
        pattern: rule.pattern
      })));
    } catch (error) {
      message.error('获取实验详情失败');
      console.error('Error fetching experiment detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (!id) return;
      
      setSaving(true);
      
      // 验证流量比例总和为100%
      const totalRatio = groups.reduce((sum, group) => sum + group.ratio, 0);
      if (Math.abs(totalRatio - 100) > 0.01) {
        message.error('实验组流量比例总和必须为100%');
        return;
      }

      // 构建实验数据
      const experimentData = {
        ...values,
        groups: groups.map(group => {
          let variables = {};
          try {
            variables = JSON.parse(group.variables || '{}');
          } catch (error) {
            message.error('变量格式错误，请确保输入有效的JSON格式');
            throw error;
          }
          return {
            ...group,
            variables
          };
        }),
        routeRules
      };

      await experimentApi.updateExperiment(id, experimentData);
      message.success('实验更新成功');
      fetchExperimentDetail();
    } catch (error) {
      message.error('更新实验失败');
      console.error('Error updating experiment:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddGroup = () => {
    const newGroup: Group = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `新组 ${groups.length + 1}`,
      ratio: 0,
      variables: '{}'
    };
    setEditingGroup(newGroup);
    setGroupModalVisible(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup({ ...group });
    setGroupModalVisible(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (groups.length <= 1) {
      message.error('至少需要一个实验组');
      return;
    }
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const handleSaveGroup = () => {
    if (editingGroup) {
      const isNew = !groups.some(g => g.id === editingGroup.id);
      if (isNew) {
        setGroups([...groups, editingGroup]);
      } else {
        setGroups(groups.map(group => 
          group.id === editingGroup.id ? editingGroup : group
        ));
      }
      setGroupModalVisible(false);
      setEditingGroup(null);
    }
  };

  const handleAddRule = () => {
    const newRule: RouteRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'exact',
      pattern: '/'
    };
    setEditingRule(newRule);
    setRuleModalVisible(true);
  };

  const handleEditRule = (rule: RouteRule) => {
    setEditingRule({ ...rule });
    setRuleModalVisible(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRouteRules(routeRules.filter(rule => rule.id !== ruleId));
  };

  const handleSaveRule = () => {
    if (editingRule) {
      const isNew = !routeRules.some(r => r.id === editingRule.id);
      if (isNew) {
        setRouteRules([...routeRules, editingRule]);
      } else {
        setRouteRules(routeRules.map(rule => 
          rule.id === editingRule.id ? editingRule : rule
        ));
      }
      setRuleModalVisible(false);
      setEditingRule(null);
    }
  };

  if (loading) {
    return <Spin tip="加载中..." size="large" />;
  }

  if (!experiment) {
    return <Text>实验不存在</Text>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>实验详情</Title>
        <Button onClick={() => navigate('/experiments')}>返回列表</Button>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Card title="基本信息" style={{ height: '100%' }}>
              <Form.Item
                name="name"
                label="实验名称"
                rules={[{ required: true, message: '请输入实验名称' }]}
              >
                <Input placeholder="请输入实验名称" />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="实验描述"
              >
                <TextArea rows={3} placeholder="请输入实验描述" />
              </Form.Item>
              
              <Form.Item
                name="status"
                label="实验状态"
                rules={[{ required: true, message: '请选择实验状态' }]}
              >
                <Select placeholder="请选择实验状态">
                  <Option value="draft">草稿</Option>
                  <Option value="running">运行中</Option>
                  <Option value="paused">暂停</Option>
                  <Option value="ended">已结束</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="layer"
                label="实验层级"
                rules={[{ required: true, message: '请选择实验层级' }]}
              >
                <Select placeholder="请选择实验层级">
                  <Option value="ui">UI展示</Option>
                  <Option value="strategy">策略逻辑</Option>
                  <Option value="algorithm">算法参数</Option>
                  <Option value="marketing">营销活动</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="trafficRatio"
                label="实验流量比例"
                rules={[{ required: true, message: '请输入实验流量比例' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  suffix="%"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item
                name="mutexGroupId"
                label="互斥组ID"
              >
                <Input placeholder="请输入互斥组ID（可选）" />
              </Form.Item>
              
              <Form.Item
                name="priority"
                label="优先级"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card title="实验组配置" style={{ height: '100%' }}>
              <List
                dataSource={groups}
                renderItem={(group) => (
                  <List.Item
                    actions={[
                      <Button key="edit" type="link" onClick={() => handleEditGroup(group)}>编辑</Button>,
                      <Button key="delete" type="link" danger onClick={() => handleDeleteGroup(group.id)}>删除</Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={group.name}
                      description={
                        <div>
                          <p>流量比例: {group.ratio}%</p>
                          <p>变量: {group.variables}</p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
              <Button type="dashed" onClick={handleAddGroup} style={{ marginTop: 16, width: '100%' }}>
                添加实验组
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card title="路由规则" style={{ height: '100%' }}>
              <List
                dataSource={routeRules}
                renderItem={(rule) => (
                  <List.Item
                    actions={[
                      <Button key="edit" type="link" onClick={() => handleEditRule(rule)}>编辑</Button>,
                      <Button key="delete" type="link" danger onClick={() => handleDeleteRule(rule.id)}>删除</Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={`${rule.type === 'exact' ? '精确匹配' : rule.type === 'wildcard' ? '通配符匹配' : '层级匹配'}`}
                      description={`路径: ${rule.pattern}`}
                    />
                  </List.Item>
                )}
              />
              <Button type="dashed" onClick={handleAddRule} style={{ marginTop: 16, width: '100%' }}>
                添加路由规则
              </Button>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={() => navigate('/experiments')}>取消</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              保存修改
            </Button>
          </Space>
        </div>
      </Form>

      {/* 实验组编辑模态框 */}
      <Modal
        title={editingGroup && !groups.some(g => g.id === editingGroup.id) ? '添加实验组' : '编辑实验组'}
        open={groupModalVisible}
        onOk={handleSaveGroup}
        onCancel={() => setGroupModalVisible(false)}
      >
        {editingGroup && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>组名称</label>
              <Input
                value={editingGroup.name}
                onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>流量比例 (%)</label>
              <InputNumber
                min={0}
                max={100}
                value={editingGroup.ratio}
                onChange={(value) => setEditingGroup({ ...editingGroup, ratio: value || 0 })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>变量 (JSON格式)</label>
              <TextArea
                rows={4}
                value={editingGroup.variables}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditingGroup({ ...editingGroup, variables: value });
                  // 实时验证JSON格式
                  if (value) {
                    try {
                      JSON.parse(value);
                    } catch (error) {
                      // 可以在这里添加错误提示
                    }
                  }
                }}
                placeholder='例如: {"buttonColor": "red", "buttonText": "立即购买"}'
              />
              <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
                提示: 属性名必须用双引号括起来，例如 {`{"name": "测试"}`}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 路由规则编辑模态框 */}
      <Modal
        title={editingRule && !routeRules.some(r => r.id === editingRule.id) ? '添加路由规则' : '编辑路由规则'}
        open={ruleModalVisible}
        onOk={handleSaveRule}
        onCancel={() => setRuleModalVisible(false)}
      >
        {editingRule && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>匹配类型</label>
              <Select
                value={editingRule.type}
                onChange={(value) => setEditingRule({ ...editingRule, type: value })}
                style={{ width: '100%' }}
              >
                <Option value="exact">精确匹配</Option>
                <Option value="wildcard">通配符匹配</Option>
                <Option value="hierarchy">层级匹配</Option>
              </Select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>路径</label>
              <Input
                value={editingRule.pattern}
                onChange={(e) => setEditingRule({ ...editingRule, pattern: e.target.value })}
                placeholder='例如: /home'
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExperimentDetail;