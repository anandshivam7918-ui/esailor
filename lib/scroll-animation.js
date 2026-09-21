/**
 * Scroll Animation Utility
 * Adds animation classes to elements when they enter the viewport
 */

export class ScrollAnimation {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px',
      triggerOnce: true,
      ...options
    };

    this.observer = null;
    this.animatedElements = new Set();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          threshold: this.options.threshold,
          rootMargin: this.options.rootMargin
        }
      );
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      this.fallbackScrollListener();
    }
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        if (!this.options.triggerOnce || !this.animatedElements.has(element)) {
          this.animateElement(element);
          if (this.options.triggerOnce) {
            this.animatedElements.add(element);
          }
        }
      } else if (!this.options.triggerOnce) {
        // Optionally remove animation when element leaves viewport
        // this.resetElement(element);
      }
    });
  }

  animateElement(element) {
    // Add animation class based on data-animation attribute
    const animation = element.getAttribute('data-animation');
    if (animation) {
      element.classList.add(animation);

      // Add delay if specified
      const delay = element.getAttribute('data-delay');
      if (delay) {
        element.style.animationDelay = delay;
      }

      // Add duration if specified
      const duration = element.getAttribute('data-duration');
      if (duration) {
        element.style.animationDuration = duration;
      }
    }
  }

  resetElement(element) {
    const animation = element.getAttribute('data-animation');
    if (animation) {
      element.classList.remove(animation);
      element.style.animationDelay = '';
      element.style.animationDuration = '';
      this.animatedElements.delete(element);
    }
  }

  observe(element) {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  unobserve(element) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  fallbackScrollListener() {
    // Simple fallback - check elements on scroll and load
    const checkElements = () => {
      const elements = document.querySelectorAll('[data-animation]');
      elements.forEach(element => {
        if (this.isInViewport(element) && !this.animatedElements.has(element)) {
          this.animateElement(element);
          this.animatedElements.add(element);
        }
      });
    };

    window.addEventListener('load', checkElements);
    window.addEventListener('scroll', checkElements);
    window.addEventListener('resize', checkElements);

    // Initial check
    checkElements();
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - this.options.threshold) &&
      rect.bottom >= 0
    );
  }
}

// Initialize scroll animation when the script loads
if (typeof window !== 'undefined') {
  const scrollAnimation = new ScrollAnimation();
  scrollAnimation.init();

  // Make it globally accessible for manual initialization if needed
  window.scrollAnimation = scrollAnimation;
}