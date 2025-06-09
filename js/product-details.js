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

let selectedSize = null;
let selectedQty = 1;

function showProduct(product) {
  const mainSlider = document.querySelector('.main-slider .swiper-wrapper');
  const thumbSlider = document.querySelector('.thumbnail-slider .swiper-wrapper');
  if (mainSlider && thumbSlider) {
    mainSlider.innerHTML = '';
    thumbSlider.innerHTML = '';
    const images = Array.isArray(product.thumbs) && product.thumbs.length > 0
      ? product.thumbs
      : [product.image];
    images.forEach(url => {
      mainSlider.innerHTML += `<div class="swiper-slide"><img src="${url}" alt="${product.title}" /></div>`;
      thumbSlider.innerHTML += `<div class="swiper-slide"><img src="${url}" /></div>`;
    });
  }

  if (window.thumbSwiper && typeof window.thumbSwiper.destroy === 'function') window.thumbSwiper.destroy(true, true);
  if (window.mainSwiper && typeof window.mainSwiper.destroy === 'function') window.mainSwiper.destroy(true, true);

  window.thumbSwiper = new Swiper('.thumbnail-slider.swiper', {
    slidesPerView: 4,
    spaceBetween: 55,
    centeredSlides: true,
    centeredSlidesBounds: true,
    watchOverflow: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,    
    direction: "vertical",
    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  });

  window.mainSwiper = new Swiper('.main-slider.swiper', {
    watchOverflow: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    preventInteractionOnTransition: true,
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    effect: 'fade',
      fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    thumbs: {
      swiper: window.thumbSwiper,
    },
  });

let isSyncingSwipers = false;

window.mainSwiper.on('slideChangeTransitionStart', function() {
  if (isSyncingSwipers) return;
  isSyncingSwipers = true;
  window.thumbSwiper.slideTo(mainSwiper.activeIndex);
  isSyncingSwipers = false;
});

window.thumbSwiper.on('transitionStart', function(){
  if (isSyncingSwipers) return;
  isSyncingSwipers = true;
  window.mainSwiper.slideTo(thumbSwiper.activeIndex);
  isSyncingSwipers = false;
});

  document.querySelector('.product-info .tag').textContent = product.gender == "Women" ? 'For Her' : 'For Him';
  document.querySelector('.product-info h2').textContent = product.title || '';
  document.querySelector('.product-info .ratings span').innerHTML = `${product.rating || ''} <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z" fill="#FABB05" /></svg>`;
  document.querySelector('.product-info .ratings a').textContent = `${product.ratings_count || 0} Ratings`;
  document.querySelector('.product-info .price strong').textContent = `₹${product.price ? product.price.toLocaleString() : ''}`;
  document.querySelector('.product-info .price del').textContent = product.original_price ? `₹${product.original_price.toLocaleString()}` : '';
  document.querySelector('.product-info .price .discount').textContent = product.discount ? `${product.discount} OFF` : '';
  document.querySelector('.product-info .desc').textContent = product.description || '';

  const sizesDiv = document.querySelector('.product-info .sizes');
  if (sizesDiv && product.sizes && window.renderProductSizes) {
    window.renderProductSizes(
      sizesDiv,
      product.sizes,
      product.available_size,
      function(selected) {
        selectedSize = selected;
        sizesDiv.querySelectorAll('label').forEach(label => {
          if (label.querySelector('input[type="radio"]')?.value === selected) {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        });
        updateQtyFromCart(product.id, selected);
      },
      'size'
    );
    const radios = sizesDiv.querySelectorAll('input[type="radio"]');
    let checked = false;
    radios.forEach(radio => {
      if (radio.checked) {
        checked = true;
        if (radio.parentElement) radio.parentElement.classList.add('active');
      }
    });
    if (!checked && radios.length) {
      radios[0].checked = true;
      if (radios[0].parentElement) radios[0].parentElement.classList.add('active');
      selectedSize = radios[0].value;
    }
    radios.forEach(radio => {
      radio.addEventListener('change', function() {
        radios.forEach(r => r.parentElement && r.parentElement.classList.remove('active'));
        if (this.parentElement) this.parentElement.classList.add('active');
        selectedSize = this.value;
        updateQtyFromCart(product.id, selectedSize);
      });
    });
  }

  const qtyDiv = document.querySelector('.product-info .quantity');
  if (qtyDiv && window.renderQuantitySelector) {
    let initialQty = 1;
    try {
      const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      const found = cart.find(item => item.id === product.id && item.size === selectedSize);
      if (found && found.qty) initialQty = found.qty;
    } catch {}
    window.renderQuantitySelector(qtyDiv, initialQty, function(qty) {
      selectedQty = qty;
    });
    selectedQty = initialQty;
  }

  function updateQtyFromCart(productId, size) {
    const qtyDiv = document.querySelector('.product-info .quantity');
    if (!qtyDiv || !window.renderQuantitySelector) return;
    let qty = 1;
    try {
      const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      const found = cart.find(item => item.id === productId && item.size === size);
      if (found && found.qty) qty = found.qty;
    } catch {}
    window.renderQuantitySelector(qtyDiv, qty, function(q) {
      selectedQty = q;
    });
    selectedQty = qty;
  }

  const addToCartBtn = document.querySelector('.product-info .actions .btn.dark');
  if (addToCartBtn) {
    addToCartBtn.onclick = function(e) {
      e.preventDefault();
      if (!selectedSize) {
        alert('Please select a size.');
        return;
      }
      if (!selectedQty || selectedQty < 1) {
        alert('Please select a valid quantity.');
        return;
      }
      const cleanSize = (selectedSize || '').trim();
      if (!cleanSize || cleanSize === 'XXS') return;
      const cartItem = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        original_price: product.original_price,
        discount: product.discount,
        size: cleanSize,
        qty: selectedQty,
        total: product.price * selectedQty
      };
      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      const existing = cart.find(
        item => item.id === cartItem.id && item.size === cartItem.size
      );
      if (existing) {
        existing.qty += cartItem.qty;
        existing.total = existing.price * existing.qty;
      } else {
        cart.push(cartItem);
      }
      cart = cart.reduce((acc, item) => {
        const found = acc.find(i => i.id === item.id && i.size === item.size);
        if (found) {
          found.qty += item.qty;
          found.total = found.price * found.qty;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      setTimeout(() => { window.location.href = 'cart.html'; }, 600);
    };
  }

  const buyNowBtn = document.querySelector('.product-info .actions .buy-now');
  if (buyNowBtn) {
    buyNowBtn.onclick = function(e) {
      e.preventDefault();
      if (!selectedSize) {
        alert('Please select a size.');
        return;
      }
      if (!selectedQty || selectedQty < 1) {
        alert('Please select a valid quantity.');
        return;
      }
      const cleanSize = (selectedSize || '').trim();
      if (!cleanSize || cleanSize === 'XXS') return;
      const cartItem = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        original_price: product.original_price,
        discount: product.discount,
        size: cleanSize,
        qty: selectedQty,
        total: product.price * selectedQty
      };
      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      cart = cart.filter(item =>
        !(item.id === cartItem.id &&
          (item.size || '').trim() === '' 
        ) &&
        !(item.id === cartItem.id &&
          (item.size || '').replace(/\s+/g, '') === cleanSize.replace(/\s+/g, '') &&
          (!item.price || !item.original_price || !item.title || !item.image) 
        )
      );
      let foundIdx = cart.findIndex(
        item => item.id === cartItem.id && item.size === cartItem.size
      );
      if (foundIdx !== -1) {
        cart[foundIdx].qty += cartItem.qty;
        cart[foundIdx].total = cart[foundIdx].price * cart[foundIdx].qty;
      } else {
        cart.push(cartItem);
      }
      cart = cart.reduce((acc, item) => {
        const found = acc.find(i => i.id === item.id && i.size === item.size);
        if (found && found !== item) {
          found.qty += item.qty;
          found.total = found.price * found.qty;
        } else if (!found) {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      localStorage.setItem('cartProducts', JSON.stringify(cart));

      const items = cart
        .filter(item => !!item.size && item.size.trim() && item.size.trim() !== 'XXS')
        .map(item => ({
          ...item,
          subtotal: item.price * item.qty
        }));
      const subtotal = items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
      const totalDiscount = items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
      const platformFees = 5;
      const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0) + platformFees;
      const checkoutSummary = {
        items,
        subtotal,
        totalDiscount,
        platformFees,
        total
      };
      localStorage.setItem('checkoutSummary', JSON.stringify(checkoutSummary));
      window.location.href = 'checkout.html';
    };
  }

  document.querySelector('.product-info .category').innerHTML =
    `<strong>Category:</strong> ${product.gender || ''}${product.category ? ', ' + product.category : ''}${product.color ? ', ' + product.color : ''}`;

  const featuresUl = document.querySelector('.product-info .features');
  if (featuresUl && product.features && product.features.length) {
    featuresUl.innerHTML = '';
    product.features.forEach(f => {
      featuresUl.innerHTML += `<li>${f}</li>`;
    });
  }

  const wishlistBtn = document.querySelector('.product-info .actions .btn.light');
  if (wishlistBtn) {
    let isWishlisted = false;
    if (typeof isInWishlist === 'function') {
      isWishlisted = isInWishlist(product.id);
    } else {
      let key = 'wishlistProducts';
      let arr = JSON.parse(localStorage.getItem(key) || '[]');
      isWishlisted = arr.includes(product.id);
    }
    if (isWishlisted) {
      wishlistBtn.classList.add('wishlisted');
      const svg = wishlistBtn.querySelector('svg path');
      if (svg) svg.setAttribute('fill', '#e74c3c');
    } else {
      wishlistBtn.classList.remove('wishlisted');
      const svg = wishlistBtn.querySelector('svg path');
      if (svg) svg.setAttribute('fill', 'transparent');
    }

    wishlistBtn.onclick = function(e) {
      e.preventDefault();
      let wishlistedNow = false;
      if (typeof isInWishlist === 'function' && typeof addToWishlist === 'function' && typeof removeFromWishlist === 'function') {
        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
          wishlistedNow = false;
        } else {
          addToWishlist(product.id);
          wishlistedNow = true;
        }
      } else {
        let key = 'wishlistProducts';
        let arr = JSON.parse(localStorage.getItem(key) || '[]');
        if (arr.includes(product.id)) {
          arr = arr.filter(id => id !== product.id);
          wishlistedNow = false;
        } else {
          arr.push(product.id);
          wishlistedNow = true;
        }
        localStorage.setItem(key, JSON.stringify(arr));
      }
      if (wishlistedNow) {
        wishlistBtn.classList.add('wishlisted');
        const svg = wishlistBtn.querySelector('svg path');
        if (svg) svg.setAttribute('fill', '#e74c3c');
      } else {
        wishlistBtn.classList.remove('wishlisted');
        const svg = wishlistBtn.querySelector('svg path');
        if (svg) svg.setAttribute('fill', 'transparent');
      }
    };
  }

  
  if (window.rememberProductPage) window.rememberProductPage();

  if (window.renderProductReviews) {
    window.renderProductReviews(product.id, '.review-summary__grid');
  }

  const relatedGrid = document.querySelector('#related-products');
  if (relatedGrid) {
    fetch('./products.json')
      .then(res => res.json())
      .then(data => {
        const products = data.products || [];
        let relatedProducts = [];
        if (Array.isArray(product.related) && product.related.length > 0) {
          relatedProducts = product.related
            .map(relId => products.find(p => p.id === relId))
            .filter(Boolean)
            .slice(0, 4);
        }
        if (relatedProducts.length < 4) {
          const alreadyIds = new Set([product.id, ...relatedProducts.map(p => p.id)]);
          const more = products.filter(
            p => p.category === product.category && !alreadyIds.has(p.id)
          );
          relatedProducts = relatedProducts.concat(more.slice(0, 4 - relatedProducts.length));
        }
        relatedGrid.innerHTML = '';
        relatedProducts.forEach(prod => {
          const isWishlisted = typeof isInWishlist === 'function' ? isInWishlist(prod.id) : false;
          relatedGrid.innerHTML += `
            <div class="product-card" data-product-id="${prod.id}">
              <div class="card-image">
                <img src="${prod.image}" alt="${prod.title}">
                <div class="badges">
                  <span class="discount">${prod.discount || ''} OFF</span>
                  <span class="new">NEW</span>
                </div>
                <div class="actions">
                  <button class="cirle-icon-btn add-to-cart" type="button" tabindex="-1">
                    <!-- Add to Cart SVG -->
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.21053 14.2615H13.0913C17.3431 14.2615 17.9892 11.59 18.7736 7.6964C19 6.5719 19.1127 6.01012 18.8408 5.63592C18.569 5.26172 18.0479 5.26172 17.0048 5.26172H16.6316M4.3158 5.26172H6.21053"
                        stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M9.05263 7.15776C9.51874 7.63711 10.7579 9.52612 11.4211 9.52612M11.4211 9.52612C12.0842 9.52612 13.3234 7.63711 13.7895 7.15776M11.4211 9.52612V1.94735"
                        stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M8.57895 19.9475C9.36378 19.9475 10 19.3113 10 18.5265C10 17.7417 9.36378 17.1055 8.57895 17.1055C7.79412 17.1055 7.1579 17.7417 7.1579 18.5265C7.1579 19.3113 7.79412 19.9475 8.57895 19.9475Z"
                        stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M15.2105 19.9475C15.9953 19.9475 16.6315 19.3113 16.6315 18.5265C16.6315 17.7417 15.9953 17.1055 15.2105 17.1055C14.4257 17.1055 13.7894 17.7417 13.7894 18.5265C13.7894 19.3113 14.4257 19.9475 15.2105 19.9475Z"
                        stroke="#4E4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                  <button class="cirle-icon-btn add-to-wishlist${isWishlisted ? ' wishlisted' : ''}" type="button" tabindex="-1">
                    <!-- Wishlist SVG -->
                    <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.196 1.5C14.152 1.5 12.387 2.697 11.5 4.443C10.613 2.697 8.848 1.5 6.804 1.5C3.874 1.5 1.5 3.957 1.5 6.981C1.5 10.005 3.317 12.777 5.665 15.054C8.013 17.331 11.5 19.5 11.5 19.5C11.5 19.5 14.874 17.367 17.335 15.054C19.96 12.588 21.5 10.014 21.5 6.981C21.5 3.948 19.126 1.5 16.196 1.5Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="${isWishlisted ? '#e74c3c' : 'transparent'}" />
                    </svg>
                  </button>
                  <button class="icon-text-btn view-product" type="button" data-view-btn>
                    <!-- View SVG -->
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2959 19.04C5.03188 19.04 0.775879 14.784 0.775879 9.52C0.775879 4.256 5.03188 0 10.2959 0C15.5599 0 19.8159 4.256 19.8159 9.52C19.8159 14.784 15.5599 19.04 10.2959 19.04ZM10.2959 1.12C5.64788 1.12 1.89588 4.872 1.89588 9.52C1.89588 14.168 5.64788 17.92 10.2959 17.92C14.9439 17.92 18.6959 14.168 18.6959 9.52C18.6959 4.872 14.9439 1.12 10.2959 1.12Z" fill="#4E4E4E"/>
<path d="M10.5599 14.9519L9.77588 14.1679L14.4239 9.51989L9.77588 4.87189L10.5599 4.08789L15.9919 9.51989L10.5599 14.9519Z" fill="#4E4E4E"/>
<path d="M5.77588 8.96094H15.2959V10.0809H5.77588V8.96094Z" fill="#4E4E4E"/>
</svg>

                  </button>
                </div>
              </div>
              <div class="card-content">
                <h3>${prod.title}</h3>
                <div class="rating-price">
                  <div class="rating">
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.1875 15.5207L4.54167 9.95921L0 6.21859L6 5.7238L8.33333 0.479004L10.6667 5.7238L16.6667 6.21859L12.125 9.95921L13.4792 15.5207L8.33333 12.5717L3.1875 15.5207Z" fill="#FABB05" />
                    </svg>
                    <span>${prod.rating || ''}</span>
                  </div>
                  <div class="price">
                    <del>₹${prod.original_price ? prod.original_price.toLocaleString() : ''}</del>
                    <strong>₹${prod.price ? prod.price.toLocaleString() : ''}</strong>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
        relatedGrid.querySelectorAll('.product-card').forEach(card => {
          const id = card.getAttribute('data-product-id');
          const prod = relatedProducts.find(p => p.id === id);
          const viewBtn = card.querySelector('[data-view-btn]');
          if (viewBtn && prod) {
            viewBtn.addEventListener('click', function (e) {
              e.stopPropagation();
              localStorage.setItem('selectedProduct', JSON.stringify(prod));
              window.location.href = `product.html?id=${prod.id}`;
            });
          }
          const addToCartBtn = card.querySelector('.add-to-cart');
          if (addToCartBtn && prod) {
            addToCartBtn.addEventListener('click', function (e) {
              e.stopPropagation();
              const size = Array.isArray(prod.sizes) && prod.sizes.length ? prod.sizes[0] : prod.size || '';
              if (typeof addToCart === 'function') {
                addToCart({
                  id: prod.id,
                  title: prod.title,
                  image: prod.image,
                  price: prod.price,
                  original_price: prod.original_price,
                  size: size,
                  qty: 1
                });
                if (typeof updateCartCount === 'function') updateCartCount();
              }
            });
          }
        });
        if (typeof setupWishlistButtons === 'function') setupWishlistButtons(relatedGrid);
      });
  }
}

function renderProductReviews(productId, selector = '.review-summary__grid') {
  if (window.getProductReviews) {
    window.getProductReviews(productId).then(reviews => {
      const grid = document.querySelector(selector);
      if (!grid) return;
      grid.innerHTML = '';
      if (!reviews.length) {
        grid.innerHTML = '<div class="review-summary__card">No reviews yet.</div>';
        return;
      }
      reviews.slice(0, 4).forEach(review => {
        grid.innerHTML += `
          <div class="review-summary__card">
            <span class="badge"><svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_99_5528)">
            <path d="M3.854 16.0212L5.20817 10.4597L0.666504 6.71908L6.6665 6.22428L8.99984 0.979492L11.3332 6.22428L17.3332 6.71908L12.7915 10.4597L14.1457 16.0212L8.99984 13.0722L3.854 16.0212Z" fill="#FABB05"/>
            </g>
            <defs>
            <clipPath id="clip0_99_5528">
            <rect width="16.6667" height="15.0417" fill="white" transform="translate(0.666504 0.979492)"/>
            </clipPath>
            </defs>
            </svg> ${review.rating ? review.rating.toFixed(1) : ''}</span>
            <h4>${review.title ? review.title : 'Customer Review'}</h4>
            <p class="review-summary__comment">${review.text ? review.text : ''}</p>
            <div class="review-meta">
              ${review.name ? `<span class="review-author">--- ${review.name}</span>` : ''}
              ${review.date ? `<span class="review-date">${review.date}</span>` : ''}
            </div>
          </div>
        `;
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadProductDetail();

  const addToCartBtn = document.querySelector('.actions .btn.dark');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const prod = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
      let selectedSize = '';
      const sizeInput = document.querySelector('.sizes input[type="radio"]:checked');
      if (sizeInput) selectedSize = sizeInput.value;
      if (!selectedSize) {
        const activeSize = document.querySelector('.sizes .active');
        if (activeSize) selectedSize = activeSize.textContent.trim();
      }
      let qty = 1;
      const qtyInput = document.getElementById('qty');
      if (qtyInput && !isNaN(parseInt(qtyInput.value))) {
        qty = parseInt(qtyInput.value);
      }

      const cartItem = {
        id: prod.id,
        title: prod.title,
        image: prod.image,
        price: prod.price,
        original_price: prod.original_price,
        size: selectedSize,
        qty: qty
      };

      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      const existing = cart.find(item => item.id === cartItem.id && item.size === cartItem.size);

      if (existing) {
        window.location.href = 'cart.html';
        return;
      } else {
        cart.push(cartItem);
        localStorage.setItem('cartProducts', JSON.stringify(cart));
        if (typeof updateCartCount === 'function') updateCartCount();
        window.location.href = 'cart.html';
      }
    });
  }

  document.querySelectorAll('.sizes button, .sizes a, .sizes span').forEach(function(el) {
    el.addEventListener('click', function(e) {
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        e.preventDefault();
      }
      var parent = el.parentElement;
      if (parent) {
        parent.querySelectorAll('.active').forEach(function(activeEl) {
          activeEl.classList.remove('active');
        });
      }
      el.classList.add('active');

      if (window.location.pathname.includes('cart.html')) {
       
        var cartRow = el.closest('tr.cart-summary__item');
        if (cartRow) {
          var productTitle = cartRow.querySelector('.product-title')?.textContent?.trim();
          var newSize = el.textContent.trim();
          let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
          let updated = false;
          cart.forEach(item => {
            if (item.title === productTitle) {
              item.size = newSize;
              updated = true;
            }
          });
          if (updated) {
            localStorage.setItem('cartProducts', JSON.stringify(cart));
          }
        }
      }
    });
  });

  var buyNowBtn = document.querySelector('.buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const selectedSize = (() => {
        const sizeBtn = document.querySelector('.sizes input[type="radio"]:checked');
        if (sizeBtn) return sizeBtn.value;
        const sizeActive = document.querySelector('.sizes .active');
        if (sizeActive) return sizeActive.textContent.trim();
        return (window.loadedProduct && window.loadedProduct.size) || (window.loadedProduct && Array.isArray(window.loadedProduct.sizes) ? window.loadedProduct.sizes[0] : '');
      })();
      const selectedQty = (() => {
        const qtyInput = document.getElementById('qty');
        let val = qtyInput ? parseInt(qtyInput.value, 10) : 0;
        return isNaN(val) || val < 1 ? 1 : val;
      })();

      const product = window.loadedProduct || window.selectedProduct || null;
      if (!product) return;

      const buyNowProduct = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        original_price: product.original_price,
        size: selectedSize,
        qty: selectedQty
      };

      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      const existing = cart.find(item => item.id === buyNowProduct.id && item.size === buyNowProduct.size);
      if (existing) {
        existing.qty = selectedQty; 
        existing.subtotal = existing.price * existing.qty;
      } else {
        cart.push({ ...buyNowProduct, subtotal: buyNowProduct.price * buyNowProduct.qty });
      }
      localStorage.setItem('cartProducts', JSON.stringify(cart));

      const items = cart.map(item => ({
        ...item,
        subtotal: item.price * item.qty
      }));
      const subtotalAll = items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
      const totalDiscount = items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
      const platformFees = 5;
      const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0) + platformFees;

      var checkoutSummary = {
        items: items,
        subtotal: subtotalAll,
        totalDiscount: totalDiscount,
        platformFees: platformFees,
        total: total
      };

      localStorage.setItem('checkoutSummary', JSON.stringify(checkoutSummary));

      window.location.href = 'checkout.html';
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) return;

  fetch('./products.json')
    .then(res => res.json())
    .then(data => {
      const product = (data.products || []).find(p => p.id === productId);
      if (!product) return;

      const details = product.details || {};
      const detailsCard = document.getElementById('product-details-card');
      if (detailsCard) {
        detailsCard.innerHTML = `
          <h3>Product Details</h3>
          <ul>
            <li><strong>Fabric:</strong> ${details.fabric || '-'}</li>
            <li><strong>Fit:</strong> ${details.fit || '-'}</li>
            <li><strong>Neck:</strong> ${details.neck || '-'}</li>
            <li><strong>Pattern:</strong> ${details.pattern || '-'}</li>
            <li><strong>Length:</strong> ${details.length || '-'}</li>
            <li><strong>Occasion:</strong> ${details.occasion || '-'}</li>
            <li><strong>Wash Care:</strong> ${details.wash_care || '-'}</li>
            <li><strong>Country of Origin:</strong> ${details.country_of_origin || '-'}</li>
          </ul>
        `;
      }

      const delivery = product.delivery_return || {};
      const deliveryCard = document.getElementById('delivery-return-card');
      if (deliveryCard) {
        deliveryCard.innerHTML = `
          <h3>Delivery & Return</h3>
          <ul>
            <li><strong>Delivery:</strong> ${delivery.delivery || '-'}</li>
            <li><strong>Shipping Charges:</strong> ${delivery.shipping_charges || '-'}</li>
            <li><strong>Returns:</strong> ${delivery.returns || '-'}</li>
            <li><strong>Exchange:</strong> ${delivery.exchange || '-'}</li>
            <li><strong>COD (Cash on Delivery):</strong> ${delivery.cod || '-'}</li>
          </ul>
        `;
      }

      const sizeFit = product.size_fit || {};
      const sizeFitCard = document.getElementById('size-fit-card');
      if (sizeFitCard) {
        sizeFitCard.innerHTML = `
          <h3>Size & Fit</h3>
          <ul>
            <li><strong>Available Sizes:</strong> ${sizeFit.available_sizes || '-'}</li>
            <li><strong>Fit Type:</strong> ${sizeFit.fit_type || '-'}</li>
            <li><strong>Model Info:</strong> ${sizeFit.model_info || '-'}</li>
            <li><strong>Tip:</strong> ${sizeFit.tip || '-'}</li>
            <li><strong>Need Help?</strong> ${sizeFit.size_chart_help || '-'}</li>
          </ul>
        `;
      }
    });
});

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

document.addEventListener('DOMContentLoaded', function () {
  const productId = getProductIdFromUrl();
  if (productId && window.renderRelatedProducts) {
    let grid = document.querySelector('#related-products');
    if (!grid) {
      let section = document.querySelector('.related-products');
      if (!section) {
        section = document.createElement('section');
        section.className = 'related-products';
        document.querySelector('main')?.appendChild(section);
      }
      grid = document.createElement('div');
      grid.id = 'related-products';
      grid.className = 'product-grid';
      section.appendChild(grid);
    }
    window.renderRelatedProducts({
      productId: productId,
      selector: '#related-products',
      count: 4
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const productData = window.currentProduct || window.selectedProduct || null;
  const sizesContainer = document.querySelector('.product-sizes, .sizes, #product-sizes');
  if (productData && Array.isArray(productData.sizes) && productData.sizes.length && sizesContainer && typeof renderProductSizes === 'function') {
    const defaultSize = productData.sizes[0];
    renderProductSizes(
      sizesContainer,
      productData.sizes,
      defaultSize,
      function (selectedSize) {
        window.selectedProductSize = selectedSize;
        sizesContainer.querySelectorAll('label').forEach(label => {
          if (label.querySelector('input[type="radio"]')?.value === selectedSize) {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        });
      }
    );
    window.selectedProductSize = defaultSize;

    const radios = sizesContainer.querySelectorAll('input[type="radio"]');
    let checked = false;
    radios.forEach(radio => {
      if (radio.value === defaultSize) {
        radio.checked = true;
        checked = true;
        if (radio.parentElement) radio.parentElement.classList.add('active');
      } else {
        if (radio.parentElement) radio.parentElement.classList.remove('active');
      }
    });
    if (!checked && radios.length) {
      radios[0].checked = true;
      if (radios[0].parentElement) radios[0].parentElement.classList.add('active');
    }
  }

  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      const size = window.selectedProductSize ||
        (productData && productData.sizes && productData.sizes[0]) ||
        '';
    });
  }
  const buyNowBtn = document.querySelector('.buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function () {
      const size = window.selectedProductSize ||
        (productData && productData.sizes && productData.sizes[0]) ||
        '';
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const buyNowBtn = document.querySelector('.buy-now');
  if (buyNowBtn) {
    buyNowBtn.onclick = null;

    buyNowBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const selectedSize = (() => {
        const sizeBtn = document.querySelector('.sizes input[type="radio"]:checked');
        if (sizeBtn) return sizeBtn.value;
        const sizeActive = document.querySelector('.sizes .active');
        if (sizeActive) return sizeActive.textContent.trim();
        return (window.loadedProduct && window.loadedProduct.size) || (window.loadedProduct && Array.isArray(window.loadedProduct.sizes) ? window.loadedProduct.sizes[0] : '');
      })();
      const selectedQty = (() => {
        const qtyInput = document.getElementById('qty');
        let val = qtyInput ? parseInt(qtyInput.value, 10) : 1;
        return isNaN(val) || val < 1 ? 1 : val;
      })();
      const product = window.loadedProduct || window.selectedProduct || null;
      if (!product) return;

      const buyNowProduct = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        original_price: product.original_price,
        size: selectedSize,
        qty: selectedQty
      };
      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      const existing = cart.find(item => item.id === buyNowProduct.id && item.size === buyNowProduct.size);
      if (existing) {
        existing.qty = selectedQty; 
        existing.subtotal = existing.price * existing.qty;
      } else {
        cart.push({ ...buyNowProduct, subtotal: buyNowProduct.price * buyNowProduct.qty });
      }
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      const items = cart.map(item => ({
        ...item,
        subtotal: item.price * item.qty
      }));
      const subtotalAll = items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
      const totalDiscount = items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
      const platformFees = 5;
      const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0) + platformFees;

      var checkoutSummary = {
        items: items,
        subtotal: subtotalAll,
        totalDiscount: totalDiscount,
        platformFees: platformFees,
        total: total
      };

      localStorage.setItem('checkoutSummary', JSON.stringify(checkoutSummary));

      window.location.href = 'checkout.html';
    });
  }
});