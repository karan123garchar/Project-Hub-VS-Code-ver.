/* =============================================
   user.js – Normal User / Client Portal Scripts
============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // Copy License Key Functionality
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const codeEl = this.closest('.license-box').querySelector('code');
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.innerText).then(() => {
          showToast('License key copied to clipboard!');
          const orig = this.innerHTML;
          this.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">check</span>';
          setTimeout(() => { this.innerHTML = orig; }, 1500);
        });
      }
    });
  });

  // Download Simulation
  document.querySelectorAll('.download-code-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const title = this.dataset.title || 'Codebase Package';
      const origText = this.innerHTML;
      this.disabled = true;
      this.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;animation:spin 1s linear infinite;">sync</span> Downloading...';

      setTimeout(() => {
        this.innerHTML = origText;
        this.disabled = false;
        showToast(`Downloaded verified build for ${title}`);
      }, 1200);
    });
  });

  // Tab Filtering
  const tabBtns = document.querySelectorAll('.user-tab-btn');
  const cards = document.querySelectorAll('.order-card');
  if (tabBtns.length && cards.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.tab;

        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'grid';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

});

// Global toast helper
function showToast(msg) {
  let toast = document.getElementById('userToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'userToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined" style="color:var(--color-gold);">verified</span> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
