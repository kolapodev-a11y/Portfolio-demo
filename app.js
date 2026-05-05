(() => {
  const doc = document;
  const docEl = doc.documentElement;
  const body = doc.body;
  const $ = (selector, root = doc) => root.querySelector(selector);
  const $$ = (selector, root = doc) => Array.from(root.querySelectorAll(selector));

  const navbar = $('.navbar');
  const backToTop = $('#back-to-top');
  const mobileMenu = $('#mobile-menu');
  const menuToggle = $('[data-menu-toggle]');
  const themeButtons = $$('[data-theme-toggle]');
  const typedText = $('#typed-text');
  const yearNode = $('#current-year');
  const toast = $('#toast');
  const toastMessage = $('#toast-message');
  const toastIcon = $('#toast-icon');
  const contactForm = $('#contact-form');
  const submitButton = $('#form-submit-btn');
  const navAnchors = $$('a[href^="#"]');
  const primaryNavAnchors = $$('a[href^="#home"], a[href^="#about"], a[href^="#projects"], a[href^="#contact"]')
    .filter((node) => node.closest('.nav-links, .mobile-menu, .footer-links'));

  const typedWords = [
    'React Frontend Developer',
    'Responsive UI Builder',
    'JavaScript & API Integrator',
    'Frontend Problem Solver'
  ];

  let typedWordIndex = 0;
  let typedCharIndex = 0;
  let deleting = false;
  let toastTimer = null;
  let ticking = false;

  function getInitialTheme() {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (error) {
      return 'light';
    }
  }

  function updateThemeButtons(theme) {
    const isDark = theme === 'dark';
    themeButtons.forEach((button) => {
      const icon = $('.theme-toggle-icon', button);
      const label = $('.theme-toggle-text', button);
      if (icon) icon.textContent = isDark ? '🌙' : '☀️';
      if (label) label.textContent = isDark ? 'Dark' : 'Light';
      button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = isDark ? 'Light mode' : 'Dark mode';
    });
  }

  function applyTheme(theme) {
    docEl.setAttribute('data-theme', theme);
    updateThemeButtons(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {}
  }

  function closeMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('is-menu-open');
    docEl.classList.remove('is-menu-open');
  }

  function toggleMenu() {
    if (!mobileMenu || !menuToggle) return;
    const nextOpen = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', nextOpen);
    menuToggle.classList.toggle('open', nextOpen);
    menuToggle.setAttribute('aria-expanded', String(nextOpen));
    body.classList.toggle('is-menu-open', nextOpen);
    docEl.classList.toggle('is-menu-open', nextOpen);
  }

  function scrollToHash(hash) {
    const target = doc.querySelector(hash);
    if (!target) return;
    closeMenu();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setActiveNav(id) {
    primaryNavAnchors.forEach((anchor) => {
      const isMatch = anchor.getAttribute('href') === `#${id}`;
      anchor.classList.toggle('active', isMatch && anchor.closest('.nav-links'));
    });
  }

  function showToast(message, type = 'success') {
    if (!toast || !toastMessage || !toastIcon) return;
    toast.className = `toast ${type}`;
    toast.hidden = false;
    toastMessage.textContent = message;
    toastIcon.textContent = type === 'success' ? '✅' : '❌';

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 4200);
  }

  function updateScrollUI() {
    const y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle('scrolled', y > 50);
    if (backToTop) backToTop.hidden = y <= 500;
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  function startTypedText() {
    if (!typedText) return;

    const currentWord = typedWords[typedWordIndex];
    if (!deleting) {
      typedCharIndex += 1;
      typedText.textContent = currentWord.slice(0, typedCharIndex);
      if (typedCharIndex === currentWord.length) {
        deleting = true;
        window.setTimeout(startTypedText, 1500);
        return;
      }
      window.setTimeout(startTypedText, 80);
      return;
    }

    typedCharIndex -= 1;
    typedText.textContent = currentWord.slice(0, typedCharIndex);
    if (typedCharIndex === 0) {
      deleting = false;
      typedWordIndex = (typedWordIndex + 1) % typedWords.length;
      window.setTimeout(startTypedText, 250);
      return;
    }
    window.setTimeout(startTypedText, 40);
  }

  function initRevealObserver() {
    const revealItems = $$('.reveal');
    if (!revealItems.length) return;

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function initSectionObserver() {
    const sections = $$('main section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      { threshold: 0.45, rootMargin: '-20% 0px -35% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initContactForm() {
    if (!contactForm || !submitButton) return;

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const payload = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        message: String(formData.get('message') || '').trim()
      };

      if (!payload.name || !payload.email || !payload.message) {
        showToast('Please fill in your name, email, and message.', 'error');
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = '⏳ Sending...';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          let message = 'Failed to send message.';
          try {
            const data = await response.json();
            if (data && data.error) message = data.error;
          } catch (error) {}
          throw new Error(message);
        }

        contactForm.reset();
        showToast("Message sent! I'll get back to you soon. 🎉", 'success');
      } catch (error) {
        const subject = encodeURIComponent(`Message from ${payload.name}`);
        const bodyText = encodeURIComponent(payload.message);
        window.location.href = `mailto:kolapodev@gmail.com?subject=${subject}&body=${bodyText}`;
        showToast("Couldn't send automatically — opening your email app instead.", 'error');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = '🚀 Send Message';
      }
    });
  }

  function initEvents() {
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu, { passive: true });
    }

    themeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const nextTheme = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    });

    navAnchors.forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const hash = anchor.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return;
        const target = doc.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        scrollToHash(hash);
      });
    });

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    }, { passive: true });
  }

  applyTheme(getInitialTheme());
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
  initEvents();
  initRevealObserver();
  initSectionObserver();
  initContactForm();
  updateScrollUI();
  startTypedText();
})();
