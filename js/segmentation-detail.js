// Category and visibility switches are native checkboxes handled by CSS.
(() => {
    const demo = document.querySelector('.semantic-demo');
    if (!demo) return;
    const slider = demo.querySelector('#semantic-opacity');
    const output = demo.querySelector('#semantic-opacity-value');
    const update = () => {
        const opacity = Number(slider.value);
        demo.style.setProperty('--semantic-opacity', String(opacity / 100));
        output.value = `${opacity}%`;
        slider.setAttribute('aria-valuetext', `${opacity}%`);
    };
    slider.addEventListener('input', update);
    update();
})();
