/* ==========================================================================
   Kyubi — Official Landing · Interacciones Liquid Glass
   Sin dependencias. Sin emojis. SVG puro.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Navbar: estado scrolled + menú móvil ---------- */
  var header = document.querySelector('.site-nav');
  var navToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    }
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 28);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 2. Controlador de Scroll Cinemático Asistido ---------- */
  function smoothScrollToTarget(targetId) {
    if (!targetId || targetId === '#' || targetId === '#!') return;
    var target;
    try {
      target = document.querySelector(targetId);
      if (!target) {
        if (targetId === '#equipo') target = document.getElementById('equipo') || document.getElementById('comunidad');
        if (targetId === '#comunidad') target = document.getElementById('comunidad') || document.getElementById('equipo');
      }
    } catch (e) {
      target = null;
    }
    if (!target) return;

    closeMenu();

    // Desplazamiento nativo suave asistido (respeta scroll-margin-top: 96px)
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      var navOffset = header ? (header.offsetHeight || 88) : 88;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }

    // Actualizar URL sin provocar recálculo de salto
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', targetId);
    }
  }

  // Interceptar clics en enlaces de navegación interna
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    // Respetar botones y enlaces de descarga que abren el modal de prueba privada
    if (link.closest('.btn-download, .download-btn, .download-link, a[href*=".apk"], a[href="#descarga"].btn')) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#' || hash === '#!') return;

    var target;
    try {
      target = document.querySelector(hash);
    } catch (e) {
      target = null;
    }
    if (!target) return;

    event.preventDefault();
    smoothScrollToTarget(hash);
  });

  /* ---------- 3. Animaciones de entrada fluida (IntersectionObserver) ---------- */
  var revealObserver = null;
  if (!reduceMotion && ('IntersectionObserver' in window)) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  }

  function observeRevealElements(container) {
    var scope = container || document;
    var els = scope.querySelectorAll('.reveal, .reveal-on-scroll');
    els.forEach(function (el) {
      if (reduceMotion || !revealObserver) {
        el.classList.add('visible', 'is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  observeRevealElements(document);

  /* ---------- Configuración de API de Backend ---------- */
  var BACKEND_URL = window.KYUBI_API_URL || 'https://kyubi-social-backend-1.onrender.com';
  var USERS_API_ENDPOINT = BACKEND_URL + '/api/users';
  var SALAS_API_ENDPOINT = BACKEND_URL + '/api/salas';

  /* ---------- 4. Directorio Oficial: Equipo de Kyubi (Core Team & Staff) ---------- */
  var KYUBI_TEAM_MEMBERS = [
    // --- FOUNDERS (2) ---
    {
      id: 'team-lolbit',
      username: 'lolbit',
      displayName: 'Lolbit',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/9de91396-166c-4d9e-8d9c-2c5c2148e9ad.webp',
      role: 'Founder',
      category: 'founders',
      badge: 'Founder',
      badgeClass: 'badge-founder',
      haloClass: 'halo-founder',
      monogramClass: 'monogram-founder',
      level: 'Founder',
      tagline: 'Fundador · Arquitectura, Backend & Desarrollo Core',
      status: 'Staff Activo'
    },
    {
      id: 'team-polaris',
      username: 'polaris',
      displayName: 'Polaris',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/b96912a5-072e-42c3-93cd-fbdfef4676bf.webp',
      role: 'Founder',
      category: 'founders',
      badge: 'Founder',
      badgeClass: 'badge-founder',
      haloClass: 'halo-founder',
      monogramClass: 'monogram-founder',
      level: 'Founder',
      tagline: 'Fundador · Dirección de Producto & Estrategia Comunitaria',
      status: 'Staff Activo'
    },

    // --- MODERACIÓN / STAFF (8) ---
    {
      id: 'team-mangle',
      username: 'mangle',
      displayName: 'Mangle',
      avatarUrl: null,
      role: 'Moderador',
      category: 'mod',
      badge: 'Moderador',
      badgeClass: 'badge-mod',
      haloClass: 'halo-mod',
      monogramClass: 'monogram-mod',
      level: 'Staff',
      tagline: 'Moderador · Seguridad de Salas & Dinámicas Activas',
      status: 'Staff Activo'
    },
    {
      id: 'team-nana',
      username: 'nana',
      displayName: 'Nana',
      avatarUrl: null,
      role: 'Moderadora',
      category: 'mod',
      badge: 'Moderadora',
      badgeClass: 'badge-mod',
      haloClass: 'halo-mod',
      monogramClass: 'monogram-mod',
      level: 'Staff',
      tagline: 'Moderadora · Convivencia, Normas & Soporte a Usuarios',
      status: 'Staff Activo'
    },
    {
      id: 'team-sylvee',
      username: 'sylve',
      displayName: 'Sylvee',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/0ad67f23-9710-4241-9b34-1f50cfa53490.webp',
      role: 'Moderador',
      category: 'mod',
      badge: 'Moderador',
      badgeClass: 'badge-mod',
      haloClass: 'halo-mod',
      monogramClass: 'monogram-mod',
      level: 'Staff',
      tagline: 'Moderador · Supervisión de Fichas Vivas & Salas de Rol',
      status: 'Staff Activo'
    },
    {
      id: 'team-nothing',
      username: 'nothing',
      displayName: 'Nothing',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/35bec74e-b3f1-47e3-8b86-d9f8121714af.webp',
      role: 'Moderador',
      category: 'mod',
      badge: 'Moderador',
      badgeClass: 'badge-mod',
      haloClass: 'halo-mod',
      monogramClass: 'monogram-mod',
      level: 'Staff',
      tagline: 'Moderador · Reglas Globales & Moderación de Canales',
      status: 'Staff Activo'
    },
    {
      id: 'team-andy',
      username: 'andy',
      displayName: 'Andy',
      avatarUrl: null,
      role: 'Moderador',
      category: 'mod',
      badge: 'Moderador',
      badgeClass: 'badge-mod',
      haloClass: 'halo-mod',
      monogramClass: 'monogram-mod',
      level: 'Staff',
      tagline: 'Moderador · Asistencia Técnica & Atención a Miembros',
      status: 'Staff Activo'
    },
    {
      id: 'team-ivan',
      username: 'ivan',
      displayName: 'Ivan',
      avatarUrl: null,
      role: 'Moderador',
      category: 'mod',
      badge: 'Moderador',
      badgeClass: 'badge-mod',
      haloClass: 'halo-mod',
      monogramClass: 'monogram-mod',
      level: 'Staff',
      tagline: 'Moderador · Orden de Comunidad & Actividad en Salas',
      status: 'Staff Activo'
    },
    {
      id: 'team-xiaoi',
      username: 'xiaoi',
      displayName: 'Xiaoi',
      avatarUrl: null,
      role: 'Moderador',
      category: 'mod',
      badge: 'Moderador',
      badgeClass: 'badge-mod',
      haloClass: 'halo-mod',
      monogramClass: 'monogram-mod',
      level: 'Staff',
      tagline: 'Moderador · Integración Comunitaria & Bienvenida',
      status: 'Staff Activo'
    },
    {
      id: 'team-toast',
      username: 'toastwater',
      displayName: 'Toast',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/cda07b56-e6ab-4b8c-9193-33b7de52b718.webp',
      role: 'Moderador',
      category: 'mod',
      badge: 'Moderador',
      badgeClass: 'badge-mod',
      haloClass: 'halo-mod',
      monogramClass: 'monogram-mod',
      level: 'Staff',
      tagline: 'Moderador · Dinámicas de Comunidad & Actividades Especiales',
      status: 'Staff Activo'
    },

    // --- DISEÑO & ARTE (4) ---
    {
      id: 'team-lee',
      username: 'lee',
      displayName: 'Lee',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/7bf951ed-8b06-4e3e-8f85-7f9bb35b278a.webp',
      role: 'Diseño',
      category: 'design',
      badge: 'Diseño',
      badgeClass: 'badge-design',
      haloClass: 'halo-design',
      monogramClass: 'monogram-design',
      level: 'Arte',
      tagline: 'Diseño · Concept Art, Paletas & Experiencia de Usuario',
      status: 'Staff Activo'
    },
    {
      id: 'team-sam',
      username: 'sam',
      displayName: 'Sam',
      avatarUrl: null,
      role: 'Diseño',
      category: 'design',
      badge: 'Diseño',
      badgeClass: 'badge-design',
      haloClass: 'halo-design',
      monogramClass: 'monogram-design',
      level: 'Arte',
      tagline: 'Diseño · Ilustración Anime & Marcos Orbitales',
      status: 'Staff Activo'
    },
    {
      id: 'team-bonxyz',
      username: 'bonxyz',
      displayName: 'bonxyz',
      avatarUrl: null,
      role: 'Diseño',
      category: 'design',
      badge: 'Diseño',
      badgeClass: 'badge-design',
      haloClass: 'halo-design',
      monogramClass: 'monogram-design',
      level: 'Arte',
      tagline: 'Diseño · Identidad Visual, Banners & Gráficos Oficiales',
      status: 'Staff Activo'
    },
    {
      id: 'team-ligroach',
      username: 'ligroach',
      displayName: 'Li Groach',
      avatarUrl: null,
      role: 'Diseño',
      category: 'design',
      badge: 'Diseño',
      badgeClass: 'badge-design',
      haloClass: 'halo-design',
      monogramClass: 'monogram-design',
      level: 'Arte',
      tagline: 'Diseño · Arte Digital, Assets & Estética Cósmica',
      status: 'Staff Activo'
    },

    // --- VOLUNTARIADO / CONTRIBUIDORES (1) ---
    {
      id: 'team-mike',
      username: 'k.mike',
      displayName: 'Mike',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/7313af33-e574-41c5-9800-eb9d7d0e1e91.webp',
      role: 'Voluntario',
      category: 'volunteer',
      badge: 'Voluntario',
      badgeClass: 'badge-volunteer',
      haloClass: 'halo-volunteer',
      monogramClass: 'monogram-volunteer',
      level: 'Apoyo',
      tagline: 'Voluntario · Contribuidor Comunitario & Watch Parties de Cine',
      status: 'Colaborador'
    }
  ];

  var communityGrid = document.getElementById('community-grid');
  var statTotalUsers = document.getElementById('stat-total-users');
  var currentTeamFilter = 'all';

  function getInitials(str) {
    if (!str) return 'KB';
    try {
      var clean = str.replace(/[^\w\s\u00C0-\u017F]/gi, '').trim();
      var words = (clean || str).trim().split(/\s+/).filter(Boolean);
      if (words.length >= 2) {
        var first = Array.from(words[0])[0] || '';
        var second = Array.from(words[1])[0] || '';
        return (first + second).toUpperCase();
      } else if (words.length === 1) {
        var chars = Array.from(words[0]);
        return ((chars[0] || '') + (chars[1] || '')).toUpperCase();
      }
    } catch (e) {
      return str.slice(0, 2).toUpperCase();
    }
    return 'KB';
  }

  function renderTeamGrid(filterCategory) {
    if (!communityGrid) return;
    currentTeamFilter = filterCategory || 'all';

    var filteredList = currentTeamFilter === 'all'
      ? KYUBI_TEAM_MEMBERS
      : KYUBI_TEAM_MEMBERS.filter(function (m) { return m.category === currentTeamFilter; });

    var cardsHtml = filteredList.map(function (user) {
      var displayName = user.displayName || user.username || 'Miembro del Equipo';
      var username = user.username || 'staff';
      var initials = getInitials(displayName);
      var badge = user.badge || user.role || 'Staff';
      var badgeClass = user.badgeClass || 'badge-mod';
      var haloClass = user.haloClass || 'halo-mod';
      var monogramClass = user.monogramClass || 'monogram-mod';
      var level = user.level || 'Staff';
      var tagline = user.tagline || 'Miembro del equipo oficial de Kyubi';
      var status = user.status || 'Staff Activo';

      var avatarHtml = user.avatarUrl
        ? '<img src="' + user.avatarUrl + '" alt="' + displayName + '" width="58" height="58" loading="lazy" onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';"><span class="avatar-monogram ' + monogramClass + '" style="display:none;">' + initials + '</span>'
        : '<span class="avatar-monogram ' + monogramClass + '">' + initials + '</span>';

      return (
        '<article class="community-card glass-card reveal-on-scroll">' +
          '<div class="community-card-top">' +
            '<div class="avatar-halo-wrap">' +
              '<div class="avatar-halo ' + haloClass + '"></div>' +
              '<div class="community-avatar-crystal">' +
                avatarHtml +
              '</div>' +
            '</div>' +
            '<div class="community-card-badges">' +
              '<span class="badge-pill ' + badgeClass + '">' + badge + '</span>' +
              '<span class="badge-level">' + level + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="community-card-info">' +
            '<h3 class="community-display-name">' + displayName + '</h3>' +
            '<span class="community-username">@' + username + '</span>' +
            '<p class="community-tagline">' + tagline + '</p>' +
          '</div>' +
          '<div class="community-card-bottom">' +
            '<span class="community-status">' +
              '<span class="pulse-dot-mini" aria-hidden="true"></span>' +
              status +
            '</span>' +
            '<span class="community-badge-chip">Kyubi Staff</span>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    var ctaCardHtml = '';
    if (currentTeamFilter === 'all' || currentTeamFilter === 'volunteer') {
      ctaCardHtml =
        '<article class="community-card community-cta-card glass-card reveal-on-scroll">' +
          '<div class="community-cta-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>' +
          '</div>' +
          '<div class="community-card-info">' +
            '<h3 class="community-display-name">¿Quieres colaborar?</h3>' +
            '<p class="community-tagline">Buscamos moderadores, artistas, creadores de rol y colaboradores apasionados por la comunidad.</p>' +
          '</div>' +
          '<div class="community-card-bottom">' +
            '<a class="btn btn-primary btn-sm community-cta-btn" href="https://discord.gg/JNT7Payj3F" target="_blank" rel="noopener noreferrer">' +
              'Unirse al Discord' +
            '</a>' +
          '</div>' +
        '</article>';
    }

    communityGrid.innerHTML = cardsHtml + ctaCardHtml;
    observeRevealElements(communityGrid);
  }

  function initTeamFilters() {
    var filterButtons = document.querySelectorAll('.team-filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter') || 'all';
        filterButtons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        renderTeamGrid(filter);
      });
    });
  }

  /* ---------- 5. Guía de instalación colapsable ---------- */
  var stepsBtn = document.querySelector('.steps-btn');
  var stepsExtra = document.getElementById('steps-extra');
  if (stepsBtn && stepsExtra) {
    stepsBtn.addEventListener('click', function () {
      var open = stepsExtra.classList.toggle('open');
      stepsBtn.setAttribute('aria-expanded', String(open));
    });
  }


  /* ---------- 7. Widget interactivo de Discord en vivo ---------- */
  var DISCORD_GUILD_ID = '1517518293211025560';
  var DEFAULT_INVITE = 'https://discord.gg/JNT7Payj3F';
  var WIDGET_URL = 'https://discord.com/api/guilds/' + DISCORD_GUILD_ID + '/widget.json';
  var INVITE_URL = 'https://discord.com/api/v9/invites/JNT7Payj3F?with_counts=true';

  var serverNameEl = document.getElementById('discord-server-name');
  var onlineCountEl = document.getElementById('discord-online-count');
  var membersListEl = document.getElementById('discord-members-list') || document.getElementById('discord-members');
  var iframeWrapper = document.getElementById('discord-iframe-wrapper');

  function showIframeFallback() {
    if (iframeWrapper) iframeWrapper.style.display = 'block';
    if (membersListEl) membersListEl.style.display = 'none';
  }

  function showMembersList() {
    if (iframeWrapper) iframeWrapper.style.display = 'none';
    if (membersListEl) membersListEl.style.display = 'grid';
  }

  function updateInviteLinks(inviteUrl) {
    var url = inviteUrl || DEFAULT_INVITE;
    document.querySelectorAll('.discord-cta-btn, .discord-card-footer a').forEach(function (btn) {
      btn.setAttribute('href', url);
    });
  }

  function renderMembers(members) {
    if (!membersListEl) return;
    if (!members || !members.length) {
      showIframeFallback();
      return;
    }
    showMembersList();

    var statusOrder = { online: 1, idle: 2, dnd: 3 };
    var sorted = members.slice().sort(function (a, b) {
      return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    });

    membersListEl.innerHTML = sorted.map(function (m) {
      var username = (m.username || 'Usuario').trim();
      var initials = username.charAt(0).toUpperCase() || 'K';
      var status = m.status || 'online';
      var statusClass = (status === 'idle' || status === 'dnd') ? status : 'online';
      var statusTitle = status === 'online' ? 'En línea' : (status === 'idle' ? 'Ausente' : 'Ocupado');
      var activityName = (m.game && m.game.name) ? m.game.name : (m.activity && m.activity.name ? m.activity.name : '');

      var avatarHtml = m.avatar_url
        ? '<img src="' + m.avatar_url + '" alt="' + username + '" width="32" height="32" loading="lazy" onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';"><span class="discord-avatar-monogram" style="display:none;">' + initials + '</span>'
        : '<span class="discord-avatar-monogram">' + initials + '</span>';

      return (
        '<div class="discord-member-item">' +
          '<div class="discord-avatar">' +
            avatarHtml +
            '<span class="discord-avatar-status ' + statusClass + '" title="' + statusTitle + '"></span>' +
          '</div>' +
          '<div class="discord-member-info">' +
            '<span class="discord-member-name" title="' + username + '">' + username + '</span>' +
            (activityName ? '<span class="discord-member-activity" title="' + activityName + '">' + activityName + '</span>' : '') +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function initDiscordWidget() {
    if (!onlineCountEl) return;

    fetch(WIDGET_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('Widget status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (serverNameEl) {
          serverNameEl.textContent = data.name || 'Kyubi Community';
        }
        var count = typeof data.presence_count === 'number'
          ? data.presence_count
          : (data.members ? data.members.length : 0);
        onlineCountEl.textContent = count + ' Miembros en línea';

        if (data.instant_invite) {
          updateInviteLinks(data.instant_invite);
        }

        if (data.members && data.members.length > 0) {
          renderMembers(data.members);
        } else {
          showIframeFallback();
        }
      })
      .catch(function () {
        // Fallback resiliente: consultar conteo público del invite
        fetch(INVITE_URL)
          .then(function (res) {
            if (!res.ok) throw new Error('Invite endpoint failed');
            return res.json();
          })
          .then(function (inv) {
            if (serverNameEl && inv.guild && inv.guild.name) {
              serverNameEl.textContent = inv.guild.name;
            }
            var count = inv.approximate_presence_count || 174;
            onlineCountEl.textContent = count + ' Miembros en línea';
            showIframeFallback();
          })
          .catch(function () {
            onlineCountEl.textContent = '+170 Miembros en línea';
            showIframeFallback();
          });
      });
  }

  initDiscordWidget();

  /* ---------- 8. Modal Próximamente en Beta (Coming Soon) ---------- */
  var comingSoonModal = document.getElementById('coming-soon-modal');
  var modalCloseBtn = document.getElementById('modal-close-btn');

  function openComingSoonModal(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!comingSoonModal) return;
    comingSoonModal.classList.add('is-active');
    comingSoonModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeComingSoonModal() {
    if (!comingSoonModal) return;
    comingSoonModal.classList.remove('is-active');
    comingSoonModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // Interceptar todos los botones y enlaces de descarga (delegación reactiva)
  document.body.addEventListener('click', function (e) {
    var trigger = e.target.closest('.btn-download, .download-btn, .download-link, a[href*=".apk"], a[href="#descarga"].btn');
    if (trigger) {
      openComingSoonModal(e);
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeComingSoonModal);
  }

  if (comingSoonModal) {
    comingSoonModal.addEventListener('click', function (e) {
      if (e.target === comingSoonModal) {
        closeComingSoonModal();
      }
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && comingSoonModal && comingSoonModal.classList.contains('is-active')) {
      closeComingSoonModal();
    }
  });

  /* ---------- 9. Equipo de Kyubi en Footer & Inicialización ---------- */
  var pioneersAvatarStack = document.getElementById('pioneers-avatar-stack');
  var footerPioneersCount = document.getElementById('footer-pioneers-count');

  function renderFooterTeam() {
    if (footerPioneersCount) {
      footerPioneersCount.textContent = '15 Miembros del Equipo';
    }

    if (!pioneersAvatarStack) return;

    var stackSlice = KYUBI_TEAM_MEMBERS.slice(0, 6);
    var html = stackSlice.map(function (user, idx) {
      var displayName = user.displayName || user.username || 'Equipo';
      var initials = getInitials(displayName);
      var monogramClass = user.monogramClass || 'monogram-mod';
      var zIndex = 10 - idx;
      var avatarContent = user.avatarUrl
        ? '<img class="stack-avatar-img" src="' + user.avatarUrl + '" alt="' + displayName + '" width="36" height="36" loading="lazy" onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';"><span class="stack-avatar-fallback ' + monogramClass + '" style="display:none;">' + initials + '</span>'
        : '<span class="stack-avatar-fallback ' + monogramClass + '">' + initials + '</span>';

      return (
        '<div class="stack-avatar-item" style="z-index:' + zIndex + ';" title="' + displayName + ' (' + user.role + ')">' +
          avatarContent +
        '</div>'
      );
    }).join('');

    var remaining = KYUBI_TEAM_MEMBERS.length - stackSlice.length;
    if (remaining > 0) {
      html += '<div class="stack-avatar-item stack-avatar-more" style="z-index:3;"><span>+' + remaining + '</span></div>';
    }

    pioneersAvatarStack.innerHTML = html;
  }

  function initTeamDirectory() {
    if (statTotalUsers) {
      statTotalUsers.textContent = '15';
    }
    renderTeamGrid('all');
    initTeamFilters();
    renderFooterTeam();
  }

  initTeamDirectory();

  /* ---------- 10. Año dinámico del footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();