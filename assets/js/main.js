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

  /* ---------- 2. Scroll suave con offset del navbar ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (link.classList.contains('btn-download') || link.classList.contains('download-btn') || link.classList.contains('download-link')) return;
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      var offset = header ? header.offsetHeight + 10 : 84;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', hash);
    });
  });

  /* ---------- 3. Animaciones de aparición (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. Salas en vivo: catálogo ---------- */
  var ROOMS = [
    {
      id: 'sala-rp-01',
      title: 'Crónicas de Aethelgard: La Tercera Luna',
      mode: 'roleplay',
      description: 'Expedición a las ruinas arcanas del norte. Se buscan exploradores y magos de batalla nivel 3+.',
      host: 'Sylas Vance',
      initials: 'SV',
      participants: 8,
      max: 12,
      tags: ['Fantasía Oscura', 'Dado D20', 'Lore Libre']
    },
    {
      id: 'sala-cine-01',
      title: 'Cyberpunk Edgerunners • Noche de Maratón',
      mode: 'cine',
      description: 'Transmisión sincronizada de los episodios 1 al 6 con audio japonés original y subtítulos en español.',
      host: 'Kira Novis',
      initials: 'KN',
      participants: 24,
      max: 50,
      tags: ['Watch Party', 'Anime', '1080p Sync']
    },
    {
      id: 'sala-voz-01',
      title: 'Tertulia Nocturna & Lofi Beats',
      mode: 'voz',
      description: 'Charla tranquila para dibujar, estudiar, compartir anécdotas o comentar los estrenos de la temporada.',
      host: 'Ren Takahashi',
      initials: 'RT',
      participants: 16,
      max: 30,
      tags: ['Chill', 'Voz Libre', 'Música Lofi']
    },
    {
      id: 'sala-rp-02',
      title: 'Neo-Shinjuku 2099: Sombras de Neón',
      mode: 'roleplay',
      description: 'Misión de infiltración corporativa en Arasaka Tower. Slots de Netrunner y Solo disponibles.',
      host: 'Aoi Kurogane',
      initials: 'AK',
      participants: 6,
      max: 8,
      tags: ['Cyberpunk', 'Acción', 'Slots Abiertos']
    },
    {
      id: 'sala-cine-02',
      title: 'Ghibli Sundays: Susurros del Corazón',
      mode: 'cine',
      description: 'Doble función dominical con pausas para comentar escenas y trivia entre películas.',
      host: 'Maru & Vela',
      initials: 'MV',
      participants: 31,
      max: 40,
      tags: ['Clásicos', 'Doble Función', 'Familiar']
    },
    {
      id: 'sala-voz-02',
      title: 'Mesa de Juegos: Ritual y Dados',
      mode: 'voz',
      description: 'Mesa de voz para partidas de mesa narrativas, tiradas en vivo y improvisación cósmica.',
      host: 'Umbra Void',
      initials: 'UV',
      participants: 9,
      max: 14,
      tags: ['Dados', 'Narrativo', 'Improvisación']
    }
  ];

  var ROOM_META = {
    roleplay: { label: 'Roleplay', className: 'badge-roleplay', color: '#FFB300', icon: 'sword' },
    cine: { label: 'Sala de Cine', className: 'badge-cine', color: '#FF1744', icon: 'film' },
    voz: { label: 'Tertulia de Voz', className: 'badge-voz', color: '#00E5FF', icon: 'mic' }
  };

  var roomsGrid = document.getElementById('rooms-grid');
  var roomsStatus = document.getElementById('rooms-status');
  var filterButtons = document.querySelectorAll('.room-filter-btn');
  var activeFilter = 'all';

  function svgIcon(name) {
    var icons = {
      mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
      film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 10h4M17 10h4M3 15h4M17 15h4"/>',
      sword: '<polyline points="14.5 10.5 20 5 19 2 16 3l-5.5 5.5"/><path d="M13 12 4 21l-1-1 9-9"/><path d="m14 13 1.5 1.5L18 12l-1.5-1.5"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
  }

  function renderRooms() {
    if (!roomsGrid) return;
    var visible = ROOMS.filter(function (room) {
      return activeFilter === 'all' || room.mode === activeFilter;
    });
    roomsGrid.innerHTML = visible.map(function (room) {
      var meta = ROOM_META[room.mode];
      var pct = Math.round((room.participants / room.max) * 100);
      return (
        '<article class="room-card glass-card" style="--badge-color:' + meta.color + '">' +
          '<div class="room-card-top">' +
            '<span class="room-badge ' + meta.className + '">' + svgIcon(meta.icon) + meta.label + '</span>' +
            '<span class="room-capacity">' + room.participants + '/' + room.max + '</span>' +
          '</div>' +
          '<h3>' + room.title + '</h3>' +
          '<p>' + room.description + '</p>' +
          '<div class="room-tags">' + room.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>' +
          '<div class="room-card-bottom">' +
            '<span class="room-host"><i>' + room.initials + '</i>' + room.host + '</span>' +
            '<span class="room-meter" aria-hidden="true"><i style="width:' + pct + '%"></i></span>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    if (roomsStatus) {
      roomsStatus.textContent = visible.length === 1
        ? 'Mostrando 1 sala activa.'
        : 'Mostrando ' + visible.length + ' salas activas.';
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.getAttribute('data-filter') || 'all';
      filterButtons.forEach(function (btn) {
        var active = btn === button;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      renderRooms();
    });
  });

  renderRooms();

  /* ---------- 5. Guía de instalación colapsable ---------- */
  var stepsBtn = document.querySelector('.steps-btn');
  var stepsExtra = document.getElementById('steps-extra');
  if (stepsBtn && stepsExtra) {
    stepsBtn.addEventListener('click', function () {
      var open = stepsExtra.classList.toggle('open');
      stepsBtn.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- 6. Tamaño real del APK (verificación por HEAD) ---------- */
  var apkSizeEl = document.getElementById('apk-size');
  var downloadBtn = document.querySelector('.download-btn');
  var apkUrl = downloadBtn ? downloadBtn.getAttribute('href') : null;
  if (apkSizeEl && apkUrl && 'fetch' in window) {
    fetch(apkUrl, { method: 'HEAD' })
      .then(function (response) {
        if (!response.ok) return;
        var length = parseInt(response.headers.get('Content-Length'), 10);
        if (!length || length < 1000) return;
        var mb = length / (1024 * 1024);
        apkSizeEl.textContent = mb >= 10
          ? Math.round(mb) + ' MB'
          : mb.toFixed(1) + ' MB';
      })
      .catch(function () { /* mantiene el valor estático de respaldo */ });
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

  // Interceptar todos los botones y enlaces de descarga
  var downloadTriggers = document.querySelectorAll(
    '.btn-download, .download-btn, .download-link, a[href*=".apk"], a[href="#descarga"].btn'
  );
  downloadTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      openComingSoonModal(e);
    });
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

  /* ---------- 9. Año dinámico del footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();