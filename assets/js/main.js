

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Light / dark theme toggle
   */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    });
  }
  initThemeToggle();

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });


  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function (direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Hero background: floating 3D wireframe objects (Three.js)
   */
  function initHeroCanvas() {
    const canvas = document.querySelector('.hero-canvas');
    if (!canvas) return;
    if (typeof THREE === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);

    const shapes = [];

    function getWireColor() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 0x1a1a1a : 0xffffff;
    }

    function addShape(geometry, x, y, z, opacity, speed) {
      const material = new THREE.MeshBasicMaterial({
        color: getWireColor(),
        wireframe: true,
        transparent: true,
        opacity: opacity
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      shapes.push({ mesh: mesh, material: material, speed: speed, baseY: y, offset: Math.random() * Math.PI * 2 });
    }

    addShape(new THREE.IcosahedronGeometry(0.9, 0), -6.4, 2.6, -2.5, 0.16, 0.8);
    addShape(new THREE.IcosahedronGeometry(1.0, 1), -6.8, -2.6, -1.5, 0.12, 0.6);
    addShape(new THREE.TorusKnotGeometry(0.5, 0.15, 32, 6), 6.2, -1.8, -1, 0.15, 0.7);
    addShape(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8, 3), 6.8, 2, -2, 0.13, 0.5);

    document.addEventListener('themechange', function () {
      const color = getWireColor();
      shapes.forEach((s) => s.material.color.setHex(color));
    });

    function resize() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      shapes.forEach((s) => {
        s.mesh.rotation.x += s.speed * 0.002;
        s.mesh.rotation.y += s.speed * 0.003;
        s.mesh.position.y = s.baseY + Math.sin(t * 0.4 + s.offset) * 0.3;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  window.addEventListener('load', initHeroCanvas);

  /**
   * Hero background: randomized floating dev / design / AI symbol particles
   */
  function initHeroParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SYMBOLS = [
      { html: '&lt;/&gt;' }, { html: '{ }' }, { html: '( )' }, { html: 'fn()' },
      { html: '=&gt;' }, { html: '&amp;&amp;' }, { html: 'npm i' }, { html: 'git' },
      { html: 'const' }, { html: 'import' }, { html: '01001' }, { html: '#!/py' },
      { html: '<i class="bi bi-palette-fill"></i>', accent: true },
      { html: '<i class="bi bi-vector-pen"></i>', accent: true },
      { html: '<i class="bi bi-layers-fill"></i>', accent: true },
      { html: '<i class="bi bi-brush-fill"></i>', accent: true },
      { html: '<i class="bi bi-robot"></i>', accent: true },
      { html: '<i class="bi bi-cpu-fill"></i>', accent: true },
      { html: '<i class="bi bi-diagram-3-fill"></i>', accent: true },
      { html: 'AI', accent: true }, { html: 'ML', accent: true },
      { html: 'NLP', accent: true }, { html: 'RAG', accent: true }
    ];
    const PARTICLE_COUNT = 22;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const el = document.createElement('span');
      el.className = 'code-particle' + (symbol.accent ? ' accent' : '') + (symbol.html.startsWith('<i') ? ' icon' : '');
      el.innerHTML = symbol.html;
      el.style.setProperty('--x', Math.round(Math.random() * 94 + 2) + '%');
      el.style.setProperty('--size', Math.round(16 + Math.random() * 12) + 'px');
      el.style.setProperty('--duration', (14 + Math.random() * 10).toFixed(1) + 's');
      el.style.setProperty('--delay', (Math.random() * 15).toFixed(1) + 's');
      el.style.setProperty('--blur', Math.random() > 0.6 ? '1px' : '0px');
      fragment.appendChild(el);
    }
    container.appendChild(fragment);
  }
  window.addEventListener('load', initHeroParticles);

})();