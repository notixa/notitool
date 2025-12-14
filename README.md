# TodoList 文档管理系统

一个现代化的 TodoList 应用，集成了强大的文档管理功能，支持跨平台使用。

## ✨ 功能特性

### 📝 待办事项管理
- ✅ 创建、编辑、删除待办事项
- 🏷️ 分类管理（工作、学习、生活、文档、其他）
- ✔️ 完成状态切换
- 📅 创建时间追踪

### 📁 文档管理
- 📤 支持多种文档格式上传（PDF、Word、Excel、文本等）
- 🔍 文档搜索功能
- 🏷️ 文档分类和标签
- 👁️ 文档预览功能
- 🗑️ 文档删除管理

### 📊 统计分析
- 📈 待办事项完成进度
- 📊 分类统计分析
- 📋 文档类型统计
- 🎯 可视化数据展示

### 🎨 界面特点
- 🌈 现代化 UI 设计
- 📱 响应式布局
- 🎭 流畅的动画效果
- 🌙 清爽的视觉体验

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本
```bash
npm run build
```

## 📱 使用说明

### 待办事项
1. 点击左侧菜单的"待办事项"
2. 点击"添加待办"按钮创建新任务
3. 填写标题、描述和选择分类
4. 点击任务标题可以标记完成状态
5. 使用编辑和删除按钮管理任务

### 文档管理
1. 点击左侧菜单的"文档管理"
2. 点击"上传文档"按钮上传文件
3. 使用搜索框和分类筛选查找文档
4. 点击预览按钮查看文档内容
5. 使用删除按钮移除不需要的文档

### 统计分析
1. 点击左侧菜单的"统计分析"
2. 查看待办事项完成进度
3. 浏览分类和文档类型统计
4. 获得工作效率洞察

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design 5.x
- **构建工具**: Vite
- **状态管理**: 本地存储（LocalStorage）
- **样式方案**: CSS + Ant Design

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── AppHeader.tsx   # 应用头部
│   ├── Sidebar.tsx     # 侧边栏
│   ├── TodoList.tsx    # 待办事项组件
│   ├── DocumentManager.tsx # 文档管理组件
│   └── Statistics.tsx  # 统计分析组件
├── utils/              # 工具函数
│   └── storage.ts      # 存储服务
├── App.tsx             # 主应用组件
├── App.css             # 应用样式
└── main.tsx           # 应用入口
```

## 🔧 开发说明

### 添加新功能
1. 在 `src/components/` 目录下创建新组件
2. 在 `src/utils/` 目录下添加工具函数
3. 在 `App.tsx` 中注册新的路由

### 样式定制
- 修改 `src/App.css` 进行全局样式定制
- 使用 Ant Design 的主题系统进行组件样式定制

### 数据持久化
当前使用 LocalStorage 进行数据存储，如需升级到数据库，可以修改 `src/utils/storage.ts` 文件。

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目：
- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Vite](https://vitejs.dev/)

---

**享受高效的待办事项和文档管理体验！** 🎉