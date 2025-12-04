// Shopping Cart Functionality

let cart = JSON.parse(localStorage.getItem('matchaCart')) || [];
let currentCheckoutStep = 1;

// Initialize cart functionality
function initCart() {
    updateCartCount();
    setupCartEventListeners();
    renderCart();
}

// Setup cart event listeners
function setupCartEventListeners() {
    // Cart modal buttons
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart-modal');
    const closeCartBtn2 = document.getElementById('close-cart-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const cartModal = document.getElementById('cart-modal');
    
    // Cart button click
    cartBtn.addEventListener('click', openCartModal);
    
    // Close cart modal events
    closeCartBtn.addEventListener('click', closeCartModal);
    closeCartBtn2.addEventListener('click', closeCartModal);
    continueShoppingBtn.addEventListener('click', closeCartModal);
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCartModal();
        }
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
    
    // Checkout modal setup
    setupCheckoutModal();
}

// Open cart modal
function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    renderCart();
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close cart modal
function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add item to cart (called from customization.js)
function addToCart(item) {
    // Check if similar item exists (same name and customization)
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.name === item.name &&
        cartItem.milk === item.milk &&
        cartItem.sugarLevel === item.sugarLevel &&
        JSON.stringify(cartItem.addons.sort()) === JSON.stringify(item.addons.sort()) &&
        cartItem.specialInstructions === item.specialInstructions
    );
    
    if (existingItemIndex !== -1) {
        // Increase quantity if same item exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item
        cart.push(item);
    }
    
    // Save to localStorage
    saveCartToStorage();
    
    // Update UI
    updateCartCount();
    
    // If cart modal is open, update it
    if (document.getElementById('cart-modal').style.display === 'flex') {
        renderCart();
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartCount();
    renderCart();
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }
    
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCartToStorage();
        updateCartCount();
        renderCart();
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('matchaCart', JSON.stringify(cart));
}

// Update cart count in navbar
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
    
    // Enable/disable checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = totalItems === 0;
}

// Render cart items
function renderCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        cartItemsList.innerHTML = '';
        updateCartTotals();
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    
    // Clear existing items
    cartItemsList.innerHTML = '';
    
    // Add each cart item
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsList.appendChild(cartItemElement);
    });
    
    updateCartTotals();
}

// Create cart item element
function createCartItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.dataset.id = item.id;
    
    // Format addons
    const addonsText = item.addons.length > 0 
        ? `<div class="item-addons">Add-ons: ${item.addons.join(', ')}</div>`
        : '';
    
    // Format special instructions
    const instructionsText = item.specialInstructions 
        ? `<div class="item-instructions">Note: ${item.specialInstructions}</div>`
        : '';
    
    itemDiv.innerHTML = `
        <div class="item-details">
            <h4 class="item-name">${item.name} × ${item.quantity}</h4>
            <div class="item-customization">
                <span class="item-milk">${item.milk}</span> • 
                <span class="item-sugar">${item.sugarLevel}</span>
            </div>
            ${addonsText}
            ${instructionsText}
        </div>
        <div class="item-controls">
            <div class="quantity-controls">
                <button class="quantity-btn minus" data-id="${item.id}">−</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <div class="item-price">₱${item.totalPrice * item.quantity}</div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const minusBtn = itemDiv.querySelector('.minus');
    const plusBtn = itemDiv.querySelector('.plus');
    const removeBtn = itemDiv.querySelector('.remove-item');
    
    minusBtn.addEventListener('click', () => {
        updateQuantity(item.id, item.quantity - 1);
    });
    
    plusBtn.addEventListener('click', () => {
        updateQuantity(item.id, item.quantity + 1);
    });
    
    removeBtn.addEventListener('click', () => {
        removeFromCart(item.id);
    });
    
    return itemDiv;
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
    const serviceCharge = 20;
    const total = subtotal + serviceCharge;
    
    document.getElementById('cart-subtotal').textContent = `₱${subtotal}`;
    document.getElementById('cart-total').textContent = `₱${total}`;
}

// Setup checkout modal
function setupCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    const prevStepBtn = document.getElementById('prev-step-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const newOrderBtn = document.getElementById('new-order-btn');
    
    // Close checkout modal
    closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    
    checkoutModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCheckoutModal();
        }
    });
    
    // Checkout step navigation
    prevStepBtn.addEventListener('click', goToPrevStep);
    nextStepBtn.addEventListener('click', goToNextStep);
    confirmOrderBtn.addEventListener('click', confirmOrder);
    newOrderBtn.addEventListener('click', startNewOrder);
    
    // Initialize checkout steps
    setupCheckoutSteps();
}

// Open checkout modal
function openCheckoutModal() {
    if (cart.length === 0) return;
    
    const checkoutModal = document.getElementById('checkout-modal');
    renderCheckoutStep1();
    checkoutModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Reset to step 1
    currentCheckoutStep = 1;
    updateCheckoutStepUI();
}

// Close checkout modal
function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Setup checkout steps
function setupCheckoutSteps() {
    const steps = document.querySelectorAll('.checkout-steps .step');
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.dataset.step);
            if (stepNumber <= currentCheckoutStep) {
                goToStep(stepNumber);
            }
        });
    });
}

// Update checkout step UI
function updateCheckoutStepUI() {
    // Update step indicators
    const steps = document.querySelectorAll('.checkout-steps .step');
    steps.forEach(step => {
        const stepNumber = parseInt(step.dataset.step);
        if (stepNumber === currentCheckoutStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show/hide steps
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(`step-${currentCheckoutStep}`).style.display = 'block';
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const confirmBtn = document.getElementById('confirm-order-btn');
    const newOrderBtn = document.getElementById('new-order-btn');
    
    prevBtn.style.display = currentCheckoutStep > 1 ? 'inline-block' : 'none';
    
    if (currentCheckoutStep === 1) {
        nextBtn.style.display = 'inline-block';
        nextBtn.textContent = 'Proceed to Payment';
        confirmBtn.style.display = 'none';
        newOrderBtn.style.display = 'none';
    } else if (currentCheckoutStep === 2) {
        nextBtn.style.display = 'none';
        confirmBtn.style.display = 'inline-block';
        confirmBtn.textContent = 'Confirm Order';
        newOrderBtn.style.display = 'none';
    } else if (currentCheckoutStep === 3) {
        nextBtn.style.display = 'none';
        confirmBtn.style.display = 'none';
        newOrderBtn.style.display = 'inline-block';
        newOrderBtn.textContent = 'Place New Order';
    }
}

// Go to specific step
function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 3) return;
    
    currentCheckoutStep = stepNumber;
    updateCheckoutStepUI();
}

// Go to previous step
function goToPrevStep() {
    if (currentCheckoutStep > 1) {
        currentCheckoutStep--;
        updateCheckoutStepUI();
    }
}

// Go to next step
function goToNextStep() {
    if (currentCheckoutStep === 1) {
        // Validate step 1
        currentCheckoutStep = 2;
        renderCheckoutStep2();
    }
    updateCheckoutStepUI();
}

// Render checkout step 1 (Order Summary)
function renderCheckoutStep1() {
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        
        const addonsText = item.addons.length > 0 
            ? `<div class="checkout-addons">Add-ons: ${item.addons.join(', ')}</div>`
            : '';
        
        itemElement.innerHTML = `
            <div class="checkout-item-details">
                <h4>${item.name} × ${item.quantity}</h4>
                <div class="checkout-customization">
                    ${item.milk} • ${item.sugarLevel}
                </div>
                ${addonsText}
                ${item.specialInstructions ? `<div class="checkout-notes">Note: ${item.specialInstructions}</div>` : ''}
            </div>
            <div class="checkout-item-price">₱${item.totalPrice * item.quantity}</div>
        `;
        
        checkoutItems.appendChild(itemElement);
    });
    
    // Update totals
    const subtotal = cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
    const serviceCharge = 20;
    const total = subtotal + serviceCharge;
    
    document.getElementById('checkout-subtotal').textContent = `₱${subtotal}`;
    document.getElementById('checkout-total').textContent = `₱${total}`;
}

// Render checkout step 2 (Payment)
function renderCheckoutStep2() {
    // Nothing to render, form is already there
}

// Confirm order
function confirmOrder() {
    // Validate form
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    
    if (!name || !phone || !address) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Generate order number
    const orderNumber = 'MH' + Date.now().toString().slice(-6);
    document.getElementById('order-number').textContent = orderNumber;
    
    // Render final summary
    renderFinalOrderSummary();
    
    // Move to step 3
    currentCheckoutStep = 3;
    updateCheckoutStepUI();
    
    // Save order to localStorage (for demo purposes)
    saveOrderToHistory(orderNumber);
    
    // Clear cart
    clearCart();
}

// Render final order summary
function renderFinalOrderSummary() {
    const summaryDiv = document.getElementById('final-order-summary');
    summaryDiv.innerHTML = '';
    
    const subtotal = cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
    const serviceCharge = 20;
    const total = subtotal + serviceCharge;
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const paymentMethodText = {
        'cash': 'Cash on Delivery',
        'gcash': 'GCash',
        'card': 'Credit/Debit Card'
    }[paymentMethod];
    
    const summaryHTML = `
        <div class="summary-row">
            <span>Items:</span>
            <span>₱${subtotal}</span>
        </div>
        <div class="summary-row">
            <span>Service Charge:</span>
            <span>₱${serviceCharge}</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span>₱${total}</span>
        </div>
        <div class="summary-row">
            <span>Payment Method:</span>
            <span>${paymentMethodText}</span>
        </div>
        <div class="summary-row">
            <span>Delivery to:</span>
            <span>${document.getElementById('customer-name').value}</span>
        </div>
    `;
    
    summaryDiv.innerHTML = summaryHTML;
}

// Save order to history
function saveOrderToHistory(orderNumber) {
    const orderHistory = JSON.parse(localStorage.getItem('matchaOrderHistory')) || [];
    const order = {
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0) + 20,
        customerName: document.getElementById('customer-name').value,
        status: 'Preparing'
    };
    
    orderHistory.push(order);
    localStorage.setItem('matchaOrderHistory', JSON.stringify(orderHistory));
}

// Clear cart
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartCount();
    closeCartModal();
}

// Start new order
function startNewOrder() {
    closeCheckoutModal();
    // Reset form
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-address').value = '';
    document.getElementById('special-notes').value = '';
    
    // Show success message
    showNotification('Thank you for your order!', 'success');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#454126'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', initCart);