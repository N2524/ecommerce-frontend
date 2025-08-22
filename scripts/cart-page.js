/**
 * Cart Page JavaScript - Handles cart page functionality
 * Uses the centralized cart service for all operations
 */

class CartPage {
    constructor() {
        this.cartService = window.cartService;
        this.init();
    }

    init() {
        try {
            this.renderCart();
            this.updateCartCount();
            this.setupEventListeners();
            this.cartService.validateCart();
        } catch (error) {
            console.error('Error initializing cart page:', error);
        }
    }

    renderCart() {
        try {
            const cart = this.cartService.getCart();
            const cartContent = document.getElementById('cart-content');
            const cartSummary = document.getElementById('cart-summary');
            
            if (!cartContent || !cartSummary) {
                console.error('Cart content or summary elements not found');
                return;
            }

            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="empty-cart">
                        <i class="fa fa-shopping-cart"></i>
                        <h3>Your cart is empty</h3>
                        <p>Add some products to get started!</p>
                        <a href="product.html" class="continue-shopping">Continue Shopping</a>
                    </div>
                `;
                cartSummary.style.display = 'none';
                return;
            }

            let cartHTML = '<div class="cart-items">';
            cart.forEach((item, index) => {
                cartHTML += `
                    <div class="cart-item" data-index="${index}">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-image" 
                             onerror="this.src='assets/images/placeholder.jpg'">
                        <div class="cart-item-details">
                            <h4>${this.escapeHtml(item.title)}</h4>
                            <p>Size: ${this.escapeHtml(item.size || 'N/A')}</p>
                            <p>Color: ${this.escapeHtml(item.color || 'N/A')}</p>
                            <p>Price: $${item.price.toFixed(2)}</p>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="99" 
                                   data-index="${index}" class="quantity-input">
                            <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                        </div>
                        <div class="item-total">
                            $${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button class="remove-btn" data-index="${index}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                `;
            });
            cartHTML += '</div>';
            
            cartContent.innerHTML = cartHTML;
            cartSummary.style.display = 'block';
            this.updateSummary();
            this.setupItemEventListeners();
        } catch (error) {
            console.error('Error rendering cart:', error);
        }
    }

    setupItemEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const action = e.target.dataset.action;
                
                if (action === 'increase') {
                    this.updateQuantity(index, this.cartService.getCart()[index].quantity + 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(index, this.cartService.getCart()[index].quantity - 1);
                }
            });
        });

        // Quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                const newQuantity = parseInt(e.target.value);
                this.updateQuantity(index, newQuantity);
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeItem(index);
            });
        });
    }

    updateQuantity(index, newQuantity) {
        try {
            const quantity = Math.max(1, parseInt(newQuantity));
            if (this.cartService.updateQuantity(index, quantity)) {
                this.renderCart();
                this.updateCartCount();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    removeItem(index) {
        try {
            if (confirm('Are you sure you want to remove this item from your cart?')) {
                if (this.cartService.removeItem(index)) {
                    this.renderCart();
                    this.updateCartCount();
                }
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    updateSummary() {
        try {
            const summary = this.cartService.getCartSummary();
            const cartCount = document.getElementById('cart-count');
            const subtotal = document.getElementById('subtotal');
            const cartTotal = document.getElementById('cart-total');
            const checkoutBtn = document.getElementById('checkout-btn');

            if (cartCount) cartCount.textContent = `${summary.items} item${summary.items !== 1 ? 's' : ''}`;
            if (subtotal) subtotal.textContent = `$${summary.total.toFixed(2)}`;
            if (cartTotal) cartTotal.textContent = `$${summary.total.toFixed(2)}`;
            if (checkoutBtn) checkoutBtn.disabled = this.cartService.isEmpty();
        } catch (error) {
            console.error('Error updating summary:', error);
        }
    }

    updateCartCount() {
        try {
            const count = this.cartService.getItemCount();
            const cartBadge = document.getElementById('cart-badge');
            if (cartBadge) {
                cartBadge.textContent = count;
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    setupEventListeners() {
        try {
            // Checkout button
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    if (!this.cartService.isEmpty()) {
                        alert('Checkout functionality would be implemented here');
                        // window.location.href = 'checkout.html';
                    }
                });
            }

            // Continue shopping button
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('continue-shopping')) {
                    window.location.href = 'product.html';
                }
            });

            // Listen for cart changes from other pages
            this.cartService.addListener(() => {
                this.renderCart();
                this.updateCartCount();
            });
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.cartService) {
        new CartPage();
    } else {
        console.error('Cart service not available');
    }
});
