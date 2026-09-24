(function () {
  var B = window.BR, esc = B.esc, safeUrl = B.safeUrl;
  var $ = function (id) { return document.getElementById(id); };
  var put = function (id, s) { var el = $(id); if (el) el.innerHTML = s; };
  var LOC = { ar: 'ar-MA-u-nu-latn', fr: 'fr-FR', en: 'en-GB' };
  var canon = document.querySelector('link[rel="canonical"]');
  var BASE = canon ? canon.href.split('?')[0] : location.href.split('?')[0];

  var D = null, filesState = 'all';
  var lang = pickLang();
  var t = function (v) { return B.t(v, lang); };
  var ui = function (k) { return B.uiText(k, lang); };
  var empty = function (msg) { return '<li class="empty">' + esc(msg) + '</li>'; };

  function pickLang() {
    var q = (location.search.match(/[?&]lang=(ar|fr|en)/) || [])[1];
    if (q) return q;
    try { var s = localStorage.getItem('br-lang'); if (/^(ar|fr|en)$/.test(s)) return s; } catch (e) {}
    return 'ar';
  }
  function setDir() {
    var h = document.documentElement;
    h.lang = lang; h.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
  setDir();

  /* ---------- Language-dependent chrome ---------- */
  function applyChrome() {
    setDir();
    document.querySelectorAll('[data-i]').forEach(function (el) { el.textContent = ui(el.getAttribute('data-i')); });
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang); });
    var appName = t(D.content.app.name);
    $('navApp').textContent = ui('navApp').replace('{app}', appName);
    $('footLine').textContent = ui('footer');
    $('topbarClose').setAttribute('aria-label', ui('dismiss'));
    $('burger').setAttribute('aria-label', ui($('nav').classList.contains('open') ? 'menuClose' : 'menuOpen'));

    var m = B.meta[lang], url = lang === 'ar' ? BASE : BASE + '?lang=' + lang;
    document.title = m.title;
    var set = function (sel, attr, val) { var el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', m.desc);
    set('meta[property="og:title"]', 'content', m.title);
    set('meta[property="og:description"]', 'content', m.desc);
    set('meta[name="twitter:title"]', 'content', m.title);
    set('meta[name="twitter:description"]', 'content', m.desc);
    set('meta[property="og:locale"]', 'content', { ar: 'ar_MA', fr: 'fr_MA', en: 'en_US' }[lang]);
    set('meta[property="og:url"]', 'content', url);
    set('link[rel="canonical"]', 'href', url);
  }

  function fillText(C) {
    document.querySelectorAll('[data-c]').forEach(function (el) {
      var p = el.getAttribute('data-c').split('.');
      var v = C[p[0]] && C[p[0]][p[1]];
      if (v != null) el.textContent = t(v);
    });
  }

  /* ---------- Rendering ---------- */
  function renderContent(C) {
    put('r-facts', C.hero.facts.map(function (f) {
      return '<div><dt>' + esc(t(f.label)) + '</dt><dd>' + esc(t(f.value)) + '</dd></div>';
    }).join(''));

    put('r-ticks', C.about.ticks.map(function (x) { return '<li>' + esc(t(x.text)) + '</li>'; }).join(''));

    put('r-stages', C.stages.items.map(function (s) {
      return '<li class="stage reveal"><h3>' + esc(t(s.name)) + '</h3><p class="ages">' + esc(t(s.ages)) +
        '</p><p class="desc">' + esc(t(s.desc)) + '</p><p class="langs">' + esc(t(s.langs)) + '</p></li>';
    }).join(''));

    put('day-list', '<span class="line"></span>' + C.day.items.map(function (d) {
      return '<li class="reveal"><time>' + esc(d.time) + '</time><div><h3>' + esc(t(d.title)) + '</h3><p>' + esc(t(d.text)) + '</p></div></li>';
    }).join(''));

    put('r-why', C.why.items.map(function (w) {
      return '<li class="reveal"><h3>' + esc(t(w.title)) + '</h3><p>' + esc(t(w.text)) + '</p></li>';
    }).join(''));

    var q = C.voices.items;
    put('r-voices', (q[0] ? '<blockquote class="pull reveal"><p>“' + esc(t(q[0].text)) + '”</p><footer>' + esc(t(q[0].who)) + '</footer></blockquote>' : '') +
      (q.length > 1 ? '<div class="pair">' + q.slice(1).map(function (x) {
        return '<blockquote class="small reveal"><p>“' + esc(t(x.text)) + '”</p><footer>' + esc(t(x.who)) + '</footer></blockquote>';
      }).join('') + '</div>' : ''));

    var a = C.app;
    put('r-features', a.features.map(function (f) {
      return '<li><b>' + esc(t(f.title)) + '</b><span>' + esc(t(f.text)) + '</span></li>';
    }).join(''));
    var stores = [];
    if (a.playUrl) stores.push('<a class="btn btn-dark" target="_blank" rel="noopener" href="' + esc(safeUrl(a.playUrl)) + '">' + esc(ui('gplay')) + '</a>');
    if (a.appleUrl) stores.push('<a class="btn btn-dark" target="_blank" rel="noopener" href="' + esc(safeUrl(a.appleUrl)) + '">' + esc(ui('appstore')) + '</a>');
    if (a.extraUrl) stores.push('<a class="btn btn-line" href="' + esc(B.fileUrl(a.extraUrl)) + '">' + esc(t(a.extraLabel) || ui('dlDefault')) + '</a>');
    put('r-stores', stores.length ? stores.join('') : '<span class="soon">' + esc(ui('soon')) + '</span>');

    var m = C.admissions;
    put('r-steps', m.steps.map(function (s) {
      return '<li><b>' + esc(t(s.title)) + '</b><span>' + esc(t(s.text)) + '</span></li>';
    }).join(''));
    var wa = String(m.whatsapp || '').replace(/\D/g, '');
    var tel = String(m.phone || '').replace(/[^\d+]/g, '');
    var ltr = function (s) { return '<bdi dir="ltr">' + esc(s) + '</bdi>'; };
    put('r-contact',
      '<li><span>' + esc(ui('cAddress')) + '</span>' + esc(t(m.address)) + '</li>' +
      '<li><span>' + esc(ui('cPhone')) + '</span>' + ltr(m.phone) + '</li>' +
      (wa ? '<li><span>WhatsApp</span><a target="_blank" rel="noopener" href="https://wa.me/' + wa + '">' + ltr(m.whatsapp) + '</a></li>' : '') +
      '<li><span>' + esc(ui('cEmail')) + '</span>' + ltr(m.email) + '</li>' +
      '<li><span>' + esc(ui('cOffice')) + '</span>' + esc(t(m.hours)) + '</li>');
    $('mCall').hidden = !tel; $('mCall').href = 'tel:' + tel;
    $('mWa').hidden = !wa; $('mWa').href = 'https://wa.me/' + wa;
    $('mbar').classList.toggle('two', !tel || !wa);
  }

  function renderNews() {
    var today = new Date().toISOString().slice(0, 10);

    var ann = D.announcements.filter(function (x) { return x.show !== false; }).sort(function (x, y) {
      return (y.pinned ? 1 : 0) - (x.pinned ? 1 : 0) || String(y.date).localeCompare(String(x.date));
    });
    put('r-notes', ann.length ? ann.map(function (x) {
      return '<li class="note-item reveal"><time>' + esc(B.fmtDate(x.date, lang)) + '</time><div><h4>' + esc(t(x.title)) +
        (x.pinned ? '<span class="pin">' + esc(ui('pinned')) + '</span>' : '') + '</h4><p>' + esc(t(x.body)) + '</p></div></li>';
    }).join('') : empty(ui('noAnn')));

    var ev = D.events.filter(function (x) { return String(x.date) >= today; })
      .sort(function (x, y) { return String(x.date).localeCompare(String(y.date)); });
    put('r-events', ev.length ? ev.map(function (x) {
      var d = new Date(x.date + 'T00:00:00');
      var meta = [x.time, t(x.place), t(x.description)].filter(Boolean).map(esc).join(' · ');
      return '<li class="event reveal"><time><b>' + String(d.getDate()).padStart(2, '0') + '</b>' +
        d.toLocaleDateString(LOC[lang], { month: 'short' }) + '</time><div><h3>' + esc(t(x.title)) + '</h3><p>' + meta + '</p></div></li>';
    }).join('') : empty(ui('noEv')));

    /* topbar: newest pinned announcement */
    var pin = ann.filter(function (x) { return x.pinned; })[0];
    var bar = $('topbar');
    var dismissed = false;
    try { dismissed = pin && sessionStorage.getItem('br-bar') === pin.id; } catch (e) {}
    if (pin && !dismissed) {
      $('topbarText').textContent = t(pin.title);
      bar.classList.add('on');
      document.documentElement.style.setProperty('--top', '38px');
      $('topbarClose').onclick = function () {
        bar.classList.remove('on');
        document.documentElement.style.setProperty('--top', '0px');
        try { sessionStorage.setItem('br-bar', pin.id); } catch (e) {}
      };
    } else {
      bar.classList.remove('on');
      document.documentElement.style.setProperty('--top', '0px');
    }
  }

  function renderFiles() {
    var files = D.files.slice().sort(function (x, y) { return (y.created || 0) - (x.created || 0); });
    var key = function (f) { return String(f.category || 'other').toLowerCase(); };
    var label = function (k) { return B.ui['cat_' + k] ? ui('cat_' + k) : k; };
    var cats = ['all'];
    files.forEach(function (f) { if (cats.indexOf(key(f)) < 0) cats.push(key(f)); });
    if (cats.indexOf(filesState) < 0) filesState = 'all';

    function list() {
      var shown = files.filter(function (f) { return filesState === 'all' || key(f) === filesState; });
      put('r-files', shown.length ? shown.map(function (f) {
        return '<li class="file"><span class="ftype">' + esc(B.fileExt(f.url)) + '</span><div><h4>' + esc(t(f.title)) + '</h4><p>' +
          '<span class="cat">' + esc(label(key(f))) + '</span>' + (t(f.description) ? ' · ' + esc(t(f.description)) : '') + '</p></div>' +
          '<a class="dl" target="_blank" rel="noopener" href="' + esc(B.fileUrl(f.url)) + '">' + esc(ui('download')) + ' <span aria-hidden="true">↓</span></a></li>';
      }).join('') : empty(ui('noFiles')));
    }
    function chips() {
      put('r-chips', cats.length > 2 ? cats.map(function (c) {
        return '<button class="chip" type="button" aria-pressed="' + (c === filesState) + '" data-cat="' + esc(c) + '">' + esc(c === 'all' ? ui('all') : label(c)) + '</button>';
      }).join('') : '');
    }
    $('r-chips').onclick = function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      filesState = b.getAttribute('data-cat'); chips(); list();
    };
    chips(); list();
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  function observeReveals(instant) {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      if (instant) { el.classList.add('in'); return; }
      var sibs = [].filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 4) * 80 + 'ms';
      io.observe(el);
    });
  }

  function renderAll(instant) {
    applyChrome();
    fillText(D.content);
    renderContent(D.content);
    renderNews();
    renderFiles();
    observeReveals(instant);
  }

  /* ---------- UI behaviour (set up once) ---------- */
  function initUI() {
    var header = $('header'), burger = $('burger'), nav = $('nav'), day = $('day-list');
    var navLinks = [].slice.call(nav.querySelectorAll('a:not(.btn)'));
    var targets = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });

    function drawTimeline() {
      var line = day.querySelector('.line'); if (!line) return;
      var r = day.getBoundingClientRect();
      var p = (innerHeight * 0.6 - r.top) / r.height;
      line.style.height = Math.max(0, Math.min(1, p)) * (r.height - 16) + 'px';
    }
    function onScroll() {
      var y = window.scrollY, cur = -1;
      header.classList.toggle('scrolled', y > 30);
      targets.forEach(function (s, i) { if (s && s.offsetTop - 160 <= y) cur = i; });
      navLinks.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
      drawTimeline();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', drawTimeline);
    onScroll();

    function setMenu(open) {
      nav.classList.toggle('open', open);
      document.documentElement.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', ui(open ? 'menuClose' : 'menuOpen'));
    }
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () {
        var l = b.getAttribute('data-lang');
        if (l === lang) return;
        lang = l;
        try { localStorage.setItem('br-lang', l); } catch (e) {}
        $('formOk').className = 'form-ok';
        renderAll(true);
      });
    });

    /* hide the bottom action bar while the admissions section is on screen */
    var mbar = $('mbar');
    new IntersectionObserver(function (en) {
      mbar.classList.toggle('off', en[0].isIntersecting);
    }, { threshold: 0.25 }).observe($('admissions'));

    var art = document.querySelector('.hero-art svg');
    if (art && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', function () {
        if (scrollY < 700) art.style.transform = 'translateY(' + scrollY * 0.06 + 'px)';
      }, { passive: true });
    }

    /* Visit request form: saved to Firestore (collection "requests") when Firebase is connected */
    var form = $('form'), ok = $('formOk'), btn = $('formBtn');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = {
        name: $('f-name').value.trim(), phone: $('f-phone').value.trim(),
        stage: (form.querySelector('input[name="stage"]:checked') || {}).value || '',
        message: $('f-msg').value.trim(), created: Date.now()
      };
      function done(good) {
        btn.disabled = false;
        ok.className = 'form-ok show' + (good ? '' : ' err');
        ok.textContent = ui(good ? 'fOk' : 'fErr');
        if (good) form.reset();
      }
      if ($('f-bot').checked) { done(true); return; } /* spam trap: real visitors never tick this */
      btn.disabled = true;

      /* 1) save in Firebase, 2) email it to the school. Success if either one works. */
      var jobs = [];
      if (B.db) jobs.push(B.db.collection('requests').add(data));
      var key = window.ENV && window.ENV.WEB3FORMS_KEY;
      if (key) {
        jobs.push(fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: key,
            subject: 'New visit request — Bab Rrayan',
            from_name: 'Bab Rrayan website',
            name: data.name, phone: data.phone, cycle: data.stage,
            message: data.message || '-', language: lang
          })
        }).then(function (r) { return r.json(); }).then(function (j) { if (!j.success) throw new Error(j.message); }));
      }
      if (!jobs.length) { done(true); return; } /* demo mode: nothing connected yet */
      Promise.allSettled(jobs).then(function (rs) {
        done(rs.some(function (r) { return r.status === 'fulfilled'; }));
      });
    });
  }

  $('year').textContent = new Date().getFullYear();

  B.load().then(function (d) {
    D = d;
    renderAll(false);
    initUI();
    document.documentElement.classList.remove('loading');
  });
})();
