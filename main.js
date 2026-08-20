/**
 * AURA VISUALS — main.js (Premium Enhanced)
 * إرسال تلقائي إلى WhatsApp عبر CallMeBot + Fallback آمن
 * @version 3.3.0
 */

'use strict';

// ⚙️ الإعدادات
const WHATSAPP_NUMBER = '201003073577'; // رقمك بصيغة دولية
const CALLMEBOT_API_KEY = '1424134'; // ⬅️ ضع API Key من CallMeBot
const CALLMEBOT_PHONE = '201003073577'; // نفس رقمك

const WHATSAPP_DEFAULT_MESSAGE = 'مرحبًا AURA VISUALS 👋، أريد معرفة تفاصيل خدمة تصوير المنتجات بالـAI.';

// =============================================
// DOM REFERENCES
// =============================================
const DOM = {
  navbar: document.getElementById('navbar'),
  hamburger: document.getElementById('hamburger'),
  navLinks: document.getElementById('navLinks'),
  navLinkItems: document.querySelectorAll('.nav-link'),
  allSections: document.querySelectorAll('section[id]'),
  revealElements: document.querySelectorAll(
    '.section-header, .problem-card, .workflow-step, .portfolio-item, .why-card, .comparison-card, .faq-item, .final-cta-content, .lead-form-wrapper'
  ),
  baSlider: document.getElementById('baSlider'),
  baHandle: document.getElementById('baHandle'),
  baAfter: document.getElementById('baAfter'),
  portfolioFilters: document.getElementById('portfolioFilters'),
  portfolioGrid: document.getElementById('portfolioGrid'),
  portfolioItems: document.querySelectorAll('.portfolio-item'),
  lightbox: document.getElementById('lightbox'),
  lightboxClose: document.getElementById('lightboxClose'),
  lightboxContent: document.getElementById('lightboxContent'),
  faqItems: document.querySelectorAll('.faq-item'),
  leadForm: document.getElementById('leadForm'),
  formSuccess: document.getElementById('formSuccess'),
  leadFormWrapper: document.querySelector('.lead-form-wrapper'),
  whatsappBtn: document.getElementById('whatsappBtn'),
  ctaWhatsapp: document.getElementById('ctaWhatsapp'),
  footerWhatsapp: document.getElementById('footerWhatsapp'),
  heroScrollIndicator: document.querySelector('.hero-scroll-indicator'),
  cursorGlow: document.querySelector('.cursor-glow'),
  heroVisual: document.querySelector('.hero-visual'),
  statElements: document.querySelectorAll('.aura-social-proof__stat'),
  testimonialSlider: document.querySelector('.aura-social-proof__testimonial-slider'),
  dotsContainer: document.getElementById('aura-dots'),
  prevBtn: document.querySelector('.aura-social-proof__arrow.prev'),
  nextBtn: document.querySelector('.aura-social-proof__arrow.next'),
  socialSection: document.querySelector('.aura-social-proof')
};

// =============================================
// UTILITY FUNCTIONS
// =============================================
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// -------------------------------------------------
// 🚀 التحديث الجوهري هنا: دالة الإرسال بــ fetch + no-cors
// -------------------------------------------------
const sendToWhatsApp = async (message) => {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_API_KEY}`;
  try {
    // استخدام fetch مع no-cors لتجنب أخطاء CORS
    await fetch(url, { mode: 'no-cors' });
    console.log('✅ تم إرسال الطلب إلى CallMeBot');
    return true;
  } catch (error) {
    console.error('❌ فشل الإرسال عبر API:', error);
    return false;
  }
};

const openWhatsApp = (message = WHATSAPP_DEFAULT_MESSAGE) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const smoothScrollTo = (targetEl) => {
  if (!targetEl) return;
  const offset = DOM.navbar ? DOM.navbar.offsetHeight : 75;
  const position = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: position, behavior: 'smooth' });
};

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
const initNavbarScroll = () => {
  if (!DOM.navbar) return;
  const scrollHandler = () => {
    DOM.navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();
};

// =============================================
// MOBILE MENU TOGGLE
// =============================================
const initMobileMenu = () => {
  if (!DOM.hamburger || !DOM.navLinks) return;

  const toggleMenu = (forceClose = false) => {
    const isActive = DOM.navLinks.classList.contains('active');
    if (forceClose || isActive) {
      DOM.navLinks.classList.remove('active');
      DOM.hamburger.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      DOM.navLinks.classList.add('active');
      DOM.hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  DOM.hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  DOM.navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  document.addEventListener('click', (e) => {
    if (
      DOM.navLinks.classList.contains('active') &&
      !DOM.navLinks.contains(e.target) &&
      !DOM.hamburger.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.navLinks.classList.contains('active')) {
      toggleMenu(true);
    }
  });
};

// =============================================
// SMOOTH SCROLL
// =============================================
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        smoothScrollTo(target);
      }
    });
  });

  if (DOM.heroScrollIndicator) {
    DOM.heroScrollIndicator.addEventListener('click', () => {
      const nextSection = document.getElementById('problem') || document.getElementById('services');
      if (nextSection) smoothScrollTo(nextSection);
    });
  }
};

// =============================================
// ACTIVE NAVIGATION
// =============================================
const initActiveNavigation = () => {
  if (!DOM.navLinkItems.length || !DOM.allSections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: `-${DOM.navbar ? DOM.navbar.offsetHeight + 20 : 100}px 0px -50% 0px`,
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        DOM.navLinkItems.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  DOM.allSections.forEach((section) => observer.observe(section));
};

// =============================================
// SCROLL REVEAL
// =============================================
const initScrollReveal = () => {
  if (!DOM.revealElements.length) return;
  if (prefersReducedMotion()) {
    DOM.revealElements.forEach((el) => (el.style.opacity = '1'));
    return;
  }

  DOM.revealElements.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  DOM.revealElements.forEach((el) => observer.observe(el));
};

// =============================================
// BEFORE / AFTER SLIDER
// =============================================
const initBeforeAfterSlider = () => {
  if (!DOM.baSlider || !DOM.baHandle || !DOM.baAfter) return;

  let isDragging = false;

  const setPosition = (clientX) => {
    const rect = DOM.baSlider.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percentage = (x / rect.width) * 100;
    DOM.baHandle.style.left = `${percentage}%`;
    DOM.baAfter.style.clipPath = `inset(0 0 0 ${percentage}%)`;
  };

  const onStart = (e) => {
    e.preventDefault();
    isDragging = true;
    DOM.baSlider.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    setPosition(clientX);
  };

  const onMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    setPosition(clientX);
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    DOM.baSlider.style.cursor = 'ew-resize';
    document.body.style.userSelect = '';
  };

  if (window.PointerEvent) {
    DOM.baHandle.addEventListener('pointerdown', onStart);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
  } else {
    DOM.baHandle.addEventListener('mousedown', onStart);
    DOM.baHandle.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  }

  DOM.baSlider.addEventListener('click', (e) => {
    if (e.target === DOM.baHandle || DOM.baHandle.contains(e.target)) return;
    setPosition(e.clientX);
  });

  const rect = DOM.baSlider.getBoundingClientRect();
  setPosition(rect.left + rect.width / 2);
};

// =============================================
// PORTFOLIO FILTER
// =============================================
const initPortfolioFilter = () => {
  if (!DOM.portfolioFilters || !DOM.portfolioItems.length) return;

  const filterButtons = DOM.portfolioFilters.querySelectorAll('.filter-btn');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      DOM.portfolioItems.forEach((item) => {
        const categories = item.getAttribute('data-category').split(' ');
        const show = filterValue === 'all' || categories.includes(filterValue);
        item.classList.toggle('hidden', !show);
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = show ? '1' : '0';
        item.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
      });
    });
  });
};

// =============================================
// LIGHTBOX
// =============================================
const initLightbox = () => {
  if (!DOM.lightbox || !DOM.portfolioItems.length) return;

  const openLightbox = (contentHTML) => {
    DOM.lightboxContent.innerHTML = contentHTML;
    DOM.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    DOM.lightboxClose.focus();
  };

  const closeLightbox = () => {
    DOM.lightbox.classList.remove('active');
    document.body.style.overflow = '';
    DOM.lightboxContent.innerHTML = '';
  };

  DOM.portfolioItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Portfolio Image';
        lightboxImg.style.maxWidth = '100%';
        lightboxImg.style.maxHeight = '80vh';
        lightboxImg.style.objectFit = 'contain';
        lightboxImg.style.borderRadius = '8px';
        openLightbox(lightboxImg.outerHTML);
      } else {
        const placeholder = item.querySelector('.portfolio-placeholder');
        if (placeholder) {
          const clone = placeholder.cloneNode(true);
          openLightbox(clone.outerHTML);
        }
      }
    });
  });

  DOM.lightboxClose.addEventListener('click', closeLightbox);
  DOM.lightbox.addEventListener('click', (e) => {
    if (e.target === DOM.lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.lightbox.classList.contains('active')) closeLightbox();
  });
};

// =============================================
// FAQ ACCORDION
// =============================================
const initFAQ = () => {
  if (!DOM.faqItems.length) return;

  DOM.faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

      DOM.faqItems.forEach((otherItem) => {
        const otherBtn = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherItem !== item && otherBtn.getAttribute('aria-expanded') === 'true') {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('open');
          otherAnswer.style.maxHeight = null;
        }
      });

      if (isExpanded) {
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
};

// =============================================
// LEAD FORM VALIDATION & SUBMISSION (CallMeBot + Fallback)
// =============================================
const initLeadForm = () => {
  if (!DOM.leadForm || !DOM.formSuccess) return;

  const showError = (input, message) => {
    if (!input) return;
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    input.classList.add('input-error');
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    input.parentElement.appendChild(errorEl);
    input.addEventListener('input', function clearError() {
      input.classList.remove('input-error');
      const err = input.parentElement.querySelector('.error-message');
      if (err) err.remove();
    }, { once: true });
  };

const isValidEgyptWhatsApp = (number) => {
  if (!number) return false;
  const cleaned = number.replace(/[\s\-\(\)]/g, '');
  // بتدور على 01 (صفر وواحد) وبعدين 0/1/2/5 وبعدين 8 أرقام
  return /^(?:\+?20)?01[0125]\d{8}$/.test(cleaned);
};

  const constructWhatsAppMessage = (formData) => {
    let message = `مرحبًا AURA VISUALS 👋\n\n` +
      `يوجد Lead جديد من الموقع:\n\n` +
      `الاسم: ${formData.name}\n` +
      `البراند / المصنع: ${formData.brand || 'غير محدد'}\n`;
    if (formData.whatsapp) {
      message += `رقم WhatsApp: ${formData.whatsapp}\n`;
    }
    message +=
      `نوع المنتجات: ${formData.productType || 'غير محدد'}\n` +
      `الخدمة المطلوبة: ${formData.need || 'غير محدد'}\n` +
      `عدد الصور التقريبي: ${formData.quantity || 'غير محدد'}\n` +
      `ملاحظات: ${formData.notes || 'لا يوجد'}\n\n` +
      `مصدر الطلب: AURA VISUALS Website`;
    return message;
  };

  const setLoading = (isLoading) => {
    const btn = DOM.leadForm.querySelector('.form-submit-btn');
    if (!btn) return;
    if (isLoading) {
      btn.disabled = true;
      btn.classList.add('loading');
      btn.innerHTML = '<span>جاري الإرسال...</span><i class="fa-solid fa-spinner fa-spin"></i>';
    } else {
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.innerHTML = '<span>إرسال الطلب</span><i class="fa-solid fa-paper-plane"></i>';
    }
  };

  // -------------------------------------------------
  // 🚀 التحديث الجوهري هنا: معالج الفورم Async مع Fallback
  // -------------------------------------------------
  DOM.leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formElements = DOM.leadForm.elements;
    const nameInput = formElements['name'];
    const whatsappInput = formElements['whatsapp'];
    const name = nameInput ? nameInput.value.trim() : '';
    const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
    const brandInput = formElements['brand'];
    const brand = brandInput ? brandInput.value.trim() : '';
    const productTypeInput = formElements['productType'];
    const productType = productTypeInput ? productTypeInput.value : '';
    const needInput = formElements['need'];
    const need = needInput ? needInput.value.trim() : '';
    const quantityInput = formElements['quantity'];
    const quantity = quantityInput ? quantityInput.value.trim() : '';
    const notesInput = formElements['notes'];
    const notes = notesInput ? notesInput.value.trim() : '';

    let isValid = true;
    if (!name) {
      showError(nameInput, 'الاسم مطلوب');
      isValid = false;
    }
    if (whatsappInput && whatsapp && !isValidEgyptWhatsApp(whatsapp)) {
      showError(whatsappInput, 'صيغة الرقم غير صحيحة (مثال: 01xxxxxxxxx)');
      isValid = false;
    } else if (whatsappInput && !whatsapp) {
      showError(whatsappInput, 'رقم الواتساب مطلوب');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    const formData = { name, brand, whatsapp, productType, need, quantity, notes };
    const message = constructWhatsAppMessage(formData);

    // 🔥 الخطوة الذكية: حاول الإرسال التلقائي، ولو فشل افتح واتساب للعميل
    const sent = await sendToWhatsApp(message);
    if (!sent) {
      console.warn('⚠️ فشل الإرسال التلقائي، نفتح واتساب كحل بديل للعميل.');
      openWhatsApp(message);
    }

    // إظهار رسالة النجاح دائمًا (لأن الفل باك اشتغل أو التلقائي نجح)
    setTimeout(() => {
      setLoading(false);
      DOM.leadForm.style.display = 'none';
      DOM.leadFormWrapper.querySelector('.form-header').style.display = 'none';
      DOM.formSuccess.classList.add('visible');
      DOM.leadFormWrapper.classList.add('success');
      DOM.leadFormWrapper.setAttribute('data-whatsapp-message', message);
    }, 800);
  });
};

// =============================================
// WHATSAPP BUTTON HANDLERS
// =============================================
const initWhatsAppButtons = () => {
  const messageFromForm = () => {
    if (DOM.leadFormWrapper && DOM.leadFormWrapper.classList.contains('success')) {
      return DOM.leadFormWrapper.getAttribute('data-whatsapp-message') || WHATSAPP_DEFAULT_MESSAGE;
    }
    return WHATSAPP_DEFAULT_MESSAGE;
  };

  const attachHandler = (btn) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp(messageFromForm());
      });
    }
  };

  attachHandler(DOM.whatsappBtn);
  attachHandler(DOM.ctaWhatsapp);
  attachHandler(DOM.footerWhatsapp);
};

// =============================================
// HERO PARALLAX
// =============================================
const initHeroInteraction = () => {
  if (isTouchDevice() || !DOM.heroVisual || prefersReducedMotion()) return;
  let ticking = false;
  const updateParallax = (e) => {
    const rect = DOM.heroVisual.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const moveX = (e.clientX - centerX) / 25;
    const moveY = (e.clientY - centerY) / 25;
    DOM.heroVisual.style.transform = `translate(${moveX}px, ${moveY}px)`;
  };
  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax(e);
        ticking = false;
      });
      ticking = true;
    }
  });
};

// =============================================
// CURSOR GLOW
// =============================================
const initCursorGlow = () => {
  if (isTouchDevice() || !DOM.cursorGlow || prefersReducedMotion()) {
    if (DOM.cursorGlow) DOM.cursorGlow.style.display = 'none';
    return;
  }
  window.addEventListener('mousemove', (e) => {
    DOM.cursorGlow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
  });
};

// =============================================
// SOCIAL PROOF COUNTER
// =============================================
const initSocialProofCounter = () => {
  if (!DOM.statElements.length) return;
  const animateCounter = (statEl) => {
    const numberEl = statEl.querySelector('.aura-social-proof__number');
    const suffixEl = statEl.querySelector('.aura-social-proof__suffix');
    const target = parseInt(statEl.dataset.count, 10) || 0;
    const suffix = statEl.dataset.suffix || '';
    const duration = 1500;
    const startTime = performance.now();
    if (suffixEl) suffixEl.textContent = suffix;
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(eased * target);
      if (numberEl) numberEl.textContent = currentValue;
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (numberEl) numberEl.textContent = target;
      }
    };
    requestAnimationFrame(updateCounter);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    DOM.statElements.forEach((stat) => observer.observe(stat));
  } else {
    DOM.statElements.forEach((stat) => animateCounter(stat));
  }
};

// =============================================
// TESTIMONIAL SLIDER
// =============================================
const initTestimonialSlider = () => {
  if (!DOM.testimonialSlider) return;
  const testimonials = DOM.testimonialSlider.querySelectorAll('.aura-social-proof__testimonial');
  if (testimonials.length === 0) return;
  let currentIndex = 0;
  let autoRotateInterval = null;
  const AUTO_ROTATE_DELAY = 5500;

  const createDots = () => {
    if (!DOM.dotsContainer) return;
    DOM.dotsContainer.innerHTML = '';
    testimonials.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'aura-social-proof__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.setAttribute('aria-label', `الانتقال إلى الرأي ${i + 1}`);
      DOM.dotsContainer.appendChild(dot);
    });
  };

  const dots = () => (DOM.dotsContainer ? DOM.dotsContainer.querySelectorAll('.aura-social-proof__dot') : []);

  const showTestimonial = (index) => {
    if (index < 0) index = testimonials.length - 1;
    if (index >= testimonials.length) index = 0;
    currentIndex = index;
    testimonials.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
    dots().forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  };

  const startAutoRotate = () => {
    stopAutoRotate();
    autoRotateInterval = setInterval(() => showTestimonial(currentIndex + 1), AUTO_ROTATE_DELAY);
  };
  const stopAutoRotate = () => {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  };

  if (DOM.prevBtn) DOM.prevBtn.addEventListener('click', () => { showTestimonial(currentIndex - 1); startAutoRotate(); });
  if (DOM.nextBtn) DOM.nextBtn.addEventListener('click', () => { showTestimonial(currentIndex + 1); startAutoRotate(); });
  if (DOM.dotsContainer) {
    DOM.dotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.aura-social-proof__dot');
      if (dot) {
        showTestimonial(parseInt(dot.dataset.index, 10));
        startAutoRotate();
      }
    });
  }
  if (DOM.socialSection) {
    DOM.socialSection.addEventListener('mouseenter', stopAutoRotate);
    DOM.socialSection.addEventListener('mouseleave', startAutoRotate);
  }
  createDots();
  showTestimonial(0);
  startAutoRotate();
};

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavigation();
  initScrollReveal();
  initBeforeAfterSlider();
  initPortfolioFilter();
  initLightbox();
  initFAQ();
  initLeadForm();
  initWhatsAppButtons();
  initHeroInteraction();
  initCursorGlow();
  initSocialProofCounter();
  initTestimonialSlider();
});