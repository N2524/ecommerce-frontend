// Product Detail Page JavaScript

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch product data
async function fetchProductData(productId) {
    // Simulating an API call to fetch product data
    const products = [
        {
            id: 1,
            title: "Modern Wireless Headphones",
            price: 99.99,
            description: "High-quality wireless headphones with noise cancellation.",
            image: "https://storage.googleapis.com/a1aa/image/f85f7a48-fd84-461e-c092-1e9b6225aa19.jpg",
            variants: {
                sizes: ["Small", "Medium", "Large"],
                colors: ["Black", "White", "Red"]
            }
        },
        {
            id: 2,
            title: "Smart Fitness Watch",
            price: 149.99,
            description: "Track your fitness goals with this smart watch.",
            image: "https://storage.googleapis.com/a1aa/image/600f7fbc-df75-45c9-4b69-9e9ce74e20c2.jpg",
            variants: {
                sizes: ["One Size"],
                colors: ["Black", "Blue"]
            }
        }
    ];

    return products.find(product => product.id === parseInt(productId));
}

// Function to display product details
async function displayProductDetails() {
    const productId = getUrlParameter('id');
    const product = await fetchProductData(productId);

    if (product) {
        document.getElementById('product-title').innerText = product.title;
        document.getElementById('product-price').innerText = `$${product.price.toFixed(2)}`;
        document.getElementById('product-description').innerText = product.description;
        document.getElementById('product-main-image').src = product.image;

        // Populate size and color variants
        const sizeSelect = document.getElementById('size-select');
        product.variants.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.innerText = size;
            sizeSelect.appendChild(option);
        });

        const colorSelect = document.getElementById('color-select');
        product.variants.colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.innerText = color;
            colorSelect.appendChild(option);
        });
    } else {
        document.querySelector('.product-detail-container').innerHTML = '<div class="error"><h3>Product not found</h3></div>';
    }

    // Debugging logs for elements
    console.log('Product Title Element:', document.getElementById('product-title'));
    console.log('Product Price Element:', document.getElementById('product-price'));
    console.log('Product Description Element:', document.getElementById('product-description'));
    console.log('Product Main Image Element:', document.getElementById('product-main-image'));
}

// Function to handle "Add to Cart" functionality
function addToCart() {
    const productId = getUrlParameter('id');
    const product = {
        id: parseInt(productId),
        title: document.getElementById('product-title').innerText,
        price: parseFloat(document.getElementById('product-price').innerText.replace('$', '')),
        image: document.getElementById('product-main-image').src,
        quantity: parseInt(document.getElementById('quantity').value),
        size: document.querySelector('.variant-btn[data-variant="size"].active')?.dataset.value || '',
        color: document.querySelector('.variant-btn[data-variant="color"].active')?.dataset.value || ''
    };

    if (cartService.addItem(product)) {
        // Show success message
        const successMsg = document.getElementById('success-message');
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
        
        // Update cart badge
        document.getElementById('cart-badge').textContent = cartService.getItemCount();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    displayProductDetails();
    
    document.getElementById('add-to-cart').addEventListener('click', addToCart);
});
