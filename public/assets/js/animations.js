(function () {
'use strict';
var $  = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var supportsIO = 'IntersectionObserver' in window;
if (reduced || !supportsIO) {
$$('[data-reveal], [data-draw], [data-draw-y], [data-mask]').forEach(function (el) {
el.classList.add('is-in');
});
var fillStatic = $('#tl-fill');
if (fillStatic) fillStatic.style.transform = 'scaleY(1)';
return;
}
var readers = [], writers = [], scheduled = false;
function frame() {
scheduled = false;
for (var i = 0; i < readers.length; i++) readers[i]();   // all reads
for (var j = 0; j < writers.length; j++) writers[j]();   // then all writes
}
function schedule() {
if (!scheduled) { scheduled = true; window.requestAnimationFrame(frame); }
}
var scratch = document.createElement('div');
function stripText(html) {
scratch.innerHTML = html;
return scratch.textContent.trim();
}
function splitLines(el) {
if (!el.dataset.original) el.dataset.original = el.innerHTML;
if (!el.dataset.originalText) el.dataset.originalText = stripText(el.dataset.original);
var words = el.dataset.originalText.split(/\s+/);
el.innerHTML = words.map(function (w) {
return '<span class="w">' + w + '</span>';
}).join(' ');
var spans = el.getElementsByClassName('w');
var tops = [];
for (var i = 0; i < spans.length; i++) tops.push(spans[i].offsetTop); // one layout
var lines = [], current = [], lastTop = null;
for (var k = 0; k < words.length; k++) {
var top = tops[k];
if (lastTop === null) lastTop = top;
if (Math.abs(top - lastTop) > 4) {          // new visual line
lines.push(current); current = []; lastTop = top;
}
current.push(words[k]);
}
if (current.length) lines.push(current);
el.innerHTML = lines.map(function (w) {
return '<span class="ln"><span>' + w.join(' ') + '</span></span>';
}).join('');
/* The stagger is set through the CSSOM rather than a style attribute in the
   markup. Both produce the same computed delay, but a style attribute is
   inline CSS and would need script-style 'unsafe-inline' in the CSP. */
var inners = el.querySelectorAll('.ln > span');
for (var n = 0; n < inners.length; n++) {
inners[n].style.setProperty('--d', (n * 90) + 'ms');
}
}
var splitTargets = $$('[data-split]');
splitTargets.forEach(splitLines);
function resplitAll() {
splitTargets.forEach(function (el) {
var wasIn = el.classList.contains('is-in');
splitLines(el);
if (wasIn) el.classList.add('is-in');
});
}
/* The first split runs on the fallback font, because a deferred script beats
   the webfont download. Fraunces wraps differently from the serif fallback, so
   without this the headings visibly re-flow the moment the font swaps in. */
if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
document.fonts.ready.then(function () {
if (splitTargets.length) resplitAll();
}).catch(function () {});
}
var resizeTimer;
var lastSplitWidth = window.innerWidth;
window.addEventListener('resize', function () {
/* A vertical-only resize (mobile URL bar sliding away) cannot change where
   the lines wrap, so re-splitting there is pure layout cost during a scroll. */
if (window.innerWidth === lastSplitWidth) return;
lastSplitWidth = window.innerWidth;
window.clearTimeout(resizeTimer);
resizeTimer = window.setTimeout(resplitAll, 220);
}, { passive: true });
function countUp(el) {
var finalText = el.textContent;
var target    = parseFloat(el.dataset.count);
var display   = el.dataset.display;        // e.g. "30–50" for a range
var dur       = 1500;
var start     = null;
if (!isFinite(target)) return;             // nothing sensible to animate
/* The element still holds its shipped text, so this is the final width. Pin it
   for the duration: '0' growing to '15,000' would otherwise shove the suffix
   sideways on every frame. Released again on the last frame. */
var pinned = el.getBoundingClientRect().width;
if (pinned) el.style.minWidth = pinned.toFixed(2) + 'px';
function unpin() { el.style.minWidth = ''; }
if (display) {                             // ranges cannot be tweened
el.textContent = '0';
window.setTimeout(function () { el.textContent = finalText; unpin(); }, 520);
return;
}
function step(ts) {
if (start === null) start = ts;
var p = Math.min((ts - start) / dur, 1);
var eased = 1 - Math.pow(1 - p, 4);      // quartic ease-out
if (p < 1) {
el.textContent = Math.round(target * eased).toLocaleString('en-US');
window.requestAnimationFrame(step);
} else {
el.textContent = finalText;            // land on exactly what shipped
unpin();
}
}
window.requestAnimationFrame(step);
}
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (!entry.isIntersecting) return;
var el = entry.target;
el.classList.add('is-in');
if (el.dataset.count !== undefined) countUp(el);
io.unobserve(el);                        // reveal once, then release
});
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
$$('[data-reveal], [data-draw], [data-draw-y], [data-mask], [data-split], [data-count]')
.forEach(function (el) { io.observe(el); });
var tl   = $('#tl');
var fill = $('#tl-fill');
if (tl && fill) {
var tlP = 0, tlLast = -1;
readers.push(function () {
var r  = tl.getBoundingClientRect();
var vh = window.innerHeight;
var startAt = vh * 0.78;
var endAt   = vh * 0.42;
var total   = (r.height + (startAt - endAt)) || 1;
tlP = Math.max(0, Math.min(1, (startAt - r.top) / total));
});
writers.push(function () {
if (tlP === tlLast) return;              // nothing moved, nothing to restyle
tlLast = tlP;
fill.style.transform = 'scaleY(' + tlP + ')';
});
}
var floats = $$('[data-parallax]');
if (floats.length) {
var offsets  = new Array(floats.length);
var lastOff  = new Array(floats.length);
var onScreen = new Array(floats.length);
readers.push(function () {
var vh = window.innerHeight;
for (var i = 0; i < floats.length; i++) {
var r = floats[i].getBoundingClientRect();
if (r.bottom < -200 || r.top > vh + 200) { offsets[i] = null; continue; }
var speed  = parseFloat(floats[i].dataset.parallax) || 0.06;
var centre = r.top + r.height / 2 - vh / 2;
offsets[i] = (-centre * speed).toFixed(2);
}
});
writers.push(function () {
for (var i = 0; i < floats.length; i++) {
var off = offsets[i];
var vis = off !== null && off !== undefined;
/* Promote only while it is in play. A permanent layer on the hero
   portrait costs memory for every screenful the user never sees it on. */
if (vis !== onScreen[i]) {
onScreen[i] = vis;
floats[i].style.willChange = vis ? 'transform' : 'auto';
}
if (!vis || off === lastOff[i]) continue;   // same offset, skip the restyle
lastOff[i] = off;
floats[i].style.transform = 'translate3d(0,' + off + 'px,0)';
}
});
}
if (readers.length) {
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });
frame();                                   // initial position
}
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
var tilts = [];
$$('[data-tilt]').forEach(function (el) {
var frameEl = el.parentElement;
if (!frameEl) return;
var state = { box: null };
var raf = null;
tilts.push(state);
frameEl.addEventListener('mouseenter', function () {
state.box = frameEl.getBoundingClientRect();
el.style.willChange = 'transform';
});
frameEl.addEventListener('mousemove', function (e) {
if (!state.box) state.box = frameEl.getBoundingClientRect();
var box = state.box;
var px = (e.clientX - box.left) / box.width  - 0.5;
var py = (e.clientY - box.top)  / box.height - 0.5;
if (raf) window.cancelAnimationFrame(raf);
raf = window.requestAnimationFrame(function () {
el.style.transform = 'scale(1.03) translate(' + (px * -6).toFixed(2) + 'px,' +
(py * -6).toFixed(2) + 'px)';
});
});
frameEl.addEventListener('mouseleave', function () {
if (raf) window.cancelAnimationFrame(raf);
state.box = null;
el.style.transform = '';
el.style.willChange = 'auto';
});
});
/* getBoundingClientRect is viewport-relative, so a scroll or resize while the
   pointer rests on the frame invalidates it. Drop it and let the next
   mousemove re-read, instead of tilting from a stale origin. */
if (tilts.length) {
var dropTiltBoxes = function () {
for (var i = 0; i < tilts.length; i++) tilts[i].box = null;
};
window.addEventListener('scroll', dropTiltBoxes, { passive: true });
window.addEventListener('resize', dropTiltBoxes, { passive: true });
}
}
function parkOffscreen(host, track) {
new IntersectionObserver(function (entries) {
entries.forEach(function (en) {
var on = en.isIntersecting;
host.classList.toggle('is-off', !on);
if (!track) return;
/* '' REMOVES the inline declaration rather than forcing 'running', so the
   stylesheet's reveal gate and hover-to-pause rules stay in charge. */
track.style.animationPlayState = on ? '' : 'paused';
track.style.willChange         = on ? 'transform' : 'auto';
});
}, { rootMargin: '200px 0px' }).observe(host);
}
$$('.orgs-marquee').forEach(function (m) { parkOffscreen(m, $('.orgs-track', m)); });
$$('.fstrip-marquee').forEach(function (m) { parkOffscreen(m, $('.fstrip', m)); });
$$('.scroll-cue').forEach(function (c) { parkOffscreen(c, null); });
})();