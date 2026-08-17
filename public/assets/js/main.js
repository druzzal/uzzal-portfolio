(function () {
'use strict';
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
var isReduced = function () { return reduced.matches; };
var $  = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
$$('[data-year]').forEach(function (el) {
el.textContent = new Date().getFullYear();
});
(function () {
var root = document.documentElement;
var toggles = $$('[data-theme-toggle]');
if (!toggles.length) return;
var meta = document.querySelector('meta[name="theme-color"]');
var media = window.matchMedia('(prefers-color-scheme: dark)');
function apply(theme, persist) {
root.setAttribute('data-theme', theme);
var dark = theme === 'dark';
toggles.forEach(function (t) {
t.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
t.setAttribute('aria-pressed', dark ? 'true' : 'false');
});
if (meta) meta.setAttribute('content', dark ? '#101A22' : '#F7F4EC');
if (persist) { try { localStorage.setItem('theme', theme); } catch (e) {} }
}
var stored = null;
try { stored = localStorage.getItem('theme'); } catch (e) {}
apply(stored || (media.matches ? 'dark' : 'light'), false);
toggles.forEach(function (t) {
t.addEventListener('click', function () {
apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
});
});
var onSystemChange = function (e) {
var chosen = null;
try { chosen = localStorage.getItem('theme'); } catch (err) {}
if (!chosen) apply(e.matches ? 'dark' : 'light', false);
};
if (media.addEventListener) media.addEventListener('change', onSystemChange);
else if (media.addListener) media.addListener(onSystemChange);
})();
var nav = $('#nav');
var bar = $('#progress');
if (nav || bar) {
var sTick = false;
var scrollMax = 0;
var isSolid = null, isDeep = null;
function measure() {
scrollMax = document.documentElement.scrollHeight - window.innerHeight;
}
function render() {
sTick = false;
var y = window.scrollY;
if (nav) {
var solid = y > 12, deep = y > 220;
if (solid !== isSolid) { nav.classList.toggle('is-solid', solid); isSolid = solid; }
if (deep  !== isDeep)  { nav.classList.toggle('is-deep',  deep);  isDeep  = deep;  }
}
if (bar) {
var p = scrollMax > 0 ? Math.min(y / scrollMax, 1) : 0;
bar.style.transform = 'scaleX(' + p + ')';
}
}
function onScroll() {
if (!sTick) { sTick = true; window.requestAnimationFrame(render); }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });
window.addEventListener('load', function () { measure(); onScroll(); });
if ('ResizeObserver' in window) {
var ro = new ResizeObserver(function () { measure(); onScroll(); });
ro.observe(document.body);
}
measure();
render();
}
var menu   = $('#menu');
var burger = $('#burger');
var veilEl = menu ? $('.menu-veil', menu) : null;
var panel  = menu ? $('.menu-panel', menu) : null;
var lastFocused = null;
var FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
function openMenu() {
if (!menu || !burger) return;
lastFocused = document.activeElement;
menu.classList.add('is-open');
if (nav) nav.classList.add('is-open');
burger.setAttribute('aria-expanded', 'true');
burger.setAttribute('aria-label', 'Close menu');
document.body.classList.add('is-locked');
menu.removeAttribute('aria-hidden');
window.setTimeout(function () {
var first = $(FOCUSABLE, panel);
if (first) first.focus();
}, isReduced() ? 0 : 260);
}
function closeMenu(restoreFocus) {
if (!menu || !burger || !menu.classList.contains('is-open')) return;
menu.classList.remove('is-open');
if (nav) nav.classList.remove('is-open');
burger.setAttribute('aria-expanded', 'false');
burger.setAttribute('aria-label', 'Open menu');
document.body.classList.remove('is-locked');
menu.setAttribute('aria-hidden', 'true');
if (restoreFocus !== false && lastFocused && lastFocused.focus) lastFocused.focus();
}
if (burger && menu) {
burger.addEventListener('click', function () {
menu.classList.contains('is-open') ? closeMenu() : openMenu();
});
if (veilEl) veilEl.addEventListener('click', function () { closeMenu(); });
$$('a', panel).forEach(function (a) {
a.addEventListener('click', function () { closeMenu(false); });
});
document.addEventListener('keydown', function (e) {
if (!menu.classList.contains('is-open')) return;
if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
if (e.key === 'Tab') {
var items = $$(FOCUSABLE, panel).filter(function (el) {
return el.offsetParent !== null &&
window.getComputedStyle(el).visibility !== 'hidden';
});
if (!items.length) return;
var first = items[0];
var last  = items[items.length - 1];
if (e.shiftKey && document.activeElement === first) {
e.preventDefault(); last.focus();
} else if (!e.shiftKey && document.activeElement === last) {
e.preventDefault(); first.focus();
} else if (!panel.contains(document.activeElement)) {
e.preventDefault(); first.focus();
}
}
});
window.addEventListener('resize', function () {
if (window.innerWidth > 1240) closeMenu(false);
}, { passive: true });
}
var navGroups = $$('[data-nav-group]');
function closeGroup(group, restoreFocus) {
if (!group.classList.contains('is-open')) return;
group.classList.remove('is-open');
var trigger = $('.nav-trigger', group);
if (trigger) {
trigger.setAttribute('aria-expanded', 'false');
if (restoreFocus) trigger.focus();
}
}
function closeAllGroups(except, restoreFocus) {
navGroups.forEach(function (g) {
if (g !== except) closeGroup(g, restoreFocus === true);
});
}
function openGroup(group) {
closeAllGroups(group);
group.classList.add('is-open');
var trigger = $('.nav-trigger', group);
if (trigger) trigger.setAttribute('aria-expanded', 'true');
}
navGroups.forEach(function (group) {
var trigger = $('.nav-trigger', group);
if (!trigger) return;
trigger.addEventListener('click', function (e) {
e.stopPropagation();
var byKeyboard = e.detail === 0;
var canHover = window.matchMedia('(hover: hover)').matches;
if (group.classList.contains('is-open')) {
if (byKeyboard || !canHover) closeGroup(group);
} else {
openGroup(group);
}
});
group.addEventListener('mouseenter', function () {
if (window.matchMedia('(hover: hover)').matches) openGroup(group);
});
group.addEventListener('mouseleave', function () {
if (window.matchMedia('(hover: hover)').matches) closeGroup(group);
});
group.addEventListener('focusout', function (e) {
if (!group.contains(e.relatedTarget)) closeGroup(group);
});
$$('.nav-drop-item', group).forEach(function (a) {
a.addEventListener('click', function () { closeGroup(group); });
});
});
if (navGroups.length) {
document.addEventListener('keydown', function (e) {
if (e.key !== 'Escape') return;
var open = navGroups.filter(function (g) {
return g.classList.contains('is-open');
});
if (!open.length) return;
e.preventDefault();
open.forEach(function (g) { closeGroup(g, true); });
});
document.addEventListener('click', function (e) {
navGroups.forEach(function (g) {
if (!g.contains(e.target)) closeGroup(g);
});
});
window.addEventListener('resize', function () {
navGroups.forEach(function (g) { closeGroup(g); });
}, { passive: true });
}
$$('.menu-acc').forEach(function (acc) {
var sub = document.getElementById(acc.getAttribute('aria-controls'));
if (!sub) return;
acc.addEventListener('click', function () {
var open = acc.getAttribute('aria-expanded') === 'true';
acc.setAttribute('aria-expanded', open ? 'false' : 'true');
sub.classList.toggle('is-open', !open);
});
});
var veil = $('#veil');
var body = document.body;
body.classList.add('page-in');
if (veil && !isReduced()) {
veil.classList.add('is-in');
window.requestAnimationFrame(function () {
window.requestAnimationFrame(function () {
veil.classList.remove('is-in');
veil.classList.add('is-out');
});
});
}
function isInternal(a) {
if (!a) return false;
if (a.target && a.target !== '_self') return false;
if (a.hasAttribute('download')) return false;
if (a.dataset.noTransition !== undefined) return false;
var href = a.getAttribute('href') || '';
if (!href || href.charAt(0) === '#') return false;
if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
if (a.origin && a.origin !== window.location.origin) return false;
if (a.pathname === window.location.pathname && a.hash) return false;
return true;
}
document.addEventListener('click', function (e) {
if (e.defaultPrevented || e.button !== 0) return;
if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
var a = e.target.closest ? e.target.closest('a') : null;
if (!isInternal(a)) return;
if (isReduced() || !veil) return;
e.preventDefault();
var url = a.href;
veil.classList.remove('is-out');
veil.classList.add('is-in');
var navigated = false;
function go() { if (!navigated) { navigated = true; window.location.href = url; } }
veil.addEventListener('transitionend', go, { once: true });
window.setTimeout(go, 620); // fallback so navigation is never blocked
});
window.addEventListener('pageshow', function (e) {
if (e.persisted) {
body.classList.remove('is-locked');
closeMenu(false);
if (veil) { veil.classList.remove('is-in'); veil.classList.add('is-out'); }
}
});
var canHover = window.matchMedia('(hover:hover) and (pointer:fine)');
var cursor = $('#cursor');
if (cursor && canHover.matches && !isReduced()) {
var cx = 0, cy = 0, tx = 0, ty = 0, running = false;
document.addEventListener('mousemove', function (e) {
tx = e.clientX; ty = e.clientY;
if (!cursor.classList.contains('is-on')) cursor.classList.add('is-on');
if (!running) { running = true; window.requestAnimationFrame(loop); }
}, { passive: true });
document.addEventListener('mouseleave', function () {
cursor.classList.remove('is-on');
lastOver = null;
}, { passive: true });
function loop() {
cx += (tx - cx) * 0.19;
cy += (ty - cy) * 0.19;
cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
window.requestAnimationFrame(loop);
} else { running = false; }
}
var lastOver = null;
document.addEventListener('mouseover', function (e) {
var t = e.target;
if (t === lastOver) return;        // same element, the answer cannot have changed
lastOver = t;
var hot = t.closest && t.closest('a, button, .focus-item, .chip, [data-hot]');
cursor.classList.toggle('is-hot', !!hot);
var dark = t.closest && t.closest('.section--dark, .foot, .menu-panel');
cursor.classList.toggle('is-dark', !!dark);
}, { passive: true });
} else if (cursor) {
cursor.remove();
}
if (canHover.matches && !isReduced()) {
var magnets = [];
$$('[data-magnet]').forEach(function (el) {
var state = { box: null };
var raf = null;
magnets.push(state);
el.addEventListener('mouseenter', function () {
state.box = el.getBoundingClientRect();
el.style.willChange = 'transform';
});
el.addEventListener('mousemove', function (e) {
if (!state.box) state.box = el.getBoundingClientRect();
var box = state.box;
var mx = e.clientX - box.left - box.width / 2;
var my = e.clientY - box.top - box.height / 2;
if (raf) window.cancelAnimationFrame(raf);
raf = window.requestAnimationFrame(function () {
el.style.transform = 'translate(' + (mx * 0.14) + 'px,' + (my * 0.2) + 'px)';
});
});
el.addEventListener('mouseleave', function () {
if (raf) window.cancelAnimationFrame(raf);
state.box = null;
el.style.transform = '';
el.style.willChange = 'auto';
});
});
/* The cached rect is viewport-relative: scrolling or resizing under a resting
   pointer would otherwise pull the button toward a position it no longer has. */
if (magnets.length) {
var dropMagnetBoxes = function () {
for (var i = 0; i < magnets.length; i++) magnets[i].box = null;
};
window.addEventListener('scroll', dropMagnetBoxes, { passive: true });
window.addEventListener('resize', dropMagnetBoxes, { passive: true });
}
}
var tabs = $$('[role="tab"]');
if (tabs.length) {
function select(tab) {
tabs.forEach(function (t) {
var on = t === tab;
t.setAttribute('aria-selected', on ? 'true' : 'false');
t.setAttribute('tabindex', on ? '0' : '-1');
var p = document.getElementById(t.getAttribute('aria-controls'));
if (!p) return;
p.hidden = !on;
p.classList.remove('is-live');
if (on && !isReduced()) {
void p.offsetWidth;          // restart the stagger
p.classList.add('is-live');
}
});
}
tabs.forEach(function (tab, i) {
tab.addEventListener('click', function () { select(tab); });
tab.addEventListener('keydown', function (e) {
var n = null;
if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  n = tabs[(i - 1 + tabs.length) % tabs.length];
if (e.key === 'Home') n = tabs[0];
if (e.key === 'End')  n = tabs[tabs.length - 1];
if (n) { e.preventDefault(); n.focus(); select(n); }
});
});
}
var form   = $('#contact-form');
var submit = $('#cf-submit');
if (form && submit) {
var status = $('#form-status');
var done   = $('#form-done');
var again  = $('#cf-again');
var label  = $('.btn-label', submit);
var canAjax = typeof window.fetch === 'function' &&
typeof window.FormData === 'function' &&
typeof window.URLSearchParams === 'function';
var sent = false;
/* Only take over native validation when we can also take over the POST. With
   no fetch, the browser submits the form itself and Netlify handles it. */
if (canAjax) form.setAttribute('novalidate', 'novalidate');
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var RULES = {
name:    { msg: 'Please tell me your name.' },
email:   { msg: 'Please add your email address.',
bad: 'That email address does not look right.' },
reason:  { msg: 'Please choose a reason for contact.' },
message: { msg: 'Please write a message.' }
};
function fieldOf(el) { return el.closest('[data-field]'); }
function setError(el, message) {
var wrap = fieldOf(el);
if (!wrap) return;
var out = $('.field-error', wrap);
if (message) {
wrap.classList.add('has-error');
el.setAttribute('aria-invalid', 'true');
if (out) out.textContent = message;
} else {
wrap.classList.remove('has-error');
el.removeAttribute('aria-invalid');
if (out) out.textContent = '';
}
}
function validate(el) {
var rule = RULES[el.name];
if (!rule) return true;                       // optional field
var v = (el.value || '').trim();
if (!v) { setError(el, rule.msg); return false; }
if (el.name === 'email' && !EMAIL_RE.test(v)) { setError(el, rule.bad); return false; }
setError(el, '');
return true;
}
var reason = form.elements.reason;
if (reason) {
reason.addEventListener('change', function () {
reason.classList.toggle('is-placeholder', !reason.value);
});
}
Object.keys(RULES).forEach(function (n) {
var el = form.elements[n];
if (!el) return;
el.addEventListener('blur', function () { validate(el); });
el.addEventListener('input', function () {
if (fieldOf(el) && fieldOf(el).classList.contains('has-error')) validate(el);
});
el.addEventListener('change', function () {
if (fieldOf(el) && fieldOf(el).classList.contains('has-error')) validate(el);
});
});
function setLoading(on) {
submit.disabled = on;
submit.classList.toggle('is-loading', on);
form.setAttribute('aria-busy', on ? 'true' : 'false');
if (label) label.textContent = on ? 'Sending' : 'Send message';
}
function say(message, isError) {
if (!status) return;
status.textContent = message;
status.classList.toggle('is-error', !!isError);
}
form.addEventListener('submit', function (e) {
/* No fetch in this browser: do not intercept. The browser performs a normal
   POST to the action URL and Netlify Forms handles it exactly as it does for
   a visitor with JavaScript switched off. */
if (!canAjax) return;
e.preventDefault();
if (sent || submit.disabled) return;
var firstBad = null;
Object.keys(RULES).forEach(function (n) {
var el = form.elements[n];
if (el && !validate(el) && !firstBad) firstBad = el;
});
if (firstBad) {
say('Please check the highlighted fields.', true);
firstBad.focus();
return;
}
setLoading(true);
say('Sending your message\u2026');
/* Netlify Forms accepts URL-encoded bodies only, and needs form-name in the
   payload. FormData already picks up the hidden field; re-assert it so a
   stripped or renamed hidden input can never produce an unrecorded POST. */
var body = new URLSearchParams();
new FormData(form).forEach(function (v, k) { body.append(k, v); });
if (!body.get('form-name')) body.set('form-name', form.getAttribute('name') || 'contact');
var action = form.getAttribute('action') || '/';
fetch(action, {
method: 'POST',
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
body: body.toString(),
credentials: 'same-origin',
redirect: 'follow'
})
.then(function (r) {
/* 404/405 means the POST reached the CDN but no form handler claimed it,
   i.e. the 'contact' form is not registered on this deploy. Never report
   that as a success. */
if (r.status === 404 || r.status === 405) throw new Error('form not registered on this deploy');
if (!r.ok) throw new Error('HTTP ' + r.status);
sent = true;
setLoading(false);
say('');
form.reset();
if (reason) reason.classList.add('is-placeholder');
if (done) {
form.style.display = 'none';
done.classList.add('is-on');
done.focus();
} else {
say('Thank you — your message is on its way.');
}
})
.catch(function (err) {
setLoading(false);
if (window.console && console.warn) console.warn('Contact form submission failed:', err && err.message);
say('That did not send. Your message is still here — please try again, or email dr.uzzaltang@gmail.com directly.', true);
});
});
if (again && done) {
again.addEventListener('click', function () {
done.classList.remove('is-on');
form.style.display = '';
sent = false;
setLoading(false);
say('');
var first = form.elements.name;
if (first) first.focus();
});
}
}
})();