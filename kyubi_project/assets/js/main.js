// Kyubi Landing Page — Universal Liquid Glass Interactive Controller
// Strict zero-emoji policy, clean SVG iconography, live backend synchronization

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ==========================================================================
  // 1. MOBILE MENU TOGGLE
  // ==========================================================================
  var menuBtn = document.querySelector('nav button[aria-label="Abrir menú"]');
  var mobileMenu = document.querySelector('nav .lg\\:hidden.transition-all');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isOpen));

      if (isOpen) {
        mobileMenu.classList.add('max-h-0', 'opacity-0');
        mobileMenu.classList.remove('max-h-96', 'opacity-100');
      } else {
        mobileMenu.classList.remove('max-h-0', 'opacity-0');
        mobileMenu.classList.add('max-h-96', 'opacity-100');
      }
    });

    mobileMenu.querySelectorAll('a, button').forEach(function (link) {
      link.addEventListener('click', function () {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('max-h-0', 'opacity-0');
        mobileMenu.classList.remove('max-h-96', 'opacity-100');
      });
    });
  }

  // ==========================================================================
  // 2. SMOOTH SCROLL FOR INTERNAL ANCHORS
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = 76;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - navHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // 3. LIVE SALAS API & DYNAMIC ROOM CARDS
  // ==========================================================================
  var liveRoomsGrid = document.getElementById('live-rooms-grid');
  var refreshRoomsBtn = document.getElementById('refresh-rooms-btn');
  var refreshIcon = document.getElementById('refresh-icon');
  var filterButtons = document.querySelectorAll('.room-filter-btn');
  var activeFilter = 'all';

  // Fallback seed rooms mirroring Kyubi Backend schemas
  var defaultRooms = [
    {
      id: 'sala-rp-01',
      title: 'Crónicas de Aethelgard: La Tercera Luna',
      mode: 'roleplay',
      badgeClass: 'badge-roleplay',
      badgeText: 'Roleplay Activo',
      description: 'Expedición a las ruinas arcanas del norte. Se buscan exploradores y magos de batalla nivel 3+.',
      host: { name: 'Sylas Vance', avatar: 'SV', badge: 'GM' },
      participants: 8,
      maxParticipants: 12,
      tags: ['Fantasía Oscura', 'Dado D20', 'Lore Libre'],
      accentColor: '#FFB300'
    },
    {
      id: 'sala-cine-01',
      title: 'Cyberpunk Edgerunners • Noche de Marathon',
      mode: 'screening',
      badgeClass: 'badge-cine',
      badgeText: 'Sala de Cine',
      description: 'Transmisión sincronizada de episodios 1 al 6 con audio japonés original y subtítulos en español.',
      host: { name: 'Kira Novis', avatar: 'KN', badge: 'Host' },
      participants: 24,
      maxParticipants: 50,
      tags: ['Watch Party', 'Anime', '1080p Sync'],
      accentColor: '#FF1744'
    },
    {
      id: 'sala-voz-01',
      title: 'Tertulia Nocturna & Lofi Beats',
      mode: 'voice',
      badgeClass: 'badge-voz',
      badgeText: 'Tertulia de Voz',
      description: 'Charla tranquila para dibujar, estudiar, compartir anécdotas o comentar estrenos de la temporada.',
      host: { name: 'Ren Takahashi', avatar: 'RT', badge: 'Host' },
      participants: 16,
      maxParticipants: 30,
      tags: ['Chill', 'Voz Libre', 'Música Lofi'],
      accentColor: '#00E5FF'
    },
    {
      id: 'sala-rp-02',
      title: 'Neo-Shinjuku 2099: Sombras de Neón',
      mode: 'roleplay',
      badgeClass: 'badge-roleplay',
      badgeText: 'Roleplay Activo',
      description: 'Misión de infiltración corporativa en Arasaka Tower. Slots de Netrunner y Solo disponibles.',
      host: { name: 'Aoi Kurogane', avatar: 'AK', badge: 'GM' },
      participants: 6,
      maxParticipants: 8,
      tags: ['Cyberpunk', 'Acción', 'Slots Abiertos'],
      accentColor: '#FFB300'
    },
    {
      id: 'sala-cine-02',
      title: 'Cine Club Ghibli: El Castillo Ambulante',
      mode: 'screening',
      badgeClass: 'badge-cine',
      badgeText: 'Sala de Cine',
      description: 'Sesión comunitaria de fin de semana con debate cinéfilo abierto al terminar los créditos.',
      host: { name: 'Maya Lin', avatar: 'ML', badge: 'Host' },
      participants: 31,
      maxParticipants: 60,
      tags: ['Studio Ghibli', 'Clásicos', 'Watch Party'],
      accentColor: '#FF1744'
    },
    {
      id: 'sala-voz-02',
      title: 'Taller de Guion & Taller de Fichas de Rol',
      mode: 'voice',
      badgeClass: 'badge-voz',
      badgeText: 'Tertulia de Voz',
      description: 'Espacio colaborativo para balancear estadísticas, escribir trasfondos de personajes y compartir lore.',
      host: { name: 'Eiden Thorne', avatar: 'ET', badge: 'Colab' },
      participants: 9,
      maxParticipants: 20,
      tags: ['Escritura', 'Creación de Fichas', 'Feedback'],
      accentColor: '#00E5FF'
    }
  ];

  var currentRooms = defaultRooms.slice();

  function renderRooms(roomsToDisplay) {
    if (!liveRoomsGrid) return;
    liveRoomsGrid.innerHTML = '';

    var filtered = roomsToDisplay.filter(function (room) {
      if (activeFilter === 'all') return true;
      return room.mode === activeFilter;
    });

    if (filtered.length === 0) {
      liveRoomsGrid.innerHTML = '<div class="col-span-full text-center py-12 liquid-glass rounded-3xl border border-border">' +
        '<p class="text-sm font-semibold text-muted-foreground">No hay salas activas en esta categoría en este instante.</p>' +
        '<p class="text-xs text-muted-foreground/70 mt-1">Sé el primero en iniciar una desde la app.</p>' +
        '</div>';
      return;
    }

    filtered.forEach(function (room) {
      var card = document.createElement('div');
      card.className = 'glass-card rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:border-primary/40';

      // Perimeter glow on hover
      var glowStyle = 'background: radial-gradient(circle at top right, ' + (room.accentColor || '#BA68C8') + '22, transparent 70%);';
      
      var tagsHtml = (room.tags || []).map(function (t) {
        return '<span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-muted-foreground">' + t + '</span>';
      }).join(' ');

      card.innerHTML =
        '<div class="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none" style="' + glowStyle + '"></div>' +
        '<div>' +
          '<div class="flex items-center justify-between gap-2 mb-3">' +
            '<span class="badge-activity ' + room.badgeClass + ' text-[10px]">' +
              '<span class="w-1.5 h-1.5 rounded-full bg-current pulse-ring"></span>' +
              '<span>' + room.badgeText + '</span>' +
            '</span>' +
            '<span class="text-xs font-mono text-muted-foreground flex items-center gap-1.5">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' +
              '<strong class="text-foreground">' + room.participants + '</strong>/' + room.maxParticipants +
            '</span>' +
          '</div>' +
          '<h3 class="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">' +
            room.title +
          '</h3>' +
          '<p class="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">' +
            room.description +
          '</p>' +
          '<div class="flex flex-wrap gap-1.5 mb-5">' +
            tagsHtml +
          '</div>' +
        '</div>' +
        '<div class="pt-4 border-t border-white/5 flex items-center justify-between gap-3 mt-auto">' +
          '<div class="flex items-center gap-2">' +
            '<div class="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">' +
              room.host.avatar +
            '</div>' +
            '<div class="flex flex-col">' +
              '<span class="text-xs font-semibold text-foreground leading-none">' + room.host.name + '</span>' +
              '<span class="text-[9px] text-muted-foreground uppercase font-mono tracking-wider mt-0.5">' + room.host.badge + '</span>' +
            '</div>' +
          '</div>' +
          '<a href="downloads/app-arm64-v8a-release.apk" download class="btn-liquid-download text-[11px] font-bold px-3 py-1.5 rounded-xl text-white flex items-center gap-1.5 shadow-sm">' +
            '<span>Entrar</span>' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
          '</a>' +
        '</div>';

      liveRoomsGrid.appendChild(card);
    });
  }

  function fetchLiveRooms() {
    if (refreshIcon) {
      refreshIcon.style.transition = 'transform 0.6s ease';
      refreshIcon.style.transform = 'rotate(360deg)';
      setTimeout(function () {
        refreshIcon.style.transform = 'rotate(0deg)';
      }, 600);
    }

    // Try fetching from local or production backend API
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 2500);

    var apiUrls = ['/api/salas', 'http://localhost:3000/salas'];
    
    // Quick probe
    fetch(apiUrls[0], { signal: controller.signal })
      .then(function (res) {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('Status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (Array.isArray(data) && data.length > 0) {
          currentRooms = data.map(function (item) {
            var mode = item.mode || 'roleplay';
            var bClass = mode === 'roleplay' ? 'badge-roleplay' : (mode === 'screening' ? 'badge-cine' : 'badge-voz');
            var bText = mode === 'roleplay' ? 'Roleplay Activo' : (mode === 'screening' ? 'Sala de Cine' : 'Tertulia de Voz');
            return {
              id: item.id || 'room-' + Math.random(),
              title: item.title || item.name || 'Sala Activa',
              mode: mode,
              badgeClass: bClass,
              badgeText: bText,
              description: item.description || 'Sala en curso en la red Kyubi.',
              host: {
                name: (item.host && item.host.name) ? item.host.name : 'Kyubi Host',
                avatar: (item.host && item.host.avatar) ? item.host.avatar : 'KH',
                badge: (item.host && item.host.badge) ? item.host.badge : 'Host'
              },
              participants: item.participants || item.activeUsers || Math.floor(Math.random() * 20) + 4,
              maxParticipants: item.maxParticipants || 50,
              tags: item.tags || ['Kyubi', 'En Vivo'],
              accentColor: mode === 'roleplay' ? '#FFB300' : (mode === 'screening' ? '#FF1744' : '#00E5FF')
            };
          });
        }
        renderRooms(currentRooms);
      })
      .catch(function () {
        // Resilient fallback: render curated rich seed rooms
        clearTimeout(timeoutId);
        renderRooms(defaultRooms);
      });
  }

  // Filter Pill buttons
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active', 'text-foreground');
        b.classList.add('text-muted-foreground');
      });
      btn.classList.add('active', 'text-foreground');
      btn.classList.remove('text-muted-foreground');

      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderRooms(currentRooms);
    });
  });

  if (refreshRoomsBtn) {
    refreshRoomsBtn.addEventListener('click', function () {
      fetchLiveRooms();
    });
  }

  // Initial Rooms Render
  fetchLiveRooms();

  // ==========================================================================
  // 4. ANIMATED PLATFORM METRIC COUNTERS
  // ==========================================================================
  var counters = [
    { el: document.getElementById('counter-rooms'), target: 14, suffix: '' },
    { el: document.getElementById('counter-users'), target: 540, suffix: '+' },
    { el: document.getElementById('counter-members'), target: 1100, suffix: '+', prefix: '+' },
    { el: document.getElementById('counter-messages'), target: 12840, suffix: '+' }
  ];

  var countersStarted = false;

  function runCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(function (c) {
      if (!c.el) return;
      var duration = 1800; // ms
      var startTime = null;

      function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        var progress = Math.min((currentTime - startTime) / duration, 1);
        // Ease out quadratic
        var easeProgress = 1 - (1 - progress) * (1 - progress);
        var currentVal = Math.floor(easeProgress * c.target);

        var formatted = currentVal.toLocaleString('es-ES');
        if (c.prefix && !formatted.startsWith(c.prefix)) {
          formatted = c.prefix + formatted;
        }
        if (c.suffix && !formatted.endsWith(c.suffix)) {
          formatted = formatted + c.suffix;
        }

        c.el.textContent = formatted;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger metrics animation when section scrolls into view
  var liveSalasSection = document.getElementById('live-salas');
  if (liveSalasSection && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterObserver.observe(liveSalasSection);
  } else {
    runCounters();
  }

  // ==========================================================================
  // 5. INTERACTIVE SMARTPHONE SIMULATOR (Dark / Light Switch & Likes)
  // ==========================================================================
  var simScreen = document.getElementById('sim-screen');
  var simBtnDark = document.getElementById('sim-btn-dark');
  var simBtnLight = document.getElementById('sim-btn-light');

  if (simBtnDark && simBtnLight && simScreen) {
    simBtnDark.addEventListener('click', function () {
      simScreen.classList.remove('sim-theme-light');
      simScreen.classList.add('sim-theme-dark');

      simBtnDark.className = 'px-4 py-2 rounded-xl text-xs font-bold text-foreground bg-primary/25 border border-primary/40 flex items-center gap-2 cursor-pointer';
      simBtnLight.className = 'px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer';
    });

    simBtnLight.addEventListener('click', function () {
      simScreen.classList.remove('sim-theme-dark');
      simScreen.classList.add('sim-theme-light');

      simBtnLight.className = 'px-4 py-2 rounded-xl text-xs font-bold text-gray-900 bg-white shadow-md border border-white/60 flex items-center gap-2 cursor-pointer';
      simBtnDark.className = 'px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer';
    });
  }

  // Simulator Like Buttons Interaction
  document.querySelectorAll('.sim-like-btn').forEach(function (btn) {
    var countEl = btn.querySelector('.sim-like-count');
    var svg = btn.querySelector('svg');
    var isLiked = false;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var count = parseInt(countEl.textContent, 10) || 0;
      isLiked = !isLiked;

      if (isLiked) {
        countEl.textContent = String(count + 1);
        btn.classList.add('text-primary');
        if (svg) {
          svg.setAttribute('fill', 'currentColor');
          svg.style.transform = 'scale(1.2)';
          setTimeout(function () { svg.style.transform = 'scale(1)'; }, 180);
        }
      } else {
        countEl.textContent = String(Math.max(0, count - 1));
        btn.classList.remove('text-primary');
        if (svg) {
          svg.setAttribute('fill', 'none');
        }
      }
    });
  });

  // ==========================================================================
  // 6. INTERACTIVE APP SHOWCASE TABS
  // ==========================================================================
  var showcaseData = {
    salas: {
      badge: 'Salas Híbridas 3-en-1',
      heading: 'Una sola sala para hablar, ver cine y rolear sin interrupciones',
      desc: 'El host puede alternar dinámicamente entre modo Chat de Voz, Sala de Cine compartida y Modo Roleplay sin tener que expulsar a nadie ni crear enlaces nuevos. Toda la sala se adapta al instante.',
      img: 'assets/images/showcase/mockup-salas.webp',
      bullets: [
        { title: 'Sincronización de video:', text: 'Mira películas y series con amigos al mismo segundo.' },
        { title: 'Audio de baja latencia:', text: 'Stages de voz diseñados para hablar sin retardos molestos.' },
        { title: 'Modo seguro:', text: 'Pausa de chat, control de micrófonos y registro de sanciones.' }
      ]
    },
    roleplay: {
      badge: 'Sistema de Roleplay Integrado',
      heading: 'Fichas dinámicas, slots narrativos y juego sin fricciones',
      desc: 'Dile adiós a los chats de rol desordenados donde no se sabe quién es quién. Kyubi asigna identidades de personaje con avatars independientes, estadísticas en vivo y etiquetas narrativas automáticas.',
      img: 'assets/images/showcase/mockup-explore.webp',
      bullets: [
        { title: 'Slots de personaje:', text: 'El host define los roles de la trama y los participantes los reclaman con un clic.' },
        { title: 'Biblioteca de personajes:', text: 'Crea tu catálogo personal de héroes y úsalos en cualquier sala disponible.' },
        { title: 'Narrativa limpia:', text: 'Separación clara entre diálogos de personaje (IC) y comentarios fuera de rol (OOC).' }
      ]
    },
    feed: {
      badge: 'Circles & Muro Comunitario',
      heading: 'Publica, descubre y conecta con tus tribus creativas',
      desc: 'Un feed social sin algoritmos abusivos diseñado para compartir arte, escritos, opiniones de anime y anécdotas de rol. Menciona a tus amigos con @ y descubre contenido de creadores afines.',
      img: 'assets/images/showcase/mockup-feed.webp',
      bullets: [
        { title: 'Circles temáticos:', text: 'Canales dedicados a anime, manga, videojuegos, rol de mesa y dibujo.' },
        { title: 'Menciones interactivas:', text: 'Etiqueta amigos y entra directo a su perfil o salas en vivo.' },
        { title: 'Sin algoritmos opacos:', text: 'Visualiza publicaciones cronológicas de la gente y comunidades que sigues.' }
      ]
    },
    messages: {
      badge: 'DMs & Botella al Mar',
      heading: 'Conexiones espontáneas y mensajería ultrarrápida',
      desc: 'Conversaciones privadas de baja latencia mediante WebSockets, solicitudes de chat protegidas contra spam y la legendaria función «Tirar Botella al Mar» para encontrar gente afín.',
      img: 'assets/images/showcase/mockup-messages.webp',
      bullets: [
        { title: 'Tirar Botella al Mar:', text: 'Lanza un mensaje anónimo al océano y conecta con personas por intereses.' },
        { title: 'Notas de voz y stickers:', text: 'Exprésate con multimedia y paquetes de stickers animados temáticos.' },
        { title: 'Bandeja de solicitudes:', text: 'Controla quién puede hablarte directamente y evita mensajes no deseados.' }
      ]
    },
    profile: {
      badge: 'Identidad Liquid Glass',
      heading: 'Tarjetas decoradas, amistad mágica y títulos únicos',
      desc: 'Tu perfil es tu lienzo: personaliza tu Mini-Card decorada con estilo Liquid Glass, colores de nombre degradados, títulos de rol y sube de nivel tu amistad con reliquias coleccionables.',
      img: 'assets/images/showcase/mockup-profile.webp',
      bullets: [
        { title: 'Estética Liquid Glass:', text: 'Marcos de cristal con bordes lavanda y esmeralda de alto impacto visual.' },
        { title: 'Reliquias de afinidad:', text: 'Calderos, espadas y cartas coleccionables para celebrar tus vínculos.' },
        { title: 'Registro de visitas:', text: 'Descubre quién ha visitado tu muro e interactuado con tus creaciones.' }
      ]
    }
  };

  var tabButtons = document.querySelectorAll('.showcase-tab-btn');
  var badgeEl = document.getElementById('showcase-badge');
  var headingEl = document.getElementById('showcase-heading');
  var descEl = document.getElementById('showcase-desc');
  var bulletsEl = document.getElementById('showcase-bullets');
  var imgEl = document.getElementById('showcase-img');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabKey = btn.getAttribute('data-tab');
      var data = showcaseData[tabKey];
      if (!data) return;

      tabButtons.forEach(function (b) {
        b.classList.remove('active', 'border-primary/50');
        b.classList.add('border-border', 'text-muted-foreground');
      });
      btn.classList.add('active', 'border-primary/50');
      btn.classList.remove('border-border', 'text-muted-foreground');

      if (badgeEl) badgeEl.textContent = data.badge;
      if (headingEl) headingEl.textContent = data.heading;
      if (descEl) descEl.innerHTML = data.desc;

      if (bulletsEl) {
        bulletsEl.innerHTML = '';
        data.bullets.forEach(function (item, i) {
          var bgClass = i === 0 ? 'bg-accent/20 text-accent' : (i === 1 ? 'bg-primary/20 text-primary' : 'bg-secondary/30 text-secondary-foreground');
          var bulletDiv = document.createElement('div');
          bulletDiv.className = 'flex items-start gap-3';
          bulletDiv.innerHTML = '<div class="w-5 h-5 rounded-full ' + bgClass + ' flex items-center justify-center text-xs font-bold mt-0.5">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
            '</div>' +
            '<p class="text-sm text-foreground/90"><strong class="text-foreground">' + item.title + '</strong> ' + item.text + '</p>';
          bulletsEl.appendChild(bulletDiv);
        });
      }

      if (imgEl) {
        imgEl.style.opacity = '0';
        imgEl.style.transform = 'scale(0.96)';
        setTimeout(function () {
          imgEl.src = data.img;
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1)';
        }, 180);
      }
    });
  });

  // ==========================================================================
  // 7. INTERACTIVE CHARACTER SHEET PREVIEWER (Zero Emojis)
  // ==========================================================================
  var characters = {
    sylas: {
      name: 'Sylas Vance',
      archetype: 'Mago del Abismo • Nivel 5',
      status: 'En Escena Activa',
      initials: 'SV',
      className: 'Arcanista',
      colorClass: 'text-primary',
      lore: '«Estudioso de las estrellas caídas y las runas olvidadas en la biblioteca de Aethelgard. Lleva consigo un tomo encuadernado en piel de basilisco.»',
      stats: [
        { name: 'Poder Mágico / Arcano', val: '92%', width: '92%' },
        { name: 'Estrategia / Conocimiento', val: '85%', width: '85%' },
        { name: 'Vitalidad / Resistencia', val: '60%', width: '60%' }
      ]
    },
    kira: {
      name: 'Kira Novis',
      archetype: 'Nómada Cibernética • Nivel 7',
      status: 'Infiltrada en Sala',
      initials: 'KN',
      className: 'Cibernética',
      colorClass: 'text-accent',
      lore: '«Mercenaria cibernética experta en hackeo de neuro-enlaces y sigilo táctico. En los callejones de Neo-Shinjuku, nadie sobrevive sin reflejos aumentados.»',
      stats: [
        { name: 'Velocidad & Hackeo', val: '96%', width: '96%' },
        { name: 'Combate Táctico', val: '88%', width: '88%' },
        { name: 'Sigilo & Camuflaje', val: '74%', width: '74%' }
      ]
    },
    ren: {
      name: 'Ren Takahashi',
      archetype: 'Estudiante de Arte • Nivel 3',
      status: 'Café & Lluvia',
      initials: 'RT',
      className: 'Ilustrador',
      colorClass: 'text-secondary-foreground',
      lore: '«Aspirante a mangaka y observador silencioso. Siempre carga una libreta llena de bocetos de la gente que viaja en el tren de las 6:30 PM.»',
      stats: [
        { name: 'Creatividad & Empatía', val: '95%', width: '95%' },
        { name: 'Carisma / Expresión', val: '80%', width: '80%' },
        { name: 'Adaptabilidad Diaria', val: '70%', width: '70%' }
      ]
    }
  };

  var charBtns = document.querySelectorAll('.char-tab-btn');
  var charAvatarInitials = document.getElementById('char-avatar-initials');
  var charAvatarClass = document.getElementById('char-avatar-class');
  var charName = document.getElementById('char-name');
  var charArchetype = document.getElementById('char-archetype');
  var charStatus = document.getElementById('char-status');
  var charLore = document.getElementById('char-lore');

  charBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var charKey = btn.getAttribute('data-char');
      var char = characters[charKey];
      if (!char) return;

      charBtns.forEach(function (b) {
        b.classList.remove('active', 'border-primary/40', 'text-foreground');
        b.classList.add('border-border', 'text-muted-foreground');
      });
      btn.classList.add('active', 'border-primary/40', 'text-foreground');
      btn.classList.remove('border-border', 'text-muted-foreground');

      if (charAvatarInitials) {
        charAvatarInitials.textContent = char.initials;
        charAvatarInitials.className = char.colorClass + ' font-black text-3xl';
      }
      if (charAvatarClass) charAvatarClass.textContent = char.className;
      if (charName) charName.textContent = char.name;
      if (charArchetype) charArchetype.textContent = char.archetype;
      if (charStatus) charStatus.textContent = char.status;
      if (charLore) charLore.textContent = char.lore;

      for (var i = 1; i <= 3; i++) {
        var stat = char.stats[i - 1];
        var sName = document.getElementById('stat-' + i + '-name');
        var sVal = document.getElementById('stat-' + i + '-val');
        var sBar = document.getElementById('stat-' + i + '-bar');
        if (sName) sName.textContent = stat.name;
        if (sVal) sVal.textContent = stat.val;
        if (sBar) {
          sBar.style.width = '0%';
          (function (bar, width) {
            setTimeout(function () {
              bar.style.width = width;
            }, 50);
          })(sBar, stat.width);
        }
      }
    });
  });

  // ==========================================================================
  // 8. FAQ ACCORDION
  // ==========================================================================
  var faqButtons = document.querySelectorAll('button[aria-controls^="faq-answer-"]');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('aria-controls');
      var panel = document.getElementById(targetId);
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', String(!isOpen));

      if (panel) {
        panel.classList.toggle('open', !isOpen);
      }

      var icon = btn.querySelector('svg');
      if (icon) {
        icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
  });

  // ==========================================================================
  // 9. APK GUIDED INSTALLATION MODAL & SHA256 COPY
  // ==========================================================================
  var apkGuideModal = document.getElementById('apk-guide-modal');
  var openApkGuideBtns = document.querySelectorAll('.open-apk-guide-modal');

  function openApkModal() {
    if (!apkGuideModal) return;
    apkGuideModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeApkModal() {
    if (!apkGuideModal) return;
    apkGuideModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openApkGuideBtns.forEach(function (btn) {
    btn.addEventListener('click', openApkModal);
  });

  // SHA256 Click-to-Copy
  var shaBox = document.querySelector('#apk-guide-modal .font-mono.select-all');
  if (shaBox) {
    shaBox.title = 'Haz clic para copiar el hash SHA-256';
    shaBox.style.cursor = 'pointer';
    shaBox.addEventListener('click', function () {
      var hashText = shaBox.textContent.trim();
      navigator.clipboard.writeText(hashText).then(function () {
        var prevText = shaBox.textContent;
        shaBox.textContent = 'Hash SHA-256 copiado al portapapeles con éxito';
        shaBox.style.color = 'var(--flare-emerald)';
        setTimeout(function () {
          shaBox.textContent = prevText;
          shaBox.style.color = '';
        }, 2000);
      }).catch(function () {});
    });
  }

  // ==========================================================================
  // 10. LEGAL MODALS (PRIVACY / TERMS / RULES)
  // ==========================================================================
  var legalModal = document.getElementById('legal-modal');
  var openLegalBtns = document.querySelectorAll('.open-legal-modal');
  var legalTitle = document.getElementById('modal-legal-title');
  var legalBody = document.getElementById('modal-legal-body');

  var legalDocuments = {
    privacy: {
      title: 'Política de Privacidad de Kyubi',
      body: '<p>En <strong>Kyubi</strong> nos tomamos la privacidad como un principio fundamental, no como una opción secundaria. Esta política describe con total transparencia qué datos recopilamos y cómo los protegemos.</p>' +
        '<h4>1. Datos que recopilamos</h4>' +
        '<p>Solo solicitamos la información estrictamente necesaria para que la aplicación funcione: tu nombre de usuario, correo electrónico para inicio de sesión seguro, avatar de perfil y las fichas de personaje que decides crear.</p>' +
        '<h4>2. Cero venta de datos personales</h4>' +
        '<p><strong>Kyubi no vende ni alquila tus datos a corredores de datos ni a empresas publicitarias.</strong> No monetizamos tu información personal ni implementamos rastreadores invasivos de comportamiento publicitario.</p>' +
        '<h4>3. Mensajería y salas</h4>' +
        '<p>Los mensajes de chat y las transmisiones de salas se procesan en tiempo real mediante WebSockets seguros. Solo almacenamos el historial que tú y los miembros de la sala deciden conservar para el desarrollo de sus tramas y recuerdos.</p>' +
        '<h4>4. Tus derechos</h4>' +
        '<p>Tienes derecho a exportar tus personajes y datos o solicitar la eliminación total e inmediata de tu cuenta en cualquier momento escribiéndonos a <a href="mailto:kyubioficial@gmail.com" class="text-accent">kyubioficial@gmail.com</a>.</p>'
    },
    terms: {
      title: 'Términos y Condiciones de Uso',
      body: '<p>Al registrarte y participar en la plataforma <strong>Kyubi</strong>, aceptas cumplir con los siguientes términos pensados para salvaguardar un entorno creativo y seguro:</p>' +
        '<h4>1. Propiedad del Contenido</h4>' +
        '<p>Tus personajes, escritos, historias, lore e ilustraciones te pertenecen exclusivamente a ti. Kyubi no reclama derechos de propiedad sobre tus creaciones originales.</p>' +
        '<h4>2. Uso de Salas y Watch Parties</h4>' +
        '<p>La función de Sala de Cine está diseñada para compartir contenido multimedia de forma sincronizada entre grupos privados o comunitarios bajo un marco de uso personal y no comercial.</p>' +
        '<h4>3. Responsabilidad de Cuenta</h4>' +
        '<p>Cada usuario es responsable de mantener la seguridad de sus credenciales y de las acciones realizadas desde su cuenta.</p>' +
        '<h4>4. Actualizaciones de la Beta</h4>' +
        '<p>Kyubi se encuentra en desarrollo activo. Durante la fase de beta cerrada pueden aplicarse mejoras continuas, ajustes de interfaz y reinicios de caché de prueba para optimizar el servicio.</p>'
    },
    rules: {
      title: 'Normas de la Comunidad de Kyubi',
      body: '<p>Nuestra comunidad prospera gracias al respeto mutuo, la creatividad y la inclusión. Para garantizar que todos disfruten de su experiencia, aplicamos estas normas de forma estricta:</p>' +
        '<h4>1. Respeto y Cero Acoso</h4>' +
        '<p>Queda estrictamente prohibido el hostigamiento, la discriminación por motivos de identidad, género, origen o creencias, y los comportamientos tóxicos dirigidos a perjudicar a otros usuarios.</p>' +
        '<h4>2. Roleplay Consensuado</h4>' +
        '<p>El roleplay narrativo se basa en el consentimiento de todos los participantes. Respeta las reglas de cada sala, las decisiones del anfitrión (host) y los límites establecidos por tus compañeros de rol.</p>' +
        '<h4>3. Salas de Voz y Cine Seguras</h4>' +
        '<p>No se permite el uso de moduladores de sonido para molestar (earrape), la transmisión de material ilícito ni la interrupción maliciosa de salas ajenas.</p>' +
        '<h4>4. Moderación Transparente</h4>' +
        '<p>Los moderadores de Kyubi actúan bajo un registro de auditoría estricto. Toda sanción debe contar con motivo y justificación documentada en nuestro sistema de administración.</p>'
    }
  };

  openLegalBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var docKey = btn.getAttribute('data-doc');
      var doc = legalDocuments[docKey];
      if (!doc || !legalModal) return;

      if (legalTitle) legalTitle.textContent = doc.title;
      if (legalBody) legalBody.innerHTML = doc.body;

      legalModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Modal Closer Handlers (APK Guide + Legal)
  document.querySelectorAll('.close-modal').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (apkGuideModal) apkGuideModal.classList.remove('active');
      if (legalModal) legalModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Click Outside to Close Modals
  [apkGuideModal, legalModal].forEach(function (m) {
    if (!m) return;
    m.addEventListener('click', function (e) {
      if (e.target === m) {
        m.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ESC Key to Close Modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (apkGuideModal) apkGuideModal.classList.remove('active');
      if (legalModal) legalModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ==========================================================================
  // 11. SCROLL REVEAL OBSERVER
  // ==========================================================================
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-up').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-up').forEach(function (el) {
      el.classList.add('visible');
    });
  }

});
