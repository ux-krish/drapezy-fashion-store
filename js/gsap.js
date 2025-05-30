// Move all GSAP animation logic here

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    // Helper for shoom animation (scale+fade+up or left)
    function shoomAnim(target, childSelector, opts = {}) {
      const {
        stagger = 0.08,
        y = 40,
        x = null,
        scale = 0.92,
        triggerStart = "top 85%",
        once = false
      } = opts;
      const children = childSelector ? target.querySelectorAll(childSelector) : target.children;
      if (!children.length) return;
      // Remove any previous ScrollTriggers for this target to ensure re-animation works
      gsap.utils.toArray(children).forEach(child => {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === target || trigger.trigger === child) trigger.kill();
        });
      });
      const animProps = {
        opacity: 0,
        stagger,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: target,
          start: triggerStart,
          once,
          toggleActions: "play none none reset"
        }
      };
      if (x !== null) animProps.x = x;
      else animProps.y = y;
      animProps.scale = scale;
      gsap.from(children, animProps);
    }

    // Animate product grids (shop, best-selling, new-arrivals, etc.)
    document.querySelectorAll('.products-grid').forEach(grid => {
      shoomAnim(grid, ':scope > *');
    });

    // Animate best-selling products grid with stagger
    document.querySelectorAll('.best-selling .products-grid').forEach(grid => {
      shoomAnim(grid, ':scope > *', { stagger: 0.15 });
    });

    // Animate promo-section cards (from top 50%)
    document.querySelectorAll('.promo-section .promo-card').forEach(card => {
      shoomAnim(card, null, { y: 60, scale: 0.90, stagger: 0, triggerStart: "top 50%" });
    });

    // Animate promo-banner grid
    document.querySelectorAll('.promo-banner .promo-grid').forEach(grid => {
      shoomAnim(grid, ':scope > *', { y: 60, scale: 0.90, stagger: 0.15 });
    });

    // Animate review carousel (static grid, e.g. product.html)
    document.querySelectorAll('.reviews-carousel .swiper-wrapper, .review-grid').forEach(wrapper => {
      shoomAnim(wrapper, ':scope > *', { x: -60, scale: 0.92, stagger: 0.12 });
    });
  });
}

// Animate reviewSwiper slides after they are rendered (from API/localStorage/anywhere)
function animateReviewSwiperSlides() {
  const slides = document.querySelectorAll('.reviewSwiper .swiper-slide');
  if (!slides.length || typeof gsap === "undefined") return;
  slides.forEach((slide, i) => {
    // Remove previous triggers for re-animation
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === slide) trigger.kill();
      });
    }
    gsap.fromTo(
      slide,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        delay: i * 0.12,
        ease: "power3.out",
        overwrite: "auto"
      }
    );
  });
}

// Listen for a custom event after reviews are rendered (from API/localStorage)
document.addEventListener('reviewsRendered', animateReviewSwiperSlides);

// Optionally, animate on Swiper slide change as well
if (window.reviewSwiperInstance && window.reviewSwiperInstance.on) {
  window.reviewSwiperInstance.on('slideChangeTransitionStart', function () {
    animateReviewSwiperSlides();
  });
}
