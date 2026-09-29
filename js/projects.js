// A visual clarity demonstration; both layers use the same concept image.
document.querySelectorAll('.compare-control').forEach(control => {
    const comparison = control.closest('.comparison');
    const softLayer = comparison.querySelector('.compare-soft');
    const divider = comparison.querySelector('.compare-line');
    let pendingFrame = null;
    const updateComparison = () => {
        pendingFrame = null;
        const split = Number(control.value);
        softLayer.style.clipPath = `inset(0 ${100 - split}% 0 0)`;
        divider.style.transform = `translateX(${split}%)`;
        const rounded = Math.round(split);
        control.setAttribute('aria-valuetext', `柔化示意 ${rounded}%，清晰素材 ${100 - rounded}%`);
    };
    control.addEventListener('input', () => {
        if (pendingFrame === null) pendingFrame = window.requestAnimationFrame(updateComparison);
    });
    updateComparison();
});
