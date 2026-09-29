// Keep the native scrollbar draggable; fade only its color, never its width.
const scrollRoot = document.documentElement;
let scrollbarIdleTimer;

function showScrollbarBriefly() {
    scrollRoot.classList.add('is-scrolling');
    window.clearTimeout(scrollbarIdleTimer);
    scrollbarIdleTimer = window.setTimeout(() => {
        scrollRoot.classList.remove('is-scrolling');
    }, 1100);
}

window.addEventListener('scroll', showScrollbarBriefly, { passive: true });
window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    scrollRoot.classList.toggle('is-scrollbar-hover', event.clientX >= scrollRoot.clientWidth - 18);
}, { passive: true });
document.addEventListener('mouseleave', () => scrollRoot.classList.remove('is-scrollbar-hover'));
window.addEventListener('blur', () => scrollRoot.classList.remove('is-scrollbar-hover'));
scrollRoot.classList.add('scrollbar-enhanced');
