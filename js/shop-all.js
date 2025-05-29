document.addEventListener('DOMContentLoaded', async function () {
  // Price range display setup
  const priceRange = document.getElementById('price-range');
  const priceText = document.getElementById('price-range-text');
  if (priceRange && priceText) {
    priceRange.value = 100;
    priceRange.addEventListener('input', function() {
      let display = `₹${this.value.toLocaleString()} - ₹10000`;
      priceText.textContent = display;
    });
  }

  allProducts = await fetchAllProducts();
  filteredProducts = allProducts;
  currentPage = 1;
  renderAll();
  setupFilterListeners();
  // GSAP animation for page-header moved to common.js
});

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 9;

function renderPagination(total, page) {
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const paginations = [
    document.querySelector('.pagination-top'),
    document.querySelector('.pagination:not(.pagination-top)')
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
  const resultsDiv = document.querySelector('.grid-header .results');
  if (resultsDiv) {
    resultsDiv.textContent = `Showing ${start}–${end} of ${total} results`;
  }
}

function renderAll() {
  const filters = getSelectedFilters();
  const sortKey = getSelectedSortValue('sort-by');
  showProductsPaginated({
    selector: '.product-grid',
    filters,
    sortFn: (a, b) => {
      // Use sortProducts logic from api.js
      const sorted = sortProducts([a, b], sortKey);
      // If a comes before b, return -1; if after, return 1; else 0
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
  // Listen for sort select changes
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


