function showTab(tabId, group) {
  document.querySelectorAll(`.products-grid[data-group="${group}"]`).forEach(el => el.classList.add('hidden'));
  document.querySelector(`#${tabId}`).classList.remove('hidden');
  document.querySelectorAll(`.tab[data-group="${group}"]`).forEach(tab => tab.classList.remove('active'));
  document.querySelector(`[onclick="showTab('${tabId}', '${group}')"]`).classList.add('active');
}


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



