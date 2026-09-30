(() => {
    const room = document.querySelector('.photo-screening');
    if (!room) return;
    const slides = [...room.querySelectorAll('.screening-slide')];
    const thumbs = [...room.querySelectorAll('.screening-thumb')];
    const play = room.querySelector('.screening-play');
    const status = room.querySelector('.screening-status');
    const progress = room.querySelector('.screening-progress span');
    const viewer = document.getElementById('photo-viewer');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let requested = 0;
    let paused = reduced.matches;
    let visible = false;
    let loading = false;
    let ticket = 0;
    let timer;

    function schedule() {
        clearTimeout(timer);
        progress.getAnimations().forEach(animation => animation.cancel());
        play.textContent = paused ? '开始放映 ▷' : '暂停放映 Ⅱ';
        play.setAttribute('aria-label', paused ? '开始自动放映' : '暂停自动放映');
        if (paused || !visible || document.hidden || viewer?.open || loading) return;
        if (!reduced.matches) progress.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 6000, fill: 'forwards' });
        timer = setTimeout(() => select(current + 1), 6000);
    }

    async function select(index) {
        requested = (index + slides.length) % slides.length;
        const next = requested;
        const request = ++ticket;
        loading = true;
        schedule();
        status.textContent = '';
        const img = slides[next].querySelector('img');
        img.loading = 'eager';
        try {
            await img.decode();
        } catch {
            if (request !== ticket) return;
            loading = false;
            paused = true;
            status.textContent = '这张影像暂时无法加载，请选择其他作品。';
            schedule();
            return;
        }
        if (request !== ticket) return;
        // Keep the last decoded frame visible until the next one is ready.
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-current', i === next);
            slide.inert = i !== next;
            slide.setAttribute('aria-hidden', String(i !== next));
            thumbs[i].setAttribute('aria-pressed', String(i === next));
        });
        current = next;
        room.querySelector('.screening-name').textContent = slides[next].dataset.title;
        room.querySelector('.screening-detail').textContent = slides[next].dataset.caption;
        room.querySelector('.screening-count').textContent = `${String(next + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        slides[(next + 1) % slides.length].querySelector('img').loading = 'eager';
        loading = false;
        schedule();
    }

    thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => select(index)));
    room.querySelector('.screening-prev').addEventListener('click', () => select(requested - 1));
    room.querySelector('.screening-next').addEventListener('click', () => select(requested + 1));
    play.addEventListener('click', () => { paused = !paused; schedule(); });
    room.addEventListener('keydown', event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        paused = true;
        const next = (requested + (event.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length;
        thumbs[next].focus({ preventScroll: true });
        select(next);
    });
    // Keyboard readers keep a stable image until they explicitly restart playback.
    room.addEventListener('focusin', event => {
        if (event.target.matches(':focus-visible') && event.target !== play) {
            paused = true;
            schedule();
        }
    });
    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        schedule();
    }, { threshold: 0.2 }).observe(room.querySelector('.screening-stage'));
    document.addEventListener('visibilitychange', schedule);
    if (viewer) new MutationObserver(schedule).observe(viewer, { attributes: true, attributeFilter: ['open'] });
    reduced.addEventListener('change', () => { paused = reduced.matches; schedule(); });
    schedule();
})();
