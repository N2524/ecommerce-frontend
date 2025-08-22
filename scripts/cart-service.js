/**
 * Enhanced Cart Service - Centralized cart management
 * Handles all cart operations with persistence and validation
 */

class CartService {
    constructor() {
        this.cartKey = 'ecommerce-cart';
        this.cart = this.loadCart();
        this.listeners = [];
    }

    /**
     * Check if localStorage is available
     */
    isLocalStorageAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Load cart from localStorage
     */
    loadCart() {
        if (!this.isLocalStorageAvailable()) {
            console.warn('localStorage is not available, using in-memory cart');
            return [];
        }
        
        try {
            const savedCart = localStorage.getItem(this.cartKey);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        if (!this.isLocalStorageAvailable()) {
            console.warn('localStorage is not available, cart not persisted');
            this.notifyListeners();
            return;
        }
        
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
            this.notifyListeners();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    /**
     * Add item to cart
     */
    addItem(product) {
        const { id, title, price, image, size, color, quantity = 1 } = product;
        
        // Validate product data
        if (!id || !title || !price || !image) {
            console.error('Invalid product data:', product);
            return false;
        }

        // Check if item already exists (same id, size, color)
        const existingItemIndex = this.cart.findIndex(item => 
            item.id === id && 
            item.size === size && 
            item.color === color
        );

        if (existingItemIndex > -1) {
            // Update quantity
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            this.cart.push({
                id,
                title,
                price: parseFloat(price),
                image,
                size: size || '',
                color: color || '',
                quantity: Math.max(1, parseInt(quantity)),
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        return true;
    }

    /**
     * Remove item from cart
     */
    removeItem(index) {
        if (index >= 0 && index < this.cart.length) {
            this.cart.splice(index, 1);
            this.saveCart();
            return true;
        }
        return false;
    }

    /**
     * Update item quantity
     */
    updateQuantity(index, newQuantity) {
        if (index >= 0 && index < this.cart.length) {
            const quantity = Math.max(1, parseInt(newQuantity));
            this.cart[index].quantity = quantity;
            this.saveCart();
            return true;
        }
        return false;
    }

    /**
     * Get cart items
     */
    getCart() {
        return [...this.cart];
    }

    /**
     * Get cart summary
     */
    getCartSummary() {
        const items = this.cart.length;
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
            items,
            total: parseFloat(total.toFixed(2)),
            formattedTotal: `$${total.toFixed(2)}`
        };
    }

    /**
     * Clear entire cart
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    /**
     * Check if cart is empty
     */
    isEmpty() {
        return this.cart.length === 0;
    }

    /**
     * Get item count (total quantity)
     */
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Add event listener for cart changes
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove event listener
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    /**
     * Notify all listeners of cart changes
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.cart);
            } catch (error) {
                console.error('Error in cart listener:', error);
            }
        });
    }

    /**
     * Validate cart data
     */
    validateCart() {
        const validCart = this.cart.filter(item => 
            item.id && 
            item.title && 
            typeof item.price === 'number' && 
            item.price > 0 &&
            item.image &&
            typeof item.quantity === 'number' && 
            item.quantity > 0
        );

        if (validCart.length !== this.cart.length) {
            console.warn('Invalid cart items removed');
            this.cart = validCart;
            this.saveCart();
        }
    }

    /**
     * Export cart data
     */
    exportCart() {
        return {
            items: this.cart,
            summary: this.getCartSummary(),
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Import cart data
     */
    importCart(cartData) {
        if (Array.isArray(cartData)) {
            this.cart = cartData;
            this.validateCart();
            this.saveCart();
            return true;
        }
        return false;
    }
}

// Create global cart instance
const cartService = new CartService();

// Export for use in other files
window.cartService = cartService;
