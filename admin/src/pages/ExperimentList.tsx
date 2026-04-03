import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Modal, message, Input, Select, Typography, Space, Spin, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { experimentApi } from '@/services/api';
import { Experiment } from '@shared/types';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ExperimentList: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [layerFilter, setLayerFilter] = useState<string>('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteExperimentId, setDeleteExperimentId] = useState<string>('');

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const data = await experimentApi.listExperiments();
      setExperiments(data);
    } catch (error) {
      message.error('获取实验列表失败');
      console.error('Error fetching experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);


  const handleDelete = async () => {
    try {
      if (deleteExperimentId) {
        await experimentApi.deleteExperiment(deleteExperimentId);
        message.success('实验删除成功');
        setDeleteModalVisible(false);
        fetchExperiments();
      }
    } catch (error) {
      message.error('删除实验失败');
      console.error('Error deleting experiment:', error);
    }
  };

  const getStatusColor = (status: 'draft' | 'running' | 'paused' | 'ended') => {
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

  const getStatusText = (status: 'draft' | 'running' | 'paused' | 'ended') => {
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

  const getLayerText = (layer: 'ui' | 'strategy' | 'algorithm' | 'marketing') => {
    switch (layer) {
      case 'ui':
        return 'UI展示';
      case 'strategy':
        return '策略逻辑';
      case 'algorithm':
        return '算法参数';
      case 'marketing':
        return '营销活动';
      default:
        return layer;
    }
  };

  const filteredExperiments = experiments.filter(experiment => {
    const matchesSearch = experiment.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (experiment.description && experiment.description.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = !statusFilter || experiment.status === statusFilter;
    const matchesLayer = !layerFilter || experiment.layer === layerFilter;
    return matchesSearch && matchesStatus && matchesLayer;
  });

  const columns = [
    {
      title: '实验名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Experiment) => (
        <Link to={`/experiments/${record.id}`}>{text}</Link>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <Text ellipsis>{text || '无描述'}</Text>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'draft' | 'running' | 'paused' | 'ended') => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: '运行中', value: 'running' },
        { text: '草稿', value: 'draft' },
        { text: '暂停', value: 'paused' },
        { text: '已结束', value: 'ended' }
      ],
      onFilter: (value: any, record: Experiment) => record.status === value
    },
    {
      title: '层级',
      dataIndex: 'layer',
      key: 'layer',
      render: (layer: 'ui' | 'strategy' | 'algorithm' | 'marketing') => (
        <Tag>{getLayerText(layer)}</Tag>
      ),
      filters: [
        { text: 'UI展示', value: 'ui' },
        { text: '策略逻辑', value: 'strategy' },
        { text: '算法参数', value: 'algorithm' },
        { text: '营销活动', value: 'marketing' }
      ],
      onFilter: (value: any, record: Experiment) => record.layer === value
    },
    {
      title: '流量比例',
      dataIndex: 'trafficRatio',
      key: 'trafficRatio',
      render: (ratio: number) => `${ratio}%`
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: number) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Experiment) => (
        <Space size="middle">
          <Button type="primary" size="small">
            <Link to={`/experiments/${record.id}`}>编辑</Link>
          </Button>
          <Popconfirm
            title="确定要删除这个实验吗？"
            onConfirm={() => {
              setDeleteExperimentId(record.id);
              setDeleteModalVisible(true);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button danger size="small">删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>实验列表</Title>
        <Button type="primary">
          <Link to="/experiments/create">创建实验</Link>
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Search
          placeholder="搜索实验名称或描述"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="筛选状态"
          style={{ width: 150 }}
          value={statusFilter}
          onChange={setStatusFilter}
          allowClear
        >
          <Option value="running">运行中</Option>
          <Option value="draft">草稿</Option>
          <Option value="paused">暂停</Option>
          <Option value="ended">已结束</Option>
        </Select>
        <Select
          placeholder="筛选层级"
          style={{ width: 150 }}
          value={layerFilter}
          onChange={setLayerFilter}
          allowClear
        >
          <Option value="ui">UI展示</Option>
          <Option value="strategy">策略逻辑</Option>
          <Option value="algorithm">算法参数</Option>
          <Option value="marketing">营销活动</Option>
        </Select>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredExperiments}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            total: filteredExperiments.length,
          }}
          scroll={{ x: 1000 }}
        />
      </Spin>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <p>确定要删除这个实验吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default ExperimentList;