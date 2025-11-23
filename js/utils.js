// 通用工具函数

// 格式化价格
function formatPrice(price) {
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
    }).format(price);
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 获取订单状态的中文描述
function getOrderStatusText(status) {
    const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'shipped': '已发货',
        'delivered': '已送达',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

// 获取订单状态的CSS类
function getOrderStatusClass(status) {
    const classMap = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
    };
    return classMap[status] || 'status-pending';
}

// 显示加载状态
function showLoading(containerId = 'main') {
    const container = document.getElementById(containerId) || document.body;
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>加载中...</p>
        </div>
    `;
}

// 显示错误信息
function showError(message, containerId = 'main') {
    const container = document.getElementById(containerId) || document.body;
    container.innerHTML = `
        <div class="error">
            <h3>出错了</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">重新加载</button>
        </div>
    `;
}

// 显示成功信息
function showSuccess(message, containerId = 'main') {
    const container = document.getElementById(containerId) || document.body;
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.innerHTML = `<p>${message}</p>`;
    
    container.insertBefore(successDiv, container.firstChild);
    
    // 3秒后自动消失
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// 获取URL参数
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 跳转到指定页面
function navigateTo(page) {
    window.location.href = page;
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 确认对话框
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// 本地存储工具
const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch {
            return false;
        }
    }
};

// 购物车工具函数
const cartUtils = {
    // 获取购物车商品数量
    async getCartCount() {
        try {
            const cartItems = await window.supabaseService.getCart();
            return cartItems.reduce((total, item) => total + item.quantity, 0);
        } catch {
            return 0;
        }
    },
    
    // 更新购物车图标数量
    async updateCartIcon() {
        const cartCount = await this.getCartCount();
        const cartIcon = document.querySelector('.cart-count');
        if (cartIcon) {
            cartIcon.textContent = cartCount;
            cartIcon.style.display = cartCount > 0 ? 'flex' : 'none';
        }
    },
    
    // 添加商品到购物车
    async addToCart(productId, quantity = 1) {
        try {
            await window.supabaseService.addToCart(productId, quantity);
            showSuccess('商品已添加到购物车');
            await this.updateCartIcon();
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    }
};

// 用户认证工具
const authUtils = {
    // 检查登录状态
    checkAuth() {
        return window.supabaseService.isAuthenticated();
    },
    
    // 获取当前用户
    getCurrentUser() {
        return window.supabaseService.getCurrentUser();
    },
    
    // 需要登录的页面保护
    requireAuth() {
        if (!this.checkAuth()) {
            alert('请先登录');
            navigateTo('login.html');
            return false;
        }
        return true;
    }
};

// 搜索工具
const searchUtils = {
    // 搜索商品
    async searchProducts(query) {
        try {
            const products = await window.supabaseService.getProducts();
            if (!query) return products;
            
            const lowerQuery = query.toLowerCase();
            return products.filter(product => 
                product.name.toLowerCase().includes(lowerQuery) ||
                product.description.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery)
            );
        } catch (error) {
            showError('搜索失败: ' + error.message);
            return [];
        }
    },
    
    // 创建搜索输入框
    createSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="searchInput" placeholder="搜索商品..." class="form-input">
            <button id="searchBtn" class="btn btn-primary">搜索</button>
        `;
        return searchContainer;
    }
};

// 图片懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 页面初始化通用函数
async function initializePage() {
    // 等待 Supabase 服务初始化
    if (window.supabaseService) {
        await new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (window.supabaseService.supabase) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }
    
    // 更新购物车图标
    if (window.cartUtils) {
        await cartUtils.updateCartIcon();
    }
    
    // 初始化懒加载
    initLazyLoading();
    
    // 设置页面标题
    updatePageTitle();
}

// 更新页面标题
function updatePageTitle() {
    const title = document.title || '电商网站';
    document.title = `${title} - 优选商城`;
}

// 导出工具函数
if (typeof window !== 'undefined') {
    window.utils = {
        formatPrice,
        formatDate,
        getOrderStatusText,
        getOrderStatusClass,
        showLoading,
        showError,
        showSuccess,
        getUrlParam,
        navigateTo,
        debounce,
        confirmAction,
        storage,
        cartUtils,
        authUtils,
        searchUtils,
        initializePage
    };
}