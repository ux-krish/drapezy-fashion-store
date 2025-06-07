// Call this on DOMContentLoaded or after your summary section is available
function renderCheckoutSummary() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv) return;
  if (!summary || !summary.items || summary.items.length === 0) {
    summaryDiv.innerHTML = '<div style="padding:24px;text-align:center;color:#888;">No products in order summary.</div>';
    return;
  }
  // For size options, get all sizes for each product from cartProducts (if available)
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  let html = '<table class="order-summary-table"><thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  summary.items.forEach((item, idx) => {
    // Find all sizes for this product from cartProducts or fallback to current size
    let allSizes = [];
    let cartProd = cartProducts.find(p => p.id === item.id);
    if (cartProd && Array.isArray(cartProd.sizes)) {
      allSizes = cartProd.sizes;
    } else if (item.sizes && Array.isArray(item.sizes)) {
      allSizes = item.sizes;
    } else if (item.size) {
      allSizes = [item.size];
    }
    // Remove duplicates
    allSizes = Array.from(new Set(allSizes));
    // Render size select
    let sizeSelect = `<select class="order-size-select" data-idx="${idx}">`;
    allSizes.forEach(sz => {
      sizeSelect += `<option value="${sz}"${sz === item.size ? ' selected' : ''}>${sz}</option>`;
    });
    sizeSelect += '</select>';
    // Render qty input beside product title
    let qtyInput = `<input type="number" min="1" class="order-qty-input" data-idx="${idx}" value="${item.qty}" style="width:48px;text-align:center;margin-left:8px;">`;
    // Add remove anchor beside product image
    let removeAnchor = `<a href="#" class="remove-order-item" title="Remove" style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:#fff;border-radius:50%;border:1px solid #e74c3c;color:#e74c3c;font-size:20px;font-weight:bold;text-decoration:none;cursor:pointer;vertical-align:middle;margin-right:10px;transition:background 0.2s;" data-idx="${idx}">&#10005;</a>`;
    html += `<tr data-idx="${idx}">
      <td>
        ${removeAnchor}
        <img src="${item.image}" alt="${item.title}" style="width:40px;height:40px;object-fit:cover;margin-right:8px;vertical-align:middle;">
        ${item.title}
        ${qtyInput}
      </td>
      <td>${sizeSelect}</td>
      <td>${item.qty}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>₹${(item.price * item.qty).toLocaleString()}</td>
      <td></td>
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

  // Remove item handler
  summaryDiv.querySelectorAll('.remove-order-item').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const idx = parseInt(anchor.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && typeof window.removeSummaryItem === 'function') {
        window.removeSummaryItem(idx);
        // Update sidebar summary
        if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
      }
    });
  });

  // --- Quantity update handler (input beside product title) ---
  // summaryDiv.querySelectorAll('.order-qty-input').forEach(function(input) {
  //   input.addEventListener('change', function() {
  //     let idx = parseInt(this.getAttribute('data-idx'), 10);
  //     let val = parseInt(this.value, 10);
  //     if (isNaN(val) || val < 1) {
  //       this.value = 1;
  //       val = 1;
  //     }
  //     let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  //     if (!summary || !summary.items || !summary.items[idx]) return;
  //     summary.items[idx].qty = val;
  //     summary.items[idx].subtotal = summary.items[idx].price * val;
  //     // Recalculate totals
  //     summary.subtotal = summary.items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
  //     summary.totalDiscount = summary.items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
  //     summary.total = summary.items.reduce((sum, item) => sum + (item.price * item.qty), 0) + (summary.platformFees || 5);
  //     localStorage.setItem('checkoutSummary', JSON.stringify(summary));
  //     renderCheckoutSummary();
  //     // Update sidebar summary
  //     if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
  //   });
  // });

  // --- Size update handler ---
  summaryDiv.querySelectorAll('.order-size-select').forEach(function(select) {
    select.addEventListener('change', function() {
      let idx = parseInt(this.getAttribute('data-idx'), 10);
      let val = this.value;
      let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
      if (!summary || !summary.items || !summary.items[idx]) return;
      summary.items[idx].size = val;
      localStorage.setItem('checkoutSummary', JSON.stringify(summary));
      renderCheckoutSummary();
      // Update sidebar summary
      if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
    });
  });

  // Always update sidebar summary after rendering
  if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
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

    // --- Validation helpers ---
  function validateField(input) {
    const value = input.value.trim();
    let valid = true;
    if (input.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('state')) {
      valid = value && value !== '' && value !== 'Select state';
    } else if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('country')) {
      // For country select, must not be empty or "Select country"
      valid = value && value !== '' && value !== 'Select country';
    } else if (
      (input.name && input.name.toLowerCase().includes('country')) ||
      (input.id && input.id.toLowerCase().includes('country'))
    ) {
      // For country input (text), must not be empty
      valid = !!value;
    } else {
      valid = !!value;
    }
    input.style.borderColor = valid ? '#2ecc40' : '#e74c3c';

    // Show/hide error message for this field
    let err = input.parentElement.querySelector('.field-error');
    if (!valid) {
      if (!err) {
        err = document.createElement('div');
        err.className = 'field-error';
        err.style.color = '#e74c3c';
        err.style.fontSize = '13px';
        err.style.marginTop = '4px';
        input.parentElement.appendChild(err);
      }
      if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('country')) {
        err.textContent = 'Please select your country.';
      } else if (
        (input.name && input.name.toLowerCase().includes('country')) ||
        (input.id && input.id.toLowerCase().includes('country'))
      ) {
        err.textContent = 'Please enter your country.';
      } else if (input.type === 'email') {
        err.textContent = 'Please enter a valid email address.';
      } else {
        err.textContent = 'This field is required.';
      }
    } else if (err) {
      err.remove();
    }

    return valid;
  }

  function clearValidation(input) {
    input.style.borderColor = '';
  }

  function showError(msg, form) {
    // Remove any previous global error message
    let err = form.querySelector('.checkout-error');
    if (err) err.remove();

    let fields = form.querySelectorAll('input, select');
    fields.forEach(field => {
      // Skip fields that are already valid
      if (validateField(field)) return;

      // Show error for this field
      let fieldError = document.createElement('div');
      fieldError.className = 'field-error';
      fieldError.style.color = '#e74c3c';
      fieldError.style.fontSize = '13px';
      fieldError.style.marginTop = '4px';
      fieldError.textContent = 'This field is required.';
      field.parentElement.appendChild(fieldError);
    });
  }

  function removeError(form) {
    let err = form.querySelector('.checkout-error');
    if (err) err.remove();
  }

  // --- Attach validation to all fields ---
  function attachLiveValidation(form) {
    form.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', function() {
        validateField(input);
        removeError(form);
      });
      input.addEventListener('blur', function() {
        validateField(input);
      });
    });
  }

    // Attach checkout button handler after summary is rendered
    function attachCheckoutHandler() {
      var completeBtn = document.querySelector('.checkout-btn');
      if (completeBtn) {
        completeBtn.onclick = function(e) {
          e.preventDefault();
          var form = document.querySelector('.checkout-form form');
          if (!form) return;

          // Remove global error message under the button
          let err = form.querySelector('.checkout-error');
          if (err) err.remove();

          // Validate billing fields
          let valid = true;
          let requiredInputs = [
            form.querySelector('input[type="email"]'),
            form.querySelector('input[placeholder="Enter first name"]'),
            form.querySelector('input[placeholder="Enter last name"]'),
            form.querySelector('input[placeholder="Enter address"]'),
            form.querySelector('select[name="state"], #state'),
            form.querySelector('input[name="country"], #country'),
            form.querySelector('input[placeholder="Enter city name"]'),
            form.querySelector('input[placeholder="Enter zip code"]'),
            form.querySelector('input[placeholder="Enter phone number"]')
          ];
          requiredInputs.forEach(input => {
            if (!input) return;
            // Phone number: required and pattern validation
            if (
              input.getAttribute('placeholder') === 'Enter phone number'
            ) {
              const phoneVal = input.value.trim();
              const phonePattern = /^[0-9\-\+\s]{10,15}$/;
              if (!phoneVal || !phonePattern.test(phoneVal)) {
                input.style.borderColor = '#e74c3c';
                let err = input.parentElement.querySelector('.field-error');
                if (!err) {
                  err = document.createElement('div');
                  err.className = 'field-error';
                  err.style.color = '#e74c3c';
                  err.style.fontSize = '13px';
                  err.style.marginTop = '4px';
                  input.parentElement.appendChild(err);
                }
                err.textContent = 'Please enter a valid phone number (10 digits).';
                valid = false;
                return;
              } else {
                input.style.borderColor = '#2ecc40';
                let err = input.parentElement.querySelector('.field-error');
                if (err) err.remove();
              }
            } else {
              if (!validateField(input)) valid = false;
            }
          });

          // If shipping info is shown, validate those fields too
          if (shipDiffCheckbox && shipDiffCheckbox.checked && shippingInfoBlock) {
            let shippingInputs = [
              shippingInfoBlock.querySelector('input[placeholder="Enter first name"]'),
              shippingInfoBlock.querySelector('input[placeholder="Enter last name"]'),
              shippingInfoBlock.querySelector('input[placeholder="Enter address"]'),
              shippingInfoBlock.querySelector('select[name="shipping-state"], #shipping-state'),
              shippingInfoBlock.querySelector('input[name="shipping-country"], #shipping-country'),
              shippingInfoBlock.querySelector('input[placeholder="Enter city name"]'),
              shippingInfoBlock.querySelector('input[placeholder="Enter zip code"]'),
              shippingInfoBlock.querySelector('input[placeholder="Enter phone number"]')
            ];
            shippingInputs.forEach(input => {
              if (!input) return;
              // Phone number: required and pattern validation
              if (
                input.getAttribute('placeholder') === 'Enter phone number'
              ) {
                const phoneVal = input.value.trim();
                const phonePattern = /^[0-9\-\+\s]{10,15}$/;
                if (!phoneVal || !phonePattern.test(phoneVal)) {
                  input.style.borderColor = '#e74c3c';
                  let err = input.parentElement.querySelector('.field-error');
                  if (!err) {
                    err = document.createElement('div');
                    err.className = 'field-error';
                    err.style.color = '#e74c3c';
                    err.style.fontSize = '13px';
                    err.style.marginTop = '4px';
                    input.parentElement.appendChild(err);
                  }
                  err.textContent = 'Please enter a valid phone number (10 digits).';
                  valid = false;
                  return;
                } else {
                  input.style.borderColor = '#2ecc40';
                  let err = input.parentElement.querySelector('.field-error');
                  if (err) err.remove();
                }
              } else {
                if (!validateField(input)) valid = false;
              }
            });
          }

          if (!valid) {
            // Do NOT show global error message under the button
            return;
          }

          // --- Get billing fields ---
          // Try to get country from input, then from select, else empty string
          let countryInput = form.querySelector('input[name="country"], #country');
          let countrySelect = form.querySelector('select[name="country"], #country');
          let countryValue = '';
          if (countryInput && countryInput.value.trim()) {
            countryValue = countryInput.value.trim();
          } else if (countrySelect && countrySelect.value && countrySelect.value !== 'Select country') {
            countryValue = countrySelect.value;
          }

          var billing = {
            email: form.querySelector('input[type="email"]')?.value || '',
            firstName: form.querySelector('input[placeholder="Enter first name"]')?.value || '',
            lastName: form.querySelector('input[placeholder="Enter last name"]')?.value || '',
            address: form.querySelector('input[placeholder="Enter address"]')?.value || '',
            address2: form.querySelector('input[placeholder="Enter address 2"]')?.value || '',
            country: countryValue,
            state: form.querySelector('select[name="state"], #state')?.value || '',
            city: form.querySelector('input[placeholder="Enter city name"]')?.value || '',
            postcode: form.querySelector('input[placeholder="Enter zip code"]')?.value || '',
            phone: form.querySelector('input[placeholder="Enter phone number"]')?.value || ''
          };

          // --- Get shipping fields (if ship-diff checked) ---
          var shipping = {};
          if (shipDiffCheckbox && shipDiffCheckbox.checked) {
            var shipBlock = form.querySelector('.form-block.shipping-info');
            let shipCountryInput = shipBlock?.querySelector('input[name="shipping-country"], #shipping-country');
            let shipCountrySelect = shipBlock?.querySelector('select[name="shipping-country"], #shipping-country');
            let shipCountryValue = '';
            if (shipCountryInput && shipCountryInput.value.trim()) {
              shipCountryValue = shipCountryInput.value.trim();
            } else if (shipCountrySelect && shipCountrySelect.value && shipCountrySelect.value !== 'Select country') {
              shipCountryValue = shipCountrySelect.value;
            }
            shipping.firstName = shipBlock?.querySelector('input[placeholder="Enter first name"]')?.value || '';
            shipping.lastName = shipBlock?.querySelector('input[placeholder="Enter last name"]')?.value || '';
            shipping.address = shipBlock?.querySelector('input[placeholder="Enter address"]')?.value || '';
            shipping.address2 = shipBlock?.querySelector('input[placeholder="Enter address 2"]')?.value || '';
            shipping.country = shipCountryValue;
            shipping.state = shipBlock?.querySelector('select[name="shipping-state"], #shipping-state')?.value || '';
            shipping.city = shipBlock?.querySelector('input[placeholder="Enter city name"]')?.value || '';
            shipping.postcode = shipBlock?.querySelector('input[placeholder="Enter zip code"]')?.value || '';
            shipping.phone = shipBlock?.querySelector('input[placeholder="Enter phone number"]')?.value || '';
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

          // --- Remove only purchased items from cartProducts and update cart count ---
          try {
            let cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
            if (Array.isArray(cartProducts) && summary.items && Array.isArray(summary.items)) {
              summary.items.forEach(purchased => {
                cartProducts = cartProducts.filter(cartItem => {
                  // Remove if id and size both match
                  return !(cartItem.id === purchased.id && cartItem.size === purchased.size);
                });
              });
              localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
              // Update cart count UI if function exists
              if (typeof window.updateCartCount === 'function') window.updateCartCount();
            }
          } catch (e) {}

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

    // Attach live validation to all fields
    var form = document.querySelector('.checkout-form form');
    if (form) attachLiveValidation(form);
  });

// Remove item from order summary, even if it's the last item
window.removeSummaryItem = function(idx) {
  let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  if (!summary || !summary.items || !summary.items[idx]) return;
  summary.items.splice(idx, 1);
  // Always update summary, even if now empty
  if (summary.items.length > 0) {
    summary.subtotal = summary.items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
    summary.totalDiscount = summary.items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
    summary.total = summary.items.reduce((sum, item) => sum + (item.price * item.qty), 0) + (summary.platformFees || 5);
  } else {
    // If no items left, clear all summary fields
    summary.items = [];
    summary.subtotal = 0;
    summary.totalDiscount = 0;
    summary.platformFees = 5;
    summary.total = 0;
  }
  localStorage.setItem('checkoutSummary', JSON.stringify(summary));
  renderCheckoutSummary();
  // Update sidebar summary
  if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
  // Do NOT remove from cartProducts or update cart count here!
};

function renderCheckoutSummary() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv) return;
  if (!summary || !summary.items || summary.items.length === 0) {
    summaryDiv.innerHTML = '<div style="padding:24px;text-align:center;color:#888;">No products in order summary.</div>';
    return;
  }
  // For size options, get all sizes for each product from cartProducts (if available)
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  let html = '<table class="order-summary-table"><thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  summary.items.forEach((item, idx) => {
    // Find all sizes for this product from cartProducts or fallback to current size
    let allSizes = [];
    let cartProd = cartProducts.find(p => p.id === item.id);
    if (cartProd && Array.isArray(cartProd.sizes)) {
      allSizes = cartProd.sizes;
    } else if (item.sizes && Array.isArray(item.sizes)) {
      allSizes = item.sizes;
    } else if (item.size) {
      allSizes = [item.size];
    }
    // Remove duplicates
    allSizes = Array.from(new Set(allSizes));
    // Render size select
    let sizeSelect = `<select class="order-size-select" data-idx="${idx}">`;
    allSizes.forEach(sz => {
      sizeSelect += `<option value="${sz}"${sz === item.size ? ' selected' : ''}>${sz}</option>`;
    });
    sizeSelect += '</select>';
    // Render qty input beside product title
    let qtyInput = `<input type="number" min="1" class="order-qty-input" data-idx="${idx}" value="${item.qty}" style="width:48px;text-align:center;margin-left:8px;">`;
    // Add remove anchor beside product image
    let removeAnchor = `<a href="#" class="remove-order-item" title="Remove" style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:#fff;border-radius:50%;border:1px solid #e74c3c;color:#e74c3c;font-size:20px;font-weight:bold;text-decoration:none;cursor:pointer;vertical-align:middle;margin-right:10px;transition:background 0.2s;" data-idx="${idx}">&#10005;</a>`;
    html += `<tr data-idx="${idx}">
      <td>
        ${removeAnchor}
        <img src="${item.image}" alt="${item.title}" style="width:40px;height:40px;object-fit:cover;margin-right:8px;vertical-align:middle;">
        ${item.title}
        ${qtyInput}
      </td>
      <td>${sizeSelect}</td>
      <td>${item.qty}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>₹${(item.price * item.qty).toLocaleString()}</td>
      <td></td>
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

  // Remove item handler
  summaryDiv.querySelectorAll('.remove-order-item').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const idx = parseInt(anchor.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && typeof window.removeSummaryItem === 'function') {
        window.removeSummaryItem(idx);
        // Update sidebar summary
        if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
      }
    });
  });

  // --- Quantity update handler (input beside product title) ---
  summaryDiv.querySelectorAll('.order-qty-input').forEach(function(input) {
    input.addEventListener('change', function() {
      let idx = parseInt(this.getAttribute('data-idx'), 10);
      let val = parseInt(this.value, 10);
      if (isNaN(val) || val < 1) {
        this.value = 1;
        val = 1;
      }
      let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
      if (!summary || !summary.items || !summary.items[idx]) return;
      summary.items[idx].qty = val;
      summary.items[idx].subtotal = summary.items[idx].price * val;
      // Recalculate totals
      summary.subtotal = summary.items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
      summary.totalDiscount = summary.items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
      summary.total = summary.items.reduce((sum, item) => sum + (item.price * item.qty), 0) + (summary.platformFees || 5);
      localStorage.setItem('checkoutSummary', JSON.stringify(summary));
      renderCheckoutSummary();
      // Update sidebar summary
      if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
    });
  });

  // --- Size update handler ---
  summaryDiv.querySelectorAll('.order-size-select').forEach(function(select) {
    select.addEventListener('change', function() {
      let idx = parseInt(this.getAttribute('data-idx'), 10);
      let val = this.value;
      let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
      if (!summary || !summary.items || !summary.items[idx]) return;
      summary.items[idx].size = val;
      localStorage.setItem('checkoutSummary', JSON.stringify(summary));
      renderCheckoutSummary();
      // Update sidebar summary
      if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
    });
  });

  // Always update sidebar summary after rendering
  if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
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

    // --- Validation helpers ---
  function validateField(input) {
    const value = input.value.trim();
    let valid = true;
    if (input.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('state')) {
      valid = value && value !== '' && value !== 'Select state';
    } else if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('country')) {
      // For country select, must not be empty or "Select country"
      valid = value && value !== '' && value !== 'Select country';
    } else if (
      (input.name && input.name.toLowerCase().includes('country')) ||
      (input.id && input.id.toLowerCase().includes('country'))
    ) {
      // For country input (text), must not be empty
      valid = !!value;
    } else {
      valid = !!value;
    }
    input.style.borderColor = valid ? '#2ecc40' : '#e74c3c';

    // Show/hide error message for this field
    let err = input.parentElement.querySelector('.field-error');
    if (!valid) {
      if (!err) {
        err = document.createElement('div');
        err.className = 'field-error';
        err.style.color = '#e74c3c';
        err.style.fontSize = '13px';
        err.style.marginTop = '4px';
        input.parentElement.appendChild(err);
      }
      if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('country')) {
        err.textContent = 'Please select your country.';
      } else if (
        (input.name && input.name.toLowerCase().includes('country')) ||
        (input.id && input.id.toLowerCase().includes('country'))
      ) {
        err.textContent = 'Please enter your country.';
      } else if (input.type === 'email') {
        err.textContent = 'Please enter a valid email address.';
      } else {
        err.textContent = 'This field is required.';
      }
    } else if (err) {
      err.remove();
    }

    return valid;
  }

  function clearValidation(input) {
    input.style.borderColor = '';
  }

  function showError(msg, form) {
    // Remove any previous global error message
    let err = form.querySelector('.checkout-error');
    if (err) err.remove();

    let fields = form.querySelectorAll('input, select');
    fields.forEach(field => {
      // Skip fields that are already valid
      if (validateField(field)) return;

      // Show error for this field
      let fieldError = document.createElement('div');
      fieldError.className = 'field-error';
      fieldError.style.color = '#e74c3c';
      fieldError.style.fontSize = '13px';
      fieldError.style.marginTop = '4px';
      fieldError.textContent = 'This field is required.';
      field.parentElement.appendChild(fieldError);
    });
  }

  function removeError(form) {
    let err = form.querySelector('.checkout-error');
    if (err) err.remove();
  }

  // --- Attach validation to all fields ---
  function attachLiveValidation(form) {
    form.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', function() {
        validateField(input);
        removeError(form);
      });
      input.addEventListener('blur', function() {
        validateField(input);
      });
    });
  }

    // Attach checkout button handler after summary is rendered
    function attachCheckoutHandler() {
      var completeBtn = document.querySelector('.checkout-btn');
      if (completeBtn) {
        completeBtn.onclick = function(e) {
          e.preventDefault();
          var form = document.querySelector('.checkout-form form');
          if (!form) return;

          // Remove global error message under the button
          let err = form.querySelector('.checkout-error');
          if (err) err.remove();

          // Validate billing fields
          let valid = true;
          let requiredInputs = [
            form.querySelector('input[type="email"]'),
            form.querySelector('input[placeholder="Enter first name"]'),
            form.querySelector('input[placeholder="Enter last name"]'),
            form.querySelector('input[placeholder="Enter address"]'),
            form.querySelector('select[name="state"], #state'),
            form.querySelector('input[name="country"], #country'),
            form.querySelector('input[placeholder="Enter city name"]'),
            form.querySelector('input[placeholder="Enter zip code"]'),
            form.querySelector('input[placeholder="Enter phone number"]')
          ];
          requiredInputs.forEach(input => {
            if (!input) return;
            // Phone number: required and pattern validation
            if (
              input.getAttribute('placeholder') === 'Enter phone number'
            ) {
              const phoneVal = input.value.trim();
              const phonePattern = /^[0-9\-\+\s]{10,15}$/;
              if (!phoneVal || !phonePattern.test(phoneVal)) {
                input.style.borderColor = '#e74c3c';
                let err = input.parentElement.querySelector('.field-error');
                if (!err) {
                  err = document.createElement('div');
                  err.className = 'field-error';
                  err.style.color = '#e74c3c';
                  err.style.fontSize = '13px';
                  err.style.marginTop = '4px';
                  input.parentElement.appendChild(err);
                }
                err.textContent = 'Please enter a valid phone number (10 digits).';
                valid = false;
                return;
              } else {
                input.style.borderColor = '#2ecc40';
                let err = input.parentElement.querySelector('.field-error');
                if (err) err.remove();
              }
            } else {
              if (!validateField(input)) valid = false;
            }
          });

          // If shipping info is shown, validate those fields too
          if (shipDiffCheckbox && shipDiffCheckbox.checked && shippingInfoBlock) {
            let shippingInputs = [
              shippingInfoBlock.querySelector('input[placeholder="Enter first name"]'),
              shippingInfoBlock.querySelector('input[placeholder="Enter last name"]'),
              shippingInfoBlock.querySelector('input[placeholder="Enter address"]'),
              shippingInfoBlock.querySelector('select[name="shipping-state"], #shipping-state'),
              shippingInfoBlock.querySelector('input[name="shipping-country"], #shipping-country'),
              shippingInfoBlock.querySelector('input[placeholder="Enter city name"]'),
              shippingInfoBlock.querySelector('input[placeholder="Enter zip code"]'),
              shippingInfoBlock.querySelector('input[placeholder="Enter phone number"]')
            ];
            shippingInputs.forEach(input => {
              if (!input) return;
              // Phone number: required and pattern validation
              if (
                input.getAttribute('placeholder') === 'Enter phone number'
              ) {
                const phoneVal = input.value.trim();
                const phonePattern = /^[0-9\-\+\s]{10,15}$/;
                if (!phoneVal || !phonePattern.test(phoneVal)) {
                  input.style.borderColor = '#e74c3c';
                  let err = input.parentElement.querySelector('.field-error');
                  if (!err) {
                    err = document.createElement('div');
                    err.className = 'field-error';
                    err.style.color = '#e74c3c';
                    err.style.fontSize = '13px';
                    err.style.marginTop = '4px';
                    input.parentElement.appendChild(err);
                  }
                  err.textContent = 'Please enter a valid phone number (10 digits).';
                  valid = false;
                  return;
                } else {
                  input.style.borderColor = '#2ecc40';
                  let err = input.parentElement.querySelector('.field-error');
                  if (err) err.remove();
                }
              } else {
                if (!validateField(input)) valid = false;
              }
            });
          }

          if (!valid) {
            // Do NOT show global error message under the button
            return;
          }

          // --- Get billing fields ---
          // Try to get country from input, then from select, else empty string
          let countryInput = form.querySelector('input[name="country"], #country');
          let countrySelect = form.querySelector('select[name="country"], #country');
          let countryValue = '';
          if (countryInput && countryInput.value.trim()) {
            countryValue = countryInput.value.trim();
          } else if (countrySelect && countrySelect.value && countrySelect.value !== 'Select country') {
            countryValue = countrySelect.value;
          }

          var billing = {
            email: form.querySelector('input[type="email"]')?.value || '',
            firstName: form.querySelector('input[placeholder="Enter first name"]')?.value || '',
            lastName: form.querySelector('input[placeholder="Enter last name"]')?.value || '',
            address: form.querySelector('input[placeholder="Enter address"]')?.value || '',
            address2: form.querySelector('input[placeholder="Enter address 2"]')?.value || '',
            country: countryValue,
            state: form.querySelector('select[name="state"], #state')?.value || '',
            city: form.querySelector('input[placeholder="Enter city name"]')?.value || '',
            postcode: form.querySelector('input[placeholder="Enter zip code"]')?.value || '',
            phone: form.querySelector('input[placeholder="Enter phone number"]')?.value || ''
          };

          // --- Get shipping fields (if ship-diff checked) ---
          var shipping = {};
          if (shipDiffCheckbox && shipDiffCheckbox.checked) {
            var shipBlock = form.querySelector('.form-block.shipping-info');
            let shipCountryInput = shipBlock?.querySelector('input[name="shipping-country"], #shipping-country');
            let shipCountrySelect = shipBlock?.querySelector('select[name="shipping-country"], #shipping-country');
            let shipCountryValue = '';
            if (shipCountryInput && shipCountryInput.value.trim()) {
              shipCountryValue = shipCountryInput.value.trim();
            } else if (shipCountrySelect && shipCountrySelect.value && shipCountrySelect.value !== 'Select country') {
              shipCountryValue = shipCountrySelect.value;
            }
            shipping.firstName = shipBlock?.querySelector('input[placeholder="Enter first name"]')?.value || '';
            shipping.lastName = shipBlock?.querySelector('input[placeholder="Enter last name"]')?.value || '';
            shipping.address = shipBlock?.querySelector('input[placeholder="Enter address"]')?.value || '';
            shipping.address2 = shipBlock?.querySelector('input[placeholder="Enter address 2"]')?.value || '';
            shipping.country = shipCountryValue;
            shipping.state = shipBlock?.querySelector('select[name="shipping-state"], #shipping-state')?.value || '';
            shipping.city = shipBlock?.querySelector('input[placeholder="Enter city name"]')?.value || '';
            shipping.postcode = shipBlock?.querySelector('input[placeholder="Enter zip code"]')?.value || '';
            shipping.phone = shipBlock?.querySelector('input[placeholder="Enter phone number"]')?.value || '';
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

          // --- Remove only purchased items from cartProducts and update cart count ---
          try {
            let cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
            if (Array.isArray(cartProducts) && summary.items && Array.isArray(summary.items)) {
              summary.items.forEach(purchased => {
                cartProducts = cartProducts.filter(cartItem => {
                  // Remove if id and size both match
                  return !(cartItem.id === purchased.id && cartItem.size === purchased.size);
                });
              });
              localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
              // Update cart count UI if function exists
              if (typeof window.updateCartCount === 'function') window.updateCartCount();
            }
          } catch (e) {}

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

    // Attach live validation to all fields
    var form = document.querySelector('.checkout-form form');
    if (form) attachLiveValidation(form);
  });


  /**
 * Render the checkout summary in the checkout page.
 * Call this on checkout.html after DOMContentLoaded.
 * Expects a container with class "checkout-summary" and a child ".summary-box".
 * Shows product image, title, size, qty, price, discount per item, and totals.
 */
function renderCheckoutSummaryBox() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  if (!summary || !summary.items) return;
  const summaryBox = document.querySelector('.checkout-summary .summary-box');
  if (!summaryBox) return;

  // Build order summary items with discount per item
  let itemsHtml = '';
  summary.items.forEach((item, idx) => {
    const itemDiscount = (item.original_price - item.price) * item.qty;
    itemsHtml += `
      <div class="summary-item" data-idx="${idx}">
        <button class="remove-order-item" title="Remove item" type="button">×</button>
        <img src="${item.image}" alt="${item.title}" />
        <div>
          <p>${item.title}${item.size ? ' (' + item.size + ')' : ''} × ${item.qty}</p>
        </div>
        <span>
          <del style="color:#888;font-size:13px;">₹${(item.original_price * item.qty).toLocaleString()}</del>
          <strong style="margin-left:5px;">₹${(item.price * item.qty).toLocaleString()}</strong>
        </span>
      </div>
    `;
  });

  // Build summary list
  let summaryListHtml = `
    <ul class="summary-list">
      <li><span>Free shipping</span></li>
      <li><span>Discount</span> <strong>- ₹${summary.totalDiscount.toLocaleString()}</strong></li>
      <li><span>Platform charge</span> ₹${summary.platformFees.toLocaleString()}</li>
      <li><span>Cash on Delivery</span></li>
    </ul>
  `;

  // Build total
  let totalHtml = `
    <div class="summary-total">
      <p>Total</p>
      <strong>₹${summary.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
    </div>
  `;

  // Find secure note and checkout button if present
  const secureNote = summaryBox.querySelector('.secure-note') ? summaryBox.querySelector('.secure-note').outerHTML : '';
  const checkoutBtn = summaryBox.querySelector('.checkout-btn') ? summaryBox.querySelector('.checkout-btn').outerHTML : '';

  // Render everything
  summaryBox.innerHTML = `
    <h3>Order Summary</h3>
    ${itemsHtml}
    ${summaryListHtml}
    ${totalHtml}
    ${checkoutBtn || ''}
    ${secureNote || ''}
  `;

  // Attach remove logic for sidebar summary
  summaryBox.querySelectorAll('.summary-item .remove-order-item').forEach(btn => {
    btn.onclick = function(e) {
      const itemDiv = btn.closest('.summary-item');
      if (!itemDiv) return;
      const idx = parseInt(itemDiv.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && typeof window.removeSummaryItem === 'function') {
        window.removeSummaryItem(idx);
      }
    };
  });
}

// Expose globally for checkout.html
window.renderCheckoutSummaryBox = renderCheckoutSummaryBox;

// When rendering the cart summary table rows, ensure the remove button is always enabled,
// even if there is only one item in the cart.
function renderCartSummaryTableRows(tbodySelector = '#cart-tbody', totalSelector = '#cart-total') {
  const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  const tbody = document.querySelector(tbodySelector);
  // ...existing code...
  fetchAllProducts().then(products => {
    cart.forEach((item, idx) => {
      // ...existing code...
      const tr = document.createElement('tr');
      tr.className = 'cart-summary__item';
      tr.setAttribute('data-product-id', item.id);
      tr.setAttribute('data-size', item.size || '');

      tr.innerHTML = `
        <td data-label="Product">
          <div class="product-details">
            <img src="${item.image}" alt="Product Image" />
            <div class="product-info">
              <p class="product-title">${item.title}</p>
              <div class="sizes" data-sizes='${JSON.stringify(allSizes)}' data-selected="${item.size || ''}"></div>
            </div>
          </div>
        </td>
        <td data-label="Price">
          <span class="product-price">
            <del>₹${regularPrice.toLocaleString()}</del>
          </span>
        </td>
        <td data-label="Quantity">
          <span class="quantity-selector"></span>
        </td>
        <td data-label="Subtotal">
          <span class="subtotal">₹${itemSubtotal.toLocaleString()}</span>
        </td>
        <td data-label="Action">
          <span class="actions">
            <button class="remove-btn">×</button>
          </span>
        </td>
      `;
      tbody.appendChild(tr);

      // ...existing code for sizes and quantity...

      // Remove button
      const removeBtn = tr.querySelector('.remove-btn');
      if (removeBtn) {
        removeBtn.onclick = function() {
          let cartArr = JSON.parse(localStorage.getItem('cartProducts') || '[]');
          // Always allow removing the item, even if it's the last one
          cartArr = cartArr.filter(ci => !(ci.id === item.id && ci.size === item.size));
          localStorage.setItem('cartProducts', JSON.stringify(cartArr));
          tr.remove();
          renderCartSummaryTableRows(tbodySelector, totalSelector);
          updateCartCount();
        };
      }
    });

    // ...existing code for totals...
  });
}
