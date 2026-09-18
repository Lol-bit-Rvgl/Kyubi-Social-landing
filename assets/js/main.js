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

  /* ---------- Configuración de API de Backend ---------- */
  var BACKEND_URL = window.KYUBI_API_URL || 'https://kyubi-social-backend-1.onrender.com';
  var SALAS_API_ENDPOINT = BACKEND_URL + '/api/salas';
  var SALAS_FALLBACK_ENDPOINT = BACKEND_URL + '/salas';

  /* ---------- 4. Salas en vivo: catálogo de respaldo ---------- */
  var ROOMS_FALLBACK = [
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

  var ROOMS = ROOMS_FALLBACK.slice();

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

  function normalizeRoom(r) {
    if (!r || typeof r !== 'object') return null;
    var title = r.title || r.name || 'Sala comunitaria';
    var rawMode = String(r.mode || r.currentMode || 'roleplay').toLowerCase().trim();
    var mode = 'roleplay';
    if (rawMode === 'cine' || rawMode === 'cinema' || rawMode === 'screening') {
      mode = 'cine';
    } else if (rawMode === 'voz' || rawMode === 'voice') {
      mode = 'voz';
    } else if (ROOM_META[rawMode]) {
      mode = rawMode;
    }

    var hostName = 'Anfitrión';
    if (typeof r.host === 'string' && r.host.trim()) {
      hostName = r.host.trim();
    } else if (r.host && typeof r.host === 'object') {
      hostName = r.host.displayName || r.host.username || 'Anfitrión';
    }

    var initials = r.initials;
    if (!initials) {
      initials = hostName
        .split(' ')
        .filter(Boolean)
        .map(function (w) { return w[0]; })
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'KB';
    }

    var participants = typeof r.participants === 'number'
      ? r.participants
      : (typeof r.participantCount === 'number' ? r.participantCount : (Array.isArray(r.participants) ? r.participants.length : 0));
    var max = typeof r.max === 'number'
      ? r.max
      : (typeof r.capacity === 'number' ? r.capacity : 10);
    var tags = Array.isArray(r.tags) ? r.tags : [];
    var description = r.description || (r.circle && r.circle.name ? 'Sala del círculo ' + r.circle.name : 'Sala comunitaria en vivo');

    return {
      id: r.id || ('sala-' + Math.random().toString(36).slice(2)),
      title: title,
      mode: mode,
      description: description,
      host: hostName,
      initials: initials,
      participants: participants,
      max: max,
      tags: tags
    };
  }

  function renderRooms() {
    if (!roomsGrid) return;
    if (!ROOMS || ROOMS.length === 0) {
      roomsGrid.innerHTML =
        '<div class="rooms-empty glass-card">' +
          '<div class="rooms-empty-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>' +
          '</div>' +
          '<h3>No hay salas públicas abiertas en este momento</h3>' +
          '<p>Sé el primero en abrir una sala de rol, cine sincronizado o tertulia de voz desde la app de Kyubi.</p>' +
          '<a class="btn btn-download btn-md" href="#descarga">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>' +
            'Abrir sala desde la App' +
          '</a>' +
        '</div>';
      if (roomsStatus) {
        roomsStatus.textContent = 'No hay salas abiertas en vivo.';
      }
      return;
    }

    var visible = ROOMS.filter(function (room) {
      return activeFilter === 'all' || room.mode === activeFilter;
    });

    if (visible.length === 0) {
      roomsGrid.innerHTML =
        '<div class="rooms-empty glass-card">' +
          '<div class="rooms-empty-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>' +
          '</div>' +
          '<h3>Sin salas en esta categoría</h3>' +
          '<p>No hay salas activas de ' + (ROOM_META[activeFilter] ? ROOM_META[activeFilter].label : activeFilter) + ' en este momento.</p>' +
        '</div>';
      if (roomsStatus) {
        roomsStatus.textContent = '0 salas en esta categoría.';
      }
      return;
    }

    roomsGrid.innerHTML = visible.map(function (room) {
      var meta = ROOM_META[room.mode] || ROOM_META.roleplay;
      var pct = Math.min(100, Math.round((room.participants / (room.max || 1)) * 100));
      return (
        '<article class="room-card glass-card" style="--badge-color:' + meta.color + '">' +
          '<div class="room-card-top">' +
            '<span class="room-badge ' + meta.className + '">' + svgIcon(meta.icon) + meta.label + '</span>' +
            '<span class="room-capacity">' + room.participants + '/' + room.max + '</span>' +
          '</div>' +
          '<h3>' + room.title + '</h3>' +
          '<p>' + room.description + '</p>' +
          '<div class="room-tags">' + (room.tags || []).map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>' +
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

  /* ---------- 9. Salas activas en vivo (Footer Liquid Glass) ---------- */
  var footerRoomsGrid = document.getElementById('footer-active-rooms');

  function renderFooterRooms(roomsList) {
    if (!footerRoomsGrid) return;
    var items = (roomsList || []).slice(0, 4);
    if (!items.length) {
      footerRoomsGrid.innerHTML =
        '<div class="footer-rooms-empty glass-card">' +
          '<div class="footer-empty-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>' +
          '</div>' +
          '<div class="footer-empty-content">' +
            '<p class="footer-empty-text">No hay salas públicas abiertas en este momento. ¡Sé el primero en abrir una desde la app!</p>' +
            '<a class="btn btn-download btn-sm footer-empty-btn" href="#descarga">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>' +
              'Abrir sala desde la App' +
            '</a>' +
          '</div>' +
        '</div>';
      return;
    }

    footerRoomsGrid.innerHTML = items.map(function (room) {
      var modeKey = (room.mode && ROOM_META[room.mode]) ? room.mode : 'roleplay';
      var meta = ROOM_META[modeKey];
      var hostName = room.host || 'Anfitrión';
      var initials = room.initials || hostName.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      var tag = (room.tags && room.tags.length > 0) ? room.tags[0] : meta.label;
      var participants = typeof room.participants === 'number' ? room.participants : 0;
      var max = typeof room.max === 'number' ? room.max : 10;

      return (
        '<a class="footer-room-mini" href="#salas" aria-label="' + room.title + ' — ' + meta.label + '">' +
          '<div class="footer-room-mini-head">' +
            '<span class="footer-room-mini-badge ' + meta.className + '">' +
              svgIcon(meta.icon) +
              meta.label +
            '</span>' +
            '<span class="footer-room-mini-capacity">' + participants + '/' + max + ' miembros</span>' +
          '</div>' +
          '<h5 class="footer-room-mini-title">' + room.title + '</h5>' +
          '<div class="footer-room-mini-meta">' +
            '<span class="footer-room-mini-host"><i>' + initials + '</i>' + hostName + '</span>' +
            '<span class="footer-room-mini-tag">' + tag + '</span>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }

  function fetchLiveRooms() {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 12000) : null;

    function applyData(raw) {
      var rawRooms = Array.isArray(raw)
        ? raw
        : ((raw && (raw.data || raw.salas || raw.rooms)) || []);

      if (rawRooms.length === 0) {
        ROOMS = [];
        renderRooms();
        renderFooterRooms([]);
        return;
      }

      var normalized = rawRooms.map(normalizeRoom).filter(Boolean);
      ROOMS = normalized;
      renderRooms();
      renderFooterRooms(normalized);
    }

    function handleFailure(err) {
      console.warn('[Kyubi LiveRooms] Error de conexión con backend:', err.message || err);
      if (roomsStatus) {
        roomsStatus.innerHTML = '<span class="status-offline-pill">● Modo respaldo (backend desconectado)</span>';
      }
      if (footerRoomsGrid) {
        renderFooterRooms(ROOMS_FALLBACK);
        var warningNotice = document.createElement('div');
        warningNotice.className = 'footer-rooms-warning';
        warningNotice.innerHTML = '<span class="pulse-dot" style="background:#FFB300;box-shadow:0 0 8px #FFB300;"></span> <span>Mostrando salas de respaldo recomendadas</span>';
        footerRoomsGrid.insertBefore(warningNotice, footerRoomsGrid.firstChild);
      }
    }

    fetch(SALAS_API_ENDPOINT, { signal: controller ? controller.signal : undefined })
      .then(function (res) {
        if (!res.ok) {
          if (res.status === 404) {
            return fetch(SALAS_FALLBACK_ENDPOINT, { signal: controller ? controller.signal : undefined })
              .then(function (res2) {
                if (!res2.ok) throw new Error('HTTP error! status: ' + res2.status);
                return res2.json();
              });
          }
          throw new Error('HTTP error! status: ' + res.status);
        }
        return res.json();
      })
      .then(function (json) {
        if (timeoutId) clearTimeout(timeoutId);
        applyData(json);
      })
      .catch(function (err) {
        if (timeoutId) clearTimeout(timeoutId);
        handleFailure(err);
      });
  }

  if (footerRoomsGrid) {
    footerRoomsGrid.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight + 10 : 84;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', hash);
    });
  }

  fetchLiveRooms();

  /* ---------- 10. Año dinámico del footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();