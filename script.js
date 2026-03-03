(() => {
  const revealItems = document.querySelectorAll('.reveal');

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -24px 0px'
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 0.04, 0.26)}s`;
      revealObserver.observe(item);
    });
  }

  const roadmap = [
    {
      month: 'Февраль 2026',
      title: 'Бета-старт платформы',
      text: 'Запуск базовой версии Орбиты: профиль, лента, чаты и первые закрытые сообщества.'
    },
    {
      month: 'Март 2026',
      title: 'Публичная регистрация',
      text: 'Открыли регистрацию по приглашениям, усилили проверку аккаунтов и настройку приватности.'
    },
    {
      month: 'Апрель 2026',
      title: 'Обновление ленты',
      text: 'В ленте появились реакции, улучшенные комментарии и более точные рекомендации контента.'
    },
    {
      month: 'Май 2026',
      title: 'Альбомы и медиа',
      text: 'Добавили удобное управление фотоальбомами, обложками профиля и публикацией медиа.'
    },
    {
      month: 'Июнь 2026',
      title: 'Голосовые сообщения',
      text: 'В чатах появились стабильные голосовые, вложения и быстрые действия в один тап.'
    },
    {
      month: 'Июль 2026',
      title: 'Сообщества 2.0',
      text: 'У сообществ появились расширенные роли, модерация и базовая аналитика по активности.'
    },
    {
      month: 'Август 2026',
      title: 'Орбита Радар',
      text: 'Запущен раздел знакомств с карточками, матчами и переходом в личные сообщения.'
    },
    {
      month: 'Сентябрь 2026',
      title: 'Безопасность аккаунта',
      text: 'Укрепили защиту входа, уведомления о сессиях и контроль доступа к данным профиля.'
    },
    {
      month: 'Октябрь 2026',
      title: 'Веб-версия',
      text: 'Запустили полноценную веб-версию Орбиты для работы с контентом и общением с компьютера.'
    },
    {
      month: 'Ноябрь 2026',
      title: 'Метрики и рост',
      text: 'Добавили отчеты по охвату, вовлечению и динамике публикаций для авторов и сообществ.'
    },
    {
      month: 'Декабрь 2026',
      title: 'Экосистема сервисов',
      text: 'Объединили ключевые сценарии внутри платформы и подготовили основу для релизов 2027 года.'
    }
  ];

  const roadmapTrack = document.querySelector('#roadmapTrack');
  if (roadmapTrack) {
    const roadmapDate = document.querySelector('#roadmapDate');
    const roadmapTitle = document.querySelector('#roadmapTitle');
    const roadmapText = document.querySelector('#roadmapText');
    const roadmapThumb = document.querySelector('#roadmapThumb');
    const roadmapPoints = Array.from(document.querySelectorAll('.roadmap-point'));

    const maxIndex = roadmap.length - 1;
    let activeIndex = 0;
    let isDragging = false;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const syncRoadmap = (index) => {
      activeIndex = clamp(index, 0, maxIndex);
      const progress = (activeIndex / maxIndex) * 100;

      if (roadmapThumb) roadmapThumb.style.left = `${progress}%`;
      if (roadmapDate) roadmapDate.textContent = roadmap[activeIndex].month;
      if (roadmapTitle) roadmapTitle.textContent = roadmap[activeIndex].title;
      if (roadmapText) roadmapText.textContent = roadmap[activeIndex].text;

      roadmapTrack.setAttribute('aria-valuenow', String(activeIndex));
      roadmapPoints.forEach((point, idx) => {
        point.classList.toggle('active', idx === activeIndex);
      });
    };

    const indexFromPointer = (clientX) => {
      const rect = roadmapTrack.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return Math.round(ratio * maxIndex);
    };

    roadmapPoints.forEach((point) => {
      point.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
      });

      point.addEventListener('click', () => {
        const pointIndex = Number(point.dataset.index || 0);
        syncRoadmap(pointIndex);
      });
    });

    roadmapTrack.addEventListener('pointerdown', (event) => {
      isDragging = true;
      roadmapTrack.classList.add('dragging');
      syncRoadmap(indexFromPointer(event.clientX));
      roadmapTrack.setPointerCapture(event.pointerId);
    });

    roadmapTrack.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      syncRoadmap(indexFromPointer(event.clientX));
    });

    const stopDragging = () => {
      isDragging = false;
      roadmapTrack.classList.remove('dragging');
    };

    roadmapTrack.addEventListener('pointerup', stopDragging);
    roadmapTrack.addEventListener('pointercancel', stopDragging);

    roadmapTrack.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        syncRoadmap(activeIndex + 1);
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        syncRoadmap(activeIndex - 1);
      }
    });

    syncRoadmap(0);
  }

  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabPanels = document.querySelectorAll('[data-tab]');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tabTarget;
      if (!target) return;

      tabButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.tab === target);
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
    });
  });

  const faqNavButtons = document.querySelectorAll('[data-faq-section]');
  const faqGroups = document.querySelectorAll('[data-faq-group]');

  faqNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.faqSection;
      if (!target) return;

      faqNavButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      faqGroups.forEach((group) => {
        group.classList.toggle('active', group.dataset.faqGroup === target);
      });
    });
  });

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const button = item.querySelector('button');
    if (!button) return;

    button.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
})();
