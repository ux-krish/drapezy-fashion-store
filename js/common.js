const lenis = new Lenis({
  smooth: true,
  lerp: 0.08, // Adjust this value to slow down or speed up the scroll
  wheelMultiplier: 1.2,
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

  // Simple search functionality for product name/category
        (function () {
          const input = document.getElementById('main-search-input');
          const suggestionBox = document.getElementById('search-suggestions');
          let products = [];

          // Fetch products.json once
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
            // Search by title, category, gender
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

          // Hide suggestions on blur (with delay for click)
          input.addEventListener('blur', function () {
            setTimeout(() => { suggestionBox.style.display = 'none'; }, 120);
          });
          input.addEventListener('focus', function () {
            if (this.value.trim()) showSuggestions(this.value);
          });

          // Click on suggestion: go to product page
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

// Sticky main-header on scroll
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

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Swiper slide animation for product gallery (main-slider & thumbnail-slider)
function animateProductGallerySlides() {
  // Animate main-slider images
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
  // Animate thumbnail-slider images
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

// Patch Swiper for product gallery to animate slides on init/slideChange
(function patchProductGallerySwiper() {
  if (!window.Swiper) return;
  const origSwiper = window.Swiper;
  window.Swiper = function SwiperPatched(sel, opts) {
    // Only patch for product gallery sliders
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

// All page section GSAP animations (called after loader)
function runPageAnimations() {
  // Animate header
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
  // Animate navmain-header
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
  // Animate page-header
  // const pageHeader = document.querySelector('.page-header');
  // if (pageHeader) {
  //   gsap.fromTo(
  //     pageHeader,
  //     { y: -20, opacity: 0 },
  //     { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
  //   );
  //   const headerChildren = Array.from(pageHeader.querySelectorAll('.container > *'));
  //   if (headerChildren.length) {
  //     gsap.fromTo(
  //       headerChildren,
  //       { y: 20, opacity: 0 },
  //       { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.2, ease: "power2.out" }
  //     );
  //   }
  // }

  // Animate all all element inside filter aside
  // const filterSections = document.querySelectorAll('.sidebar .filter-section');
  // if (filterSections.length) {
  //   gsap.fromTo(
  //     filterSections,
  //     { y: 40, opacity: 0 },
  //     { y: 0, opacity: 1, duration: 0.6, stagger: 0.10, delay: 0.25, ease: "power2.out" }
  //   );
  //   filterSections.forEach(section => {
  //     const children = Array.from(section.children).filter(
  //       el => el.tagName !== 'H4'
  //     );
  //     if (children.length) {
  //       gsap.fromTo(
  //         children,
  //         { y: 30, opacity: 0 },
  //         { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.45, ease: "power2.out" }
  //       );
  //     }

  //     const inputs = section.querySelectorAll('input, label, select, button, ul, li, p, .price');
  //     if (inputs.length) {
  //       gsap.fromTo(
  //         inputs,
  //         { y: 15, opacity: 0 },
  //         { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.55, ease: "power2.out" }
  //       );
  //     }
  //   });
  // }

  // Animate grid-header for shop all page
  // const gridHeader = document.querySelector('.grid-header');
  // if (gridHeader) {
  //   gsap.fromTo(
  //     gridHeader,
  //     { y: 30, opacity: 0 },
  //     { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.3 }
  //   );
  //   const gridHeaderChildren = Array.from(gridHeader.children);
  //   if (gridHeaderChildren.length) {
  //     gsap.fromTo(
  //       gridHeaderChildren,
  //       { y: 20, opacity: 0 },
  //       { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.4, ease: "power2.out" }
  //     );
  //   }
  // }

  // Animate breadcrumb and its children
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

  // Product page animation
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
    // Thumbnail slider images
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

  // Animate product info section (children)
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

  // Animate Swiper slide backgrounds in .hero-swiper on window load (fade effect)
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

// GSAP Animations for sections and elements
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Animate each section
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
      opacity: 0,
      scale: 2,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        strat: "top top",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Animate banners in section-newarrival-deals from opposite X sides
  // const himBanner = document.querySelector('.section-newarrival-deals .newarrival-banner--him');
  // const herBanner = document.querySelector('.section-newarrival-deals .newarrival-banner--her');
  // if (himBanner) {
  //   gsap.from(himBanner, {
  //     opacity: 0,
  //     x: -100,
  //     duration: 0.8,
  //     ease: "power3.out",
  //     scrollTrigger: {
  //       trigger: himBanner,
  //       end: "bottom 90%",
  //       toggleActions: "play none none reverse"
  //     }
  //   });
  // }
  // if (herBanner) {
  //   gsap.from(herBanner, {
  //     opacity: 0,
  //     x: 100,
  //     duration: 0.8,
  //     ease: "power3.out",
  //     scrollTrigger: {
  //       trigger: herBanner,
  //       end: "bottom 90%",
  //       toggleActions: "play none none reverse"
  //     }
  //   });
  // }

  // Animate other banners (deals-banner, but not newarrival-banner)
  // gsap.utils.toArray('.deals-banner:not(.newarrival-banner--him):not(.newarrival-banner--her)').forEach(banner => {
  //   gsap.from(banner, {
      
  //     y: 200,
  //     scale:0.6,
  //     duration: 1,
  //     ease: "power2.out",
  //     scrollTrigger: {
  //       trigger: banner,
  //       end: "bottom 90%",
  //       toggleActions: "play none none reverse"
  //     }
  //   });
  // });

  // Animate product grids (products-grid and deals-products)
  gsap.utils.toArray('.products-grid, .deals-products').forEach(grid => {
    gsap.from(grid, {
      opacity: 0,
      x: 200,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: grid,
        end: "bottom 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Animate product cards inside grids (after products are rendered)
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

  // Animate review section
  // gsap.utils.toArray('.reviews-section').forEach(section => {
  //   gsap.from(section, {
  //     opacity: 0,
  //     y: 60,
  //     duration: 0.8,
  //     ease: "power2.out",
  //     scrollTrigger: {
  //       trigger: section,
  //       end: "bottom 90%",
  //       toggleActions: "play none none reverse"
  //     }
  //   });
  // });

  // Animate headings
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

  // Re-animate product cards after products are rendered/refreshed
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
    // Initial call for first render
    setTimeout(animateProductCards, 500);
  } else {
    // Fallback: animate on DOMContentLoaded
    setTimeout(animateProductCards, 500);
  }
}

// Ensure GSAP is loaded before running animations
document.addEventListener('DOMContentLoaded', function () {
  // Wait for GSAP to be available
  function waitForGSAP(cb) {
    if (window.gsap) {
      cb();
    } else {
      setTimeout(() => waitForGSAP(cb), 30);
    }
  }
  waitForGSAP(runPageAnimations);
});

/**
 * Render and handle product size selection as radio buttons.
 * @param {HTMLElement} container - The element where size options will be rendered.
 * @param {Array<string>} sizes - Array of available sizes (e.g., ['S', 'M', 'L']).
 * @param {string} [selectedSize] - The size to preselect (optional).
 * @param {function} [onChange] - Callback when a size is selected (optional).
 * @param {string} [name] - The radio group name (optional, default: 'size').
 */
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

/**
 * Render and handle quantity selector (with + and - buttons).
 * @param {HTMLElement} container - The element where quantity controls will be rendered.
 * @param {number} [qty] - Initial quantity.
 * @param {function} [onChange] - Callback when quantity changes.
 */
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

/**
 * Go back to product page for a given product id.
 * @param {string} productId
 */
function goToProductPage(productId) {
  if (productId) {
    window.location.href = `product.html?id=${productId}`;
  }
}

/**
 * Go back to the last visited product page (before cart/checkout).
 * Stores last product page in localStorage as 'lastProductPage'.
 */
function goToLastProductPage() {
  const lastProductPage = localStorage.getItem('lastProductPage');
  if (lastProductPage) {
    window.location.href = lastProductPage;
  } else {
    window.location.href = 'shop-all.html';
  }
}

/**
 * Call this on every product page load to remember last product page.
 */
function rememberProductPage() {
  if (window.location.pathname.endsWith('product.html')) {
    localStorage.setItem('lastProductPage', window.location.href);
  }
}

// Expose globally
window.goToLastProductPage = goToLastProductPage;
window.rememberProductPage = rememberProductPage;

// --- Wishlist Logic ---
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
// Attach wishlist button events (for dynamically loaded cards)
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
// On page load, update wishlist count in header
window.addEventListener('DOMContentLoaded', updateWishlistCount);

// --- Global GSAP animation for product cards in all product grids ---
(function animateProductCardsOnMutation() {
  // Wait for GSAP to be loaded before running any animation logic
  function runWhenGSAPReady(fn) {
    if (window.gsap && window.MutationObserver) {
      fn();
    } else {
      setTimeout(() => runWhenGSAPReady(fn), 30);
    }
  }

  // runWhenGSAPReady(function () {
  //   const lastAnimated = new WeakMap();
  //   const ANIMATION_DEBOUNCE_MS = 300;

  //   const animateCards = (container) => {
  //     // Only animate if container is visible and has product cards
  //     if (!container.offsetParent) return;
  //     const now = Date.now();
  //     // Debounce: only animate if enough time has passed since last animation
  //     if (lastAnimated.has(container) && now - lastAnimated.get(container) < ANIMATION_DEBOUNCE_MS) return;
  //     lastAnimated.set(container, now);

  //     const cards = container.querySelectorAll('.product-card');
  //     if (cards.length) {
  //       window.gsap.fromTo(cards,
  //         { y: 100 },
  //         {
  //           y: 0,
  //           duration: 0.5,
  //           stagger: 0.3,
  //           ease: "power3.out"
  //         }
  //       );
  //     }
  //   };

  //   // Only allow one observer per grid and only one animation per render
  //   const observeGrids = () => {
  //     document.querySelectorAll('.product-grid').forEach(grid => {
  //       // Only attach one observer per grid
  //       if (grid._observerAttached) return;
  //       grid._observerAttached = true;
  //       // Initial animation
  //       animateCards(grid);
  //       const observer = new MutationObserver((mutations) => {
  //         // Only animate if nodes were added (not just removed)
  //         if (mutations.some(m => m.addedNodes && m.addedNodes.length)) {
  //           animateCards(grid);
  //         }
  //       });
  //       observer.observe(grid, { childList: true, subtree: false });
  //     });
  //   };

  //   // Run on DOMContentLoaded and whenever new .product-grid appears
  //   document.addEventListener('DOMContentLoaded', observeGrids);
  //   // Also observe for new .product-grid containers (e.g., SPA navigation)
  //   const bodyObserver = new MutationObserver(observeGrids);
  //   bodyObserver.observe(document.body, { childList: true, subtree: true });
  // });
})();

/**
 * Extract selected filters from a filter sidebar container.
 * All filter sections are merged into a single filter object with each section as a different criteria.
 * @param {HTMLElement} container - The sidebar/filter container.
 * @returns {Object} filters
 */
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

  // Loop through each filter-section and assign to the correct filter property
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
      // Optionally, add maxPrice if you have a max range input
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

/**
 * Filter and render products in a grid container with filters, sort, and pagination.
 * Uses unified filter object from getSelectedFiltersFromContainer.
 * @param {Object} options
 *   container: HTMLElement for grid
 *   products: Array of products
 *   filters: filter object (see getSelectedFiltersFromContainer)
 *   sortFn: optional sort function
 *   page: page number (1-based)
 *   perPage: products per page
 *   renderCard: function(product) => HTML string
 *   onRendered: callback after rendering
 */
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

/**
 * Render and handle quantity selector (with + and - buttons) for cart items.
 * Updates cart in localStorage and price in DOM.
 * @param {HTMLElement} container - The element where quantity controls will be rendered.
 * @param {Object} cartItem - The cart item object (must have id, size, price, qty).
 * @param {function} [onUpdate] - Callback after update (optional).
 */
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
    // Update cart in localStorage
    let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    const idx = cart.findIndex(
      item => item.id === cartItem.id && item.size === cartItem.size
    );
    if (idx !== -1) {
      cart[idx].qty = newQty;
      cart[idx].total = cart[idx].price * newQty;
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      // Update price in DOM if .cart-item-price exists
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

// Expose globally
window.renderCartQuantitySelector = renderCartQuantitySelector;

// --- Wishlist page: open product page from product card view button ---
document.addEventListener('DOMContentLoaded', function () {
  // Only run on wishlist page
  if (document.querySelector('.wishlist-products .product-grid')) {
    document.querySelector('.wishlist-products .product-grid').addEventListener('click', function (e) {
      const btn = e.target.closest('.view-product');
      if (btn) {
        const card = btn.closest('.product-card');
        if (!card) return;
        const productId = card.getAttribute('data-product-id');
        if (!productId) return;
        // Find the product data from all loaded products (if available)
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



// Add hover event for menu-menu-open class on products-menu itself
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

// All GSAP animation logic has been removed from this file.
// Only non-GSAP helper functions or logic should be placed here.

// Example: You can define utility functions here if needed
// function someUtility() { ... }

// Animate product cards in related products section with ScrollTrigger
function animateRelatedProductsSection() {
  const relatedSection = document.querySelector('.related-products');
  if (relatedSection && window.gsap && window.ScrollTrigger) {
    const cards = relatedSection.querySelectorAll('.product-card');
    if (cards.length) {
      gsap.fromTo(
        cards,
        { y: 60 },
        {
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: relatedSection,
            start: "top 85%",
            once: true
          }
        }
      );
    }
  }
}

// Animate product cards in product deal section with ScrollTrigger
// function animateProductDealSection() {
//   const dealSection = document.querySelector('.product-deal');
//   if (dealSection && window.gsap && window.ScrollTrigger) {
//     const cards = dealSection.querySelectorAll('.product-card');
//     if (cards.length) {
//       gsap.fromTo(
//         cards,
//         { y: 60, opacity: 0 },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 0.7,
//           stagger: 0.12,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: dealSection,
//             start: "top 85%",
//             once: true
//           }
//         }
//       );
//     }
//   }
// }

// Observe related-products grid for new product cards and animate them
// (function observeRelatedProductsGrid() {
//   if (!window.MutationObserver) return;
//   const relatedSection = document.querySelector('.related-products');
//   if (!relatedSection) return;
//   const grid = relatedSection.querySelector('.product-grid');
//   if (!grid) return;
//   const observer = new MutationObserver(() => {
//     animateRelatedProductsSection();
//   });
//   observer.observe(grid, { childList: true });
//   animateRelatedProductsSection();
// })();

// Observe product-deal grid for new product cards and animate them
// (function observeProductDealGrid() {
//   if (!window.MutationObserver) return;
//   const dealSection = document.querySelector('.product-deal');
//   if (!dealSection) return;
//   const grid = dealSection.querySelector('.product-grid');
//   if (!grid) return;
//   const observer = new MutationObserver(() => {
//     animateProductDealSection();
//   });
//   observer.observe(grid, { childList: true });
//   animateProductDealSection();
// })();

// --- Global Search Functionality for all .search-box elements ---
// (This also supports #main-search-input for backward compatibility)
(function () {
  // Helper to highlight matched text
  function highlight(text, term) {
    if (!term) return text;
    return text.replace(new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
  }

  // Fetch products.json once and cache
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

  // Attach search to all .search-box elements and #main-search-input
  function setupSearchBox(searchBox) {
    if (!searchBox) return;
    // Only add once
    if (searchBox._searchSetup) return;
    searchBox._searchSetup = true;

    // Find/create input and suggestion list
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
        // Search by title, category, gender
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

    // Hide suggestions on blur (with delay for click)
    input.addEventListener('blur', function () {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 120);
    });
    input.addEventListener('focus', function () {
      if (this.value.trim()) showSuggestions(this.value);
    });

    // --- Fix for search-suggestions scroll on mouse wheel ---
document.addEventListener('DOMContentLoaded', function () {
  // Delegate for all .search-suggestions and #search-suggestions
  document.body.addEventListener('wheel', function (e) {
    const el = e.target.closest('.search-suggestions, #search-suggestions');
    if (el && el.scrollHeight > el.clientHeight) {
      // Only scroll the suggestion box, not the page
      el.scrollTop += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
});

    // Click on suggestion: go to product page
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

  // Setup all search-boxes on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.search-box').forEach(setupSearchBox);

    // Also support legacy #main-search-input (if present, e.g. on index.html)
    const mainInput = document.getElementById('main-search-input');
    if (mainInput && !mainInput._searchSetup) {
      mainInput._searchSetup = true;
      // Create suggestion box if not present
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

// Menu structure object
const NAV_MENU = [
  {
    logo: {
      text: `Drape<span style="color:#81B6CE">zy</span><div>FASHION</div>`,
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

// Render navigation menu and mega menu
function renderNavMenu() {
  const navLinks = document.querySelector('.nav-links');
  const navContainer = document.querySelector('.main-header .container');
  if (!navLinks || !navContainer) return;

  // Render logo dynamically if present in NAV_MENU
  const logoItem = NAV_MENU.find(item => item.logo);
  if (logoItem && !navContainer.querySelector('.logo')) {
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';
    logoDiv.innerHTML = `<a href="${logoItem.logo.href}">${logoItem.logo.text}</a>`;
    navContainer.insertBefore(logoDiv, navContainer.firstChild);
  }

  // Render menu items (skip logo item)
  navLinks.innerHTML = NAV_MENU.filter(item => !item.logo).map(item => {
    if (item.type === "mega") {
      // Mega menu
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
                // Example: first image links to men's new arrivals, second to women's new arrivals
                let href = "#";
                if (idx === 0) href = "category-page.html?gender=Men&category=newarrivals";
                if (idx === 1) href = "category-page.html?gender=Women&category=newarrivals";
                return `<a href="${href}"><img src="${img.src}" alt="${img.alt}" /></a>`;
              }).join('')}
          </div>
        </li>
      `;
    } else {
      // Regular menu item
      return `<li><a href="${item.href}">${item.label}</a></li>`;
    }
  }).join('');
}

// On DOMContentLoaded, render the nav menu
document.addEventListener('DOMContentLoaded', renderNavMenu);

/**
 * Patch add-to-cart button logic in product cards (index/shop-all/category)
 * Remove any call to window.showToast or showToast
 */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.add-to-cart');
  if (btn) {
    // Try to find product data from .product-card
    const card = btn.closest('.product-card');
    if (card) {
      const productId = card.getAttribute('data-product-id');
      if (window.fetchAllProducts && productId) {
        window.fetchAllProducts().then(products => {
          const prod = products.find(p => p.id === productId);
          if (prod) {
            // Add to cart logic here (simplified)
            let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
            const idx = cart.findIndex(item => item.id === prod.id);
            if (idx === -1) {
              // New product, add to cart
              cart.push({ ...prod, qty: 1, total: prod.price });
            } else {
              // Product already in cart, just increase qty
              cart[idx].qty += 1;
              cart[idx].total = cart[idx].price * cart[idx].qty;
            }
            localStorage.setItem('cartProducts', JSON.stringify(cart));
            // Optionally, show a toast or update cart count in header
            // window.showToast('Product added to cart!', 3000);
          }
        });
      }
    }
  }
});

// --- Cart page logic ---
// Render cart items from localStorage
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
    // Render size selection
    const sizesContainer = cartContainer.querySelector(`.cart-item[data-index="${idx}"] .cart-item-sizes`);
    if (sizesContainer) {
      renderProductSizes(sizesContainer, prod.sizes, prod.size, (selectedSize) => {
        // Update cart in localStorage
        let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
        const item = cart.find(item => item.id === prod.id);
        if (item) {
          item.size = selectedSize;
          localStorage.setItem('cartProducts', JSON.stringify(cart));
        }
      }, 'size');
    }
    // Render quantity selector
    const qtyContainer = cartContainer.querySelector(`.cart-item[data-index="${idx}"] .cart-item-qty`);
    if (qtyContainer) {
      renderCartQuantitySelector(qtyContainer, prod, (updatedItem) => {
        // Update cart in localStorage
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

// Initial render
renderCartItems();

// Remove item from cart
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.remove-from-cart');
  if (btn) {
    const cartItem = btn.closest('.cart-item');
    if (cartItem) {
      const index = cartItem.getAttribute('data-index');
      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      cart.splice(index, 1);
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      // Re-render cart items
      renderCartItems();
    }
  }
});

// --- Checkout page logic ---
// On checkout page load, pre-fill form fields if available
document.addEventListener('DOMContentLoaded', function () {
  const checkoutForm = document.querySelector('form.checkout');
  if (!checkoutForm) return;
  // Prefill example: Name and Email
  const nameField = checkoutForm.querySelector('input[name="name"]');
  const emailField = checkoutForm.querySelector('input[name="email"]');
  if (nameField) nameField.value = localStorage.getItem('checkoutName') || '';
  if (emailField) emailField.value = localStorage.getItem('checkoutEmail') || '';

  // Load saved address from localStorage (if any)
  const savedAddress = JSON.parse(localStorage.getItem('savedAddress') || 'null');
  if (savedAddress) {
    // Prefill address fields
    for (const key in savedAddress) {
      const field = checkoutForm.querySelector(`input[name="${key}"]`);
      if (field) field.value = savedAddress[key];
    }
  }
});

// On form submit, save name and email to localStorage
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

// --- Order confirmation page logic ---
// On order confirmation page load, display order details
document.addEventListener('DOMContentLoaded', function () {
  const orderDetails = document.querySelector('.order-details');
  if (!orderDetails) return;
  // Example: Display order number and items
  const orderNumber = localStorage.getItem('orderNumber') || 'N/A';
  orderDetails.innerHTML = `<h3>Order Confirmation</h3><p>Order Number: ${orderNumber}</p>`;
  // Optionally, display order items if available
  const orderItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
  if (orderItems.length) {
    const itemsList = orderItems.map(item => `<li>${item.title} - ₹${item.price.toLocaleString()}</li>`).join('');
    orderDetails.innerHTML += `<h4>Order Items:</h4><ul>${itemsList}</ul>`;
  }
});

// Contact page GSAP animation for contact-left and contact-right
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

// --- Clear localStorage helper (for testing) ---
function clearLocalStorage() {
  localStorage.removeItem('cartProducts');
  localStorage.removeItem('wishlist');
  localStorage.removeItem('lastProductPage');
  localStorage.removeItem('checkoutName');
  localStorage.removeItem('checkoutEmail');
  localStorage.removeItem('savedAddress');
  localStorage.removeItem('orderNumber');
  localStorage.removeItem('orderItems');
  // Clear all localStorage items (use with caution!)
  // localStorage.clear();
}

// --- Debugging: Log all localStorage items ---
function logLocalStorage() {
  console.log('--- Local Storage Content ---');
  for (const [key, value] of Object.entries(localStorage)) {
    console.log(`${key}: ${value}`);
  }
  console.log('-----------------------------');
}

// Example usage: Call logLocalStorage() to see all localStorage items in console
// logLocalStorage();

// --- End of JavaScript code ---



