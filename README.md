# 电商展示网站

基于 Supabase 和 Netlify 构建的现代化电商网站。

## 🚀 项目特性

- 🛒 完整的购物流程（商品浏览 → 购物车 → 下单）
- 👤 用户中心和个人资料管理
- 📱 响应式设计，支持移动端
- 🔍 商品搜索和分类筛选
- 🛡️ 安全的数据库访问控制
- ⚡ 快速的加载和流畅的用户体验

## 🏗️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端服务**: Supabase (数据库 + 认证 + 实时功能)
- **部署**: Netlify (静态网站托管)
- **UI组件**: 自定义组件库
- **数据库**: PostgreSQL (通过 Supabase)

## 📊 数据库设计

### 核心数据表（6张）

1. **users** - 用户表
   - 用户基本信息、地址、联系方式

2. **products** - 商品表
   - 商品名称、价格、描述、库存、分类

3. **orders** - 订单表
   - 订单状态、总金额、收货地址

4. **order_items** - 订单商品关联表
   - 订单与商品的多对多关系

5. **cart** - 购物车表
   - 用户购物车商品和数量

6. **categories** - 商品分类表
   - 商品分类信息

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd ecommerce-website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目
3. 在 SQL 编辑器中执行 `supabase-schema.sql` 创建数据表
4. 在 Settings > API 中获取项目 URL 和 anon key
5. 创建 `.env` 文件：

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 本地开发

```bash
# 启动开发服务器
npm run dev

# 或者使用 Python 简单服务器
npm run serve
```

### 5. 部署到 Netlify

1. 将代码推送到 GitHub 仓库
2. 连接 Netlify 账户
3. 在 Netlify 中设置环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. 部署完成！

## 📁 项目结构

```
ecommerce-website/
├── index.html              # 首页
├── product.html             # 商品详情页
├── cart.html                # 购物车页面
├── profile.html             # 用户中心
├── css/
│   └── style.css            # 全局样式
├── js/
│   ├── supabase.js          # Supabase API 服务
│   └── utils.js             # 工具函数
├── supabase-schema.sql      # 数据库结构
├── netlify.toml             # Netlify 配置
├── package.json             # 项目依赖
└── README.md                # 项目文档
```

## 🎯 功能页面

### 1. 首页 (index.html)
- 商品展示网格
- 分类筛选
- 搜索功能
- 快速添加到购物车

### 2. 商品详情页 (product.html)
- 商品详细信息
- 数量选择
- 加入购物车
- 相关推荐
- 立即购买

### 3. 购物车页面 (cart.html)
- 购物车商品管理
- 数量修改
- 商品删除
- 订单结算
- 推荐商品

### 4. 用户中心 (profile.html)
- 个人资料管理
- 订单历史查看
- 账户设置
- 收货地址管理

## 🔧 配置说明

### Supabase 配置

1. **数据库表**: 运行 `supabase-schema.sql` 创建所有必要的表
2. **RLS 策略**: 已配置行级安全策略，确保用户只能访问自己的数据
3. **触发器**: 自动更新 `updated_at` 字段
4. **索引**: 优化查询性能的数据库索引

### Netlify 配置

项目已配置 `netlify.toml`，包含：
- 构建设置
- 重定向规则
- 环境变量配置

## 🛠️ 开发指南

### 添加新功能

1. 在相应页面添加 HTML 结构
2. 在 `css/style.css` 中添加样式
3. 在 `js/supabase.js` 中添加 API 调用
4. 在 `js/utils.js` 中添加工具函数

### 数据库操作

```javascript
// 获取商品
const products = await window.supabaseService.getProducts();

// 添加到购物车
await window.supabaseService.addToCart(productId, quantity);

// 创建订单
await window.supabaseService.createOrder(shippingAddress);
```

### 样式规范

- 使用 CSS 变量定义颜色
- 移动优先的响应式设计
- 组件化的样式结构

## 📱 响应式设计

网站完全响应式，支持：
- 桌面端 (1200px+)
- 平板端 (768px-1199px)
- 移动端 (320px-767px)

## 🔒 安全特性

- Supabase RLS (行级安全)
- 环境变量保护敏感信息
- 输入验证和错误处理
- XSS 防护

## 🚀 性能优化

- 图片懒加载
- 防抖搜索
- 组件缓存
- 压缩的资源

## 📝 API 文档

### SupabaseService 类

#### 商品相关
- `getProducts()` - 获取所有商品
- `getProductById(id)` - 获取单个商品
- `getProductsByCategory(category)` - 按分类获取商品

#### 购物车相关
- `getCart()` - 获取用户购物车
- `addToCart(productId, quantity)` - 添加商品到购物车
- `updateCartItemQuantity(id, quantity)` - 更新购物车商品数量
- `removeFromCart(id)` - 移除购物车商品

#### 订单相关
- `createOrder(shippingAddress)` - 创建订单
- `getUserOrders()` - 获取用户订单

#### 用户相关
- `updateUserProfile(profileData)` - 更新用户资料
- `getCurrentUser()` - 获取当前用户
- `isAuthenticated()` - 检查是否已登录

## 🐛 故障排除

### 常见问题

1. **Supabase 连接失败**
   - 检查环境变量是否正确设置
   - 确认 Supabase 项目 URL 和 API Key

2. **商品加载失败**
   - 检查数据库表是否已创建
   - 确认 RLS 策略配置正确

3. **购物车功能异常**
   - 确认用户已登录
   - 检查用户权限设置

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

MIT License

## 📞 支持

如有问题，请提交 Issue 或联系开发团队。

---

**技术栈说明**: 这是一个纯前端项目，使用 Supabase 作为后端即服务 (BaaS)，实现了完整的电商功能。所有数据都存储在 Supabase 的 PostgreSQL 数据库中，通过 JavaScript 客户端直接调用 API。