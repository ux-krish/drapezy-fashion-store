document.addEventListener('DOMContentLoaded', async function () {
  const priceRange = document.getElementById('price-range');
  const priceText = document.getElementById('price-range-text');
  if (priceRange && priceText) {
    priceRange.value = 100;
    priceRange.addEventListener('input', function() {
      let display = `₹${this.value.toLocaleString()} - ₹10000`;
      priceText.textContent = display;
    });
  }

  currentPage = 1;
  renderAll();
  setupFilterListeners();
});

let currentPage = 1;
const PRODUCTS_PER_PAGE = 9;

function renderPagination(total, page) {
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const paginations = [
    document.querySelector('.pagination-top'),
    document.querySelector('.product-grid-footer .pagination')
  ];
  paginations.forEach(pagination => {
    if (!pagination) return;
    pagination.innerHTML = '';
    pagination.innerHTML += `<button${page === 1 ? ' disabled' : ''} data-page="${page - 1}">&lt; Prev</button>`;
    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) startPage = Math.max(1, endPage - 2);
    for (let i = startPage; i <= endPage; i++) {
      pagination.innerHTML += `<button${i === page ? ' class="active"' : ''} data-page="${i}">${i}</button>`;
    }
    pagination.innerHTML += `<button${page === totalPages ? ' disabled' : ''} data-page="${page + 1}">Next &gt;</button>`;
    pagination.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', function () {
        const goto = parseInt(this.getAttribute('data-page'));
        if (!isNaN(goto) && goto >= 1 && goto <= totalPages && goto !== page) {
          currentPage = goto;
          renderAll();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  });
}

function renderResultsText(total, page) {
  const start = total === 0 ? 0 : (page - 1) * PRODUCTS_PER_PAGE + 1;
  const end = Math.min(page * PRODUCTS_PER_PAGE, total);
  const resultsDivs = [
    document.querySelector('.grid-header .results'),
    document.querySelector('.product-grid-footer .results')
  ];
  resultsDivs.forEach(resultsDiv => {
    if (resultsDiv) {
      resultsDiv.textContent = `Showing ${start}–${end} of ${total} results`;
    }
  });
}

function renderAll() {
  const filters = getSelectedFilters();
  const sortKey = getSelectedSortValue('sort-by');
  if (window.renderShopAllProducts) {
    window.renderShopAllProducts({
      selector: '#shop-all-product-grid',
      filters,
      sortFn: (a, b) => {
        const sorted = sortProducts([a, b], sortKey);
        if (sorted[0] === a) return -1;
        if (sorted[0] === b) return 1;
        return 0;
      },
      page: currentPage,
      perPage: PRODUCTS_PER_PAGE,
      onRendered: ({ total }) => {
        renderPagination(total, currentPage);
        renderResultsText(total, currentPage);
      }
    });
  }
  const sortSelect = document.querySelector('select[name="sort-by"]');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentPage = 1;
      renderAll();
    });
  }
}

function updateProducts() {
  currentPage = 1;
  renderAll();
}

function setupFilterListeners() {
  document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', updateProducts);
  });
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.addEventListener('input', updateProducts);
    priceRange.addEventListener('change', updateProducts);
  }
  document.querySelectorAll('.clear-filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const type = btn.getAttribute('data-clear');
      if (type === 'category') {
        document.querySelectorAll('.filter-section:nth-child(1) input[type="checkbox"]').forEach(cb => cb.checked = false);
      } else if (type === 'sizes') {
        document.querySelectorAll('.filter-section:nth-child(2) input[type="checkbox"]').forEach(cb => cb.checked = false);
      } else if (type === 'price') {
        const priceRange = document.getElementById('price-range');
        if (priceRange) {
          priceRange.value = 100;
          const priceText = document.getElementById('price-range-text');
          if (priceText) priceText.textContent = `₹100 - ₹5000`;
        }
      } else if (type === 'discount') {
        document.querySelectorAll('.filter-section:nth-child(4) input[type="checkbox"]').forEach(cb => cb.checked = false);
      }
      updateProducts();
    });
  });
  const clearAllBtn = document.querySelector('.clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function () {
      document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(cb => cb.checked = false);
      const priceRange = document.getElementById('price-range');
      if (priceRange) {
        priceRange.value = 100;
        const priceText = document.getElementById('price-range-text');
        if (priceText) priceText.textContent = `₹100 - ₹5000`;
      }
      updateProducts();
    });
  }
}

if (document.querySelector('.wishlist-section')) {
  const WISHLIST_PRODUCTS_PER_PAGE = 6;
  let wishlistCurrentPage = 1;

  function getWishlistIds() {
    return JSON.parse(localStorage.getItem('wishlistProducts') || '[]');
  }

  function fetchAllProducts() {
    return fetch('./products.json')
      .then(res => res.json())
      .then(data => data.products || []);
  }

  function getWishlistSelectedFilters() {
    const genderChecks = document.querySelectorAll('.wishlist-filters .filter-section:nth-child(2) input[type="checkbox"]:checked');
    const genders = Array.from(genderChecks).map(cb => cb.value);
    const catChecks = document.querySelectorAll('.wishlist-filters .filter-section:nth-child(3) input[type="checkbox"]:checked');
    const categories = Array.from(catChecks).map(cb => cb.value.toLowerCase());
    const priceRange = document.getElementById('wishlist-price-range');
    const minPrice = priceRange ? parseInt(priceRange.value) : 100;
    const maxPrice = 10000;
    const discountChecks = document.querySelectorAll('.wishlist-filters .filter-section:nth-child(5) input[type="checkbox"]:checked');
    let minDiscount = 0;
    discountChecks.forEach(cb => {
      const val = parseInt(cb.value, 10);
      if (!isNaN(val)) minDiscount = Math.max(minDiscount, val);
    });
    return { genders, categories, minPrice, maxPrice, minDiscount };
  }

  function filterWishlistProducts(products, filters) {
    return products.filter(p => {
      if (filters.genders && filters.genders.length && !filters.genders.includes(p.gender)) return false;
      if (filters.categories && filters.categories.length) {
        const cat = (p.category || '').toLowerCase();
        let matched = false;
        filters.categories.forEach(fcat => {
          if (cat.includes(fcat) || (fcat === 'tshirts' && cat.includes('t-shirt'))) matched = true;
        });
        if (!matched) return false;
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

  function renderWishlistProducts() {
    fetchAllProducts().then(products => {
      const wishlistIds = getWishlistIds();
      let wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
      const filters = getWishlistSelectedFilters();
      wishlistProducts = filterWishlistProducts(wishlistProducts, filters);

      const total = wishlistProducts.length;
      const totalPages = Math.ceil(total / WISHLIST_PRODUCTS_PER_PAGE);
      if (wishlistCurrentPage > totalPages) wishlistCurrentPage = 1;
      const start = (wishlistCurrentPage - 1) * WISHLIST_PRODUCTS_PER_PAGE;
      const end = start + WISHLIST_PRODUCTS_PER_PAGE;
      const pageProducts = wishlistProducts.slice(start, end);

      const startNum = total === 0 ? 0 : start + 1;
      const endNum = Math.min(end, total);
      const resultsText = document.getElementById('wishlist-results-text');
      const resultsTextBottom = document.getElementById('wishlist-results-text-bottom');
      if (resultsText) resultsText.textContent = `Showing ${startNum}–${endNum} of ${total} results`;
      if (resultsTextBottom) resultsTextBottom.textContent = `Showing ${startNum}–${endNum} of ${total} results`;

      const grid = document.getElementById('wishlist-product-grid');
      grid.innerHTML = '';
      if (!pageProducts.length) {
        grid.innerHTML = '<p class="empty-wishlist">Your wishlist is empty.</p>';
        renderWishlistPagination(total, wishlistCurrentPage);
        return;
      }
      pageProducts.forEach(product => {
        const isWishlisted = (typeof isInWishlist === 'function' ? isInWishlist(product.id) : wishlistIds.includes(product.id));
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

      grid.querySelectorAll('.add-to-wishlist').forEach(btn => {
        const card = btn.closest('.product-card');
        if (!card) return;
        const productId = card.getAttribute('data-product-id');
        btn.onclick = function(e) {
          e.stopPropagation();
          if (typeof isInWishlist === 'function' && typeof removeFromWishlist === 'function') {
            removeFromWishlist(productId);
          } else {
            let ids = getWishlistIds().filter(id => id !== productId);
            localStorage.setItem('wishlistProducts', JSON.stringify(ids));
          }
          renderWishlistProducts();
          if (window.updateWishlistCount) window.updateWishlistCount();
        };
      });

      grid.querySelectorAll('.add-to-cart').forEach(btn => {
        const card = btn.closest('.product-card');
        if (!card) return;
        const productId = card.getAttribute('data-product-id');
        const prod = pageProducts.find(p => p.id === productId);
        btn.onclick = function(e) {
          e.stopPropagation();
          if (!prod) return;
          const size = Array.isArray(prod.sizes) && prod.sizes.length ? prod.sizes[0] : prod.size || '';
          if (window.addToCart) {
            window.addToCart({
              id: prod.id,
              title: prod.title,
              image: prod.image,
              price: prod.price,
              original_price: prod.original_price,
              size: size,
              qty: 1
            });
            if (window.updateCartCount) window.updateCartCount();
          }
        };
      });

      grid.querySelectorAll('[data-view-btn]').forEach(btn => {
        const card = btn.closest('.product-card');
        if (!card) return;
        const productId = card.getAttribute('data-product-id');
        const prod = pageProducts.find(p => p.id === productId);
        btn.onclick = function(e) {
          e.stopPropagation();
          if (!prod) return;
          localStorage.setItem('selectedProduct', JSON.stringify(prod));
          window.location.href = `product.html?id=${prod.id}`;
        };
      });

      renderWishlistPagination(total, wishlistCurrentPage);
    });
  }

  function renderWishlistPagination(total, page) {
    const totalPages = Math.ceil(total / WISHLIST_PRODUCTS_PER_PAGE);
    const paginations = [
      document.getElementById('wishlist-pagination-top'),
      document.getElementById('wishlist-pagination-bottom')
    ];
    paginations.forEach(pagination => {
      if (!pagination) return;
      pagination.innerHTML = '';
      pagination.innerHTML += `<button${page === 1 ? ' disabled' : ''} data-page="${page - 1}">&lt; Prev</button>`;
      let startPage = Math.max(1, page - 1);
      let endPage = Math.min(totalPages, startPage + 2);
      if (endPage - startPage < 2) startPage = Math.max(1, endPage - 2);
      for (let i = startPage; i <= endPage; i++) {
        pagination.innerHTML += `<button${i === page ? ' class="active"' : ''} data-page="${i}">${i}</button>`;
      }
      pagination.innerHTML += `<button${page === totalPages ? ' disabled' : ''} data-page="${page + 1}">Next &gt;</button>`;
      pagination.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', function () {
          const goto = parseInt(this.getAttribute('data-page'));
          if (!isNaN(goto) && goto >= 1 && goto <= totalPages && goto !== page) {
            wishlistCurrentPage = goto;
            renderWishlistProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      });
    });
  }

  function setupWishlistFilterListeners() {
    document.querySelectorAll('.wishlist-filters input[type="checkbox"]').forEach(el => {
      el.addEventListener('change', function() {
        wishlistCurrentPage = 1;
        renderWishlistProducts();
      });
    });
    const priceRange = document.getElementById('wishlist-price-range');
    const priceText = document.getElementById('wishlist-price-range-text');
    if (priceRange && priceText) {
      priceRange.value = 100;
      priceRange.addEventListener('input', function() {
        priceText.textContent = `₹${this.value} - ₹10000`;
      });
      priceRange.addEventListener('input', function() {
        wishlistCurrentPage = 1;
        renderWishlistProducts();
      });
      priceRange.addEventListener('change', function() {
        wishlistCurrentPage = 1;
        renderWishlistProducts();
      });
    }
    const clearAllBtn = document.getElementById('wishlist-clear-all-btn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', function () {
        document.querySelectorAll('.wishlist-filters input[type="checkbox"]').forEach(cb => cb.checked = false);
        if (priceRange) {
          priceRange.value = 100;
          if (priceText) priceText.textContent = `₹100 - ₹10000`;
        }
        wishlistCurrentPage = 1;
        renderWishlistProducts();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    setupWishlistFilterListeners();
    renderWishlistProducts();
  });
}


document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('shop-all-product-grid')) return;

  function getFilters() {
    if (typeof getSelectedFilters === 'function') {
      return getSelectedFilters();
    }
    return {};
  }

  function getSortFn(sortKey) {
    if (typeof sortProducts === 'function') {
      return function (a, b) {
        return sortProducts([a, b], sortKey)[0] === a ? -1 : 1;
      };
    }
    return null;
  }

  function renderProductCard(product) {
    const isWishlisted = (typeof isInWishlist === 'function') ? isInWishlist(product.id) : false;
    return `
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
  }

  let currentPage = 1;
  let perPage = 9;
  let totalProducts = 0;

  function renderPagination(total) {
    const paginators = document.querySelectorAll('.pagination');
    paginators.forEach(pagination => {
      pagination.innerHTML = '';
      const totalPages = Math.ceil(total / perPage);
      if (totalPages <= 1) return;
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = (i === currentPage) ? 'active' : '';
        btn.onclick = function () {
          currentPage = i;
          renderProducts();
        };
        pagination.appendChild(btn);
      }
    });
  }

  function renderProducts() {
    fetch('./products.json')
      .then(res => res.json())
      .then(data => {
        const products = data.products || [];
        const filters = getFilters();
        const sortKey = document.querySelector('select[name="sort-by"]')?.value || 'newest';
        let filtered = products.filter(p => {
          if (filters.categories && filters.categories.length) {
            const cat = (p.category || '').toLowerCase();
            let matched = false;
            filters.categories.forEach(fcat => {
              if (fcat === 'jeans & trousers') {
                if (cat.includes('jeans') || cat.includes('trousers')) matched = true;
              } else if (fcat === 'tshirts') {
                if (cat.includes('t-shirt') || cat.includes('tshirts') || cat.includes('tshirt')) matched = true;
              } else if (fcat === 'tops & t-shirt' || fcat === 'tops & t-shirt') {
                if (cat.includes('top') || cat.includes('t-shirt') || cat.includes('tshirt')) matched = true;
              } else {
                if (cat.includes(fcat)) matched = true;
              }
            });
            if (!matched) return false;
          }
          // Sizes
          if (filters.sizes && filters.sizes.length) {
            if (!p.sizes || !p.sizes.some(size => filters.sizes.includes(size))) return false;
          }
          // Price
          if (filters.minPrice && p.price < filters.minPrice) return false;
          if (filters.maxPrice && p.price > filters.maxPrice) return false;
          // Discount
          if (filters.minDiscount) {
            const disc = parseInt((p.discount || '').replace('%', ''), 10) || 0;
            if (disc < filters.minDiscount) return false;
          }
          return true;
        }); 

        if (typeof sortProducts === 'function') {
          filtered = sortProducts(filtered, sortKey);
        }

        totalProducts = filtered.length;
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        const pageProducts = filtered.slice(start, end);

        const grid = document.getElementById('shop-all-product-grid');
        grid.innerHTML = '';
        if (!pageProducts.length) {
          grid.innerHTML = '<div style="padding:24px; width:100%">No products found.</div>';
        } else {
          pageProducts.forEach(product => {
            grid.innerHTML += renderProductCard(product);
          });
        }
        const results = document.querySelector('.product-grid-footer .results');
        if (results) {
          results.textContent = `Showing ${start + 1}–${Math.min(end, totalProducts)} of ${totalProducts} results`;
        }

        renderPagination(totalProducts);

        if (typeof setupWishlistButtons === 'function') setupWishlistButtons(grid);

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
              if (typeof addToCart === 'function') {
                addToCart({
                  id: prod.id,
                  title: prod.title,
                  image: prod.image,
                  price: prod.price,
                  original_price: prod.original_price,
                  size: size,
                  qty: 1
                });
                if (typeof updateCartCount === 'function') updateCartCount();
              }
            });
          }
        });
      });
  }

  document.querySelectorAll('.filter-section input, .filter-section select').forEach(el => {
    el.addEventListener('change', function () {
      currentPage = 1;
      renderProducts();
    });
  });
  const sortSelect = document.querySelector('select[name="sort-by"]');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      currentPage = 1;
      renderProducts();
    });
  }
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.addEventListener('input', function () {
      const priceText = document.getElementById('price-range-text');
      if (priceText) priceText.textContent = `₹${this.value} - ₹5000`;
      currentPage = 1;
      renderProducts();
    });
  }

  renderProducts();
});

document.addEventListener('DOMContentLoaded', function() {
  function closeSidebar(sidebar, closeBtn) {
    sidebar.classList.remove('open');
    if (closeBtn) closeBtn.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.product-listing').forEach(function(listing) {
    const sidebar = listing.querySelector('.sidebar');
    const openBtn = listing.querySelector('.sidebar-toggle-btn');
    const closeBtn = sidebar ? sidebar.querySelector('.sidebar-close-btn') : null;
    if (!sidebar || !openBtn || !closeBtn) return;

    closeBtn.style.display = 'none';

    openBtn.onclick = null;
    closeBtn.onclick = null;

    openBtn.addEventListener('click', function(e) {
      e.preventDefault();
      sidebar.classList.add('open');
      closeBtn.style.display = 'flex';
      if (window.innerWidth <= 767) document.body.style.overflow = 'hidden';
    });
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeSidebar(sidebar, closeBtn);
    });

    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 767 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !openBtn.contains(e.target)) {
          closeSidebar(sidebar, closeBtn);
        }
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 767) {
        closeSidebar(sidebar, closeBtn);
      }
    });
  });
});

function getSelectedFiltersFromContainer(container) {
  const filterSections = Array.from(container.querySelectorAll(':scope > .filter-section'));
  const catChecks = filterSections[0]
    ? filterSections[0].querySelectorAll('input[type="checkbox"]:checked')
    : [];
  const categories = Array.from(catChecks).map(cb => {
    let txt = cb.parentElement.textContent.trim().toLowerCase();
    if (txt === 'tshirts' || txt === 't-shirt' || txt === 't-shirts') return 'tshirts';
    if (txt === 'tops & t-shirt' || txt === 'tops & t-shirts' || txt === 'tops & blouses') return 'tops & t-shirt';
    if (txt === 'jeans & trousers') return 'jeans & trousers';
    return txt;
  });
  const sizeChecks = filterSections[1]
    ? filterSections[1].querySelectorAll('input[type="checkbox"]:checked')
    : [];
  const sizes = Array.from(sizeChecks).map(cb => cb.parentElement.textContent.trim());
  const priceRange = filterSections[2]
    ? filterSections[2].querySelector('input[type="range"]')
    : null;
  const minPrice = priceRange ? parseInt(priceRange.value) : 100;
  const maxPrice = 10000;
  const discountChecks = filterSections[3]
    ? filterSections[3].querySelectorAll('input[type="checkbox"]:checked')
    : [];
  let minDiscount = 0;
  discountChecks.forEach(cb => {
    const txt = cb.parentElement.textContent;
    if (txt.includes('80%')) minDiscount = Math.max(minDiscount, 80);
    else if (txt.includes('70%')) minDiscount = Math.max(minDiscount, 70);
    else if (txt.includes('50%')) minDiscount = Math.max(minDiscount, 50);
    else if (txt.includes('30%')) minDiscount = Math.max(minDiscount, 30);
    else if (txt.includes('10%')) minDiscount = Math.max(minDiscount, 10);
  });
  return { categories, sizes, minPrice, maxPrice, minDiscount };
}

function setupGenderFilterSection({ sidebarSelector, gridSelector, gender, sortSelector = 'select[name="sort-by"]' }) {
  const sidebar = document.querySelector(sidebarSelector);
  const grid = document.querySelector(gridSelector);
  const sortSelect = document.querySelector(sortSelector);

  function render() {
    if (!sidebar || !grid) return;
    const filters = getSelectedFiltersFromContainer(sidebar);
    filters.gender = [gender];
    const sortKey = sortSelect ? sortSelect.value : 'newest';
    showProductsPaginated({
      selector: gridSelector,
      filters,
      sortFn: products => sortProducts(products, sortKey),
      page: 1,
      perPage: 9
    });
  }

  if (sidebar) {
    sidebar.querySelectorAll('input[type="checkbox"], input[type="range"]').forEach(input => {
      input.addEventListener('change', render);
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', render);
  }
  render();
}

function setupAllFilterSection({ sidebarSelector = '.sidebar', gridSelector = '#shop-all-product-grid', sortSelector = 'select[name="sort-by"]' } = {}) {
  const sidebar = document.querySelector(sidebarSelector);
  const grid = document.querySelector(gridSelector);
  const sortSelect = document.querySelector(sortSelector);

  function render() {
    if (!sidebar || !grid) return;
    const filters = getSelectedFiltersFromContainer(sidebar);
    const sortKey = sortSelect ? sortSelect.value : 'newest';
    showProductsPaginated({
      selector: gridSelector,
      filters,
      sortFn: products => sortProducts(products, sortKey),
      page: 1,
      perPage: 9
    });
  }

  if (sidebar) {
    sidebar.querySelectorAll('input[type="checkbox"], input[type="range"]').forEach(input => {
      input.addEventListener('change', render);
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', render);
  }
  render();
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.sidebar-men') && document.querySelector('#shop-all-product-grid-men')) {
    setupGenderFilterSection({
      sidebarSelector: '.sidebar-men',
      gridSelector: '#shop-all-product-grid-men',
      gender: 'Men'
    });
  }
  if (document.querySelector('.sidebar-women') && document.querySelector('#shop-all-product-grid-women')) {
    setupGenderFilterSection({
      sidebarSelector: '.sidebar-women',
      gridSelector: '#shop-all-product-grid-women',
      gender: 'Women'
    });
  }
  if (
    !(
      document.querySelector('.sidebar-men') && document.querySelector('#shop-all-product-grid-men') &&
      document.querySelector('.sidebar-women') && document.querySelector('#shop-all-product-grid-women')
    ) &&
    document.querySelector('.sidebar') && document.querySelector('#shop-all-product-grid')
  ) {
    setupAllFilterSection();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.sidebar .filter-checkbox').forEach(cb => {
    cb.addEventListener('change', function() {
      if (typeof updateProducts === 'function') updateProducts();
      else if (typeof renderAll === 'function') renderAll();
    });
  });

  const clearAllBtn = document.getElementById('clear-all-filters-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const checkboxes = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]'));
      const selects = Array.from(document.querySelectorAll('.sidebar select'));
      checkboxes.forEach(cb => cb.checked = false);
      selects.forEach(sel => sel.selectedIndex = 0);
      const priceRange = document.getElementById('price-range');
      const priceText = document.getElementById('price-range-text');
      if (priceRange) {
        priceRange.value = 100;
        if (priceText) priceText.textContent = `₹100 - ₹5000`;
      }
      document.querySelectorAll('.sidebar .active').forEach(el => el.classList.remove('active'));
      [...checkboxes, ...selects].forEach(el => {
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      if (priceRange) priceRange.dispatchEvent(new Event('change', { bubbles: true }));
      currentPage = 1;
      renderAll();
    });
  }
});

function getSelectedFilters() {
  const catChecks = document.querySelectorAll('.filter-section:nth-child(1) input[type="checkbox"]:checked');
  const categories = Array.from(catChecks).map(cb => cb.parentElement.textContent.trim().toLowerCase());
  const sizeChecks = document.querySelectorAll('.filter-section:nth-child(2) input[type="checkbox"]:checked');
  const sizes = Array.from(sizeChecks).map(cb => cb.parentElement.textContent.trim());
  const priceRange = document.getElementById('price-range');
  const minPrice = priceRange ? parseInt(priceRange.value) : 100;
  const maxPrice = 10000;
  const discountChecks = document.querySelectorAll('.discount-filter-list input[type="checkbox"]:checked');
  let minDiscount = 0;
  discountChecks.forEach(cb => {
    const val = parseInt(cb.getAttribute('data-discount'), 10);
    if (!isNaN(val)) minDiscount = Math.max(minDiscount, val);
  });
  return { categories, sizes, minPrice, maxPrice, minDiscount };
}