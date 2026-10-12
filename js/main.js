// Shared navigation: native fragment history with a stable fixed-header offset.
const nav = document.querySelector('nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const navItems = [...document.querySelectorAll('nav .nav-links a[href^="#"]')]
    .map(link => ({ link, target: document.getElementById(link.hash.slice(1)) }))
    .filter(item => item.target);
let navigationFrame;
function updateNavigation() {
    navigationFrame = undefined;
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
    const line = nav.getBoundingClientRect().bottom + 48;
    let current;
    navItems.forEach(item => {
        if (item.target.getBoundingClientRect().top <= line) current = item;
    });
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        current = navItems[navItems.length - 1];
    }
    navItems.forEach(item => {
        if (item === current) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
    });
}
function scheduleNavigation() {
    if (!navigationFrame) navigationFrame = requestAnimationFrame(updateNavigation);
}
window.addEventListener('scroll', scheduleNavigation, { passive: true });
window.addEventListener('resize', scheduleNavigation);
window.addEventListener('pageshow', scheduleNavigation);
window.addEventListener('load', scheduleNavigation);
updateNavigation();

// Animate content only: section surfaces remain opaque and stationary.
// A zero threshold also works for sections taller than the viewport.
const revealTargets = [...document.querySelectorAll(
    'body > section:not(.hero) > .container, .project-page main > section'
)];
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('reveal-pending');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px 180px 0px' });
    revealTargets.forEach(target => {
        // Deep links and restored scroll positions must be readable immediately.
        if (target.getBoundingClientRect().top <= window.innerHeight + 180) return;
        target.classList.add('reveal-content', 'reveal-pending');
        revealObserver.observe(target);
    });
    document.addEventListener('focusin', event => {
        const target = event.target.closest('.reveal-pending');
        if (target) {
            target.classList.remove('reveal-pending');
            revealObserver.unobserve(target);
        }
    });
    reducedMotion.addEventListener('change', event => {
        if (!event.matches) return;
        revealTargets.forEach(target => target.classList.remove('reveal-pending'));
        revealObserver.disconnect();
    });
}

// 鼠标光晕
const cursorGlow = document.querySelector('.cursor-glow');
const supportsCursorGlow = window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cursorGlow && supportsCursorGlow) {
    let pointerX = -100;
    let pointerY = -100;
    let frameId;

    window.addEventListener('pointermove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        cursorGlow.classList.add('is-visible');

        if (!frameId) {
            frameId = window.requestAnimationFrame(() => {
                cursorGlow.style.setProperty('--cursor-x', `${pointerX}px`);
                cursorGlow.style.setProperty('--cursor-y', `${pointerY}px`);
                frameId = undefined;
            });
        }
    });

    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-visible'));
}
