// Enhanced Cart Page Functionality
// This file contains all the cart page features including dynamic display, quantity updates, and responsive design

class EnhancedCart {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartCount();
    }

    // Load cart from local storage
    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.renderCart();
    }

    // Save cart to local storage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Render cart items
    renderCart() {
        const cartContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartContent = document.getElementById('cart-content');
        
        if (!this.cart.length) {
            emptyCart.style.display = 'block';
            cartContent.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartContent.style.display = 'flex';

        cartContainer.innerHTML = '';
        
        this.cart.forEach((item, index) => {
            const itemElement = this.createCartItemElement(item, index);
            cartContainer.appendChild(itemElement);
        });

        this.updateTotal();
        this.updateCheckoutButton();
    }

    // Create individual cart item element
    createCartItemElement(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="item-image">
                <img src="${item.image || 'assets/images/placeholder.jpg'}" 
                     alt="${item.name}" 
                     onerror="this.src='assets/images/placeholder.jpg'">
            </div>
            <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                ${item.selectedOptions ? `
                    <div class="item-options">
                        ${Object.entries(item.selectedOptions).map(([key, value]) => 
                            `<span class="option">${key}: ${value}</span>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="item-quantity">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" onclick="cart.updateQuantity(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           max="99"
                           onchange="cart.setQuantity(${index}, this.value)"
                           class="quantity-input">
                    <button class="quantity-btn plus" onclick="cart.updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="remove-btn" onclick="cart.removeItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        return itemDiv;
    }

    // Update quantity
    updateQuantity(index, change) {
        const newQuantity = Math.max(1, this.cart[index].quantity + change);
        this.cart[index].quantity = newQuantity;
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }

    // Set specific quantity
    setQuantity(index, newQuantity) {
        const quantity = parseInt(newQuantity);
        if (isNaN(quantity) || quantity < 1) return;
        
        this.cart[index].quantity = quantity;
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }

    // Remove item from cart
    removeItem(index) {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            this.cart.splice(index, 1);
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    // Update total price calculation
    updateTotal() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    // Update cart count
    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cart-count, #cart-badge');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    // Update checkout button state
    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkout-btn');
        const isEmpty = this.cart.length === 0;
        
        checkoutBtn.disabled = isEmpty;
        checkoutBtn.style.opacity = isEmpty ? '0.5' : '1';
        checkoutBtn.style.cursor = isEmpty ? 'not-allowed' : 'pointer';
    }

    // Setup event listeners
    setupEventListeners() {
        // Continue shopping button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('continue-shopping')) {
                window.location.href = 'product.html';
            }
        });

        // Checkout button
        document.getElementById('checkout-btn')?.addEventListener('click', () => {
            if (this.cart.length > 0) {
                window.location.href = 'checkout.html';
            }
        });

        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.loadCart();
            }
        });
    }

    // Clear entire cart
    clearCart() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    // Get cart summary
    getCartSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        return {
            items: itemCount,
            subtotal: subtotal,
            total: subtotal
        };
    }
}

// Initialize cart when DOM is loaded
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new EnhancedCart();
});
