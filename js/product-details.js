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
    slidesPerView: 3,
    spaceBetween: 24,
    watchSlidesProgress: true,
    loop: true,
    direction: "vertical",
    autoHeight: true,
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
  if (sizesDiv && product.sizes && window.renderProductSizes) {
    window.renderProductSizes(
      sizesDiv,
      product.sizes,
      product.available_size,
      function(selected) {
        selectedSize = selected;
      },
      'size'
    );
    selectedSize = product.available_size || product.sizes[0];
  }

  // Quantity
  const qtyDiv = document.querySelector('.product-info .quantity');
  if (qtyDiv && window.renderQuantitySelector) {
    window.renderQuantitySelector(qtyDiv, 1, function(qty) {
      selectedQty = qty;
    });
    selectedQty = 1;
  }

  // Add to Cart button logic
  const addToCartBtn = document.querySelector('.product-info .actions .btn.dark');
  if (addToCartBtn) {
    addToCartBtn.onclick = function(e) {
      e.preventDefault();
      // Validate size selection
      if (!selectedSize) {
        alert('Please select a size.');
        return;
      }
      // Validate quantity
      if (!selectedQty || selectedQty < 1) {
        alert('Please select a valid quantity.');
        return;
      }
      // Prepare cart item
      const cartItem = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        original_price: product.original_price,
        discount: product.discount,
        size: selectedSize,
        qty: selectedQty,
        total: product.price * selectedQty
      };
      // Save to localStorage cart
      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      // If same product and size exists, increase qty
      const existing = cart.find(
        item => item.id === cartItem.id && item.size === cartItem.size
      );
      if (existing) {
        existing.qty += cartItem.qty;
        existing.total = existing.price * existing.qty;
      } else {
        cart.push(cartItem);
      }
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      // Redirect to cart page
      window.location.href = 'cart.html';
    };
  }

  // Buy Now button logic: bring selected size to checkout page
  const buyNowBtn = document.querySelector('.product-info .actions .buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Validate size selection
      if (!selectedSize) {
        alert('Please select a size.');
        return;
      }
      // Validate quantity
      if (!selectedQty || selectedQty < 1) {
        alert('Please select a valid quantity.');
        return;
      }
      // Prepare buy-now product
      const buyNowProduct = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        original_price: product.original_price,
        discount: product.discount,
        size: selectedSize,
        qty: selectedQty,
        subtotal: product.price * selectedQty
      };
      // Calculate summary
      const totalDiscount = (product.original_price - product.price) * selectedQty;
      const subtotalAll = product.original_price * selectedQty;
      const platformFees = 5;
      const total = buyNowProduct.subtotal + platformFees;
      // Prepare checkout summary
      const checkoutSummary = {
        items: [buyNowProduct],
        subtotal: subtotalAll,
        totalDiscount: totalDiscount,
        platformFees: platformFees,
        total: total
      };
      // Reset cart and item count
      localStorage.removeItem('cartProducts');
      localStorage.setItem('cartCount', '0');
      // Store checkout summary for buy-now
      localStorage.setItem('checkoutSummary', JSON.stringify(checkoutSummary));
      // Redirect to checkout
      window.location.href = 'checkout.html';
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

  // Handle wishlist button beside Buy Now
  const wishlistBtn = document.querySelector('.product-info .actions .btn.light');
  if (wishlistBtn) {
    // Set initial state: not wishlisted (no fill)
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
      // Update button state and SVG fill
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

  // GSAP animation for product info and sliders moved to common.js

  // Remember this product page as last visited product page for "Back" button
  if (window.rememberProductPage) window.rememberProductPage();
}

document.addEventListener('DOMContentLoaded', function() {
  loadProductDetail();

  // Find the Add to Cart button (adjust selector if needed)
  const addToCartBtn = document.querySelector('.actions .btn.dark');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // Get product info from the page or localStorage
      const prod = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
      // Get selected size and quantity from the page
      let selectedSize = '';
      const sizeInput = document.querySelector('.sizes input[type="radio"]:checked');
      if (sizeInput) selectedSize = sizeInput.value;
      // Fallback: try to get from .sizes .active or similar if you use custom UI
      if (!selectedSize) {
        const activeSize = document.querySelector('.sizes .active');
        if (activeSize) selectedSize = activeSize.textContent.trim();
      }
      // Get quantity
      let qty = 1;
      const qtyInput = document.getElementById('qty');
      if (qtyInput && !isNaN(parseInt(qtyInput.value))) {
        qty = parseInt(qtyInput.value);
      }

      // Prepare cart item
      const cartItem = {
        id: prod.id,
        title: prod.title,
        image: prod.image,
        price: prod.price,
        original_price: prod.original_price,
        size: selectedSize,
        qty: qty
      };

      // Check if already in cart (id + size)
      let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      const existing = cart.find(item => item.id === cartItem.id && item.size === cartItem.size);

      if (existing) {
        // If already in cart, just redirect to cart page (do not add again)
        window.location.href = 'cart.html';
        return;
      } else {
        // Add to cart and redirect
        cart.push(cartItem);
        localStorage.setItem('cartProducts', JSON.stringify(cart));
        // Optionally update cart count in header if needed
        if (typeof updateCartCount === 'function') updateCartCount();
        window.location.href = 'cart.html';
      }
    });
  }

  // Size selection logic (prevent page jump and update only the changed element, not the whole cart-tbody)
  document.querySelectorAll('.sizes button, .sizes a, .sizes span').forEach(function(el) {
    el.addEventListener('click', function(e) {
      // Only preventDefault if the element is a link or button
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        e.preventDefault();
      }
      // Remove active from all siblings
      var parent = el.parentElement;
      if (parent) {
        parent.querySelectorAll('.active').forEach(function(activeEl) {
          activeEl.classList.remove('active');
        });
      }
      el.classList.add('active');
      // ...any other logic for size selection...

      // If on cart page, update only the relevant row/element, not the whole cart-tbody
      if (window.location.pathname.includes('cart.html')) {
        // Example: update the size in localStorage for this cart item
        // Find the cart row and get product id (assumes data-id or similar is set)
        var cartRow = el.closest('tr.cart-summary__item');
        if (cartRow) {
          var productTitle = cartRow.querySelector('.product-title')?.textContent?.trim();
          var newSize = el.textContent.trim();
          let cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
          // Find by title and update size (adjust if you have id/size in DOM)
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
          // Optionally update the size display in the row (if needed)
          // No need to rerender the whole tbody
        }
      }
    });
  });
});