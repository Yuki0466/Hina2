-- 电商网站数据库结构
-- 创建4张核心数据表：用户、商品、订单、购物车

-- 1. 用户表 (users)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 商品表 (products)
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    stock_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 订单表 (orders)
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    shipping_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 订单商品表 (order_items) - 订单与商品的关联表
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 购物车表 (cart)
CREATE TABLE IF NOT EXISTS cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 6. 商品分类表 (categories)
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入示例数据

-- 插入商品分类
INSERT INTO categories (name, description) VALUES
    ('电子产品', '手机、电脑、数码产品等'),
    ('服装鞋帽', '男装、女装、童装、鞋子等'),
    ('家居用品', '家具、装饰品、生活用品等'),
    ('食品饮料', '零食、饮料、生鲜等'),
    ('图书文具', '图书、文具、办公用品等');

-- 插入示例商品
INSERT INTO products (name, description, price, category, image_url, stock_count) VALUES
    ('iPhone 15 Pro', '最新款苹果手机，搭载A17 Pro芯片，钛金属设计', 8999.00, '电子产品', 'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300', 50),
    ('MacBook Pro 14"', '专业级笔记本电脑，M3 Pro芯片，适合创意工作', 14999.00, '电子产品', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300', 30),
    ('运动鞋', '舒适透气的运动鞋，适合跑步和健身', 399.00, '服装鞋帽', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', 100),
    ('无线耳机', '降噪蓝牙耳机，续航30小时', 899.00, '电子产品', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', 80),
    ('瑜伽垫', '防滑瑜伽垫，厚度8mm，环保材质', 129.00, '家居用品', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300', 200),
    ('咖啡豆', '精选阿拉比卡咖啡豆，中度烘焙', 89.00, '食品饮料', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300', 150),
    ('编程书籍', 'JavaScript高级程序设计第四版', 129.00, '图书文具', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 60),
    ('智能手表', '多功能智能手表，支持心率监测和GPS', 1999.00, '电子产品', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', 45),
    ('背包', '时尚双肩背包，防水材质，大容量', 299.00, '服装鞋帽', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', 75),
    ('台灯', 'LED护眼台灯，可调节亮度和色温', 199.00, '家居用品', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 120);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);

-- 创建触发器以自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全性 (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS 策略示例
-- 用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- 订单相关策略
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 购物车策略
CREATE POLICY "Users can view own cart" ON cart FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own cart" ON cart FOR ALL USING (auth.uid()::text = user_id::text);

-- 商品表允许所有人读取
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view products" ON products FOR SELECT USING (is_active = true);