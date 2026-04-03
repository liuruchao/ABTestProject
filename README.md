# A/B 测试轻量化架构框架

端侧 A/B 测试示例项目，包含后端配置服务、管理后台、测试前台和独立 SDK。

## 项目结构

```text
ABTestProject/
├── server/               # 后端服务（Express + Sequelize + SQLite）
├── admin/                # 管理后台（React + Ant Design）
├── client/               # 测试前台（React）
├── sdk/                  # 决策 SDK（@abtest/decision-sdk）
├── shared/               # 共享类型与工具
├── solution.md
└── README.md
```

## 技术栈

- 后端：Node.js、Express、TypeScript、Sequelize、SQLite
- 前端：React、TypeScript、Webpack
- 管理后台 UI：Ant Design
- SDK：TypeScript（本地包方式被 `client` 引用）

## 快速开始

### 1) 安装依赖

```bash
npm run install:all
```

### 2) 启动开发环境

同时启动所有服务：

```bash
npm run dev
```

分别启动：

```bash
npm run dev:server    # server, 3001
npm run dev:admin     # admin, 3002
npm run dev:client    # client, 3003
```

### 3) 构建

```bash
npm run build
```

## 访问地址

- Server: `http://localhost:3001`
- Admin: `http://localhost:3002`
- Client: `http://localhost:3003`

## 当前功能说明

### Server

- 实验 CRUD：创建、查询、更新、删除实验
- 路由筛选接口：`GET /api/experiment/by-route?route=...`
- `by-route` 逻辑：
  - 仅返回 `status === "running"` 的实验
  - 按路由规则匹配（`exact` / `wildcard` / `hierarchy`）
  - 在同层内按互斥组和优先级进行裁剪（同互斥组仅保留一个）

### SDK（`@abtest/decision-sdk`）

- `initialize(userContext, route)`：初始化用户上下文并拉取实验
- `enterPage(route)`：对当前页面命中的实验做分组决策
- 当前行为：若接口返回多个实验，SDK 会对每个实验分别决策并返回多个命中结果（互斥组除外）
- 支持页面快照与缓存，避免同页反复决策导致抖动

### Client

- 提供 SDK 调试页面（`/`）
- 当前默认只渲染一个 SDK 实例（已移除多实例动态添加）
- `webpack-dev-server` 代理 `/api` 到 `http://localhost:3001`

### Admin

- 仪表盘、实验列表、创建实验、实验详情页
- 可管理实验状态、路由规则、实验组等配置

## API 概览

### 实验相关

- `GET /api/experiment`
- `GET /api/experiment/by-route?route=/home`
- `GET /api/experiment/:id`
- `POST /api/experiment`
- `PUT /api/experiment/:id`
- `DELETE /api/experiment/:id`

### 配置相关

- `GET /api/config/global`
- `GET /api/config/page?route=...`
- `POST /api/config/sync`

### 决策相关

- `POST /api/decision/assign`
- `POST /api/decision/validate`

## 已知限制与注意事项

- `server` 当前使用 SQLite 内存库（`storage: ':memory:'`），重启后数据会丢失
- 数据库同步配置为 `force: true`，服务启动会重建表（适合开发，不适合生产）
- `client` 已关闭 webpack 的体积提示（`performance.hints = false`），不影响功能

## 开发建议

- 所有模块均使用 TypeScript
- 接口与类型优先复用 `shared`
- 若用于生产，优先改造：
  - 持久化数据库（文件或外部 DB）
  - 关闭 `force: true`
  - 完善鉴权、日志和错误治理