document.addEventListener('DOMContentLoaded', function() {
    if (window.renderCartSummaryTableRows) {
      window.renderCartSummaryTableRows('#cart-tbody', '#cart-total');
    }
  });