// Call this on DOMContentLoaded or after your summary section is available
function renderCheckoutSummary() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv) return;
  if (!summary || !summary.items || summary.items.length === 0) {
    summaryDiv.innerHTML = '<div style="padding:24px;text-align:center;color:#888;">No products in order summary.</div>';
    return;
  }
  let html = '<table class="order-summary-table"><thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  summary.items.forEach((item, idx) => {
    html += `<tr data-idx="${idx}">
      <td>
        <img src="${item.image}" alt="${item.title}" style="width:40px;height:40px;object-fit:cover;margin-right:8px;vertical-align:middle;">
        ${item.title}
      </td>
      <td>${item.size || ''}</td>
      <td>${item.qty}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>₹${item.subtotal.toLocaleString()}</td>
      <td>
        <a href="#" class="remove-order-item" title="Remove" style="color:#d00;font-size:22px;text-decoration:none;cursor:pointer;line-height:1;" data-idx="${idx}">&#10005;</a>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  html += `<div class="order-totals">
    <div>Subtotal: <span>₹${summary.subtotal.toLocaleString()}</span></div>
    <div>Discount: <span>- ₹${summary.totalDiscount.toLocaleString()}</span></div>
    <div>Platform Fees: <span>₹${summary.platformFees.toLocaleString()}</span></div>
    <div><strong>Total: <span>₹${summary.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></strong></div>
  </div>`;
  summaryDiv.innerHTML = html;

  // Use global removeSummaryItem for removal
  summaryDiv.querySelectorAll('.remove-order-item').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const idx = parseInt(anchor.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && typeof window.removeSummaryItem === 'function') {
        window.removeSummaryItem(idx);
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', renderCheckoutSummary);


document.addEventListener('DOMContentLoaded', function() {
  if (typeof window.renderCheckoutSummary === 'function') {
    window.renderCheckoutSummary();
  }

    // Shipping info toggle logic
    var shipDiffCheckbox = document.getElementById('ship-diff-checkbox') || document.querySelector('.ship-diff input[type="checkbox"]');
    var shippingInfoBlock = document.querySelector('.form-block.shipping-info');
    if (shipDiffCheckbox && shippingInfoBlock) {
      function toggleShippingInfo() {
        shippingInfoBlock.style.display = shipDiffCheckbox.checked ? '' : 'none';
      }
      shipDiffCheckbox.addEventListener('change', toggleShippingInfo);
      toggleShippingInfo();
    }

    // Attach checkout button handler after summary is rendered
    function attachCheckoutHandler() {
      var completeBtn = document.querySelector('.checkout-btn');
      if (completeBtn) {
        completeBtn.onclick = function(e) {
          e.preventDefault();
          var form = document.querySelector('.checkout-form form');
          if (!form) return;

          // Billing fields
          var billing = {
            email: form.querySelector('input[type="email"]')?.value || '',
            firstName: form.querySelector('input[placeholder="Enter first name"]')?.value || '',
            lastName: form.querySelector('input[placeholder="Enter last name"]')?.value || '',
            address: form.querySelector('input[placeholder="Enter address"]')?.value || '',
            address2: form.querySelector('input[placeholder="Enter address 2"]')?.value || '',
            country: form.querySelector('select')?.value || '',
            state: form.querySelector('input[placeholder="Enter state"]')?.value || '',
            city: form.querySelector('input[placeholder="Enter city name"]')?.value || '',
            postcode: form.querySelector('input[placeholder="Enter zip code"]')?.value || ''
          };

          // Shipping fields (if ship-diff checked)
          var shipping = {};
          if (shipDiffCheckbox && shipDiffCheckbox.checked) {
            var shipBlock = form.querySelector('.form-block.shipping-info');
            if (shipBlock) {
              var shipInputs = shipBlock.querySelectorAll('input, select');
              shipInputs.forEach(function(input) {
                if (input.placeholder === "Enter first name") shipping.firstName = input.value;
                else if (input.placeholder === "Enter last name") shipping.lastName = input.value;
                else if (input.placeholder === "Enter address") shipping.address = input.value;
                else if (input.placeholder === "Enter address 2") shipping.address2 = input.value;
                else if (input.tagName === "SELECT") shipping.country = input.value;
                else if (input.placeholder === "Enter state") shipping.state = input.value;
                else if (input.placeholder === "Enter city name") shipping.city = input.value;
                else if (input.placeholder === "Enter zip code") shipping.postcode = input.value;
              });
            }
          } else {
            shipping = { ...billing };
          }

          // Get summary from localStorage
          var summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
          // Generate order id and date
          var orderId = 'ORD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
          var orderDate = new Date().toISOString();

          // Store order data
          var orderData = {
            orderId: orderId,
            orderDate: orderDate,
            billing: billing,
            shipping: shipping,
            summary: summary
          };
          localStorage.setItem('orderData', JSON.stringify(orderData));
          window.location.href = 'order-confirm.html';
        };
      }
    }

    // Attach handler initially and after summary is rendered (in case summary replaces the button)
    attachCheckoutHandler();
    // If renderCheckoutSummaryBox is async and replaces the button, use a MutationObserver
    var summaryBox = document.querySelector('.checkout-summary .summary-box');
    if (summaryBox) {
      var observer = new MutationObserver(function() {
        attachCheckoutHandler();
      });
      observer.observe(summaryBox, { childList: true, subtree: true });
    }
  });

// Call this on DOMContentLoaded or after your summary section is available
function renderCheckoutSummary() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv) return;
  if (!summary || !summary.items || summary.items.length === 0) {
    summaryDiv.innerHTML = '<div style="padding:24px;text-align:center;color:#888;">No products in order summary.</div>';
    return;
  }
  let html = '<table class="order-summary-table"><thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  summary.items.forEach((item, idx) => {
    html += `<tr data-idx="${idx}">
      <td>
        <img src="${item.image}" alt="${item.title}" style="width:40px;height:40px;object-fit:cover;margin-right:8px;vertical-align:middle;">
        ${item.title}
      </td>
      <td>${item.size || ''}</td>
      <td>${item.qty}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>₹${item.subtotal.toLocaleString()}</td>
      <td>
        <a href="#" class="remove-order-item" title="Remove" style="color:#d00;font-size:22px;text-decoration:none;cursor:pointer;line-height:1;">&#10005;</a>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  html += `<div class="order-totals">
    <div>Subtotal: <span>₹${summary.subtotal.toLocaleString()}</span></div>
    <div>Discount: <span>- ₹${summary.totalDiscount.toLocaleString()}</span></div>
    <div>Platform Fees: <span>₹${summary.platformFees.toLocaleString()}</span></div>
    <div><strong>Total: <span>₹${summary.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></strong></div>
  </div>`;
  summaryDiv.innerHTML = html;

  // Use global removeSummaryItem for removal
  summaryDiv.querySelectorAll('.remove-order-item').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const idx = parseInt(anchor.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && typeof window.removeSummaryItem === 'function') {
        window.removeSummaryItem(idx);
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', renderCheckoutSummary);

  document.addEventListener('DOMContentLoaded', function() {
    if (window.renderCheckoutSummaryBox) window.renderCheckoutSummaryBox();

    // Shipping info toggle logic
    var shipDiffCheckbox = document.getElementById('ship-diff-checkbox') || document.querySelector('.ship-diff input[type="checkbox"]');
    var shippingInfoBlock = document.querySelector('.form-block.shipping-info');
    if (shipDiffCheckbox && shippingInfoBlock) {
      function toggleShippingInfo() {
        shippingInfoBlock.style.display = shipDiffCheckbox.checked ? '' : 'none';
      }
      shipDiffCheckbox.addEventListener('change', toggleShippingInfo);
      toggleShippingInfo();
    }

    // Attach checkout button handler after summary is rendered
    function attachCheckoutHandler() {
      var completeBtn = document.querySelector('.checkout-btn');
      if (completeBtn) {
        completeBtn.onclick = function(e) {
          e.preventDefault();
          var form = document.querySelector('.checkout-form form');
          if (!form) return;

          // Billing fields
          var billing = {
            email: form.querySelector('input[type="email"]')?.value || '',
            firstName: form.querySelector('input[placeholder="Enter first name"]')?.value || '',
            lastName: form.querySelector('input[placeholder="Enter last name"]')?.value || '',
            address: form.querySelector('input[placeholder="Enter address"]')?.value || '',
            address2: form.querySelector('input[placeholder="Enter address 2"]')?.value || '',
            country: form.querySelector('select')?.value || '',
            state: form.querySelector('input[placeholder="Enter state"]')?.value || '',
            city: form.querySelector('input[placeholder="Enter city name"]')?.value || '',
            postcode: form.querySelector('input[placeholder="Enter zip code"]')?.value || ''
          };

          // Shipping fields (if ship-diff checked)
          var shipping = {};
          if (shipDiffCheckbox && shipDiffCheckbox.checked) {
            var shipBlock = form.querySelector('.form-block.shipping-info');
            if (shipBlock) {
              var shipInputs = shipBlock.querySelectorAll('input, select');
              shipInputs.forEach(function(input) {
                if (input.placeholder === "Enter first name") shipping.firstName = input.value;
                else if (input.placeholder === "Enter last name") shipping.lastName = input.value;
                else if (input.placeholder === "Enter address") shipping.address = input.value;
                else if (input.placeholder === "Enter address 2") shipping.address2 = input.value;
                else if (input.tagName === "SELECT") shipping.country = input.value;
                else if (input.placeholder === "Enter state") shipping.state = input.value;
                else if (input.placeholder === "Enter city name") shipping.city = input.value;
                else if (input.placeholder === "Enter zip code") shipping.postcode = input.value;
              });
            }
          } else {
            shipping = { ...billing };
          }

          // Get summary from localStorage
          var summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
          // Generate order id and date
          var orderId = 'ORD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
          var orderDate = new Date().toISOString();

          // Store order data
          var orderData = {
            orderId: orderId,
            orderDate: orderDate,
            billing: billing,
            shipping: shipping,
            summary: summary
          };
          localStorage.setItem('orderData', JSON.stringify(orderData));
          window.location.href = 'order-confirm.html';
        };
      }
    }

    // Attach handler initially and after summary is rendered (in case summary replaces the button)
    attachCheckoutHandler();
    // If renderCheckoutSummaryBox is async and replaces the button, use a MutationObserver
    var summaryBox = document.querySelector('.checkout-summary .summary-box');
    if (summaryBox) {
      var observer = new MutationObserver(function() {
        attachCheckoutHandler();
      });
      observer.observe(summaryBox, { childList: true, subtree: true });
    }
  });

// Call this on DOMContentLoaded or after your summary section is available
function renderCheckoutSummary() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv) return;
  if (!summary || !summary.items || summary.items.length === 0) {
    summaryDiv.innerHTML = '<div style="padding:24px;text-align:center;color:#888;">No products in order summary.</div>';
    return;
  }
  let html = '<table class="order-summary-table"><thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  summary.items.forEach((item, idx) => {
    html += `<tr data-idx="${idx}">
      <td>
        <img src="${item.image}" alt="${item.title}" style="width:40px;height:40px;object-fit:cover;margin-right:8px;vertical-align:middle;">
        ${item.title}
      </td>
      <td>${item.size || ''}</td>
      <td>${item.qty}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>₹${item.subtotal.toLocaleString()}</td>
      <td>
        <a href="#" class="remove-order-item" title="Remove" style="color:#d00;font-size:22px;text-decoration:none;cursor:pointer;line-height:1;">&#10005;</a>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  html += `<div class="order-totals">
    <div>Subtotal: <span>₹${summary.subtotal.toLocaleString()}</span></div>
    <div>Discount: <span>- ₹${summary.totalDiscount.toLocaleString()}</span></div>
    <div>Platform Fees: <span>₹${summary.platformFees.toLocaleString()}</span></div>
    <div><strong>Total: <span>₹${summary.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></strong></div>
  </div>`;
  summaryDiv.innerHTML = html;

  // Attach remove handlers to anchor tags
  summaryDiv.querySelectorAll('.remove-order-item').forEach(function(anchor, i) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
      if (!summary || !summary.items) return;
      summary.items.splice(i, 1);
      // Recalculate totals
      if (summary.items.length > 0) {
        summary.subtotal = summary.items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
        summary.totalDiscount = summary.items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
        summary.total = summary.items.reduce((sum, item) => sum + (item.price * item.qty), 0) + (summary.platformFees || 5);
      } else {
        summary = {};
      }
      localStorage.setItem('checkoutSummary', JSON.stringify(summary));
      renderCheckoutSummary();
    });
  });
}
document.addEventListener('DOMContentLoaded', renderCheckoutSummary);