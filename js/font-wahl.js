/* Schriftwahl (Runde 9, nur zur Auswahl): ein Klick setzt html[data-font], die Wahl gilt auf allen Seiten (localStorage). Nach der Entscheidung entfernen. */
(function () {
  var opts = [
    ['', 'Aktuell', 'Schibsted Grotesk'],
    ['redhat', '1 Scharf geschnitten', 'Red Hat Display + Text'],
    ['chivo', '2 Klare Grotesk', 'Chivo'],
    ['funnel', '3 Kantige Enden', 'Funnel Display + Sans'],
    ['host', '4 Ruhig & präzise', 'Host Grotesk']
  ];
  var KEY = 'igelbrink-font-9b', cur = '';
  try { cur = localStorage.getItem(KEY) || ''; } catch (e) {}
  function apply(v) {
    if (v) document.documentElement.setAttribute('data-font', v); else document.documentElement.removeAttribute('data-font');
    try { localStorage.setItem(KEY, v); } catch (e) {}
    document.querySelectorAll('.fontpick button[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === v ? 'true' : 'false'); });
    window.dispatchEvent(new Event('resize'));   /* H1-Linie neu messen */
  }
  apply(cur);
  document.addEventListener('DOMContentLoaded', function () {
    var box = document.createElement('div');
    box.className = 'fontpick'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Schrift wählen (Vorschau)');
    box.innerHTML = '<span class="fontpick__lbl">Schrift</span>' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '" title="' + o[2] + '">' + o[1] + '<span>' + o[2] + '</span></button>';
    }).join('') + '<button type="button" class="fontpick__x" aria-label="Umschalter ausblenden">✕</button>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('fontpick__x')) { box.remove(); return; }
      apply(b.dataset.v);
    });
    apply(cur);
  });
})();
