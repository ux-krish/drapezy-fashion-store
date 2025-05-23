fetch('./products.json')
  .then(response => response.json())
  .then(data => {
    const menGrid = document.getElementById('men');
    menGrid.innerHTML = ''; 

    data.products
      .filter(product => product.gender === "Men")
      .forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="card-image">
            <img src="${product.image}" alt="${product.title}">
            <div class="badges">
              <span class="discount">${product.discount} OFF</span>
              <span class="new">NEW</span>
            </div>
            <div class="actions">
              <button><i class="fa fa-download"></i></button>
              <button><i class="fa fa-heart"></i></button>
              <button><i class="fa fa-eye"></i> View</button>
            </div>
          </div>
          <div class="card-content">
            <h3>${product.title}</h3>
            <div class="rating-price">
              <div class="rating">
                <span>⭐ ${product.rating}</span>
              </div>
              <div class="price">
                <del>₹${product.original_price.toLocaleString()}</del>
                <strong>₹${product.price.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        `;
        menGrid.appendChild(card);
      });
  })
  .catch(error => {
    console.error('Error fetching men products:', error);
  });
