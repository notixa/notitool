# NotiTool 部署指南

## GitHub 推送

1. 在GitHub上创建新仓库 `notitool`
2. 添加远程仓库并推送：

```bash
git remote add origin https://github.com/YOUR_USERNAME/notitool.git
git push -u origin main
```

## Vercel 部署

### 方法1：通过 Vercel Dashboard

1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择 `notitool` 仓库
5. 配置项目：
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. 点击 "Deploy"

### 方法2：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 生产环境部署
vercel --prod
```

## 环境变量（可选）

如果需要配置环境变量，在 Vercel Dashboard 中添加：

- `NODE_ENV`: production

## 自定义域名

在 Vercel Dashboard 的项目设置中可以配置自定义域名。

## 部署后验证

部署完成后，访问提供的 Vercel URL 验证：
- 网站导航功能正常
- 所有页面可以正常访问
- 响应式设计在不同设备上正常显示

## 更新部署

代码推送到GitHub main分支后，Vercel会自动触发重新部署。