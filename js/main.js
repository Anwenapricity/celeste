// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.padding = '10px 0';
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.padding = '20px 0';
        nav.style.background = 'rgba(10, 10, 10, 0.8)';
    }
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
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
