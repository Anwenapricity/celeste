// Decorative focus guide; native pointers and all click targets remain intact.
(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cursor = document.createElement('div');
    cursor.className = 'focus-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="focus-cursor-ring"></span><span class="focus-cursor-frame"><i></i><i></i><i></i><i></i></span><span class="focus-cursor-plus"></span>';
    document.body.append(cursor);

    let x = 0, y = 0, targetX = 0, targetY = 0;
    let frame = 0, idleTimer = 0, lastTime = 0;
    let visible = false;
    const enabled = () => finePointer.matches && !reducedMotion.matches;

    function hide() {
        cursor.classList.remove('is-visible');
        visible = false;
        clearTimeout(idleTimer);
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
    }

    function draw(time) {
        const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
        lastTime = time;
        const ease = 1 - Math.exp(-elapsed / 45);
        x += (targetX - x) * ease;
        y += (targetY - y) * ease;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = 0;
        if (Math.abs(targetX - x) + Math.abs(targetY - y) > .15) {
            frame = requestAnimationFrame(draw);
        } else {
            lastTime = 0;
        }
    }

    window.addEventListener('pointermove', event => {
        const target = event.target;
        if (!enabled() || event.pointerType === 'touch' || event.buttons ||
            !(target instanceof Element) ||
            target.closest('input, textarea, select, [contenteditable="true"], .comparison, dialog[open]') ||
            document.querySelector('dialog[open]')) {
            hide();
            return;
        }
        const mode = target.closest('.photo-link') ? 'photo' :
            target.closest('a, button, summary, label, [role="button"]') ? 'action' : 'default';
        cursor.dataset.mode = mode;
        targetX = event.clientX;
        targetY = event.clientY;
        if (!visible) {
            x = targetX;
            y = targetY;
            cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
        visible = true;
        cursor.classList.add('is-visible');
        if (!frame) frame = requestAnimationFrame(draw);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(hide, 1100);
    }, { passive: true });

    // Never leave a floating marker behind during scrolling, dragging or dialogs.
    window.addEventListener('pointerdown', hide, { passive: true });
    window.addEventListener('scroll', hide, { passive: true, capture: true });
    window.addEventListener('blur', hide);
    document.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', hide);
    document.addEventListener('keydown', hide);
    finePointer.addEventListener('change', hide);
    reducedMotion.addEventListener('change', hide);
})();
