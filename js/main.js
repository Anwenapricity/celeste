// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) {
            let targetTop = 0;
            for (let element = target; element; element = element.offsetParent) {
                targetTop += element.offsetTop;
            }
            window.scrollTo({
                top: targetTop - document.querySelector('nav').offsetHeight - 20,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
            });
        }
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
});

// 表单提交处理
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('感谢您的留言！在实际应用中，这里会将表单数据发送到服务器。');
    this.reset();
});

// 滚动显示动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// 为每个部分添加观察
document.querySelectorAll('section:not(.hero)').forEach(section => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

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
