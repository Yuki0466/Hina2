// Supabase 配置和 API 服务
class SupabaseService {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            // 从环境变量获取配置
            const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || localStorage.getItem('supabase_url');
            const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key');

            if (!supabaseUrl || !supabaseAnonKey) {
                console.warn('Supabase 配置缺失，请检查环境变量');
                this.showConfigHelp();
                return;
            }

            // 初始化 Supabase 客户端
            this.supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
            
            // 检查当前用户
            const { data: { user } } = await this.supabase.auth.getUser();
            this.currentUser = user;

            // 监听认证状态变化
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.currentUser = session?.user || null;
                if (event === 'SIGNED_IN') {
                    console.log('用户已登录:', this.currentUser?.email);
                } else if (event === 'SIGNED_OUT') {
                    console.log('用户已登出');
                    this.currentUser = null;
                }
            });

        } catch (error) {
            console.error('Supabase 初始化失败:', error);
        }
    }

    showConfigHelp() {
        const helpDiv = document.createElement('div');
        helpDiv.className = 'error';
        helpDiv.innerHTML = `
            <h3>Supabase 配置需要</h3>
            <p>请按以下步骤配置 Supabase：</p>
            <ol>
                <li>访问 <a href="https://supabase.com/dashboard" target="_blank">Supabase Dashboard</a></li>
                <li>创建新项目或选择现有项目</li>
                <li>在 Settings > API 中找到 URL 和 anon public key</li>
                <li>创建 .env 文件并添加配置：</li>
                <pre>VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key</pre>
                <li>或者在控制台中临时设置：
                <pre>localStorage.setItem('supabase_url', 'your_project_url');
localStorage.setItem('supabase_anon_key', 'your_anon_key');</pre>
            </ol>
        `;
        document.body.prepend(helpDiv);
    }

    // 获取所有商品
    async getProducts() {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('获取商品失败:', error);
            throw error;
        }
    }

    // 根据ID获取商品
    async getProductById(id) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('获取商品详情失败:', error);
            throw error;
        }
    }

    // 根据分类获取商品
    async getProductsByCategory(category) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('category', category)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('获取分类商品失败:', error);
            throw error;
        }
    }

    // 获取所有分类
    async getCategories() {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('获取分类失败:', error);
            throw error;
        }
    }

    // 获取用户购物车
    async getCart() {
        if (!this.currentUser) return [];
        
        try {
            const { data, error } = await this.supabase
                .from('cart')
                .select(`
                    *,
                    products (*)
                `)
                .eq('user_id', this.currentUser.id);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('获取购物车失败:', error);
            throw error;
        }
    }

    // 添加商品到购物车
    async addToCart(productId, quantity = 1) {
        if (!this.currentUser) {
            throw new Error('请先登录');
        }

        try {
            // 检查商品是否存在
            const product = await this.getProductById(productId);
            if (!product || !product.is_active) {
                throw new Error('商品不存在或已下架');
            }

            // 检查购物车中是否已有该商品
            const { data: existingItem } = await this.supabase
                .from('cart')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .eq('product_id', productId)
                .single();

            if (existingItem) {
                // 更新数量
                const newQuantity = existingItem.quantity + quantity;
                const { data, error } = await this.supabase
                    .from('cart')
                    .update({ quantity: newQuantity })
                    .eq('id', existingItem.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } else {
                // 添加新商品
                const { data, error } = await this.supabase
                    .from('cart')
                    .insert({
                        user_id: this.currentUser.id,
                        product_id: productId,
                        quantity: quantity
                    })
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error('添加到购物车失败:', error);
            throw error;
        }
    }

    // 更新购物车商品数量
    async updateCartItemQuantity(cartItemId, quantity) {
        if (!this.currentUser) {
            throw new Error('请先登录');
        }

        try {
            const { data, error } = await this.supabase
                .from('cart')
                .update({ quantity: quantity })
                .eq('id', cartItemId)
                .eq('user_id', this.currentUser.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('更新购物车数量失败:', error);
            throw error;
        }
    }

    // 从购物车移除商品
    async removeFromCart(cartItemId) {
        if (!this.currentUser) {
            throw new Error('请先登录');
        }

        try {
            const { error } = await this.supabase
                .from('cart')
                .delete()
                .eq('id', cartItemId)
                .eq('user_id', this.currentUser.id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('移除购物车商品失败:', error);
            throw error;
        }
    }

    // 创建订单
    async createOrder(shippingAddress) {
        if (!this.currentUser) {
            throw new Error('请先登录');
        }

        try {
            // 获取购物车商品
            const cartItems = await this.getCart();
            if (cartItems.length === 0) {
                throw new Error('购物车为空');
            }

            // 计算总金额
            const totalAmount = cartItems.reduce((total, item) => {
                return total + (item.products.price * item.quantity);
            }, 0);

            // 创建订单
            const { data: order, error: orderError } = await this.supabase
                .from('orders')
                .insert({
                    user_id: this.currentUser.id,
                    total_amount: totalAmount,
                    shipping_address: shippingAddress,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 创建订单商品记录
            const orderItems = cartItems.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.products.price,
                total_price: item.products.price * item.quantity
            }));

            const { error: itemsError } = await this.supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 清空购物车
            await this.supabase
                .from('cart')
                .delete()
                .eq('user_id', this.currentUser.id);

            return order;
        } catch (error) {
            console.error('创建订单失败:', error);
            throw error;
        }
    }

    // 获取用户订单
    async getUserOrders() {
        if (!this.currentUser) return [];

        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (*)
                    )
                `)
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('获取用户订单失败:', error);
            throw error;
        }
    }

    // 更新用户资料
    async updateUserProfile(profileData) {
        if (!this.currentUser) {
            throw new Error('请先登录');
        }

        try {
            const { data, error } = await this.supabase
                .from('users')
                .update(profileData)
                .eq('id', this.currentUser.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('更新用户资料失败:', error);
            throw error;
        }
    }

    // 获取当前用户信息
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查是否已登录
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// 创建全局实例
window.supabaseService = new SupabaseService();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseService;
}