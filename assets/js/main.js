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

  /* ---------- 2. Controlador de Scroll Cinemático ---------- */
  function smoothScrollToTarget(targetId) {
    if (!targetId || targetId === '#' || targetId === '#!') return;
    var target;
    try {
      target = document.querySelector(targetId);
    } catch (e) {
      target = null;
    }
    if (!target) return;

    closeMenu();

    var navOffset = header ? (header.offsetHeight || 88) : 88;
    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: reduceMotion ? 'auto' : 'smooth'
    });

    if (window.history && window.history.pushState) {
      window.history.pushState(null, null, targetId);
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    // Prevenir conflicto con los botones o enlaces que abren el modal de descarga
    if (link.closest('.btn-download, .download-btn, .download-link, a[href*=".apk"], a[href="#descarga"].btn')) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#' || hash === '#!') return;

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

  /* ---------- 4. Pioneros de la Comunidad Kyubi ---------- */
  var PIONEER_MEMBERS = [
    {
      id: 'usr-nothing',
      username: 'Nothing',
      displayName: '𝗧𝗥𝗨𝗦𝗧 𝗡𝗢𝗧𝗛𝗜𝗡𝗚',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/35bec74e-b3f1-47e3-8b86-d9f8121714af.webp',
      badge: 'Miembro Fundador',
      badgeClass: 'badge-founder',
      level: 'Nv. 1',
      tagline: 'Pionero Fundador · Roleplay & Tertulia',
      status: 'Tester Activo'
    },
    {
      id: 'usr-sylve',
      username: 'Sylve',
      displayName: '☾ 𝐒𝐲𝐥𝐯𝐞 ✧',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/0ad67f23-9710-4241-9b34-1f50cfa53490.webp',
      badge: 'Directora de Rol',
      badgeClass: 'badge-roleplay',
      level: 'Nv. 1',
      tagline: 'Directora de Fichas Vivas & Historias',
      status: 'Tester Activo'
    },
    {
      id: 'usr-lolbit',
      username: 'Lolbit',
      displayName: 'Lolbit',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/9de91396-166c-4d9e-8d9c-2c5c2148e9ad.webp',
      badge: 'Desarrollador',
      badgeClass: 'badge-dev',
      level: 'Nv. 1',
      tagline: 'Desarrollador Principal · Kyubi Core',
      status: 'Pionero'
    },
    {
      id: 'usr-lee',
      username: 'Lee',
      displayName: 'Lee',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/7bf951ed-8b06-4e3e-8f85-7f9bb35b278a.webp',
      badge: 'Pionera',
      badgeClass: 'badge-pioneer',
      level: 'Nv. 1',
      tagline: 'Moderación & Tertulias Nocturnas',
      status: 'Tester Activo'
    },
    {
      id: 'usr-mike',
      username: 'K.Mike',
      displayName: 'Mike',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/7313af33-e574-41c5-9800-eb9d7d0e1e91.webp',
      badge: 'Watch Party',
      badgeClass: 'badge-cine',
      level: 'Nv. 1',
      tagline: 'Anfitrión de Watch Parties y Cine',
      status: 'Tester Activo'
    },
    {
      id: 'usr-polaris',
      username: 'pola',
      displayName: 'Polaris',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/b96912a5-072e-42c3-93cd-fbdfef4676bf.webp',
      badge: 'Tertulia de Voz',
      badgeClass: 'badge-voz',
      level: 'Nv. 1',
      tagline: 'Tertulias de Voz & Espacios Lofi',
      status: 'Pionero'
    },
    {
      id: 'usr-toast',
      username: 'toastwater',
      displayName: '𝐓𝐨𝐚𝐬𝐭',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/cda07b56-e6ab-4b8c-9193-33b7de52b718.webp',
      badge: 'Comunidad',
      badgeClass: 'badge-standard',
      level: 'Nv. 1',
      tagline: 'Explorador Social · País de Estupefacientes',
      status: 'Tester Activo'
    },
    {
      id: 'usr-darth',
      username: 'darth_10',
      displayName: 'N1NF0MANA',
      avatarUrl: 'https://eakbqejycdcrvcgsctwz.supabase.co/storage/v1/object/public/uploads/avatars/97801b81-3ce2-4643-873e-52a2cab69dfd.webp',
      badge: 'Roleplay',
      badgeClass: 'badge-roleplay',
      level: 'Nv. 1',
      tagline: 'Castillo de Darth · Historias Colaborativas',
      status: 'Tester Activo'
    }
  ];

  var communityGrid = document.getElementById('community-grid');
  var statTotalUsers = document.getElementById('stat-total-users');

  function getInitials(str) {
    if (!str) return 'KB';
    try {
      var words = str.trim().split(/\s+/).filter(Boolean);
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

  function renderCommunityGrid(members) {
    if (!communityGrid) return;
    var list = (members && members.length > 0) ? members : PIONEER_MEMBERS;

    var cardsHtml = list.map(function (user) {
      var displayName = user.displayName || user.username || 'Pionero Anónimo';
      var username = user.username || 'explorador';
      var initials = getInitials(displayName);
      var badge = user.badge || (user.role === 'ADMIN' ? 'Admin' : 'Pionero');
      var badgeClass = user.badgeClass || 'badge-pioneer';
      var level = user.level ? (typeof user.level === 'number' ? 'Nv. ' + user.level : user.level) : 'Nv. 1';
      var tagline = user.tagline || (user.bio ? user.bio : 'Pionero de la fase cerrada de Kyubi');
      var status = user.status || 'Tester Activo';

      var avatarHtml = user.avatarUrl
        ? '<img src="' + user.avatarUrl + '" alt="' + displayName + '" width="54" height="54" loading="lazy" onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';"><span class="avatar-monogram" style="display:none;">' + initials + '</span>'
        : '<span class="avatar-monogram">' + initials + '</span>';

      return (
        '<article class="community-card glass-card reveal-on-scroll">' +
          '<div class="community-card-top">' +
            '<div class="avatar-halo-wrap">' +
              '<div class="avatar-halo"></div>' +
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
            '<span class="community-badge-chip">Pionero 2026</span>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    var ctaCardHtml =
      '<article class="community-card community-cta-card glass-card reveal-on-scroll">' +
        '<div class="community-cta-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>' +
        '</div>' +
        '<div class="community-card-info">' +
          '<h3 class="community-display-name">Únete a los Pioneros</h3>' +
          '<p class="community-tagline">Sé de los primeros en reclamar tu identidad cósmica y tu nombre de usuario exclusivo antes del lanzamiento oficial.</p>' +
        '</div>' +
        '<div class="community-card-bottom">' +
          '<a class="btn btn-download btn-sm community-cta-btn" href="#descarga">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>' +
            'Reservar mi Cuenta' +
          '</a>' +
        '</div>' +
      '</article>';

    communityGrid.innerHTML = cardsHtml + ctaCardHtml;
    observeRevealElements(communityGrid);
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

  /* ---------- 9. Pioneros en Footer & Sincronización de Comunidad ---------- */
  var pioneersAvatarStack = document.getElementById('pioneers-avatar-stack');
  var footerPioneersCount = document.getElementById('footer-pioneers-count');

  function renderFooterPioneers(members, totalCount) {
    var list = (members && members.length > 0) ? members : PIONEER_MEMBERS;
    var displayTotal = totalCount || list.length || 24;

    if (footerPioneersCount) {
      footerPioneersCount.textContent = '+' + displayTotal + ' Pioneros';
    }

    if (!pioneersAvatarStack) return;

    var stackSlice = list.slice(0, 6);
    var html = stackSlice.map(function (user, idx) {
      var displayName = user.displayName || user.username || 'Pionero';
      var initials = getInitials(displayName);
      var zIndex = 10 - idx;
      var avatarContent = user.avatarUrl
        ? '<img class="stack-avatar-img" src="' + user.avatarUrl + '" alt="' + displayName + '" width="36" height="36" loading="lazy" onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';"><span class="stack-avatar-fallback" style="display:none;">' + initials + '</span>'
        : '<span class="stack-avatar-fallback">' + initials + '</span>';

      return (
        '<div class="stack-avatar-item" style="z-index:' + zIndex + ';" title="' + displayName + ' (@' + (user.username || 'pionero') + ')">' +
          avatarContent +
        '</div>'
      );
    }).join('');

    if (displayTotal > stackSlice.length) {
      var remaining = displayTotal - stackSlice.length;
      html += '<div class="stack-avatar-item stack-avatar-more" style="z-index:3;"><span>+' + remaining + '</span></div>';
    }

    pioneersAvatarStack.innerHTML = html;
  }

  function fetchCommunityMembers() {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 12000) : null;

    function applyUsers(users, total) {
      var count = total || (users ? users.length : 24);
      if (statTotalUsers) {
        statTotalUsers.textContent = '+' + count;
      }
      renderCommunityGrid(users);
      renderFooterPioneers(users, count);
    }

    function handleFallback() {
      fetch(SALAS_API_ENDPOINT, { signal: controller ? controller.signal : undefined })
        .then(function (res) {
          if (!res.ok) throw new Error('Salas fallback unavailable');
          return res.json();
        })
        .then(function (salasJson) {
          var salas = Array.isArray(salasJson) ? salasJson : ((salasJson && (salasJson.data || salasJson.salas)) || []);
          if (salas.length > 0) {
            var seen = {};
            var salaUsers = [];
            salas.forEach(function (s) {
              var h = s.host;
              if (h && (h.id || h.username)) {
                var uid = h.id || h.username;
                if (!seen[uid]) {
                  seen[uid] = true;
                  salaUsers.push({
                    id: uid,
                    username: h.username || 'explorador',
                    displayName: h.displayName || h.username || 'Pionero',
                    avatarUrl: h.avatarUrl || null,
                    badge: 'Anfitrión Activo',
                    badgeClass: 'badge-roleplay',
                    level: 'Nv. 1',
                    tagline: s.name ? ('Sala: ' + s.name) : 'Anfitrión de Kyubi',
                    status: 'En Vivo'
                  });
                }
              }
            });
            if (salaUsers.length > 0) {
              var combined = salaUsers.concat(PIONEER_MEMBERS.filter(function (p) {
                return !seen[p.username.toLowerCase()];
              }));
              applyUsers(combined, combined.length);
              return;
            }
          }
          applyUsers(PIONEER_MEMBERS, 24);
        })
        .catch(function () {
          applyUsers(PIONEER_MEMBERS, 24);
        });
    }

    fetch(USERS_API_ENDPOINT, { signal: controller ? controller.signal : undefined })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP error! status: ' + res.status);
        return res.json();
      })
      .then(function (json) {
        if (timeoutId) clearTimeout(timeoutId);
        var users = Array.isArray(json) ? json : ((json && (json.data || json.users)) || []);
        var total = (json && typeof json.total === 'number') ? json.total : (users.length || 24);
        if (users.length === 0) {
          applyUsers(PIONEER_MEMBERS, total || 24);
        } else {
          var normalized = users.map(function (u) {
            return {
              id: u.id,
              username: u.username || 'explorador',
              displayName: u.displayName || u.username || 'Pionero',
              avatarUrl: u.avatarUrl || null,
              badge: u.role === 'ADMIN' ? 'Admin' : (u.badge || 'Pionero'),
              badgeClass: u.role === 'ADMIN' ? 'badge-founder' : (u.badgeClass || 'badge-pioneer'),
              level: u.level ? (typeof u.level === 'number' ? 'Nv. ' + u.level : u.level) : 'Nv. 1',
              tagline: u.bio || u.tagline || 'Pionero de la red de Kyubi',
              status: u.status || 'Tester Activo'
            };
          });
          applyUsers(normalized, total);
        }
      })
      .catch(function (err) {
        if (timeoutId) clearTimeout(timeoutId);
        console.warn('[Kyubi Community] Error al conectar con /api/users:', err.message || err);
        handleFallback();
      });
  }

  fetchCommunityMembers();

  /* ---------- 10. Año dinámico del footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();