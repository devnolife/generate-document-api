// Common JavaScript functions for Generate Document API

// Copy to clipboard functionality
function copyToClipboard(button) {
  const codeElement = button.nextElementSibling.querySelector('code') || button.parentElement.querySelector('code');
  if (!codeElement) return;

  const text = codeElement.textContent;

  navigator.clipboard.writeText(text).then(() => {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.classList.replace('btn-outline-secondary', 'btn-success');

    setTimeout(() => {
      button.innerHTML = originalIcon;
      button.classList.replace('btn-success', 'btn-outline-secondary');
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.classList.replace('btn-outline-secondary', 'btn-success');

    setTimeout(() => {
      button.innerHTML = originalIcon;
      button.classList.replace('btn-success', 'btn-outline-secondary');
    }, 2000);
  });
}

// Show alert message
function showAlert(type, message, container = 'alertContainer') {
  const alertContainer = document.getElementById(container);
  if (!alertContainer) return;

  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            <div>${message}</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  alertContainer.appendChild(alert);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, 5000);

  // Scroll to top to show alert
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Loading overlay control
function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Smooth scroll for navigation links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Format date to readable format
function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Template filtering functionality
function initTemplateFilter() {
  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');
  const prodiFilter = document.getElementById('prodiFilter');
  const templateCards = document.querySelectorAll('.template-card-item');

  function filterTemplates() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedType = typeFilter ? typeFilter.value.toLowerCase() : '';
    const selectedProdi = prodiFilter ? prodiFilter.value.toLowerCase() : '';

    templateCards.forEach(card => {
      const type = card.dataset.type ? card.dataset.type.toLowerCase() : '';
      const prodi = card.dataset.prodi ? card.dataset.prodi.toLowerCase() : '';
      const text = card.textContent.toLowerCase();

      const matchesSearch = !searchTerm || text.includes(searchTerm);
      const matchesType = !selectedType || type === selectedType;
      const matchesProdi = !selectedProdi || prodi === selectedProdi;

      if (matchesSearch && matchesType && matchesProdi) {
        card.style.display = 'block';
        card.classList.remove('d-none');
      } else {
        card.style.display = 'none';
        card.classList.add('d-none');
      }
    });

    updateFilterResults();
  }

  function updateFilterResults() {
    const visibleCards = document.querySelectorAll('.template-card-item:not(.d-none)');
    const resultsCount = document.getElementById('resultsCount');

    if (resultsCount) {
      resultsCount.textContent = `${visibleCards.length} template(s) found`;
    }

    // Show/hide no results message
    const noResults = document.getElementById('noResults');
    if (noResults) {
      noResults.style.display = visibleCards.length === 0 ? 'block' : 'none';
    }
  }

  // Add event listeners
  if (searchInput) {
    searchInput.addEventListener('input', debounce(filterTemplates, 300));
  }
  if (typeFilter) {
    typeFilter.addEventListener('change', filterTemplates);
  }
  if (prodiFilter) {
    prodiFilter.addEventListener('change', filterTemplates);
  }

  // Initial filter
  filterTemplates();
}

// API request helper
async function apiRequest(url, options = {}) {
  try {
    showLoading();

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    showAlert('danger', error.message || 'An error occurred while processing your request');
    throw error;
  } finally {
    hideLoading();
  }
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize smooth scrolling
  initSmoothScroll();

  // Initialize template filter if elements exist
  if (document.getElementById('searchInput') || document.getElementById('typeFilter')) {
    initTemplateFilter();
  }

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
  alerts.forEach(alert => {
    setTimeout(() => {
      if (alert.parentElement) {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
      }
    }, 5000);
  });
});

// Export functions for use in other scripts
window.GenerateDocumentAPI = {
  copyToClipboard,
  showAlert,
  showLoading,
  hideLoading,
  formatDate,
  debounce,
  apiRequest
};
