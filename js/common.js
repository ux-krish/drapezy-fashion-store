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
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.18, ease: "power2.out" }
      );
    }
  }
  // Animate page-header
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    gsap.fromTo(
      pageHeader,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
    );
    const headerChildren = Array.from(pageHeader.querySelectorAll('.container > *'));
    if (headerChildren.length) {
      gsap.fromTo(
        headerChildren,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.2, ease: "power2.out" }
      );
    }
  }

  // Animate all all element inside filter aside
  const filterSections = document.querySelectorAll('.sidebar .filter-section');
  if (filterSections.length) {
    gsap.fromTo(
      filterSections,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.10, delay: 0.25, ease: "power2.out" }
    );
    filterSections.forEach(section => {
      const children = Array.from(section.children).filter(
        el => el.tagName !== 'H4'
      );
      if (children.length) {
        gsap.fromTo(
          children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.45, ease: "power2.out" }
        );
      }

      const inputs = section.querySelectorAll('input, label, select, button, ul, li, p, .price');
      if (inputs.length) {
        gsap.fromTo(
          inputs,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.55, ease: "power2.out" }
        );
      }
    });
  }

  // Animate grid-header for shop all page
  const gridHeader = document.querySelector('.grid-header');
  if (gridHeader) {
    gsap.fromTo(
      gridHeader,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.3 }
    );
    const gridHeaderChildren = Array.from(gridHeader.children);
    if (gridHeaderChildren.length) {
      gsap.fromTo(
        gridHeaderChildren,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.4, ease: "power2.out" }
      );
    }
  }

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
  if (productInfo) {
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

  // Animate all product-card elements (on all pages) from y axis with stagger
  const productCards = document.querySelectorAll('.product-card');
  if (productCards.length) {
    gsap.fromTo(
      productCards,
      { y: 60, opacity: 0 },
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
  if (heroSlides.length) {
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

  // --- Home page GSAP animations ---
  if (document.querySelector('.hero-swiper')) {
    // Autoplay progress elements (if you use them)
    const progressCircle = document.querySelector('.autoplay-progress svg circle');
    const progressContent = document.querySelector('.autoplay-progress span');

    // Hero Swiper with GSAP animation for slide article content
    window.heroSwiper = new Swiper('.hero-swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      autoplay: {
        delay: 15000,
      },
      draggable: true,
      on: {
        autoplayTimeLeft(s, time, progress) {
          if (progressCircle && progressContent) {
            progressCircle.style.setProperty("--progress", 1 - progress);
            progressContent.textContent = `${Math.ceil(time / 1000)}s`;
          }
        },
        init: function () {
          const currentSlide = this.slides[this.activeIndex];
          const content = currentSlide && currentSlide.querySelector('.container');
          if (content) {
            gsap.fromTo(content.children,
              { y: 60, opacity: 0 },
              {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power2.out",
                delay: 0.15
              }
            );
          }
        },
        slideChangeTransitionStart: function () {
          const currentSlide = this.slides[this.activeIndex];
          const content = currentSlide && currentSlide.querySelector('.container');
          if (content) {
            gsap.fromTo(content.children,
              { y: 60, opacity: 0 },
              {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power2.out",
                delay: 0.15
              }
            );
          }
        }
      }
    });

    // Review Swiper (if present)
    if (document.querySelector('.reviewSwiper')) {
      window.reviewSwiper = new Swiper('.reviewSwiper', {
        autoHeight: true,
        slidesPerView: 4.3,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          1024: { slidesPerView: 4.2 },
          768: { slidesPerView: 3.2 },
          0: { slidesPerView: 1.2 },
        }
      });
    }
  }

  // ScrollTrigger animations for home page sections
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({
      scrollTrigger: {
        trigger: ".text-carousel",
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    })
      .from(".text-carousel .carousel-texts", {
        opacity: 0,
        x: -500,
        duration: 3,
        stagger: 0.5,
        ease: "power3.out"
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".deal-of-the-day .deal-container",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })
      .from(".deal-of-the-day .deal-text", {
        x: -200,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      })
      .from(".deal-of-the-day .deal-image", {
        x: 200,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }, "<");

    gsap.timeline({
      scrollTrigger: {
        trigger: ".shop-category",
        start: "top 80%",
        end: "bottom 40%",
        toggleActions: "play none none reverse"
      }
    })
      .from(".shop-category", {
        opacity: 0,
        y: -80,
        stagger: 0.2,
        duration: 0.7,
        ease: "power2.out"
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".shop-category .category-card .overlay",
        start: "top 100%",
        end: "bottom 50%",
        toggleActions: "play none none reverse",
        scrub: 2
      }
    })
      .from(".shop-category .category-card .overlay > *", {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 2,
        ease: "power3.out"
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".new-arrivals",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })
      .from(".new-arrivals .products-grid", {
        opacity: 0,
        x: -60,
        duration: 2,
        ease: "power3.out"
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".deal-banner",
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    })
      .from([
        ".deal-banner .deal-grid > *:first-child",
        ".deal-banner .deal-grid > *:last-child"
      ], {
        opacity: 0,
        x: (i) => i === 0 ? -100 : 100,
        duration: 2,
        ease: "power3.out"
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".best-selling",
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    })
      .from(".best-selling h2, .best-selling p, .best-selling .tabs, .best-selling .products-grid", {
        opacity: 0,
        y: 60,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out"
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".promo-banner",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })
      .from(".promo-banner .promo-grid > *", {
        opacity: 0,
        y: 60,
        duration: 2,
        stagger: 0.4,
        ease: "power3.out"
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".promo-section",
        start: "top 90%",
        end: "bottom 30%",
        toggleActions: "play none none reverse",
        scrub: 1
      }
    })
      .from(".promo-section h2", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out"
      })
      .from(".promo-section .promo-grid .promo-card", {
        opacity: 0,
        y: 100,
        duration: 3,
        stagger: 1,
        ease: "power3.out"
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".reviews-section",
        start: "top 95%",
        end: "bottom 80%",
        toggleActions: "play none none reverse",
        scrub: 2
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
        y: 60,
        duration: 0.7,
        ease: "power3.out"
      })
      .from(".reviews-section .reviews-carousel .review-card", {
        opacity: 0,
        x: -100,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.2
      });

    gsap.timeline({
      scrollTrigger: {
        trigger: "footer",
        start: "top 90%",
        end: "bottom 50%",
        toggleActions: "play none none reverse"
      }
    })
      .from("footer", { y: 50, opacity: 0, duration: 0.5, ease: "power3.out" })
      .from("footer .info-box", { y: 50, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.2 });
  }
  // --- End Home page GSAP ---
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
    <button type="button" class="qty-dec">-</button>
    <input type="number" min="1" value="${qty}" class="qty-input" style="width:40px;text-align:center;" />
    <button type="button" class="qty-inc">+</button>
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
    <button type="button" class="qty-dec">-</button>
    <input type="number" min="1" value="${qty}" class="qty-input" style="width:40px;text-align:center;" />
    <button type="button" class="qty-inc">+</button>
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
  if (!window.gsap || !window.MutationObserver) return;
  const animateCards = (container) => {
    const cards = container.querySelectorAll('.product-card');
    if (cards.length) {
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out"
        }
      );
    }
  };
  // Observe all .product-grid containers
  const observeGrids = () => {
    document.querySelectorAll('.product-grid').forEach(grid => {
      // Initial animation
      animateCards(grid);
      // Observe for new product cards
      const observer = new MutationObserver(() => {
        animateCards(grid);
      });
      observer.observe(grid, { childList: true });
    });
  };
  // Run on DOMContentLoaded and whenever new .product-grid appears
  document.addEventListener('DOMContentLoaded', observeGrids);
  // Also observe for new .product-grid containers (e.g., SPA navigation)
  const bodyObserver = new MutationObserver(observeGrids);
  bodyObserver.observe(document.body, { childList: true, subtree: true });
})();

/**
 * Extract selected filters from a filter sidebar container.
 * @param {HTMLElement} container - The sidebar/filter container.
 * @returns {Object} filters
 */
function getSelectedFiltersFromContainer(container) {
  if (!container) return {};
  // Category
  const catChecks = container.querySelectorAll('.filter-group h4, .filter-section h4');
  let categories = [];
  let sizes = [];
  let gender = [];
  let minPrice = 100, maxPrice = 10000, minDiscount = 0;
  // Gender (works for wishlist page filter-group)
  const genderGroup = Array.from(container.querySelectorAll('.filter-group')).find(
    g => g.querySelector('h4') && /gender/i.test(g.querySelector('h4').textContent)
  );
  if (genderGroup) {
    gender = Array.from(genderGroup.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.parentElement.textContent.trim().toLowerCase());
  }
  // Category
  const catInputs = Array.from(container.querySelectorAll('label input[type="checkbox"]')).filter(cb => {
    const label = cb.parentElement;
    return /tshirts|jeans|jackets|dresses|skirts|ethnic/i.test(label.textContent);
  });
  categories = catInputs.filter(cb => cb.checked).map(cb => cb.parentElement.textContent.trim().toLowerCase());
  // Sizes
  const sizeInputs = Array.from(container.querySelectorAll('label input[type="checkbox"]')).filter(cb => {
    const label = cb.parentElement;
    return /xs|s|m|l|xl|xxl/i.test(label.textContent);
  });
  sizes = sizeInputs.filter(cb => cb.checked).map(cb => cb.parentElement.textContent.trim());
  // Price
  const priceRange = container.querySelector('input[type="range"]');
  if (priceRange) minPrice = parseInt(priceRange.value) || 100;
  // Discount
  const discountInputs = Array.from(container.querySelectorAll('label input[type="checkbox"]')).filter(cb => {
    const label = cb.parentElement;
    return /%/.test(label.textContent);
  });
  discountInputs.forEach(cb => {
    if (cb.checked) {
      const txt = cb.parentElement.textContent;
      if (txt.includes('50%')) minDiscount = Math.max(minDiscount, 50);
      else if (txt.includes('30%')) minDiscount = Math.max(minDiscount, 30);
      else if (txt.includes('10%')) minDiscount = Math.max(minDiscount, 10);
    }
  });
  return { categories, sizes, gender, minPrice, maxPrice, minDiscount };
}

/**
 * Filter and render products in a grid container with filters, sort, and pagination.
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
      if (!filters.gender.some(g => (g === 'for him' && p.gender === 'Men') || (g === 'for her' && p.gender === 'Women'))) return false;
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
    <button type="button" class="qty-dec">-</button>
    <input type="number" min="1" value="${cartItem.qty}" class="qty-input" style="width:40px;text-align:center;" />
    <button type="button" class="qty-inc">+</button>
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
