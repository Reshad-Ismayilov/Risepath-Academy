document.addEventListener('DOMContentLoaded', () => {
    // Language Switcher Logic
    const currentLang = localStorage.getItem('selectedLang') || 'az';
    
    const updateLanguage = (lang) => {
        if (typeof translations === 'undefined') {
            console.error('Translations not found!');
            return;
        }
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerText = translations[lang][key];
                }
            }
        });
        
        // Update custom dropdown UI
        const selectedLangText = document.getElementById('selectedLangText');
        if (selectedLangText) {
            selectedLangText.innerText = lang.toUpperCase();
        }
        
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.toggle('selected', option.getAttribute('data-lang') === lang);
        });
        
        localStorage.setItem('selectedLang', lang);
        document.documentElement.lang = lang;
    };

    // Initialize language
    setTimeout(() => updateLanguage(currentLang), 50);

    // Custom Dropdown Logic
    const langSwitcher = document.querySelector('.lang-switcher');
    const langCustomSelect = document.querySelector('.lang-custom-select');

    if (langCustomSelect) {
        langCustomSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            langSwitcher.classList.toggle('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (langSwitcher && !langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('active');
        }
    });

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            updateLanguage(lang);
            langSwitcher.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navContainer.classList.toggle('mobile-active');
            document.body.style.overflow = navContainer.classList.contains('mobile-active') ? 'hidden' : 'auto';
            
            // Animate hamburger
            const spans = menuToggle.querySelectorAll('span');
            if (navContainer.classList.contains('mobile-active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('mobile-active');
            document.body.style.overflow = 'auto';
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const reveal = () => {
        revealElements.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Initial check

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Animated Counters
    const counters = document.querySelectorAll('.stat-item h3');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace('+', '').replace('%', '');
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc) + (counter.innerText.includes('%') ? '%' : '+');
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target + (counter.innerText.includes('%') ? '%' : '+');
            }
        });
    };

    // Intersection Observer for Counters
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // Video Embedding Logic for Blog
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const url = container.getAttribute('data-url');
        if (!url) return;

        if (url.includes('tiktok.com')) {
            let videoId = '';
            // Try to extract ID from vt.tiktok.com redirect or full URL
            const fullUrlMatch = url.match(/\/video\/(\d+)/);
            if (fullUrlMatch && fullUrlMatch[1]) {
                videoId = fullUrlMatch[1];
            } else if (url.includes('ZS9cgygTK')) {
                videoId = '7432857088114674950'; // Mapping for known short link
            } else if (url.includes('ZS9cg1jDk')) {
                videoId = '7429150438136548614'; // Mapping for known short link
            }

            if (videoId) {
                // Use the v2 embed but with loop and no controls for cleaner look
                container.innerHTML = `<iframe src="https://www.tiktok.com/embed/v2/${videoId}?loop=1&autoplay=1&muted=1&controls=0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
            } else {
                container.innerHTML = `<iframe src="${url}" allowfullscreen></iframe>`;
            }
        } else if (url.includes('instagram.com')) {
            let id = '';
            if (url.includes('/reels/') || url.includes('/reel/')) {
                id = url.split('/reel/')[1] || url.split('/reels/')[1];
            } else if (url.includes('/p/')) {
                id = url.split('/p/')[1];
            }
            
            if (id) {
                id = id.split('/')[0];
                // Added /embed/captioned=0 to hide captions/UI
                container.innerHTML = `<iframe src="https://www.instagram.com/reel/${id}/embed/?cr=1&v=12&wp=1080&rd=https%3A%2F%2Fwww.risepath.academy&rp=%2Fblog#%7B%22ci%22%3A0%2C%22os%22%3A150%7D" allowfullscreen></iframe>`;
            }
        }
     });

    // Mute/Unmute Logic for Blog Videos
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        const video = card.querySelector('video');
        const muteBtn = card.querySelector('.mute-btn');
        const muteIcon = muteBtn ? muteBtn.querySelector('i') : null;

        if (video && muteBtn) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.muted) {
                    video.muted = false;
                    muteIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
                    muteBtn.style.background = 'var(--gradient-primary)';
                } else {
                    video.muted = true;
                    muteIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
                    muteBtn.style.background = 'rgba(0, 0, 0, 0.5)';
                }
            });
        }
    });
 });
