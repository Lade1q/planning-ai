/**
 * _nav.js — Floating screen navigator for RecallAI UI Prototype (ui-prototype/)
 * Đặt ở góc dưới-trái, không đụng proto-bar (dưới-phải) của các file interactive.
 */
(function () {
  var SCREENS = [
    { file: 'screen-focus-session.html', label: 'Phiên học tập trung', icon: '⏱️', tag: 'Prototype' },
    { file: 'screen-interview.html',     label: 'Kiểm tra vấn đáp',    icon: '💬', tag: 'Prototype' },
    { file: 'screen-session-result.html',label: 'Kết quả cuối phiên',  icon: '📊', tag: 'Prototype' },
  ];

  var currentFile = window.location.pathname.split('/').pop() || '';

  /* ── CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    '@media print { #_proto-nav { display:none!important; } }',
    '#_proto-nav {',
    '  position:fixed; bottom:16px; left:16px; z-index:9998;',
    '  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
    '  font-size:12px;',
    '}',
    '#_proto-toggle {',
    '  display:flex; align-items:center; gap:6px;',
    '  background:#0f172a; color:#e2e8f0; border:1px solid #334155;',
    '  border-radius:9999px; padding:6px 12px; cursor:pointer;',
    '  box-shadow:0 2px 12px rgba(0,0,0,.3);',
    '  font-size:12px; font-family:inherit;',
    '  transition:background .15s;',
    '}',
    '#_proto-toggle:hover { background:#1e293b; }',
    '#_proto-panel {',
    '  display:none; position:absolute; bottom:calc(100% + 8px); left:0;',
    '  background:#0f172a; border:1px solid #334155;',
    '  border-radius:12px; padding:8px 6px;',
    '  box-shadow:0 8px 32px rgba(0,0,0,.4);',
    '  min-width:230px;',
    '}',
    '#_proto-panel.open { display:block; }',
    '._pn-label {',
    '  font-size:10px; text-transform:uppercase; letter-spacing:.07em;',
    '  color:#64748b; padding:4px 10px 6px;',
    '}',
    '._pn-item {',
    '  display:flex; align-items:center; gap:8px;',
    '  padding:8px 10px; border-radius:7px; margin:1px 0;',
    '  color:#cbd5e1; text-decoration:none; font-size:12.5px;',
    '  transition:background .1s;',
    '}',
    '._pn-item:hover { background:#1e293b; color:#fff; }',
    '._pn-item.current { background:#1e3a5f; color:#93c5fd; font-weight:600; }',
    '._pn-badge {',
    '  margin-left:auto; font-size:10px; font-weight:600; letter-spacing:.03em;',
    '  padding:2px 7px; border-radius:9999px;',
    '  background:rgba(96,165,250,.15); color:#60a5fa;',
    '}',
    '._pn-divider { border:0; border-top:1px solid #1e293b; margin:4px 4px; }',
    '._pn-spec {',
    '  display:flex; align-items:center; gap:8px;',
    '  padding:7px 10px; border-radius:7px; margin:1px 0;',
    '  color:#64748b; text-decoration:none; font-size:12px;',
    '  transition:background .1s;',
    '}',
    '._pn-spec:hover { background:#1e293b; color:#94a3b8; }',
  ].join('\n');
  document.head.appendChild(style);

  /* ── HTML ── */
  var root = document.createElement('div');
  root.id = '_proto-nav';

  var toggle = document.createElement('button');
  toggle.id = '_proto-toggle';
  toggle.setAttribute('aria-label', 'Điều hướng prototype');
  function setToggleOpen(open) {
    toggle.innerHTML = open
      ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg> Đóng'
      : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Prototype';
  }
  setToggleOpen(false);

  var panel = document.createElement('div');
  panel.id = '_proto-panel';

  /* Section: prototype screens */
  var lbl = document.createElement('div');
  lbl.className = '_pn-label';
  lbl.textContent = 'UI Prototype — Sprint 4';
  panel.appendChild(lbl);

  SCREENS.forEach(function (s) {
    var isCurrent = (currentFile === s.file);
    var a = document.createElement('a');
    a.className = '_pn-item' + (isCurrent ? ' current' : '');
    a.href = s.file;
    a.innerHTML = '<span>' + s.icon + '</span>'
      + '<span>' + s.label + '</span>'
      + '<span class="_pn-badge">' + s.tag + '</span>';
    panel.appendChild(a);
  });

  /* Divider + link to spec sheets */
  var hr = document.createElement('hr');
  hr.className = '_pn-divider';
  panel.appendChild(hr);

  var specLink = document.createElement('a');
  specLink.className = '_pn-spec';
  specLink.href = '../claude-design/screen-dashboard.html';
  specLink.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg> Xem toàn bộ spec sheets ↗';
  panel.appendChild(specLink);

  root.appendChild(toggle);
  root.appendChild(panel);

  /* ── Behaviour ── */
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = panel.classList.toggle('open');
    setToggleOpen(open);
  });
  document.addEventListener('click', function () {
    panel.classList.remove('open');
    setToggleOpen(false);
  });
  panel.addEventListener('click', function (e) { e.stopPropagation(); });

  function mount() { document.body.appendChild(root); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
