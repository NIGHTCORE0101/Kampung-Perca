document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi keranjang belanja
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    const orderItemsContainer = document.querySelector('.order-items');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const taxElement = document.querySelector('.tax');
    const totalElement = document.querySelector('.total');
    const confirmationModal = document.querySelector('.confirmation-modal');

    // Fungsi untuk menampilkan item di keranjang
    function displayCartItems() {
        orderItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <h4 class="order-item-title">${item.name}</h4>
                    <p class="order-item-variant">${item.size} | ${item.color}</p>
                    <p class="order-item-price">$${item.price.toFixed(2)}</p>
                    <p class="order-item-quantity">Qty: ${item.quantity}</p>
                </div>
            `;
            orderItemsContainer.appendChild(orderItem);
        });

        updateCartSummary();
    }

    // Fungsi untuk menghitung total belanja
    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 5.99; // Standard shipping
        const tax = subtotal * 0.1; // 10% tax

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;

        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Fungsi untuk memproses checkout
    function processCheckout(event) {
        event.preventDefault();
        
        // Validasi form
        const shippingForm = document.getElementById('shippingForm');
        const requiredFields = shippingForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--error-color)';
                isValid = false;
                
                // Hapus error styling ketika user mulai mengetik
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                });
            }
        });

        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validasi kartu kredit jika metode yang dipilih adalah credit card
        const creditCardTab = document.getElementById('credit-card');
        if (creditCardTab.classList.contains('active')) {
            const cardNumber = document.getElementById('cardNumber').value;
            const cardName = document.getElementById('cardName').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            if (!validateCreditCard(cardNumber, cardName, expiryDate, cvv)) {
                return;
            }
        }

        // Simpan data order ke localStorage (untuk demo)
        const orderData = {
            customer: {
                name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                country: document.getElementById('country').value,
                zip: document.getElementById('zip').value
            },
            order: {
                items: cart,
                subtotal: parseFloat(subtotalElement.textContent.substring(1)),
                shipping: parseFloat(shippingElement.textContent.substring(1)),
                tax: parseFloat(taxElement.textContent.substring(1)),
                total: parseFloat(totalElement.textContent.substring(1)),
                date: new Date().toISOString(),
                orderNumber: 'PC-' + Math.floor(Math.random() * 1000000)
            },
            paymentMethod: document.querySelector('.payment-tab.active').textContent.trim()
        };

        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        // Tampilkan modal konfirmasi
        showConfirmationModal(orderData.order.orderNumber);
        
        // Kosongkan keranjang
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }

    // Fungsi untuk validasi kartu kredit
    function validateCreditCard(cardNumber, cardName, expiryDate, cvv) {
        // Hapus semua spasi dari nomor kartu
        const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
        
        // Validasi nomor kartu dengan Luhn algorithm
        if (!luhnCheck(cleanedCardNumber)) {
            showNotification('Invalid credit card number', 'error');
            document.getElementById('cardNumber').style.borderColor = 'var(--error-color)';
            return false;
        }

        // Validasi nama di kartu
        if (!cardName.trim()) {
            showNotification('Card name is required', 'error');
            document.getElementById('cardName').style.borderColor = 'var(--error-color)';
            return false;
        }

        // Validasi tanggal kadaluarsa
        if (!expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
            showNotification('Invalid expiry date format (MM/YY)', 'error');
            document.getElementById('expiryDate').style.borderColor = 'var(--error-color)';
            return false;
        }

        // Validasi CVV
        if (!cvv.match(/^[0-9]{3,4}$/)) {
            showNotification('Invalid CVV (3 or 4 digits)', 'error');
            document.getElementById('cvv').style.borderColor = 'var(--error-color)';
            return false;
        }

        return true;
    }

    // Algoritma Luhn untuk validasi nomor kartu kredit
    function luhnCheck(cardNumber) {
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return (sum % 10) === 0;
    }

    // Fungsi untuk menampilkan modal konfirmasi
    function showConfirmationModal(orderNumber) {
        const orderNumberElement = confirmationModal.querySelector('.order-number');
        orderNumberElement.textContent = `Order #${orderNumber}`;
        
        confirmationModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Fungsi untuk menampilkan notifikasi
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Event listener untuk tombol apply promo code
    const applyPromoBtn = document.querySelector('.promo-code button');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const promoInput = document.querySelector('.promo-code input');
            const promoCode = promoInput.value.trim();
            
            if (promoCode === 'PATCH10') {
                // Apply 10% discount
                const subtotal = parseFloat(subtotalElement.textContent.substring(1));
                const newSubtotal = subtotal * 0.9;
                const tax = newSubtotal * 0.1;
                const shipping = parseFloat(shippingElement.textContent.substring(1));
                
                subtotalElement.textContent = `$${newSubtotal.toFixed(2)}`;
                taxElement.textContent = `$${tax.toFixed(2)}`;
                totalElement.textContent = `$${(newSubtotal + shipping + tax).toFixed(2)}`;
                
                showNotification('Promo code applied! 10% discount', 'success');
                promoInput.value = '';
            } else {
                showNotification('Invalid promo code', 'error');
            }
        });
    }

    // Event listener untuk form checkout
    const checkoutForm = document.getElementById('shippingForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', processCheckout);
    }

    // Event listener untuk menutup modal konfirmasi
    window.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Inisialisasi tampilan keranjang
    displayCartItems();

    // Event listener untuk metode pembayaran
    const paymentTabs = document.querySelectorAll('.payment-tab');
    paymentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            paymentTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.payment-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Auto-format card number
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            this.value = value;
        });
    }

    // Auto-format expiry date
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }
});
