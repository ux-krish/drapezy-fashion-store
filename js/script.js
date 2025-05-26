
  (function () {
  let currentSlide = 0;
      let bannerCarouselSlide = document.querySelectorAll('.carousel-slide');
      let bannerCarouselDot = document.querySelectorAll('.dot');
      function showSlide(index) {
        bannerCarouselSlide.forEach((slide, i) => {
          slide.style.display = i === index ? 'flex' : 'none';
          bannerCarouselDot[i].classList.toggle('active', i === index);
        });
        currentSlide = index;
      }
      function goToSlide(index) {
        showSlide(index);
      }
      setInterval(() => {
        let nextIndex = (currentSlide + 1) % bannerCarouselSlide.length;
        showSlide(nextIndex);
      }, 5000);
      showSlide(0);
  })();
  


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


  lenis.on('scroll', ScrollTrigger.update);
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length ? lenis.scrollTo(value) : lenis.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
  pinType: document.body.style.transform ? 'transform' : 'fixed'
});
  // gsap.timeline({
  //   scrollTrigger: {
  //     trigger: "nav, header",
  //     start: "top top",
      
  //   }
  // })
  //   .from("nav,header", {
  //     opacity: 0,
  //     y: -100,
  //     duration: 1,
  //     stagger: 0.2,
  //     ease: "power3.out"
  //   })
    
    

  gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-carousel",
      start: "top 80%",
      toggleActions: "play none none reverse",
      scrub:2
      
    }
  })
    .from(".hero-carousel .carousel-slide", {
      opacity: 0,
      y: 0,
      duration: 4,
      stagger: 10,
      ease: "power3.out"
    });

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
      stagger: 7,
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
    })
    gsap.timeline({
    scrollTrigger: {
      trigger: ".shop-category .category-card .overlay",
      start: "top 100%",
      end: "bottom 50%",
      toggleActions: "play none none reverse",
      scrub:2
      
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
    .from(" .new-arrivals .products-grid",{
      opacity: 0,
      x: -60,
      duration:2,
      ease: "power3.out"
    })
    

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
      end : "botton 30%",
      toggleActions: "play none none reverse",
      scrub:1
      
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
      scrub:2
      
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



