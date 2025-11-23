# 🚀 快速启动指南

5分钟内运行你的电商网站！

## 📋 准备工作

1. 安装 [Node.js](https://nodejs.org) (推荐 18.x 或更高版本)
2. 注册 [Supabase](https://supabase.com) 账户
3. 注册 [Netlify](https://netlify.com) 账户（可选，用于部署）

## ⚡ 本地运行

### 1. 安装依赖
```bash
npm install
```

### 2. 配置 Supabase
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目
3. 在 SQL 编辑器中执行 `supabase-schema.sql`
4. 在 Settings > API 中获取 URL 和 anon key
5. 创建 `.env` 文件：
```bash
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的匿名密钥
```

### 3. 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:8080 查看网站

## 🌐 立即部署

### 方法一：Netlify（推荐）
1. 推送代码到 GitHub
2. 连接 Netlify 账户
3. 设置环境变量：`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. 部署完成！

### 方法二：Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 设置环境变量
4. 部署

## ✨ 功能预览

### 🏠 首页
- 商品展示网格
- 分类筛选
- 搜索功能
- 快速添加购物车

### 🛒 购物车
- 商品管理
- 数量调整
- 订单结算
- 推荐商品

### 👤 用户中心
- 个人资料
- 订单历史
- 账户设置

### 📱 响应式设计
完美支持手机、平板、桌面端！

## 🎯 快速测试

1. **浏览商品**: 访问首页，查看商品列表
2. **搜索功能**: 点击搜索，输入"手机"
3. **分类筛选**: 点击"电子产品"分类
4. **查看详情**: 点击任意商品进入详情页
5. **添加购物车**: 在详情页点击"加入购物车"
6. **查看购物车**: 点击顶部购物车图标
7. **结算**: 在购物车页面点击"结算"

## 🔧 开发提示

### 修改商品数据
在 Supabase Dashboard 的 SQL 编辑器中：
```sql
-- 添加新商品
INSERT INTO products (name, description, price, category, stock_count) 
VALUES ('新商品', '商品描述', 199.00, '电子产品', 50);

-- 查看所有商品
SELECT * FROM products;
```

### 自定义样式
编辑 `css/style.css` 文件，修改：
- 颜色主题：搜索 `#e74c3c` 并替换
- 布局调整：修改 `.products-grid` 等类
- 响应式断点：修改 `@media` 查询

### 添加新页面
1. 创建新的 HTML 文件
2. 复制现有页面结构
3. 修改导航链接
4. 添加页面特定功能

## 🐛 常见问题

**Q: 页面显示 "Supabase 配置缺失"**
A: 检查 `.env` 文件是否正确配置，或使用本地存储临时设置：
```javascript
localStorage.setItem('supabase_url', '你的URL');
localStorage.setItem('supabase_anon_key', '你的密钥');
```

**Q: 商品无法加载**
A: 确认 Supabase 数据库表已创建，检查 RLS 策略

**Q: 购物车功能异常**
A: 确认用户已登录，检查认证状态

## 📞 获取帮助

- 📖 详细文档：查看 `README.md`
- 🚀 部署指南：查看 `DEPLOYMENT.md`
- 🐛 问题反馈：提交 GitHub Issue
- 💬 技术交流：加入开发者社区

## 🎉 开始你的电商之旅！

现在你已经拥有一个功能完整的电商网站！
- 🛍️ 添加你的商品
- 🎨 自定义品牌样式
- 🚀 部署到生产环境
- 💰 开始接受订单

祝你使用愉快！🛒✨