(() => {
    const cards = [...document.querySelectorAll('.gallery-card')];
    const collection = document.querySelector('.gallery-collection');
    const filters = document.querySelector('.gallery-filters');
    const total = document.querySelector('.gallery-total');
    let visibleCards = cards;
    filters.hidden = false;
    filters.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.filter;
            visibleCards = cards.filter(card => category === 'all' || card.dataset.categories.split(' ').includes(category));
            cards.forEach(card => { card.hidden = !visibleCards.includes(card); });
            filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
            collection.classList.toggle('is-filtered', category !== 'all');
            total.textContent = `${visibleCards.length} 幅影像`;
        });
    });

    const nav = document.querySelector('nav');
    const updateNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 60);
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: .08 });
        cards.forEach(card => observer.observe(card));
    }

    const viewer = document.querySelector('#gallery-viewer');
    if (typeof viewer.showModal !== 'function') return;
    const image = viewer.querySelector('.photo-viewer-image');
    const title = viewer.querySelector('#gallery-viewer-title');
    const caption = viewer.querySelector('.photo-viewer-caption');
    const count = viewer.querySelector('.photo-viewer-count');
    const status = viewer.querySelector('.photo-viewer-status');
    const toggle = viewer.querySelector('.gallery-ui-toggle');
    let index = 0;
    let opener;
    let queue = [];
    let ticket = 0;
    const quiet = enabled => {
        viewer.classList.toggle('is-quiet', enabled);
        toggle.setAttribute('aria-pressed', String(enabled));
        toggle.setAttribute('aria-label', enabled ? '显示看图信息' : '隐藏看图信息');
        toggle.textContent = enabled ? '显示信息 H' : '隐藏信息 H';
    };
    function showPhoto(nextIndex) {
        index = (nextIndex + queue.length) % queue.length;
        const link = queue[index];
        const request = ++ticket;
        title.textContent = link.dataset.title;
        caption.textContent = link.dataset.caption;
        count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(queue.length).padStart(2, '0')}`;
        image.hidden = true;
        status.hidden = false;
        status.textContent = '载入影像…';
        // Each request owns its load callbacks, so rapid navigation cannot show a stale photo.
        const pending = new Image();
        pending.onload = () => {
            if (request !== ticket) return;
            image.src = link.href;
            image.alt = link.querySelector('img').alt;
            image.hidden = false;
            status.hidden = true;
        };
        pending.onerror = () => {
            if (request === ticket) status.textContent = '图片暂时无法加载，请切换后重试。';
        };
        pending.src = link.href;
    }
    cards.forEach(card => {
        const link = card.querySelector('.gallery-photo');
        link.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            opener = link;
            queue = visibleCards.map(item => item.querySelector('.gallery-photo'));
            quiet(false);
            showPhoto(queue.indexOf(link));
            viewer.showModal();
            document.documentElement.classList.add('photo-viewing');
        });
    });
    viewer.querySelector('.photo-prev').addEventListener('click', () => showPhoto(index - 1));
    viewer.querySelector('.photo-next').addEventListener('click', () => showPhoto(index + 1));
    viewer.querySelector('.photo-viewer-close').addEventListener('click', () => viewer.close());
    toggle.addEventListener('click', () => quiet(!viewer.classList.contains('is-quiet')));
    viewer.addEventListener('keydown', event => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            showPhoto(index + (event.key === 'ArrowRight' ? 1 : -1));
        } else if (event.key.toLowerCase() === 'h') {
            event.preventDefault();
            quiet(!viewer.classList.contains('is-quiet'));
        }
    });
    viewer.addEventListener('close', () => {
        ++ticket;
        quiet(false);
        document.documentElement.classList.remove('photo-viewing');
        opener?.focus({ preventScroll: true });
    });
})();
