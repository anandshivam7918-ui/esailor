/**
 * Scroll Animation Utility using Intersection Observer
 * Provides performant scroll-triggered animations
 */

class ScrollAnimation {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px',
      triggerOnce: true,
      ...options
    };

    this.elements = new WeakMap();
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        this.options
      );
    }
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      const element = entry.target;
      const animationData = this.elements.get(element);

      if (!animationData) return;

      if (entry.isIntersecting) {
        this.applyAnimation(element, animationData);

        if (this.options.triggerOnce) {
          this.observer.unobserve(element);
        }
      } else if (!this.options.triggerOnce) {
        this.resetAnimation(element, animationData);
      }
    });
  }

  applyAnimation(element, { animation, delay, duration }) {
    // Apply animation styles
    element.style.animationDelay = delay || '0ms';
    element.style.animationDuration = duration || '500ms';
    element.style.animationFillMode = 'both';
    element.style.animationName = animation;

    // Trigger reflow to ensure animation plays
    void element.offsetWidth;
  }

  resetAnimation(element, { animation }) {
    element.style.animationName = 'none';
    void element.offsetWidth; // Trigger reflow
    element.style.animationName = animation;
  }

  observe(element, { animation, delay, duration } = {}) {
    if (!element || !this.observer) return;

    // Store animation data
    this.elements.set(element, {
      animation: animation || 'fade-in',
      delay: delay || '0ms',
      duration: duration || '500ms'
    });

    // Start observing
    this.observer.observe(element);
  }

  unobserve(element) {
    if (this.observer) {
      this.observer.unobserve(element);
      this.elements.delete(element);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.elements.clear();
    }
  }
}

// Initialize scroll animation on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimation = new ScrollAnimation();

    // Auto-initialize elements with data-animation attributes
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach((element) => {
      window.scrollAnimation.observe(element, {
        animation: element.dataset.animation,
        delay: element.dataset.delay,
        duration: element.dataset.duration
      });
    });
  });
} else {
  window.scrollAnimation = new ScrollAnimation();

  // Auto-initialize elements with data-animation attributes
  const animatedElements = document.querySelectorAll('[data-animation]');
  animatedElements.forEach((element) => {
    window.scrollAnimation.observe(element, {
      animation: element.dataset.animation,
      delay: element.dataset.delay,
      duration: element.dataset.duration
    });
  });
}

// Export for use in modules
if (typeof window !== 'undefined') {
  window.ScrollAnimation = ScrollAnimation;
}