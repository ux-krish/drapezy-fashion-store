// Render 3 products in the deals-products section using showProducts from api.js
document.addEventListener('DOMContentLoaded', function () {
  if (typeof showProducts === 'function') {
    showProducts({
      selector: '.deals-products',
      filterFn: () => true,
      count: 3
    });
    // Auto-refresh deals-products every 3 minutes
    setInterval(() => {
      showProducts({
        selector: '.deals-products',
        filterFn: () => true,
        count: 3
      });
    }, 3 * 60 * 1000);
  }

  // GSAP Animations for sections and elements
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Animate each section
    gsap.utils.toArray('section').forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Animate banners in section-newarrival-deals from opposite X sides
    const himBanner = document.querySelector('.section-newarrival-deals .newarrival-banner--him');
    const herBanner = document.querySelector('.section-newarrival-deals .newarrival-banner--her');
    if (himBanner) {
      gsap.from(himBanner, {
        opacity: 0,
        x: -100,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: himBanner,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    }
    if (herBanner) {
      gsap.from(herBanner, {
        opacity: 0,
        x: 100,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: herBanner,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    }

    // Animate other banners (deals-banner, but not newarrival-banner)
    gsap.utils.toArray('.deals-banner:not(.newarrival-banner--him):not(.newarrival-banner--her)').forEach(banner => {
      gsap.from(banner, {
        
        x: -200,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: banner,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Animate product grids (products-grid and deals-products)
    gsap.utils.toArray('.products-grid, .deals-products').forEach(grid => {
      gsap.from(grid, {
        opacity: 0,
        x: 200,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Animate product cards inside grids (after products are rendered)
    function animateProductCards() {
      gsap.utils.toArray('.products-grid .product-card, .deals-products .product-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          delay: i * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });
      });
    }

    // Animate review section
    gsap.utils.toArray('.reviews-section').forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Animate headings
    gsap.utils.toArray('h2, h3').forEach(heading => {
      gsap.from(heading, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 90%",
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
});