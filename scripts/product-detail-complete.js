// Product Detail JavaScript - Complete with all features
document.addEventListener('DOMContentLoaded', function() {
    // Product data
    const product = {
        id: 1,
        title: 'Premium Cotton T-Shirt',
        price: 29.99,
        originalPrice: 39.99,
        description: 'Experience ultimate comfort with our Premium Cotton T-Shirt. Made from 100% organic cotton, this shirt offers exceptional softness and breathability.',
        images: [
            'assets/images/fashion.jpeg',
            'assets/images/ele_brand.jpg',
            'assets/images/home-decoration.jpg'
        ],
        rating: 4.5,
        reviews: 24,
        sku: 'TSHIRT-001',
        category: 'Clothing',
        tags: ['cotton', 't-shirt', 'casual', 'premium'],
        variants: {
            size: ['S', 'M', 'L', 'XL', 'XXL'],
            color: ['black', 'white', 'navy', 'red']
        },
        availableVariants: {
            size: ['S', 'M', 'L', 'XL'],
            color: ['black', 'white', 'navy']
        }
    };

    // Initialize product
    initializeProduct(product);
    initializeImageZoom();
    initializeCart();
});

function initializeProduct(product) {
    // Set product data
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('product-price').textContent = `$${product.price}`;
    document.getElementById('original-price').textContent = `$${product.originalPrice}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-sku').textContent = product.sku;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-tags').textContent = product.tags.join(', ');
    
    // Set main image
    document.getElementById('product-main-image').src = product.images[0];
    
    // Setup variants
    setupVariantButtons(product);
    
    // Setup quantity selector
    setupQuantitySelector(product);
    
    // Setup price updates
    setupPriceUpdates(product);
    
    // Setup add to cart
    setupAddToCart(product);
}

function initializeImageZoom() {
    const mainImage = document.getElementById('product-main-image');
    const zoomLens = document.getElementById('zoom-lens');
    const zoomResult = document.getElementById('zoom-result');
    const imageContainer = document.getElementById('main-image-container');

    if (!mainImage || !zoomLens || !zoomResult) return;

    // Set up zoom functionality
    imageContainer.addEventListener('mouseenter', function() {
        zoomLens.style.display = 'block';
        zoomResult.style.display = 'block';
    });

    imageContainer.addEventListener('mouseleave', function() {
        zoomLens.style.display = 'none';
        zoomResult.style.display = 'none';
    });

    imageContainer.addEventListener('mousemove', function(e) {
        const rect = mainImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const lensWidth = zoomLens.offsetWidth;
        const lensHeight = zoomLens.offsetHeight;
        const imageWidth = mainImage.offsetWidth;
        const imageHeight = mainImage.offsetHeight;

        let lensX = x - lensWidth / 2;
        let lensY = y - lensHeight / 2;

        // Keep lens within image bounds
        if (lensX < 0) lensX = 0;
        if (lensY < 0) lensY = 0;
        if (lensX > imageWidth - lensWidth) lensX = imageWidth - lensWidth;
        if (lensY > imageHeight - lensHeight) lensY = imageHeight - lensHeight;

        zoomLens.style.left = lensX + 'px';
        zoomLens.style.top = lensY + 'px';

        // Calculate zoom ratio
        const ratioX = mainImage.naturalWidth / imageWidth;
        const ratioY = mainImage.naturalHeight / imageHeight;

        const zoomX = lensX * ratioX;
        const zoomY = lensY * ratioY;

        zoomResult.style.backgroundImage = `url(${mainImage.src})`;
        zoomResult.style.backgroundSize = `${imageWidth * 2}px ${imageHeight * 2}px`;
        zoomResult.style.backgroundPosition = `-${zoomX * 2}px -${zoomY * 2}px`;
    });

    // Touch support for mobile
    imageContainer.addEventListener('touchstart', function(e) {
        e.preventDefault();
        zoomLens.style.display = 'block';
        zoomResult.style.display = 'block';
    });

    imageContainer.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = mainImage.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const lensWidth = zoomLens.offsetWidth;
        const lensHeight = zoomLens.offsetHeight;
        const imageWidth = mainImage.offsetWidth;
        const imageHeight = mainImage.offsetHeight;

        let lensX = x - lensWidth / 2;
        let lensY = y - lensHeight / 2;

        if (lensX < 0) lensX = 0;
        if (lensY < 0) lensY = 0;
        if (lensX > imageWidth - lensWidth) lensX = imageWidth - lensWidth;
        if (lensY > imageHeight - lensHeight) lensY = imageHeight - lensHeight;

        zoomLens.style.left = lensX + 'px';
        zoomLens.style.top = lensY + 'px';

        const ratioX = mainImage.naturalWidth / imageWidth;
        const ratioY = mainImage.naturalHeight / imageHeight;

        const zoomX = lensX * ratioX;
        const zoomY = lensY * ratioY;

        zoomResult.style.backgroundImage = `url(${mainImage.src})`;
        zoomResult.style.backgroundSize = `${imageWidth * 2}px ${imageHeight * 2}px`;
        zoomResult.style.backgroundPosition = `-${zoomX * 2}px -${zoomY * 2}px`;
    });

    imageContainer.addEventListener('touchend', function() {
        zoomLens.style.display = 'none';
        zoomResult.style.display = 'none';
    });
}

function setupVariantButtons(product) {
    const sizeButtons = document.querySelectorAll('[data-variant="size"]');
    const colorButtons = document.querySelectorAll('[data-variant="color"]');
    
    // Size selection
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('unavailable')) return;
            
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updatePrice();
        });
    });
    
    // Color selection
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('unavailable')) return;
            
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updatePrice();
        });
    });
}

function setupQuantitySelector(product) {
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity');
    const quantityDisplay = document.getElementById('quantity-display');
    
    decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            quantityDisplay.textContent = currentValue - 1;
            updatePrice();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) { // Max quantity
            quantityInput.value = currentValue + 1;
            quantityDisplay.textContent = currentValue + 1;
            updatePrice();
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        this.value = value;
        quantityDisplay.textContent = value;
        updatePrice();
    });
}

function setupPriceUpdates(product) {
    // Initialize price display
    updatePrice();
}

function updatePrice() {
    const basePrice = 29.99;
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = basePrice * quantity;
    
    document.getElementById('base-price').textContent = `$${basePrice.toFixed(2)}`;
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}

function setupAddToCart(product) {
    const addToCartBtn = document.getElementById('add-to-cart');
    const successMessage = document.getElementById('success-message');
    
    addToCartBtn.addEventListener('click', function() {
        const selectedSize = document.querySelector('[data-variant="size"].active')?.dataset.value || '';
        const selectedColor = document.querySelector('[data-variant="color"].active')?.dataset.value || '';
        const quantity = parseInt(document.getElementById('quantity').value);
        
        if (!selectedSize || !selectedColor) {
            showNotification('Please select size and color', 'error');
            return;
        }
        
        // Create cart item
        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
            image: product.images[0]
        };
        
        // Add to cart using cart service
        const success = cartService.addItem(cartItem);
        
        if (success) {
            // Show success message with animation
            showSuccessMessage();
            
            // Add cart animation
            animateCartAdd();
            
            // Update cart count
            updateCartCount();
        }
    });
}

function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'flex';
    successMessage.style.animation = 'slideIn 0.3s ease-out';
    
    setTimeout(() => {
        successMessage.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 300);
    }, 2500);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fa fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function animateCartAdd() {
    const cartIcon = document.querySelector('.cart-icon');
    const addToCartBtn = document.getElementById('add-to-cart');
    
    // Add pulse animation to cart icon
    cartIcon.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
        cartIcon.style.animation = '';
    }, 500);
    
    // Add ripple effect to button
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = addToCartBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    addToCartBtn.style.position = 'relative';
    addToCartBtn.style.overflow = 'hidden';
    addToCartBtn.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function updateCartCount() {
    const count = cartService.getItemCount();
    const badge = document.getElementById('cart-badge');
    
    // Animate count change
    badge.style.transform = 'scale(1.3)';
    badge.textContent = count;
    
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 200);
}

function initializeCart() {
    updateCartCount();
    
    // Add cart service listener
    cartService.addListener(() => {
        updateCartCount();
    });
}

// Thumbnail image switching
document.addEventListener('DOMContentLoaded', function() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('product-main-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const newSrc = this.dataset.src;
            mainImage.src = newSrc;
            
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
