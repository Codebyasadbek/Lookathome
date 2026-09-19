/**
 * Скрипты сайта: меню, модальные окна, форма заявки, слайдер портфолио,
 * аккордеоны, этапы работы, фильтр проектов, видео.
 */
(function () {
  'use strict';

  const BP = { sm: 480, md: 768, lg: 960, xl: 1280 };

  const setScrollLock = (locked) => document.body.classList.toggle('is-locked', locked);

  /* ---------- Мобильное меню ---------- */

  function initMenu() {
    const menu = document.getElementById('menu');
    const overlay = document.querySelector('.menu__overlay');
    if (!menu || !overlay) return;

    const setOpen = (open) => {
      menu.classList.toggle('is-open', open);
      overlay.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
    };

    document.querySelectorAll('[data-menu-open]').forEach((el) => el.addEventListener('click', () => setOpen(true)));
    document.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  /* ---------- Модальные окна ---------- */

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('[data-modal].is-open')) setScrollLock(false);
  }

  function openModal(name) {
    const modal = document.getElementById(`modal-${name}`);
    if (!modal) return;

    document.querySelectorAll('[data-modal].is-open').forEach(closeModal);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setScrollLock(true);
  }

  function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
      trigger.addEventListener('click', () => openModal(trigger.dataset.modalOpen));
    });

    document.querySelectorAll('[data-modal]').forEach((modal) => {
      modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('[data-modal-close]')) closeModal(modal);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') document.querySelectorAll('[data-modal].is-open').forEach(closeModal);
    });
  }

  /* ---------- Форма заявки ---------- */

  // Цифры номера без кода страны: «9776650507»
  const getPhoneDigits = (value) => value.replace(/\D/g, '').replace(/^[78]/, '').slice(0, 10);

  function formatPhone(value) {
    if (!value.replace(/\D/g, '')) return '';

    const [, code, part1, part2, part3] = getPhoneDigits(value).match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    let result = '+7';
    if (code) result += ` (${code}`;
    if (part1) result += `) ${part1}`;
    if (part2) result += `-${part2}`;
    if (part3) result += `-${part3}`;
    return result;
  }

  function initRequestForm() {
    const form = document.querySelector('[data-request-form]');
    if (!form) return;

    const { name, phone, agree } = form.elements;
    const setError = (input, hasError) => input.closest('.field, .consent').classList.toggle('is-error', hasError);

    phone.addEventListener('input', () => {
      phone.value = formatPhone(phone.value);
    });

    [name, phone, agree].forEach((input) => {
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => setError(input, false));
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const checks = [
        [name, name.value.trim().length > 0],
        [phone, getPhoneDigits(phone.value).length === 10],
        [agree, agree.checked],
      ];
      checks.forEach(([input, isValid]) => setError(input, !isValid));
      if (checks.some(([, isValid]) => !isValid)) return;

      // Здесь отправка данных на сервер (при интеграции в Bitrix)
      form.reset();
      openModal('thanks');
    });
  }

  /* ---------- Слайдер портфолио ---------- */

  function initPortfolioSlider() {
    const slider = document.querySelector('[data-portfolio-slider]');
    if (!slider || typeof Swiper === 'undefined') return;

    // Какой слайд стоит первым в видимой области (по макету)
    const width = window.innerWidth;
    let initialSlide = 0;
    if (width < BP.sm) initialSlide = 4;
    else if (width < BP.xl) initialSlide = 3;

    new Swiper(slider, {
      slidesPerView: 'auto',
      spaceBetween: 10,
      slidesOffsetBefore: 20,
      slidesOffsetAfter: 20,
      initialSlide,
      grabCursor: true,
      breakpoints: {
        [BP.sm]: { spaceBetween: 30 },
        [BP.md]: { spaceBetween: 30, slidesOffsetBefore: 267 },
        [BP.lg]: { spaceBetween: 30, slidesOffsetBefore: 272 },
        [BP.xl]: { spaceBetween: 30, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
      },
    });
  }

  /* ---------- Аккордеоны (услуги, FAQ, форматы работы) ---------- */

  function setAccordionItem(item, open) {
    if (item.classList.contains('is-open') === open) return;

    // Раскрывающихся частей может быть несколько (например, фото и текст в разных колонках)
    const bodies = [...item.querySelectorAll('[data-accordion-body]')];
    const toggle = item.querySelector('[data-accordion-toggle]');

    // Анимация высоты: 0 <-> scrollHeight, после анимации высота снова auto
    bodies.forEach((body) => {
      body.style.height = open ? '0px' : `${body.scrollHeight}px`;
    });
    void item.offsetHeight; // принудительный reflow
    item.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));

    bodies.forEach((body) => {
      const onEnd = (event) => {
        if (event.target !== body) return;
        body.style.height = '';
        body.removeEventListener('transitionend', onEnd);
      };
      body.addEventListener('transitionend', onEnd);
      body.style.height = open ? `${body.scrollHeight}px` : '0px';
    });
  }

  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach((accordion) => {
      const isMultiple = accordion.hasAttribute('data-accordion-multiple');
      const items = [...accordion.querySelectorAll('[data-accordion-item]')];

      items.forEach((item) => {
        const toggle = item.querySelector('[data-accordion-toggle]');
        toggle.setAttribute('aria-expanded', String(item.classList.contains('is-open')));

        toggle.addEventListener('click', () => {
          const willOpen = !item.classList.contains('is-open');
          if (!isMultiple) items.filter((other) => other !== item).forEach((other) => setAccordionItem(other, false));
          setAccordionItem(item, willOpen);
        });
      });
    });
  }

  /* ---------- Этапы работы: фото следует за курсором (1920) ---------- */

  function initStages() {
    const list = document.querySelector('[data-stages]');
    const float = list && list.querySelector('[data-stages-float]');
    if (!float) return;

    const media = window.matchMedia(`(min-width: ${BP.xl}px) and (hover: hover)`);
    const stages = [...list.querySelectorAll('.stage')];
    const images = stages.map((stage) => {
      const image = document.createElement('img');
      image.src = stage.querySelector('.stage__img img').src;
      image.alt = '';
      float.append(image);
      return image;
    });

    let currentY = 0;
    let targetY = 0;
    let frame = null;

    const render = () => {
      currentY += (targetY - currentY) * 0.15;
      float.style.transform = `translate3d(0, ${currentY}px, 0)`;
      frame = Math.abs(targetY - currentY) > 0.5 ? requestAnimationFrame(render) : null;
    };

    list.addEventListener('mousemove', (event) => {
      if (!media.matches) return;

      targetY = event.clientY - list.getBoundingClientRect().top - float.offsetHeight / 2;
      if (!float.classList.contains('is-visible')) currentY = targetY;
      if (!frame) frame = requestAnimationFrame(render);
    });

    stages.forEach((stage, index) => {
      stage.addEventListener('mouseenter', () => {
        if (!media.matches) return;

        stages.forEach((item, i) => item.classList.toggle('is-active', i === index));
        images.forEach((image, i) => image.classList.toggle('is-active', i === index));
        float.classList.add('is-visible');
      });
    });

    list.addEventListener('mouseleave', () => {
      stages.forEach((stage) => stage.classList.remove('is-active'));
      float.classList.remove('is-visible');
    });
  }

  /* ---------- Фильтр проектов: вкладки, на мобильных — раскрывающийся список ---------- */

  function initFilters() {
    document.querySelectorAll('[data-filter]').forEach((filter) => {
      const toggle = filter.querySelector('[data-filter-toggle]');
      const label = filter.querySelector('[data-filter-label]');
      const buttons = filter.querySelectorAll('[data-filter-value]');
      const items = document.querySelectorAll(filter.dataset.filter);

      const setOpen = (open) => {
        filter.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      };

      toggle.addEventListener('click', () => setOpen(!filter.classList.contains('is-open')));

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const { filterValue } = button.dataset;

          buttons.forEach((item) => item.classList.toggle('is-active', item === button));
          label.textContent = button.textContent;
          items.forEach((item) => {
            item.hidden = filterValue !== 'all' && item.dataset.category !== filterValue;
          });
          setOpen(false);
        });
      });
    });
  }

  /* ---------- Видео: запуск по кнопке ---------- */

  function initVideos() {
    document.querySelectorAll('[data-video]').forEach((box) => {
      const video = box.querySelector('video');
      const play = box.querySelector('[data-video-play]');

      play.addEventListener('click', async () => {
        try {
          await video.play();
          video.controls = true;
          play.hidden = true;
        } catch {
          // Видео не запустилось (нет файла или запрет браузера) — кнопка остаётся
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initModals();
    initRequestForm();
    initPortfolioSlider();
    initAccordions();
    initStages();
    initFilters();
    initVideos();
  });
})();
