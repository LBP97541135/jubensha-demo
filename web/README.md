# web/ 目录 README

## 概述
本目录包含前端代码，基于 React 18 + TypeScript + Mantine UI 框架构建。

## 技术栈
- React 18
- TypeScript
- Mantine UI 6.x
- Vite 6.x
- React Router 6.x

## 目录结构

```
web/
├── src/
│   ├── components/     # 通用组件
│   ├── features/       # 业务功能模块
│   ├── pages/          # 页面组件
│   ├── api/            # API 客户端
│   ├── hooks/          # 自定义 Hooks
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript 类型定义
│   └── constants/      # 常量配置
├── public/             # 静态资源
├── index.html          # HTML 入口
├── package.json        # 依赖配置
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 配置
```

## 运行方式

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## API 配置

前端默认连接本地后端服务。在 `package.json` 中配置了 `proxy` 字段指向 `http://localhost:8000`，运行 `npm start` 时会自动代理 API 请求到后端服务。

如需连接远程服务器，可通过环境变量配置：
```bash
# macOS / Linux
VITE_API_URL=http://localhost:8000 npm start

# Windows
set VITE_API_URL=http://localhost:8000 && npm start
```

## 页面结构

### 主要页面
- `/` - 首页 / 剧本列表
- `/play/:scriptId` - 创建游戏会话
- `/game/:sessionId` - 游戏页面
- `/studio` - 工作室面板
- `/agents` - Agent 管理面板

## 代码规范

- 使用 TypeScript 进行类型检查
- 使用 ESLint 进行代码风格检查
- 使用 Prettier 进行代码格式化
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case