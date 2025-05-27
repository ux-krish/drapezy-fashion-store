// Autoplay progress elements (if you use them)
const progressCircle = document.querySelector('.autoplay-progress svg circle');
const progressContent = document.querySelector('.autoplay-progress span');

const heroSwiper = new Swiper('.hero-swiper', {
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
        const content = currentSlide.querySelector('.container');
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
        const content = currentSlide.querySelector('.container');
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


function showTab(tabId, group) {
  document.querySelectorAll(`.products-grid[data-group="${group}"]`).forEach(el => el.classList.add('hidden'));
  document.querySelector(`#${tabId}`).classList.remove('hidden');
  document.querySelectorAll(`.tab[data-group="${group}"]`).forEach(tab => tab.classList.remove('active'));
  document.querySelector(`[onclick="showTab('${tabId}', '${group}')"]`).classList.add('active');
}


const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});




(function () {
  if (!(window.gsap && window.ScrollTrigger)) return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero carousel animation (fade in the whole swiper on scroll)
  // gsap.timeline({
  //   scrollTrigger: {
  //     trigger: ".hero-carousel",
  //     start: "top 90%",
  //     toggleActions: "play none none reverse",
  //     scrub: 2
  //   }
  // })
  //   .from(".hero-carousel .hero-swiper", {
  //     opacity: 0,
  //     y: -60,
  //     duration: 1.2,
  //     ease: "power3.out"
  //   });

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
})();






const reviewSwiper = new Swiper('.reviewSwiper', {
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