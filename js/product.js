function showProducts({ selector, filterFn, sortFn, count = 4 }) {
  fetch('./products.json')
    .then(res => res.json())
    .then(data => {
      let products = data.products.filter(filterFn);
      if (sortFn) products = products.sort(sortFn);
      products = products.slice(0, count);

      const grid = document.querySelector(selector);
      if (!grid) return;
      grid.innerHTML = '';
      products.forEach(product => {
        grid.innerHTML += `
          <div class="product-card" data-product-id="${product.id}">
            <div class="card-image">
              <img src="${product.image}" alt="${product.title}">
              <div class="badges">
                <span class="discount">${product.discount || ''} OFF</span>
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
                <button class="cirle-icon-btn add-to-wishlist" type="button" tabindex="-1">
                  <!-- Wishlist SVG -->
                  <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.196 1.5C14.152 1.5 12.387 2.697 11.5 4.443C10.613 2.697 8.848 1.5 6.804 1.5C3.874 1.5 1.5 3.957 1.5 6.981C1.5 10.005 3.317 12.777 5.665 15.054C8.013 17.331 11.5 19.5 11.5 19.5C11.5 19.5 14.874 17.367 17.335 15.054C19.96 12.588 21.5 10.014 21.5 6.981C21.5 3.948 19.126 1.5 16.196 1.5Z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
                <button class="icon-text-btn view-product" type="button" data-view-btn>
                  <!-- View SVG -->
                  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.4999 31.0799C11.5439 31.0799 5.91992 25.4559 5.91992 18.4999C5.91992 11.5439 11.5439 5.91992 18.4999 5.91992C25.4559 5.91992 31.0799 11.5439 31.0799 18.4999C31.0799 25.4559 25.4559 31.0799 18.4999 31.0799ZM18.4999 7.39992C12.3579 7.39992 7.39992 12.3579 7.39992 18.4999C7.39992 24.6419 12.3579 29.5999 18.4999 29.5999C24.6419 29.5999 29.5999 24.6419 29.5999 18.4999C29.5999 12.3579 24.6419 7.39992 18.4999 7.39992Z"
                      fill="currentColor" />
                    <path d="M18.2782 25.6783L17.2422 24.6423L23.3842 18.5003L17.2422 12.3583L18.2782 11.3223L25.4562 18.5003L18.2782 25.6783Z"
                      fill="currentColor" />
                    <path d="M11.8398 17.7598H24.4198V19.2398H11.8398V17.7598Z" fill="currentColor" />
                  </svg>
                  View
                </button>
              </div>
            </div>
            <div class="card-content">
              <h3>${product.title}</h3>
              <div class="rating-price">
                <div class="rating">
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.1875 15.5207L4.54167 9.95921L0 6.21859L6 5.7238L8.33333 0.479004L10.6667 5.7238L16.6667 6.21859L12.125 9.95921L13.4792 15.5207L8.33333 12.5717L3.1875 15.5207Z" fill="#FABB05" />
                  </svg>
                  <span>${product.rating || ''}</span>
                </div>
                <div class="price">
                  <del>₹${product.original_price ? product.original_price.toLocaleString() : ''}</del>
                  <strong>₹${product.price ? product.price.toLocaleString() : ''}</strong>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      grid.querySelectorAll('.product-card').forEach(card => {
        const id = card.getAttribute('data-product-id');
        const prod = products.find(p => p.id === id);
        const viewBtn = card.querySelector('[data-view-btn]');
        if (viewBtn && prod) {
          viewBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            localStorage.setItem('selectedProduct', JSON.stringify(prod));
            window.location.href = `product.html?id=${prod.id}`;
          });
        }
      });
    });
}

showProducts({
  selector: '#new-women',
  filterFn: p => p.gender === 'Women',
  count: 4
});

showProducts({
  selector: '#new-men',
  filterFn: p => p.gender === 'Men',
  count: 4
});
showProducts({
  selector: '#bestselling-womens-products',
  filterFn: p => p.gender === 'Women',
  sortFn: (a, b) => (b.ratings_count || 0) - (a.ratings_count || 0),
  count: 4
});
showProducts({
  selector: '#bestselling-mens-products',
  filterFn: p => p.gender === 'Men',
  sortFn: (a, b) => (b.ratings_count || 0) - (a.ratings_count || 0),
  count: 4
});