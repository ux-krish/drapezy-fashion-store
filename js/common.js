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
