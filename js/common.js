const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', function () {
  if (window.gsap) {
    requestAnimationFrame(() => {
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
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, delay: 0.12, ease: "power2.out" } 
          );
        }
      }
      // Animate nav/main-header
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

      ///Product page animation
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
      }, 100); // Delay to ensure Swiper slides are in DOM

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
    });
  }
});
