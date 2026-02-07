(() => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const yearNode = document.getElementById("year");

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const open = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  initReveal();
  initCounters();
  initMagnetic();
  initTilt();
  initParallaxCards();
  initParticleCanvas();

  function initReveal() {
    const nodes = Array.from(document.querySelectorAll(".reveal"));
    if (!nodes.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    nodes.forEach((node, index) => {
      const ownDelay = Number(node.dataset.delay || 0);
      node.style.setProperty("--delay", `${ownDelay || index * 35}ms`);
      observer.observe(node);
    });
  }

  function initCounters() {
    const counters = Array.from(document.querySelectorAll(".stat-value[data-target]"));
    if (!counters.length) {
      return;
    }

    const animateCounter = (el) => {
      if (el.dataset.animated === "true") {
        return;
      }
      el.dataset.animated = "true";

      const target = Number(el.dataset.target || 0);
      const duration = target > 500 ? 1500 : 1250;
      const startAt = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - startAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(eased * target);
        el.textContent = value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          el.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  function initMagnetic() {
    if (!window.matchMedia("(pointer:fine)").matches) {
      return;
    }

    document.querySelectorAll(".magnetic").forEach((node) => {
      node.addEventListener("mousemove", (event) => {
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        node.style.transform = `translate(${px * 12}px, ${py * 9}px)`;
      });

      node.addEventListener("mouseleave", () => {
        node.style.transform = "translate(0, 0)";
      });
    });
  }

  function initTilt() {
    if (!window.matchMedia("(pointer:fine)").matches) {
      return;
    }

    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 8;
        const rotateX = (0.5 - y) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  function initParallaxCards() {
    const stack = document.querySelector(".hero-stack");
    if (!stack || !window.matchMedia("(pointer:fine)").matches) {
      return;
    }

    const cards = Array.from(stack.querySelectorAll("[data-parallax]"));
    if (!cards.length) {
      return;
    }

    stack.addEventListener("mousemove", (event) => {
      const rect = stack.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card) => {
        const depth = Number(card.dataset.parallax || 0.2);
        card.style.setProperty("--offset-x", `${x * depth * 34}px`);
        card.style.setProperty("--offset-y", `${y * depth * 26}px`);
      });
    });

    stack.addEventListener("mouseleave", () => {
      cards.forEach((card) => {
        card.style.setProperty("--offset-x", "0px");
        card.style.setProperty("--offset-y", "0px");
      });
    });
  }

  function initParticleCanvas() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];

    const makeParticles = () => {
      const count = reduceMotion ? 24 : Math.min(68, Math.round((width * height) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (reduceMotion ? 0.12 : 0.28),
        vy: (Math.random() - 0.5) * (reduceMotion ? 0.12 : 0.28),
        r: Math.random() * 1.8 + 0.4
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= width) {
          p.vx *= -1;
        }
        if (p.y <= 0 || p.y >= height) {
          p.vy *= -1;
        }

        context.beginPath();
        context.fillStyle = "rgba(25, 87, 121, 0.28)";
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fill();

        if (reduceMotion) {
          continue;
        }

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 130) {
            continue;
          }
          context.beginPath();
          context.strokeStyle = `rgba(21, 132, 142, ${(1 - dist / 130) * 0.16})`;
          context.lineWidth = 1;
          context.moveTo(p.x, p.y);
          context.lineTo(q.x, q.y);
          context.stroke();
        }
      }

      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
  }
})();
