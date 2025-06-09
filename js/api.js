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
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2959 19.04C5.03188 19.04 0.775879 14.784 0.775879 9.52C0.775879 4.256 5.03188 0 10.2959 0C15.5599 0 19.8159 4.256 19.8159 9.52C19.8159 14.784 15.5599 19.04 10.2959 19.04ZM10.2959 1.12C5.64788 1.12 1.89588 4.872 1.89588 9.52C1.89588 14.168 5.64788 17.92 10.2959 17.92C14.9439 17.92 18.6959 14.168 18.6959 9.52C18.6959 4.872 14.9439 1.12 10.2959 1.12Z" fill="#4E4E4E"/>
<path d="M10.5599 14.9519L9.77588 14.1679L14.4239 9.51989L9.77588 4.87189L10.5599 4.08789L15.9919 9.51989L10.5599 14.9519Z" fill="#4E4E4E"/>
<path d="M5.77588 8.96094H15.2959V10.0809H5.77588V8.96094Z" fill="#4E4E4E"/>
</svg>

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
        const addToCartBtn = card.querySelector('.add-to-cart');
        if (addToCartBtn && prod) {
          addToCartBtn.addEventListener('click', function (e) {
            e.stopPropagation();
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
  document.querySelectorAll('.wishlist-header-icon .count').forEach(countElem => {
    countElem.textContent = count;
    countElem.style.display = count > 0 ? 'flex' : 'none';
  });
}



function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  const existing = cart.find(
    item => item.id === product.id && item.size === product.size
  );
  if (existing) {
    existing.qty += product.qty || 1;
  } else {
    cart.push(product);
  }
  localStorage.setItem('cartProducts', JSON.stringify(cart));
  updateCartCount();
  showToast('Added to cart!');
}




function showToast(message, duration = 2000) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.style.position = 'fixed';
    toast.style.left = '50%';
    toast.style.bottom = '40px';
    toast.style.transform = 'translateX(-50%)';
    toast.style.zIndex = '9999';
    toast.style.background = '#D1EAF5';
    toast.style.color = '#4E4E4E';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '3px';
    toast.style.fontSize = '16px';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 2px 16px rgba(0,0,0,0.15)';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
  }, duration);
}


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
    showToast(`Removed from wishlist!`);
  } else {
    addToWishlist(productId);
    btn.classList.add('wishlisted');
    const svg = btn.querySelector('svg path');
    if(svg) svg.setAttribute('fill', '#e74c3c');
    showToast('Added to wishlist!');
  }
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
    grid.querySelectorAll('.add-to-wishlist').forEach(btn => {
      const card = btn.closest('.product-card');
      if (!card) return;
      const productId = card.getAttribute('data-product-id');
      btn.onclick = function(e) {
        e.stopPropagation();
        removeFromWishlist(productId);
        card.remove();
        if (grid.querySelectorAll('.product-card').length === 0) {
          grid.innerHTML = '<p class="empty-wishlist">Your wishlist is empty.</p>';
        }
      };
    });
  });
}


function filterProducts(products, filters) {
  return products.filter(p => {
    if (filters.gender && Array.isArray(filters.gender) && filters.gender.length) {
      if (!filters.gender.includes(p.gender)) return false;
    }
    if (filters.categories && filters.categories.length) {
      const cat = (p.category || '').toLowerCase();
      let matched = false;
      filters.categories.forEach(fcat => {
        if (cat.includes(fcat) || (fcat === 'tshirts' && cat.includes('t-shirt'))) matched = true;
      });
      if (!matched) return false;
    }
    if (filters.sizes && filters.sizes.length) {
      if (!p.sizes.some(size => filters.sizes.includes(size))) return false;
    }
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.minDiscount) {
      const disc = parseInt((p.discount || '').replace('%', '')) || 0;
      if (disc < filters.minDiscount) return false;
    }
    return true;
  });
}

function getSelectedFilters() {

  const catChecks = document.querySelectorAll('.filter-section:nth-child(1) input[type="checkbox"]:checked');
  const categories = Array.from(catChecks).map(cb => cb.parentElement.textContent.trim().toLowerCase());

  const sizeChecks = document.querySelectorAll('.filter-section:nth-child(2) input[type="checkbox"]:checked');
  const sizes = Array.from(sizeChecks).map(cb => cb.parentElement.textContent.trim());

  const priceRange = document.getElementById('price-range');
  const minPrice = priceRange ? parseInt(priceRange.value) : 100;
  const maxPrice = 10000;
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
    grid.querySelectorAll('.product-card').forEach(card => {
      const id = card.getAttribute('data-product-id');
      const prod = pageProducts.find(p => p.id === id);
      const viewBtn = card.querySelector('[data-view-btn]');
      if (viewBtn && prod) {
        viewBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          localStorage.setItem('selectedProduct', JSON.stringify(prod));
          window.location.href = `product.html?id=${prod.id}`;
        });
      }
      const addToCartBtn = card.querySelector('.add-to-cart');
      if (addToCartBtn && prod) {
        addToCartBtn.addEventListener('click', function (e) {
          e.stopPropagation();
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
    setupWishlistButtons(grid);
    if (typeof onRendered === 'function') onRendered({ total });
  });
}


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


function getSelectedSortValue(name = 'sort-by') {
  const select = document.querySelector(`select[name="${name}"]`);
  return select ? select.value : 'newest';
}

document.addEventListener('DOMContentLoaded', function() {
  updateWishlistCount();
  updateCartCount();
  setupWishlistButtons();
  if (document.querySelector('.wishlist-products .product-grid, #wishlist-products')) {
    showWishlistProducts({ selector: '.wishlist-products .product-grid' });
    showWishlistProducts({ selector: '#wishlist-products' });
  }
  if (document.getElementById('product-highlight')) {
    showProducts({
      selector: '#product-highlight',
      filterFn: () => true,
      sortFn: (a, b) => (b.rating || 0) - (a.rating || 0),
      count: 2
    });
  }

  function renderCategoryPageGrid({ gender, gridId, paginationTopId, paginationBottomId, resultsId, sortSelectName }) {
    let currentPage = 1;
    let currentSort = 'newest';
    const perPage = 9;

    function render(page = 1, sort = currentSort) {
      showProductsPaginated({
        selector: `#${gridId}`,
        filters: { gender: [gender] },
        sortFn: (a, b) => {
          if (sort === 'price-asc') return (a.price || 0) - (b.price || 0);
          if (sort === 'price-desc') return (b.price || 0) - (a.price || 0);
          if (sort === 'oldest') return (a.created_at || 0) - (b.created_at || 0);
          return (b.created_at || 0) - (a.created_at || 0);
        },
        page,
        perPage,
        onRendered: ({ total }) => {
          renderPagination(total, page);
          renderResults(total, page);
        }
      });
    }

    function renderPagination(total, page) {
      const totalPages = Math.ceil(total / perPage);
      const pagHtml = [];
      if (totalPages <= 1) {
        document.getElementById(paginationTopId).innerHTML = '';
        document.getElementById(paginationBottomId).innerHTML = '';
        return;
      }
      for (let i = 1; i <= totalPages; i++) {
        pagHtml.push(`<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`);
      }
      document.getElementById(paginationTopId).innerHTML = pagHtml.join('');
      document.getElementById(paginationBottomId).innerHTML = pagHtml.join('');
      [paginationTopId, paginationBottomId].forEach(pid => {
        document.getElementById(pid).querySelectorAll('.page-btn').forEach(btn => {
          btn.onclick = () => {
            currentPage = parseInt(btn.getAttribute('data-page'));
            render(currentPage, currentSort);
            window.scrollTo({ top: document.getElementById(gridId).offsetTop - 80, behavior: 'smooth' });
          };
        });
      });
    }

    function renderResults(total, page) {
      const start = (page - 1) * perPage + 1;
      const end = Math.min(page * perPage, total);
      document.getElementById(resultsId).textContent = total
        ? `Showing ${start}–${end} of ${total} results`
        : 'No products found.';
    }

    const sortSelect = document.querySelector(`select[name="${sortSelectName}"]`);
    if (sortSelect) {
      sortSelect.onchange = function () {
        currentSort = sortSelect.value;
        currentPage = 1;
        render(currentPage, currentSort);
      };
    }

    render(currentPage, currentSort);
  }

  if (document.getElementById('shop-all-product-grid-men')) {
    renderCategoryPageGrid({
      gender: 'Men',
      gridId: 'shop-all-product-grid-men',
      paginationTopId: 'pagination-men',
      paginationBottomId: 'pagination-men-bottom',
      resultsId: 'results-men',
      sortSelectName: 'sort-by-men'
    });
  }
  if (document.getElementById('shop-all-product-grid-women')) {
    renderCategoryPageGrid({
      gender: 'Women',
      gridId: 'shop-all-product-grid-women',
      paginationTopId: 'pagination-women',
      paginationBottomId: 'pagination-women-bottom',
      resultsId: 'results-women',
      sortSelectName: 'sort-by-women'
    });
  }

  if (document.getElementById('category-product-grid')) {
    function getCategoryFilters() {
      const gender = document.getElementById('filter-gender').value;
      const category = document.getElementById('filter-category').value;
      const size = document.getElementById('filter-size').value;
      const discount = document.getElementById('filter-discount').value;
      const sort = document.getElementById('filter-sort').value;
      return {
        gender: gender ? [gender] : [],
        categories: category ? [category.toLowerCase()] : [],
        sizes: size ? [size] : [],
        minDiscount: discount ? parseInt(discount) : 0,
        sort
      };
    }

    let currentPage = 1;
    const perPage = 12; 

    function renderCategoryGrid(page = 1) {
      const filters = getCategoryFilters();
      showProductsPaginated({
        selector: '#category-product-grid',
        filters,
        sortFn: (a, b) => {
          if (filters.sort === 'price-asc') return (a.price || 0) - (b.price || 0);
          if (filters.sort === 'price-desc') return (b.price || 0) - (a.price || 0);
          if (filters.sort === 'oldest') return (a.created_at || 0) - (b.created_at || 0);
          return (b.created_at || 0) - (a.created_at || 0);
        },
        page,
        perPage,
        onRendered: ({ total }) => {
          renderPagination(total, page);
          renderResults(total, page);
        }
      });
    }

    function renderPagination(total, page) {
      const totalPages = Math.ceil(total / perPage);
      const pagHtml = [];
      if (totalPages <= 1) {
        document.getElementById('pagination-category').innerHTML = '';
        document.getElementById('pagination-category-bottom').innerHTML = '';
        return;
      }
      for (let i = 1; i <= totalPages; i++) {
        pagHtml.push(`<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`);
      }
      document.getElementById('pagination-category').innerHTML = pagHtml.join('');
      document.getElementById('pagination-category-bottom').innerHTML = pagHtml.join('');
      ['pagination-category', 'pagination-category-bottom'].forEach(pid => {
        document.getElementById(pid).querySelectorAll('.page-btn').forEach(btn => {
          btn.onclick = () => {
            currentPage = parseInt(btn.getAttribute('data-page'));
            renderCategoryGrid(currentPage);
            window.scrollTo({ top: document.getElementById('category-product-grid').offsetTop - 80, behavior: 'smooth' });
          };
        });
      });
    }

    function renderResults(total, page) {
      const start = (page - 1) * perPage + 1;
      const end = Math.min(page * perPage, total);
      document.getElementById('results-category').textContent = total
        ? `Showing ${start}–${end} of ${total} results`
        : 'No products found.';
    }

    ['filter-gender', 'filter-category', 'filter-size', 'filter-discount', 'filter-sort'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.onchange = function () {
          currentPage = 1;
          renderCategoryGrid(currentPage);
        };
      }
    });

    renderCategoryGrid(currentPage);
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    updateWishlistCount();
  }
});


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

      const regularPrice = prod && prod.original_price ? prod.original_price : item.original_price || item.price;
      const offerPrice = prod && prod.price ? prod.price : item.price;

      const discountAmount = (regularPrice - offerPrice) * qty;
      const itemSubtotal = offerPrice * qty;

      subtotal += regularPrice * qty;
      totalDiscount += discountAmount;

      const itemPlatformFee = Math.round(itemSubtotal * 0.02);
      platformFees = 5;
      const tr = document.createElement('tr');
      tr.className = 'cart-summary__item';
      tr.setAttribute('data-product-id', item.id);
      tr.setAttribute('data-size', item.size || '');

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

      const sizesDiv = tr.querySelector('.sizes');
      if (sizesDiv && window.renderProductSizes) {
        window.renderProductSizes(sizesDiv, allSizes, item.size, function(newSize) {
          let cartArr = JSON.parse(localStorage.getItem('cartProducts') || '[]');
          if (cartArr[idx].size === newSize) return;
          const existingIdx = cartArr.findIndex((ci, i) => ci.id === item.id && ci.size === newSize && i !== idx);
          if (existingIdx !== -1) {
            cartArr[existingIdx].qty += cartArr[idx].qty;
            cartArr.splice(idx, 1);
          } else {
            cartArr[idx].size = newSize;
          }
          localStorage.setItem('cartProducts', JSON.stringify(cartArr));
          renderCartSummaryTableRows(tbodySelector, totalSelector);
        });
      }

     const qtyDiv = tr.querySelector('.quantity-selector');
if (qtyDiv && window.renderCartQuantitySelector) {
  window.renderCartQuantitySelector(qtyDiv, item, function(updatedItem) {
    let cartArr = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    const cartIdx = cartArr.findIndex(ci => ci.id === item.id && ci.size === item.size);
    if (cartIdx !== -1) {
      if (updatedItem.qty <= 0) {
        cartArr.splice(cartIdx, 1);
        localStorage.setItem('cartProducts', JSON.stringify(cartArr));
        tr.remove();
      } else {
        cartArr[cartIdx].qty = updatedItem.qty;
        localStorage.setItem('cartProducts', JSON.stringify(cartArr));
        const offerPrice = item.price;
        const subtotalCell = tr.querySelector('.subtotal');
        if (subtotalCell) {
          subtotalCell.textContent = `₹${(offerPrice * updatedItem.qty).toLocaleString()}`;
        }
      }
    }
    updateCartCount();
    updateCartTotalsCustom(
      cartArr.reduce((sum, i) => sum + (i.original_price || i.price) * i.qty, 0),
      cartArr.reduce((sum, i) => sum + ((i.original_price || i.price) - i.price) * i.qty, 0),
      5 
    );
  });
}

      const removeBtn = tr.querySelector('.remove-btn');
      if (removeBtn) {
        removeBtn.onclick = function() {
          let cartArr = JSON.parse(localStorage.getItem('cartProducts') || '[]');
          cartArr = cartArr.filter(ci => !(ci.id === item.id && ci.size === item.size));
          localStorage.setItem('cartProducts', JSON.stringify(cartArr));
          tr.remove();
          updateCartCount(); 
        };
      }
    });

    updateCartTotalsCustom(subtotal, totalDiscount, platformFees);
  });
}


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
    totalRow.textContent = `₹${total.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  }
}


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
      platformFees = 5; 
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
    window.location.href = 'checkout.html';
  });
}


function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  const existing = cart.find(
    item => item.id === product.id && item.size === product.size
  );
  let newQty = product.qty || 1;
  if (existing) {
    existing.qty += newQty;
    localStorage.setItem('cartProducts', JSON.stringify(cart));
    updateCartCount();
    showToast(`Added to cart! x ${existing.qty}`);
  } else {
    cart.push(product);
    localStorage.setItem('cartProducts', JSON.stringify(cart));
    updateCartCount();
    showToast('Added to cart!');
  }
}


window.updateCartItemSize = function(sizeEl) {
  var cartRow = sizeEl.closest('tr.cart-summary__item');
  if (!cartRow) return;

  var productTitle = cartRow.querySelector('.product-title')?.textContent?.trim();
  var newSize = sizeEl.textContent.trim();

  let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  let updated = false;
  cart.forEach(item => {
    if (item.title === productTitle) {
      item.size = newSize;
      updated = true;
    }
  });
  if (updated) {
    localStorage.setItem('cartProducts', JSON.stringify(cart));
  }
};


window.attachCartSizeListeners = function() {
  document.querySelectorAll('#cart-tbody .sizes button, #cart-tbody .sizes a, #cart-tbody .sizes span').forEach(function(el) {
    el.addEventListener('click', function(e) {
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        e.preventDefault();
      }
      var parent = el.parentElement;
      if (parent) {
        parent.querySelectorAll('.active').forEach(function(activeEl) {
          activeEl.classList.remove('active');
        });
      }
      el.classList.add('active');
      window.updateCartItemSize(el);
    });
  });
};


window.storeCheckoutSummary = function() {
  let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  if (!cart.length) return;
  let subtotal = cart.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
  let totalDiscount = cart.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
  let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0) + 5;
  let platformFees = 5;
  cart.forEach(item => {
    if (!item.size) item.size = '-';
  });
  let summary = {
    items: cart,
    subtotal,
    totalDiscount,
    platformFees,
    total
  };
  localStorage.setItem('checkoutSummary', JSON.stringify(summary));
  window.location.href = 'checkout.html';
};


function renderRelatedProducts({ productId, selector, count = 4 }) {
  fetchAllProducts().then(products => {
    const currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;
    let related = products.filter(
      p => p.id !== currentProduct.id && p.category === currentProduct.category
    );
    if (related.length < count) {
      related = related.concat(
        products.filter(
          p => p.id !== currentProduct.id && !related.some(r => r.id === p.id)
        )
      );
    }
    related = related.slice(0, count);

    const grid = document.querySelector(selector);
    if (!grid) return;
    grid.innerHTML = '';
  

    if (related && related.length) {
  related.forEach(prod => {
    const isWishlisted = isInWishlist(prod.id);
    grid.innerHTML += `
      <div class="product-card" data-product-id="${prod.id}">
        <div class="card-image">
          <img src="${prod.image}" alt="${prod.title}">
          <div class="badges">
            <span class="discount">${prod.discount || ''} OFF</span>
            <span class="new">NEW</span>
          </div>
          <div class="actions">
            <button class="cirle-icon-btn add-to-cart" type="button" tabindex="-1">
              <!-- add to cart svg -->
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
            </button>
          </div>
        </div>
        <div class="card-content">
          <h3>${prod.title}</h3>
          <div class="rating-price">
            <div class="rating">
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.1875 15.5207L4.54167 9.95921L0 6.21859L6 5.7238L8.33333 0.479004L10.6667 5.7238L16.6667 6.21859L12.125 9.95921L13.4792 15.5207L8.33333 12.5717L3.1875 15.5207Z" fill="#FABB05" />
              </svg>
              <span>${prod.rating || ''}</span>
            </div>
            <div class="price">
              <del>₹${prod.original_price ? prod.original_price.toLocaleString() : ''}</del>
              <strong>₹${prod.price ? prod.price.toLocaleString() : ''}</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}
    
    grid.querySelectorAll('.product-card').forEach(card => {
      const id = card.getAttribute('data-product-id');
      const prod = related.find(p => p.id === id);
      const viewBtn = card.querySelector('[data-view-btn]');
      if (viewBtn && prod) {
        viewBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          localStorage.setItem('selectedProduct', JSON.stringify(prod));
          window.location.href = `product.html?id=${prod.id}`;
        });
      }
      const addToCartBtn = card.querySelector('.add-to-cart');
      if (addToCartBtn && prod) {
        addToCartBtn.addEventListener('click', function (e) {
          e.stopPropagation();
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
    setupWishlistButtons(grid);
  });
}

fetchAllProducts().then(products => {
}).catch(err => {
  console.error('[api.js] fetchAllProducts error:', err);
});


function getProductReviews(productId) {
  return fetchAllProducts().then(products => {
    const product = products.find(p => p.id === productId);
    return product && Array.isArray(product.reviews) ? product.reviews : [];
  });
}

window.getProductReviews = getProductReviews;


function renderProductReviews(productId, selector = '.review-summary__grid') {
  getProductReviews(productId).then(reviews => {
    const grid = document.querySelector(selector);
    if (!grid) return;
    grid.innerHTML = '';
    if (!reviews.length) {
      grid.innerHTML = '<div class="review-summary__card">No reviews yet.</div>';
      return;
    }
    reviews.slice(0, 4).forEach(review => {
      grid.innerHTML += `
        <div class="review-summary__card">
          <span class="badge">★ ${review.rating ? review.rating.toFixed(1) : ''}</span>
          <h4>${review.title ? review.title : 'Customer Review'}</h4>
          <p class="review-summary__comment">${review.text ? review.text : ''}</p>
          <div class="review-meta">
            ${review.name ? `<span class="review-author">${review.name}</span>` : ''}
            ${review.date ? `<span class="review-date" style="font-size:12px;color:#888;margin-left:8px;">${formatReviewDate(review.date)}</span>` : ''}
          </div>
        </div>
      `;
    });
  });
}


window.renderProductReviews = renderProductReviews;


function renderRandomReviewsSwiper(selector = '#review-swiper-wrapper') {
  fetchAllProducts().then(products => {
  
    let allReviews = [];
    products.forEach(product => {
      if (Array.isArray(product.reviews)) {
        product.reviews.forEach(r => {
          allReviews.push({
            ...r,
            product: product.title
          });
        });
      }
    });
 
    allReviews = allReviews.sort(() => Math.random() -  0.5).slice(0, 6);

    const colorClasses = ['#fff4cd', '#d6efff', '#ffe0ea'];
    const wrapper = document.querySelector(selector);
       if (!wrapper) return;
    wrapper.innerHTML = allReviews.map((review, i) => {
       const stars = ` <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.1875 16.0212L4.54167 10.4597L0 6.71908L6 6.22428L8.33333 0.979492L10.6667 6.22428L16.6667 6.71908L12.125 10.4597L13.4792 16.0212L8.33333 13.0722L3.1875 16.0212Z" fill="#FABB05"/>
</svg>${review.rating ? review.rating.toFixed(1) : ''}
`;
      const color = colorClasses[i % colorClasses.length];
     
      const title = review.title
        ? review.title
        : (review.text || '').split(' ').slice(0, 5).join(' ') + ((review.text || '').split(' ').length > 5 ? '...' : '');
   
      const author = review.name ? `— ${review.name}` : '';
  
      const comment = review.text || '';
      return `
        <article class="swiper-slide review-card" style="background-color: ${color}">
          <span class="stars">${stars}</span>
          <h4>${title}</h4>
          <p>${comment}</p>
          <span class="user">${author}<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6998 1.41078C15.0159 1.33812 15.3468 1.3657 15.6465 1.48968C15.9462 1.61366 16.1999 1.8279 16.3723 2.10264L17.9247 4.58117C18.0498 4.7808 18.2185 4.94952 18.4182 5.07469L20.8966 6.62709C21.1719 6.7994 21.3866 7.05326 21.5109 7.35334C21.6352 7.65342 21.6628 7.98478 21.59 8.3013L20.934 11.15C20.8811 11.3802 20.8811 11.6194 20.934 11.8496L21.59 14.6999C21.6621 15.0159 21.6341 15.3466 21.5099 15.6461C21.3856 15.9455 21.1713 16.1988 20.8966 16.371L18.4182 17.9249C18.2185 18.0501 18.0498 18.2188 17.9247 18.4184L16.3723 20.897C16.2001 21.172 15.9465 21.3865 15.6468 21.5108C15.347 21.6351 15.016 21.6629 14.6998 21.5904L11.8497 20.9344C11.6199 20.8818 11.3813 20.8818 11.1516 20.9344L8.30149 21.5904C7.98521 21.6629 7.6542 21.6351 7.35446 21.5108C7.05471 21.3865 6.80112 21.172 6.62891 20.897L5.07658 18.4184C4.95097 18.2186 4.78171 18.0499 4.58153 17.9249L2.10468 16.3725C1.82966 16.2003 1.61512 15.9467 1.49085 15.6469C1.36659 15.3472 1.33878 15.0162 1.41128 14.6999L2.06563 11.8496C2.11855 11.6194 2.11855 11.3802 2.06563 11.15L1.40972 8.3013C1.33701 7.98462 1.36489 7.65314 1.48945 7.35304C1.61402 7.05295 1.82908 6.79918 2.10468 6.62709L4.58153 5.07469C4.78171 4.9497 4.95097 4.78097 5.07658 4.58117L6.62891 2.10264C6.80124 1.8282 7.05467 1.61416 7.35408 1.49019C7.65349 1.36622 7.98404 1.33847 8.29993 1.41078L11.1516 2.06516C11.3813 2.11784 11.6199 2.11784 11.8497 2.06516L14.6998 1.41078Z" fill="#4E4E4E" stroke="#FABB05" stroke-width="2"/>
<path d="M7.61914 12.3372L10.7972 15.3811L15.3808 7.61914" fill="#4E4E4E"/>
<path d="M7.61914 12.3372L10.7972 15.3811L15.3808 7.61914" stroke="#FABB05" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg> ${review.product ? `<br> <em><svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.17161 9.28987L0.0137129 19.5565L1.49308 19.7193L2.65098 9.4512L1.17161 9.28987ZM2.23277 22H16.7675V20.5333H2.23277V22ZM18.9865 19.5565L17.8286 9.28987L16.3493 9.4512L17.5072 19.7193L18.9865 19.5565ZM15.6081 7.33333H3.39215V8.8H15.6111L15.6081 7.33333ZM17.8286 9.28987C17.7678 8.75182 17.5079 8.25475 17.0985 7.89377C16.689 7.5328 16.1575 7.33326 15.6081 7.33333L15.6096 8.8C15.7928 8.79999 15.9696 8.86657 16.106 8.987C16.2425 9.10742 16.3291 9.27323 16.3493 9.45267L17.8286 9.28987ZM16.7675 22C17.0814 21.9998 17.3918 21.9344 17.6783 21.8081C17.9648 21.6817 18.2211 21.4972 18.4303 21.2666C18.6396 21.036 18.7972 20.7645 18.8928 20.4699C18.9883 20.1752 19.0213 19.864 18.9865 19.5565L17.5072 19.7193C17.5189 19.8219 17.5085 19.9244 17.4767 20.0227C17.4449 20.1211 17.3923 20.2117 17.3225 20.2887C17.2527 20.3657 17.1672 20.4273 17.0715 20.4694C16.9759 20.5116 16.8723 20.5334 16.7675 20.5333V22ZM0.0137129 19.5565C-0.021041 19.8641 0.0104458 20.1754 0.106116 20.4702C0.201787 20.765 0.359489 21.0365 0.568918 21.2671C0.778348 21.4978 1.03479 21.6822 1.3215 21.8085C1.60821 21.9348 1.91872 22 2.23277 22V20.5333C2.12813 20.5333 2.02467 20.5116 1.92914 20.4695C1.83361 20.4275 1.74815 20.366 1.67835 20.2892C1.60855 20.2124 1.55597 20.1219 1.52405 20.0237C1.49212 19.9255 1.48157 19.8218 1.49308 19.7193L0.0137129 19.5565ZM2.65098 9.4512C2.67147 9.27203 2.75823 9.10657 2.89467 8.98645C3.03112 8.86632 3.20918 8.79995 3.39215 8.8V7.33333C2.84305 7.33362 2.31182 7.53332 1.90273 7.89426C1.49363 8.25521 1.23238 8.75207 1.17161 9.28987L2.65098 9.4512ZM5.77938 5.86667V5.13333H4.29108V5.86667H5.77938ZM13.2209 5.13333V5.86667H14.7092V5.13333H13.2209ZM9.50013 1.46667C10.4869 1.46667 11.4333 1.85298 12.1311 2.54061C12.8289 3.22824 13.2209 4.16087 13.2209 5.13333H14.7092C14.7092 3.77189 14.1604 2.46621 13.1835 1.50352C12.2066 0.540832 10.8816 0 9.50013 0V1.46667ZM5.77938 5.13333C5.77938 4.16087 6.17139 3.22824 6.86916 2.54061C7.56694 1.85298 8.51332 1.46667 9.50013 1.46667V0C8.1186 0 6.79366 0.540832 5.81678 1.50352C4.83989 2.46621 4.29108 3.77189 4.29108 5.13333H5.77938Z" fill="#4E4E4E"/>
</svg>
 ${review.product}</em>` : ''}
</span>
        </article>
      `;
    }).join('');
  
    if (window.reviewSwiperInstance && window.reviewSwiperInstance.destroy) {
      window.reviewSwiperInstance.destroy(true, true);
    }
   
    if (typeof Swiper !== 'undefined') {
      window.reviewSwiperInstance = new Swiper('.reviewSwiper', {
        slidesPerView: 1.3,
        spaceBetween: 24,
        autoHeight: true,
        
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
               },
        breakpoints: {
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4.3 }
        }
      });
    }
  });

}


window.renderRandomReviewsSwiper = renderRandomReviewsSwiper;

if (window.renderRandomReviewsSwiper) {
      window.renderRandomReviewsSwiper('#review-swiper-wrapper');
}


function formatReviewDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}


