// Portfolio JavaScript for Aditya Malhotra
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all carousels
    initializeCarousels();
    
    // Initialize smooth scrolling for navigation
    initializeSmoothScrolling();
    
    // Initialize navbar scroll effect
    initializeNavbarScroll();
    
    // Initialize image loading
    initializeImageLoading();
});

// Carousel functionality
function initializeCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(carousel => {
        const carouselName = carousel.dataset.carousel;
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const dots = carousel.querySelectorAll('.dot');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Only initialize if there are slides
        if (totalSlides === 0 || !track) {
            console.warn(`No slides found for carousel: ${carouselName}`);
            return;
        }
        
        // Hide navigation elements for single slide
        if (totalSlides <= 1) {
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            if (dots.length > 0) {
                const dotsContainer = carousel.querySelector('.carousel-dots');
                if (dotsContainer) dotsContainer.style.display = 'none';
            }
            return;
        }
        
        // Update carousel position and active states
        function updateCarousel() {
            const translateX = -currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update slide active states
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
            
            // Update dot active states
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Next slide function
        function nextSlide(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        // Previous slide function
        function prevSlide(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        // Go to specific slide
        function goToSlide(slideIndex, e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            currentSlide = slideIndex;
            updateCarousel();
        }
        
        // Event listeners
        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
            nextButton.addEventListener('touchstart', function(e) {
                e.preventDefault();
                nextSlide();
            });
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
            prevButton.addEventListener('touchstart', function(e) {
                e.preventDefault();
                prevSlide();
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => goToSlide(index, e));
            dot.addEventListener('touchstart', function(e) {
                e.preventDefault();
                goToSlide(index);
            });
        });
        
        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        });
        
        // Make carousel focusable for keyboard navigation
        carousel.setAttribute('tabindex', '0');
        
        // Touch/swipe support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        
        function handleTouchStart(e) {
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startTime = Date.now();
            isDragging = true;
            carousel.style.cursor = 'grabbing';
        }
        
        function handleTouchMove(e) {
            if (!isDragging) return;
            
            const touch = e.touches ? e.touches[0] : e;
            currentX = touch.clientX;
            
            // Prevent default scrolling on touch devices
            if (Math.abs(startX - currentX) > 10) {
                e.preventDefault();
            }
        }
        
        function handleTouchEnd(e) {
            if (!isDragging) return;
            
            isDragging = false;
            carousel.style.cursor = 'grab';
            
            const deltaX = startX - currentX;
            const deltaTime = Date.now() - startTime;
            const threshold = 50; // Minimum swipe distance
            const maxTime = 300; // Maximum time for a swipe
            
            if (Math.abs(deltaX) > threshold && deltaTime < maxTime) {
                e.preventDefault();
                if (deltaX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        
        // Add touch event listeners
        carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Mouse events for desktop dragging
        carousel.addEventListener('mousedown', handleTouchStart);
        carousel.addEventListener('mousemove', handleTouchMove);
        carousel.addEventListener('mouseup', handleTouchEnd);
        carousel.addEventListener('mouseleave', handleTouchEnd);
        
        // Prevent default drag behavior on images
        carousel.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
        });
        
        // Auto-play functionality (disabled by default)
        let autoPlayInterval;
        
        function startAutoPlay() {
            if (totalSlides > 1) {
                autoPlayInterval = setInterval(nextSlide, 5000); // 5 seconds
            }
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Pause auto-play on hover and focus
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        carousel.addEventListener('focus', stopAutoPlay);
        carousel.addEventListener('blur', startAutoPlay);
        
        // Initial update
        updateCarousel();
        
        // Optional: Start auto-play (uncomment to enable)
        // startAutoPlay();
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle hero section buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class based on scroll position
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Image loading optimization and error handling
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading class initially
        img.classList.add('loading');
        
        // Handle successful image load
        img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });
        
        // Handle image loading errors
        img.addEventListener('error', function() {
            this.classList.remove('loading');
            this.classList.add('error');
            console.warn(`Failed to load image: ${this.src}`);
            
            // Create a visual placeholder for missing images
            this.style.backgroundColor = 'var(--color-secondary)';
            this.style.border = '2px dashed var(--color-border)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.minHeight = '100px';
            this.alt = this.alt || 'Image not available';
        });
        
        // If image is already loaded (cached)
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.remove('loading');
            img.classList.add('loaded');
        }
    });
}

// Performance optimization: Intersection Observer for lazy loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Utility function to debounce events
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

// Performance optimization: Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        './Headshot.jpeg',
        './Airtel_Thumbnail.jpg',
        './Bain_Thumbnail.jpg',
        './Sunstone_Thumbnail.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.onload = function() {
            console.log(`Preloaded: ${src}`);
        };
        img.onerror = function() {
            console.warn(`Failed to preload: ${src}`);
        };
        img.src = src;
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalImages();
    initializeLazyLoading();
});

// Add animation classes for scroll-triggered animations
function initializeScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate in
        const animateElements = document.querySelectorAll(
            '.experience-item, .achievement-card, .interest-card, .contact-card, .about-card'
        );
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Handle external link clicks
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add analytics tracking or other external link handling here if needed
            console.log(`External link clicked: ${this.href}`);
        });
    });
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to carousel buttons
    const carouselBtns = document.querySelectorAll('.carousel-btn');
    carouselBtns.forEach(btn => {
        if (btn.classList.contains('carousel-prev')) {
            btn.setAttribute('aria-label', 'Previous image');
        } else if (btn.classList.contains('carousel-next')) {
            btn.setAttribute('aria-label', 'Next image');
        }
    });
    
    // Add ARIA labels to dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    });
});