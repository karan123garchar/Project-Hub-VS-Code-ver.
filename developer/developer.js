/* =============================================
   developer.js – Developer Portal Scripts
============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // Tech Tag Selector
  document.querySelectorAll('.tech-tag-select').forEach(tag => {
    tag.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });

  // Price Calculation Breakdown (Upload Page)
  const priceInput = document.getElementById('projectPrice');
  const earningsPreview = document.getElementById('earningsPreview');
  if (priceInput && earningsPreview) {
    const updateEarnings = () => {
      const price = parseFloat(priceInput.value) || 0;
      const devShare = (price * 0.90).toFixed(2);
      const fee = (price * 0.10).toFixed(2);
      earningsPreview.innerHTML = `You receive <strong>$${devShare}</strong> (90%) per sale. ProjectHub fee: $${fee} (10%).`;
    };
    priceInput.addEventListener('input', updateEarnings);
    updateEarnings();
  }

  // Multi-step Application Wizard (join.html)
  const stepForms = document.querySelectorAll('.wizard-step');
  const stepIndicators = document.querySelectorAll('.step-item');
  const nextBtn = document.getElementById('wizardNextBtn');
  const prevBtn = document.getElementById('wizardPrevBtn');
  let currentStep = 1;

  if (stepForms.length && nextBtn) {
    const showStep = (step) => {
      stepForms.forEach((sf, idx) => {
        sf.style.display = (idx + 1 === step) ? 'block' : 'none';
      });
      stepIndicators.forEach((si, idx) => {
        si.classList.remove('active', 'completed');
        if (idx + 1 < step) si.classList.add('completed');
        if (idx + 1 === step) si.classList.add('active');
      });

      if (prevBtn) prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
      if (step === stepForms.length) {
        nextBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;margin-right:6px;">send</span> Submit Application';
      } else {
        nextBtn.innerHTML = 'Continue &rarr;';
      }
    };

    nextBtn.addEventListener('click', () => {
      if (currentStep < stepForms.length) {
        currentStep++;
        showStep(currentStep);
      } else {
        // Final submit
        nextBtn.disabled = true;
        nextBtn.innerHTML = '<span class="material-symbols-outlined" style="animation:spin 1s linear infinite;">sync</span> Submitting...';
        setTimeout(() => {
          document.getElementById('joinFormContainer').innerHTML = `
            <div style="text-align:center;padding:40px 20px;">
              <span class="material-symbols-outlined" style="font-size:64px;color:var(--color-gold);margin-bottom:16px;">verified</span>
              <h2 style="font-family:var(--font-display);font-size:28px;margin-bottom:12px;">Application Received!</h2>
              <p style="color:#666;max-width:500px;margin:0 auto 24px;font-size:15px;">
                Our technical board will review your GitHub repositories and verified code samples within 24 hours. Once approved, your developer studio will be activated.
              </p>
              <a href="dashboard.html" class="btn-primary" style="padding:12px 28px;">Preview Developer Studio &rarr;</a>
            </div>
          `;
        }, 1200);
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
        }
      });
    }
  }

  // Dropzone drag-and-drop feedback
  const dropzone = document.getElementById('projectDropzone');
  const fileInput = document.getElementById('projectZipFile');
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        dropzone.innerHTML = `
          <span class="material-symbols-outlined" style="font-size:40px;color:#2e7d32;">check_circle</span>
          <p style="font-weight:600;margin-top:8px;">${fileInput.files[0].name}</p>
          <span style="font-size:12px;color:#777;">(${(fileInput.files[0].size / 1024 / 1024).toFixed(2)} MB archive ready)</span>
        `;
      }
    });
  }

  // Payout Modal
  const payoutBtn = document.getElementById('requestPayoutBtn');
  const payoutModal = document.getElementById('payoutModal');
  const closePayout = document.getElementById('closePayoutModal');
  const confirmPayout = document.getElementById('confirmPayoutBtn');

  if (payoutBtn && payoutModal) {
    payoutBtn.addEventListener('click', () => payoutModal.classList.add('open'));
    if (closePayout) closePayout.addEventListener('click', () => payoutModal.classList.remove('open'));
    payoutModal.addEventListener('click', (e) => {
      if (e.target === payoutModal) payoutModal.classList.remove('open');
    });
    if (confirmPayout) {
      confirmPayout.addEventListener('click', () => {
        confirmPayout.innerHTML = 'Processing...';
        setTimeout(() => {
          payoutModal.classList.remove('open');
          confirmPayout.innerHTML = 'Transfer Initiated';
          showDevToast('Payout of $8,420.00 initiated via Stripe Connect');
        }, 1000);
      });
    }
  }

});

function showDevToast(msg) {
  let toast = document.getElementById('devToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'devToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined" style="color:var(--color-gold);">payments</span> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
