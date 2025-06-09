const lenis = new Lenis({
  smooth: true,
  lerp: 0.08,
  wheelMultiplier: 1,
  infinite: false
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


function showTab(tabId, group) {
  document.querySelectorAll(`.products-grid[data-group="${group}"]`).forEach(el => el.classList.add('hidden'));
  document.querySelector(`#${tabId}`).classList.remove('hidden');
  document.querySelectorAll(`.tab[data-group="${group}"]`).forEach(tab => tab.classList.remove('active'));
  document.querySelector(`[onclick="showTab('${tabId}', '${group}')"]`).classList.add('active');
}

        (function () {
          const input = document.getElementById('main-search-input');
          const suggestionBox = document.getElementById('search-suggestions');
          let products = [];

          fetch('products.json')
            .then(res => res.json())
            .then(data => { products = data.products || []; });

          function highlight(text, term) {
            if (!term) return text;
            return text.replace(new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
          }

          function showSuggestions(term) {
            const q = term.trim().toLowerCase();
            if (!q) {
              suggestionBox.style.display = 'none';
              suggestionBox.innerHTML = '';
              return;
            }
            const matches = products.filter(p =>
              (p.title && p.title.toLowerCase().includes(q)) ||
              (p.category && p.category.toLowerCase().includes(q)) ||
              (p.gender && p.gender.toLowerCase().includes(q))
            ).slice(0, 8);

            if (!matches.length) {
              suggestionBox.innerHTML = '<li style="padding:10px;color:#888;">No results found.</li>';
              suggestionBox.style.display = 'block';
              return;
            }
            suggestionBox.innerHTML = matches.map(p => `
              <li style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-bottom:1px solid #f2f2f2;"
                  data-id="${p.id}">
                <img src="${p.image}" alt="${p.title}" style="width:38px;height:38px;object-fit:cover;border-radius:4px;">
                <div style="flex:1;">
                  <div style="font-weight:500;">${highlight(p.title, q)}</div>
                  <div style="font-size:13px;color:#888;">${highlight(p.category, q)}${p.gender ? ' • ' + highlight(p.gender, q) : ''}</div>
                </div>
                <span style="font-size:13px;color:#222;">₹${p.price ? p.price.toLocaleString() : ''}</span>
              </li>
            `).join('');
            suggestionBox.style.display = 'block';
          }

          input.addEventListener('input', function () {
            showSuggestions(this.value);
          });

          input.addEventListener('blur', function () {
            setTimeout(() => { suggestionBox.style.display = 'none'; }, 120);
          });
          input.addEventListener('focus', function () {
            if (this.value.trim()) showSuggestions(this.value);
          });

          suggestionBox.addEventListener('mousedown', function (e) {
            const li = e.target.closest('li[data-id]');
            if (!li) return;
            const prod = products.find(p => p.id === li.getAttribute('data-id'));
            if (prod) {
              localStorage.setItem('selectedProduct', JSON.stringify(prod));
              window.location.href = `product.html?id=${prod.id}`;
            }
          });
        })();

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.main-header');
  const navbar = document.querySelector('nav');
  const body = document.querySelector('body');

  if (!header && !navbar) return;
  const stickyOffset = header.offsetTop;

  function handleStickyHeader() {
    if (window.scrollY > stickyOffset) {
      header.classList.add('sticky');
      
      body.classList.add('header-sticky');
      body.style.paddingTop = `${header.clientHeight + navbar.clientHeight - header.clientHeight}px`;
    } else {
      header.classList.remove('sticky');
      body.classList.remove('header-sticky');
       body.style.paddingTop = `0px`;
    }
  }

  window.addEventListener('scroll', handleStickyHeader);
});

const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

const hamburgerSvg = `
  <svg width="30" height="24" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.500007 10C0.358007 10 0.23934 9.952 0.144007 9.856C0.0486736 9.76 0.000673516 9.641 6.84931e-06 9.499C-0.000659817 9.357 0.0473402 9.23833 0.144007 9.143C0.240674 9.04767 0.35934 9 0.500007 9H10.923C11.065 9 11.1837 9.048 11.279 9.144C11.3743 9.24 11.4223 9.359 11.423 9.501C11.4237 9.643 11.3757 9.76167 11.279 9.857C11.1823 9.95233 11.0637 10 10.923 10H0.500007ZM14.939 8.742L11.742 5.565C11.5807 5.40433 11.5 5.216 11.5 5C11.5 4.784 11.5807 4.59567 11.742 4.435L14.938 1.277C15.0313 1.18367 15.1463 1.13367 15.283 1.127C15.4183 1.12033 15.5393 1.17033 15.646 1.277C15.7527 1.38367 15.806 1.50167 15.806 1.631C15.806 1.76033 15.7527 1.878 15.646 1.984L12.573 5L15.646 8.035C15.7527 8.12367 15.806 8.237 15.806 8.375C15.806 8.513 15.7527 8.63533 15.646 8.742C15.5567 8.83533 15.4433 8.882 15.306 8.882C15.1673 8.882 15.0457 8.83533 14.939 8.742ZM0.500007 5.5C0.358007 5.5 0.23934 5.452 0.144007 5.356C0.0486736 5.26 0.000673516 5.141 6.84931e-06 4.999C-0.000659817 4.857 0.0473402 4.73833 0.144007 4.643C0.240674 4.54767 0.35934 4.5 0.500007 4.5H8.07701C8.21901 4.5 8.33767 4.548 8.43301 4.644C8.52834 4.74 8.57634 4.859 8.57701 5.001C8.57767 5.143 8.52967 5.26167 8.43301 5.357C8.33634 5.45233 8.21767 5.5 8.07701 5.5H0.500007ZM0.500007 1C0.358007 1 0.23934 0.952 0.144007 0.856C0.0486736 0.76 0.000673516 0.641 6.84931e-06 0.499C-0.000659817 0.357 0.0473402 0.238333 0.144007 0.143C0.240674 0.0476668 0.35934 0 0.500007 0H10.923C11.065 0 11.1837 0.0480001 11.279 0.144C11.3743 0.24 11.4223 0.359 11.423 0.501C11.4237 0.643 11.3757 0.761667 11.279 0.857C11.1823 0.952333 11.0637 1 10.923 1H0.500007Z" fill="#4E4E4E"/>
            </svg>
`;
const closeSvg = `
 <svg width="22" height="22" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L11 11M1 11L11 1" stroke="#4E4E4E" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

if (hamburger && !hamburger.innerHTML.trim()) {
  hamburger.innerHTML = hamburgerSvg;
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  if (hamburger.classList.contains('active')) {
    hamburger.innerHTML = closeSvg;
  } else {
    hamburger.innerHTML = hamburgerSvg;
  }
});

function animateProductGallerySlides() {
  const mainSlider = document.querySelector('.main-slider.swiper');
  if (mainSlider && window.mainSwiper) {
    const mainSlides = mainSlider.querySelectorAll('.swiper-slide img');
    if (mainSlides.length) {
      gsap.fromTo(
        mainSlides,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out"
        }
      );
    }
  }
  const thumbSlider = document.querySelector('.thumbnail-slider.swiper');
  if (thumbSlider && window.thumbSwiper) {
    const thumbSlides = thumbSlider.querySelectorAll('.swiper-slide img');
    if (thumbSlides.length) {
      gsap.fromTo(
        thumbSlides,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          delay: 0.2,
          ease: "power2.out"
        }
      );
    }
  }
}

(function patchProductGallerySwiper() {
  if (!window.Swiper) return;
  const origSwiper = window.Swiper;
  window.Swiper = function SwiperPatched(sel, opts) {
    if (
      (sel === '.main-slider.swiper' || sel === '.thumbnail-slider.swiper') &&
      opts && opts.on
    ) {
      const origInit = opts.on.init;
      const origSlideChange = opts.on.slideChangeTransitionStart;
      opts.on.init = function () {
        setTimeout(animateProductGallerySlides, 10);
        if (origInit) origInit.apply(this, arguments);
      };
      opts.on.slideChangeTransitionStart = function () {
        setTimeout(animateProductGallerySlides, 10);
        if (origSlideChange) origSlideChange.apply(this, arguments);
      };
    }
    return new origSwiper(sel, opts);
  };
  Object.assign(window.Swiper, origSwiper);
})();

function runPageAnimations() {
  const header = document.querySelector('header.top-bar');
  if (header) {
    gsap.fromTo(
      header,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
    const headerChildren = Array.from(header.querySelectorAll('.container > *'));
    if (headerChildren.length) {
      gsap.fromTo(
        headerChildren,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.09,  ease: "power2.out" }
      );
    }
  }
  const nav = document.querySelector('nav.main-header');
  if (nav) {
    gsap.fromTo(
      nav,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.08, ease: "power2.out" }
    );
    const navChildren = Array.from(nav.querySelectorAll('.container > *, .nav-links > *'));
    if (navChildren.length) {
      gsap.fromTo(
        navChildren,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.18, ease: "power3.out" }
      );
    }
  }

  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    gsap.fromTo(
      breadcrumb,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power2.out" }
    );
    const bcChildren = Array.from(breadcrumb.querySelectorAll('.container > *'));
    if (bcChildren.length) {
      gsap.fromTo(
        bcChildren,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, delay: 0.3, ease: "power2.out" }
      );
    }
  }

  setTimeout(() => {
    const mainSliderSlides = document.querySelectorAll('.main-slider .swiper-slide img');
    if (mainSliderSlides.length) {
      gsap.fromTo(
        mainSliderSlides,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out"
        }
      );
    }
    const thumbSliderSlides = document.querySelectorAll('.thumbnail-slider .swiper-slide img');
    if (thumbSliderSlides.length) {
      gsap.fromTo(
        thumbSliderSlides,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          delay: 0.2,
          ease: "power2.out"
        }
      );
    }
  }, 100);

  const productInfo = document.querySelector('.product-info');
  if (productInfo && productInfo.children.length) {
    gsap.fromTo(
      Array.from(productInfo.children).filter(el => el.nodeType === 1),
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

  const heroSlides = document.querySelectorAll('.hero-swiper .swiper-slide');
  if (heroSlides && heroSlides.length) {
    gsap.fromTo(
      heroSlides,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        stagger: 0.18,
        ease: "power2.out"
      }
    );
  }
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.utils.toArray('.products-grid, .deals-products').forEach(grid => {
    gsap.from(grid, {
      
      x: -200,
      duration: 2,
      stagger: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: grid,
        end: "bottom 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  function animateProductCards() {
    gsap.utils.toArray(' .deals-products .product-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        delay: i * 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          end: "bottom 90%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }
  if (document.querySelector('.reviews-section')) {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".reviews-section",
        start: "top 80%",
        end: "bottom 80%",
        toggleActions: "play none none reverse"
      }
    })
      .from(".reviews-section h2", {
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: "power3.out"
      })
      .from(".reviews-section .reviews-carousel", {
        opacity: 0,
        y: 200,
        duration: 0.7,
        ease: "power3.out"
      }, "<+0.1")
      .from(".reviews-section .review-card", {
        opacity: 0,
        y: 60,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out"
      }, "<+0.1");
  }



  gsap.utils.toArray('h2, h3').forEach(heading => {
    gsap.from(heading, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: heading,
        end: "bottom 90%",
        toggleActions: "play none none reverse"
      }
    });
  });

  if (typeof showProducts === 'function') {
    const origShowProducts = showProducts;
    window.showProducts = function(opts) {
      origShowProducts({
        ...opts,
        onRendered: function() {
          animateProductCards();
          if (typeof opts.onRendered === 'function') opts.onRendered();
        }
      });
    };
    setTimeout(animateProductCards, 500);
  } else {
    setTimeout(animateProductCards, 500);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  function waitForGSAP(cb) {
    if (window.gsap) {
      cb();
    } else {
      setTimeout(() => waitForGSAP(cb), 30);
    }
  }
  waitForGSAP(runPageAnimations);
});


function renderProductSizes(container, sizes, selectedSize, onChange, name = 'size') {
  if (!container || !Array.isArray(sizes) || !sizes.length) return;
  container.innerHTML = '';
  sizes.forEach(size => {
    const label = document.createElement('label');
    label.className = 'size-radio-label';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = size;
    if (size === selectedSize) input.checked = true;
    input.addEventListener('change', () => {
      if (typeof onChange === 'function') onChange(size);
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(size));
    container.appendChild(label);
  });
}


function renderQuantitySelector(container, qty = 1, onChange) {
  if (!container) return;
  container.innerHTML = `
    <button type="button" class="qty-dec">
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 12.5H19.5" stroke="#4E4E4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <input type="number" min="1" value="${qty}" class="qty-input" style="width:40px;text-align:center;" />
    <button type="button" class="qty-inc">
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 5.5V19.5M5.5 12.5H19.5" stroke="#4E4E4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  const input = container.querySelector('.qty-input');
  const incBtn = container.querySelector('.qty-inc');
  const decBtn = container.querySelector('.qty-dec');
  incBtn.onclick = () => {
    input.value = parseInt(input.value) + 1;
    if (typeof onChange === 'function') onChange(parseInt(input.value));
  };
  decBtn.onclick = () => {
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    if (typeof onChange === 'function') onChange(parseInt(input.value));
  };
  input.oninput = () => {
    if (parseInt(input.value) < 1) input.value = 1;
    if (typeof onChange === 'function') onChange(parseInt(input.value));
  };
}


function goToProductPage(productId) {
  if (productId) {
    window.location.href = `product.html?id=${productId}`;
  }
}

function goToLastProductPage() {
  const lastProductPage = localStorage.getItem('lastProductPage');
  if (lastProductPage) {
    window.location.href = lastProductPage;
  } else {
    window.location.href = 'shop-all.html';
  }
}

function rememberProductPage() {
  if (window.location.pathname.endsWith('product.html')) {
    localStorage.setItem('lastProductPage', window.location.href);
  }
}

window.goToLastProductPage = goToLastProductPage;
window.rememberProductPage = rememberProductPage;

function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
}
function setWishlist(arr) {
  localStorage.setItem('wishlist', JSON.stringify(arr));
}
function updateWishlistCount() {
  const icon = document.querySelector('.icon-wishlist-count');
  if (icon) {
    const count = getWishlist().length;
    icon.textContent = count > 0 ? count : '';
    icon.style.display = count > 0 ? 'inline-block' : 'none';
  }
}
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.add-to-wishlist');
  if (btn) {
    const card = btn.closest('.product-card');
    if (!card) return;
    const id = card.getAttribute('data-product-id');
    if (!id) return;
    let wishlist = getWishlist();
    if (!wishlist.includes(id)) {
      wishlist.push(id);
      setWishlist(wishlist);
      updateWishlistCount();
    }
    btn.classList.add('wishlisted');
    e.preventDefault();
    e.stopPropagation();
  }
});
window.addEventListener('DOMContentLoaded', updateWishlistCount);

(function animateProductCardsOnMutation() {
  function runWhenGSAPReady(fn) {
    if (window.gsap && window.MutationObserver) {
      fn();
    } else {
      setTimeout(() => runWhenGSAPReady(fn), 30);
    }
  }
})();


function getSelectedFiltersFromContainer(container) {
  if (!container) return {};
  const filters = {
    categories: [],
    sizes: [],
    gender: [],
    minPrice: 100,
    maxPrice: 10000,
    minDiscount: 0
  };

  container.querySelectorAll('.filter-section').forEach(section => {
    const title = section.querySelector('h4')?.textContent?.toLowerCase() || '';
    // Category
    if (/category/.test(title)) {
      filters.categories = Array.from(section.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    }
    // Size
    else if (/size/.test(title)) {
      filters.sizes = Array.from(section.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.parentElement.textContent.trim());
    }
    // Gender
    else if (/gender/.test(title)) {
      filters.gender = Array.from(section.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    }
    // Price
    else if (/price/.test(title)) {
      const priceRange = section.querySelector('input[type="range"]');
      if (priceRange) filters.minPrice = parseInt(priceRange.value) || 100;
      const maxRange = section.querySelector('input[type="range"].max');
      if (maxRange) filters.maxPrice = parseInt(maxRange.value) || 10000;
    }
    // Discount
    else if (/discount/.test(title)) {
      let minDiscount = 0;
      Array.from(section.querySelectorAll('input[type="checkbox"]:checked')).forEach(cb => {
        const txt = cb.parentElement.textContent;
        if (txt.includes('50%')) minDiscount = Math.max(minDiscount, 50);
        else if (txt.includes('30%')) minDiscount = Math.max(minDiscount, 30);
        else if (txt.includes('10%')) minDiscount = Math.max(minDiscount, 10);
      });
      filters.minDiscount = minDiscount;
    }
  });

  return filters;
}


function filterAndRenderProducts({
  container,
  products,
  filters = {},
  sortFn,
  page = 1,
  perPage = 9,
  renderCard,
  onRendered
}) {
  if (!container || !Array.isArray(products)) return;
  let filtered = products.filter(p => {
    // Gender
    if (filters.gender && filters.gender.length) {
      if (!filters.gender.some(g => (g === 'for him' && p.gender === 'Men') || (g === 'for her' && p.gender === 'Women') || (g === (p.gender || '').toLowerCase()))) return false;
    }
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
  if (sortFn) filtered = filtered.sort(sortFn);
  const total = filtered.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageProducts = filtered.slice(start, end);
  container.innerHTML = '';
  if (!pageProducts.length) {
    container.innerHTML = '<div style="padding:24px; width:100%">No products found.</div>';
    if (typeof onRendered === 'function') onRendered({ total });
    return;
  }
  pageProducts.forEach(product => {
    container.innerHTML += renderCard(product);
  });
  if (typeof onRendered === 'function') onRendered({ total });
}

function renderCartQuantitySelector(container, cartItem, onUpdate) {
  if (!container || !cartItem) return;
  container.innerHTML = `
    <button type="button" class="qty-dec">
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 12.5H19.5" stroke="#4E4E4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <input type="number" min="1" value="${cartItem.qty}" class="qty-input" style="width:40px;text-align:center;" />
    <button type="button" class="qty-inc">
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 5.5V19.5M5.5 12.5H19.5" stroke="#4E4E4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  const input = container.querySelector('.qty-input');
  const incBtn = container.querySelector('.qty-inc');
  const decBtn = container.querySelector('.qty-dec');
  function updateQty(newQty) {
    if (newQty < 1) newQty = 1;
    input.value = newQty;
    let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    const idx = cart.findIndex(
      item => item.id === cartItem.id && item.size === cartItem.size
    );
    if (idx !== -1) {
      cart[idx].qty = newQty;
      cart[idx].total = cart[idx].price * newQty;
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      const priceElem = container.closest('.cart-item')?.querySelector('.cart-item-price');
      if (priceElem) {
        priceElem.textContent = `₹${(cart[idx].price * newQty).toLocaleString()}`;
      }
      if (typeof onUpdate === 'function') onUpdate(cart[idx]);
    }
  }
  incBtn.onclick = () => updateQty(parseInt(input.value) + 1);
  decBtn.onclick = () => updateQty(parseInt(input.value) - 1);
  input.oninput = () => updateQty(parseInt(input.value));
}

window.renderCartQuantitySelector = renderCartQuantitySelector;

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.wishlist-products .product-grid')) {
    document.querySelector('.wishlist-products .product-grid').addEventListener('click', function (e) {
      const btn = e.target.closest('.view-product');
      if (btn) {
        const card = btn.closest('.product-card');
        if (!card) return;
        const productId = card.getAttribute('data-product-id');
        if (!productId) return;
        if (window.fetchAllProducts) {
          window.fetchAllProducts().then(products => {
            const prod = products.find(p => p.id === productId);
            if (prod) {
              localStorage.setItem('selectedProduct', JSON.stringify(prod));
              window.location.href = `product.html?id=${prod.id}`;
            }
          });
        }
      }
    });
  }
});



document.addEventListener('DOMContentLoaded', function () {
  const productsMenu = document.querySelector('.products-menu');
  if (productsMenu) {
    productsMenu.addEventListener('mouseenter', function () {
      productsMenu.classList.add('menu-menu-open');
    });
    productsMenu.addEventListener('mouseleave', function () {
      productsMenu.classList.remove('menu-menu-open');
    });
  }
});

(function () {
  function highlight(text, term) {
    if (!term) return text;
    return text.replace(new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
  }

  let products = [];
  let productsLoaded = false;
  function loadProducts(cb) {
    if (productsLoaded) return cb(products);
    fetch('products.json')
      .then(res => res.json())
      .then(data => {
        products = data.products || [];
        productsLoaded = true;
        cb(products);
      });
  }

  function setupSearchBox(searchBox) {
    if (!searchBox) return;
    if (searchBox._searchSetup) return;
    searchBox._searchSetup = true;

    let input = searchBox.querySelector('input[type="text"], input[type="search"]');
    if (!input) return;
    input.setAttribute('autocomplete', 'off');
    input.id = input.id || 'search-input-' + Math.random().toString(36).slice(2, 8);

    let suggestionBox = searchBox.querySelector('.search-suggestions, #search-suggestions, ul');
    if (!suggestionBox || !suggestionBox.classList.contains('search-suggestions')) {
      suggestionBox = document.createElement('ul');
      suggestionBox.className = 'search-suggestions';
      suggestionBox.style.display = 'none';
      suggestionBox.style.position = 'absolute';
      suggestionBox.style.top = '100%';
      suggestionBox.style.left = '0';
      suggestionBox.style.width = '100%';
      suggestionBox.style.background = '#fff';
      suggestionBox.style.zIndex = '1000';
      suggestionBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      suggestionBox.style.borderRadius = '0 0 8px 8px';
      suggestionBox.style.maxHeight = '320px';
      suggestionBox.style.overflowY = 'auto';
      suggestionBox.style.padding = '0';
      suggestionBox.style.margin = '0';
      suggestionBox.style.listStyle = 'none';
      searchBox.appendChild(suggestionBox);
    }

    function showSuggestions(term) {
      const q = term.trim().toLowerCase();
      if (!q) {
        suggestionBox.style.display = 'none';
        suggestionBox.innerHTML = '';
        return;
      }
      loadProducts(function (products) {
        const matches = products.filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.gender && p.gender.toLowerCase().includes(q))
        ).slice(0, 8);

        if (!matches.length) {
          suggestionBox.innerHTML = '<li style="padding:10px;color:#888;">No results found.</li>';
          suggestionBox.style.display = 'block';
          return;
        }
        suggestionBox.innerHTML = matches.map(p => `
          <li style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-bottom:1px solid #f2f2f2;"
              data-id="${p.id}">
            <img src="${p.image}" alt="${p.title}" style="width:38px;height:38px;object-fit:cover;border-radius:4px;">
            <div style="flex:1;">
              <div style="font-weight:500;">${highlight(p.title, q)}</div>
              <div style="font-size:13px;color:#888;">${highlight(p.category, q)}${p.gender ? ' • ' + highlight(p.gender, q) : ''}</div>
            </div>
            <span style="font-size:13px;color:#222;">₹${p.price ? p.price.toLocaleString() : ''}</span>
          </li>
        `).join('');
        suggestionBox.style.display = 'block';
      });
    }

    input.addEventListener('input', function () {
      showSuggestions(this.value);
    });

    input.addEventListener('blur', function () {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 120);
    });
    input.addEventListener('focus', function () {
      if (this.value.trim()) showSuggestions(this.value);
    });

document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('wheel', function (e) {
    const el = e.target.closest('.search-suggestions, #search-suggestions');
    if (el && el.scrollHeight > el.clientHeight) {
      el.scrollTop += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
});

    suggestionBox.addEventListener('mousedown', function (e) {
      const li = e.target.closest('li[data-id]');
      if (!li) return;
      loadProducts(function (products) {
        const prod = products.find(p => p.id === li.getAttribute('data-id'));
        if (prod) {
          localStorage.setItem('selectedProduct', JSON.stringify(prod));
          window.location.href = `product.html?id=${prod.id}`;
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.search-box').forEach(setupSearchBox);

    const mainInput = document.getElementById('main-search-input');
    if (mainInput && !mainInput._searchSetup) {
      mainInput._searchSetup = true;
      let suggestionBox = document.getElementById('search-suggestions');
      if (!suggestionBox) {
        suggestionBox = document.createElement('ul');
        suggestionBox.id = 'search-suggestions';
        suggestionBox.style.display = 'none';
        suggestionBox.style.position = 'absolute';
        suggestionBox.style.top = '100%';
        suggestionBox.style.left = '0';
        suggestionBox.style.width = '100%';
        suggestionBox.style.background = '#fff';
        suggestionBox.style.zIndex = '1000';
        suggestionBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        suggestionBox.style.borderRadius = '0 0 8px 8px';
        suggestionBox.style.maxHeight = '320px';
        suggestionBox.style.overflowY = 'auto';
        suggestionBox.style.padding = '0';
        suggestionBox.style.margin = '0';
        suggestionBox.style.listStyle = 'none';
        mainInput.parentNode.appendChild(suggestionBox);
      }
      function showSuggestions(term) {
        const q = term.trim().toLowerCase();
        if (!q) {
          suggestionBox.style.display = 'none';
          suggestionBox.innerHTML = '';
          return;
        }
        loadProducts(function (products) {
          const matches = products.filter(p =>
            (p.title && p.title.toLowerCase().includes(q)) ||
            (p.category && p.category.toLowerCase().includes(q)) ||
            (p.gender && p.gender.toLowerCase().includes(q))
          ).slice(0, 8);

          if (!matches.length) {
            suggestionBox.innerHTML = '<li style="padding:10px;color:#888;">No results found.</li>';
            suggestionBox.style.display = 'block';
            return;
          }
          suggestionBox.innerHTML = matches.map(p => `
            <li style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-bottom:1px solid #f2f2f2;"
                data-id="${p.id}">
              <img src="${p.image}" alt="${p.title}" style="width:38px;height:38px;object-fit:cover;border-radius:4px;">
              <div style="flex:1;">
                <div style="font-weight:500;">${highlight(p.title, q)}</div>
                <div style="font-size:13px;color:#888;">${highlight(p.category, q)}${p.gender ? ' • ' + highlight(p.gender, q) : ''}</div>
              </div>
              <span style="font-size:13px;color:#222;">₹${p.price ? p.price.toLocaleString() : ''}</span>
            </li>
          `).join('');
          suggestionBox.style.display = 'block';
        });
      }
      mainInput.addEventListener('input', function () {
        showSuggestions(this.value);
      });
      mainInput.addEventListener('blur', function () {
        setTimeout(() => { suggestionBox.style.display = 'none'; }, 120);
      });
      mainInput.addEventListener('focus', function () {
        if (this.value.trim()) showSuggestions(this.value);
      });
      suggestionBox.addEventListener('mousedown', function (e) {
        const li = e.target.closest('li[data-id]');
        if (!li) return;
        loadProducts(function (products) {
          const prod = products.find(p => p.id === li.getAttribute('data-id'));
          if (prod) {
            localStorage.setItem('selectedProduct', JSON.stringify(prod));
            window.location.href = `product.html?id=${prod.id}`;
          }
        });
      });
    }
  });
})();

const NAV_MENU = [
  {
    logo: {
      text: `Drape<span style="color:#81B6CE">zy</span><div>FASHI<span>ON</span></div>`,
      href: "index.html"
    }
  },
  {
    label: "PRODUCTS",
    href: "shop-all.html",
    type: "mega",
    mega: {
      columns: [
        {
          heading: "FOR HIM",
          items: [
            { label: "New Arrivals", gender: "Men", category: "newarrivals" },
            { label: "T-Shirts", gender: "Men", category: "Tshirts" },
            { label: "Shirts", gender: "Men", category: "Shirts" },
            { label: "Jeans", gender: "Men", category: "Jeans" },
            { label: "Jackets & Coats", gender: "Men", category: "Jackets & Coats" },
            { label: "Ethnic Wear", gender: "Men", category: "ethnic" }
          ]
        },
        {
          heading: "FOR HER",
          items: [
            { label: "New Arrivals", gender: "Women", category: "newarrivals" },
            { label: "Dresses", gender: "Women", category: "Dresses" },
            { label: "Jeans", gender: "Women", category: "Jeans" },
            { label: "Tops & T-shirts", gender: "Women", category: "Tshirts" },
            { label: "Skirts & Shorts", gender: "Women", category: "Skirts and Shorts" },
            { label: "Ethnic Wear", gender: "Women", category: "ethnic" }
          ]
        }
      ],
      images: [
        { src: "images/menu2-bg.jpg", alt: "Best Offer" },
        { src: "images/menu3-bg.jpg", alt: "New Arrival" }
      ]
    }
  },
  { label: "CATEGORY", href: "category-page.html" },
  { label: "NEW ARRIVAL", href: "new-arrival.html" },
  { label: "CONTACT", href: "contact.html" },
  { label: "ORDERED", href: "order-history.html" }
];

function renderNavMenu() {
  const navLinks = document.querySelector('.nav-links');
  const navContainer = document.querySelector('.main-header .container');
  if (!navLinks || !navContainer) return;

  const logoItem = NAV_MENU.find(item => item.logo);
  if (logoItem && !navContainer.querySelector('.logo')) {
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';
    logoDiv.innerHTML = `<a href="${logoItem.logo.href}">${logoItem.logo.text}</a>`;
    navContainer.insertBefore(logoDiv, navContainer.firstChild);
  }

  navLinks.innerHTML = NAV_MENU.filter(item => !item.logo).map(item => {
    if (item.type === "mega") {
      return `
        <li class="products-menu">
          <a href="shop-all.html">PRODUCTS</a>
          <div class="mega-menu">
            <div class="mega-columns">
              ${item.mega.columns.map(col => `
                <div class="column">
                  <h4>${col.heading}</h4>
                  <ul>
                    ${col.items.map(menu =>
                       `<li><a href="category-page.html?gender=${encodeURIComponent(menu.gender)}&category=${encodeURIComponent(menu.category)}">${menu.label}</a></li>`
                    ).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
            ${item.mega.images.map((img, idx) => {
                let href = "#";
                if (idx === 0) href = "category-page.html?gender=Men&category=newarrivals";
                if (idx === 1) href = "category-page.html?gender=Women&category=newarrivals";
                return `<a href="${href}"><img src="${img.src}" alt="${img.alt}" /></a>`;
              }).join('')}
          </div>
        </li>
      `;
    } else {
      return `<li><a href="${item.href}">${item.label}</a></li>`;
    }
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderNavMenu);

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.add-to-cart');
  if (btn) {
    const card = btn.closest('.product-card');
    if (card) {
      const productId = card.getAttribute('data-product-id');
      if (window.fetchAllProducts && productId) {
        window.fetchAllProducts().then(products => {
          const prod = products.find(p => p.id === productId);
          if (prod) {
            let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
            const idx = cart.findIndex(item => item.id === prod.id);
            if (idx === -1) {
              cart.push({ ...prod, qty: 1, total: prod.price });
            } else {
              cart[idx].qty += 1;
              cart[idx].total = cart[idx].price * cart[idx].qty;
            }
            localStorage.setItem('cartProducts', JSON.stringify(cart));
          }
        });
      }
    }
  }
});

function renderCartItems() {
  const cartContainer = document.querySelector('.cart-items');
  if (!cartContainer) return;
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  cartContainer.innerHTML = '';
  if (!cartProducts.length) {
    cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
    return;
  }
  cartProducts.forEach((prod, idx) => {
    cartContainer.innerHTML += `
      <div class="cart-item" data-index="${idx}">
        <div class="cart-item-info">
          <img src="${prod.image}" alt="${prod.title}" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${prod.title}</h4>
            <p class="cart-item-category">${prod.category} • ${prod.gender}</p>
            <div class="cart-item-sizes"></div>
          </div>
        </div>
        <div class="cart-item-qty">
          <!-- Quantity selector will be injected here -->
        </div>
        <div class="cart-item-price">₹${prod.total.toLocaleString()}</div>
        <button class="remove-from-cart">Remove</button>
      </div>
    `;
    const sizesContainer = cartContainer.querySelector(`.cart-item[data-index="${idx}"] .cart-item-sizes`);
    if (sizesContainer) {
      renderProductSizes(sizesContainer, prod.sizes, prod.size, (selectedSize) => {
        let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
        const item = cart.find(item => item.id === prod.id);
        if (item) {
          item.size = selectedSize;
          localStorage.setItem('cartProducts', JSON.stringify(cart));
        }
      }, 'size');
    }
    const qtyContainer = cartContainer.querySelector(`.cart-item[data-index="${idx}"] .cart-item-qty`);
    if (qtyContainer) {
      renderCartQuantitySelector(qtyContainer, prod, (updatedItem) => {
        let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
        const item = cart.find(item => item.id === updatedItem.id);
        if (item) {
          item.qty = updatedItem.qty;
          item.total = updatedItem.total;
          localStorage.setItem('cartProducts', JSON.stringify(cart));
        }
      });
    }
  });
}

renderCartItems();

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.remove-from-cart');
  if (btn) {
    const cartItem = btn.closest('.cart-item');
    if (cartItem) {
      const index = cartItem.getAttribute('data-index');
      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      cart.splice(index, 1);
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      renderCartItems();
    }
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const checkoutForm = document.querySelector('form.checkout');
  if (!checkoutForm) return;
  const nameField = checkoutForm.querySelector('input[name="name"]');
  const emailField = checkoutForm.querySelector('input[name="email"]');
  if (nameField) nameField.value = localStorage.getItem('checkoutName') || '';
  if (emailField) emailField.value = localStorage.getItem('checkoutEmail') || '';

  const savedAddress = JSON.parse(localStorage.getItem('savedAddress') || 'null');
  if (savedAddress) {
    for (const key in savedAddress) {
      const field = checkoutForm.querySelector(`input[name="${key}"]`);
      if (field) field.value = savedAddress[key];
    }
  }
});

document.addEventListener('submit', function (e) {
  const form = e.target.closest('form.checkout');
  if (form) {
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    if (name && email) {
      localStorage.setItem('checkoutName', name.value);
      localStorage.setItem('checkoutEmail', email.value);
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const orderDetails = document.querySelector('.order-details');
  if (!orderDetails) return;
  const orderNumber = localStorage.getItem('orderNumber') || 'N/A';
  orderDetails.innerHTML = `<h3>Order Confirmation</h3><p>Order Number: ${orderNumber}</p>`;
  const orderItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
  if (orderItems.length) {
    const itemsList = orderItems.map(item => `<li>${item.title} - ₹${item.price.toLocaleString()}</li>`).join('');
    orderDetails.innerHTML += `<h4>Order Items:</h4><ul>${itemsList}</ul>`;
  }
});

document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap !== 'undefined' && document.querySelector('.contact-left') && document.querySelector('.contact-right')) {
    gsap.from('.contact-left', {
      x: -120,
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      ease: "power3.out"
    });
    gsap.from('.contact-right', {
      x: 120,
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      ease: "power3.out"
    });
  }
});

function clearLocalStorage() {
  localStorage.removeItem('cartProducts');
  localStorage.removeItem('wishlist');
  localStorage.removeItem('lastProductPage');
  localStorage.removeItem('checkoutName');
  localStorage.removeItem('checkoutEmail');
  localStorage.removeItem('savedAddress');
  localStorage.removeItem('orderNumber');
  localStorage.removeItem('orderItems');
}

// function logLocalStorage() {
//   console.log('--- Local Storage Content ---');
//   for (const [key, value] of Object.entries(localStorage)) {
//     console.log(`${key}: ${value}`);
//   }
//   console.log('-----------------------------');
// }



