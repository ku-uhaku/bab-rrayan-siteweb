(function () {
  var B = window.BR, esc = B.esc;
  var LG = [['ar', 'العربية'], ['fr', 'Français'], ['en', 'English']];
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function show(id) { ['setup', 'login', 'dash'].forEach(function (x) { $('#' + x).hidden = x !== id; }); }

  var toastT;
  function toast(msg, bad) {
    var t = $('#toast');
    t.textContent = msg; t.className = 'toast on' + (bad ? ' bad' : '');
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = 'toast'; }, 3400);
  }
  function errMsg(e) {
    if (e && e.code === 'permission-denied') return 'Permission denied. Is your email listed in the Firestore rules?';
    return (e && e.message) || 'Something went wrong.';
  }

  if (!B.configured || !B.db || !B.auth) { show('setup'); return; }

  /* ---------- Auth ---------- */
  var started = false;
  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var err = $('#loginErr'); err.className = 'form-ok err'; err.textContent = '';
    B.auth.signInWithEmailAndPassword($('#l-email').value.trim(), $('#l-pass').value).catch(function (x) {
      err.className = 'form-ok err show';
      err.textContent = /invalid|wrong|user-not-found/.test(x.code) ? 'Wrong email or password.' : errMsg(x);
    });
  });
  $('#signout').addEventListener('click', function () { B.auth.signOut(); });
  B.auth.onAuthStateChanged(function (u) {
    $('#signout').hidden = !u;
    $('#who').textContent = u ? u.email : '';
    if (!u) { show('login'); return; }
    show('dash');
    if (!started) { started = true; start(); }
  });

  function today() { return new Date().toISOString().slice(0, 10); }

  /* ---------- Translatable inputs: one box per language ---------- */
  function trInputs(idBase, attr, key, val, type, rows) {
    var v = val && typeof val === 'object' ? val : { ar: val == null ? '' : String(val) };
    return LG.map(function (l) {
      var id = idBase + '-' + l[0];
      var a = attr + '="' + key + '" data-l="' + l[0] + '"' + (l[0] === 'ar' ? ' dir="rtl"' : '');
      var inp = type === 'textarea'
        ? '<textarea id="' + id + '" ' + a + ' rows="' + (rows || 2) + '">' + esc(v[l[0]]) + '</textarea>'
        : '<input id="' + id + '" type="text" ' + a + ' value="' + esc(v[l[0]]) + '">';
      return '<div class="tl"><label class="lg" for="' + id + '" title="' + l[1] + '">' + l[0].toUpperCase() + '</label>' + inp + '</div>';
    }).join('');
  }
  function readTr(scope, attr, key) {
    var o = {};
    $$('[' + attr + '="' + key + '"][data-l]', scope).forEach(function (el) { o[el.getAttribute('data-l')] = el.value.trim(); });
    return o;
  }

  /* ---------- Tabs ---------- */
  function start() {
    $$('.tab').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.tab').forEach(function (x) { x.setAttribute('aria-selected', x === t); });
        $$('.panel').forEach(function (p) { p.hidden = p.id !== 'p-' + t.getAttribute('data-tab'); });
      });
    });
    var ar = function (v) { return esc(B.t(v, 'ar')); };
    crud({
      name: 'announcements',
      intro: 'Announcements appear in the News section. A pinned announcement also shows in the bar at the very top of the site. Arabic is required; if French or English is empty, visitors see the Arabic text.',
      fields: [
        { k: 'title', label: 'Title', tr: true, req: true },
        { k: 'body', label: 'Message', tr: true, type: 'textarea', rows: 3 },
        { k: 'date', label: 'Date', type: 'date', req: true, def: today },
        { k: 'pinned', label: 'Pin to the top bar', type: 'checkbox', def: false },
        { k: 'show', label: 'Visible on the site', type: 'checkbox', def: true }
      ],
      sort: function (a, b) { return String(b.date).localeCompare(String(a.date)); },
      title: function (i) { return ar(i.title) + (i.pinned ? '<span class="badge">Pinned</span>' : '') + (i.show === false ? '<span class="badge off">Hidden</span>' : ''); },
      meta: function (i) { return esc(B.fmtDate(i.date, 'en')); }
    });
    crud({
      name: 'events',
      intro: 'Events appear in “Coming up” and disappear by themselves once their date has passed.',
      fields: [
        { k: 'title', label: 'Title', tr: true, req: true },
        { k: 'date', label: 'Date', type: 'date', req: true, def: today },
        { k: 'time', label: 'Time (optional)', ph: '10:00 – 14:00' },
        { k: 'place', label: 'Place (optional)', tr: true },
        { k: 'description', label: 'Short note (optional)', tr: true }
      ],
      sort: function (a, b) { return String(a.date).localeCompare(String(b.date)); },
      title: function (i) { return ar(i.title); },
      meta: function (i) { return esc(B.fmtDate(i.date, 'en')) + (i.place ? ' · ' + ar(i.place) : ''); }
    });
    var CATS = [['forms', 'Forms'], ['timetables', 'Timetables'], ['fees', 'Fees'], ['programs', 'Programs'], ['other', 'Other']];
    crud({
      name: 'files',
      intro: 'Upload the PDF to Google Drive, set sharing to “Anyone with the link”, and paste the link here. The site turns it into a direct download button.',
      fields: [
        { k: 'title', label: 'Title', tr: true, req: true },
        { k: 'category', label: 'Category', type: 'select', opts: CATS, def: 'forms' },
        { k: 'url', label: 'File link', req: true, ph: 'https://drive.google.com/file/d/…', hint: 'Any link to a PDF or file works: Drive, Dropbox, your own hosting.' },
        { k: 'description', label: 'Short description (optional)', tr: true }
      ],
      sort: function (a, b) { return (b.created || 0) - (a.created || 0); },
      title: function (i) { return ar(i.title); },
      meta: function (i) { return esc(String(i.category || 'other') + ' · ' + B.fileExt(i.url)); }
    });
    requests();
    contentEditor();
  }

  /* ---------- Generic list + form ---------- */
  function fieldHtml(f, id) {
    if (f.type === 'checkbox')
      return '<label class="check"><input type="checkbox" id="' + id + '" data-k="' + f.k + '"> ' + esc(f.label) + '</label>';
    var hint = f.hint ? '<small>' + esc(f.hint) + '</small>' : '';
    if (f.tr)
      return '<div class="field"><span class="fl">' + esc(f.label) + (f.req ? ' * (AR)' : '') + '</span><div class="trs">' + trInputs(id, 'data-k', f.k, null, f.type, f.rows) + '</div>' + hint + '</div>';
    var input;
    if (f.type === 'select')
      input = '<select id="' + id + '" data-k="' + f.k + '">' + f.opts.map(function (o) { return '<option value="' + o[0] + '">' + esc(o[1]) + '</option>'; }).join('') + '</select>';
    else
      input = '<input id="' + id + '" data-k="' + f.k + '" type="' + (f.type || 'text') + '"' + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + '>';
    return '<div class="field"><label for="' + id + '">' + esc(f.label) + (f.req ? ' *' : '') + '</label>' + input + hint + '</div>';
  }

  function crud(cfg) {
    var root = $('#p-' + cfg.name), form, list, editing = null, items = [];
    root.innerHTML = '<div class="two"><form class="editor" novalidate><h3></h3>' +
      cfg.fields.map(function (f) { return fieldHtml(f, cfg.name + '-' + f.k); }).join('') +
      '<div class="btns"><button class="btn btn-saffron" type="submit">Save</button><button class="btn btn-line" type="button" data-cancel hidden>Cancel</button></div></form>' +
      '<div><p class="hint">' + esc(cfg.intro) + '</p><ul class="rows"></ul></div></div>';
    form = $('form', root); list = $('.rows', root);

    function fill(item) {
      $('h3', form).textContent = editing ? 'Edit' : 'Add new';
      $('[data-cancel]', form).hidden = !editing;
      cfg.fields.forEach(function (f) {
        var v = item && item[f.k] != null ? item[f.k] : (typeof f.def === 'function' ? f.def() : f.def);
        if (f.tr) {
          LG.forEach(function (l) {
            var el = $('[data-k="' + f.k + '"][data-l="' + l[0] + '"]', form);
            el.value = v && typeof v === 'object' ? (v[l[0]] || '') : (l[0] === 'ar' && v ? v : '');
          });
          return;
        }
        var el2 = $('[data-k="' + f.k + '"]', form);
        if (f.type === 'checkbox') el2.checked = !!v; else el2.value = v == null ? '' : v;
      });
    }
    function read() {
      var d = {};
      cfg.fields.forEach(function (f) {
        if (f.tr) { d[f.k] = readTr(form, 'data-k', f.k); return; }
        var el = $('[data-k="' + f.k + '"]', form);
        d[f.k] = f.type === 'checkbox' ? el.checked : el.value.trim();
      });
      return d;
    }
    function draw() {
      items.sort(cfg.sort);
      list.innerHTML = items.length ? items.map(function (i) {
        return '<li class="row-item"><div><b dir="auto">' + cfg.title(i) + '</b><small>' + cfg.meta(i) + '</small></div><div class="acts">' +
          '<button class="mini" data-edit="' + i.id + '">Edit</button><button class="mini danger" data-del="' + i.id + '">Delete</button></div></li>';
      }).join('') : '<li class="row-item"><small>Nothing here yet. Add the first one on the left.</small></li>';
    }
    function refresh() {
      return B.db.collection(cfg.name).get().then(function (s) {
        items = s.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }); draw();
      }).catch(function (e) { toast(errMsg(e), true); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = read();
      var missing = cfg.fields.filter(function (f) { return f.req && !(f.tr ? d[f.k].ar : d[f.k]); });
      if (missing.length) { toast('Please fill in: ' + missing.map(function (f) { return f.label; }).join(', '), true); return; }
      var col = B.db.collection(cfg.name);
      var p = editing ? col.doc(editing).set(d, { merge: true }) : col.add(Object.assign({ created: Date.now() }, d));
      p.then(function () { toast('Saved. It is live on the site.'); editing = null; fill(null); return refresh(); })
       .catch(function (x) { toast(errMsg(x), true); });
    });
    $('[data-cancel]', form).addEventListener('click', function () { editing = null; fill(null); });
    list.addEventListener('click', function (e) {
      var ed = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
      if (ed) {
        editing = ed.getAttribute('data-edit');
        fill(items.filter(function (i) { return i.id === editing; })[0]);
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (del) {
        if (!del.classList.contains('sure')) { /* first click arms the button, second deletes */
          del.classList.add('sure'); del.textContent = 'Sure?';
          setTimeout(function () { del.classList.remove('sure'); del.textContent = 'Delete'; }, 3000); return;
        }
        B.db.collection(cfg.name).doc(del.getAttribute('data-del')).delete()
          .then(function () { toast('Deleted.'); return refresh(); }).catch(function (x) { toast(errMsg(x), true); });
      }
    });
    fill(null); refresh();
  }

  /* ---------- Visit requests (read + delete) ---------- */
  function requests() {
    var root = $('#p-requests');
    root.innerHTML = '<p class="hint">Families who used the “Request a visit” form on the site. Reply by email or WhatsApp, then delete the request.</p><ul class="rows"></ul>';
    var list = $('.rows', root), items = [];
    function draw() {
      items.sort(function (a, b) { return (b.created || 0) - (a.created || 0); });
      list.innerHTML = items.length ? items.map(function (r) {
        return '<li class="row-item"><div><b dir="auto">' + esc(r.name) + '</b><small>' + esc(r.stage) + ' · ' +
          '<a href="tel:' + esc(String(r.phone || '').replace(/[^\d+]/g, '')) + '" dir="ltr">' + esc(r.phone || r.email) + '</a> · ' + esc(new Date(r.created || 0).toLocaleString('en-GB')) + '</small>' +
          (r.message ? '<small class="msg" dir="auto">' + esc(r.message) + '</small>' : '') + '</div><div class="acts"><button class="mini danger" data-del="' + r.id + '">Delete</button></div></li>';
      }).join('') : '<li class="row-item"><small>No requests yet.</small></li>';
    }
    function refresh() {
      B.db.collection('requests').get().then(function (s) {
        items = s.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }); draw();
      }).catch(function (e) { toast(errMsg(e), true); });
    }
    list.addEventListener('click', function (e) {
      var del = e.target.closest('[data-del]'); if (!del) return;
      if (!del.classList.contains('sure')) {
        del.classList.add('sure'); del.textContent = 'Sure?';
        setTimeout(function () { del.classList.remove('sure'); del.textContent = 'Delete'; }, 3000); return;
      }
      B.db.collection('requests').doc(del.getAttribute('data-del')).delete().then(refresh).catch(function (x) { toast(errMsg(x), true); });
    });
    refresh();
  }

  /* ---------- Page content editor (driven by BR.schema) ---------- */
  function itemHtml(f, vals) {
    var flds = f.item.map(function (s) {
      var id = 'i' + Math.random().toString(36).slice(2, 8);
      var hint = s.hint ? '<small>' + esc(s.hint) + '</small>' : '';
      if (!s.plain)
        return '<div class="field"><span class="fl">' + esc(s.label) + '</span><div class="trs">' + trInputs(id, 'data-ik', s.k, vals && vals[s.k], s.type, 2) + '</div>' + hint + '</div>';
      return '<div class="field"><label for="' + id + '">' + esc(s.label) + '</label><input id="' + id + '" data-ik="' + s.k + '" type="text" value="' + esc(vals && vals[s.k] != null ? vals[s.k] : '') + '">' + hint + '</div>';
    }).join('');
    return '<div class="li"><div class="li-fields">' + flds + '</div><div class="li-acts">' +
      '<button type="button" class="mini" data-act="up" aria-label="Move up">↑</button>' +
      '<button type="button" class="mini" data-act="down" aria-label="Move down">↓</button>' +
      '<button type="button" class="mini danger" data-act="rm">Remove</button></div></div>';
  }
  function sectionBody(sec, data) {
    return sec.fields.map(function (f) {
      if (f.type === 'list') {
        return '<div class="listed" data-list="' + f.k + '"><h4>' + esc(f.label) + '</h4><div class="items">' +
          (data[f.k] || []).map(function (v) { return itemHtml(f, v); }).join('') +
          '</div><button type="button" class="mini" data-act="add">+ ' + esc(f.add) + '</button></div>';
      }
      var id = 'c-' + sec.id + '-' + f.k;
      if (!f.plain)
        return '<div class="field"><span class="fl">' + esc(f.label) + '</span><div class="trs">' + trInputs(id, 'data-k', f.k, data[f.k], f.type, 3) + '</div></div>';
      return '<div class="field"><label for="' + id + '">' + esc(f.label) + '</label><input id="' + id + '" data-k="' + f.k + '" type="text" value="' + esc(data[f.k]) + '"></div>';
    }).join('') + '<button type="button" class="mini reset" data-act="reset">Reset this section to the original text</button>';
  }

  function contentEditor() {
    var root = $('#p-content');
    root.innerHTML = '<p class="hint">Edit any text on the public site in Arabic (AR), French (FR) and English (EN). If a French or English box is empty, visitors see the Arabic text. Nothing changes until you press “Save all changes”. Use ↑ ↓ to reorder items.</p><div id="secs"></div>' +
      '<div class="savebar"><button class="btn btn-saffron" id="saveAll" type="button">Save all changes</button><span class="hint" style="margin:0">Live on the site right after saving.</span></div>';
    var secs = $('#secs', root);

    B.db.doc('site/content').get().then(function (snap) {
      var C = B.merge(snap.exists ? snap.data() : null);
      secs.innerHTML = B.schema.map(function (sec) {
        return '<details class="sec" data-sec="' + sec.id + '"><summary>' + esc(sec.title) + '</summary><div class="flds">' + sectionBody(sec, C[sec.id]) + '</div></details>';
      }).join('');
    }).catch(function (e) { toast(errMsg(e), true); });

    secs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var secEl = b.closest('.sec'), sec = B.schema.filter(function (s) { return s.id === secEl.getAttribute('data-sec'); })[0];
      var act = b.getAttribute('data-act');
      if (act === 'reset') {
        $('.flds', secEl).innerHTML = sectionBody(sec, B.defaults[sec.id]);
        toast('Section reset. Press “Save all changes” to keep it.'); return;
      }
      var listEl = b.closest('.listed'), f = listEl && sec.fields.filter(function (x) { return x.k === listEl.getAttribute('data-list'); })[0];
      if (act === 'add') $('.items', listEl).insertAdjacentHTML('beforeend', itemHtml(f, {}));
      var li = b.closest('.li');
      if (act === 'rm') li.remove();
      if (act === 'up' && li.previousElementSibling) li.parentNode.insertBefore(li, li.previousElementSibling);
      if (act === 'down' && li.nextElementSibling) li.parentNode.insertBefore(li.nextElementSibling, li);
    });

    $('#saveAll', root).addEventListener('click', function () {
      var out = {};
      B.schema.forEach(function (sec) {
        var secEl = $('[data-sec="' + sec.id + '"]', secs), o = {};
        sec.fields.forEach(function (f) {
          if (f.type === 'list') {
            o[f.k] = $$('[data-list="' + f.k + '"] .li', secEl).map(function (li) {
              var it = {};
              f.item.forEach(function (s) {
                it[s.k] = s.plain ? $('[data-ik="' + s.k + '"]', li).value.trim() : readTr(li, 'data-ik', s.k);
              });
              return it;
            });
          } else o[f.k] = f.plain ? $('[data-k="' + f.k + '"]', secEl).value.trim() : readTr(secEl, 'data-k', f.k);
        });
        out[sec.id] = o;
      });
      B.db.doc('site/content').set(out).then(function () { toast('Saved. Reload the site to see it.'); })
        .catch(function (x) { toast(errMsg(x), true); });
    });
  }
})();
