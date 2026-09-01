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
  var swaps = ["fun.", "ADHD brains.", "real stores.", "the App Store.", "fun."];
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
  var statsObs = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting || counted) return;
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
  }, { threshold: 0.4 });
  var statsEl = document.querySelector(".stats");
  if (statsEl) statsObs.observe(statsEl);

  /* ---- terminal typing demo ---- */
  var typeTarget = document.getElementById("type-target");
  var stepsWrap = document.getElementById("t-steps");
  if (typeTarget && stepsWrap) {
    var queries = [
      'show payments to Acme over $50k last quarter',
      'wires to Singapore flagged this week?',
      'largest liquidity moves, last 30 days'
    ];
    var qi = 0;
    var termObs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      termObs.disconnect();
      runQuery();
    }, { threshold: 0.5 });
    termObs.observe(document.getElementById("terminal"));

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

  /* ---- tiny console easter egg ---- */
  if (window.console && console.log) {
    console.log(
      "%c› hi, curious one.\n%c  this site is hand-rolled vanilla JS — view source, it's all here.\n  github.com/yatishGautam",
      "color:#c6f542;font-family:monospace;font-size:14px",
      "color:#9aa3b2;font-family:monospace;font-size:12px"
    );
  }
})();
