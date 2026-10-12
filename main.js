/* =============================================
   main.js – Shared across both pages
============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      hamburger.classList.toggle('is-open');
      if (hamburger.classList.contains('is-open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('is-open');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = ''; s.style.opacity = '';
        });
      }
    });
  }

  // ===== NAVBAR SCROLL SHADOW =====
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,0.08)'
        : '0 1px 3px rgba(0,0,0,0.06)';
    }, { passive: true });
  }

  // ===== REVEAL ON SCROLL (IntersectionObserver) =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger each card slightly
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, (entry.target.dataset.delay || 0));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el, i) => {
      el.dataset.delay = (i % 3) * 80; // stagger within rows
      observer.observe(el);
    });
  }

  // ===== STAT COUNTER ANIMATION (index.html) =====
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNums.forEach(el => statObserver.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '+';
    const duration = 1800;
    const start = performance.now();
    const isPercent = suffix === '%';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 1000) {
        el.textContent = Math.floor(current / 1000) + 'k' + suffix;
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) requestAnimationFrame(update);
      else {
        if (target >= 1000) el.textContent = Math.floor(target / 1000) + 'k+';
        else el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // ===== SEARCH HERO FOCUS EFFECT =====
  const heroSearch = document.getElementById('heroSearch');
  const searchBox  = document.getElementById('searchBox');
  if (heroSearch && searchBox) {
    heroSearch.addEventListener('focus', () => {
      searchBox.style.transform = 'scale(1.02)';
    });
    heroSearch.addEventListener('blur', () => {
      searchBox.style.transform = '';
    });
    heroSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') window.location.href = 'search.html';
    });
  }

  // ===== JOIN BUTTON RIPPLE =====
  document.querySelectorAll('.btn-primary, .btn-gold').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        border-radius:50%;background:rgba(255,255,255,0.25);
        top:${e.clientY - rect.top - size/2}px;
        left:${e.clientX - rect.left - size/2}px;
        transform:scale(0);animation:ripple 0.5s ease-out forwards;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe dynamically
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `@keyframes ripple { to { transform:scale(3); opacity:0; } }`;
    document.head.appendChild(style);
  }

  // ===== UNIVERSAL 3-ROLE MANAGEMENT SYSTEM =====
  initUniversalRoleSystem();

  // ===== SPLASH SCREEN CONTROLLER =====
  initSplashOverlay();
});

/**
 * Universal 3-Role Structure Logic:
 * - user: Can only browse and send inquiries. Post project triggers "Start as Developer" modal.
 * - developer: Can post project (opens developer/upload.html), manage developer studio.
 * - admin: Master control (admin/upload-project.html & moderation queue).
 */
function initUniversalRoleSystem() {
  const currentRole = localStorage.getItem('currentUserRole') || 'user';
  
  // Inject Universal Role Bar if not already on the page
  let hud = document.getElementById('roleHudBar');
  if (!hud && !window.location.pathname.includes('/auth/')) {
    hud = document.createElement('div');
    hud.id = 'roleHudBar';
    hud.className = 'role-hud-bar';
    hud.innerHTML = `
      <div class="role-hud-left">
        <span class="role-hud-pill" id="hudRolePill">
          <span class="material-symbols-outlined" style="font-size:14px;">account_circle</span>
          ROLE: <span id="hudRoleName">${currentRole.toUpperCase()}</span>
        </span>
        <div class="role-hud-role-switcher">
          <button type="button" class="role-hud-btn ${currentRole === 'user' ? 'is-active' : ''}" onclick="switchActiveRole('user')">
            <span class="material-symbols-outlined" style="font-size:14px;">person</span> Client (User)
          </button>
          <button type="button" class="role-hud-btn ${currentRole === 'developer' ? 'is-active' : ''}" onclick="switchActiveRole('developer')">
            <span class="material-symbols-outlined" style="font-size:14px;">code</span> Developer
          </button>
          <button type="button" class="role-hud-btn ${currentRole === 'admin' ? 'is-active' : ''}" onclick="switchActiveRole('admin')">
            <span class="material-symbols-outlined" style="font-size:14px;">shield</span> Admin
          </button>
        </div>
      </div>
      <div class="role-hud-right">
        <span style="color:#888;font-size:11px;" id="hudRolePermission">
          ${getRoleSummaryText(currentRole)}
        </span>
        <a href="${getRelativePrefix()}splash.html" class="role-hud-link" title="Replay Splash Screen Animation">
          <span class="material-symbols-outlined" style="font-size:14px;">replay</span> Splash
        </a>
      </div>
    `;
    document.body.insertBefore(hud, document.body.firstChild);
  }

  // Inject Developer Upgrade Modal
  if (!document.getElementById('roleUpgradeModal')) {
    const modalEl = document.createElement('div');
    modalEl.id = 'roleUpgradeModal';
    modalEl.className = 'role-modal-backdrop';
    modalEl.innerHTML = `
      <div class="role-modal-card">
        <button type="button" class="role-modal-close" onclick="closeRoleModal()">
          <span class="material-symbols-outlined" style="font-size:18px;">close</span>
        </button>
        
        <div class="role-modal-emblem">
          <span class="material-symbols-outlined" style="font-size:28px;">engineering</span>
        </div>

        <h2 class="role-modal-title">Start as a Developer to Post Projects</h2>
        <p class="role-modal-desc">
          As a <strong>Client / User</strong>, your workspace is structured for browsing verified enterprise software and sending RFPs or custom inquiries.
          Publishing, licensing, and monetizing codebases requires a <strong>Developer</strong> account.
        </p>

        <div class="role-comparison-grid">
          <div>
            <div class="role-col-title" style="color:#2E7D32;">
              <span class="material-symbols-outlined" style="font-size:16px;">person</span> Client Privileges
            </div>
            <div class="role-col-item"><span class="material-symbols-outlined" style="font-size:14px;color:#2E7D32;">check</span> Browse enterprise software</div>
            <div class="role-col-item"><span class="material-symbols-outlined" style="font-size:14px;color:#2E7D32;">check</span> Send direct inquiries / RFPs</div>
            <div class="role-col-item"><span class="material-symbols-outlined" style="font-size:14px;color:#2E7D32;">check</span> Purchase licenses & downloads</div>
          </div>
          <div>
            <div class="role-col-title" style="color:#C69214;">
              <span class="material-symbols-outlined" style="font-size:16px;">code</span> Developer Privileges
            </div>
            <div class="role-col-item"><span class="material-symbols-outlined" style="font-size:14px;color:#C69214;">check</span> 4-step project upload wizard</div>
            <div class="role-col-item"><span class="material-symbols-outlined" style="font-size:14px;color:#C69214;">check</span> Set pricing & royalties (90%)</div>
            <div class="role-col-item"><span class="material-symbols-outlined" style="font-size:14px;color:#C69214;">check</span> Developer Studio & telemetry</div>
          </div>
        </div>

        <div class="role-modal-actions">
          <button type="button" class="btn-start-dev" onclick="upgradeToDeveloperAndPost()">
            <span class="material-symbols-outlined" style="font-size:18px;">rocket_launch</span>
            <span>Start as Developer &amp; Publish Project</span>
          </button>
          <a href="${getRelativePrefix()}engage-developer.html" class="btn-send-inquiry-sub">
            <span class="material-symbols-outlined" style="font-size:18px;">mail</span>
            <span>Send Project Inquiry as Client Instead</span>
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);
  }

  // Intercept all "Post a Project" buttons across the DOM
  attachPostProjectGuards();
}

function getRelativePrefix() {
  const p = window.location.pathname;
  if (p.includes('/admin/') || p.includes('/developer/') || p.includes('/user/') || p.includes('/auth/')) {
    return '../';
  }
  return '';
}

function getRoleSummaryText(role) {
  if (role === 'developer') return 'Developer Studio &bull; Publish Projects Active';
  if (role === 'admin') return 'Super Admin &bull; Full Platform Moderation & Control';
  return 'Client Mode &bull; Browse Catalog &amp; Send Inquiries';
}

function switchActiveRole(newRole) {
  localStorage.setItem('currentUserRole', newRole);
  const prefix = getRelativePrefix();
  
  if (newRole === 'developer') {
    window.location.href = prefix + 'developer/dashboard.html';
  } else if (newRole === 'admin') {
    window.location.href = prefix + 'admin/index.html';
  } else {
    window.location.href = prefix + 'index.html';
  }
}

function attachPostProjectGuards() {
  const currentRole = localStorage.getItem('currentUserRole') || 'user';
  const postButtons = document.querySelectorAll('a[href*="upload-project.html"], a[href*="upload.html"], .btn-post-project');

  postButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const role = localStorage.getItem('currentUserRole') || 'user';
      if (role === 'user') {
        e.preventDefault();
        openRoleModal();
      } else if (role === 'developer') {
        // Direct to developer upload
        const prefix = getRelativePrefix();
        btn.href = prefix + 'developer/upload.html';
      } else if (role === 'admin') {
        // Direct to admin upload
        const prefix = getRelativePrefix();
        btn.href = prefix + 'admin/upload-project.html';
      }
    });
  });
}

function openRoleModal() {
  const modal = document.getElementById('roleUpgradeModal');
  if (modal) modal.classList.add('is-open');
}

function closeRoleModal() {
  const modal = document.getElementById('roleUpgradeModal');
  if (modal) modal.classList.remove('is-open');
}

function upgradeToDeveloperAndPost() {
  localStorage.setItem('currentUserRole', 'developer');
  const prefix = getRelativePrefix();
  window.location.href = prefix + 'developer/upload.html';
}

// Global Splash Overlay Controller
function initSplashOverlay() {
  const splash = document.getElementById('homepageSplash');
  if (!splash) return;

  // Auto-dismiss after 2.4 seconds
  setTimeout(() => {
    dismissSplash();
  }, 2400);

  // Click anywhere to dismiss immediately
  splash.addEventListener('click', () => {
    dismissSplash();
  });
}

function dismissSplash() {
  const splash = document.getElementById('homepageSplash');
  if (splash) {
    splash.classList.add('is-hidden');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 600);
  }
}

function replaySplashScreen() {
  const splash = document.getElementById('homepageSplash');
  if (splash) {
    splash.style.display = 'flex';
    splash.classList.remove('is-hidden');
    
    // reset animation
    const fill = splash.querySelector('.vertical-fill');
    if (fill) {
      fill.style.animation = 'none';
      fill.offsetHeight; /* trigger reflow */
      fill.style.animation = 'fillVertical 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }

    setTimeout(() => {
      dismissSplash();
    }, 2400);
  } else {
    window.location.href = getRelativePrefix() + 'splash.html';
  }
}

window.switchActiveRole = switchActiveRole;
window.openRoleModal = openRoleModal;
window.closeRoleModal = closeRoleModal;
window.upgradeToDeveloperAndPost = upgradeToDeveloperAndPost;
window.replaySplashScreen = replaySplashScreen;

