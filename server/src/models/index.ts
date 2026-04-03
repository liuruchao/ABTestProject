import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

import Experiment from './Experiment';
import ExperimentGroup from './ExperimentGroup';
import RouteRule from './RouteRule';

// 初始化数据库
export const initDatabase = async () => {
  try {
    await sequelize.sync({
      force: true, // 开发环境使用，生产环境应设置为 false
      logging: false
    });
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export {
  sequelize,
  Experiment,
  ExperimentGroup,
  RouteRule
};