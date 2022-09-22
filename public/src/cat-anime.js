'use strict';
var _a, _b;
var exports = {};
exports.__esModule = true;
var gsap_1 = require('gsap');
// import gsap_1 from 'gsap';
var ID = 'bongo-cat';
var s = function (selector) {
  return '#'.concat(ID, ' ').concat(selector);
};
var notes = document.querySelectorAll('.note');
for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
  var note = notes_1[_i];
  (_a = note === null || note === void 0 ? void 0 : note.parentElement) ===
    null || _a === void 0
    ? void 0
    : _a.appendChild(note.cloneNode(true));
  (_b = note === null || note === void 0 ? void 0 : note.parentElement) ===
    null || _b === void 0
    ? void 0
    : _b.appendChild(note.cloneNode(true));
}
var music = { note: s('.music .note') };
var cat = {
  pawRight: {
    up: s('.paw-right .up'),
    down: s('.paw-right .down'),
  },
  pawLeft: {
    up: s('.paw-left .up'),
    down: s('.paw-left .down'),
  },
};
var style = getComputedStyle(document.documentElement);
var green = style.getPropertyValue('--green');
var pink = style.getPropertyValue('--pink');
var blue = style.getPropertyValue('--blue');
var orange = style.getPropertyValue('--orange');
var cyan = style.getPropertyValue('--cyan');
gsap_1['default'].set(music.note, { scale: 0, autoAlpha: 1 });
var animatePawState = function (selector) {
  return gsap_1['default'].fromTo(
    selector,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.01,
      repeatDelay: 0.19,
      yoyo: true,
      repeat: -1,
    }
  );
};
var tl = gsap_1['default'].timeline();
tl.add(animatePawState(cat.pawLeft.up), 'start')
  .add(animatePawState(cat.pawRight.down), 'start')
  .add(animatePawState(cat.pawLeft.down), 'start+=0.19')
  .add(animatePawState(cat.pawRight.up), 'start+=0.19')
  .timeScale(1.6);
gsap_1['default'].from('.terminal-code line', {
  drawSVG: '0%',
  duration: 0.1,
  stagger: 0.1,
  ease: 'none',
  repeat: -1,
});
// typing for pipe function doesn't seem to be working for usage when partially applied?
var noteElFn = gsap_1['default'].utils.pipe(
  gsap_1['default'].utils.toArray,
  gsap_1['default'].utils.shuffle
);
var noteEls = noteElFn(music.note);
var numNotes = noteEls.length / 3;
var notesG1 = noteEls.splice(0, numNotes);
var notesG2 = noteEls.splice(0, numNotes);
var notesG3 = noteEls;
var colorizer = gsap_1['default'].utils.random(
  [green, pink, blue, orange, cyan, '#a3a4ec', '#67b5c0', '#fd7c6e'],
  true
);
var rotator = gsap_1['default'].utils.random(-50, 50, 1, true);
var dir = function (amt) {
  return ''.concat(gsap_1['default'].utils.random(['-', '+']), '=').concat(amt);
};
var animateNotes = function (els) {
  els.forEach(function (el) {
    gsap_1['default'].set(el, {
      stroke: colorizer(),
      rotation: rotator(),
      x: gsap_1['default'].utils.random(-25, 25, 1),
    });
  });
  return gsap_1['default'].fromTo(
    els,
    {
      autoAlpha: 1,
      y: 0,
      scale: 0,
    },
    {
      duration: 2,
      autoAlpha: 0,
      scale: 1,
      ease: 'none',
      stagger: {
        from: 'random',
        each: 0.5,
      },
      rotation: dir(gsap_1['default'].utils.random(20, 30, 1)),
      x: dir(gsap_1['default'].utils.random(40, 60, 1)),
      y: gsap_1['default'].utils.random(-200, -220, 1),
      onComplete: function () {
        return animateNotes(els);
      },
    }
  );
};
tl.add(animateNotes(notesG1))
  .add(animateNotes(notesG2), '>0.05')
  .add(animateNotes(notesG3), '>0.25');
