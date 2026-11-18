/* Schriftwahl (Runde 9, nur zur Auswahl im Kundentermin): ein Klick setzt html[data-font], die Wahl gilt auf allen Seiten (localStorage).
   Runde 9c: Leiste ein- und ausblendbar (Knopf „Aa“ bzw. Taste S), mit ‹ › oder den Pfeiltasten ←/→ durch alle Schriften blättern.
   Nach der Entscheidung entfernen. */
(function () {
  var opts = [
    ['', 'Aktuell', 'Schibsted Grotesk'],
    ['redhat', '1 Scharf geschnitten', 'Red Hat Display + Text'],
    ['chivo', '2 Klare Grotesk', 'Chivo'],
    ['funnel', '3 Kantige Enden', 'Funnel Display + Sans'],
    ['host', '4 Ruhig & präzise', 'Host Grotesk']
  ];
  var KEY = 'igelbrink-font-9b', KEY_OPEN = 'igelbrink-fontpick-open', cur = '', open = true, box;
  try { cur = localStorage.getItem(KEY) || ''; open = localStorage.getItem(KEY_OPEN) !== '0'; } catch (e) {}
  function idx() { for (var i = 0; i < opts.length; i++) if (opts[i][0] === cur) return i; return 0; }
  function apply(v) {
    cur = v;
    if (v) document.documentElement.setAttribute('data-font', v); else document.documentElement.removeAttribute('data-font');
    try { localStorage.setItem(KEY, v); } catch (e) {}
    if (box) {
      box.querySelectorAll('button[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === v ? 'true' : 'false'); });
      box.querySelector('.fontpick__now').textContent = opts[idx()][1];
    }
    window.dispatchEvent(new Event('resize'));   /* H1-Linie neu messen */
  }
  function setOpen(o) {
    open = o;
    if (box) { box.classList.toggle('is-closed', !o); box.querySelector('.fontpick__toggle').setAttribute('aria-expanded', o ? 'true' : 'false'); }
    try { localStorage.setItem(KEY_OPEN, o ? '1' : '0'); } catch (e) {}
  }
  function step(d) { apply(opts[(idx() + d + opts.length) % opts.length][0]); }
  apply(cur);
  document.addEventListener('DOMContentLoaded', function () {
    box = document.createElement('div');
    box.className = 'fontpick'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Schrift wählen (Vorschau)');
    box.innerHTML = '<button type="button" class="fontpick__toggle" aria-expanded="true" title="Schriftwahl ein-/ausblenden (Taste S)">Aa</button>' +
      '<span class="fontpick__now"></span>' +
      '<div class="fontpick__panel">' +
        '<button type="button" class="fontpick__step" data-step="-1" aria-label="Vorherige Schrift" title="Vorherige Schrift (←)">‹</button>' +
        opts.map(function (o) { return '<button type="button" data-v="' + o[0] + '" title="' + o[2] + '">' + o[1] + '<span>' + o[2] + '</span></button>'; }).join('') +
        '<button type="button" class="fontpick__step" data-step="1" aria-label="Nächste Schrift" title="Nächste Schrift (→)">›</button>' +
      '</div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('fontpick__toggle')) { setOpen(!open); return; }
      if (b.dataset.step) { step(+b.dataset.step); return; }
      apply(b.dataset.v);
    });
    document.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 's' || e.key === 'S') setOpen(!open);
      else if (open && e.key === 'ArrowRight') step(1);
      else if (open && e.key === 'ArrowLeft') step(-1);
    });
    apply(cur); setOpen(open);
  });
})();
