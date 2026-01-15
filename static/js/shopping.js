 // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mainNav = document.getElementById('main-nav');
        
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
        
        // Mobile filters toggle
        const mobileFiltersBtn = document.getElementById('mobile-filters-btn');
        const filtersSidebar = document.getElementById('filters-sidebar');
        const overlay = document.getElementById('overlay');
        
        mobileFiltersBtn.addEventListener('click', () => {
            filtersSidebar.classList.add('active');
            overlay.classList.add('active');
        });
        
        overlay.addEventListener('click', () => {
            filtersSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        // Filter toggle functionality
        const filterTitles = document.querySelectorAll('.filter-title');
        
        filterTitles.forEach(title => {
            title.addEventListener('click', () => {
                const toggleIcon = title.querySelector('.filter-toggle');
                const filterOptions = title.nextElementSibling;
                
                filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
                toggleIcon.classList.toggle('fa-chevron-down');
                toggleIcon.classList.toggle('fa-chevron-up');
            });
        });
        
        // Clear filters functionality
        const clearFiltersBtn = document.getElementById('clear-filters');
        
        clearFiltersBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
            const priceInputs = document.querySelectorAll('.price-input input');
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            priceInputs[0].value = 0;
            priceInputs[1].value = 500;
            
            // Reset slider
            updateSliderTrack();
        });
        
        // Price slider functionality
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const sliderTrack = document.getElementById('slider-track');
        const sliderThumbMin = document.getElementById('slider-thumb-min');
        const sliderThumbMax = document.getElementById('slider-thumb-max');
        
        const minValue = 0;
        const maxValue = 500;
        let minPrice = 0;
        let maxPrice = 500;
        
        function updateSliderTrack() {
            const minPercent = ((minPrice - minValue) / (maxValue - minValue)) * 100;
            const maxPercent = ((maxPrice - minValue) / (maxValue - minValue)) * 100;
            
            sliderTrack.style.left = minPercent + '%';
            sliderTrack.style.right = (100 - maxPercent) + '%';
            
            sliderThumbMin.style.left = minPercent + '%';
            sliderThumbMax.style.left = maxPercent + '%';
        }
        
        function updatePriceInputs() {
            minPriceInput.value = minPrice;
            maxPriceInput.value = maxPrice;
        }
        
        minPriceInput.addEventListener('input', function() {
            minPrice = parseInt(this.value);
            if (minPrice < minValue) minPrice = minValue;
            if (minPrice > maxPrice) minPrice = maxPrice - 10;
            updateSliderTrack();
        });
        
        maxPriceInput.addEventListener('input', function() {
            maxPrice = parseInt(this.value);
            if (maxPrice > maxValue) maxPrice = maxValue;
            if (maxPrice < minPrice) maxPrice = minPrice + 10;
            updateSliderTrack();
        });
        
        // Initialize slider
        updateSliderTrack();
        
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const productCards = document.querySelectorAll('.product-card');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const category = card.querySelector('.product-category').textContent.toLowerCase();
                const seller = card.querySelector('.product-seller span').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || category.includes(searchTerm) || seller.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Update product count
            const visibleProducts = document.querySelectorAll('.product-card[style="display: block"], .product-card:not([style])').length;
            document.getElementById('product-count').textContent = visibleProducts;
        });
        
        // Sort functionality
        const sortSelect = document.getElementById('sort-by');
        
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productsGrid = document.getElementById('products-grid');
            const productCardsArray = Array.from(productCards);
            
            // Sort product cards based on selected option
            productCardsArray.sort((a, b) => {
                if (sortValue === 'price-low') {
                    const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('€', ''));
                    const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('€', ''));
                    return priceA - priceB;
                } else if (sortValue === 'price-high') {
                    const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('€', ''));
                    const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('€', ''));
                    return priceB - priceA;
                } else if (sortValue === 'rating') {
                    const ratingA = a.querySelector('.stars').children.length;
                    const ratingB = b.querySelector('.stars').children.length;
                    return ratingB - ratingA;
                } else {
                    // Default: newest (keep original order)
                    return 0;
                }
            });
            
            // Reorder product cards in the grid
            productCardsArray.forEach(card => {
                productsGrid.appendChild(card);
            });
        });
        
        // Product action buttons (wishlist)
        const wishlistBtns = document.querySelectorAll('.product-action-btn:first-child');
        
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const icon = this.querySelector('i');
                
                if (this.classList.contains('active')) {
                    icon.classList.remove('fa-heart');
                    icon.classList.add('fa-heart-circle-check');
                    this.style.background = 'var(--primary)';
                    this.style.color = 'white';
                } else {
                    icon.classList.remove('fa-heart-circle-check');
                    icon.classList.add('fa-heart');
                    this.style.background = 'var(--white)';
                    this.style.color = 'var(--text-dark)';
                }
            });
        });
        
        // Add to cart functionality
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                const text = this.querySelector('span') || this;
                
                // Change button appearance
                this.classList.add('added');
                icon.classList.remove('fa-shopping-cart');
                icon.classList.add('fa-check');
                
                // Update button text
                if (this.querySelector('span')) {
                    this.querySelector('span').textContent = 'Added to Cart';
                } else {
                    const originalText = this.textContent;
                    this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        this.classList.remove('added');
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                    }, 2000);
                }
                
                // Animate cart icon in header
                const cartBtn = document.getElementById('cart-btn');
                cartBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartBtn.style.transform = 'scale(1)';
                }, 300);
            });
        });
        
        // Initialize filter toggles on mobile
        if (window.innerWidth <= 992) {
            document.querySelectorAll('.filter-options').forEach(options => {
                options.style.display = 'none';
            });
        }