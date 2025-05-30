const lenis = new Lenis({
  smooth: true,
  lerp: 0.08, // Adjust this value to slow down or speed up the scroll
  wheelMultiplier: 1,
  infinite: false
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/**
 * Fetch all products from products.json
 * @returns {Promise<Array>} products array
 */
function fetchAllProducts() {
  return fetch('./products.json')
    .then(res => res.json())
    .then(data => data.products || []);
}

function showProducts({ selector, filterFn, sortFn, count = 4 }) {
  fetchAllProducts()
    .then(products => {
      let filteredProducts = products.filter(filterFn);
      if (sortFn) filteredProducts = filteredProducts.sort(sortFn);
      filteredProducts = filteredProducts.slice(0, count);

      const grid = document.querySelector(selector);
      if (!grid) return;
      grid.innerHTML = '';
      filteredProducts.forEach(product => {
        const isWishlisted = isInWishlist(product.id);
        grid.innerHTML += `
          <div class="product-card" data-product-id="${product.id}">
            <div class="card-image">
              <img src="${product.image}" alt="${product.title}">
              <div class="badges">
                <span class="discount">${product.discount || ''} OFF</span>
                <span class="new">NEW</span>
              </div>
              <div class="actions">
                <button class="cirle-icon-btn add-to-cart" type="button" tabindex="-1">
                  <!-- Add to Cart SVG -->
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.21053 14.2615H13.0913C17.3431 14.2615 17.9892 11.59 18.7736 7.6964C19 6.5719 19.1127 6.01012 18.8408 5.63592C18.569 5.26172 18.0479 5.26172 17.0048 5.26172H16.6316M4.3158 5.26172H6.21053"
                      stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.05263 7.15776C9.51874 7.63711 10.7579 9.52612 11.4211 9.52612M11.4211 9.52612C12.0842 9.52612 13.3234 7.63711 13.7895 7.15776M11.4211 9.52612V1.94735"
                      stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.57895 19.9475C9.36378 19.9475 10 19.3113 10 18.5265C10 17.7417 9.36378 17.1055 8.57895 17.1055C7.79412 17.1055 7.1579 17.7417 7.1579 18.5265C7.1579 19.3113 7.79412 19.9475 8.57895 19.9475Z"
                      stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15.2105 19.9475C15.9953 19.9475 16.6315 19.3113 16.6315 18.5265C16.6315 17.7417 15.9953 17.1055 15.2105 17.1055C14.4257 17.1055 13.7894 17.7417 13.7894 18.5265C13.7894 19.3113 14.4257 19.9475 15.2105 19.9475Z"
                      stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
                <button class="cirle-icon-btn add-to-wishlist${isWishlisted ? ' wishlisted' : ''}" type="button" tabindex="-1">
                  <!-- Wishlist SVG -->
                  <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.196 1.5C14.152 1.5 12.387 2.697 11.5 4.443C10.613 2.697 8.848 1.5 6.804 1.5C3.874 1.5 1.5 3.957 1.5 6.981C1.5 10.005 3.317 12.777 5.665 15.054C8.013 17.331 11.5 19.5 11.5 19.5C11.5 19.5 14.874 17.367 17.335 15.054C19.96 12.588 21.5 10.014 21.5 6.981C21.5 3.948 19.126 1.5 16.196 1.5Z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="${isWishlisted ? '#e74c3c' : 'transparent'}" />
                  </svg>
                </button>
                <button class="icon-text-btn view-product" type="button" data-view-btn>
                  <!-- View SVG -->
                  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.4999 31.0799C11.5439 31.0799 5.91992 25.4559 5.91992 18.4999C5.91992 11.5439 11.5439 5.91992 18.4999 5.91992C25.4559 5.91992 31.0799 11.5439 31.0799 18.4999C31.0799 25.4559 25.4559 31.0799 18.4999 31.0799ZM18.4999 7.39992C12.3579 7.39992 7.39992 12.3579 7.39992 18.4999C7.39992 24.6419 12.3579 29.5999 18.4999 29.5999C24.6419 29.5999 29.5999 24.6419 29.5999 18.4999C29.5999 12.3579 24.6419 7.39992 18.4999 7.39992Z"
                      fill="currentColor" />
                    <path d="M18.2782 25.6783L17.2422 24.6423L23.3842 18.5003L17.2422 12.3583L18.2782 11.3223L25.4562 18.5003L18.2782 25.6783Z"
                      fill="currentColor" />
                    <path d="M11.8398 17.7598H24.4198V19.2398H11.8398V17.7598Z" fill="currentColor" />
                  </svg>
                  View
                </button>
              </div>
            </div>
            <div class="card-content">
              <h3>${product.title}</h3>
              <div class="rating-price">
                <div class="rating">
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.1875 15.5207L4.54167 9.95921L0 6.21859L6 5.7238L8.33333 0.479004L10.6667 5.7238L16.6667 6.21859L12.125 9.95921L13.4792 15.5207L8.33333 12.5717L3.1875 15.5207Z" fill="#FABB05" />
                  </svg>
                  <span>${product.rating || ''}</span>
                </div>
                <div class="price">
                  <del>₹${product.original_price ? product.original_price.toLocaleString() : ''}</del>
                  <strong>₹${product.price ? product.price.toLocaleString() : ''}</strong>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      grid.querySelectorAll('.product-card').forEach(card => {
        const id = card.getAttribute('data-product-id');
        const prod = filteredProducts.find(p => p.id === id);
        const viewBtn = card.querySelector('[data-view-btn]');
        if (viewBtn && prod) {
          viewBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            localStorage.setItem('selectedProduct', JSON.stringify(prod));
            window.location.href = `product.html?id=${prod.id}`;
          });
        }
        // Add to Cart button logic
        const addToCartBtn = card.querySelector('.add-to-cart');
        if (addToCartBtn && prod) {
          addToCartBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            // Default to first size if available, else undefined
            const size = Array.isArray(prod.sizes) && prod.sizes.length ? prod.sizes[0] : prod.size || '';
            addToCart({
              id: prod.id,
              title: prod.title,
              image: prod.image,
              price: prod.price,
              original_price: prod.original_price,
              size: size,
              qty: 1
            });
            updateCartCount();
          });
        }
      });
      // Attach wishlist button logic after rendering cards
      setupWishlistButtons(grid);
    });
}

showProducts({
  selector: '#new-women',
  filterFn: p => p.gender === 'Women',
  count: 4
});

showProducts({
  selector: '#new-men',
  filterFn: p => p.gender === 'Men',
  count: 4
});
showProducts({
  selector: '#bestselling-womens-products',
  filterFn: p => p.gender === 'Women',
  sortFn: (a, b) => (b.ratings_count || 0) - (a.ratings_count || 0),
  count: 4
});
showProducts({
  selector: '#bestselling-mens-products',
  filterFn: p => p.gender === 'Men',
  sortFn: (a, b) => (b.ratings_count || 0) - (a.ratings_count || 0),
  count: 4
});

/**
 * Wishlist Utility Functions
 */
const WISHLIST_KEY = 'wishlistProducts';

function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

function setWishlist(arr) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr));
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

function addToWishlist(productId) {
  let wishlist = getWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    setWishlist(wishlist);
    updateWishlistCount();
  }
}

function removeFromWishlist(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(id => id !== productId);
  setWishlist(wishlist);
  updateWishlistCount();
}

function updateWishlistCount() {
  const count = getWishlist().length;
  // Only update the .wishlist-header-icon .count span
  document.querySelectorAll('.wishlist-header-icon .count').forEach(countElem => {
    countElem.textContent = count;
    countElem.style.display = count > 0 ? 'flex' : 'none';
  });
}

/**
 * Update the cart count in the header icon.
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll('.icon[href*="cart.html"] .count, .icon.cart-header-icon .count').forEach(countElem => {
    countElem.textContent = count;
    countElem.style.display = count > 0 ? 'flex' : 'none';
  });
}

function setupWishlistButtons(context=document) {
  context.querySelectorAll('.add-to-wishlist').forEach(btn => {
    const card = btn.closest('.product-card');
    if (!card) return;
    const productId = card.getAttribute('data-product-id');
    if (!productId) return;
    // Always check the current state from localStorage for this productId
    const wishlisted = isInWishlist(productId);
    if (wishlisted) {
      btn.classList.add('wishlisted');
      const svg = btn.querySelector('svg path');
      if(svg) svg.setAttribute('fill', '#e74c3c');
    } else {
      btn.classList.remove('wishlisted');
      const svg = btn.querySelector('svg path');
      if(svg) svg.setAttribute('fill', 'transparent');
    }
    btn.onclick = function(e) {
      e.stopPropagation();
      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        btn.classList.remove('wishlisted');
        const svg = btn.querySelector('svg path');
        if(svg) svg.setAttribute('fill', 'transparent');
      } else {
        addToWishlist(productId);
        btn.classList.add('wishlisted');
        const svg = btn.querySelector('svg path');
        if(svg) svg.setAttribute('fill', '#e74c3c');
      }
      // Update all other wishlist buttons for this productId everywhere on the page
      document.querySelectorAll('.product-card[data-product-id="' + productId + '"] .add-to-wishlist').forEach(otherBtn => {
        if (isInWishlist(productId)) {
          otherBtn.classList.add('wishlisted');
          const svg = otherBtn.querySelector('svg path');
          if(svg) svg.setAttribute('fill', '#e74c3c');
        } else {
          otherBtn.classList.remove('wishlisted');
          const svg = otherBtn.querySelector('svg path');
          if(svg) svg.setAttribute('fill', 'transparent');
        }
      });
    };
  });
}

function showWishlistProducts({ selector }) {
  fetchAllProducts().then(products => {
    const wishlistIds = getWishlist();
    const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
    const grid = document.querySelector(selector);
    if (!grid) return;
    grid.innerHTML = '';
    if (wishlistProducts.length === 0) {
      grid.innerHTML = '<p class="empty-wishlist">Your wishlist is empty.</p>';
      return;
    }
    wishlistProducts.forEach(product => {
      grid.innerHTML += `
        <div class="product-card" data-product-id="${product.id}">
          <div class="card-image">
            <img src="${product.image}" alt="${product.title}">
            <div class="badges">
              <span class="discount">${product.discount || ''} OFF</span>
              <span class="new">NEW</span>
            </div>
            <div class="actions">
              <button class="cirle-icon-btn add-to-cart" type="button" tabindex="-1">
                <!-- Add to Cart SVG -->
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.21053 14.2615H13.0913C17.3431 14.2615 17.9892 11.59 18.7736 7.6964C19 6.5719 19.1127 6.01012 18.8408 5.63592C18.569 5.26172 18.0479 5.26172 17.0048 5.26172H16.6316M4.3158 5.26172H6.21053"
                    stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M9.05263 7.15776C9.51874 7.63711 10.7579 9.52612 11.4211 9.52612M11.4211 9.52612C12.0842 9.52612 13.3234 7.63711 13.7895 7.15776M11.4211 9.52612V1.94735"
                    stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8.57895 19.9475C9.36378 19.9475 10 19.3113 10 18.5265C10 17.7417 9.36378 17.1055 8.57895 17.1055C7.79412 17.1055 7.1579 17.7417 7.1579 18.5265C7.1579 19.3113 7.79412 19.9475 8.57895 19.9475Z"
                    stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M15.2105 19.9475C15.9953 19.9475 16.6315 19.3113 16.6315 18.5265C16.6315 17.7417 15.9953 17.1055 15.2105 17.1055C14.4257 17.1055 13.7894 17.7417 13.7894 18.5265C13.7894 19.3113 14.4257 19.9475 15.2105 19.9475Z"
                    stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button class="cirle-icon-btn add-to-wishlist wishlisted" type="button" tabindex="-1">
                <!-- Wishlist SVG -->
                <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.196 1.5C14.152 1.5 12.387 2.697 11.5 4.443C10.613 2.697 8.848 1.5 6.804 1.5C3.874 1.5 1.5 3.957 1.5 6.981C1.5 10.005 3.317 12.777 5.665 15.054C8.013 17.331 11.5 19.5 11.5 19.5C11.5 19.5 14.874 17.367 17.335 15.054C19.96 12.588 21.5 10.014 21.5 6.981C21.5 3.948 19.126 1.5 16.196 1.5Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="#e74c3c" />
                </svg>
              </button>
              <button class="icon-text-btn view-product" type="button" data-view-btn>
                <!-- View SVG -->
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.4999 31.0799C11.5439 31.0799 5.91992 25.4559 5.91992 18.4999C5.91992 11.5439 11.5439 5.91992 18.4999 5.91992C25.4559 5.91992 31.0799 11.5439 31.0799 18.4999C31.0799 25.4559 25.4559 31.0799 18.4999 31.0799ZM18.4999 7.39992C12.3579 7.39992 7.39992 12.3579 7.39992 18.4999C7.39992 24.6419 12.3579 29.5999 18.4999 29.5999C24.6419 29.5999 29.5999 24.6419 29.5999 18.4999C29.5999 12.3579 24.6419 7.39992 18.4999 7.39992Z"
                fill="currentColor" />
                <path d="M18.2782 25.6783L17.2422 24.6423L23.3842 18.5003L17.2422 12.3583L18.2782 11.3223L25.4562 18.5003L18.2782 25.6783Z"
                fill="currentColor" />
                <path d="M11.8398 17.7598H24.4198V19.2398H11.8398V17.7598Z" fill="currentColor" />
              </button>
            </div>
          </div>
          <div class="card-content">
            <h3>${product.title}</h3>
            <div class="rating-price">
              <div class="rating">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.1875 15.5207L4.54167 9.95921L0 6.21859L6 5.7238L8.33333 0.479004L10.6667 5.7238L16.6667 6.21859L12.125 9.95921L13.4792 15.5207L8.33333 12.5717L3.1875 15.5207Z" fill="#FABB05" />
                </svg>
                <span>${product.rating || ''}</span>
              </div>
              <div class="price">
                <del>₹${product.original_price ? product.original_price.toLocaleString() : ''}</del>
                <strong>₹${product.price ? product.price.toLocaleString() : ''}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    // Custom wishlist button logic for wishlist page
    grid.querySelectorAll('.add-to-wishlist').forEach(btn => {
      const card = btn.closest('.product-card');
      if (!card) return;
      const productId = card.getAttribute('data-product-id');
      btn.onclick = function(e) {
        e.stopPropagation();
        removeFromWishlist(productId);
        card.remove();
        // If no more wishlisted products, show empty message
        if (grid.querySelectorAll('.product-card').length === 0) {
          grid.innerHTML = '<p class="empty-wishlist">Your wishlist is empty.</p>';
        }
      };
      // Fill SVG heart color (already set fill="#e74c3c" above)
    });
  });
}

/**
 * General filter function for products (category, size, price, discount, etc.)
 * @param {Array} products
 * @param {Object} filters
 * @returns {Array}
 */
function filterProducts(products, filters) {
  return products.filter(p => {
    // Category
    if (filters.categories && filters.categories.length) {
      const cat = (p.category || '').toLowerCase();
      let matched = false;
      filters.categories.forEach(fcat => {
        if (cat.includes(fcat) || (fcat === 'tshirts' && cat.includes('t-shirt'))) matched = true;
      });
      if (!matched) return false;
    }
    // Sizes
    if (filters.sizes && filters.sizes.length) {
      if (!p.sizes.some(size => filters.sizes.includes(size))) return false;
    }
    // Price
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    // Discount
    if (filters.minDiscount) {
      const disc = parseInt((p.discount || '').replace('%', '')) || 0;
      if (disc < filters.minDiscount) return false;
    }
    return true;
  });
}

/**
 * Extracts selected filters from the shop-all page DOM
 * (Can be called from any page with the same filter structure)
 */
function getSelectedFilters() {
  // Category
  const catChecks = document.querySelectorAll('.filter-section:nth-child(1) input[type="checkbox"]:checked');
  const categories = Array.from(catChecks).map(cb => cb.parentElement.textContent.trim().toLowerCase());
  // Sizes
  const sizeChecks = document.querySelectorAll('.filter-section:nth-child(2) input[type="checkbox"]:checked');
  const sizes = Array.from(sizeChecks).map(cb => cb.parentElement.textContent.trim());
  // Price
  const priceRange = document.getElementById('price-range');
  const minPrice = priceRange ? parseInt(priceRange.value) : 100;
  const maxPrice = 10000;
  // Discount
  const discountChecks = document.querySelectorAll('.filter-section:nth-child(4) input[type="checkbox"]:checked');
  let minDiscount = 0;
  discountChecks.forEach(cb => {
    const txt = cb.parentElement.textContent;
    if (txt.includes('50%')) minDiscount = Math.max(minDiscount, 50);
    else if (txt.includes('30%')) minDiscount = Math.max(minDiscount, 30);
    else if (txt.includes('10%')) minDiscount = Math.max(minDiscount, 10);
  });
  return { categories, sizes, minPrice, maxPrice, minDiscount };
}

/**
 * Shared paginated product rendering for all pages (shop-all, index, etc.)
 * @param {Object} options
 *   selector: CSS selector for grid
 *   filters: filter object (see getSelectedFilters)
 *   sortFn: optional sort function
 *   page: page number (1-based)
 *   perPage: products per page
 *   onRendered: callback after rendering
 */
function showProductsPaginated({ selector, filters = {}, sortFn, page = 1, perPage = 9, onRendered }) {
  fetchAllProducts().then(products => {
    let filtered = filterProducts(products, filters);
    if (sortFn) filtered = filtered.sort(sortFn);
    const total = filtered.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageProducts = filtered.slice(start, end);
    const grid = document.querySelector(selector);
    if (!grid) return;
    grid.innerHTML = '';
    if (!pageProducts.length) {
      grid.innerHTML = '<div style="padding:24px; width:100%">No products found.</div>';
      if (typeof onRendered === 'function') onRendered({ total });
      return;
    }
    pageProducts.forEach(product => {
      const isWishlisted = isInWishlist(product.id);
      grid.innerHTML += `
        <div class="product-card" data-product-id="${product.id}">
          <div class="card-image">
            <img src="${product.image}" alt="${product.title}">
            <div class="badges">
              <span class="discount">${product.discount || ''} OFF</span>
              <span class="new">NEW</span>
            </div>
            <div class="actions">
              <button class="cirle-icon-btn add-to-cart" type="button" tabindex="-1">
                <!-- Add to Cart SVG -->
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.21053 14.2615H13.0913C17.3431 14.2615 17.9892 11.59 18.7736 7.6964C19 6.5719 19.1127 6.01012 18.8408 5.63592C18.569 5.26172 18.0479 5.26172 17.0048 5.26172H16.6316M4.3158 5.26172H6.21053"
                    stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M9.05263 7.15776C9.51874 7.63711 10.7579 9.52612 11.4211 9.52612M11.4211 9.52612C12.0842 9.52612 13.3234 7.63711 13.7895 7.15776M11.4211 9.52612V1.94735"
                    stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8.57895 19.9475C9.36378 19.9475 10 19.3113 10 18.5265C10 17.7417 9.36378 17.1055 8.57895 17.1055C7.79412 17.1055 7.1579 17.7417 7.1579 18.5265C7.1579 19.3113 7.79412 19.9475 8.57895 19.9475Z"
                    stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M15.2105 19.9475C15.9953 19.9475 16.6315 19.3113 16.6315 18.5265C16.6315 17.7417 15.9953 17.1055 15.2105 17.1055C14.4257 17.1055 13.7894 17.7417 13.7894 18.5265C13.7894 19.3113 14.4257 19.9475 15.2105 19.9475Z"
                    stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button class="cirle-icon-btn add-to-wishlist${isWishlisted ? ' wishlisted' : ''}" type="button" tabindex="-1">
                <!-- Wishlist SVG -->
                <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.196 1.5C14.152 1.5 12.387 2.697 11.5 4.443C10.613 2.697 8.848 1.5 6.804 1.5C3.874 1.5 1.5 3.957 1.5 6.981C1.5 10.005 3.317 12.777 5.665 15.054C8.013 17.331 11.5 19.5 11.5 19.5C11.5 19.5 14.874 17.367 17.335 15.054C19.96 12.588 21.5 10.014 21.5 6.981C21.5 3.948 19.126 1.5 16.196 1.5Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="${isWishlisted ? '#e74c3c' : 'transparent'}" />
                </svg>
              </button>
              <button class="icon-text-btn view-product" type="button" data-view-btn>
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.4999 31.0799C11.5439 31.0799 5.91992 25.4559 5.91992 18.4999C5.91992 11.5439 11.5439 5.91992 18.4999 5.91992C25.4559 5.91992 31.0799 11.5439 31.0799 18.4999C31.0799 25.4559 25.4559 31.0799 18.4999 31.0799ZM18.4999 7.39992C12.3579 7.39992 7.39992 12.3579 7.39992 18.4999C7.39992 24.6419 12.3579 29.5999 18.4999 29.5999C24.6419 29.5999 29.5999 24.6419 29.5999 18.4999C29.5999 12.3579 24.6419 7.39992 18.4999 7.39992Z"
                fill="currentColor" />
                <path d="M18.2782 25.6783L17.2422 24.6423L23.3842 18.5003L17.2422 12.3583L18.2782 11.3223L25.4562 18.5003L18.2782 25.6783Z"
                fill="currentColor" />
                <path d="M11.8398 17.7598H24.4198V19.2398H11.8398V17.7598Z" fill="currentColor" />
              </button>
            </div>
          </div>
          <div class="card-content">
            <h3>${product.title}</h3>
            <div class="rating-price">
              <div class="rating">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.1875 15.5207L4.54167 9.95921L0 6.21859L6 5.7238L8.33333 0.479004L10.6667 5.7238L16.6667 6.21859L12.125 9.95921L13.4792 15.5207L8.33333 12.5717L3.1875 15.5207Z" fill="#FABB05" />
                </svg>
                <span>${product.rating || ''}</span>
              </div>
              <div class="price">
                <del>₹${product.original_price ? product.original_price.toLocaleString() : ''}</del>
                <strong>₹${product.price ? product.price.toLocaleString() : ''}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    // Attach wishlist button logic after rendering cards
    setupWishlistButtons(grid);
    if (typeof onRendered === 'function') onRendered({ total });
  });
}

/**
 * Sort products array by a given sort key
 * @param {Array} products
 * @param {string} sortKey - 'newest', 'price-asc', 'price-desc'
 * @returns {Array}
 */
function sortProducts(products, sortKey) {
  if (!Array.isArray(products)) return [];
  if (sortKey === 'price-asc') {
    return products.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortKey === 'price-desc') {
    return products.slice().sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortKey === 'newest') {
    return products.slice().sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
  } else if (sortKey === 'oldest') {
    return products.slice().sort((a, b) => (a.created_at || 0) - (b.created_at || 0));
  }
  return products;
}

/**
 * Get selected sort value from a select element by name
 * @param {string} name
 * @returns {string}
 */
function getSelectedSortValue(name = 'sort-by') {
  const select = document.querySelector(`select[name="${name}"]`);
  return select ? select.value : 'newest';
}

document.addEventListener('DOMContentLoaded', () => {
  updateWishlistCount();
  updateCartCount();
  setupWishlistButtons();
  // Dynamically render wishlist products if on wishlist page
  if (document.querySelector('.wishlist-products .product-grid, #wishlist-products')) {
    showWishlistProducts({ selector: '.wishlist-products .product-grid' });
    showWishlistProducts({ selector: '#wishlist-products' });
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    updateWishlistCount();
  }
});

// If shop-all.js or shop-all.html uses a custom product rendering, ensure after rendering:
// setupWishlistButtons(document);
// Or, if using showProducts, it will work automatically.
// No further code changes needed here if shop-all uses showProducts and setupWishlistButtons.

/**
 * Render all available sizes as radio buttons and allow changing size in cart.
 * This version allows changing size for a cart item without removing it if the new size already exists.
 * If the new size exists in cart, just update the size of the current item and merge quantities.
 * If not, just update the size.
 * If there are multiple cart items for the same product (different sizes), all sizes are available for each.
 */
function renderProductSizes(sizesDiv, allSizes, selectedSize, onChange) {
  sizesDiv.innerHTML = '';
  allSizes.forEach(size => {
    const id = `cart-size-${size}-${Math.random().toString(36).slice(2, 8)}`;
    const label = document.createElement('label');
    label.style.marginRight = '8px';
    label.innerHTML = `
      <input type="radio" name="cart-size-${sizesDiv.closest('tr') ? sizesDiv.closest('tr').getAttribute('data-product-id') + '-' + sizesDiv.closest('tr').getAttribute('data-size') : ''}" value="${size}" ${size === selectedSize ? 'checked' : ''} style="margin-right:2px;">
      ${size}
    `;
    label.querySelector('input').addEventListener('change', function(e) {
      if (typeof onChange === 'function') onChange(size);
    });
    sizesDiv.appendChild(label);
  });
}

/**
 * Render cart summary table rows as <tr class="cart-summary__item"> from localStorage.
 * Calculates subtotal, discount, platform fees, and total using offer and regular price.
 * Updates the cart totals inside the .totals-row and .shipping HTML structure.
 * @param {string} tbodySelector - Selector for the cart table tbody.
 * @param {string} totalSelector - Selector for the cart total element.
 */
function renderCartSummaryTableRows(tbodySelector = '#cart-tbody', totalSelector = '#cart-total') {
  const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  const tbody = document.querySelector(tbodySelector);
  const totalsContainer = document.querySelector('.cart-totals-box, .cart-totals, .cart-totals-section, .cart-totals-wrapper, .cart-totals, .totals-section, .totals, .cart-summary-totals, .cart-summary__totals, .cart-summary-totals, .cart-summary__totals, .totals-row')?.parentElement || document.querySelector('.totals-row')?.parentElement;
  if (!tbody) return;
  tbody.innerHTML = '';
  let subtotal = 0;
  let totalDiscount = 0;
  let platformFees = 0;

  fetchAllProducts().then(products => {
    cart.forEach((item, idx) => {
      const prod = products.find(p => p.id === item.id);
      const allSizes = prod && prod.sizes ? prod.sizes : (item.sizes || [item.size]);
      const qty = item.qty;

      // Use regular price and offer price from product data if available
      const regularPrice = prod && prod.original_price ? prod.original_price : item.original_price || item.price;
      const offerPrice = prod && prod.price ? prod.price : item.price;

      // Discount calculation based on regular and offer price
      const discountAmount = (regularPrice - offerPrice) * qty;
      const itemSubtotal = offerPrice * qty;

      subtotal += regularPrice * qty;
      totalDiscount += discountAmount;

      // Platform fee: 2% of discounted subtotal per item
      const itemPlatformFee = Math.round(itemSubtotal * 0.02);
      platformFees += itemPlatformFee;

      const tr = document.createElement('tr');
      tr.className = 'cart-summary__item';
      tr.setAttribute('data-product-id', item.id);
      tr.setAttribute('data-size', item.size || '');

      // Only show regular price and subtotal, not discounted price in the table
      tr.innerHTML = `
        <td data-label="Product">
          <div class="product-details">
            <img src="${item.image}" alt="Product Image" />
            <div class="product-info">
              <p class="product-title">${item.title}</p>
              <div class="sizes" data-sizes='${JSON.stringify(allSizes)}' data-selected="${item.size || ''}"></div>
            </div>
          </div>
        </td>
        <td data-label="Price">
          <span class="product-price">
            <del>₹${regularPrice.toLocaleString()}</del>
          </span>
        </td>
        <td data-label="Quantity">
          <span class="quantity-selector"></span>
        </td>
        <td data-label="Subtotal">
          <span class="subtotal">₹${itemSubtotal.toLocaleString()}</span>
        </td>
        <td data-label="Action">
          <span class="actions">
            <button class="remove-btn">×</button>
          </span>
        </td>
      `;
      tbody.appendChild(tr);

      // Render all available sizes as radio buttons, allow changing size in cart
      const sizesDiv = tr.querySelector('.sizes');
      if (sizesDiv && window.renderProductSizes) {
        // For this product, show all sizes available for this product (not just the ones in cart)
        window.renderProductSizes(sizesDiv, allSizes, item.size, function(newSize) {
          let cartArr = JSON.parse(localStorage.getItem('cartProducts') || '[]');
          // Only update if the size is actually changed
          if (cartArr[idx].size === newSize) return;
          // Check if another cart item with same id and newSize exists
          const existingIdx = cartArr.findIndex((ci, i) => ci.id === item.id && ci.size === newSize && i !== idx);
          if (existingIdx !== -1) {
            // Merge quantities and remove the current item
            cartArr[existingIdx].qty += cartArr[idx].qty;
            cartArr.splice(idx, 1);
          } else {
            // Just update the size
            cartArr[idx].size = newSize;
          }
          localStorage.setItem('cartProducts', JSON.stringify(cartArr));
          renderCartSummaryTableRows(tbodySelector, totalSelector);
        });
      }

      // Quantity selector
      const qtyDiv = tr.querySelector('.quantity-selector');
      if (qtyDiv && window.renderCartQuantitySelector) {
        window.renderCartQuantitySelector(qtyDiv, item, function(updatedItem) {
          renderCartSummaryTableRows(tbodySelector, totalSelector);
        });
      }

      // Remove button
      const removeBtn = tr.querySelector('.remove-btn');
      if (removeBtn) {
        removeBtn.onclick = function() {
          let cartArr = JSON.parse(localStorage.getItem('cartProducts') || '[]');
          cartArr = cartArr.filter(ci => !(ci.id === item.id && ci.size === item.size));
          localStorage.setItem('cartProducts', JSON.stringify(cartArr));
          tr.remove();
          renderCartSummaryTableRows(tbodySelector, totalSelector);
        };
      }
    });

    // Update the custom cart totals markup
    updateCartTotalsCustom(subtotal, totalDiscount, platformFees);
  });
}

/**
 * Update the cart totals summary using the custom HTML structure.
 * Looks for .totals-row, .shipping, and .totals-row.total in the DOM and updates their values.
 * @param {number} subtotal
 * @param {number} totalDiscount
 * @param {number} platformFees
 */
function updateCartTotalsCustom(subtotal, totalDiscount, platformFees) {
  // Subtotal
  const subtotalRow = document.querySelector('.totals-row:not(.total) span:nth-child(2)');
  if (subtotalRow) {
    subtotalRow.textContent = `₹${subtotal.toLocaleString()}`;
  }
  // Discount
  const discountSpan = document.querySelector('.shipping .discount');
  if (discountSpan) {
    discountSpan.textContent = `- ₹${totalDiscount.toLocaleString()}`;
  }
  // Platform charge
  const platformSpan = document.querySelector('.shipping li span:not(.discount)');
  if (platformSpan) {
    platformSpan.textContent = `₹${platformFees.toLocaleString()}`;
  }
  // Total
  const totalRow = document.querySelector('.totals-row.total span:nth-child(2)');
  if (totalRow) {
    const total = subtotal - totalDiscount + platformFees;
    totalRow.textContent = `₹${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/**
 * Store cart summary and details in localStorage for checkout.
 * Call this before redirecting to checkout.html.
 */
function storeCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  fetchAllProducts().then(products => {
    let subtotal = 0;
    let totalDiscount = 0;
    let platformFees = 0;
    let items = [];
    cart.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      const regularPrice = prod && prod.original_price ? prod.original_price : item.original_price || item.price;
      const offerPrice = prod && prod.price ? prod.price : item.price;
      const qty = item.qty;
      const discountAmount = (regularPrice - offerPrice) * qty;
      const itemSubtotal = offerPrice * qty;
      subtotal += regularPrice * qty;
      totalDiscount += discountAmount;
      platformFees += Math.round(itemSubtotal * 0.02);
      items.push({
        id: item.id,
        title: item.title,
        image: item.image,
        size: item.size,
        qty: item.qty,
        price: offerPrice,
        original_price: regularPrice,
        subtotal: itemSubtotal
      });
    });
    const total = subtotal - totalDiscount + platformFees;
    const summary = {
      items,
      subtotal,
      totalDiscount,
      platformFees,
      total
    };
    localStorage.setItem('checkoutSummary', JSON.stringify(summary));
    // After storing, you can redirect to checkout.html
    window.location.href = 'checkout.html';
  });
}

/**
 * Add product to cart. If the same product (id + size) exists, increase quantity instead of duplicating.
 * If a different size, add as a new entry (so same product with different sizes are separate).
 * @param {Object} product - The product object to add (must include id, size, qty, etc.)
 */
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  // Only merge if id and size BOTH match, otherwise add as new entry (so different sizes are separate)
  const existing = cart.find(
    item => item.id === product.id && item.size === product.size
  );
  if (existing) {
    existing.qty += product.qty || 1;
  } else {
    cart.push(product);
  }
  localStorage.setItem('cartProducts', JSON.stringify(cart));
}

/**
 * Render the checkout summary in the checkout page.
 * Call this on checkout.html after DOMContentLoaded.
 * Expects a container with class "checkout-summary" and a child ".summary-box".
 * Shows product image, title, size, qty, price, discount per item, and totals.
 */
function renderCheckoutSummaryBox() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  if (!summary || !summary.items) return;
  const summaryBox = document.querySelector('.checkout-summary .summary-box');
  if (!summaryBox) return;

  // Build order summary items with discount per item
  let itemsHtml = '';
  summary.items.forEach(item => {
    const itemDiscount = (item.original_price - item.price) * item.qty;
    itemsHtml += `
      <div class="summary-item">
        <img src="${item.image}" alt="${item.title}" />
        <div>
          <p>${item.title}${item.size ? ' (' + item.size + ')' : ''} × ${item.qty}</p>
          <span>
            <del style="color:#888;font-size:13px;">₹${(item.original_price * item.qty).toLocaleString()}</del>
            <strong style="margin-left:5px;">₹${(item.price * item.qty).toLocaleString()}</strong>
            ${itemDiscount > 0 ? `<span style="color:#e74c3c;font-size:13px;display:block;">You save ₹${itemDiscount.toLocaleString()}</span>` : ''}
          </span>
        </div>
      </div>
    `;
  });

  // Build summary list
  let summaryListHtml = `
    <ul class="summary-list">
      <li><span>Free shipping</span></li>
      <li><span>Discount</span> <strong>- ₹${summary.totalDiscount.toLocaleString()}</strong></li>
      <li><span>Platform charge</span> ₹${summary.platformFees.toLocaleString()}</li>
      <li><span>Cash on Delivery</span></li>
    </ul>
  `;

  // Build total
  let totalHtml = `
    <div class="summary-total">
      <p>Total</p>
      <strong>₹${summary.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
    </div>
  `;

  // Find secure note and checkout button if present
  const secureNote = summaryBox.querySelector('.secure-note') ? summaryBox.querySelector('.secure-note').outerHTML : '';
  const checkoutBtn = summaryBox.querySelector('.checkout-btn') ? summaryBox.querySelector('.checkout-btn').outerHTML : '';

  // Render everything
  summaryBox.innerHTML = `
    <h3>Order Summary</h3>
    ${itemsHtml}
    ${summaryListHtml}
    ${totalHtml}
    ${checkoutBtn || ''}
    ${secureNote || ''}
  `;
}

// Expose globally for checkout.html
window.renderCheckoutSummaryBox = renderCheckoutSummaryBox;

// Expose storeCheckoutSummary globally for cart.html checkout button
window.storeCheckoutSummary = storeCheckoutSummary;