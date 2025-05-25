




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