// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation Functions
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Smooth scroll navigation
    navLinksItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetPage = document.querySelector(targetId);
            
            if (targetPage) {
                targetPage.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinksItems.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Intersection Observer for page animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const pageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Update nav active state based on visible page
                const pageId = entry.target.getAttribute('id');
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${pageId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    pages.forEach(page => {
        pageObserver.observe(page);
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Show thank you page
            showThankYou();
            
            // Reset form
            this.reset();
        });
    }
    
    // Brief Form - WhatsApp Integration
    const briefForm = document.getElementById('briefForm');
    
    if (briefForm) {
        briefForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const fullName = formData.get('fullName') || 'Not provided';
            const whatsappNumber = formData.get('whatsappNumber') || 'Not provided';
            const projectType = formData.get('projectType') || 'Not specified';
            const projectDescription = formData.get('projectDescription') || 'Not provided';
            const budget = formData.get('budget') || 'Not specified';
            const deadline = formData.get('deadline') || 'Not specified';
            
            // Format the message
            const message = `Hello 👋  
New Design Request 🚀

👤 Name:
${fullName}

🎨 Project Type:
${projectType}

📝 Project Details:
${projectDescription}

💰 Budget:
${budget}

⏰ Deadline:
${deadline}

📱 Client WhatsApp:
${whatsappNumber}

Thanks 🙏`;
            
            // WhatsApp number
            const phoneNumber = '201146721888';
            
            // Create WhatsApp URL with encoded message
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Show thank you page after a short delay
            setTimeout(() => {
                showThankYou();
            }, 1000);
            
            // Reset form
            this.reset();
        });
    }
    
    // Show Thank You Page
    function showThankYou() {
        const thankYouPage = document.getElementById('thank-you');
        if (thankYouPage) {
            thankYouPage.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    
    // Portfolio hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.portfolio-overlay').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.portfolio-overlay').style.opacity = '0';
        });
    });

    // Gallery modal: open project gallery when clicking a card
    const galleryModal = document.getElementById('gallery-modal');
    const galleryImage = galleryModal ? galleryModal.querySelector('.gallery-image') : null;
    const galleryCaption = galleryModal ? galleryModal.querySelector('.gallery-caption') : null;
    const galleryPrev = galleryModal ? galleryModal.querySelector('.gallery-nav.prev') : null;
    const galleryNext = galleryModal ? galleryModal.querySelector('.gallery-nav.next') : null;
    const galleryClose = galleryModal ? galleryModal.querySelector('.gallery-close') : null;
    const galleryBackdrop = galleryModal ? galleryModal.querySelector('.gallery-backdrop') : null;

    let currentGallery = [];
    let currentIndex = 0;

    function openGallery(images, title, startIndex = 0) {
        if (!galleryModal || !galleryImage) return;
        currentGallery = images;
        currentIndex = startIndex;
        showGalleryImage(currentIndex);
        galleryCaption.textContent = `${title} — ${currentIndex + 1}/${currentGallery.length}`;
        galleryModal.classList.add('open');
        galleryModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        if (!galleryModal) return;
        galleryModal.classList.remove('open');
        galleryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showGalleryImage(index) {
        if (!galleryImage) return;
        const url = currentGallery[index];
        galleryImage.src = url;
        galleryImage.alt = '';
        if (galleryCaption) galleryCaption.textContent = `${galleryModal.dataset.title || ''} — ${index + 1}/${currentGallery.length}`;
    }

    if (portfolioItems.length && galleryModal) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                const raw = this.dataset.gallery || '';
                const title = this.dataset.title || this.querySelector('.portfolio-title')?.textContent || '';
                const imgs = raw.split('|').map(s => s.trim()).filter(Boolean);
                if (imgs.length) {
                    galleryModal.dataset.title = title;
                    openGallery(imgs, title, 0);
                }
            });
        });

        if (galleryPrev) galleryPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            showGalleryImage(currentIndex);
            if (galleryCaption) galleryCaption.textContent = `${galleryModal.dataset.title || ''} — ${currentIndex + 1}/${currentGallery.length}`;
        });

        if (galleryNext) galleryNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            showGalleryImage(currentIndex);
            if (galleryCaption) galleryCaption.textContent = `${galleryModal.dataset.title || ''} — ${currentIndex + 1}/${currentGallery.length}`;
        });

        if (galleryClose) galleryClose.addEventListener('click', closeGallery);
        if (galleryBackdrop) galleryBackdrop.addEventListener('click', closeGallery);

        // keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!galleryModal.classList.contains('open')) return;
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
                showGalleryImage(currentIndex);
            }
            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % currentGallery.length;
                showGalleryImage(currentIndex);
            }
        });
    }
    
    // Skill level animation
    const skillItems = document.querySelectorAll('.software-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const dots = this.querySelectorAll('.skill-level .dot');
            dots.forEach(dot => {
                dot.style.transform = 'scale(1.2)';
            });
        });
        
        item.addEventListener('mouseleave', function() {
            const dots = this.querySelectorAll('.skill-level .dot');
            dots.forEach(dot => {
                dot.style.transform = 'scale(1)';
            });
        });
    });
    
    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, {
        threshold: 0.2
    });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        timelineObserver.observe(item);
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroSection && heroTitle) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroTitle.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }
    
    // Animated capsules movement
    const capsule1 = document.querySelector('.capsule-1');
    const capsule2 = document.querySelector('.capsule-2');
    
    if (capsule1 && capsule2) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            capsule1.style.transform = `translate(${mouseX * 50}px, ${mouseY * 50}px)`;
            capsule2.style.transform = `translate(${-mouseX * 30}px, ${-mouseY * 30}px)`;
        });
    }
    
    // Add smooth reveal animation to sections
    const sections = document.querySelectorAll('.section-header, .about-content, .skills-content, .portfolio-grid, .contact-content');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Back to home functionality
    const backHomeLink = document.querySelector('.back-home');
    
    if (backHomeLink) {
        backHomeLink.addEventListener('click', function(e) {
            e.preventDefault();
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Form input focus effects
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Portfolio grid hover effect - cursor following
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (portfolioGrid) {
        portfolioGrid.addEventListener('mousemove', (e) => {
            const rect = portfolioGrid.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            portfolioItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemX = itemRect.left - rect.left;
                const itemY = itemRect.top - rect.top;
                
                const distance = Math.sqrt(
                    Math.pow(x - (itemX + itemRect.width / 2), 2) +
                    Math.pow(y - (itemY + itemRect.height / 2), 2)
                );
                
                if (distance < 200) {
                    item.style.transform = `translateY(-10px) scale(1.02)`;
                } else {
                    item.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
        
        portfolioGrid.addEventListener('mouseleave', () => {
            portfolioItems.forEach(item => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
    
    // Initialize - make first page active
    const homePage = document.getElementById('home');
    if (homePage) {
        homePage.classList.add('active');
    }
    
    console.log('Portfolio website initialized successfully! 🎨');
});

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add smooth page transitions
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});