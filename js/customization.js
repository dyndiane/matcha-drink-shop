// Customization Modal Functionality

let currentProduct = null;
let basePrice = 0;

// Initialize customization modal
function initCustomization() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const closeModalBtn = document.getElementById('close-customize-modal');
    const cancelBtn = document.getElementById('cancel-customize');
    const modal = document.getElementById('customization-modal');
    
    // Add event listeners to all "Customize & Order" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = parseInt(this.getAttribute('data-price'));
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-img').src;
            
            openCustomizationModal(productName, productPrice, productImage);
        });
    });
    
    // Close modal events
    closeModalBtn.addEventListener('click', closeCustomizationModal);
    cancelBtn.addEventListener('click', closeCustomizationModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCustomizationModal();
        }
    });
    
    // Add event listeners for option changes to update price
    setupOptionListeners();
    
    // Add to cart final button
    document.getElementById('add-to-cart-final').addEventListener('click', addCustomizedItemToCart);
}

// Open customization modal
function openCustomizationModal(productName, price, imageUrl) {
    currentProduct = productName;
    basePrice = price;
    
    // Update modal content
    document.getElementById('customize-product-name').textContent = `Customize ${productName}`;
    document.getElementById('summary-product-name').textContent = productName;
    document.getElementById('customize-product-image').src = imageUrl;
    document.getElementById('customize-product-image').alt = productName;
    
    // Update prices
    document.getElementById('summary-product-price').textContent = `Base Price: ₱${price}`;
    document.getElementById('base-price').textContent = `₱${price}`;
    document.getElementById('total-price').textContent = `₱${price}`;
    
    // Reset form
    resetCustomizationForm();
    
    // Show modal
    const modal = document.getElementById('customization-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close customization modal
function closeCustomizationModal() {
    const modal = document.getElementById('customization-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Reset customization form
function resetCustomizationForm() {
    // Reset radio buttons to default
    document.querySelector('input[name="milk"][value="dairy"]').checked = true;
    document.querySelector('input[name="sugar"][value="0"]').checked = true;
    
    // Reset checkboxes
    document.querySelectorAll('input[name="addon"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset textarea
    document.getElementById('special-instructions').value = '';
    
    // Reset price display
    document.getElementById('extra-charges').textContent = '₱0';
    document.getElementById('total-price').textContent = `₱${basePrice}`;
}

// Setup listeners for option changes
function setupOptionListeners() {
    // Milk selection
    document.querySelectorAll('input[name="milk"]').forEach(radio => {
        radio.addEventListener('change', updatePrice);
    });
    
    // Sugar level
    document.querySelectorAll('input[name="sugar"]').forEach(radio => {
        radio.addEventListener('change', updatePrice);
    });
    
    // Add-ons
    document.querySelectorAll('input[name="addon"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePrice);
    });
}

// Update price based on selections
function updatePrice() {
    let extraCharges = 0;
    
    // Check milk selection
    const selectedMilk = document.querySelector('input[name="milk"]:checked');
    if (selectedMilk && selectedMilk.value === 'non-dairy') {
        extraCharges += 20;
    }
    
    // Check add-ons
    const selectedAddons = document.querySelectorAll('input[name="addon"]:checked');
    extraCharges += selectedAddons.length * 30;
    
    // Update display
    document.getElementById('extra-charges').textContent = `₱${extraCharges}`;
    
    const totalPrice = basePrice + extraCharges;
    document.getElementById('total-price').textContent = `₱${totalPrice}`;
}

// Add customized item to cart
function addCustomizedItemToCart() {
    // Gather all selections
    const milk = document.querySelector('input[name="milk"]:checked').value;
    const sugar = document.querySelector('input[name="sugar"]:checked').value;
    const addons = [];
    document.querySelectorAll('input[name="addon"]:checked').forEach(checkbox => {
        addons.push(checkbox.value);
    });
    
    const specialInstructions = document.getElementById('special-instructions').value;
    const totalPrice = parseInt(document.getElementById('total-price').textContent.replace('₱', ''));
    
    // Create cart item object
    const cartItem = {
        id: Date.now(), // Unique ID
        name: currentProduct,
        basePrice: basePrice,
        totalPrice: totalPrice,
        milk: milk === 'dairy' ? 'Dairy Milk' : 'Non-Dairy Milk',
        sugarLevel: `${sugar}% Sugar`,
        addons: addons.map(addon => {
            switch(addon) {
                case 'nata': return 'Nata de Coco';
                case 'boba': return 'Boba Pearls';
                case 'popping-boba': return 'Popping Boba';
                default: return addon;
            }
        }),
        specialInstructions: specialInstructions,
        quantity: 1
    };
    
    // Add to cart (cart.js will handle this)
    addToCart(cartItem);
    
    // Show confirmation
    showNotification(`${currentProduct} added to cart!`);
    
    // Close modal
    closeCustomizationModal();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #454126;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCustomization);