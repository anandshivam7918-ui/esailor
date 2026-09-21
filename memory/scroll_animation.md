# Scroll Animation System

## Custom Intersection Observer Utility
Created src/lib/scroll-animation.js with ScrollAnimation class featuring:

### Features
- Threshold configuration (default 0.1)
- Root margin support
- Trigger once option (default true)
- Automatic initialization on DOM load
- Global window.scrollAnimation instance
- Data attribute support: data-animation, data-delay, data-duration

### Usage
```javascript
// Automatic initialization via data attributes
<div data-animation="fade-in-up" data-delay="200ms">
  Content
</div>

// Programmatic usage
window.scrollAnimation.observe(element, {
  animation: 'fade-in-up',
  delay: '100ms',
  duration: '500ms'
});
```

### Supported Animations (via Tailwind)
- fade-in
- fade-in-up
- fade-in-down
- fade-in-left
- fade-in-right
- slide-up
- slide-down
- slide-left
- slide-right
- zoom-in
- zoom-out
- pulse-slow
- pulse-fast
- count-up

### Performance Benefits
- Uses Intersection Observer API (more efficient than scroll listeners)
- Automatic cleanup when triggerOnce: true
- Minimal layout thrashing
- Hardware accelerated where possible