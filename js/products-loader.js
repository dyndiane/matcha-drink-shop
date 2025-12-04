// Simple Products Loader - Only for JSON requirement
// This doesn't replace your HTML, just loads the data for reference

let productsData = [];

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('../data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        
        const data = await response.json();
        productsData = data.products;
        console.log('Products loaded from JSON:', productsData);
        
        // Optional: You can use this data for other features
        // like search, filtering, or analytics
        return productsData;
    } catch (error) {
        console.error('Error loading products JSON:', error);
        // Fallback: Extract data from existing HTML
        extractProductsFromHTML();
        return productsData;
    }
}

// Filter function
function filterProducts(filter) {
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide products based on filter
    productCards.forEach(card => {
        const badge = card.querySelector('.product-badge');
        
        switch(filter) {
            case 'all':
                card.style.display = 'block';
                break;
            case 'popular':
                if (badge && badge.textContent.includes('Bestseller')) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                break;
            case 'new':
                if (badge && badge.textContent.includes('New')) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                break;
            default:
                card.style.display = 'block';
        }
    });
}

// Extract product data from existing HTML (fallback)
function extractProductsFromHTML() {
    const productCards = document.querySelectorAll('.product-card');
    productsData = [];
    
    productCards.forEach(card => {
        const id = parseInt(card.dataset.productId) || 0;
        const name = card.querySelector('.product-name').textContent;
        const description = card.querySelector('.product-desc').textContent;
        const price = parseInt(card.querySelector('.product-price').textContent.replace('₱', ''));
        const image = card.querySelector('.product-img').src.split('/').pop();
        
        // Check if it's popular (has badge)
        const badge = card.querySelector('.product-badge');
        const popular = badge ? badge.textContent.includes('Bestseller') || badge.textContent.includes('Popular') : false;
        
        productsData.push({
            id,
            name,
            description,
            price,
            category: "Cold Drinks", // All your products are cold drinks
            image,
            popular,
            tags: [] // Can be empty, or extract from somewhere
        });
    });
    
    console.log('Products extracted from HTML:', productsData);
}

// Get product by ID
function getProductById(id) {
    return productsData.find(product => product.id === id);
}

// Get product by name
function getProductByName(name) {
    return productsData.find(product => product.name === name);
}

// Get all products
function getAllProducts() {
    return [...productsData];
}

// Search products (optional feature)
function searchProducts(query) {
    if (!query.trim()) return productsData;
    
    const searchTerm = query.toLowerCase();
    return productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProducts);