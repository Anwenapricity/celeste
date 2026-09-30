const photoLinks = [...document.querySelectorAll('.photo-link')];
const photoViewer = document.getElementById('photo-viewer');

if (photoViewer && typeof photoViewer.showModal === 'function') {
    const image = photoViewer.querySelector('.photo-viewer-image');
    const title = photoViewer.querySelector('#photo-viewer-title');
    const caption = photoViewer.querySelector('.photo-viewer-caption');
    const count = photoViewer.querySelector('.photo-viewer-count');
    const status = photoViewer.querySelector('.photo-viewer-status');
    let currentIndex = 0;
    let opener;

    function showPhoto(index) {
        currentIndex = (index + photoLinks.length) % photoLinks.length;
        const link = photoLinks[currentIndex];
        const source = link.querySelector('img');
        title.textContent = link.dataset.title;
        caption.textContent = link.dataset.caption;
        count.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(photoLinks.length).padStart(2, '0')}`;
        image.hidden = true;
        status.hidden = false;
        status.textContent = '载入影像…';
        image.alt = source.alt;
        image.src = link.href;
    }

    image.addEventListener('load', () => { image.hidden = false; status.hidden = true; });
    image.addEventListener('error', () => { status.textContent = '图片暂时无法加载，请切换后重试。'; });

    photoLinks.forEach((link, index) => {
        link.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            opener = link;
            showPhoto(index);
            document.documentElement.classList.add('photo-viewing');
            photoViewer.showModal();
        });
    });
    photoViewer.querySelector('.photo-viewer-close').addEventListener('click', () => photoViewer.close());
    photoViewer.querySelector('.photo-prev').addEventListener('click', () => showPhoto(currentIndex - 1));
    photoViewer.querySelector('.photo-next').addEventListener('click', () => showPhoto(currentIndex + 1));
    photoViewer.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            showPhoto(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    photoViewer.addEventListener('close', () => {
        document.documentElement.classList.remove('photo-viewing');
        opener?.focus({ preventScroll: true });
    });
}
