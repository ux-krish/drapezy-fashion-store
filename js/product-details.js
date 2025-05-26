function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function loadProductDetail() {
  const id = getQueryParam('id');
  if (!id) return;
  fetch('./products.json')
    .then(res => res.json())
    .then(data => {
      const prod = data.products.find(p => p.id === id);
      if (prod) showProduct(prod);
    });
}

function showProduct(product) {
  // Gallery
  const mainSlider = document.querySelector('.main-slider .swiper-wrapper');
  const thumbSlider = document.querySelector('.thumbnail-slider .swiper-wrapper');
  if (mainSlider && thumbSlider) {
    mainSlider.innerHTML = '';
    thumbSlider.innerHTML = '';
    const images = (product.thumbnails && product.thumbnails.length > 0)
      ? product.thumbnails
      : [product.image];
    images.forEach(url => {
      mainSlider.innerHTML += `<div class="swiper-slide"><img src="${url}" alt="${product.title}" /></div>`;
      thumbSlider.innerHTML += `<div class="swiper-slide"><img src="${url}" /></div>`;
    });
  }

  // Swiper re-init
  if (window.thumbSwiper && typeof window.thumbSwiper.destroy === 'function') window.thumbSwiper.destroy(true, true);
  if (window.mainSwiper && typeof window.mainSwiper.destroy === 'function') window.mainSwiper.destroy(true, true);

  window.thumbSwiper = new Swiper('.thumbnail-slider.swiper', {
    slidesPerView: 5,
    spaceBetween: 24,
    watchSlidesProgress: true,
    loop: true,
    direction: "vertical",
  });

  window.mainSwiper = new Swiper('.main-slider.swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    effect: "fade",
    thumbs: {
      swiper: window.thumbSwiper,
    },
  });

  // Info
  document.querySelector('.product-info .tag').textContent = product.gender == "Women" ? 'For Her' : 'For Him';
  document.querySelector('.product-info h2').textContent = product.title || '';
  document.querySelector('.product-info .ratings span').innerHTML = `${product.rating || ''} <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z" fill="#FABB05" /></svg>`;
  document.querySelector('.product-info .ratings a').textContent = `${product.ratings_count || 0} Ratings`;
  document.querySelector('.product-info .price strong').textContent = `₹${product.price ? product.price.toLocaleString() : ''}`;
  document.querySelector('.product-info .price del').textContent = product.original_price ? `₹${product.original_price.toLocaleString()}` : '';
  document.querySelector('.product-info .price .discount').textContent = product.discount ? `${product.discount} OFF` : '';
  document.querySelector('.product-info .desc').textContent = product.description || '';

  // Sizes
  const sizesDiv = document.querySelector('.product-info .sizes');
  if (sizesDiv && product.sizes) {
    sizesDiv.innerHTML = '';
    product.sizes.forEach(size => {
      sizesDiv.innerHTML += `
        <label>
          <input type="radio" name="size" value="${size}" ${size === product.available_size ? 'checked' : ''}>
          ${size}
        </label>
      `;
    });
  }

  // Category
  document.querySelector('.product-info .category').innerHTML =
    `<strong>Category:</strong> ${product.gender || ''}${product.category ? ', ' + product.category : ''}${product.color ? ', ' + product.color : ''}`;

  // Features
  const featuresUl = document.querySelector('.product-info .features');
  if (featuresUl && product.features && product.features.length) {
    featuresUl.innerHTML = '';
    product.features.forEach(f => {
      featuresUl.innerHTML += `<li>${f}</li>`;
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadProductDetail();

  // Quantity increment/decrement logic
  const qtyInput = document.getElementById("qty");
  const incBtn = document.getElementById("inc");
  const decBtn = document.getElementById("dec");
  if (qtyInput && incBtn && decBtn) {
    incBtn.onclick = () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    };
    decBtn.onclick = () => {
      if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    };
  }
});