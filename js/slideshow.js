// Slideshow functionality - Mobile Optimized
let slideIndex = 0;
let slideInterval;
let touchStartX = 0;
let touchEndX = 0;

// Initialize slideshow
function initSlideshow() {
    showSlide(slideIndex);
    startAutoSlide();
    
    // Add event listeners to dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideNum = parseInt(this.getAttribute('data-slide'));
            showSlide(slideNum);
            resetAutoSlide();
        });
    });
    
    // Add touch events for mobile swipe
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.addEventListener('touchstart', handleTouchStart, {passive: true});
    slideshowContainer.addEventListener('touchend', handleTouchEnd, {passive: true});
}

// Touch handlers for swipe navigation
function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance
    
    if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left - next slide
        changeSlide(1);
    } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right - previous slide
        changeSlide(-1);
    }
}

// Show specific slide
function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Reset if at end
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    
    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = "none";
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide and activate dot
    if (slides[slideIndex]) {
        slides[slideIndex].style.display = "block";
        dots[slideIndex].classList.add('active');
    }
}

// Change slide by n positions
function changeSlide(n) {
    slideIndex += n;
    showSlide(slideIndex);
    resetAutoSlide();
}

// Auto slide every 5 seconds
function startAutoSlide() {
    // Clear existing interval
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 5000);
}

// Reset auto slide timer
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', initSlideshow);

// Pause slideshow on hover (for non-touch devices)
if (window.matchMedia("(hover: hover)").matches) {
    document.querySelector('.slideshow-container').addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    document.querySelector('.slideshow-container').addEventListener('mouseleave', () => {
        startAutoSlide();
    });
}