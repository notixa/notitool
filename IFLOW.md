# NotiTool - 个人效率工具集合 - iFlow 上下文文档

## 项目概述

NotiTool 是一个现代化的个人效率工具集合，集成网站导航、待办事项管理、文档管理、笔记功能和用户认证系统。项目基于 React 18 + TypeScript 构建，使用 Ant Design 作为 UI 组件库，Vite 作为构建工具，并支持 Electron 跨平台桌面应用。专为个人使用设计，每个用户拥有独立的数据空间。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design 5.x
- **构建工具**: Vite 5.x
- **状态管理**: 本地存储（LocalStorage）
- **桌面应用**: Electron
- **Markdown渲染**: react-markdown + remark-gfm
- **拖拽功能**: @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities
- **样式方案**: CSS + Ant Design 主题系统
- **部署平台**: Vercel

## 项目架构

### 核心目录结构
```
src/
├── components/          # React 组件目录
│   ├── AppHeader.tsx   # 应用头部组件
│   ├── Sidebar.tsx     # 侧边栏导航组件（含用户信息）
│   ├── TodoList.tsx    # 待办事项管理组件（支持分类筛选）
│   ├── DocumentManager.tsx # 文档管理组件（支持文件夹）
│   ├── DocumentReader.tsx  # 文档阅读器组件
│   ├── Notes.tsx       # 笔记管理组件（支持Markdown）
│   ├── Statistics.tsx  # 统计分析组件
│   ├── Login.tsx       # 用户认证组件
│   └── WebsiteNavigation.tsx # 网站导航组件（支持拖拽排序）
├── utils/              # 工具函数目录
│   └── storage.ts      # 多用户本地存储服务
├── App.tsx             # 主应用组件
├── App.css             # 应用全局样式
├── main.tsx           # 应用入口文件
└── vite-env.d.ts      # Vite 类型声明

electron/               # Electron 桌面应用
├── main.js            # Electron 主进程
└── preload.js         # 预加载脚本
```

### 应用架构模式
- **单页应用 (SPA)**: 使用状态管理进行页面路由
- **组件化架构**: 功能模块独立组件化
- **多用户数据隔离**: 基于用户ID的数据分离存储
- **跨平台支持**: Web 应用 + Electron 桌面应用
- **文件存储**: Base64编码的本地文件存储
- **拖拽交互**: 现代化的拖拽排序体验

## 核心功能模块

### 1. 用户认证系统
- 用户注册和登录功能
- 用户信息显示和退出登录
- 基于LocalStorage的用户会话管理
- 每个用户独立的数据空间

### 2. 网站导航（新增）
- **拖拽排序**: 支持网站卡片拖拽重新排序
- **分类管理**: 多种预设分类（搜索引擎、开发工具、社交媒体等）
- **预设网站**: 内置常用网站快速添加
- **图标管理**: 自动获取网站图标或自定义图标
- **网站信息**: 支持名称、URL、描述等完整信息
- **快速访问**: 点击直接打开网站

### 3. 待办事项管理
- 创建、编辑、删除待办事项
- 分类管理（工作、学习、生活、文档、其他）
- **分类检索功能**: 按分类筛选待办事项
- 完成状态切换
- 创建时间追踪

### 4. 文档管理
- **文件夹系统**: 支持创建、删除和嵌套文件夹
- 多种文档格式上传支持（PDF、Word、Excel、文本等）
- 文档搜索和分类筛选
- **文档阅读器**: 专业的阅读界面，支持缩放和全屏
- 文档移动到文件夹功能
- 文档下载功能
- Base64编码存储，确保数据完整性

### 5. 笔记管理
- **Markdown支持**: 完整的Markdown语法支持
- 笔记分类和标签管理
- 实时预览功能
- 笔记编辑和删除
- 支持GitHub Flavored Markdown (GFM)

### 6. 统计分析
- 待办事项完成进度
- 分类统计分析
- 文档类型统计
- 可视化数据展示

## 数据模型

### User 接口
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}
```

### Todo 接口
```typescript
interface Todo {
  id: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}
```

### Folder 接口
```typescript
interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  userId: string;
}
```

### Document 接口
```typescript
interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  content?: string;
  fileData?: string; // 存储文件的base64数据
  uploadTime: Date;
  userId: string;
  folderId: string | null;
}
```

### Note 接口
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

### Website 接口（新增）
```typescript
interface Website {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
  description?: string;
  position: number;
  createdAt: Date;
  userId: string;
}
```

## 构建和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 开发环境启动
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产环境构建
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 快速启动脚本
```bash
# 使用提供的启动脚本
./start.sh
```

### Electron 桌面应用
```bash
# 开发模式运行 Electron
npm run electron:dev

# 构建 Electron 应用
npm run electron:build
```

## 开发约定

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 使用 Ant Design 组件库保持 UI 一致性
- 组件文件使用 PascalCase 命名

### 组件开发规范
- 每个组件应该是独立的、可复用的
- 使用 TypeScript 接口定义 props 类型
- 组件内部状态使用 useState Hook
- 副作用操作使用 useEffect Hook
- 拖拽功能使用 @dnd-kit 库实现

### 数据管理规范
- 所有数据操作通过 storageService 统一管理
- 用户数据隔离：每个用户的数据独立存储
- 数据变更后立即更新本地状态
- 使用 try-catch 处理存储异常

### 文件处理规范
- 文件使用 Base64 编码存储
- PDF文档通过iframe直接渲染
- Office文档通过Office Online预览
- 文本文件直接显示内容

### 拖拽交互规范
- 使用 @dnd-kit 库实现拖拽功能
- 支持键盘和鼠标操作
- 保持拖拽状态的一致性
- 拖拽后立即更新位置数据

### 样式规范
- 使用 Ant Design 主题系统
- 自定义样式放在 App.css 或组件对应的 CSS 文件中
- 保持响应式设计原则

## 关键配置文件

### package.json 脚本
- `npm run dev`: 启动开发服务器
- `npm run build`: 构建生产版本
- `npm run preview`: 预览构建结果
- `npm run test`: 测试命令（当前为占位符）

### package.json 依赖
- **生产依赖**:
  - `react`: ^18.2.0
  - `react-dom`: ^18.2.0
  - `antd`: ^5.12.8
  - `react-markdown`: ^10.1.0
  - `remark-gfm`: ^4.0.1
  - `@dnd-kit/core`: ^6.3.1
  - `@dnd-kit/sortable`: ^10.0.0
  - `@dnd-kit/utilities`: ^3.2.2

- **开发依赖**:
  - `@vitejs/plugin-react`: ^4.2.1
  - `typescript`: ^5.3.3
  - `vite`: ^5.0.8

### vite.config.ts 配置
- 开发服务器端口: 5173
- 构建输出目录: dist
- 基础路径: ./（支持相对路径部署）

### TypeScript 配置
- 目标: ES2020
- 严格模式: 启用
- JSX: react-jsx
- 未使用变量检查: 启用

### vercel.json 配置（新增）
- 框架: Vite
- 构建命令: npm run build
- 输出目录: dist
- SPA 路由支持: 所有路由重定向到 index.html

## 扩展开发

### 添加新功能模块
1. 在 `src/components/` 目录下创建新组件
2. 在 `App.tsx` 中的 renderContent 函数添加路由逻辑
3. 在 `Sidebar.tsx` 中添加对应的菜单项
4. 更新存储服务以支持新的数据类型

### 用户数据管理
- 所有数据都通过 `storageService` 的用户相关方法管理
- 数据键格式: `{userId}_{dataType}`
- 用户登录状态存储在 `currentUser` 键中

### 文档类型扩展
要支持新的文档类型：
1. 在 `DocumentReader.tsx` 中添加新的渲染逻辑
2. 更新 `getContentType` 方法
3. 在 `DocumentManager.tsx` 中添加对应的文件类型判断

### 网站导航扩展
- 支持更多网站分类
- 添加网站图标缓存
- 实现网站访问统计
- 支持网站导入/导出功能

### 拖拽功能扩展
- 支持跨组件拖拽
- 添加拖拽动画效果
- 实现拖拽撤销功能
- 支持批量拖拽操作

### 主题定制
- 修改 Ant Design 主题配置
- 在 `App.css` 中添加自定义样式
- 使用 CSS 变量实现动态主题

## 测试

当前项目暂无自动化测试配置，建议添加：
- 单元测试: Jest + React Testing Library
- E2E 测试: Playwright 或 Cypress
- 类型检查: TypeScript 编译器

## 部署

### Vercel 部署（推荐）
1. 连接 GitHub 仓库到 Vercel
2. 自动检测 Vite 框架配置
3. 构建命令: `npm run build`
4. 输出目录: `dist`
5. 推送代码自动触发部署

### Web 应用部署
1. 运行 `npm run build` 构建生产版本
2. 将 `dist` 目录部署到 Web 服务器
3. 配置服务器支持 SPA 路由

### Electron 应用分发
1. 构建 Web 应用: `npm run build`
2. 使用 Electron Builder 打包桌面应用
3. 生成对应平台的安装包

## 常见问题

### 开发环境问题
- 确保使用 Node.js 16+ 版本
- 清除 node_modules 重新安装依赖
- 检查端口 5173 是否被占用

### 构建问题
- 检查 TypeScript 类型错误
- 确保所有依赖都已正确安装
- 检查 Vite 配置是否正确

### 拖拽功能问题
- 确保 @dnd-kit 依赖正确安装
- 检查拖拽传感器的配置
- 验证拖拽上下文的设置

### 文档渲染问题
- PDF文档需要Base64编码数据
- Office文档预览需要网络连接
- 大文件可能影响加载性能

### 用户认证问题
- 用户数据存储在LocalStorage中
- 清除浏览器数据会删除用户信息
- 密码未加密，仅适用于个人使用

### Vercel 部署问题
- 确保 vercel.json 配置正确
- 检查 GitHub 仓库连接
- 验证构建日志中的错误信息

### Electron 问题
- 确保 Electron 版本与 Node.js 版本兼容
- 检查主进程和渲染进程通信
- 验证 preload 脚本配置

## 项目维护

### 依赖更新
- 定期更新 React 和 Ant Design 版本
- 检查安全漏洞并及时修复
- 保持构建工具版本更新
- 关注 @dnd-kit 库的更新

### 性能优化
- 使用 React.memo 优化组件渲染
- 实现虚拟滚动处理大列表
- 优化打包体积和加载速度
- 考虑文件压缩和懒加载
- 优化拖拽操作的性能

### 数据安全
- 当前适用于个人使用场景
- 敏感数据建议加密存储
- 定期备份重要数据

### 部署维护
- 监控 Vercel 部署状态
- 定期检查域名和 SSL 证书
- 优化构建时间和部署速度

---

**注意**: 此文档为 iFlow 上下文文档，用于提供项目开发和维护的参考信息。