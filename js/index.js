document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (document.querySelector('.hero-swiper')) {
    const progressCircle = document.querySelector('.autoplay-progress svg circle');
    const progressContent = document.querySelector('.autoplay-progress span');

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
  }

  gsap.timeline({
    scrollTrigger: {
      trigger: ".text-carousel",
      start: "top 90%",
      toggleActions: "play none none reverse"
    }
  })
    .from(".text-carousel .carousel-texts", {
      x: -500,
      duration: 3,
      stagger: 0.5,
      ease: "power4.out"
    });

  gsap.timeline({
    scrollTrigger: {
      trigger: ".deal-of-the-day .deal-container",
      start: "top 80%", 
      toggleActions: "play none none reverse",
      once: true
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
      toggleActions: "play none none reverse",
      once: true
    }
  })
    .from(".shop-category .category-card", {
      opacity: 0,
      y: 100,
      scale: 0.5,
    })
    .to(".shop-category .category-card", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out"
    })
    .from(".shop-category .category-card > *", {
      opacity: 0,
      y: 200,
    })
    .to(".shop-category .category-card > *", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.8,
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
    .from(".best-selling h2, .best-selling p, .best-selling .tabs", {
      opacity: 0,
      scale: 0.4,
      y: -200,
      duration: 0.7,
      stagger: 0.15,
      ease: "power2.out"
    });

  gsap.timeline({
    scrollTrigger: {
      trigger: ".promo-banner",
      start: "top 90%",
      toggleActions: "play none none reverse"
    }
  })
    .from(".promo-banner .promo-grid > *", {
      opacity: 0,
      y: 60,
      duration: 2,
      stagger: 0.4,
      ease: "power3.out"
    })
   
   
    .from(".promo-banner .promo-image", {
      x: 90,
      duration: 2,
      ease: "power3.out"
    }, "<+0.1");

  gsap.timeline({
    scrollTrigger: {
      trigger: ".promo-section",
      end: "bottom 85%",
      toggleActions: "play none none reverse",
      once: true
    }
  })
    .from(".promo-section h2", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      
      ease: "power3.out"
    })
    .from(".promo-section .promo-grid .promo-card", {
      opacity: 0,
      scale: 0.5,
      x:-100,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.inOut"
    });
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
        end: "bottom 90%",
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
        end: "bottom 90%",
        toggleActions: "play none none reverse"
      }
    });
  }

  gsap.utils.toArray('.deals-banner:not(.newarrival-banner--him):not(.newarrival-banner--her)').forEach(banner => {
    gsap.from(banner, {
      x: -200,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: banner,
        end: "bottom 90%",
        toggleActions: "play none none reverse"
      }
    });
  });

  if (window.animateProductCards) window.animateProductCards();

  function animateMainSliderImages() {
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
  }

  (function patchMainSliderSwiper() {
    if (!window.Swiper) return;
    const origSwiper = window.Swiper;
    window.Swiper = function SwiperPatched(sel, opts) {
      if (
        sel === '.main-slider.swiper' &&
        opts && opts.on
      ) {
        const origInit = opts.on.init;
        const origSlideChange = opts.on.slideChangeTransitionStart;
        opts.on.init = function () {
          setTimeout(animateMainSliderImages, 10);
          if (origInit) origInit.apply(this, arguments);
        };
        opts.on.slideChangeTransitionStart = function () {
          setTimeout(animateMainSliderImages, 10);
          if (origSlideChange) origSlideChange.apply(this, arguments);
        };
      }
      return new origSwiper(sel, opts);
    };
    Object.assign(window.Swiper, origSwiper);
  })();

  document.querySelectorAll('.countdown').forEach(countdown => {
    const times = countdown.querySelectorAll('.time');
    if (times.length === 4) {
      let d = parseInt(times[0].textContent, 10) || 7;
      let h = parseInt(times[1].textContent, 10) || 0;
      let m = parseInt(times[2].textContent, 10) || 0;
      let s = parseInt(times[3].textContent, 10) || 0;
      startCountdown(countdown, d, h, m, s);
    }
    else if (times.length === 3) {
      let h = parseInt(times[0].textContent, 10) || 12;
      let m = parseInt(times[1].textContent, 10) || 0;
      let s = parseInt(times[2].textContent, 10) || 0;
      startCountdownHours(countdown, h, m, s);
    }
  });

  function startCountdown(container, days, hours, minutes, seconds) {
    function pad(n) { return n < 10 ? '0' + n : n; }
    let total = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    const timeEls = container.querySelectorAll('.time');
    function update() {
      let d = Math.floor(total / 86400);
      let h = Math.floor((total % 86400) / 3600);
      let m = Math.floor((total % 3600) / 60);
      let s = total % 60;
      if (timeEls.length === 4) {
        timeEls[0].textContent = pad(d);
        timeEls[1].textContent = pad(h);
        timeEls[2].textContent = pad(m);
        timeEls[3].textContent = pad(s);
      }
      if (total > 0) {
        total--;
        container._timer = setTimeout(update, 1000);
      } else {
        showCountdownEnd(container);
      }
    }
    update();
  }

  function startCountdownHours(container, hours, minutes, seconds) {
    function pad(n) { return n < 10 ? '0' + n : n; }
    let total = hours * 3600 + minutes * 60 + seconds;
    const timeEls = container.querySelectorAll('.time');
    function update() {
      let h = Math.floor(total / 3600);
      let m = Math.floor((total % 3600) / 60);
      let s = total % 60;
      if (timeEls.length === 3) {
        timeEls[0].textContent = pad(h);
        timeEls[1].textContent = pad(m);
        timeEls[2].textContent = pad(s);
      }
      if (total > 0) {
        total--;
        container._timer = setTimeout(update, 1000);
      } else {
        showCountdownEnd(container);
      }
    }
    update();
  }

  function showCountdownEnd(container) {
    container.innerHTML = `<span class="countdown-ended" style="color:#e74c3c;font-weight:bold;font-size:1.2em;">Sales End!</span>`;
  }
});

function startCountdown(container, days, hours, minutes, seconds) {
  function pad(n) { return n < 10 ? '0' + n : n; }
  let total = days * 86400 + hours * 3600 + minutes * 60 + seconds;
  const timeEls = container.querySelectorAll('.time');
  function update() {
    let d = Math.floor(total / 86400);
    let h = Math.floor((total % 86400) / 3600);
    let m = Math.floor((total % 3600) / 60);
    let s = total % 60;
    if (timeEls.length === 4) {
      timeEls[0].textContent = pad(d);
      timeEls[1].textContent = pad(h);
      timeEls[2].textContent = pad(m);
      timeEls[3].textContent = pad(s);
    }
    if (total > 0) {
      total--;
      container._timer = setTimeout(update, 1000);
    } else {
      showCountdownEnd(container);
    }
  }
  update();
}

function startCountdownHours(container, hours, minutes, seconds) {
  function pad(n) { return n < 10 ? '0' + n : n; }
  let total = hours * 3600 + minutes * 60 + seconds;
  const timeEls = container.querySelectorAll('.time');
  function update() {
    let h = Math.floor(total / 3600);
    let m = Math.floor((total % 3600) / 60);
    let s = total % 60;
    if (timeEls.length === 3) {
      timeEls[0].textContent = pad(h);
      timeEls[1].textContent = pad(m);
      timeEls[2].textContent = pad(s);
    }
    if (total > 0) {
      total--;
      container._timer = setTimeout(update, 1000);
    } else {
      showCountdownEnd(container);
    }
  }
  update();
}

function showCountdownEnd(container) {
  container.innerHTML = `<span class="countdown-ended" style="color:#e74c3c;font-weight:bold;font-size:1.2em;">Sales End!</span>`;
}

window.addEventListener('load', function() {
  if (window.ScrollTrigger) {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }
});

if (window.lenis && window.ScrollTrigger) {
  window.lenis.on('scroll', ScrollTrigger.update);
}