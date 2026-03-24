'use strict';

/**
 * Add event listener on multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};


/**
 * NAVBAR
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

if (navbar && navTogglers.length && overlay) {
  const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
  };

  addEventOnElements(navTogglers, "click", toggleNavbar);
}


/**
 * HEADER & BACK TO TOP BTN
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

if (header && backTopBtn) {
  let lastScrollPos = 0;

  const hideHeader = function () {
    const isScrollBottom = lastScrollPos < window.scrollY;

    if (isScrollBottom) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }

    lastScrollPos = window.scrollY;
  };

  window.addEventListener("scroll", function () {
    if (window.scrollY >= 50) {
      header.classList.add("active");
      backTopBtn.classList.add("active");
      hideHeader();
    } else {
      header.classList.remove("active");
      header.classList.remove("hide");
      backTopBtn.classList.remove("active");
    }
  });
}


/**
 * HERO BG GIF HOVER
 * cambia el gif del fondo al pasar sobre cada bloque del hero
 */
(function () {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const activeImg = hero.querySelector("[data-hero-bg-active]");
  const nextImg = hero.querySelector("[data-hero-bg-next]");
  const items = hero.querySelectorAll("[data-hero-item][data-hero-gif]");

  if (!activeImg || !nextImg || !items.length) return;

  const defaultSrc = hero.dataset.heroDefault;
  if (!defaultSrc) return;

  activeImg.src = defaultSrc;
  nextImg.src = defaultSrc;

  let current = defaultSrc;
  let animating = false;

  const preload = (src) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  };

  preload(defaultSrc);
  items.forEach((item) => preload(item.dataset.heroGif));

  const changeGif = (src) => {
    if (!src || src === current || animating) return;

    animating = true;
    nextImg.src = src;
    nextImg.classList.add("is-visible");

    const handleTransitionEnd = () => {
      activeImg.src = src;
      nextImg.classList.remove("is-visible");
      current = src;
      animating = false;
      nextImg.removeEventListener("transitionend", handleTransitionEnd);
    };

    nextImg.addEventListener("transitionend", handleTransitionEnd);
  };

  const resetGif = () => {
    changeGif(defaultSrc);
  };

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      changeGif(item.dataset.heroGif);
    });

    item.addEventListener("mouseleave", () => {
      resetGif();
    });

    item.addEventListener("focusin", () => {
      changeGif(item.dataset.heroGif);
    });

    item.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!item.contains(document.activeElement)) {
          resetGif();
        }
      });
    });
  });
})();
/**
 * ARTEFACTOS CARDS (hover suave con crossfade)
 * Requiere:
 *  - card con data-artefacto-hover="ruta-hover.jpg"
 *  - img base dentro con data-artefacto-img
 */
(function () {
  const cards = document.querySelectorAll("[data-artefacto-hover]");
  if (!cards.length) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  cards.forEach((card) => {
    const frame = card.querySelector(".artefactos-frame");
    const baseImg = card.querySelector("[data-artefacto-img]");
    const hoverSrc = card.dataset.artefactoHover;

    if (!frame || !baseImg || !hoverSrc) return;

    // evita duplicar si el script corre más de una vez
    if (frame.querySelector(".artefactos-img-hover")) return;

    const hoverImg = document.createElement("img");
    hoverImg.className = "artefactos-img artefactos-img-hover";
    hoverImg.src = hoverSrc;
    hoverImg.alt = "";
    hoverImg.setAttribute("aria-hidden", "true");
    hoverImg.loading = "lazy";
    hoverImg.decoding = "async";

    const pre = new Image();
    pre.src = hoverSrc;

    frame.appendChild(hoverImg);

    if (!canHover) return;

    const showHover = () => {
      card.classList.add("is-hovered");
    };

    const hideHover = () => {
      card.classList.remove("is-hovered");
    };

    card.addEventListener("mouseenter", showHover);
    card.addEventListener("mouseleave", hideHover);
    card.addEventListener("focusin", showHover);
    card.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!card.contains(document.activeElement)) hideHover();
      });
    });
  });
})();

/**
 * TIMELINE 
 */

(function () {
  const blocks = document.querySelectorAll("[data-timeline]");
  if (!blocks.length) return;

  const updateOne = (block) => {
    const wrap = block.querySelector(".timeline-wrap");
    const rail = block.querySelector(".timeline-rail");
    const steps = Array.from(block.querySelectorAll(".timeline-step[data-step]"));
    if (!wrap || !rail || !steps.length) return;

    const fromKey = block.dataset.from;
    const toKey = block.dataset.to;

    const fromEl = block.querySelector(`.timeline-step[data-step="${fromKey}"]`);
    const toEl = block.querySelector(`.timeline-step[data-step="${toKey}"]`);
    if (!fromEl || !toEl) return;

    const fromIndex = steps.findIndex((step) => step.dataset.step === fromKey);
    const toIndex = steps.findIndex((step) => step.dataset.step === toKey);

    if (fromIndex === -1 || toIndex === -1) return;

    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);

    steps.forEach((step, index) => {
      step.classList.toggle("is-in-range", index >= start && index <= end);
    });

    const wrapRect = wrap.getBoundingClientRect();
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();

    const y1 = (a.top - wrapRect.top) + (a.height / 2);
    const y2 = (b.top - wrapRect.top) + (b.height / 2);

    const top = Math.min(y1, y2);
    const bottom = Math.max(y1, y2);

    wrap.style.setProperty("--y1", `${top}px`);
    wrap.style.setProperty("--y2", `${bottom}px`);
  };

  const updateAll = () => blocks.forEach(updateOne);

  updateAll();

  let t = null;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(updateAll, 120);
  });
})();

/**
 * MARCOS CAROUSEL
 * mobile: avanza 1 pareja
 * desktop: avanza 2 parejas
 */
(function () {
  const root = document.querySelector("[data-marcos]");
  if (!root) return;

  const viewport = root.querySelector("[data-marcos-viewport]");
  const track = root.querySelector("[data-marcos-track]");
  const prevBtn = root.querySelector("[data-marcos-prev]");
  const nextBtn = root.querySelector("[data-marcos-next]");
  if (!viewport || !track || !prevBtn || !nextBtn) return;

  const originals = Array.from(track.children);
  const N = originals.length;
  if (N < 2) return;

  const getStep = () => {
    const isDesktop = window.matchMedia("(min-width: 1200px)").matches;
    return isDesktop
      ? Number(root.dataset.stepDesktop || 1)
      : Number(root.dataset.stepMobile || 1);
  };

  const cloneSet = () => {
    const frag = document.createDocumentFragment();
    originals.forEach((el) => {
      const clone = el.cloneNode(true);
      clone.setAttribute("data-clone", "1");
      frag.appendChild(clone);
    });
    return frag;
  };

  track.prepend(cloneSet());
  track.append(cloneSet());

  const kids = () => Array.from(track.children);
  const startIndex = N;

  let realPos = 0;
  let settleTimer = null;

  const scrollToIdx = (idx, behavior = "smooth") => {
    const el = kids()[idx];
    if (!el) return;
    viewport.scrollTo({ left: el.offsetLeft, behavior });
  };

  const nearestIndex = () => {
    const sl = viewport.scrollLeft;
    const arr = kids();
    let best = 0;
    let bestDist = Infinity;

    for (let i = 0; i < arr.length; i++) {
      const d = Math.abs(arr[i].offsetLeft - sl);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }

    return best;
  };

  const normalizeToMiddle = () => {
    const idx = nearestIndex();
    let norm = idx;

    if (norm < startIndex) norm += N;
    if (norm >= startIndex + N) norm -= N;

    realPos = norm - startIndex;
    scrollToIdx(norm, "auto");
  };

  const goByDelta = (delta) => {
    const rawTarget = startIndex + realPos + delta;

    scrollToIdx(rawTarget, "smooth");

    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      normalizeToMiddle();
    }, 520);
  };

  requestAnimationFrame(() => {
    scrollToIdx(startIndex, "auto");
    realPos = 0;
  });

  nextBtn.addEventListener("click", () => {
    goByDelta(getStep());
  });

  prevBtn.addEventListener("click", () => {
    goByDelta(-getStep());
  });

  let userDebounce = null;
  viewport.addEventListener("scroll", () => {
    clearTimeout(userDebounce);
    userDebounce = setTimeout(() => {
      normalizeToMiddle();
    }, 180);
  });

  window.addEventListener("resize", () => {
    clearTimeout(userDebounce);
    userDebounce = setTimeout(() => {
      scrollToIdx(startIndex + realPos, "auto");
    }, 120);
  });
})();

/**
 * MARCOS - hover image swap
 * Requiere:
 * - img base con data-marco-hover="ruta-hover.jpg"
 * - dentro de .marco-photo
 */
(function () {
  const baseImgs = document.querySelectorAll(".marcos .marco-photo img[data-marco-hover]");
  if (!baseImgs.length) return;

  baseImgs.forEach((baseImg) => {
    const frame = baseImg.closest(".marco-photo");
    const hoverSrc = baseImg.dataset.marcoHover;

    if (!frame || !hoverSrc) return;
    if (frame.querySelector(".marco-hover-img")) return;

    const hoverImg = document.createElement("img");
    hoverImg.className = "marco-hover-img";
    hoverImg.src = hoverSrc;
    hoverImg.alt = baseImg.alt || "";
    hoverImg.loading = "lazy";
    hoverImg.decoding = "async";
    hoverImg.setAttribute("data-lightbox", "");

    if (baseImg.dataset.caption) {
      hoverImg.dataset.caption = baseImg.dataset.caption;
    }

    const pre = new Image();
    pre.src = hoverSrc;

    frame.appendChild(hoverImg);
  });
})();

/**
 * LIGHTBOX
 * click en imagen con data-lightbox => abre imagen grande + caption
 */
(function () {
  const modal = document.querySelector("[data-lightbox-modal]");
  if (!modal) return;

  const imgEl = modal.querySelector("[data-lightbox-img]");
  const captionEl = modal.querySelector("[data-lightbox-caption]");
  const closeBtn = modal.querySelector("[data-lightbox-close]");
  if (!imgEl || !closeBtn) return;

  const close = () => {
    modal.hidden = true;
    imgEl.src = "";
    imgEl.alt = "";
    if (captionEl) captionEl.textContent = "";
  };

  document.addEventListener("click", (e) => {
    const img = e.target.closest("img[data-lightbox]");
    if (!img) return;

    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || "";
    if (captionEl) captionEl.textContent = img.dataset.caption || "";
    modal.hidden = false;
  });

  closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();

/**
 * VISUALIZADOR (30 fotos) - filtros multi-select
 */
(function () {
  const section = document.querySelector("[data-viz]");
  if (!section) return;

  const buttons = section.querySelectorAll("[data-viz-filter]");
  const items = section.querySelectorAll("[data-viz-item]");
  if (!buttons.length || !items.length) return;

  const active = new Set();

  const setBtnState = (btn, on) => {
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  };

  const apply = () => {
    // si no hay filtros activos => mostrar todo
    if (active.size === 0) {
      items.forEach((it) => it.classList.remove("is-hidden"));
      return;
    }

    items.forEach((it) => {
      const cat = it.dataset.cat;
      it.classList.toggle("is-hidden", !active.has(cat));
    });
  };

  const allBtn = section.querySelector('[data-viz-filter="all"]');

  buttons.forEach((btn) => {
    const key = btn.dataset.vizFilter;

    btn.addEventListener("click", () => {
      if (key === "all") {
        active.clear();
        buttons.forEach((b) => {
          if (b.dataset.vizFilter !== "all") setBtnState(b, false);
        });
        setBtnState(btn, true);
        apply();
        return;
      }

      if (allBtn) setBtnState(allBtn, false);

      if (active.has(key)) {
        active.delete(key);
        setBtnState(btn, false);
      } else {
        active.add(key);
        setBtnState(btn, true);
      }

      // si quedas sin filtros activos => vuelve a "Todas"
      if (active.size === 0 && allBtn) setBtnState(allBtn, true);

      apply();
    });
  });

  apply();
})();


/**
 * VISUALIZADOR - hover image swap
 * Requiere:
 * - img base con data-viz-hover="ruta-hover.jpg"
 * - dentro de .viz-card
 */
(function () {
  const baseImgs = document.querySelectorAll(".viz-card img[data-viz-hover]");
  if (!baseImgs.length) return;

  baseImgs.forEach((baseImg) => {
    const card = baseImg.closest(".viz-card");
    const hoverSrc = baseImg.dataset.vizHover;

    if (!card || !hoverSrc) return;
    if (card.querySelector(".viz-hover-img")) return;

    const hoverImg = document.createElement("img");
    hoverImg.className = "viz-hover-img";
    hoverImg.src = hoverSrc;
    hoverImg.alt = baseImg.alt || "";
    hoverImg.loading = "lazy";
    hoverImg.decoding = "async";
    hoverImg.setAttribute("data-lightbox", "");

    if (baseImg.dataset.caption) {
      hoverImg.dataset.caption = baseImg.dataset.caption;
    }

    const pre = new Image();
    pre.src = hoverSrc;

    card.appendChild(hoverImg);
  });
})();

/**
 * SLIDER MIXTO (scroll + flechas)
 */
(function () {
  const root = document.querySelector("[data-mix]");
  if (!root) return;

  const viewport = root.querySelector("[data-mix-viewport]");
  const track = root.querySelector("[data-mix-track]");
  const prevBtn = root.querySelector("[data-mix-prev]");
  const nextBtn = root.querySelector("[data-mix-next]");
  if (!viewport || !track || !prevBtn || !nextBtn) return;

  const getStep = () => {
    const first = track.querySelector(".mix-card");
    if (!first) return 300;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return first.getBoundingClientRect().width + gap;
  };

  const scrollByStep = (dir) => {
    viewport.scrollBy({ left: dir * getStep(), behavior: "smooth" });
  };

  nextBtn.addEventListener("click", () => scrollByStep(1));
  prevBtn.addEventListener("click", () => scrollByStep(-1));
})();

/**
 * MIX - hover image swap
 * Requiere:
 * - img base con data-mix-hover="ruta-hover.jpg/png"
 * - dentro de .mix-card
 */
(function () {
  const baseImgs = document.querySelectorAll(".mix-card img[data-mix-hover]");
  if (!baseImgs.length) return;

  baseImgs.forEach((baseImg) => {
    const card = baseImg.closest(".mix-card");
    const hoverSrc = baseImg.dataset.mixHover;

    if (!card || !hoverSrc) return;
    if (card.querySelector(".mix-hover-img")) return;

    const hoverImg = document.createElement("img");
    hoverImg.className = "mix-hover-img";
    hoverImg.src = hoverSrc;
    hoverImg.alt = baseImg.alt || "";
    hoverImg.loading = "lazy";
    hoverImg.decoding = "async";
    hoverImg.setAttribute("data-lightbox", "");

    if (baseImg.dataset.caption) {
      hoverImg.dataset.caption = baseImg.dataset.caption;
    }

    const pre = new Image();
    pre.src = hoverSrc;

    card.appendChild(hoverImg);
  });
})();