/**
 * Millenium Holdings Family Trust
 * Main JavaScript - Nature Theme with Animations
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const currentYearEl = document.getElementById('currentYear');
    const contactForm = document.getElementById('contactForm');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    // Security: Rate limiting and timing
    let lastFormSubmit = 0;
    const FORM_RATE_LIMIT = 60000; // 1 minute between submissions
    const MIN_FORM_TIME = 3000; // Minimum 3 seconds to submit (catches bots)
    let formStartTime = 0;

    /**
     * Initialize the application
     */
    function init() {
        setTrustData(); // Apply TRUST_DATA from data.js
        setCurrentYear();
        initMobileNav();
        initSmoothScroll();
        initHeaderScroll();
        initActiveNav();
        initMobileNavHighlight();
        initScrollAnimations();
        initStatCounters();
        initFormHandling();
    }

    /**
     * Apply TRUST_DATA values from data.js to HTML elements
     */
    function setTrustData() {
        // Check if TRUST_DATA exists (loaded from data.js)
        if (typeof TRUST_DATA === 'undefined') {
            console.warn('TRUST_DATA not found - using HTML default values');
            return;
        }

        const currentYear = new Date().getFullYear();
        const counters = document.querySelectorAll('.stat-value[data-value]');
        const trustValues = [
            TRUST_DATA.fundsUnderManagement,
            TRUST_DATA.annualContributions,
            TRUST_DATA.lifetimePerformance
        ];

        counters.forEach(function(counter, index) {
            if (trustValues[index]) {
                counter.setAttribute('data-value', trustValues[index]);
            }
        });

        // Update labels to show dynamic year for annual contributions
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels[1]) {
            statLabels[1].textContent = currentYear + ' Contributions';
        }
    }

    /**
     * Set current year in footer
     */
    function setCurrentYear() {
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
    }

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
                navToggle.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function closeMobileMenu() {
        if (navToggle && navMenu) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }
            });
        });
    }

    /**
     * Header Background on Scroll
     */
    function initHeaderScroll() {
        if (!header) return;

        function updateHeader() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    /**
     * Active Navigation Highlight
     */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = header ? header.offsetHeight : 0;

        function updateActiveNav() {
            const scrollPosition = window.scrollY + navHeight + 100;

            sections.forEach(function(section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav();
    }

    /**
     * Mobile Bottom Navigation Highlight
     */
    function initMobileNavHighlight() {
        if (!mobileNavItems.length) return;

        const sections = document.querySelectorAll('section[id]');

        function updateMobileNav() {
            const scrollPosition = window.scrollY + 100;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Determine which section is most visible
            let activeSection = '';

            sections.forEach(function(section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                // Check if section is in viewport
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    activeSection = sectionId;
                }
            });

            // Special case: if at bottom of page, show contact
            if (windowHeight + scrollPosition >= documentHeight - 100) {
                activeSection = 'contact';
            }

            // Update mobile nav items
            mobileNavItems.forEach(function(item) {
                const target = item.getAttribute('data-target');
                if (target === activeSection) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        window.addEventListener('scroll', updateMobileNav, { passive: true });
        updateMobileNav();
    }

    /**
     * Scroll Animations using Intersection Observer
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in');

        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(element) {
            observer.observe(element);
        });
    }

    /**
     * Animated Number Counters
     */
    function initStatCounters() {
        const counters = document.querySelectorAll('.stat-value[data-value]');

        if (!counters.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }

    /**
     * Animate a single counter
     */
    function animateCounter(element) {
        const targetValue = element.getAttribute('data-value');
        const duration = 2000; // Animation duration in ms
        const startTime = performance.now();
        const startValue = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;

        // Parse target value
        const targetNum = parseFloat(targetValue.replace(/[^0-9.-]/g, ''));
        const hasPercent = targetValue.includes('%');
        const hasPlus = targetValue.includes('+');
        const hasDollar = targetValue.includes('$');
        const suffix = targetValue.includes('M') ? ' M' : (targetValue.includes('B') ? ' B' : '');

        // Determine if we're counting up or down
        const isDecimal = targetNum % 1 !== 0;
        const increment = (targetNum - startValue) / (duration / 16); // Frames at ~60fps

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            let currentNum;
            if (isDecimal) {
                currentNum = startValue + (targetNum - startValue) * easedProgress;
            } else {
                currentNum = Math.round(startValue + (targetNum - startValue) * easedProgress);
            }

            let displayValue = '';
            if (hasDollar) displayValue += '$';
            if (hasPlus && targetNum > 0) displayValue += '+';
            displayValue += currentNum.toLocaleString('en-US', {
                minimumFractionDigits: isDecimal ? 1 : 0,
                maximumFractionDigits: isDecimal ? 1 : 0
            });
            if (hasPercent) displayValue += '%';
            if (suffix) displayValue += suffix;

            element.textContent = displayValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Ensure final value matches target
                element.textContent = targetValue;
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Contact Form Handling with Security Measures
     */
    function initFormHandling() {
        if (!contactForm) return;

        // Set form start time for timing-based spam detection
        formStartTime = Date.now();

        // Set timestamp field
        const timestampField = document.getElementById('formTimestamp');
        if (timestampField) {
            timestampField.value = formStartTime;
        }

        contactForm.addEventListener('submit', handleFormSubmit);

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    /**
     * Handle form submission with spam protection
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const now = Date.now();

        // Security Check 1: Rate limiting
        if (now - lastFormSubmit < FORM_RATE_LIMIT) {
            showFormMessage(contactForm, 'Please wait 60 seconds before submitting again.', 'error');
            return;
        }

        // Security Check 2: Honeypot field (bots will fill this hidden field)
        const honeypot = contactForm.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value !== '') {
            // Bot detected - silently fail
            console.log('Bot submission detected (honeypot)');
            showFormMessage(contactForm, 'Thank you for your message! We will be in touch shortly.', 'success');
            contactForm.reset();
            return;
        }

        // Security Check 3: Timing check (bots submit instantly)
        const timeSpent = now - formStartTime;
        if (timeSpent < MIN_FORM_TIME) {
            console.log('Bot submission detected (timing): ' + timeSpent + 'ms');
            showFormMessage(contactForm, 'Thank you for your message! We will be in touch shortly.', 'success');
            contactForm.reset();
            return;
        }

        // Security Check 4: Validate all required fields
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(function(field) {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showFormMessage(contactForm, 'Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
        submitBtn.disabled = true;

        // Get Formspree action
        const formData = new FormData(contactForm);
        const actionUrl = contactForm.getAttribute('action');

        // Check if using placeholder form ID (demo mode)
        const isDemoMode = actionUrl === 'https://formspree.io/f/your-form-id';

        if (isDemoMode) {
            // Formspree not configured - show demo success
            setTimeout(function() {
                showFormMessage(contactForm, 'Thank you for your message! We will be in touch shortly.', 'success');
                contactForm.reset();
                formStartTime = Date.now();
                resetButtonState(submitBtn, btnText, btnLoading);
                lastFormSubmit = now;
            }, 1500);
            return;
        }

        // Submit to Formspree
        fetch(actionUrl, {
            method: 'POST',
            body: formData,
            credentials: 'omit'
        })
        .then(function(response) {
            // Formspree redirects on success, so check for redirect or ok status
            if (response.ok || response.redirected) {
                showFormMessage(contactForm, 'Thank you for your message! We will be in touch shortly.', 'success');
                contactForm.reset();
                formStartTime = Date.now();
            } else {
                // Try to get error details from response
                return response.text().then(function(text) {
                    console.error('Formspree error:', response.status, text);
                    showFormMessage(contactForm, 'There was an error sending your message. Please try again.', 'error');
                });
            }
        })
        .catch(function(err) {
            console.error('Formspree submission error:', err);
            showFormMessage(contactForm, 'There was an error sending your message. Please try again.', 'error');
        })
        .finally(function() {
            resetButtonState(submitBtn, btnText, btnLoading);
            lastFormSubmit = now;
        });
    }

    /**
     * Validate a single field
     */
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();

        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            errorEl.textContent = errorMessage;
            field.parentNode.appendChild(errorEl);
        }

        return isValid;
    }

    /**
     * Show form message
     */
    function showFormMessage(form, message, type) {
        // Remove existing message
        const existingMsg = form.querySelector('.form-success, .form-error');
        if (existingMsg) existingMsg.remove();

        const msgEl = document.createElement('div');
        msgEl.className = 'form-' + type;
        msgEl.textContent = message;

        // Insert before the form note
        const formNote = form.querySelector('.form-note');
        if (formNote) {
            formNote.parentNode.insertBefore(msgEl, formNote);
        } else {
            form.appendChild(msgEl);
        }

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(function() {
                msgEl.remove();
            }, 5000);
        }

        // Scroll to message
        msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Reset button state
     */
    function resetButtonState(btn, textEl, loadingEl) {
        if (textEl) textEl.style.display = 'inline';
        if (loadingEl) loadingEl.style.display = 'none';
        btn.disabled = false;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
