/** Menu mobile (hambúrguer + overlay), dropdowns no mobile e aria-expanded dos mega menus no desktop. */


// ==========================================
// Mobile Menu Enhancement
// ==========================================
export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  let mobileOverlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelector('.nav-links');
  
  if (!mobileMenuBtn || !navLinks) return;

  // Create mobile overlay if not already in DOM
  if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.id = 'mobileOverlay';
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
  }
  
  // Toggle menu
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navLinks.classList.contains('active');
    
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // Close on overlay click
  mobileOverlay.addEventListener('click', closeMenu);
  
  // Close on link click only for actual destination links, NOT dropdown headers!
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      const isDropdownToggle = link.parentElement.classList.contains('nav-item-dropdown') && link.classList.contains('nav-link');
      if (!isDropdownToggle && window.innerWidth <= 968) {
        closeMenu();
      }
    });
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });
  
  function openMenu() {
    navLinks.classList.add('active');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    navLinks.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================
// Mobile Dropdown Enhancement
// ==========================================
export function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-item-dropdown');
  
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    
    // For mobile: toggle on click
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 968) {
        e.preventDefault();
        dropdown.classList.toggle('active');
        
        // Close other dropdowns
        dropdowns.forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('active');
          }
        });
      }
    });
  });
}

// ==========================================
// Mega Menu
// ==========================================
export function initMegaMenu() {
  const dropdowns = document.querySelectorAll('.nav-item-dropdown');
  
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');

    dropdown.addEventListener('mouseenter', () => {
      link.setAttribute('aria-expanded', 'true');
    });
    
    dropdown.addEventListener('mouseleave', () => {
      link.setAttribute('aria-expanded', 'false');
    });
  });
}

