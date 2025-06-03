
// Display products on page load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    
    // Set up filter buttons
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Set up sorting
    document.getElementById('sortBy').addEventListener('change', sortProducts);
});

// Display products in the grid
function displayProducts(productsToDisplay) {
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        grid.innerHTML = '<p class="no-products">No products match your filters.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let badges = '';
        if (product.isNew) badges += '<span class="badge new">New</span>';
        if (product.isSale) badges += '<span class="badge sale">Sale</span>';
        if (product.isBestseller) badges += '<span class="badge bestseller">Bestseller</span>';
        
        productCard.innerHTML = `
            <div class="product-image">
                ${badges}
                <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this)">
                <button class="quick-view" onclick="openModal(${product.id})">Quick View</button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span>` : ''}
                    <span>${product.price}</span>
                </div>
                <div class="product-actions">
                    <button class="quick-view" onclick="openModal(${product.id})">Quick View</button>
                    <br>
                    <a class="add-to-cart" href="cart.html">Add to Cart</a>
                </div>
            </div>
        `;
        
        grid.appendChild(productCard);
    });
}

// Sample product data (in a real app, this would come from an API)
const products = [
    {
        id: 1,
        name: "Daster",
        price: "Rp.230.000",
        image: "./img/DasterNew.webp",
        category: "dresses",
     
    },
    {
        id: 2,
        name: "Celana Rok",
        price: "Rp.90.000",
        image: "./img/CelanaRok.webp",
        category: "dresess",
        colors: ["yellow", "purple"],
        rating: 5,
        isBestseller: true
    },
    {
        id: 3,
        name: "Tas Ketupat",
        price: "Rp.150.000",
        image: "./img/TasKetupat.webp",
        category: "accessories",
        colors: ["orange", "blue"],
        rating: 4
    },
    {
        id: 4,
        name: "Dompet",
        price: "Rp.75.000",
        image: "./img/DompetKoin.webp",
        category: "accessories",
        colors: ["green", "yellow"],
        rating: 4
    },
    {
        id: 5,
        name: "Pangsi",
        price: "Rp.85.000",
        image: "./img/PangsiKecil.webp",
        category: "dresses",
        colors: ["purple", "orange"],
        rating: 3,
        isSale: true
    },
    {
        id: 6,
        name: "Tas Selempang",
        price: "Rp.120.000",
        image: "./img/TasSelempangNew.webp",
        category: "accessories",
        colors: ["red", "blue"],
        rating: 5,
        isNew: true
    },
    {
        id: 7,
        name: "Pouch",
        price: "Rp.60.000",
        image: "./img/PouchBesar.jpg",
        category: "accessories",
        colors: ["yellow", "green"],
        rating: 4
    },
    {
        id: 8,
        name: "Rompi",
        price: "Rp.200.000",
        image: "./img/RompiNew.webp",
        category: "dresses",
        colors: ["blue", "purple"],
        rating: 5,
        isBestseller: true
    }
];

// Fungsi untuk menangani error gambar
function handleImageError(img) {
    img.onerror = null; 
    img.src = "img/placeholder.jpg";
    return true;
}

// Apply filters based on user selection
function applyFilters() {
    const priceValue = parseInt(document.getElementById('priceRange').value);
    const selectedColor = document.querySelector('.color-option[style*="border-color"]')?.dataset.color;
    const selectedCategory = document.querySelector('.filter-section ul li a.active')?.textContent.toLowerCase();
    
    let filteredProducts = products.filter(product => {
        // Convert price to number for comparison
        const productPrice = parseFloat(product.price.replace('$', ''));
        
        // Price filter
        if (productPrice > priceValue) return false;
        
        // Color filter
        if (selectedColor && !product.colors.includes(selectedColor)) return false;
        
        // Category filter
        if (selectedCategory && selectedCategory !== 'all products' && product.category !== selectedCategory) return false;
        
        return true;
    });
    
    displayProducts(filteredProducts);
}

// Reset all filters
function resetFilters() {
    document.getElementById('priceRange').value = 500;
    document.getElementById('priceValue').textContent = '500';
    
    document.querySelectorAll('.color-option').forEach(color => {
        color.style.borderColor = 'transparent';
    });
    
    document.querySelectorAll('.filter-section ul li a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector('.filter-section ul li a').classList.add('active');
    
    displayProducts(products);
}

// Sort products based on selected option
function sortProducts() {
    const sortBy = document.getElementById('sortBy').value;
    let sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
            break;
        case 'newest':
            // Assuming newer products have higher IDs
            sortedProducts.sort((a, b) => b.id - a.id);
            break;
        case 'popular':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Default sorting (featured)
            break;
    }
    
    displayProducts(sortedProducts);
}

// Open modal with product details
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = product.price;
    document.getElementById('modalProductDescription').textContent = `This beautiful ${product.name.toLowerCase()} is handcrafted using traditional patchwork techniques. Each piece is unique due to the nature of the fabrics used.`;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductSKU').textContent = `KP-${product.id.toString().padStart(3, '0')}`;
    document.getElementById('modalMainImage').src = product.image;
    
    // Set up thumbnails (in a real app, you'd have multiple images)
    const thumbnailsContainer = document.querySelector('.thumbnail-images');
    thumbnailsContainer.innerHTML = '';
    
    // Add main image as thumbnail
    addThumbnail(product.image, thumbnailsContainer, true);
    
    // For demo purposes, add some placeholder thumbnails
    if (product.id % 2 === 0) {
        addThumbnail('images/product-alt1.jpg', thumbnailsContainer);
        addThumbnail('images/product-alt2.jpg', thumbnailsContainer);
    } else {
        addThumbnail('images/product-alt3.jpg', thumbnailsContainer);
    }
    
    // Show modal
    document.getElementById('quickViewModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Helper function to add thumbnail images
function addThumbnail(src, container, isActive = false) {
    const thumbnail = document.createElement('div');
    thumbnail.className = `thumbnail ${isActive ? 'active' : ''}`;
    thumbnail.innerHTML = `<img src="${src}" alt="">`;
    
    thumbnail.addEventListener('click', () => {
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
        document.getElementById('modalMainImage').src = src;
    });
    
    container.appendChild(thumbnail);
}

// Category filter links
document.querySelectorAll('.filter-section ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.filter-section ul li a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        applyFilters();
    });
});