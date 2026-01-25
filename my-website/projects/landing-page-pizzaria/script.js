// Performance optimizations
const PERFORMANCE_CONFIG = {
    DEBOUNCE_DELAY: 150, // Reduzido para pesquisa mais rápida
    ANIMATION_DURATION: 300,
    MAX_CART_ITEMS: 50,
    IMAGE_PRELOAD: true
};

// Menu Data - será carregado do JSON
let menuData = {};

// Preload images for better performance
function preloadImages() {
    if (!PERFORMANCE_CONFIG.IMAGE_PRELOAD) return;
    
    const images = [];
    Object.values(menuData).flat().forEach(item => {
        if (item.image) {
            const img = new Image();
            img.src = item.image;
            images.push(img);
        }
    });
}

// Load menu data from JSON
async function loadMenuData() {
    try {
        const response = await fetch('menu.json');
        const data = await response.json();
        menuData = data.menu;
        return true;
    } catch (error) {
        console.error('Error loading menu data:', error);
        // Fallback data em caso de erro
        menuData = {
            tradicionais: [],
            especiais: [],
            doces: [],
            bebidas: []
        };
        return false;
    }
}

// Optimized scroll handling
let scrollTimeout;
function optimizedScroll(callback) {
    return function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(callback, 16); // ~60fps
    };
}

// Cart State - Otimizado
let cart = [];
let currentFilter = 'all';
let expandedCategories = new Set();
let searchTerm = '';
const ITEMS_PER_CATEGORY = 6;

// WhatsApp Configuration - Número unificado da pizzaria
// Altere este número para atualizar em TODOS os lugares (botão FAB e envio de pedidos)
const WHATSAPP_NUMBER = '5579999209607'; // Formato: 55 + DDD + número (ex: 5511999999999)

// Cache DOM elements
let elements = {};

// Load cart from localStorage on page load
function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem('cart');
        if (saved) {
            cart = JSON.parse(saved);
            updateCartUI();
        }
    } catch (e) {
        console.warn('Failed to load cart from localStorage:', e);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.warn('Failed to save cart to localStorage:', e);
    }
}

// Initialize - Performance optimized
document.addEventListener('DOMContentLoaded', async function() {
    await loadMenuData();
    cacheElements();
    renderMenu();
    loadCartFromStorage(); // Load cart from localStorage
    updateCartUI();
    setupEventListeners();
    preloadImages();
    updateWhatsAppFAB(); // Update FAB with unified number
});

// Cache DOM elements for performance
function cacheElements() {
    elements = {
        menuGrid: document.getElementById('menuGrid'),
        cartItems: document.getElementById('cartItems'),
        cartCount: document.querySelector('.cart-count'),
        cartTotal: document.getElementById('cartTotal'),
        cartModal: document.getElementById('cartModal'),
        checkoutModal: document.getElementById('checkoutModal'),
        searchInput: document.getElementById('searchInput'),
        orderSummary: document.getElementById('orderSummary'),
        finalTotal: document.getElementById('finalTotal')
    };
}

// Setup Event Listeners - Optimizado
function setupEventListeners() {
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', openCartModal);
    
    // Close buttons
    const closeCart = document.getElementById('closeCart');
    const closeCheckout = document.getElementById('closeCheckout');
    if (closeCart) closeCart.addEventListener('click', closeCartModal);
    if (closeCheckout) closeCheckout.addEventListener('click', closeCheckoutModal);
    
    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckout);
    
    // Payment method change
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentChange);
    });
    
    // WhatsApp mask
    const whatsapp = document.getElementById('whatsapp');
    if (whatsapp) whatsapp.addEventListener('input', maskWhatsApp);
    
    // Category filters with delegation
    const filterButtons = document.querySelector('.filter-buttons');
    if (filterButtons) {
        filterButtons.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                filterByCategory(e.target.dataset.category);
            }
        });
    }
    
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
    
    // Search with immediate response (no debounce)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value.toLowerCase().trim();
            renderMenu();
        });
    }
    
    // Modal backdrop click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeCartModal();
            closeCheckoutModal();
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartModal();
            closeCheckoutModal();
        }
    });
}

// WhatsApp Mask
function maskWhatsApp(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 2) {
            value = `(${value}`;
        } else if (value.length <= 7) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }
    }
    
    event.target.value = value;
}

// Handle Payment Change
function handlePaymentChange(event) {
    const changeGroup = document.getElementById('changeGroup');
    
    if (event.target.value === 'dinheiro') {
        changeGroup.style.display = 'block';
        document.getElementById('change').required = true;
    } else {
        changeGroup.style.display = 'none';
        document.getElementById('change').required = false;
        document.getElementById('change').value = '';
    }
}

// Render Menu - Performance optimized
function renderMenu() {
    if (!elements.menuGrid) return;
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    elements.menuGrid.innerHTML = '';
    
    // Filter items based on search term
    const filteredMenuData = getFilteredMenuData();
    
    // Render filtered categories
    Object.keys(filteredMenuData).forEach(category => {
        const categoryElement = createCategoryElement(category, filteredMenuData[category]);
        fragment.appendChild(categoryElement);
    });
    
    // Show no results message
    if (Object.keys(filteredMenuData).length === 0) {
        fragment.appendChild(createNoResultsElement());
    }
    
    elements.menuGrid.appendChild(fragment);
}

// Get filtered menu data - optimized
function getFilteredMenuData() {
    const result = {};
    
    if (currentFilter === 'all') {
        elements.menuGrid.classList.remove('filtered');
        Object.keys(menuData).forEach(category => {
            const filteredItems = searchTerm 
                ? menuData[category].filter(item => 
                    item.name.toLowerCase().includes(searchTerm)
                  )
                : menuData[category];
            
            if (filteredItems.length > 0) {
                result[category] = filteredItems;
            }
        });
    } else {
        elements.menuGrid.classList.add('filtered');
        const items = menuData[currentFilter] || [];
        const filteredItems = searchTerm 
            ? items.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
              )
            : items;
        
        if (filteredItems.length > 0) {
            result[currentFilter] = filteredItems;
        }
    }
    
    return result;
}

// Create category element - botão ver mais/menos totalmente refeito
function createCategoryElement(categoryName, items) {
    const container = document.createElement('div');
    container.className = 'category-container';
    const isExpanded = expandedCategories.has(categoryName);
    const itemsToShow = isExpanded ? items : items.slice(0, ITEMS_PER_CATEGORY);
    const hasMore = items.length > ITEMS_PER_CATEGORY;
    
    // Category header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <h3 class="category-title">
            <i class="fas fa-pizza-slice"></i>
            ${getCategoryDisplayName(categoryName)}
        </h3>
    `;
    
    // Items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'category-items';
    
    // Add items
    const fragment = document.createDocumentFragment();
    itemsToShow.forEach(item => {
        fragment.appendChild(createMenuItemElement(item));
    });
    itemsContainer.appendChild(fragment);
    
    // Assemble - header primeiro, depois items, depois botão no final
    container.appendChild(header);
    container.appendChild(itemsContainer);
    
    // Novo botão ver mais/menos
    if (hasMore) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'category-toggle' + (isExpanded ? ' expanded' : '');
        let icon = document.createElement('i');
        icon.className = 'fas ' + (isExpanded ? 'fa-chevron-up' : 'fa-chevron-down');
        toggleBtn.appendChild(document.createTextNode(isExpanded ? 'Ver Menos ' : 'Ver Mais '));
        toggleBtn.appendChild(icon);
        toggleBtn.onclick = () => {
            if (expandedCategories.has(categoryName)) {
                expandedCategories.delete(categoryName);
            } else {
                expandedCategories.add(categoryName);
            }
            renderMenu();
        };
        container.appendChild(toggleBtn);
    }
    
    return container;
}

// Create no results element
function createNoResultsElement() {
    const div = document.createElement('div');
    div.style.cssText = 'text-align: center; padding: 3rem;';
    div.innerHTML = `
        <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
        <h3 style="color: #666; margin-bottom: 0.5rem;">Nenhum item encontrado</h3>
        <p style="color: #999;">Tente buscar por outro nome</p>
    `;
    return div;
}

// Create Menu Item Element - NOVO LAYOUT
function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
        <img class="menu-item-image" src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="menu-item-content">
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">R$ ${item.price.toFixed(2)}</div>
            <div class="menu-item-description">${item.description}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${item.id})" aria-label="Adicionar ${item.name} ao carrinho">
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                Adicionar
            </button>
        </div>
    `;
    return div;
}

// Update Cart UI - Optimizado sem emojis
function updateCartUI() {
    if (!elements.cartItems || !elements.cartCount || !elements.cartTotal) return;
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
        elements.cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        elements.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-details">R$ ${item.price.toFixed(2)} cada</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)" aria-label="Diminuir quantidade de ${item.name}" title="Diminuir">
                            <i class="fas fa-minus" aria-hidden="true"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" readonly id="cart-quantity-${item.id}" aria-label="Quantidade de ${item.name}">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)" aria-label="Aumentar quantidade de ${item.name}" title="Aumentar">
                            <i class="fas fa-plus" aria-hidden="true"></i>
                        </button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Controlar barra de rolagem
    updateCartScroll();

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    elements.cartTotal.textContent = total.toFixed(2);
    
    // Save to localStorage
    saveCartToStorage();
    
    // Habilitar/desabilitar botão de checkout
    updateCheckoutButton();
}

// Controlar barra de rolagem do carrinho - Optimizado
function updateCartScroll() {
    const cartItemsScrollable = document.querySelector('.cart-items-scrollable');
    if (!cartItemsScrollable) return;
    
    // Use CSS default (max-height / overflow) for scroll; ensure internal scrolling enabled
    cartItemsScrollable.style.overflowY = 'auto';
    cartItemsScrollable.style.maxHeight = '';
}

// Controlar estado do botão de checkout
function updateCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;
    
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
        checkoutBtn.textContent = 'Carrinho Vazio';
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
        checkoutBtn.textContent = 'Prosseguir';
    }
}

// Handle Checkout - Optimizado sem emojis
function handleCheckout(event) {
    event.preventDefault();
    
    const name = document.getElementById('customerName').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked')?.value;
    const change = document.getElementById('change').value;
    const observations = document.getElementById('observations').value.trim();
    
    // Validações melhoradas
    if (!name || name.length < 3) {
        showNotification('Por favor, digite seu nome completo!');
        return;
    }
    
    if (!payment) {
        showNotification('Selecione um método de pagamento!');
        return;
    }
    
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(whatsapp)) {
        showNotification('Por favor, digite um WhatsApp válido!');
        return;
    }
    
    if (payment === 'dinheiro' && (!change || parseFloat(change) <= 0)) {
        showNotification('Por favor, informe o valor para troco!');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }
    
    // Format WhatsApp number (remove mask)
    const whatsappNumber = whatsapp.replace(/\D/g, '');
    
    // Build order message
    let message = `*NOVO PEDIDO - PIZZARIA DELÍCIA*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*WhatsApp:* ${whatsapp}\n`;
    message += `*Pagamento:* ${getPaymentMethodText(payment)}\n`;
    
    if (payment === 'dinheiro' && change) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const changeAmount = parseFloat(change);
        if (changeAmount > total) {
            message += `*Troco para:* R$ ${changeAmount}\n`;
            message += `*Troco necessário:* R$ ${(changeAmount - total).toFixed(2)}\n`;
        }
    }
    
    if (observations) {
        message += `*Observações:* ${observations}\n`;
    }
    
    message += `\n*ITENS DO PEDIDO:*\n\n`;
    
    cart.forEach(item => {
        message += `*${item.name}*\n`;
        message += `   Quantidade: ${item.quantity}\n`;
        message += `   Valor: R$ ${item.price.toFixed(2)} cada\n`;
        message += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `*TOTAL DO PEDIDO: R$ ${total.toFixed(2)}*\n\n`;
    message += `*Data/Hora:* ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `*Pedido confirmado! Aguardamos sua confirmação.*`;
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and close modals
    cart = [];
    updateCartUI();
    closeCartModal();
    closeCheckoutModal();
    
    // Show success notification
    showNotification('Pedido enviado para WhatsApp com sucesso!');
}

// Update WhatsApp FAB with unified number
function updateWhatsAppFAB() {
    const fab = document.querySelector('.whatsapp-fab');
    if (fab) {
        const defaultMessage = encodeURIComponent('Olá, gostaria de fazer um pedido!');
        fab.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMessage}`;
    }
}

// Get Payment Method Text
function getPaymentMethodText(payment) {
    const methods = {
        'cartao': 'Cartão (Débito/Crédito)',
        'pix': 'PIX',
        'dinheiro': 'Dinheiro (Espécie)'
    };
    return methods[payment] || payment;
}

// Show Notification - Optimizado sem emojis
function showNotification(message) {
    // Remove notificação existente se houver
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Scroll to Menu
function scrollToMenu() {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        menuSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Header scroll effect - Optimized
window.addEventListener('scroll', optimizedScroll(function() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
}));

// Cart Functions - Barra lateral
function openCartModal() {
    const modal = document.getElementById('cartModal');
    const modalContent = modal.querySelector('.modal-content');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('cart-open');
    setTimeout(() => {
        modalContent.classList.add('show');
    }, 10);
    updateCheckoutSummary();
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.classList.remove('cart-open');
    }, 400);
}

function openCheckoutModal() {
    // Validar se há itens no carrinho
    if (cart.length === 0) {
        showNotification('Adicione itens ao carrinho antes de finalizar o pedido!');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    const modalContent = modal.querySelector('.modal-content');
    document.getElementById('cartModal').style.display = 'none';
    modal.style.display = 'block';
    setTimeout(() => {
        modalContent.classList.add('show');
    }, 10);
    updateCheckoutSummary();
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 400);
}

// Add to Cart - Optimized com validações
function addToCart(itemId) {
    const item = findMenuItem(itemId);
    if (!item) {
        console.warn('Item não encontrado:', itemId);
        return;
    }
    
    // Limitar carrinho para evitar problemas de performance
    if (cart.length >= PERFORMANCE_CONFIG.MAX_CART_ITEMS) {
        showNotification('Carrinho com muitos itens. Finalize o pedido atual.');
        return;
    }
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem) {
        if (existingItem.quantity < 10) {
            existingItem.quantity++;
        } else {
            showNotification('Quantidade máxima atingida para este item.');
            return;
        }
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    showNotification('Adicionado ao carrinho');
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
}

// Update Cart Quantity
function updateCartQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else if (item.quantity > 10) {
            item.quantity = 10;
        }
        updateCartUI();
    }
}

// Find Menu Item
function findMenuItem(itemId) {
    for (const category in menuData) {
        const item = menuData[category].find(item => item.id === itemId);
        if (item) return item;
    }
    return null;
}

// Update Checkout Summary
function updateCheckoutSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const finalTotal = document.getElementById('finalTotal');
    
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>Carrinho vazio</p>';
        finalTotal.textContent = '0.00';
        return;
    }
    
    let summaryHTML = '';
    cart.forEach(item => {
        summaryHTML += `
            <div class="summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    orderSummary.innerHTML = summaryHTML;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    finalTotal.textContent = total.toFixed(2);
}

// Filter by Category
function filterByCategory(category) {
    currentFilter = category;
    searchTerm = ''; // Clear search when changing category
    document.getElementById('searchInput').value = '';
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    renderMenu();
}

// Toggle Category
function toggleCategory(categoryName) {
    if (expandedCategories.has(categoryName)) {
        expandedCategories.delete(categoryName);
    } else {
        expandedCategories.add(categoryName);
    }
    renderMenu();
}

// Get Category Display Name
function getCategoryDisplayName(category) {
    const names = {
        'tradicionais': 'Pizzas Tradicionais',
        'especiais': 'Pizzas Especiais',
        'doces': 'Pizzas Doces',
        'bebidas': 'Bebidas'
    };
    return names[category] || category;
}

// Toggle Mobile Menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}
