// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

// Modal functionality
const modal = document.getElementById('quickViewModal');
const closeModal = document.querySelector('.close-modal');

// Open modal (this would be called when clicking "Quick View" on a product)
function openModal(product) {
    // In a real implementation, you would populate the modal with product data
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = product.price;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductSKU').textContent = product.sku;
    document.getElementById('modalMainImage').src = product.image;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Quantity selector
const minusBtn = document.querySelector('.quantity-btn.minus');
const plusBtn = document.querySelector('.quantity-btn.plus');
const quantityInput = document.querySelector('.quantity input');

minusBtn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
        quantityInput.value = value - 1;
    }
});

plusBtn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    quantityInput.value = value + 1;
});

// Size selector
const sizes = document.querySelectorAll('.size');
sizes.forEach(size => {
    size.addEventListener('click', () => {
        sizes.forEach(s => s.classList.remove('active'));
        size.classList.add('active');
    });
});

// Price range slider
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

if (priceRange) {
    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
    });
}

// Color selector
const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(color => {
    color.addEventListener('click', () => {
        colorOptions.forEach(c => c.style.borderColor = 'transparent');
        color.style.borderColor = '#333';
    });
});

// Checkout form submission
const shippingForm = document.getElementById('shippingForm');
const paymentModal = document.getElementById('paymentModal');
const confirmationModal = document.getElementById('confirmationModal');

if (shippingForm) {
    shippingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        shippingForm.querySelectorAll('.step')[1].classList.add('active');
        paymentModal.style.display = 'block';
    });
}

// Payment form submission
const paymentForm = document.getElementById('paymentForm');

if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        paymentModal.style.display = 'none';
        confirmationModal.style.display = 'block';
    });
}

// Close payment modal
const closePaymentModal = document.querySelector('#paymentModal .close-modal');
if (closePaymentModal) {
    closePaymentModal.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
}

// Close confirmation modal
const closeConfirmationModal = document.querySelector('#confirmationModal .close-modal');
if (closeConfirmationModal) {
    closeConfirmationModal.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// FAQ Accordion Functionality
const faqQuestions = document.querySelectorAll('.faq-question');

if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In a real implementation, you would send this data to your server
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'form-notification success';
        notification.textContent = 'Thank you for your message! We will get back to you soon.';
        contactForm.appendChild(notification);
        
        // Reset form
        contactForm.reset();
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    });
}

// Workshop Tour Booking
const bookTourBtn = document.querySelector('.visit-workshop .btn');

if (bookTourBtn) {
    bookTourBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Scroll to contact form
        document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
        
        // Set subject field
        document.getElementById('subject').value = 'Workshop Tour Booking';
    });
}

// Add this to your existing mobile menu functionality
const navLinks = document.querySelectorAll('.main-nav a');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });

    // Search Toggle
    const searchToggle = document.getElementById('searchToggle');
    const searchContainer = document.querySelector('.search-container');
    const mobileSearch = document.querySelector('.mobile-search');
    
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchContainer.classList.toggle('active');
        });
    }

    // Search Functionality
    const setupSearch = (formId, inputId) => {
        const form = document.getElementById(formId);
        const input = document.getElementById(inputId);
        
        if (form && input) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchTerm = input.value.trim().toLowerCase();
                
                if (searchTerm) {
                    // Store search term for products page
                    sessionStorage.setItem('searchTerm', searchTerm);
                    
                    // Redirect to products page with search parameter
                    window.location.href = 'products.html?search=' + encodeURIComponent(searchTerm);
                }
            });
        }
    };

    // Setup all search forms
    setupSearch('searchForm', 'searchInput');
    setupSearch('mobileSearchForm', 'mobileSearchInput');
    setupSearch('productsSearchForm', 'productsSearchInput');

    // Apply search if coming from search
    if (window.location.pathname.includes('products.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search') || sessionStorage.getItem('searchTerm');
        
        if (searchTerm) {
            const searchInput = document.getElementById('productsSearchInput');
            if (searchInput) {
                searchInput.value = searchTerm;
                filterProducts(searchTerm);
            }
        }
    }

    // Product Filtering
    function filterProducts(searchTerm) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.dataset.description ? card.dataset.description.toLowerCase() : '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Product Sorting
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }

    function sortProducts(sortBy) {
        const productsContainer = document.querySelector('.products-grid');
        const productCards = Array.from(document.querySelectorAll('.product-card'));
        
        productCards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace(/[^0-9.]/g, ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace(/[^0-9.]/g, ''));
            
            switch(sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                default:
                    return 0;
            }
        });

        // Re-append sorted products
        productCards.forEach(card => productsContainer.appendChild(card));
    }

    // Quick View Modal
    const setupQuickView = () => {
        const quickViewButtons = document.querySelectorAll('.quick-view');
        const quickViewModal = document.querySelector('.quick-view-modal');
        const closeModal = document.querySelector('.close-modal');
        
        if (quickViewButtons.length > 0) {
            quickViewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productCard = this.closest('.product-card');
                    const productId = productCard.dataset.id;
                    const productName = productCard.querySelector('.product-title').textContent;
                    const productPrice = productCard.querySelector('.product-price').textContent;
                    const productImage = productCard.querySelector('.product-image img').src;
                    
                    // In a real implementation, you would fetch more details from a database
                    const productDetails = {
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        description: "This beautiful patchwork item is handcrafted using traditional techniques. Each piece is unique due to the nature of the patchwork design.",
                        sizes: ['S', 'M', 'L', 'XL'],
                        colors: ['Multi-color', 'Red', 'Blue', 'Green']
                    };
                    
                    // Populate modal
                    const modal = quickViewModal;
                    modal.querySelector('.product-title').textContent = productDetails.name;
                    modal.querySelector('.product-price').textContent = productDetails.price;
                    modal.querySelector('.main-image img').src = productDetails.image;
                    modal.querySelector('.product-description').textContent = productDetails.description;
                    
                    // Populate size options
                    const sizeSelect = modal.querySelector('.size-select');
                    sizeSelect.innerHTML = '';
                    productDetails.sizes.forEach(size => {
                        sizeSelect.innerHTML += `<option value="${size}">${size}</option>`;
                    });
                    
                    // Show modal
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                });
            });
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                quickViewModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        window.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                quickViewModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    };

    setupQuickView();
});