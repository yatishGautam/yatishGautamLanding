/* yatishgautam.com — interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- hero word stagger ---- */
  var words = document.querySelectorAll(".hero__title .word");
  words.forEach(function (w, i) {
    w.style.animationDelay = 0.08 * i + 0.1 + "s";
  });

  /* ---- rotating word in hero ---- */
  var swapEl = document.getElementById("swap");
  var swaps = ["everything else.", "iOS apps.", "desktop apps.", "retail platforms.", "neural nets.", "everything else."];
  if (swapEl && !reduceMotion) {
    var si = 0;
    setInterval(function () {
      swapEl.classList.add("out");
      setTimeout(function () {
        si = (si + 1) % swaps.length;
        swapEl.textContent = swaps[si];
        swapEl.classList.remove("out");
        swapEl.classList.add("in");
        setTimeout(function () { swapEl.classList.remove("in"); }, 500);
      }, 350);
    }, 3200);
  }

  /* ---- nav scrolled state ---- */
  var nav = document.getElementById("nav");
  var onScrollNav = function () {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---- cursor glow ---- */
  var glow = document.querySelector(".cursor-glow");
  if (glow && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var gx = innerWidth / 2, gy = innerHeight / 3, tx = gx, ty = gy;
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
      requestAnimationFrame(loop);
    })();
  }

  /* ---- scroll progress bar ---- */
  var progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    var onScrollProgress = function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      progressBar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScrollProgress, { passive: true });
    onScrollProgress();
  }

  /* ---- hero orb parallax ---- */
  if (!reduceMotion) {
    var orbs = document.querySelectorAll(".orb");
    window.addEventListener("scroll", function () {
      var y = scrollY;
      if (y < innerHeight * 1.5) {
        orbs.forEach(function (o, i) {
          o.style.marginTop = y * (i ? -0.12 : 0.18) + "px";
        });
      }
    }, { passive: true });
  }

  /* ---- chip stagger indices ---- */
  document.querySelectorAll(".chips").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (li, i) {
      li.style.setProperty("--chip-i", i);
    });
  });

  /* ---- card reveal stagger (per grid) ---- */
  document.querySelectorAll(".cards, .stack, .stats").forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (el, i) {
      if (el.classList.contains("reveal-up")) {
        el.style.transitionDelay = (i % 4) * 0.1 + "s";
      }
    });
  });

  /* ---- section title scramble-decode ---- */
  var GLYPHS = "!<>-_\\/[]{}—=+*^?#";
  function startScramble(title) {
    if (title.dataset.scrambled) return;
    title.dataset.scrambled = "1";
    var textNode = null;
    title.childNodes.forEach(function (n) {
      if (n.nodeType === 3 && n.textContent.trim()) textNode = n;
    });
    if (!textNode || reduceMotion) return;
    var finalText = textNode.textContent;
    var frame = 0;
    var total = 26;
    (function tick() {
      frame++;
      var settled = Math.floor((frame / total) * finalText.length);
      var out = "";
      for (var i = 0; i < finalText.length; i++) {
        if (i < settled || finalText[i] === " ") out += finalText[i];
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      textNode.textContent = out;
      if (frame < total) requestAnimationFrame(tick);
      else textNode.textContent = finalText;
    })();
  }
  document.querySelectorAll(".section__title").forEach(function (title) {
    var obs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      startScramble(title);
    }, { threshold: 0.6 });
    obs.observe(title);
  });

  /* ---- cursor ring ---- */
  var ring = document.getElementById("cursor-ring");
  if (ring && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var rx = innerWidth / 2, ry = innerHeight / 2, rtx = rx, rty = ry, ringOn = false;
    document.addEventListener("mousemove", function (e) {
      rtx = e.clientX; rty = e.clientY;
      if (!ringOn) { ringOn = true; ring.classList.add("on"); }
    });
    document.addEventListener("mouseover", function (e) {
      ring.classList.toggle("hovering", !!e.target.closest("a, button, .card, .terminal"));
    });
    (function ringLoop() {
      rx += (rtx - rx) * 0.16;
      ry += (rty - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(ringLoop);
    })();
  }

  /* ---- scroll-velocity marquee ---- */
  var track = document.querySelector(".marquee__track");
  if (track && !reduceMotion) {
    track.classList.add("js-driven");
    var mOffset = 0, mHalf = 0, lastY = scrollY, velocity = 0, hovered = false;
    track.parentElement.addEventListener("mouseenter", function () { hovered = true; });
    track.parentElement.addEventListener("mouseleave", function () { hovered = false; });
    var measure = function () { mHalf = track.scrollWidth / 2; };
    window.addEventListener("resize", measure);
    measure();
    (function marqueeLoop() {
      var y = scrollY;
      velocity += ((y - lastY) - velocity) * 0.08;
      lastY = y;
      if (!hovered) mOffset -= 0.6 + Math.min(Math.abs(velocity) * 0.35, 7);
      else mOffset -= velocity * 0.2;
      if (mHalf > 0) {
        if (mOffset <= -mHalf) mOffset += mHalf;
        if (mOffset > 0) mOffset -= mHalf;
      }
      track.style.transform = "translateX(" + mOffset + "px)";
      requestAnimationFrame(marqueeLoop);
    })();
  }

  /* ---- masked word reveals ---- */
  document.querySelectorAll(".mask-words").forEach(function (el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    el.textContent = "";
    var delay = 0;
    function wrap(content) {
      var outer = document.createElement("span");
      outer.className = "mw";
      var inner = document.createElement("span");
      inner.style.transitionDelay = delay + "s";
      delay += 0.055;
      if (typeof content === "string") inner.textContent = content;
      else inner.appendChild(content);
      outer.appendChild(inner);
      return outer;
    }
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).forEach(function (w) {
          if (!w) return;
          el.appendChild(wrap(w));
          el.appendChild(document.createTextNode(" "));
        });
      } else if (n.tagName === "BR") {
        el.appendChild(n);
      } else {
        el.appendChild(wrap(n));
        el.appendChild(document.createTextNode(" "));
      }
    });
    var mObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        el.classList.add("visible");
        mObs.disconnect();
      }
    }, { threshold: 0.4 });
    mObs.observe(el);
  });

  /* ---- terminal float parallax ---- */
  var termEl = document.querySelector(".terminal");
  if (termEl && !reduceMotion) {
    window.addEventListener("scroll", function () {
      var r = termEl.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) {
        var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        termEl.style.translate = "0 " + p * -28 + "px";
      }
    }, { passive: true });
  }

  /* ---- reveal on scroll ---- */
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        revealer.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal-up").forEach(function (el) { revealer.observe(el); });

  /* ---- animated counters ---- */
  var counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    document.querySelectorAll(".stat__num").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = (String(target).split(".")[1] || "").length;
      var t0 = null;
      var dur = 1600;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var statsObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) runCounters();
  }, { threshold: 0.4 });
  var statsEl = document.querySelector(".stats");
  if (statsEl) statsObs.observe(statsEl);

  /* ---- view hooks the sweep fallback can trigger ---- */
  var viewHooks = [];

  /* ---- terminal typing demo ---- */
  var typeTarget = document.getElementById("type-target");
  var stepsWrap = document.getElementById("t-steps");
  if (typeTarget && stepsWrap) {
    var queries = [
      'ingest invoices/IMG_2041.jpg',
      'ingest exports/pos_august.xlsx',
      'ingest invoices/acme_foods.pdf'
    ];
    var qi = 0;
    var termStarted = false;
    var startTerminal = function () {
      if (termStarted) return;
      termStarted = true;
      runQuery();
    };
    var termObs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      termObs.disconnect();
      startTerminal();
    }, { threshold: 0.5 });
    termObs.observe(document.getElementById("terminal"));
    viewHooks.push({ el: document.getElementById("terminal"), fn: startTerminal });

    function runQuery() {
      var q = queries[qi % queries.length];
      qi++;
      var steps = stepsWrap.querySelectorAll(".t-step");
      steps.forEach(function (s) { s.classList.remove("show"); });
      typeTarget.textContent = "";
      var ci = 0;
      (function typeChar() {
        if (ci <= q.length) {
          typeTarget.textContent = q.slice(0, ci);
          ci++;
          setTimeout(typeChar, reduceMotion ? 0 : 34 + Math.random() * 40);
        } else {
          steps.forEach(function (s, i) {
            setTimeout(function () { s.classList.add("show"); }, 420 * (i + 1));
          });
          setTimeout(runQuery, 420 * steps.length + 3800);
        }
      })();
    }
  }

  /* ---- card hover spotlight + tilt ---- */
  var fine = window.matchMedia("(pointer: fine)").matches;
  document.querySelectorAll(".card, .terminal").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", (x / r.width) * 100 + "%");
      el.style.setProperty("--my", (y / r.height) * 100 + "%");
      if (!reduceMotion && fine && el.classList.contains("tilt")) {
        var rx = ((y / r.height) - 0.5) * -6;
        var ry = ((x / r.width) - 0.5) * 6;
        el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      }
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "";
    });
  });

  /* ---- magnetic buttons ---- */
  if (!reduceMotion && fine) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.18 + "px," + y * 0.22 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---- timeline progress line ---- */
  var tlProgress = document.getElementById("tl-progress");
  var tl = document.querySelector(".timeline");
  if (tlProgress && tl) {
    var onScrollTl = function () {
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.75 - r.top) / r.height;
      tlProgress.style.height = Math.max(0, Math.min(1, progress)) * 100 + "%";
    };
    window.addEventListener("scroll", onScrollTl, { passive: true });
    onScrollTl();
  }

  /* ---- confetti bursts ---- */
  function confetti(x, y) {
    if (reduceMotion) return;
    var colors = ["#c6f542", "#7ef5c0", "#4296f5", "#ffffff", "#febc2e"];
    for (var i = 0; i < 26; i++) {
      var bit = document.createElement("span");
      bit.className = "confetti-bit";
      bit.style.background = colors[i % colors.length];
      bit.style.left = x + "px";
      bit.style.top = y + "px";
      document.body.appendChild(bit);
      var angle = Math.random() * Math.PI * 2;
      var speed = 5 + Math.random() * 9;
      var vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed - 6;
      var rot = Math.random() * 720 - 360;
      bit.animate([
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: "translate(" + vx * 22 + "px," + (vy * 22 + 240) + "px) rotate(" + rot + "deg)", opacity: 0 }
      ], { duration: 900 + Math.random() * 700, easing: "cubic-bezier(0.16,1,0.3,1)" }).onfinish = function () {
        this.effect.target.remove();
      };
    }
  }
  document.querySelectorAll(".nav__cta, .contact__actions .btn, .nav__logo").forEach(function (el) {
    el.addEventListener("click", function (e) { confetti(e.clientX, e.clientY); });
  });

  /* ---- avatar: click spin + confetti ---- */
  var portrait = document.getElementById("portrait");
  if (portrait) {
    var avatarImg = portrait.querySelector("img");
    portrait.addEventListener("click", function (e) {
      confetti(e.clientX, e.clientY);
      if (!reduceMotion) {
        avatarImg.animate(
          [{ transform: "rotate(0) scale(1)" }, { transform: "rotate(360deg) scale(1.12)" }, { transform: "rotate(360deg) scale(1)" }],
          { duration: 800, easing: "cubic-bezier(0.16,1,0.3,1)" }
        );
      }
    });
  }

  /* ---- sweep fallback: catch anything the observers missed ----
     Fast momentum scrolls (especially on touch devices) can skip an
     IntersectionObserver transition; this re-checks on every scroll. */
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < innerHeight * 0.92 && r.bottom > 20;
  }
  var sweepScheduled = false;
  function sweep() {
    sweepScheduled = false;
    document.querySelectorAll(".reveal-up:not(.visible)").forEach(function (el) {
      if (inView(el)) el.classList.add("visible");
    });
    document.querySelectorAll(".mask-words:not(.visible)").forEach(function (el) {
      if (inView(el)) el.classList.add("visible");
    });
    document.querySelectorAll(".section__title").forEach(function (el) {
      if (!el.dataset.scrambled && inView(el)) startScramble(el);
    });
    if (statsEl && !counted && inView(statsEl)) runCounters();
    viewHooks.forEach(function (h) {
      if (inView(h.el)) h.fn();
    });
  }
  function scheduleSweep() {
    if (!sweepScheduled) {
      sweepScheduled = true;
      requestAnimationFrame(sweep);
    }
  }
  window.addEventListener("scroll", scheduleSweep, { passive: true });
  window.addEventListener("resize", scheduleSweep);
  setTimeout(sweep, 600);
  setInterval(sweep, 900);

  /* ---- metro live tiles ---- */
  var tilesWrap = document.getElementById("tiles");
  if (tilesWrap) {
    var tiles = Array.prototype.slice.call(tilesWrap.querySelectorAll(".tile"));
    tiles.forEach(function (t, i) { t.style.setProperty("--tile-i", i); });

    /* live-tile flips: a random tile flips over, flips back later */
    if (!reduceMotion) {
      setInterval(function () {
        if (!tilesWrap.classList.contains("visible")) return;
        var t = tiles[Math.floor(Math.random() * tiles.length)];
        t.classList.add("flipped");
        setTimeout(function () { t.classList.remove("flipped"); }, 2600);
      }, 1900);
    }

    /* WP press-tilt: tilt toward the corner you press/hover */
    tiles.forEach(function (t) {
      function tilt(e) {
        if (reduceMotion) return;
        var r = t.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = "perspective(700px) rotateY(" + x * 14 + "deg) rotateX(" + y * -14 + "deg) scale(0.985)";
      }
      t.addEventListener("mousemove", tilt);
      t.addEventListener("mouseleave", function () { t.style.transform = ""; });
      t.addEventListener("click", function () {
        t.classList.toggle("flipped");
      });
    });
  }

  /* ---- tiny console easter egg ---- */
  if (window.console && console.log) {
    console.log(
      "%c› hi, curious one.\n%c  this site is hand-rolled vanilla JS — view source, it's all here.\n  github.com/yatishGautam",
      "color:#c6f542;font-family:monospace;font-size:14px",
      "color:#9aa3b2;font-family:monospace;font-size:12px"
    );
  }
})();
