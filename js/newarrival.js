// Render 3 products in the deals-products section using showProducts from api.js
document.addEventListener('DOMContentLoaded', function () {
  if (typeof showProducts === 'function') {
    showProducts({
      selector: '.deals-products',
      filterFn: () => true,
      count: 3
    });
    // Auto-refresh deals-products every 3 minutes
    setInterval(() => {
      showProducts({
        selector: '.deals-products',
        filterFn: () => true,
        count: 3
      });
    }, 3 * 60 * 1000);
  }


});