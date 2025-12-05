// Products Loader - Loads from JSON and creates HTML

async function loadProducts() {
    try {
        // Load products from JSON
        const response = await fetch('data/products.json');
        const data = await response.json();
        const products = data.products;
        
        console.log(`Loaded ${products.length} products from JSON`);
        
        // Render products to the page
        renderProducts(products);
        
        // Initialize customization buttons
        setTimeout(initCustomization, 100);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError();
    }
}

function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    // Clear loading message if any
    productsGrid.innerHTML = '';
    
    // Create product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
    // Create badge HTML if exists
    const badgeHTML = product.badge 
        ? `<div class="product-badge">${product.badge}</div>` 
        : '';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="images/products/${product.image}" alt="${product.name}" class="product-img">
            ${badgeHTML}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-price">₱${product.price}</div>
            <button class="add-to-cart-btn" data-product="${product.name}" data-price="${product.price}">
                <i class="fas fa-plus-circle"></i> Customize & Order
            </button>
        </div>
    `;
    
    return card;
}

function showError() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Products Failed to Load</h3>
            <p>Please refresh the page or check your connection</p>
        </div>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadProducts);