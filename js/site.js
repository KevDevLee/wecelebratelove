const scrollOffset = () => (window.innerWidth < 768 ? 80 : 100);

const manageNavState = () => {
  const navContainer = document.querySelector('[data-nav-container]');
  const toggleButton = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');
  const navLinks = document.querySelectorAll('[data-scroll-link]');
  const sections = document.querySelectorAll('[data-section]');

  if (!navContainer || !navMenu) return;

  let isMobile = window.innerWidth < 768;
  let isMenuOpen = false;

  const removableClasses = [
    'w-[calc(100%-2rem)]',
    'max-w-7xl',
    'max-w-4xl',
    'max-w-2xl',
    'w-[100%]',
    'nav-bg',
    'rounded-4xl',
    'rounded-3xl'
  ];

  const updateNavAppearance = () => {
    const atTop = window.scrollY <= 50;
    navContainer.classList.remove(...removableClasses);

    if (isMobile) {
      navContainer.classList.add('w-[100%]');
      if (!atTop || isMenuOpen) {
        navContainer.classList.add('nav-bg');
      }
    } else if (isMenuOpen) {
      navContainer.classList.add(
        'nav-bg',
        'w-[calc(100%-2rem)]',
        'max-w-2xl',
        'rounded-3xl'
      );
    } else if (atTop) {
      navContainer.classList.add(
        'w-[calc(100%-2rem)]',
        'max-w-7xl'
      );
    } else {
      navContainer.classList.add(
        'nav-bg',
        'w-[calc(100%-2rem)]',
        'max-w-4xl',
        'rounded-4xl'
      );
    }
  };

  const updateMenuVisibility = () => {
    const shouldShow = !isMobile || isMenuOpen;
    navMenu.classList.toggle('hidden', !shouldShow && isMobile);
    navMenu.classList.toggle('flex', shouldShow);
    navMenu.classList.toggle('flex-col', isMobile);
    if (toggleButton) {
      toggleButton.setAttribute(
        'aria-expanded',
        shouldShow && isMobile ? 'true' : 'false'
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
              'nav-link-active',
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
  const faqItems = document.querySelectorAll('[data-faq-item]');
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

window.addEventListener('DOMContentLoaded', () => {
  manageNavState();
  setupFaq();
});
