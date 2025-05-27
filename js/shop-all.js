const priceRange = document.getElementById('price-range');
    const priceText = document.getElementById('price-range-text');
    if (priceRange && priceText) {
      priceRange.value = 100;
      
      priceRange.addEventListener('input', function() {
        let display = `₹${this.value.toLocaleString()} - ₹10000`;
        priceText.textContent = display;
      });
    }

    // GSAP animation for product cards
    document.addEventListener('DOMContentLoaded', function () {
      if (window.gsap) {
        const cards = document.querySelectorAll('.product-grid .product-card');
        if (cards.length) {
          gsap.fromTo(cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.12,
              ease: "power2.out"
            }
          );
        }
      }
    });


    

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 9;

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

function filterProducts(products, filters) {
  return products.filter(p => {
    // Category
    if (filters.categories.length) {
      const cat = (p.category || '').toLowerCase();
      let matched = false;
      filters.categories.forEach(fcat => {
        if (cat.includes(fcat) || (fcat === 'tshirts' && cat.includes('t-shirt'))) matched = true;
      });
      if (!matched) return false;
    }
    // Sizes
    if (filters.sizes.length) {
      if (!p.sizes.some(size => filters.sizes.includes(size))) return false;
    }
    // Price
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    // Discount
    if (filters.minDiscount) {
      const disc = parseInt((p.discount || '').replace('%', '')) || 0;
      if (disc < filters.minDiscount) return false;
    }
    return true;
  });
}

function renderProductsPage(products, page) {
  const grid = document.querySelector('.product-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (!products.length) {
    grid.innerHTML = '<div style="padding:24px; width:100%">No products found.</div>';
    return;
  }
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const pageProducts = products.slice(start, end);
  pageProducts.forEach(product => {
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
            <button class="cirle-icon-btn add-to-wishlist" type="button" tabindex="-1">
              <!-- Wishlist SVG -->
              <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.196 1.5C14.152 1.5 12.387 2.697 11.5 4.443C10.613 2.697 8.848 1.5 6.804 1.5C3.874 1.5 1.5 3.957 1.5 6.981C1.5 10.005 3.317 12.777 5.665 15.054C8.013 17.331 11.5 19.5 11.5 19.5C11.5 19.5 14.874 17.367 17.335 15.054C19.96 12.588 21.5 10.014 21.5 6.981C21.5 3.948 19.126 1.5 16.196 1.5Z"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button class="icon-text-btn view-product" type="button" onclick="window.location.href='product.html?id=${product.id}'">
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

  // Animate product cards with GSAP after rendering
  if (window.gsap) {
    requestAnimationFrame(() => {
      const cards = grid.querySelectorAll('.product-card');
      if (cards.length) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out"
          }
        );
      }
    });
  }
}

function renderPagination(products, page) {
  const total = products.length;
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  // Render both top and bottom paginations
  const paginations = [
    document.querySelector('.pagination-top'),
    document.querySelector('.pagination:not(.pagination-top)')
  ];
  paginations.forEach(pagination => {
    if (!pagination) return;
    pagination.innerHTML = '';

    // Prev button
    pagination.innerHTML += `<button${page === 1 ? ' disabled' : ''} data-page="${page - 1}">&lt; Prev</button>`;

    // Page buttons (show up to 3 pages for simplicity)
    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) startPage = Math.max(1, endPage - 2);
    for (let i = startPage; i <= endPage; i++) {
      pagination.innerHTML += `<button${i === page ? ' class="active"' : ''} data-page="${i}">${i}</button>`;
    }

    // Next button
    pagination.innerHTML += `<button${page === totalPages ? ' disabled' : ''} data-page="${page + 1}">Next &gt;</button>`;

    // Add event listeners
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

function renderResultsText(products, page) {
  const total = products.length;
  const start = total === 0 ? 0 : (page - 1) * PRODUCTS_PER_PAGE + 1;
  const end = Math.min(page * PRODUCTS_PER_PAGE, total);
  const resultsDiv = document.querySelector('.grid-header .results');
  if (resultsDiv) {
    resultsDiv.textContent = `Showing ${start}–${end} of ${total} results`;
  }
}

function renderAll() {
  renderProductsPage(filteredProducts, currentPage);
  renderPagination(filteredProducts, currentPage);
  renderResultsText(filteredProducts, currentPage);
}

function updateProducts() {
  const filters = getSelectedFilters();
  filteredProducts = filterProducts(allProducts, filters);
  currentPage = 1;
  renderAll();
}

function setupFilterListeners() {
  // All checkboxes
  document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', updateProducts);
  });
  // Price range: listen to both input and change for live update
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.addEventListener('input', updateProducts);
    priceRange.addEventListener('change', updateProducts);
  }
  // Section clear buttons (if you keep them)
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
          if (priceText) priceText.textContent = `₹100 - ₹10000`;
        }
      } else if (type === 'discount') {
        document.querySelectorAll('.filter-section:nth-child(4) input[type="checkbox"]').forEach(cb => cb.checked = false);
      }
      updateProducts();
    });
  });

  // Clear all filters button
  const clearAllBtn = document.querySelector('.clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function () {
      // Uncheck all checkboxes
      document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(cb => cb.checked = false);
      // Reset price range
      const priceRange = document.getElementById('price-range');
      if (priceRange) {
        priceRange.value = 100;
        const priceText = document.getElementById('price-range-text');
        if (priceText) priceText.textContent = `₹100 - ₹10000`;
      }
      updateProducts();
    });
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  allProducts = await fetchAllProducts();
  filteredProducts = allProducts;
  currentPage = 1;
  renderAll();
  setupFilterListeners();
});


