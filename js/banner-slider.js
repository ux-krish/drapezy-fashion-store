

    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'flex' : 'none';
        dots[i].classList.toggle('active', i === index);
      });
      currentSlide = index;
    }
    function goToSlide(index) {
      showSlide(index);
    }
    setInterval(() => {
      let nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    }, 5000);
    showSlide(0);




     const swiper = new Swiper('.swiper', {
  autoHeight: true,
    slidesPerView: 3,
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
      1024: { slidesPerView: 3.2 },
      768: { slidesPerView: 2.2 },
      0: { slidesPerView: 1.2 },
    }
  });