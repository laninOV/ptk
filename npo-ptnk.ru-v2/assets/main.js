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
  if (toggle && nav) {
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
  }

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    if (!(carousel instanceof HTMLElement)) return;

    const track = carousel.querySelector('[data-carousel-track]');
    if (!(track instanceof HTMLElement)) return;

    const slides = Array.from(track.children).filter((el) => el instanceof HTMLElement);
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const counter = carousel.querySelector('[data-carousel-count]');

    let index = 0;
    const clampIndex = (nextIndex) => Math.max(0, Math.min(slides.length - 1, nextIndex));

    const updateCounter = () => {
      if (!(counter instanceof HTMLElement)) return;
      counter.textContent = slides.length ? `${index + 1} / ${slides.length}` : '';
    };

    const scrollToIndex = (nextIndex) => {
      index = clampIndex(nextIndex);
      updateCounter();
      const slide = slides[index];
      if (!slide) return;
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    };

    updateCounter();

    if (prevButton instanceof HTMLElement) {
      prevButton.addEventListener('click', () => scrollToIndex(index - 1));
    }
    if (nextButton instanceof HTMLElement) {
      nextButton.addEventListener('click', () => scrollToIndex(index + 1));
    }

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const width = track.clientWidth || 1;
        const nextIndex = clampIndex(Math.round(track.scrollLeft / width));
        if (nextIndex === index) return;
        index = nextIndex;
        updateCounter();
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });

    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToIndex(index - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToIndex(index + 1);
      }
    });
  });
});
