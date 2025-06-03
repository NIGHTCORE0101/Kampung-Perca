class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.initCart();
        this.renderCart();
    }

    initCart() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
    }

    addToCart(product, quantity = 1, size = 'M', color = 'multi') {
        const existingItem = this.cart.find(item => 
            item.id === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity,
                size,
                color,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.showAddToCartNotification(product.name);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.dispatchCartUpdateEvent();
    }

    dispatchCartUpdateEvent() {
        window.dispatchEvent(new Event('cartUpdated'));
    }

    showAddToCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart!</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    renderCart() {
        const cartItemsList = document.querySelector('.cart-items-list');
        if (!cartItemsList) return;

        if (this.cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartItemsList.innerHTML = '';
        
        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-product">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-product-info">
                        <h4>${item.name}</h4>
                        <p>${item.size} | ${item.color}</p>
                    </div>
                </div>
                <div class="cart-price">$${item.price.toFixed(2)}</div>
                <div class="cart-quantity">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-remove" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItemsList.appendChild(cartItem);
        });

        this.updateCartSummary();
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 5.99; // Standard shipping
        const tax = subtotal * 0.1; // 10% tax

        if (document.querySelector('.cart-subtotal')) {
            document.querySelector('.cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.querySelector('.cart-shipping').textContent = `$${shipping.toFixed(2)}`;
            document.querySelector('.cart-tax').textContent = `$${tax.toFixed(2)}`;
            document.querySelector('.cart-total').textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;
        }
    }

    setupEventListeners() {
        // Quantity controls
        document.addEventListener('click', e => {
            if (e.target.closest('.quantity-btn')) {
                const btn = e.target.closest('.quantity-btn');
                const productId = parseInt(btn.dataset.id);
                const isPlus = btn.classList.contains('plus');
                const item = this.cart.find(item => item.id === productId);
                
                if (item) {
                    if (isPlus) {
                        this.updateQuantity(productId, item.quantity + 1);
                    } else if (item.quantity > 1) {
                        this.updateQuantity(productId, item.quantity - 1);
                    }
                }
            }
        });

        // Manual quantity input
        document.addEventListener('change', e => {
            if (e.target.classList.contains('quantity-input')) {
                const input = e.target;
                const productId = parseInt(input.dataset.id);
                const newQuantity = parseInt(input.value);
                
                if (newQuantity > 0) {
                    this.updateQuantity(productId, newQuantity);
                } else {
                    input.value = 1;
                }
            }
        });

        // Remove items
        document.addEventListener('click', e => {
            if (e.target.closest('.cart-remove')) {
                const btn = e.target.closest('.cart-remove');
                const productId = parseInt(btn.dataset.id);
                this.removeFromCart(productId);
            }
        });

        // Update cart button
        const updateCartBtn = document.getElementById('updateCartBtn');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', () => {
                this.showAddToCartNotification('Cart updated');
            });
        }

        // Apply coupon button
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                const couponCode = document.getElementById('couponCode').value.trim();
                if (couponCode === 'PATCH10') {
                    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const discount = subtotal * 0.1;
                    const shipping = 5.99;
                    const tax = (subtotal - discount) * 0.1;
                    
                    document.querySelector('.cart-subtotal').textContent = `$${(subtotal - discount).toFixed(2)}`;
                    document.querySelector('.cart-tax').textContent = `$${tax.toFixed(2)}`;
                    document.querySelector('.cart-total').textContent = `$${(subtotal - discount + shipping + tax).toFixed(2)}`;
                    
                    this.showAddToCartNotification('Coupon applied! 10% discount');
                } else {
                    this.showAddToCartNotification('Invalid coupon code', 'error');
                }
            });
        }

        // Proceed to checkout button
        const checkoutBtn = document.getElementById('proceedToCheckoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showAddToCartNotification('Your cart is empty', 'error');
                    return;
                }
                window.location.href = 'payment.html';
            });
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cart = new ShoppingCart();
    
    // Expose cart to window for global access if needed
    window.shoppingCart = cart;
});