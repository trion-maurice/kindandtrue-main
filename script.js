// ===== KIND & TRUE FOUNDATION - MAIN SCRIPT =====
// Defensive JavaScript - works across all pages without errors

// ===== LOADER =====
function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader || loader.classList.contains('hidden')) return;
    loader.classList.add('hidden');
    document.body.style.overflow = '';
}
window.addEventListener('load', () => { setTimeout(hideLoader, 500); });
setTimeout(hideLoader, 3000);

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', isActive.toString());
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Active navigation
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'home', '': 'home',
        'about.html': 'about', 'programs.html': 'programs',
        'stories.html': 'stories', 'donate.html': 'donate', 'contact.html': 'contact'
    };
    const activePage = pageMap[currentPage];
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPage = href.split('/').pop().split('#')[0];
        if (pageMap[linkPage] === activePage) link.classList.add('active');
    });
}
setActiveNavigation();

// Active link on scroll (homepage)
const sections = document.querySelectorAll('section[id]');
if (sections.length > 0) {
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        link.classList.remove('active');
                        if (href === `#${sectionId}`) link.classList.add('active');
                    }
                });
            }
        });
    });
}

//featured products slider
document.addEventListener("DOMContentLoaded", function () {
    const scrollContainer = document.querySelector(".product-scroll-container");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (scrollContainer && prevBtn && nextBtn) {
        // Dynamically calculate scroll amount (one card width + gap)
        const getScrollAmount = () => {
            const card = scrollContainer.querySelector(".product-card");
            if (card) {
                const style = window.getComputedStyle(scrollContainer);
                const gap = parseInt(style.gap) || 16;
                return card.offsetWidth + gap;
            }
            return 216; // Fallback: 200px card width + 16px gap
        };

        nextBtn.addEventListener("click", () => {
            scrollContainer.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        });

        prevBtn.addEventListener("click", () => {
            scrollContainer.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        });
    }
});

// ===== IMPACT COUNTERS =====
const impactNumbers = document.querySelectorAll('.impact-number[data-target]');
let countersStarted = false;
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        element.textContent = Math.floor(easeOutQuart * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(updateCounter);
        else element.textContent = target.toLocaleString();
    };
    requestAnimationFrame(updateCounter);
};
if (impactNumbers.length > 0) {
    const impactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                impactNumbers.forEach(num => animateCounter(num));
            }
        });
    }, { threshold: 0.3 });
    impactNumbers.forEach(num => impactObserver.observe(num));
}

// ===== STORIES SLIDER (Homepage) =====
const storiesTrack = document.getElementById('storiesTrack');
const storyPrev = document.getElementById('storyPrev');
const storyNext = document.getElementById('storyNext');
const storyDotsContainer = document.getElementById('storyDots');
const storyCards = document.querySelectorAll('.stories-slider .story-card');
let currentStory = 0;
let autoSlide = null;

if (storiesTrack && storyCards.length > 0) {
    if (storyDotsContainer) {
        storyCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('story-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToStory(index));
            storyDotsContainer.appendChild(dot);
        });
    }
    const storyDots = document.querySelectorAll('.story-dot');
    const goToStory = (index) => {
        currentStory = index;
        storiesTrack.style.transform = `translateX(-${index * 100}%)`;
        storyDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };
    if (storyNext) storyNext.addEventListener('click', () => { currentStory = (currentStory + 1) % storyCards.length; goToStory(currentStory); });
    if (storyPrev) storyPrev.addEventListener('click', () => { currentStory = (currentStory - 1 + storyCards.length) % storyCards.length; goToStory(currentStory); });
    autoSlide = setInterval(() => { currentStory = (currentStory + 1) % storyCards.length; goToStory(currentStory); }, 6000);
    const storiesSlider = document.querySelector('.stories-slider');
    if (storiesSlider) {
        storiesSlider.addEventListener('mouseenter', () => clearInterval(autoSlide));
        storiesSlider.addEventListener('mouseleave', () => { autoSlide = setInterval(() => { currentStory = (currentStory + 1) % storyCards.length; goToStory(currentStory); }, 6000); });
    }
    let touchStartX = 0;
    if (storiesSlider) {
        storiesSlider.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        storiesSlider.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) currentStory = (currentStory + 1) % storyCards.length;
                else currentStory = (currentStory - 1 + storyCards.length) % storyCards.length;
                goToStory(currentStory);
            }
        }, { passive: true });
    }
}

// ===== STORIES PAGE MODAL =====
const storyModal = document.getElementById('storyModal');
const storyModalClose = document.getElementById('storyModalClose');
const storyModalOverlay = document.getElementById('storyModalOverlay');
const storyModalContent = document.getElementById('storyModalContent');

function openStoryModal(story) {
    if (!storyModal) return;
    let html = '';
    if (story.image) html += `<div class="story-modal-image"><img src="${story.image}" alt="${story.title}" loading="lazy" /></div>`;
    html += `<div class="story-modal-header">`;
    if (story.program) html += `<span class="story-modal-tag">${story.program}</span>`;
    html += `<h2 id="storyModalTitle">${story.title}</h2>`;
    if (story.author || story.location || story.date) {
        html += `<div class="story-modal-meta">`;
        if (story.author) html += `<span>${story.author}</span>`;
        if (story.location) html += `<span>📍 ${story.location}</span>`;
        if (story.date) html += `<span>${story.date}</span>`;
        html += `</div>`;
    }
    html += `</div><div class="story-modal-body"><p>${story.fullStory || story.excerpt}</p></div>`;
    if (storyModalContent) storyModalContent.innerHTML = html;
    storyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (storyModalClose) storyModalClose.focus();
}

function closeStoryModal() {
    if (!storyModal) return;
    storyModal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.story-expand-btn, .featured-story .story-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.story-card-grid') || btn.closest('.featured-story');
        if (!card) return;
        openStoryModal({
            title: card.querySelector('.story-card-title')?.textContent || card.querySelector('h3')?.textContent || '',
            excerpt: card.querySelector('.story-card-excerpt')?.textContent || '',
            fullStory: card.getAttribute('data-full-story') || '',
            author: card.getAttribute('data-author') || '',
            location: card.getAttribute('data-location') || '',
            program: card.getAttribute('data-program') || '',
            date: card.getAttribute('data-date') || '',
            image: card.getAttribute('data-image') || ''
        });
    });
});
if (storyModalClose) storyModalClose.addEventListener('click', closeStoryModal);
if (storyModalOverlay) storyModalOverlay.addEventListener('click', closeStoryModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && storyModal && storyModal.classList.contains('active')) closeStoryModal();
});

// ===== DONATION PAGE =====
const amountBtns = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');
const donateContinueBtn = document.getElementById('donateContinueBtn');
const donationStep1 = document.getElementById('donationStep1');
const donationStep2 = document.getElementById('donationStep2');
const donationStep3 = document.getElementById('donationStep3');
const selectedAmountDisplay = document.getElementById('selectedAmountDisplay');
const donationDetailsForm = document.getElementById('donationDetailsForm');
const backToStep1 = document.getElementById('backToStep1');
const backToStep2 = document.getElementById('backToStep2');
const proceedToPayment = document.getElementById('proceedToPayment');

if (amountBtns.length > 0) {
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (customAmountInput) {
                const wrapper = customAmountInput.closest('.custom-amount-wrapper');
                if (btn.dataset.amount === 'custom') {
                    if (wrapper) wrapper.classList.add('visible');
                    customAmountInput.focus();
                } else {
                    if (wrapper) wrapper.classList.remove('visible');
                    customAmountInput.value = '';
                }
            }
            if (donateContinueBtn) {
                const amount = btn.dataset.amount === 'custom' ? customAmountInput?.value : btn.dataset.amount;
                donateContinueBtn.disabled = !amount || amount <= 0;
            }
        });
    });
}
if (customAmountInput) {
    customAmountInput.addEventListener('input', () => {
        customAmountInput.value = customAmountInput.value.replace(/[^0-9]/g, '');
        if (donateContinueBtn) donateContinueBtn.disabled = !parseInt(customAmountInput.value);
    });
}
if (donateContinueBtn && donationStep1 && donationStep2) {
    donateContinueBtn.addEventListener('click', () => {
        const activeBtn = document.querySelector('.amount-btn.active');
        if (!activeBtn) return;
        const amount = activeBtn.dataset.amount === 'custom' ? customAmountInput?.value : activeBtn.dataset.amount;
        if (!amount || amount <= 0) return;
        if (selectedAmountDisplay) selectedAmountDisplay.textContent = `UGX ${parseInt(amount).toLocaleString()}`;
        donationStep1.classList.add('hidden');
        donationStep2.classList.remove('hidden');
        //window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
if (backToStep1 && donationStep1 && donationStep2) {
    backToStep1.addEventListener('click', () => { donationStep2.classList.add('hidden'); donationStep1.classList.remove('hidden'); });
}
if (backToStep2 && donationStep2 && donationStep3) {
    backToStep2.addEventListener('click', () => { donationStep3.classList.add('hidden'); donationStep2.classList.remove('hidden'); });
}
if (proceedToPayment && donationStep2 && donationStep3) {
    proceedToPayment.addEventListener('click', (e) => {
        e.preventDefault();
        if (donationDetailsForm && donationDetailsForm.checkValidity()) {
            donationStep2.classList.add('hidden');
            donationStep3.classList.remove('hidden');
            //window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (donationDetailsForm) donationDetailsForm.reportValidity();
    });
}

// ===== HOMEPAGE DONATE BUTTON =====
const donateBtn = document.querySelector('.donate-btn');
if (donateBtn) {
    donateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'donate.html';
    });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-primary');
        if (!btn) return;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Sending... ⏳</span>';
        btn.disabled = true;
        const formData = new FormData(contactForm);
        if (formData.get('website')) {
            btn.innerHTML = '<span>Message Sent! ✓</span>';
            setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; contactForm.reset(); }, 2000);
            return;
        }
        try {
            const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(formData).toString() });
            if (response.ok) {
                btn.innerHTML = '<span>Message Sent! ✓</span>';
                btn.style.background = 'var(--accent)';
                btn.style.color = 'var(--primary)';
                contactForm.reset();
            } else throw new Error('Failed');
        } catch (error) {
            btn.innerHTML = '<span>Failed. Try again.</span>';
        } finally {
            setTimeout(() => { btn.innerHTML = originalHTML; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }, 2500);
        }
    });
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = newsletterForm.querySelector('button');
        if (!btn) return;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>⏳</span>';
        btn.disabled = true;
        const formData = new FormData(newsletterForm);
        if (formData.get('website')) {
            btn.innerHTML = '✓';
            setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; newsletterForm.reset(); }, 2000);
            return;
        }
        try {
            const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(formData).toString() });
            if (response.ok) {
                btn.innerHTML = '✓';
                btn.style.background = 'var(--accent)';
                btn.style.color = 'var(--primary)';
                newsletterForm.reset();
            } else throw new Error('Failed');
        } catch (error) {
            btn.innerHTML = '✕';
        } finally {
            setTimeout(() => { btn.innerHTML = originalHTML; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }, 2500);
        }
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== SCROLL REVEAL =====
const revealSelectors = ['.about-grid', '.impact-card', '.program-card', '.story-card', '.donate-content', '.contact-grid', '.footer-grid', '.values-grid .value-card', '.approach-step', '.story-card-grid', '.page-hero', '.mission-vision-grid', '.support-card', '.transparency-card', '.contact-info-card', '.map-section', '.featured-story', '.cta-section', '.process-section'];
const revealElements = document.querySelectorAll(revealSelectors.join(', '));
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal', 'active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

// ===== PARALLAX HERO =====
const heroBg = document.querySelector('.hero-bg img');
if (heroBg) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset < window.innerHeight) {
            heroBg.style.transform = `scale(1.1) translateY(${window.pageYOffset * 0.3}px)`;
        }
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ===== CURSOR GLOW =====
if (window.innerWidth > 768) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = 'position:fixed;width:300px;height:300px;background:radial-gradient(circle,rgba(49,17,208,0.08) 0%,transparent 70%);border-radius:50%;pointer-events:none;z-index:1;transform:translate(-50%,-50%);transition:opacity 0.3s ease;';
    document.body.appendChild(cursorGlow);
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ===== COPYRIGHT YEAR =====
const yearElement = document.getElementById('currentYear');
if (yearElement) yearElement.textContent = new Date().getFullYear();

// ===== REDUCED MOTION =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    if (heroBg) heroBg.style.transform = 'scale(1.1)';
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
}

// ===== CONSOLE BRANDING =====
console.log('%c❤️ Kind & True Foundation', 'color: #3111D0; font-size: 20px; font-weight: bold;');
console.log('%cEmpowering Lives, Transforming Futures', 'color: #BFF2D8; font-size: 14px;');