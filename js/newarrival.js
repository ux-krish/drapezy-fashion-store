document.addEventListener('DOMContentLoaded', function () {
  if (typeof showProducts === 'function') {
    showProducts({
      selector: '.deals-products',
      filterFn: () => true,
      count: 3
    });
    setInterval(() => {
      showProducts({
        selector: '.deals-products',
        filterFn: () => true,
        count: 3
      });
    }, 3 * 60 * 1000);
  }


});