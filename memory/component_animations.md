# Component Animations

All components updated with premium look, animations, and on-scroll effects:

## Hero Section (src/components/Hero.tsx)
- Section: data-animation="fade-in-up"
- Heading: data-animation="fade-in" data-delay="100ms"
- Subtext: data-animation="fade-in" data-delay="200ms"
- Button: hover:-translate-y-[2px] transition-all duration-500
- Image container: hover:scale-105 hover:-translate-y-[4px] transition-all duration-500
- Layout: Proof-before-persuasion (visuals first, then copy)

## Trust Bar (src/components/TrustBar.tsx)
- Section: data-animation="fade-in-up"
- Certification blocks: data-animation="fade-in" with staggered delays (100ms, 200ms, 300ms)
- Creates gradual appearance of trust signals as user scrolls

## Statistics (src/components/Stats.tsx)
- Section: data-animation="fade-in-up" + Intersection Observer for count-up trigger
- Stat boxes: data-animation="fade-in-up" with staggered delays (0ms, 100ms, 200ms, 300ms)
- Number animation: count-up class added when section enters viewport
- Animation: countUp 2s ease-out forwards (defined in tailwind.config.mjs)

## Featured Categories (src/components/FeaturedCategories.tsx)
- Section: data-animation="fade-in-up"
- Category links: data-animation="fade-in-up" with staggered delays (index * 100ms)
- Images: data-animation="zoom-in" with staggered delays (index * 100ms + 50ms)
- Hover effects: hover:-translate-y-2 hover:border-accent hover:shadow-md transition-all duration-300
- Image zoom: group-hover:scale-105 transition-transform duration-500
- Text hover: group-hover:text-accent transition-colors
- CTA arrow: group-hover:translate-x-1 transition-transform

## Process Teaser (src/components/ProcessTeaser.tsx)
- Section: data-animation="fade-in-up"
- Step numbers: data-animation="fade-in-up" with staggered delays (400ms, 700ms, 1000ms, etc.)
- Step labels: data-animation="fade-in" with incremental delays (+100ms per step)
- Step descriptions: data-animation="fade-in" with incremental delays (+100ms per step)
- CTA button: hover:-translate-y-[2px] transition-colors duration-300
- Layout: 5-stage industrial premium timeline with visual progression

## Global Implementation
- Scroll animation script loaded in layout.tsx with defer attribute
- All animations respect reduced motion preferences (could be enhanced with prefers-reduced-media)
- CSS animations used where possible for hardware acceleration
- Staggered delays create cascading visual effects
- Hover effects provide subtle interactive feedback without distraction