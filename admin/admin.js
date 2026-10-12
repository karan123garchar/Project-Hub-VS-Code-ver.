/* ==========================================================================
   admin.js – Executive Admin Panel Core Interactions & State
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Universal User Table Filter
  const userSearch = document.getElementById('userSearchInput');
  const userRole = document.getElementById('userRoleFilter');
  const userStatus = document.getElementById('userStatusFilter');
  const userTable = document.getElementById('usersTable');

  if (userTable) {
    const filterUserRows = () => {
      const q = (userSearch ? userSearch.value : '').toLowerCase().trim();
      const r = (userRole ? userRole.value : 'all').toLowerCase();
      const s = (userStatus ? userStatus.value : 'all').toLowerCase();

      const rows = userTable.querySelectorAll('tbody tr');
      let visibleCount = 0;

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const role = (row.dataset.role || '').toLowerCase();
        const status = (row.dataset.status || '').toLowerCase();

        const matchQuery = !q || text.includes(q);
        const matchRole = r === 'all' || role === r;
        const matchStatus = s === 'all' || status === s;

        if (matchQuery && matchRole && matchStatus) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });
    };

    if (userSearch) userSearch.addEventListener('input', filterUserRows);
    if (userRole) userRole.addEventListener('change', filterUserRows);
    if (userStatus) userStatus.addEventListener('change', filterUserRows);
  }

  // Universal Project Moderation Table Filter
  const projSearch = document.getElementById('projectSearchInput');
  const projStatus = document.getElementById('projectStatusFilter');
  const projCategory = document.getElementById('projectCategoryFilter');
  const projTable = document.getElementById('projectsModTable');

  if (projTable) {
    const filterProjRows = () => {
      const q = (projSearch ? projSearch.value : '').toLowerCase().trim();
      const st = (projStatus ? projStatus.value : 'all').toLowerCase();
      const cat = (projCategory ? projCategory.value : 'all').toLowerCase();

      const rows = projTable.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const rStatus = (row.dataset.status || '').toLowerCase();
        const rCategory = (row.dataset.category || '').toLowerCase();

        const matchQuery = !q || text.includes(q);
        const matchStatus = st === 'all' || rStatus === st;
        const matchCategory = cat === 'all' || rCategory === cat;

        if (matchQuery && matchStatus && matchCategory) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    };

    if (projSearch) projSearch.addEventListener('input', filterProjRows);
    if (projStatus) projStatus.addEventListener('change', filterProjRows);
    if (projCategory) projCategory.addEventListener('change', filterProjRows);
  }

  // Categories Table Search
  const catSearch = document.getElementById('topGlobalSearch');
  const catTable = document.getElementById('categoriesTable');
  if (catSearch && catTable) {
    catSearch.addEventListener('input', () => {
      const q = catSearch.value.toLowerCase().trim();
      const rows = catTable.querySelectorAll('tbody tr');
      rows.forEach(row => {
        row.style.display = (!q || row.innerText.toLowerCase().includes(q)) ? '' : 'none';
      });
    });
  }

});

/* Time Range Switcher */
function setTimeRange(button, range) {
  const parent = button.parentElement;
  if (!parent) return;
  parent.querySelectorAll('.time-range-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  showAdminToast(`Metrics filtered to past ${range}`);
}

/* Modal Management */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

function openNewProjectModal() {
  openModal('newProjectModal');
}

/* Submission Handlers */
function submitNewProject() {
  const title = document.getElementById('modalProjectTitle')?.value || 'Untitled Platform Project';
  closeModal('newProjectModal');
  showAdminToast(`Project "${title}" queued for moderation review`);
}

function submitInviteUser() {
  const name = document.getElementById('inviteUserName')?.value || 'New User';
  const email = document.getElementById('inviteUserEmail')?.value;
  closeModal('inviteUserModal');
  showAdminToast(`Invitation dispatched to ${name} (${email || 'email sent'})`);
}

function exportUsersCSV() {
  showAdminToast('Exported 248 user records to users_export.csv');
}

/* User Actions */
function viewUser(name, email) {
  showAdminToast(`Inspecting security credentials for ${name}`);
}

function editUser(name) {
  showAdminToast(`Editing permissions and roles for ${name}`);
}

function toggleUserStatus(button, userName) {
  const tr = button.closest('tr');
  const statusBadge = tr.querySelector('.badge-pill[class*="status-"]');
  if (!statusBadge) return;

  const currentStatus = tr.dataset.status;
  if (currentStatus === 'suspended') {
    tr.dataset.status = 'active';
    statusBadge.className = 'badge-pill status-active';
    statusBadge.innerHTML = '<span class="status-dot"></span> Active';
    button.className = 'action-icon-btn btn-danger';
    button.title = 'Suspend';
    button.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">block</span>';
    showAdminToast(`${userName} account reactivated`);
  } else {
    tr.dataset.status = 'suspended';
    statusBadge.className = 'badge-pill status-suspended';
    statusBadge.innerHTML = '<span class="status-dot"></span> Suspended';
    button.className = 'action-icon-btn btn-success';
    button.title = 'Activate';
    button.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">check_circle</span>';
    showAdminToast(`${userName} account suspended`);
  }
}

function approveUser(button, userName) {
  const tr = button.closest('tr');
  const statusBadge = tr.querySelector('.badge-pill');
  if (statusBadge) {
    tr.dataset.status = 'active';
    statusBadge.className = 'badge-pill status-active';
    statusBadge.innerHTML = '<span class="status-dot"></span> Active';
    button.remove();
    showAdminToast(`${userName} verified & approved`);
  }
}

/* Categories Actions */
function submitAddCategory() {
  const name = document.getElementById('newCatName')?.value || 'New Category';
  const slug = document.getElementById('newCatSlug')?.value || name.toLowerCase().replace(/\s+/g, '-');
  const status = document.getElementById('newCatStatus')?.value || 'Active';

  const table = document.getElementById('categoriesTable');
  if (table) {
    const tbody = table.querySelector('tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:600;color:#111;">${name}</td>
      <td style="font-family:monospace;color:#6B7280;font-size:12.5px;">${slug}</td>
      <td style="font-weight:500;color:#111;">0</td>
      <td><span class="badge-pill ${status === 'Active' ? 'status-active' : 'status-approved'}">${status}</span></td>
      <td>
        <div class="table-actions" style="justify-content:flex-end;">
          <button class="action-icon-btn" title="Edit" onclick="editCategory('${name}', '${slug}')">
            <span class="material-symbols-outlined" style="font-size:18px;">edit</span>
          </button>
          <button class="action-icon-btn btn-danger" title="Delete" onclick="deleteCategory(this, '${name}')">
            <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
          </button>
        </div>
      </td>
    `;
    tbody.prepend(tr);
  }

  closeModal('addCategoryModal');
  showAdminToast(`Category "${name}" created successfully`);
}

function editCategory(name, slug) {
  const newName = prompt(`Update category name for "${name}":`, name);
  if (newName && newName.trim() !== '') {
    showAdminToast(`Category updated to "${newName}"`);
  }
}

function deleteCategory(btn, name) {
  if (confirm(`Are you sure you want to delete category "${name}"?`)) {
    const tr = btn.closest('tr');
    tr.style.opacity = '0';
    tr.style.transform = 'translateX(10px)';
    tr.style.transition = 'all 0.2s';
    setTimeout(() => {
      tr.remove();
      showAdminToast(`Category "${name}" removed`);
    }, 200);
  }
}

/* Settings Tabs & Floating Save Bar */
function switchSettingsTab(btn, tabId) {
  document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showAdminToast(`Switched to ${btn.innerText.trim()} settings`);
}

function triggerUnsavedChanges() {
  const bar = document.getElementById('saveChangesBar');
  if (bar) {
    bar.style.display = 'flex';
  }
}

function saveSettingsChanges() {
  const bar = document.getElementById('saveChangesBar');
  if (bar) bar.style.display = 'none';
  showAdminToast('System configuration saved & published across nodes');
}

function discardSettingsChanges() {
  const bar = document.getElementById('saveChangesBar');
  if (bar) bar.style.display = 'none';
  showAdminToast('Modifications discarded');
}

/* Chat Messages */
function sendAdminChatMessage() {
  const input = document.getElementById('chatInputMsg');
  if (!input || !input.value.trim()) return;
  const val = input.value.trim();
  input.value = '';
  showAdminToast('Message dispatched');
}

/* Global Admin Toast Notification */
function showAdminToast(message) {
  let container = document.getElementById('adminToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'adminToastContainer';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined toast-icon">verified</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}
