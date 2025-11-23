# 部署指南

本文档详细说明如何将电商网站部署到 Netlify，并配置 Supabase 后端服务。

## 📋 部署清单

在开始部署之前，请确认以下事项：

- [ ] 已有 Netlify 账户
- [ ] 已有 Supabase 账户
- [ ] 已有 GitHub 账户（推荐）
- [ ] 项目代码已推送到 GitHub

## 🗄️ Supabase 配置

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 选择组织，输入项目信息：
   - **Project Name**: `ecommerce-website`
   - **Database Password**: 设置强密码
   - **Region**: 选择最近的区域
4. 点击 "Create new project"，等待项目创建完成

### 2. 配置数据库

1. 在项目仪表板中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase-schema.sql` 文件中的所有 SQL 代码
4. 粘贴到编辑器中，点击 "Run" 执行
5. 确认所有表都已创建成功

### 3. 获取 API 凭证

1. 在左侧菜单中，点击 "Settings" > "API"
2. 复制以下信息：
   - **Project URL**: 类似 `https://xxxxxxxx.supabase.co`
   - **anon public**: API 公钥

### 4. 配置认证设置

1. 点击 "Settings" > "Authentication"
2. 在 "Site URL" 中输入：`https://your-netlify-site.netlify.app`
3. 在 "Redirect URLs" 中添加相同的 URL
4. 启用 "Email" 认证提供商

## 🚀 Netlify 部署

### 方法一：通过 GitHub 连接（推荐）

#### 1. 推送代码到 GitHub

```bash
# 如果还没有 Git 仓库
git init
git add .
git commit -m "Initial commit: 电商网站"

# 创建 GitHub 仓库后
git remote add origin https://github.com/yourusername/ecommerce-website.git
git push -u origin main
```

#### 2. 连接 Netlify

1. 登录 [Netlify](https://app.netlify.com)
2. 点击 "Add new site" > "Import an existing project"
3. 选择 "GitHub"
4. 授权 Netlify 访问你的 GitHub 账户
5. 选择 `ecommerce-website` 仓库
6. 配置构建设置：
   - **Build command**: `npm run build` (或留空)
   - **Publish directory**: `.` (根目录)
   - **Node version**: `18`
7. 点击 "Deploy site"

#### 3. 配置环境变量

1. 在 Netlify 仪表板中，点击 "Site settings" > "Environment variables"
2. 添加以下环境变量：
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 方法二：直接拖拽部署（快速测试）

1. 将所有项目文件压缩为 ZIP
2. 登录 Netlify
3. 将 ZIP 文件拖拽到部署区域
4. 部署后手动设置环境变量

## ⚙️ Netlify 配置优化

### 1. 重定向规则

项目已包含 `netlify.toml` 配置文件，包含：
- SPA 路由支持（所有路由重定向到 index.html）
- 错误页面处理

### 2. 表单处理

如果需要联系表单等功能，可以启用 Netlify Forms：
1. 在 HTML 表单中添加 `data-netlify="true"`
2. Netlify 会自动处理表单提交

### 3. 无服务器函数

如需添加后端逻辑，可以在 `netlify/functions` 目录中创建函数：

```javascript
// netlify/functions/hello.js
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" })
  };
};
```

## 🔍 部署验证

### 1. 检查网站功能

部署完成后，测试以下功能：

- ✅ 页面正常加载
- ✅ 商品列表显示
- ✅ 商品详情页
- ✅ 搜索功能
- ✅ 响应式设计

### 2. 检查数据库连接

1. 打开浏览器开发者工具
2. 检查 Console 是否有错误
3. 测试添加商品到购物车功能
4. 验证数据是否正确保存到 Supabase

### 3. 检查环境变量

在浏览器控制台中运行：
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

## 🐛 常见部署问题

### 1. Supabase 连接失败

**问题**: 网站显示 "Supabase 配置缺失"

**解决方案**:
1. 检查 Netlify 环境变量是否正确设置
2. 确认变量名完全匹配（包括大小写）
3. 重新部署网站以应用新的环境变量

### 2. CORS 错误

**问题**: 浏览器控制台显示 CORS 错误

**解决方案**:
1. 在 Supabase Dashboard 中确认 "Site URL" 配置正确
2. 检查 "Redirect URLs" 包含你的域名
3. 确认使用正确的 Supabase URL（HTTPS）

### 3. 数据库权限错误

**问题**: 无法读取或写入数据

**解决方案**:
1. 确认 RLS（行级安全）策略已正确配置
2. 检查用户认证状态
3. 验证 API 密钥权限

### 4. 页面 404 错误

**问题**: 刷新页面时出现 404 错误

**解决方案**:
1. 确认 `netlify.toml` 文件存在且配置正确
2. 检查重定向规则
3. 重新部署网站

## 📊 监控和维护

### 1. 网站监控

- 使用 Netlify Analytics 监控网站流量
- 设置 uptime 检查确保网站可用性
- 监控 Supabase 使用量和性能

### 2. 备份策略

- Supabase 自动备份数据库（需启用）
- 定期备份网站代码
- 保存 Supabase 项目密钥

### 3. 更新维护

- 定期更新依赖包：`npm update`
- 监控安全漏洞
- 测试新功能前先在测试环境验证

## 🔒 安全最佳实践

### 1. 环境变量安全

- 永远不要在前端代码中硬编码 API 密钥
- 使用 Netlify 的环境变量功能
- 定期轮换 Supabase API 密钥

### 2. 数据库安全

- 启用 RLS（行级安全）
- 使用最小权限原则
- 定期审查数据库访问日志

### 3. HTTPS 强制

- Netlify 自动提供 HTTPS
- 确保所有资源都通过 HTTPS 加载
- 使用安全头（通过 netlify.toml 配置）

## 🚀 性能优化

### 1. 静态资源优化

- 压缩图片
- 启用 Gzip 压缩
- 使用 CDN（Netlify 自动提供）

### 2. 缓存策略

在 `netlify.toml` 中添加缓存规则：
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### 3. 数据库优化

- 为常用查询添加索引
- 使用 Supabase Edge Functions 处理复杂逻辑
- 实现适当的缓存策略

## 📞 技术支持

如果遇到部署问题：

1. 查看 [Netlify 文档](https://docs.netlify.com)
2. 查看 [Supabase 文档](https://supabase.com/docs)
3. 提交 GitHub Issues
4. 联系技术支持团队

---

**恭喜！** 你的电商网站现在已经成功部署到 Netlify，并连接到 Supabase 后端服务。用户可以开始浏览商品、管理购物车和下订单了。