const scrollOffset = () => (window.innerWidth < 768 ? 80 : 100);

const manageNavState = () => {
  const navContainer = document.querySelector('[data-site-nav]');
  const toggleButton = document.querySelector('[data-site-nav-toggle]');
  const navMenu = document.querySelector('[data-site-nav-menu]');
  const navLinks = document.querySelectorAll('[data-scroll-link]');
  const sections = document.querySelectorAll('[data-section]');

  if (!navContainer || !navMenu) return;

  let isMobile = window.innerWidth < 768;
  let isMenuOpen = false;

  const navStateClasses = [
    'is-mobile',
    'is-top',
    'is-scrolled',
    'is-open',
    'has-surface'
  ];

  const updateNavAppearance = () => {
    const atTop = window.scrollY <= 50;
    navContainer.classList.remove(...navStateClasses);

    if (isMobile) {
      navContainer.classList.add('is-mobile');
      if (!atTop || isMenuOpen) {
        navContainer.classList.add('has-surface');
      }
    } else if (isMenuOpen) {
      navContainer.classList.add('is-open', 'has-surface');
    } else if (atTop) {
      navContainer.classList.add('is-top');
    } else {
      navContainer.classList.add('is-scrolled', 'has-surface');
    }
  };

  const updateMenuVisibility = () => {
    const shouldShow = !isMobile || isMenuOpen;
    navMenu.classList.toggle('is-open', shouldShow && isMobile);
    if (toggleButton) {
      toggleButton.setAttribute(
        'aria-expanded',
        shouldShow && isMobile ? 'true' : 'false'
      );
      toggleButton.setAttribute(
        'aria-label',
        isMenuOpen ? 'Navigation schließen' : 'Navigation öffnen'
      );
      toggleButton.classList.toggle('is-active', isMenuOpen);
    }
  };

  const closeMenu = () => {
    isMenuOpen = false;
    updateMenuVisibility();
    updateNavAppearance();
  };

  toggleButton?.addEventListener('click', () => {
    if (!isMobile) return;
    isMenuOpen = !isMenuOpen;
    updateMenuVisibility();
    updateNavAppearance();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const top =
          targetEl.getBoundingClientRect().top + window.scrollY - scrollOffset();
        window.scrollTo({ top, behavior: 'smooth' });
      }
      closeMenu();
    });
  });

  window.addEventListener('scroll', updateNavAppearance, { passive: true });
  window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth < 768;
    if (wasMobile && !isMobile) {
      isMenuOpen = false;
    }
    updateMenuVisibility();
    updateNavAppearance();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'is-active',
              link.dataset.target === id
            );
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px'
    }
  );

  sections.forEach((section) => {
    if (section.id) {
      observer.observe(section);
    }
  });

  updateNavAppearance();
  updateMenuVisibility();
};

const setupFaq = () => {
  const faqItems = document.querySelectorAll('[data-faq-item-card]');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector('[data-faq-toggle]');
    const content = item.querySelector('[data-faq-content]');

    button?.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      if (content) {
        if (isOpen) {
          content.classList.add('is-open');
          content.style.maxHeight = `${content.scrollHeight}px`;
        } else {
          content.classList.remove('is-open');
          content.style.maxHeight = '0px';
        }
      }
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
};

const setupPlaceholderLinks = () => {
  const placeholderLinks = document.querySelectorAll('[data-placeholder-link]');
  if (!placeholderLinks.length) return;

  placeholderLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  manageNavState();
  setupFaq();
  setupPlaceholderLinks();
});
