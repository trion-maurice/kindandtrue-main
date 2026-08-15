
// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2200);
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== IMPACT COUNTERS =====
const impactNumbers = document.querySelectorAll('.impact-number');
let countersStarted = false;

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    requestAnimationFrame(updateCounter);
};

const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            impactNumbers.forEach(num => animateCounter(num));
        }
    });
}, { threshold: 0.3 });

const impactSection = document.getElementById('impact');
if (impactSection) {
    impactObserver.observe(impactSection);
}

// ===== STORIES SLIDER =====
const storiesTrack = document.getElementById('storiesTrack');
const storyPrev = document.getElementById('storyPrev');
const storyNext = document.getElementById('storyNext');
const storyDotsContainer = document.getElementById('storyDots');
const storyCards = document.querySelectorAll('.story-card');
let currentStory = 0;

// Create dots
storyCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('story-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToStory(index));
    storyDotsContainer.appendChild(dot);
});

const storyDots = document.querySelectorAll('.story-dot');

const goToStory = (index) => {
    currentStory = index;
    storiesTrack.style.transform = `translateX(-${index * 100}%)`;
    storyDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
};

storyNext.addEventListener('click', () => {
    currentStory = (currentStory + 1) % storyCards.length;
    goToStory(currentStory);
});

storyPrev.addEventListener('click', () => {
    currentStory = (currentStory - 1 + storyCards.length) % storyCards.length;
    goToStory(currentStory);
});

// Auto-slide
let autoSlide = setInterval(() => {
    currentStory = (currentStory + 1) % storyCards.length;
    goToStory(currentStory);
}, 6000);

// Pause on hover
const storiesSlider = document.querySelector('.stories-slider');
storiesSlider.addEventListener('mouseenter', () => clearInterval(autoSlide));
storiesSlider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
        currentStory = (currentStory + 1) % storyCards.length;
        goToStory(currentStory);
    }, 6000);
});


// ===== DONATE BUTTON =====
const donateBtn = document.querySelector('.donate-btn');
donateBtn.addEventListener('click', () => {
    const activeBtn = document.querySelector('.amount-btn.active');
    const amount = activeBtn.dataset.amount === 'custom'
        ? document.getElementById('customAmount').value
        : activeBtn.dataset.amount;

    if (amount && amount > 0) {
        donateBtn.innerHTML = '<span>Thank You! ❤</span>';
        donateBtn.style.background = 'var(--accent)';
        donateBtn.style.color = 'var(--primary)';

        setTimeout(() => {
            donateBtn.innerHTML = '<span>Donate Now</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>';
            donateBtn.style.background = '';
            donateBtn.style.color = '';
        }, 2500);
    }
});

// ===== SECURE CONTACT FORM (Webhook + Honeypot) =====
// ===== CONTACT FORM (Netlify Native) =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-primary');
  const originalHTML = btn.innerHTML;

  btn.innerHTML = '<span>Sending... ⏳</span>';
  btn.disabled = true;

  const formData = new FormData(contactForm);
  
  // Honeypot check
  if (formData.get('website')) {
    btn.innerHTML = '<span>Message Sent! ✓</span>';
    setTimeout(() => { 
      btn.innerHTML = originalHTML; 
      btn.disabled = false; 
      contactForm.reset();
    }, 2000);
    return; 
  }

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
      btn.innerHTML = '<span>Message Sent! ✓</span>';
      btn.style.background = 'var(--accent)';
      btn.style.color = 'var(--primary)';
      contactForm.reset();
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Form error:', error);
    btn.innerHTML = '<span>Failed. Try again.</span>';
  } finally {
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 2500);
  }
});

// ===== NEWSLETTER FORM (Netlify Native) =====
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>⏳</span>';
    btn.disabled = true;

    const formData = new FormData(newsletterForm);

    // Honeypot Check
    if (formData.get('website')) {
        btn.innerHTML = '✓';
        setTimeout(() => { 
            btn.innerHTML = originalHTML; 
            btn.disabled = false; 
            newsletterForm.reset();
        }, 2000);
        return;
    }

    try {
        // Submit to Netlify's native form handler
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
            btn.innerHTML = '✓';
            btn.style.background = 'var(--accent)';
            btn.style.color = 'var(--primary)';
            newsletterForm.reset();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Newsletter error:', error);
        btn.innerHTML = '✕';
    } finally {
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
        }, 2500);
    }
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.about-grid, .impact-card, .program-card, .story-card, .donate-content, .contact-grid, .footer-grid');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal', 'active');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ===== PARALLAX HERO =====
const heroBg = document.querySelector('.hero-bg img');
window.addEventListener('scroll', () => {
    if (window.pageYOffset < window.innerHeight) {
        heroBg.style.transform = `scale(1.1) translateY(${window.pageYOffset * 0.3}px)`;
    }
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ===== CURSOR GLOW EFFECT (desktop only) =====
if (window.innerWidth > 768) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(49, 17, 208, 0.08) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ===== TOUCH SUPPORT FOR STORIES SLIDER =====
let touchStartX = 0;
let touchEndX = 0;

storiesSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

storiesSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            currentStory = (currentStory + 1) % storyCards.length;
        } else {
            currentStory = (currentStory - 1 + storyCards.length) % storyCards.length;
        }
        goToStory(currentStory);
    }
}, { passive: true });

console.log('%c❤️ KindandTrue Foundation', 'color: #3111D0; font-size: 20px; font-weight: bold;');
console.log('%cEmpowering Lives, Transforming Futures', 'color: #BFF2D8; font-size: 14px;');


