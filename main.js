/**
 * Fashion AI Studio - script.js
 * Premium Commercial Website
 * Interactive Functionality: Navbar, Slider, Portfolio, FAQ, Form, WhatsApp
 * @version 1.0.0
 */

'use strict';

// =============================================
// CONFIG
// =============================================
const WHATSAPP_NUMBER = 'YOUR_NUMBER'; // Replace with actual WhatsApp number (e.g., 201xxxxxxxxx)
const WHATSAPP_DEFAULT_MESSAGE = 'مرحبًا Fashion AI Studio، أريد معرفة تفاصيل خدمة تصوير المنتجات بالـAI.';

// =============================================
// DOM REFERENCES
// =============================================
const DOM = {
    navbar: document.getElementById('navbar'),
    hamburger: document.getElementById('hamburger'),
    navLinks: document.getElementById('navLinks'),
    navLinkItems: document.querySelectorAll('.nav-link'),
    allSections: document.querySelectorAll('section[id]'),
    revealElements: document.querySelectorAll('.section-header, .problem-card, .workflow-step, .portfolio-item, .why-card, .comparison-card, .faq-item, .final-cta-content, .lead-form-wrapper'),
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
    heroVisual: document.querySelector('.hero-visual')
};

// =============================================
// UTILITY FUNCTIONS
// =============================================
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        if (window.scrollY > 20) {
            DOM.navbar.classList.add('scrolled');
        } else {
            DOM.navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // initial state
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

    // Close when clicking on a nav link
    DOM.navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(true);
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (DOM.navLinks.classList.contains('active') &&
            !DOM.navLinks.contains(e.target) &&
            !DOM.hamburger.contains(e.target)) {
            toggleMenu(true);
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.navLinks.classList.contains('active')) {
            toggleMenu(true);
        }
    });
};

// =============================================
// SMOOTH SCROLL FOR INTERNAL LINKS
// =============================================
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                smoothScrollTo(target);
            }
        });
    });

    // Hero scroll indicator
    if (DOM.heroScrollIndicator) {
        DOM.heroScrollIndicator.addEventListener('click', () => {
            const nextSection = document.getElementById('problem') || document.getElementById('services');
            if (nextSection) smoothScrollTo(nextSection);
        });
    }
};

// =============================================
// ACTIVE NAVIGATION (IntersectionObserver)
// =============================================
const initActiveNavigation = () => {
    if (!DOM.navLinkItems.length || !DOM.allSections.length) return;

    const observerOptions = {
        root: null,
        rootMargin: `-${DOM.navbar ? DOM.navbar.offsetHeight + 20 : 100}px 0px -50% 0px`,
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                DOM.navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    DOM.allSections.forEach(section => observer.observe(section));
};

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
const initScrollReveal = () => {
    if (!DOM.revealElements.length) return;
    if (prefersReducedMotion()) {
        // Show all immediately
        DOM.revealElements.forEach(el => el.style.opacity = '1');
        return;
    }

    // Ensure elements have reveal class for CSS transition
    DOM.revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    DOM.revealElements.forEach(el => observer.observe(el));
};

// =============================================
// BEFORE / AFTER SLIDER
// =============================================
const initBeforeAfterSlider = () => {
    if (!DOM.baSlider || !DOM.baHandle || !DOM.baAfter) return;

    let isDragging = false;
    let startX = 0;
    let startLeft = 0;

    const setPosition = (clientX) => {
        const rect = DOM.baSlider.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percentage = (x / rect.width) * 100;

        // Update handle position
        DOM.baHandle.style.left = `${percentage}%`;

        // Update clip-path of after element to show after portion
        DOM.baAfter.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    };

    const onStart = (e) => {
        e.preventDefault();
        isDragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startX = clientX;
        startLeft = parseFloat(DOM.baHandle.style.left) || 50;
        DOM.baSlider.style.cursor = 'ew-resize';
        // Prevent text selection while dragging
        document.body.style.userSelect = 'none';
    };

    const onMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setPosition(clientX);
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        DOM.baSlider.style.cursor = 'ew-resize';
        document.body.style.userSelect = '';
    };

    // Pointer events (mouse + touch)
    DOM.baHandle.addEventListener('pointerdown', onStart);
    window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.clientX;
        setPosition(clientX);
    });
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);

    // Allow clicking on slider track to jump handle
    DOM.baSlider.addEventListener('click', (e) => {
        if (e.target === DOM.baHandle || DOM.baHandle.contains(e.target)) return;
        const clientX = e.clientX;
        setPosition(clientX);
    });

    // Initialize at 50%
    DOM.baHandle.style.left = '50%';
    DOM.baAfter.style.clipPath = 'inset(0 0 0 50%)';

    // Support touch events if pointer not fully supported (fallback)
    if (window.PointerEvent) return; // already covered

    // Fallback for older touch
    DOM.baHandle.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
};

// =============================================
// PORTFOLIO FILTER
// =============================================
const initPortfolioFilter = () => {
    if (!DOM.portfolioFilters || !DOM.portfolioItems.length) return;

    const filterButtons = DOM.portfolioFilters.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            DOM.portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
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
        // Focus trap - close button first
        DOM.lightboxClose.focus();
    };

    const closeLightbox = () => {
        DOM.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    DOM.portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get placeholder content or real image if exists
            const placeholder = item.querySelector('.portfolio-placeholder');
            if (placeholder) {
                // Clone placeholder content for lightbox
                const clone = placeholder.cloneNode(true);
                openLightbox(clone.outerHTML);
            } else {
                openLightbox('<div class="lightbox-placeholder"><i class="fa-solid fa-image"></i><span>صورة المشروع</span></div>');
            }
        });
    });

    DOM.lightboxClose.addEventListener('click', closeLightbox);

    DOM.lightbox.addEventListener('click', (e) => {
        if (e.target === DOM.lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
};

// =============================================
// FAQ ACCORDION
// =============================================
const initFAQ = () => {
    if (!DOM.faqItems.length) return;

    DOM.faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!questionBtn || !answer) return;

        questionBtn.addEventListener('click', () => {
            const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

            // Close all others
            DOM.faqItems.forEach(otherItem => {
                const otherBtn = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherItem !== item && otherBtn.getAttribute('aria-expanded') === 'true') {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('open');
                }
            });

            if (isExpanded) {
                questionBtn.setAttribute('aria-expanded', 'false');
                answer.classList.remove('open');
            } else {
                questionBtn.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });
};

// =============================================
// LEAD FORM VALIDATION & SUBMISSION
// =============================================
const initLeadForm = () => {
    if (!DOM.leadForm || !DOM.formSuccess) return;

    const showError = (input, message) => {
        // Simple: change border color, could add tooltip
        input.style.borderColor = '#ff4757';
        input.setAttribute('data-error', message);
        input.addEventListener('input', function clearError() {
            input.style.borderColor = '';
            input.removeAttribute('data-error');
        }, { once: true });
    };

    const isValidEgyptWhatsApp = (number) => {
        // Accept formats: 01xxxxxxxxx or +201xxxxxxxxx or 201xxxxxxxxx
        const cleaned = number.replace(/[\s\-\(\)]/g, '');
        return /^(?:\+?20)?1[0125]\d{8}$/.test(cleaned);
    };

    const constructWhatsAppMessage = (formData) => {
        return `مرحبًا Fashion AI Studio،\n` +
               `الاسم: ${formData.name}\n` +
               `البراند/المصنع: ${formData.brand || 'غير محدد'}\n` +
               `رقم الواتساب: ${formData.whatsapp}\n` +
               `نوع المنتجات: ${formData.productType || 'غير محدد'}\n` +
               `الخدمة المطلوبة: ${formData.need || 'غير محدد'}\n` +
               `عدد الصور التقريبي: ${formData.quantity || 'غير محدد'}\n` +
               `ملاحظات: ${formData.notes || 'لا يوجد'}\n` +
               `---\nتم الإرسال من نموذج الموقع.`;
    };

    DOM.leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formElements = DOM.leadForm.elements;
        const name = formElements['name'].value.trim();
        const whatsapp = formElements['whatsapp'].value.trim();
        const brand = formElements['brand'].value.trim();
        const productType = formElements['productType'].value;
        const need = formElements['need'].value.trim();
        const quantity = formElements['quantity'].value.trim();
        const notes = formElements['notes'].value.trim();

        // Validation
        let isValid = true;
        if (!name) {
            showError(formElements['name'], 'الاسم مطلوب');
            isValid = false;
        }
        if (!whatsapp) {
            showError(formElements['whatsapp'], 'رقم الواتساب مطلوب');
            isValid = false;
        } else if (!isValidEgyptWhatsApp(whatsapp)) {
            showError(formElements['whatsapp'], 'صيغة الرقم غير صحيحة (مثال: 01xxxxxxxxx)');
            isValid = false;
        }

        if (!isValid) return;

        // Form is valid - show success state (frontend only, no server)
        DOM.leadForm.style.display = 'none';
        DOM.leadFormWrapper.querySelector('.form-header').style.display = 'none';
        DOM.formSuccess.classList.add('visible');
        DOM.leadFormWrapper.classList.add('success');

        // Prepare WhatsApp message
        const formData = { name, brand, whatsapp, productType, need, quantity, notes };
        const message = constructWhatsAppMessage(formData);

        // Optionally auto-open WhatsApp after a delay (commented out for now)
        // setTimeout(() => openWhatsApp(message), 1500);

        // For demonstration, we just show success; the WhatsApp button can still be used.
        // If needed, store the message for later use.
        DOM.leadFormWrapper.setAttribute('data-whatsapp-message', message);
    });

    // Reset form (if needed later) - not implemented.
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

    if (DOM.whatsappBtn) {
        DOM.whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openWhatsApp(messageFromForm());
        });
    }
    if (DOM.ctaWhatsapp) {
        DOM.ctaWhatsapp.addEventListener('click', (e) => {
            e.preventDefault();
            openWhatsApp(messageFromForm());
        });
    }
    if (DOM.footerWhatsapp) {
        DOM.footerWhatsapp.addEventListener('click', (e) => {
            e.preventDefault();
            openWhatsApp(messageFromForm());
        });
    }
};

// =============================================
// HERO MOUSE INTERACTION (Desktop only)
// =============================================
const initHeroInteraction = () => {
    if (isTouchDevice() || !DOM.heroVisual) return;
    if (prefersReducedMotion()) return;

    const visual = DOM.heroVisual;
    let ticking = false;

    const updateParallax = (e) => {
        const rect = visual.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const moveX = (e.clientX - centerX) / 25;
        const moveY = (e.clientY - centerY) / 25;
        visual.style.transform = `translate(${moveX}px, ${moveY}px)`;
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
// CURSOR GLOW (Desktop only)
// =============================================
const initCursorGlow = () => {
    if (isTouchDevice() || !DOM.cursorGlow) return;
    if (prefersReducedMotion()) {
        DOM.cursorGlow.style.display = 'none';
        return;
    }

    window.addEventListener('mousemove', (e) => {
        DOM.cursorGlow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    });
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
});





















(function() {
    'use strict';

    // ================================================================
    // CHAT CONFIGURATION
    // ================================================================
    // All timing values are in milliseconds. Adjust these to fine-tune
    // the realism of the conversation flow.
    // ================================================================

    const TIMING = {
        // Typing simulation (based on message length)
        typingBase: 600,
        typingPerChar: 35,
        typingMin: 800,
        typingMax: 2200,

        // Pauses after a message appears
        afterClientMessage: { min: 600, max: 1000 },
        afterAuraMessage: { min: 700, max: 1200 },

        // Image display times (user needs to see them)
        imageViewTime: 1600,
        finalImageViewTime: 2600,

        // Delay before client asks for revision (after seeing first result)
        revisionDelay: 3800,

        // Status "Creating visual..." duration
        statusDuration: 1800,

        // Pause before final "READY" message and loop restart
        readyPause: 4000,
        resetPause: 500,

        // Fade-out duration for clearing messages (must match CSS transition)
        fadeDuration: 380,
    };

    // ================================================================
    // IMAGE ASSETS – change these paths to your own images
    // ================================================================

    const assets = {
        // Client product
        product: 'https://picsum.photos/seed/product/500/500',
        // AURA generated variations
        productBlack: 'https://picsum.photos/seed/black/500/500',
        productSummerBg: 'https://picsum.photos/seed/summer/500/500',
        productCoolLighting: 'https://picsum.photos/seed/cool/500/500',
        modelFirst: 'https://picsum.photos/seed/model1/500/500',
        modelPoseChanged: 'https://picsum.photos/seed/pose/500/500',
        modelFrontAngle: 'https://picsum.photos/seed/front/500/500',
        modelInstagram: 'https://picsum.photos/seed/insta/500/500',
        modelWebsite: 'https://picsum.photos/seed/web/500/500',
        modelStory: 'https://picsum.photos/seed/story/500/500',
        modelAd: 'https://picsum.photos/seed/ad/500/500',
        productWhiteBg: 'https://picsum.photos/seed/white/500/500',
        productBeigeBg: 'https://picsum.photos/seed/beige/500/500',
        finalCampaign: 'https://picsum.photos/seed/final/500/500',
        finalSet1: 'https://picsum.photos/seed/set1/500/500',
        finalSet2: 'https://picsum.photos/seed/set2/500/500',
        finalSet3: 'https://picsum.photos/seed/set3/500/500',
    };

    // ================================================================
    // DOM ELEMENTS (unchanged from original)
    // ================================================================

    const messagesEl = document.getElementById('chatMessages');
    const typingEl = document.getElementById('typingIndicator');
    const statusEl = document.getElementById('statusMessage');

    // ================================================================
    // STATE & FLOW CONTROL
    // ================================================================

    let isRunning = false;
    let isResetting = false;

    // ================================================================
    // UTILITY FUNCTIONS
    // ================================================================

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getTypingDelay(text) {
        const charCount = text.length;
        let delay = TIMING.typingBase + (charCount * TIMING.typingPerChar);
        delay = Math.max(delay, TIMING.typingMin);
        delay = Math.min(delay, TIMING.typingMax);
        return delay + randomBetween(-150, 150);
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        });
    }

    function getTimestamp() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        return h + ':' + m;
    }

    // ================================================================
    // TYPING INDICATOR
    // ================================================================

    function showTyping() {
        typingEl.classList.add('visible');
        scrollToBottom();
    }

    function hideTyping() {
        typingEl.classList.remove('visible');
    }

    // ================================================================
    // STATUS INDICATOR ("Creating visual...")
    // ================================================================

    function showStatus() {
        statusEl.classList.add('visible');
        scrollToBottom();
    }

    function hideStatus() {
        statusEl.classList.remove('visible');
    }

    // ================================================================
    // MESSAGE FUNCTIONS (preserve original class names and structure)
    // ================================================================

    function addMessage(sender, text) {
        const div = document.createElement('div');
        const cls = sender === 'client' ? 'message-client' : 'message-aura';
        div.className = 'message ' + cls;
        div.setAttribute('role', 'article');

        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        div.appendChild(textSpan);

        const ts = document.createElement('div');
        ts.className = 'message-timestamp';
        ts.textContent = getTimestamp();
        div.appendChild(ts);

        messagesEl.appendChild(div);
        scrollToBottom();
    }

    function addImageMessage(src, caption, isAura, emphasis) {
        const wrapper = document.createElement('div');
        const cls = isAura ? 'message-image-aura' : 'message-image';
        wrapper.className = cls;
        if (emphasis) wrapper.classList.add('emphasis');
        wrapper.setAttribute('role', 'article');

        const img = document.createElement('img');
        img.src = src;
        img.alt = caption || (isAura ? 'Generated visual' : 'Product image');
        img.loading = 'lazy';
        const imgId = 'img-caption-' + Date.now();
        img.setAttribute('aria-describedby', imgId);
        wrapper.appendChild(img);

        if (caption) {
            const cap = document.createElement('div');
            cap.className = 'img-caption';
            cap.id = imgId;
            cap.textContent = caption;
            wrapper.appendChild(cap);
        }

        messagesEl.appendChild(wrapper);
        scrollToBottom();
    }

    function addReadyMessage() {
        const div = document.createElement('div');
        div.className = 'ready-message';
        div.setAttribute('role', 'status');
        div.textContent = '✦ READY FOR YOUR CAMPAIGN ✦';
        messagesEl.appendChild(div);
        scrollToBottom();
    }

    function clearMessages() {
        return new Promise((resolve) => {
            const children = messagesEl.children;
            for (let i = 0; i < children.length; i++) {
                children[i].style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                children[i].style.opacity = '0';
                children[i].style.transform = 'translateY(6px)';
            }
            setTimeout(() => {
                messagesEl.innerHTML = '';
                scrollToBottom();
                resolve();
            }, TIMING.fadeDuration);
        });
    }

    // ================================================================
    // REDUCED MOTION SUPPORT
    // ================================================================

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionFactor = prefersReducedMotion ? 0.4 : 1.0;

    function adjustedDelay(base) {
        return Math.round(base * motionFactor);
    }

    // ================================================================
    // CONVERSATION FLOW (async/await for clarity)
    // ================================================================

    // Each step is a separate async function for maintainability.

    // ---- STEP 1: Client initiates ----
    async function step1_clientInit() {
        if (!isRunning) return;
        showTyping();
        const msg = 'هاي، عندي Collection جديدة وعايزة أجهز لها صور للحملة. محتاجة مساعدتكم.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 2: AURA welcomes and asks for product ----
    async function step2_auraWelcome() {
        if (!isRunning) return;
        showTyping();
        const msg = 'أهلاً سارة! ✨ نرحب بيكي في AURA. ابعتيلي صور المنتجات اللي عندك وقوليلي الـVibe اللي حابة تطلعيها.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(randomBetween(700, 1100)));
    }

    // ---- STEP 3: Client sends product image ----
    async function step3_clientSendsProduct() {
        if (!isRunning) return;
        addImageMessage(assets.product, 'Original Product', false, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 4: AURA acknowledges and asks for style ----
    async function step4_auraAskStyle() {
        if (!isRunning) return;
        showTyping();
        const msg = 'جميلة! القطعة واضحة. قوليلي الألوان اللي حابة تركزي عليها والستايل العام.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(randomBetween(700, 1100)));
    }

    // ---- STEP 5: Client asks for color variation (black) ----
    async function step5_clientColorRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'عايزاها باللون البيج اللي في الصورة، بس ممكن نشوفها بالأسود كمان؟ عشان التنوع.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 6: AURA confirms color change ----
    async function step6_auraColorConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'أكيد، هنحافظ على تفاصيل القماش ونجهزلك نسخة سوداء.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send the black color image
        addImageMessage(assets.productBlack, 'Color Variation – Black', true, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 7: Client asks for background change (summer) ----
    async function step7_clientBgRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'حلوة أوي! بس الخلفية دي مش مناسبة للـStory. ممكن نخليها خلفية صيفية فاتحة؟';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 8: AURA confirms bg change ----
    async function step8_auraBgConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'تمام، هنجهزلك خلفية هادية ومناسبة للجو الصيفي.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send summer bg image
        addImageMessage(assets.productSummerBg, 'Summer Background', true, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 9: Client asks for lighting change ----
    async function step9_clientLightingRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'جميلة جدًا! بس حاسة إن الإضاءة دافية شوية. ممكن نخليها باردة شوية عشان تبقى راقية؟';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 10: AURA confirms lighting change ----
    async function step10_auraLightingConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'أكيد، هنعدل الإضاءة لباردة مع الحفاظ على تفاصيل القطعة.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send cool lighting image
        addImageMessage(assets.productCoolLighting, 'Cool Lighting', true, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 11: Client asks for model ----
    async function step11_clientModelRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'روعة! بس الفكرة الأساسية إن القطعة رايقة جدًا، وعايزاها تظهر على موديل عشان نحس بالحركة.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 12: AURA asks for model type ----
    async function step12_auraAskModelType() {
        if (!isRunning) return;
        showTyping();
        const msg = 'فكرة جميلة. اختاري نوع الموديل المناسب للبراند: أنثوي، رياضي، كلاسيكي؟';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(randomBetween(700, 1100)));
    }

    // ---- STEP 13: Client specifies model ----
    async function step13_clientSpecifyModel() {
        if (!isRunning) return;
        showTyping();
        const msg = 'موديل رياضي-أنثوي، وشعرها منسدل. ويفضل تكون واقفة بشكل طبيعي.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 14: AURA confirms and generates model ----
    async function step14_auraGenerateModel() {
        if (!isRunning) return;
        showTyping();
        const msg = 'تمام، هنجهزلك أول نسخة.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Show "Creating visual..." status
        showStatus();
        await wait(adjustedDelay(TIMING.statusDuration));
        hideStatus();
        await wait(adjustedDelay(300));
        // Send first model image
        addImageMessage(assets.modelFirst, 'Model Visual – First', true, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 15: Client asks for pose change ----
    async function step15_clientPoseRequest() {
        if (!isRunning) return;
        // Give client time to evaluate the model image
        await wait(adjustedDelay(TIMING.revisionDelay));
        showTyping();
        const msg = 'جميلة أوي! بس ممكن تخلي وضعية الموديل أهدى شوية؟ الأيدين يكونوا على الجنب.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 16: AURA confirms pose change ----
    async function step16_auraPoseConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'أكيد، هنعدل الـPose.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send pose changed image
        addImageMessage(assets.modelPoseChanged, 'Pose Adjusted', true, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 17: Client asks for camera angle ----
    async function step17_clientAngleRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'أحلى كده! بس زاوية الكاميرا عالية شوية. ممكن نخليها من الأمام مباشرة؟';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 18: AURA confirms angle change ----
    async function step18_auraAngleConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'تم، هضبط الزاوية.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send front angle image
        addImageMessage(assets.modelFrontAngle, 'Front Angle', true, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 19: Client asks for multiple aspect ratios ----
    async function step19_clientAspectRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'ممتاز! دلوقتي عايزة نفس الصورة بمقاسات مختلفة: للـInstagram، الموقع الإلكتروني، الـStory، والإعلانات.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 20: AURA confirms aspect ratios ----
    async function step20_auraAspectConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'أكيد، هنحضرلك كل المقاسات مع الحفاظ على Composition الصورة.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send four images in sequence
        const aspectImages = [
            { src: assets.modelInstagram, label: 'Instagram' },
            { src: assets.modelWebsite, label: 'Website' },
            { src: assets.modelStory, label: 'Story' },
            { src: assets.modelAd, label: 'Ad' },
        ];
        for (const img of aspectImages) {
            if (!isRunning) return;
            addImageMessage(img.src, img.label, true, false);
            await wait(adjustedDelay(800)); // short pause between images
        }
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 21: Client asks for white background (no model) ----
    async function step21_clientWhiteBgRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'تحفة! بس محتاجة كمان نسخة للـProduct Listing تكون بدون موديل، ولكن مع خلفية بيضاء ونظيفة.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 22: AURA confirms white background ----
    async function step22_auraWhiteBgConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'تمام، هنفصل المنتج عن الخلفية ونحطه على أبيض.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send white background image
        addImageMessage(assets.productWhiteBg, 'White Background', true, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 23: Client asks for beige background ----
    async function step23_clientBeigeBgRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'جميل! بس عايزة كمان نسخة من نفس الصورة لكن مع خلفية بيج فاتح عشان تتناسب مع موقعي.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 24: AURA confirms beige background ----
    async function step24_auraBeigeBgConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'أكيد، هنغيرها.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send beige background image
        addImageMessage(assets.productBeigeBg, 'Beige Background', true, false);
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 25: Client asks to add logo ----
    async function step25_clientLogoRequest() {
        if (!isRunning) return;
        showTyping();
        const msg = 'تمام كده! بس خلينا نرجع للصورة الأساسية (البيج الأولى) ونضيف عليها شعار براند LUNE بشكل بسيط في الزاوية.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 26: AURA confirms logo addition ----
    async function step26_auraLogoConfirm() {
        if (!isRunning) return;
        showTyping();
        const msg = 'ممكن، هنضيف الشعار مع الحفاظ على نظافة الصورة.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));
        // Send final campaign visual with logo (emphasis)
        addImageMessage(assets.finalCampaign, 'Final Campaign Visual', true, true);
        await wait(adjustedDelay(TIMING.finalImageViewTime));
    }

    // ---- STEP 27: Client final approval ----
    async function step27_clientFinalApproval() {
        if (!isRunning) return;
        showTyping();
        const msg = 'تحفة! دي بالضبط اللي كنت عايزاه. شكرًا جدًا!';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('client', msg);
        await wait(adjustedDelay(randomBetween(600, 1000)));
    }

    // ---- STEP 28: AURA delivers final set ----
    async function step28_auraFinalSet() {
        if (!isRunning) return;
        showTyping();
        const msg = 'العفو سارة! ✨ كده عندنا مجموعة كاملة من الفيجوالز جاهزة لحملتك. أي تعديل تاني أنا موجودة.';
        await wait(adjustedDelay(getTypingDelay(msg)));
        if (!isRunning) return;
        hideTyping();
        addMessage('aura', msg);
        await wait(adjustedDelay(700));

        // Send a set of final campaign visuals (three images)
        const finalSet = [
            { src: assets.finalSet1, label: 'Campaign Visuals Set – 1' },
            { src: assets.finalSet2, label: 'Campaign Visuals Set – 2' },
            { src: assets.finalSet3, label: 'Campaign Visuals Set – 3' },
        ];
        for (const img of finalSet) {
            if (!isRunning) return;
            addImageMessage(img.src, img.label, true, false);
            await wait(adjustedDelay(700));
        }
        await wait(adjustedDelay(TIMING.imageViewTime));
    }

    // ---- STEP 29: Ready message and loop ----
    async function step29_readyAndLoop() {
        if (!isRunning) return;
        addReadyMessage();
        await wait(adjustedDelay(TIMING.readyPause));
    }

    // ================================================================
    // RESET & LOOP MANAGEMENT
    // ================================================================

    async function runConversation() {
        if (isRunning) return;
        isRunning = true;
        isResetting = false;

        hideTyping();
        hideStatus();

        while (isRunning) {
            await step1_clientInit();
            if (!isRunning) break;
            await step2_auraWelcome();
            if (!isRunning) break;
            await step3_clientSendsProduct();
            if (!isRunning) break;
            await step4_auraAskStyle();
            if (!isRunning) break;
            await step5_clientColorRequest();
            if (!isRunning) break;
            await step6_auraColorConfirm();
            if (!isRunning) break;
            await step7_clientBgRequest();
            if (!isRunning) break;
            await step8_auraBgConfirm();
            if (!isRunning) break;
            await step9_clientLightingRequest();
            if (!isRunning) break;
            await step10_auraLightingConfirm();
            if (!isRunning) break;
            await step11_clientModelRequest();
            if (!isRunning) break;
            await step12_auraAskModelType();
            if (!isRunning) break;
            await step13_clientSpecifyModel();
            if (!isRunning) break;
            await step14_auraGenerateModel();
            if (!isRunning) break;
            await step15_clientPoseRequest();
            if (!isRunning) break;
            await step16_auraPoseConfirm();
            if (!isRunning) break;
            await step17_clientAngleRequest();
            if (!isRunning) break;
            await step18_auraAngleConfirm();
            if (!isRunning) break;
            await step19_clientAspectRequest();
            if (!isRunning) break;
            await step20_auraAspectConfirm();
            if (!isRunning) break;
            await step21_clientWhiteBgRequest();
            if (!isRunning) break;
            await step22_auraWhiteBgConfirm();
            if (!isRunning) break;
            await step23_clientBeigeBgRequest();
            if (!isRunning) break;
            await step24_auraBeigeBgConfirm();
            if (!isRunning) break;
            await step25_clientLogoRequest();
            if (!isRunning) break;
            await step26_auraLogoConfirm();
            if (!isRunning) break;
            await step27_clientFinalApproval();
            if (!isRunning) break;
            await step28_auraFinalSet();
            if (!isRunning) break;
            await step29_readyAndLoop();
            if (!isRunning) break;

            // Reset chat
            hideTyping();
            hideStatus();
            await clearMessages();
            await wait(adjustedDelay(TIMING.resetPause));
        }

        hideTyping();
        hideStatus();
        isRunning = false;
    }

    // ================================================================
    // START & RESTART
    // ================================================================

    function startConversation() {
        if (isRunning) return;
        hideTyping();
        hideStatus();
        clearMessages().then(() => {
            runConversation();
        });
    }

    function resetAndRestart() {
        if (!isRunning) return;
        isResetting = true;
        isRunning = false;
        hideTyping();
        hideStatus();
        clearMessages().then(() => {
            isResetting = false;
            setTimeout(() => {
                startConversation();
            }, 200);
        });
    }

    // ================================================================
    // INIT – start automatically
    // ================================================================

    startConversation();

    // ================================================================
    // EXPOSE CONTROLS (for debugging / manual restart)
    // ================================================================

    window.auraAssets = assets;
    window.auraChat = {
        restart: resetAndRestart,
        assets: assets
    };

    window.addEventListener('beforeunload', function() {
        isRunning = false;
        isResetting = true;
    });

})();