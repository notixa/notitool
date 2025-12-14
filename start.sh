#!/bin/bash

echo "🚀 启动 TodoList 文档管理系统..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 16+ 版本"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖中..."
    npm install
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
echo "📱 应用将在 http://localhost:5173 启动"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

npm run dev