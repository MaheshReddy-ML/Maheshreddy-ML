const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".project-card");
const marquee = document.querySelector(".marquee div");
const pageTurn = document.createElement("div");
const introGate = document.querySelector(".intro-gate");
const introVideo = document.querySelector(".intro-video");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCompactViewport = window.matchMedia("(max-width: 640px)").matches;
const pageTurnDuration = isCompactViewport ? 760 : 1180;
const introDuration = 8000;

pageTurn.className = "page-turn";
pageTurn.setAttribute("aria-hidden", "true");
pageTurn.innerHTML = `
  <div class="page-turn-book">
    <div class="book-page book-left">
      <span class="book-label">current chart</span>
      <strong>Mahesh Reddy</strong>
      <em>AI / ML route archive</em>
      <i></i>
    </div>
    <div class="book-page turn-leaf">
      <div class="leaf-face leaf-front">
        <span class="book-label">turning folio</span>
        <strong class="turn-title">Opening route</strong>
        <em class="turn-route">The next map is being unfolded</em>
        <i></i>
      </div>
      <div class="leaf-face leaf-back">
        <span class="book-label">reverse side</span>
        <strong class="turn-back-title">Marked passage</strong>
        <em class="turn-back-route">Projects · Research · Expertise · Contact</em>
        <i></i>
      </div>
    </div>
  </div>
`;
document.body.appendChild(pageTurn);
document.body.classList.add("page-arrive");

window.setTimeout(() => document.body.classList.remove("page-arrive"), 760);
window.addEventListener("pageshow", () => {
  pageTurn.classList.remove("active");
  document.body.classList.remove("turning-page");
});

if (marquee) {
  marquee.innerHTML += marquee.innerHTML;
}

if (introGate) {
  let introClosed = false;

  const openHome = () => {
    if (introClosed) return;
    introClosed = true;
    document.body.classList.remove("intro-active");
    introGate.classList.add("intro-gate--hidden");
    if (introVideo) introVideo.pause();
    window.setTimeout(() => introGate.remove(), 520);
  };

  const playIntro = () => {
    if (!introVideo) return;
    introVideo.currentTime = 0;
    const playback = introVideo.play();
    if (playback) playback.catch(() => {});
  };

  introGate.addEventListener("pointerdown", openHome, { once: true });
  introGate.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter" || event.key === " ") openHome();
    },
    { once: true }
  );

  if (introVideo) {
    introVideo.addEventListener("loadedmetadata", playIntro, { once: true });
    introVideo.addEventListener("timeupdate", () => {
      if (introVideo.currentTime >= introDuration / 1000) openHome();
    });
  }

  window.setTimeout(openHome, introDuration);
}

revealItems.forEach((item) => {
  const delay = item.dataset.delay;
  if (delay) item.style.setProperty("--delay", `${delay}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      const duration = 1100;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

counters.forEach((counter) => countObserver.observe(counter));

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    document.body.classList.add("ink-settle");
    window.setTimeout(() => document.body.classList.remove("ink-settle"), 380);

    cards.forEach((card) => {
      const tags = card.dataset.tags || "";
      card.classList.toggle("hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank" ||
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    let destination;
    try {
      destination = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (destination.origin !== window.location.origin) return;

    const isHtmlRoute =
      destination.pathname.endsWith("/") ||
      destination.pathname.endsWith(".html") ||
      destination.pathname === window.location.pathname;

    if (!isHtmlRoute) return;

    if (prefersReducedMotion) {
      return;
    }

    event.preventDefault();
    pageTurn.classList.remove("active");
    void pageTurn.offsetWidth;

    const title = pageTurn.querySelector(".turn-title");
    const route = pageTurn.querySelector(".turn-route");
    const backTitle = pageTurn.querySelector(".turn-back-title");
    const backRoute = pageTurn.querySelector(".turn-back-route");
    const cleanLabel = link.textContent.trim() || "Opening route";
    const cleanPath = destination.pathname.split("/").filter(Boolean).pop() || "index.html";
    const readableRoute = cleanPath.replace(".html", "").replaceAll("-", " ");
    if (title) title.textContent = cleanLabel;
    if (route) route.textContent = readableRoute;
    if (backTitle) backTitle.textContent = "Arriving at";
    if (backRoute) backRoute.textContent = readableRoute;

    pageTurn.classList.add("active");
    document.body.classList.add("turning-page");

    window.setTimeout(() => {
      window.location.assign(destination.href);
    }, pageTurnDuration);
  });
});
