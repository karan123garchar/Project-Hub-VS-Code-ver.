/* =============================================
   search.js – Search Results page logic
============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== MOBILE FILTER SIDEBAR TOGGLE =====
  const filterToggle = document.getElementById('filterToggle');
  const sidebar = document.getElementById('sidebar');

  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Backdrop click to close sidebar on mobile
    document.addEventListener('click', (e) => {
      if (
        window.innerWidth <= 900 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !filterToggle.contains(e.target)
      ) {
        sidebar.classList.remove('open');
      }
    });
  }

  // ===== SHOW NAV SEARCH ON SEARCH PAGE =====
  const navSearchWrap = document.getElementById('navSearchWrap');
  if (navSearchWrap) {
    navSearchWrap.style.display = 'flex';
  }

  // ===== FILTER CHECKBOXES INTERACTION =====
  document.querySelectorAll('.filter-check').forEach(label => {
    label.addEventListener('click', function () {
      const box = this.querySelector('.check-box');
      const dot = this.querySelector('.check-dot');

      if (this.classList.contains('checked')) {
        this.classList.remove('checked');
        if (dot) dot.remove();
      } else {
        this.classList.add('checked');
        if (!dot) {
          const newDot = document.createElement('div');
          newDot.className = 'check-dot';
          box.appendChild(newDot);
        }
      }
      // Simulate filter applied feedback
      updateResultCount();
    });
  });

  // ===== LANGUAGE PILLS TOGGLE =====
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', function () {
      this.classList.toggle('active');
      updateResultCount();
    });
  });

  // ===== CLEAR ALL FILTERS =====
  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      // Remove all checked states
      document.querySelectorAll('.filter-check.checked').forEach(el => {
        el.classList.remove('checked');
        const dot = el.querySelector('.check-dot');
        if (dot) dot.remove();
      });
      document.querySelectorAll('.pill.active').forEach(p => p.classList.remove('active'));
      updateResultCount(1240);
    });
  }

  // Simulate result count update
  function updateResultCount(count) {
    const titleEl = document.querySelector('.results-title');
    if (!titleEl) return;
    const active = document.querySelectorAll('.filter-check.checked, .pill.active').length;
    const base = count || 1240;
    const displayed = count || Math.max(base - active * 87, 42);
    titleEl.innerHTML = `Showing ${displayed.toLocaleString()} results for <em class="gold">"Fintech"</em>`;
  }

  // ===== GRID / LIST VIEW TOGGLE =====
  const resultsGrid = document.getElementById('resultsGrid');
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      if (resultsGrid) {
        resultsGrid.classList.toggle('list-view', this.dataset.view === 'list');
      }
    });
  });

  // ===== PAGINATION =====
  let currentPage = 1;
  const totalPages = 10;

  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', function () {
      setPage(parseInt(this.dataset.page, 10));
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) setPage(currentPage - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) setPage(currentPage + 1);
    });
  }

  function setPage(page) {
    currentPage = page;
    document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.page) === currentPage);
    });
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;

    // Scroll to top of results
    const main = document.querySelector('.search-main');
    if (main) main.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Animate cards out and back in
    if (resultsGrid) {
      resultsGrid.style.opacity = '0';
      resultsGrid.style.transform = 'translateY(12px)';
      setTimeout(() => {
        resultsGrid.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        resultsGrid.style.opacity = '1';
        resultsGrid.style.transform = '';
      }, 120);
    }
  }

  // ===== SORT SELECT ANIMATION =====
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      if (resultsGrid) {
        resultsGrid.style.opacity = '0';
        resultsGrid.style.transform = 'translateY(8px)';
        setTimeout(() => {
          resultsGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          resultsGrid.style.opacity = '1';
          resultsGrid.style.transform = '';
        }, 180);
      }
    });
  }

  // ===== NAV SEARCH ENTER =====
  const navSearch = document.getElementById('navSearch');
  if (navSearch) {
    navSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = navSearch.value.trim();
        const titleEl = document.querySelector('.results-title');
        if (titleEl && q) {
          titleEl.innerHTML = `Showing results for <em class="gold">"${q}"</em>`;
        }
      }
    });
  }

});
