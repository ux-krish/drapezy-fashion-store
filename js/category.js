function getMenFilters() {
  const sidebar = document.querySelector('.sidebar-men');
  if (!sidebar) return {};
  const catChecks = sidebar.querySelectorAll('.filter-section:first-of-type input[type="checkbox"]:checked');
  const categories = Array.from(catChecks).map(cb => cb.parentElement.textContent.trim().toLowerCase());
  const sizeChecks = sidebar.querySelectorAll('.filter-section:nth-of-type(2) input[type="checkbox"]:checked');
  const sizes = Array.from(sizeChecks).map(cb => cb.parentElement.textContent.trim());
  const priceRange = sidebar.querySelector('.filter-section:nth-of-type(3) input[type="range"]');
  const minPrice = priceRange ? parseInt(priceRange.value) : 100;
  const maxPrice = 5000;
  const discountChecks = sidebar.querySelectorAll('.filter-section:nth-of-type(4) input[type="checkbox"]:checked');
  let minDiscount = 0;
  discountChecks.forEach(cb => {
    const txt = cb.parentElement.textContent;
    if (txt.includes('50%')) minDiscount = Math.max(minDiscount, 50);
    else if (txt.includes('30%')) minDiscount = Math.max(minDiscount, 30);
    else if (txt.includes('10%')) minDiscount = Math.max(minDiscount, 10);
  });
  return { categories, sizes, minPrice, maxPrice, minDiscount, gender: ['Men'] };
}

function getWomenFilters() {
  const sidebar = document.querySelector('.sidebar-women');
  if (!sidebar) return {};
  const catChecks = sidebar.querySelectorAll('.filter-section:first-of-type input[type="checkbox"]:checked');
  let categories = Array.from(catChecks).map(cb => cb.parentElement.textContent.trim().toLowerCase());
  categories = categories.map(cat => cat.replace(/[\s\-&]+/g, '').toLowerCase());
  const sizeChecks = sidebar.querySelectorAll('.filter-section:nth-of-type(2) input[type="checkbox"]:checked');
  const sizes = Array.from(sizeChecks).map(cb => cb.parentElement.textContent.trim());
  const priceRange = sidebar.querySelector('.filter-section:nth-of-type(3) input[type="range"]');
  const minPrice = priceRange ? parseInt(priceRange.value) : 100;
  const maxPrice = 5000;
  const discountChecks = sidebar.querySelectorAll('.filter-section:nth-of-type(4) input[type="checkbox"]:checked');
  let minDiscount = 0;
  discountChecks.forEach(cb => {
    const txt = cb.parentElement.textContent;
    if (txt.includes('50%')) minDiscount = Math.max(minDiscount, 50);
    else if (txt.includes('30%')) minDiscount = Math.max(minDiscount, 30);
    else if (txt.includes('10%')) minDiscount = Math.max(minDiscount, 10);
  });
  return { categories, sizes, minPrice, maxPrice, minDiscount, gender: ['Women'] };
}

function filterProducts(products, filters) {
  return products.filter(p => {
    // Gender
    if (filters.gender && Array.isArray(filters.gender) && filters.gender.length) {
      if (!filters.gender.includes(p.gender)) return false;
    }
    // Category
    if (filters.categories && filters.categories.length) {
      let cat = (p.category || '').toLowerCase();
      if (filters.gender && filters.gender[0] === 'Women') {
        cat = cat.replace(/[\s\-&]+/g, '');
        if (!filters.categories.includes(cat)) return false;
      } else {
        if (!filters.categories.includes(cat)) return false;
      }
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
      const disc = parseInt((p.discount || '').replace('%', '')) || 0;
      if (disc < filters.minDiscount) return false;
    }
    return true;
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

function renderProductCard(product) {
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
            <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.196 1.5C14.152 1.5 12.387 2.697 11.5 4.443C10.613 2.697 8.848 1.5 6.804 1.5C3.874 1.5 1.5 3.957 1.5 6.981C1.5 10.005 3.317 12.777 5.665 15.054C8.013 17.331 11.5 19.5 11.5 19.5C11.5 19.5 14.874 17.367 17.335 15.054C19.96 12.588 21.5 10.014 21.5 6.981C21.5 3.948 19.126 1.5 16.196 1.5Z"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="transparent" />
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

function renderCategoryMenProducts(page = 1) {
  if (typeof showProductsPaginated !== 'function') return;
  const sortSelect = document.querySelector('.for-men select[name="sort-by"]');
  const sortKey = sortSelect ? sortSelect.value : 'newest';
  showProductsPaginated({
    selector: '#shop-all-product-grid-men',
    filters: { gender: ['Men'] },
    sortFn: products => sortProducts(products, sortKey),
    page,
    perPage: 9,
    onRendered: ({ total }) => {
      const grid = document.getElementById('shop-all-product-grid-men');
      const results = grid?.closest('.grid-section')?.querySelector('.product-grid-footer .results');
      if (results) {
        const start = total === 0 ? 0 : (page - 1) * 9 + 1;
        const end = Math.min(page * 9, total);
        results.textContent = `Showing ${start}–${end} of ${total} results`;
      }
    }
  });
}

function renderCategoryWomenProducts(page = 1) {
  if (typeof showProductsPaginated !== 'function') return;
  const sortSelect = document.querySelector('.for-women select[name="sort-by"]');
  const sortKey = sortSelect ? sortSelect.value : 'newest';
  showProductsPaginated({
    selector: '#shop-all-product-grid-women',
    filters: { gender: ['Women'] },
    sortFn: products => sortProducts(products, sortKey),
    page,
    perPage: 9,
    onRendered: ({ total }) => {
      const grid = document.getElementById('shop-all-product-grid-women');
      const results = grid?.closest('.grid-section')?.querySelector('.product-grid-footer .results');
      if (results) {
        const start = total === 0 ? 0 : (page - 1) * 9 + 1;
        const end = Math.min(page * 9, total);
        results.textContent = `Showing ${start}–${end} of ${total} results`;
      }
    }
  });
}

function getCategoryPageFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  const gender = params.get('gender');
  const category = params.get('category');
  let filters = {};
  if (gender) filters.gender = [gender];
  if (category) filters.categories = [category.toLowerCase()];
  return filters;
}

function renderCategoryProducts(page = 1) {
  if (typeof showProductsPaginated !== 'function') return;
  const urlFilters = getCategoryPageFiltersFromURL();
  const sortSelect = document.querySelector('select[name="sort-by"]');
  const sortKey = sortSelect ? sortSelect.value : 'newest';
  showProductsPaginated({
    selector: '#shop-all-product-grid-category',
    filters: urlFilters,
    sortFn: products => sortProducts(products, sortKey),
    page,
    perPage: 9,
    onRendered: ({ total }) => {
      const grid = document.getElementById('shop-all-product-grid-category');
      const results = grid?.closest('.grid-section')?.querySelector('.product-grid-footer .results');
      if (results) {
        const start = total === 0 ? 0 : (page - 1) * 9 + 1;
        const end = Math.min(page * 9, total);
        results.textContent = `Showing ${start}–${end} of ${total} results`;
      }
    }
  });
}

function setupCategoryMenFilter() {
  const sortSelect = document.querySelector('.for-men select[name="sort-by"]');
  if (sortSelect) sortSelect.addEventListener('change', () => renderCategoryMenProducts(1));
  renderCategoryMenProducts(1);
}

function setupCategoryWomenFilter() {
  const sortSelect = document.querySelector('.for-women select[name="sort-by"]');
  if (sortSelect) sortSelect.addEventListener('change', () => renderCategoryWomenProducts(1));
  renderCategoryWomenProducts(1);
}

function setupCategoryPageFilter() {
  const sortSelect = document.querySelector('select[name="sort-by"]');
  if (sortSelect) sortSelect.addEventListener('change', () => renderCategoryProducts(1));
  renderCategoryProducts(1);
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('shop-all-product-grid-men')) {
    setupCategoryMenFilter();
  }
  if (document.getElementById('shop-all-product-grid-women')) {
    setupCategoryWomenFilter();
  }
  if (document.getElementById('shop-all-product-grid-category')) {
    setupCategoryPageFilter();
  }
  document.querySelectorAll('.cta-button.cta-go-section').forEach(btn => {
    const href = btn.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const targetSection = document.querySelector(href);
    if (!targetSection) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      let offset = 0;
      const header = document.querySelector('header.top-bar');
      const nav = document.querySelector('nav.main-header');
      if (header) offset += header.offsetHeight;
      if (nav) offset += nav.offsetHeight;
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(targetSection, { offset: -offset, duration: 1 });
      } else {
        const rect = targetSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: rect.top + scrollTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.deals-banner').forEach(banner => {
      gsap.from(banner, {
        opacity: 0,
        scale: 0.5,
        y: -60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: banner,
          end: 'bottom 80%',
          toggleActions: 'play none none reverse'
        }
      });
      const badges = banner.querySelectorAll('.badge');
      if (badges.length) {
        gsap.from(badges, {
          opacity: 0,
          y: 20,
          scale: 0.5,
          stagger: 0.1,
          duration: 0.5,
          delay: 0.1,
          scrollTrigger: {
            trigger: banner,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }
      const title = banner.querySelector('.deals-title');
      if (title) {
        gsap.from(title, {
          y: -40,
          scale: 0.5,
          duration: 0.7,
          delay: 0.2,
          scrollTrigger: {
            trigger: banner,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }
      const subtitle = banner.querySelector('.deals-subtitle');
      if (subtitle) {
        gsap.from(subtitle, {
          opacity: 0,
          y: 40,
          scale: 0.5,
          duration: 0.7,
          delay: 0.3,
          scrollTrigger: {
            trigger: banner,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }
      const ctas = banner.querySelectorAll('.cta-button');
      if (ctas.length) {
        gsap.from(ctas, {
          opacity: 0,
          scale: 0.8,
          scale: 0.5,
          duration: 0.5,
          delay: 0.4,
          scrollTrigger: {
            trigger: banner,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    });

    const productListing = document.querySelector('.product-listing');

      // gsap.from(productListing, {
      //   opacity: 0,
      //   y: 60,
      //   duration: 0.8,
      //   ease: 'power2.out',
      //   scrollTrigger: {
      //     trigger: productListing,
      //     start: 'top 80%',
      //     toggleActions: 'play none none reverse'
      //   }
      // });
      if (productListing) {
      const gridHeader = productListing.querySelector('.grid-header');
      if (gridHeader) {
        gsap.from(gridHeader, {
          opacity: 0,
          y: -30,
          duration: 0.6,
          delay: 0.1,
          scrollTrigger: {
            trigger: gridHeader,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    }
     
    const offerSection = document.querySelector('.offer-day-section');
    if (offerSection) {
      const offerBanner = offerSection.querySelector('.offer-banner');
      if (offerBanner) {
        gsap.from(offerBanner, {
          opacity: 0,
          scale: 0.5,
          y: -60,
          scale: 0.6,
          duration: 0.8,
          scrollTrigger: {
            trigger: offerSection,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
        gsap.from(offerBanner.querySelectorAll('.tag, .headline, .subtext, .limited-btn, .small-note, .arrow-link'), {
          opacity: 0,
          x: 60,
          scale: 0.5,
          stagger: 0.12,
          duration: 0.5,
          delay: 0.2,
          scrollTrigger: {
            trigger: offerBanner,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      }
      const productHighlight = offerSection.querySelector('.product-highlight');
      if (productHighlight) {
        gsap.fromTo(
          productHighlight,
          { opacity: 0, x: 200 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: productHighlight,
              end: 'top top',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }



 

    const infoBoxes = document.querySelectorAll('.footer-top .info-box');
    if (infoBoxes.length) {
      gsap.from(infoBoxes, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.5,
        scrollTrigger: {
          trigger: '.footer-top',
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }
});

(function() {
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || '';
  }
  const gender = getQueryParam('gender');
  const category = getQueryParam('category');
  function normalizeCategory(cat) {
    if (!cat) return '';
    cat = cat.toLowerCase();
    if (cat === 'tshirts' || cat === 't-shirt') return 'Tshirts';
    if (cat === 'shirts') return 'Shirts';
    if (cat === 'jeans') return 'Jeans';
    if (cat === 'jackets' || cat === 'jackets & coats') return 'Jackets & Coats';
    if (cat === 'dresses') return 'Dresses';
    if (cat === 'tops' || cat === 'tops & blouses' || cat === 'tops & t-shirt') return 'Tops & T-shirt';
    if (cat === 'skirts') return 'Skirts';
    if (cat === 'skirts and shorts' || cat === 'shorts') return 'Skirts and Shorts';
    if (cat === 'ethnic') return 'Ethnic Wear';
    if (cat === 'newarrivals' || cat === 'new arrivals') return 'New Arrivals';
    if (cat === 'summer' || cat === 'summer collection') return 'Summer Collection';
    if (cat === 'winter') return ''; 
    return '';
  }
  window.addEventListener('DOMContentLoaded', function() {
    if (gender) {
      const genderSel = document.getElementById('filter-gender');
      if (genderSel) {
        genderSel.value = gender === 'Men' || gender === 'Women' ? gender : '';
        genderSel.dispatchEvent(new Event('change'));
      }
    }
    if (category) {
      const catVal = normalizeCategory(category);
      const catSel = document.getElementById('filter-category');
      if (catSel && catVal) {
        catSel.value = catVal;
        catSel.dispatchEvent(new Event('change'));
      }
    }
  });
})();
