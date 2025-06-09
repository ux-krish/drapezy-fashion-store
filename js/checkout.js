function renderCheckoutSummary() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv) return;
  if (!summary || !summary.items || summary.items.length === 0) {
    summaryDiv.innerHTML = '<div style="padding:24px;text-align:center;color:#888;">No products in order summary.</div>';
    return;
  }
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  let html = '<table class="order-summary-table"><thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  summary.items.forEach((item, idx) => {
    let allSizes = [];
    let cartProd = cartProducts.find(p => p.id === item.id);
    if (cartProd && Array.isArray(cartProd.sizes)) {
      allSizes = cartProd.sizes;
    } else if (item.sizes && Array.isArray(item.sizes)) {
      allSizes = item.sizes;
    } else if (item.size) {
      allSizes = [item.size];
    }
    allSizes = Array.from(new Set(allSizes));
    let sizeSelect = `<select class="order-size-select" data-idx="${idx}">`;
    allSizes.forEach(sz => {
      sizeSelect += `<option value="${sz}"${sz === item.size ? ' selected' : ''}>${sz}</option>`;
    });
    sizeSelect += '</select>';
    let qtyInput = `<input type="number" min="1" class="order-qty-input" data-idx="${idx}" value="${item.qty}" style="width:48px;text-align:center;margin-left:8px;">`;
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

  summaryDiv.querySelectorAll('.remove-order-item').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const idx = parseInt(anchor.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && typeof window.removeSummaryItem === 'function') {
        window.removeSummaryItem(idx);
        if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
      }
    });
  });



  summaryDiv.querySelectorAll('.order-size-select').forEach(function(select) {
    select.addEventListener('change', function() {
      let idx = parseInt(this.getAttribute('data-idx'), 10);
      let val = this.value;
      let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
      if (!summary || !summary.items || !summary.items[idx]) return;
      summary.items[idx].size = val;
      localStorage.setItem('checkoutSummary', JSON.stringify(summary));
      renderCheckoutSummary();
      if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
    });
  });

  if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
}
document.addEventListener('DOMContentLoaded', renderCheckoutSummary);


document.addEventListener('DOMContentLoaded', function() {
  if (typeof window.renderCheckoutSummary === 'function') {
    window.renderCheckoutSummary();
  }

    var shipDiffCheckbox = document.getElementById('ship-diff-checkbox') || document.querySelector('.ship-diff input[type="checkbox"]');
    var shippingInfoBlock = document.querySelector('.form-block.shipping-info');
    if (shipDiffCheckbox && shippingInfoBlock) {
      function toggleShippingInfo() {
        shippingInfoBlock.style.display = shipDiffCheckbox.checked ? '' : 'none';
      }
      shipDiffCheckbox.addEventListener('change', toggleShippingInfo);
      toggleShippingInfo();
    }

  function validateField(input) {
    const value = input.value.trim();
    let valid = true;
    if (input.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('state')) {
      valid = value && value !== '' && value !== 'Select state';
    } else if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('country')) {
      valid = value && value !== '' && value !== 'Select country';
    } else if (
      (input.name && input.name.toLowerCase().includes('country')) ||
      (input.id && input.id.toLowerCase().includes('country'))
    ) {
      valid = !!value;
    } else {
      valid = !!value;
    }
    input.style.borderColor = valid ? '#2ecc40' : '#e74c3c';

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
    let err = form.querySelector('.checkout-error');
    if (err) err.remove();

    let fields = form.querySelectorAll('input, select');
    fields.forEach(field => {
      if (validateField(field)) return;

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

    function attachCheckoutHandler() {
      var completeBtn = document.querySelector('.checkout-btn');
      if (completeBtn) {
        completeBtn.onclick = function(e) {
          e.preventDefault();
          var form = document.querySelector('.checkout-form form');
          if (!form) return;

          let err = form.querySelector('.checkout-error');
          if (err) err.remove();

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
            return;
          }

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

          var summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
          var orderId = 'ORD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
          var orderDate = new Date().toISOString();

          var orderData = {
            orderId: orderId,
            orderDate: orderDate,
            billing: billing,
            shipping: shipping,
            summary: summary
          };
          localStorage.setItem('orderData', JSON.stringify(orderData));

          try {
            let cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
            if (Array.isArray(cartProducts) && summary.items && Array.isArray(summary.items)) {
              summary.items.forEach(purchased => {
                cartProducts = cartProducts.filter(cartItem => {
                  return !(cartItem.id === purchased.id && cartItem.size === purchased.size);
                });
              });
              localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
              if (typeof window.updateCartCount === 'function') window.updateCartCount();
            }
          } catch (e) {}

          window.location.href = 'order-confirm.html';
        };
      }
    }

    attachCheckoutHandler();
    var summaryBox = document.querySelector('.checkout-summary .summary-box');
    if (summaryBox) {
      var observer = new MutationObserver(function() {
        attachCheckoutHandler();
      });
      observer.observe(summaryBox, { childList: true, subtree: true });
    }

    var form = document.querySelector('.checkout-form form');
    if (form) attachLiveValidation(form);
  });

window.removeSummaryItem = function(idx) {
  let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  if (!summary || !summary.items || !summary.items[idx]) return;
  summary.items.splice(idx, 1);
  if (summary.items.length > 0) {
    summary.subtotal = summary.items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
    summary.totalDiscount = summary.items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
    summary.total = summary.items.reduce((sum, item) => sum + (item.price * item.qty), 0) + (summary.platformFees || 5);
  } else {
    summary.items = [];
    summary.subtotal = 0;
    summary.totalDiscount = 0;
    summary.platformFees = 5;
    summary.total = 0;
  }
  localStorage.setItem('checkoutSummary', JSON.stringify(summary));
  renderCheckoutSummary();
  if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
};

function renderCheckoutSummary() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv) return;
  if (!summary || !summary.items || summary.items.length === 0) {
    summaryDiv.innerHTML = '<div style="padding:24px;text-align:center;color:#888;">No products in order summary.</div>';
    return;
  }
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  let html = '<table class="order-summary-table"><thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  summary.items.forEach((item, idx) => {
    let allSizes = [];
    let cartProd = cartProducts.find(p => p.id === item.id);
    if (cartProd && Array.isArray(cartProd.sizes)) {
      allSizes = cartProd.sizes;
    } else if (item.sizes && Array.isArray(item.sizes)) {
      allSizes = item.sizes;
    } else if (item.size) {
      allSizes = [item.size];
    }
    allSizes = Array.from(new Set(allSizes));
    let sizeSelect = `<select class="order-size-select" data-idx="${idx}">`;
    allSizes.forEach(sz => {
      sizeSelect += `<option value="${sz}"${sz === item.size ? ' selected' : ''}>${sz}</option>`;
    });
    sizeSelect += '</select>';
    let qtyInput = `<input type="number" min="1" class="order-qty-input" data-idx="${idx}" value="${item.qty}" style="width:48px;text-align:center;margin-left:8px;">`;
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

  summaryDiv.querySelectorAll('.remove-order-item').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const idx = parseInt(anchor.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && typeof window.removeSummaryItem === 'function') {
        window.removeSummaryItem(idx);
        if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
      }
    });
  });

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
      summary.subtotal = summary.items.reduce((sum, item) => sum + (item.original_price * item.qty), 0);
      summary.totalDiscount = summary.items.reduce((sum, item) => sum + ((item.original_price - item.price) * item.qty), 0);
      summary.total = summary.items.reduce((sum, item) => sum + (item.price * item.qty), 0) + (summary.platformFees || 5);
      localStorage.setItem('checkoutSummary', JSON.stringify(summary));
      renderCheckoutSummary();
      if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
    });
  });

  summaryDiv.querySelectorAll('.order-size-select').forEach(function(select) {
    select.addEventListener('change', function() {
      let idx = parseInt(this.getAttribute('data-idx'), 10);
      let val = this.value;
      let summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
      if (!summary || !summary.items || !summary.items[idx]) return;
      summary.items[idx].size = val;
      localStorage.setItem('checkoutSummary', JSON.stringify(summary));
      renderCheckoutSummary();
      if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
    });
  });

  if (typeof window.renderCheckoutSummaryBox === 'function') window.renderCheckoutSummaryBox();
}
document.addEventListener('DOMContentLoaded', renderCheckoutSummary);

  document.addEventListener('DOMContentLoaded', function() {
    if (window.renderCheckoutSummaryBox) window.renderCheckoutSummaryBox();

    var shipDiffCheckbox = document.getElementById('ship-diff-checkbox') || document.querySelector('.ship-diff input[type="checkbox"]');
    var shippingInfoBlock = document.querySelector('.form-block.shipping-info');
    if (shipDiffCheckbox && shippingInfoBlock) {
      function toggleShippingInfo() {
        shippingInfoBlock.style.display = shipDiffCheckbox.checked ? '' : 'none';
      }
      shipDiffCheckbox.addEventListener('change', toggleShippingInfo);
      toggleShippingInfo();
    }

  function validateField(input) {
  const value = input.value.trim();
  let valid = true;
  if (input.type === 'email') {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  } else if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('state')) {
    valid = value && value !== '' && value !== 'Select state';
  } else if (input.tagName === 'SELECT' && input.name && input.name.toLowerCase().includes('country')) {
    valid = value && value !== '' && value !== 'Select country';
  } else if (
    (input.name && input.name.toLowerCase().includes('country')) ||
    (input.id && input.id.toLowerCase().includes('country'))
  ) {
    valid = !!value;
  } else {
    valid = !!value;
  }

  if (input.type !== 'checkbox') {
    input.style.borderColor = valid ? '#2ecc40' : '#e74c3c';
  } else {
    input.style.borderColor = ''; 
  }

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
    let err = form.querySelector('.checkout-error');
    if (err) err.remove();

    let fields = form.querySelectorAll('input, select');
    fields.forEach(field => {
      if (validateField(field)) return;

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

    function attachCheckoutHandler() {
      var completeBtn = document.querySelector('.checkout-btn');
      if (completeBtn) {
        completeBtn.onclick = function(e) {
          e.preventDefault();
          var form = document.querySelector('.checkout-form form');
          if (!form) return;

          let err = form.querySelector('.checkout-error');
          if (err) err.remove();

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
            return;
          }

          
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

          var summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
          var orderId = 'ORD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
          var orderDate = new Date().toISOString();

          var orderData = {
            orderId: orderId,
            orderDate: orderDate,
            billing: billing,
            shipping: shipping,
            summary: summary
          };
          localStorage.setItem('orderData', JSON.stringify(orderData));

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
              if (typeof window.updateCartCount === 'function') window.updateCartCount();
            }
          } catch (e) {}

          window.location.href = 'order-confirm.html';
        };
      }
    }

    attachCheckoutHandler();
    var summaryBox = document.querySelector('.checkout-summary .summary-box');
    if (summaryBox) {
      var observer = new MutationObserver(function() {
        attachCheckoutHandler();
      });
      observer.observe(summaryBox, { childList: true, subtree: true });
    }

    var form = document.querySelector('.checkout-form form');
    if (form) attachLiveValidation(form);
  });


function renderCheckoutSummaryBox() {
  const summary = JSON.parse(localStorage.getItem('checkoutSummary') || '{}');
  if (!summary || !summary.items) return;
  const summaryBox = document.querySelector('.checkout-summary .summary-box');
  if (!summaryBox) return;

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

  let summaryListHtml = `
    <ul class="summary-list">
      <li><span>Free shipping</span></li>
      <li><span>Discount</span> <strong>- ₹${summary.totalDiscount.toLocaleString()}</strong></li>
      <li><span>Platform charge</span> ₹${summary.platformFees.toLocaleString()}</li>
      <li><span>Cash on Delivery</span></li>
    </ul>
  `;

  let totalHtml = `
    <div class="summary-total">
      <p>Total</p>
      <strong>₹${summary.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
    </div>
  `;

  const secureNote = summaryBox.querySelector('.secure-note') ? summaryBox.querySelector('.secure-note').outerHTML : '';
  const checkoutBtn = summaryBox.querySelector('.checkout-btn') ? summaryBox.querySelector('.checkout-btn').outerHTML : '';

  summaryBox.innerHTML = `
    <h3>Order Summary</h3>
    ${itemsHtml}
    ${summaryListHtml}
    ${totalHtml}
    ${checkoutBtn || ''}
    ${secureNote || ''}
  `;

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

window.renderCheckoutSummaryBox = renderCheckoutSummaryBox;

function renderCartSummaryTableRows(tbodySelector = '#cart-tbody', totalSelector = '#cart-total') {
  const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
  const tbody = document.querySelector(tbodySelector);
  fetchAllProducts().then(products => {
    cart.forEach((item, idx) => {
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

      const removeBtn = tr.querySelector('.remove-btn');
      if (removeBtn) {
        removeBtn.onclick = function() {
          let cartArr = JSON.parse(localStorage.getItem('cartProducts') || '[]');
          cartArr = cartArr.filter(ci => !(ci.id === item.id && ci.size === item.size));
          localStorage.setItem('cartProducts', JSON.stringify(cartArr));
          tr.remove();
          renderCartSummaryTableRows(tbodySelector, totalSelector);
          updateCartCount();
        };
      }
    });

  });
}
