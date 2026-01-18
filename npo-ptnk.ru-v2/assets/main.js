function onReady(fn){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn,{once:true});}else{fn();}}

onReady(() => {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const header = document.querySelector('.site-header');
  if (header) {
    let rafId = 0;
    const updateHeaderHeight = () => {
      rafId = 0;
      const height = header.offsetHeight || 0;
      document.documentElement.style.setProperty('--header-h', `${height}px`);
    };
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateHeaderHeight);
    };
    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate, { passive: true });
  }

  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return;

  const close = () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) close();
    else open();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-nav]') || target.closest('[data-nav-toggle]')) return;
    close();
  });

  nav.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest('a')) close();
  });
});
