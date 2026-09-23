'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/shims/navigation';
import { createPortal } from 'react-dom';
import { PawPrint } from 'lucide-react';
import { kinds, Pet, personalities, type Kind } from '@/lib/pets/engine';
import './pet-world.css';
type Preferences = {
  paused: boolean;
  hidden: boolean;
  follow: boolean;
  quiet: boolean;
  reduced: boolean;
};
const initial: Preferences = {
  paused: false,
  hidden: false,
  follow: false,
  quiet: false,
  reduced: false,
};
export default function PetWorld({
  kind = 'cat',
  small = false,
}: {
  kind?: Kind;
  small?: boolean;
}) {
  const path = usePathname();
  const [prefs, setPrefs] = useState(initial);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const selected = kind;
  const [status, setStatus] = useState('');
  const stage = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const pets = useRef<Pet[]>([]);
  const actions = useRef<(action: string) => void>(() => {});
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem('notebook-pets') || '{}');
        setPrefs(
          Object.fromEntries(
            Object.entries(initial).map(([key, value]) => [
              key,
              typeof saved[key] === 'boolean' ? saved[key] : value,
            ]),
          ) as Preferences,
        );
      } catch {
        /* Private browsing and malformed storage use safe defaults. */
      }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem('notebook-pets', JSON.stringify(prefs));
    } catch {
      /* Optional preference persistence. */
    }
  }, [prefs, ready]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.current?.querySelector('#pet-menu')) {
        setOpen(false);
        menu.current?.querySelector<HTMLButtonElement>('.pet-toggle')?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  useEffect(() => {
    if (!ready || prefs.hidden || !stage.current) return;
    const root = stage.current;
    const layer = document.createElement('div');
    layer.className = 'pet-roaming-layer';
    document.body.appendChild(layer);
    let homeX = 0,
      homeY = 0;
    let scale = 1,
      worldWidth = root.clientWidth,
      inView = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(max-width: 700px), (pointer: coarse)');
    let calm = prefs.reduced || reduced.matches;
    let stopped = false,
      raf = 0,
      previous = 0,
      lastPaint = 0;
    let pointer = { x: -1000, y: 0, speed: 0, follow: false };
    let lastPointer = 0,
      lastX = 0,
      lastY = 0;
    let drag: {
      pet: Pet;
      node: HTMLButtonElement;
      id: number;
      x: number;
      y: number;
      ox: number;
      oy: number;
      moved: boolean;
      started: number;
    } | null = null;
    let stroked = 0,
      hovered: Pet | null = null,
      longPress: ReturnType<typeof setTimeout> | undefined;
    const sheet = new Image();
    sheet.src = '/pets/notebook-pets.webp';
    const records: {
      pet: Pet;
      node: HTMLButtonElement;
      canvas: HTMLCanvasElement;
      bubble: HTMLSpanElement;
    }[] = [];
    function build() {
      layer.replaceChildren();
      records.length = 0;
      const size = Math.min(
        root.clientWidth * 0.62,
        small ? 165 : kind === 'cat' ? 250 : 170,
      );
      scale = Math.max(1, size / 72);
      worldWidth = innerWidth / scale;
      const anchor = root.getBoundingClientRect();
      homeX = (anchor.left + anchor.width / 2) / scale;
      homeY = (anchor.bottom + scrollY - size / 2 - 5) / scale;
      pets.current = [
        pets.current.find((p) => p.kind === kind) ||
          Object.assign(new Pet(kind, homeX), {
            groundY: homeY,
            targetY: homeY,
          }),
      ];
      for (const pet of pets.current) {
        pet.x = Math.max(36, Math.min(worldWidth - 36, pet.x));
        pet.target = Math.max(36, Math.min(worldWidth - 36, pet.target));
        const node = document.createElement('button');
        node.type = 'button';
        node.className = 'living-pet';
        node.dataset.kind = pet.kind;
        node.style.width = `${72 * scale}px`;
        node.style.height = `${72 * scale}px`;
        node.setAttribute(
          'aria-label',
          `Pet ${pet.kind}; arrow keys move, Enter pets, W wakes`,
        );
        const canvas = document.createElement('canvas');
        canvas.width = 192;
        canvas.height = 192;
        canvas.setAttribute('aria-hidden', 'true');
        const bubble = document.createElement('span');
        bubble.className = 'pet-thought';
        bubble.setAttribute('aria-hidden', 'true');
        node.appendChild(canvas);
        node.appendChild(bubble);
        layer.appendChild(node);
        records.push({ pet, node, canvas, bubble });
        node.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 || prefs.paused || calm) return;
          drag = {
            pet,
            node,
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY + scrollY,
            ox: pet.x,
            oy: pet.groundY + pet.y,
            moved: false,
            started: performance.now(),
          };
          node.setPointerCapture(e.pointerId);
          longPress = setTimeout(() => {
            if (drag && !drag.moved) {
              pet.pet();
              setStatus(`${pet.kind} is purring.`);
            }
          }, 550);
        });
        const release = (e: PointerEvent) => {
          if (!drag || drag.id !== e.pointerId) return;
          clearTimeout(longPress);
          const shortClick =
            e.type === 'pointerup' &&
            !drag.moved &&
            performance.now() - drag.started < 550;
          if (drag.moved) {
            pet.vy = 0;
            pet.y = -8;
            pet.target = pet.x;
            pet.targetY = pet.groundY;
            pet.enter('dropping');
          } else if (performance.now() - drag.started < 550)
            pet.enter('curious');
          drag = null;
          paint();
          if (node.hasPointerCapture(e.pointerId))
            node.releasePointerCapture(e.pointerId);
          if (shortClick) forwardUnderlyingClick(e);
        };
        node.addEventListener('click', (e) => {
          if (e.detail > 0 && (prefs.paused || calm)) forwardUnderlyingClick(e);
        });
        node.addEventListener('pointerup', release);
        node.addEventListener('pointercancel', release);
        node.addEventListener('lostpointercapture', release);
        node.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pet.pet();
            setStatus(`${pet.kind} feels loved.`);
          }
          if (e.key.toLowerCase() === 'w') {
            pet.wake();
            setStatus(`${pet.kind} is awake.`);
          }
          if (
            [
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              'Home',
            ].includes(e.key)
          ) {
            e.preventDefault();
            if (e.key === 'Home') {
              pet.x = homeX;
              pet.groundY = homeY;
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
              pet.groundY = Math.max(
                36,
                Math.min(
                  document.documentElement.scrollHeight / scale - 36,
                  pet.groundY + (e.key === 'ArrowUp' ? -24 : 24),
                ),
              );
            else
              pet.x = Math.max(
                36,
                Math.min(
                  worldWidth - 36,
                  pet.x + (e.key === 'ArrowLeft' ? -24 : 24),
                ),
              );
            pet.targetY = pet.groundY;
            pet.target = pet.x;
          }
          paint();
        });
        node.addEventListener('pointerenter', () => {
          hovered = pet;
          stroked = 0;
        });
        node.addEventListener('pointerleave', () => {
          hovered = null;
          stroked = 0;
        });
      }
      paint();
    }
    function forwardUnderlyingClick(event: MouseEvent) {
      const target = document
        .elementsFromPoint(event.clientX, event.clientY)
        .filter(
          (element) => !element.closest('.pet-roaming-layer, .pet-controls'),
        )
        .map((element) =>
          element.closest<HTMLElement>(
            'a,button,input,textarea,select,summary,[role="button"]',
          ),
        )
        .find(
          (element) =>
            element && !element.matches(':disabled,[aria-disabled="true"]'),
        );
      if (!target) return;
      target.focus({ preventScroll: true });
      target.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: event.clientX,
          clientY: event.clientY,
          button: event.button,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
        }),
      );
    }
    function blocked(x: number, y: number, radius = 0) {
      return [
        [x, y],
        [x - radius, y],
        [x + radius, y],
        [x, y - radius],
        [x, y + radius],
      ].some(([px, py]) =>
        document
          .elementsFromPoint(px, py)
          .some(
            (e) =>
              !e.closest('.pet-roaming-layer, .pet-controls, .pet-scene') &&
              e.closest(
                'a,button,input,textarea,select,nav,p,h1,h2,h3,label,pre,code',
              ),
          ),
      );
    }
    function scrollVisibility() {
      if (lastPointer) {
        pointer.y = (lastY + scrollY) / scale;
        pointer.follow = prefs.follow && canFollowAt(lastX, lastY);
      }
      inView = pets.current.some(
        (p) =>
          (p.groundY + 36) * scale > scrollY &&
          (p.groundY - 36) * scale < scrollY + innerHeight,
      );
      cancelAnimationFrame(raf);
      previous = 0;
      paint();
      if ((inView || prefs.follow) && !document.hidden)
        raf = requestAnimationFrame(animate);
    }
    function paint() {
      for (const { pet, node, canvas, bubble } of records) {
        const roaming =
          Math.hypot(pet.x - homeX, pet.groundY - homeY) * scale > 45;
        const shrink = roaming ? 0.6 : 1;
        const centerX = pet.x * scale,
          centerY = (pet.groundY + pet.y) * scale;
        node.style.transform = `translate3d(${centerX - 36 * scale}px,${centerY - 36 * scale}px,0) scale(${shrink})`;
        node.dataset.roaming = String(roaming);
        root.parentElement?.setAttribute('data-roaming', String(roaming));
        const pointerInside =
          Math.abs(lastX - centerX) < 36 * scale * shrink &&
          Math.abs(lastY - (centerY - scrollY)) < 36 * scale * shrink;
        const overlaps =
          !drag &&
          (blocked(centerX, centerY - scrollY, 30 * scale * shrink) ||
            (pointerInside && blocked(lastX, lastY)));
        // Keep the pet visible and grabbable even above content. Short clicks
        // activate underlying controls; a drag or long press belongs to the pet.
        node.style.pointerEvents = 'auto';
        node.style.opacity = '1';
        node.dataset.state = pet.state;
        node.dataset.following = String(pet.following);
        bubble.textContent =
          prefs.quiet || calm || prefs.paused || overlaps
            ? ''
            : pet.state === 'investigating'
              ? pet.thought
              : pet.state === 'sleeping'
                ? 'z z z'
                : ['petting', 'happy'].includes(pet.state)
                  ? '♡'
                  : '';
        const ctx = canvas.getContext('2d');
        if (!ctx || !sheet.complete || !sheet.naturalWidth) continue;
        ctx.clearRect(0, 0, 192, 192);
        ctx.save();
        const breathing =
          calm || prefs.paused ? 0 : Math.sin(pet.elapsed * 2) * 1.4;
        ctx.translate(96, 96 + breathing);
        ctx.scale(pet.facing, 1);
        if (!calm && !prefs.paused && ['curious', 'alert'].includes(pet.state))
          ctx.rotate(pet.look * 0.065);
        const w = sheet.naturalWidth / 8;
        const rows = [0, 212, 424, 622, 806, 992];
        const row = kinds.indexOf(pet.kind),
          top = rows[row],
          h = rows[row + 1] - top;
        ctx.drawImage(
          sheet,
          pet.sprite(calm) * w,
          top,
          w,
          h,
          -96,
          -96,
          192,
          192,
        );
        if (
          pet.kind === 'cat' &&
          pet.sprite(calm) === 0 &&
          !calm &&
          !prefs.paused
        ) {
          const blink = pet.age > 1 && pet.age % 2.8 > 2.6;
          for (const eye of [-21, 16]) {
            if (blink) {
              ctx.fillStyle = '#efd4a6';
              ctx.beginPath();
              ctx.ellipse(eye, 2, 10, 11, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#292b29';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(eye - 6, 2);
              ctx.quadraticCurveTo(eye, 6, eye + 6, 2);
              ctx.stroke();
              continue;
            }
            ctx.fillStyle = '#292b29';
            ctx.beginPath();
            ctx.ellipse(eye + pet.look * 2.5, 2, 3, 5, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // Tiny curious head lean and breathing are driven by the simulation clock.
        node.style.cursor = pet.state === 'dragging' ? 'grabbing' : 'grab';
        ctx.restore();
      }
    }
    function animate(now: number) {
      if (stopped || document.hidden || (!inView && !prefs.follow)) return;
      const dt = previous ? (now - previous) / 1000 : 0;
      previous = now;
      if (!prefs.paused && !calm) {
        if (now - lastPointer > 300) pointer.speed = 0;
        for (const pet of pets.current) {
          if (drag?.pet === pet && drag.moved) continue;
          const before = pet.state;
          pet.tick(
            dt,
            worldWidth,
            mobile.matches ? undefined : pointer,
            document.documentElement.scrollHeight / scale,
          );
          if (before === 'curious' && pet.state === 'walking') {
            pet.targetY =
              (scrollY + 100 + Math.random() * Math.max(0, innerHeight - 200)) /
              scale;
          }
        }
      }
      if (now - lastPaint >= 1000 / 30) {
        paint();
        lastPaint = now;
      }
      if (!prefs.paused && !calm) raf = requestAnimationFrame(animate);
    }
    function canFollowAt(x: number, y: number) {
      return !document
        .elementsFromPoint(x, y)
        .some(
          (element) =>
            !element.closest('.pet-roaming-layer') &&
            element.closest(
              'a, button, input, textarea, select, nav, label, summary, [role="button"], .pet-controls',
            ),
        );
    }
    const move = (e: PointerEvent) => {
      if (!inView && !drag && !prefs.follow) return;
      const now = performance.now(),
        elapsed = now - lastPointer;
      const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      const safe = canFollowAt(e.clientX, e.clientY);
      pointer = {
        x: e.clientX / scale,
        y: (e.clientY + scrollY) / scale,
        speed: elapsed > 0 && elapsed < 200 ? (distance / elapsed) * 1000 : 0,
        follow: prefs.follow && safe,
      };
      if (!safe) pointer.speed = 0;
      lastPointer = now;
      lastX = e.clientX;
      lastY = e.clientY;
      if (drag) {
        if (Math.hypot(e.clientX - drag.x, e.clientY + scrollY - drag.y) > 7) {
          drag.moved = true;
          clearTimeout(longPress);
          drag.pet.enter('dragging');
        }
        if (drag.moved) {
          drag.pet.x = Math.max(
            36,
            Math.min(worldWidth - 36, drag.ox + (e.clientX - drag.x) / scale),
          );
          // Document coordinates let a captured pointer carry the pet anywhere on the page.
          drag.pet.groundY = Math.max(
            36,
            Math.min(
              document.documentElement.scrollHeight / scale - 36,
              drag.oy + (e.clientY + scrollY - drag.y) / scale,
            ),
          );
          drag.pet.y = 0;
          // Edge scrolling works while dragging; touch scrolling elsewhere stays native.
          if (e.clientY < 45) window.scrollBy(0, -18);
          else if (e.clientY > innerHeight - 45) window.scrollBy(0, 18);
          paint();
        }
      } else if (
        hovered &&
        pointer.speed > 8 &&
        pointer.speed < 240 &&
        elapsed < 180 &&
        !prefs.paused &&
        !calm
      ) {
        stroked += elapsed;
        if (stroked > 650) {
          hovered.pet();
          stroked = 0;
        }
      } else stroked = 0;
    };
    const visibility = () => {
      cancelAnimationFrame(raf);
      previous = 0;
      if (!document.hidden) {
        paint();
        raf = requestAnimationFrame(animate);
      }
    };
    const motion = () => {
      calm = prefs.reduced || reduced.matches;
      cancelAnimationFrame(raf);
      previous = 0;
      paint();
      if (!calm && !prefs.paused) raf = requestAnimationFrame(animate);
    };
    const resize = () => {
      if (drag) {
        drag.pet.y = 0;
        drag.pet.enter('recovering');
        drag = null;
        clearTimeout(longPress);
      }
      build();
      viewportObserver.disconnect();
      for (const record of records) viewportObserver.observe(record.node);
    };
    actions.current = (action) => {
      const pet =
        pets.current.find((p) => p.kind === selected) || pets.current[0];
      if (!pet) return;
      if (action === 'call') {
        let point = { x: innerWidth - 80, y: innerHeight / 2 };
        outer: for (let y = 130; y < innerHeight - 70; y += 65)
          for (let x = 36 * scale; x < innerWidth - 36 * scale; x += 70) {
            if (!blocked(x, y, 30 * scale * 0.6)) {
              point = { x, y };
              break outer;
            }
          }
        pet.x = Math.max(36, Math.min(worldWidth - 36, point.x / scale));
        pet.groundY = (scrollY + point.y) / scale;
        pet.target = pet.x;
        pet.targetY = pet.groundY;
        pet.y = 0;
        pet.wake();
        scrollVisibility();
      }
      if (action === 'pet') pet.pet();
      if (action === 'wake') pet.wake();
      if (action === 'move') {
        pet.x = Math.min(
          worldWidth - 36,
          Math.max(36, pet.x + (pet.x > worldWidth / 2 ? -70 : 70)),
        );
        pet.target = pet.x;
      }
      setStatus(
        action === 'call'
          ? `${pet.kind} is here.`
          : action === 'pet'
            ? `${pet.kind} feels loved.`
            : action === 'wake'
              ? `${pet.kind} is awake.`
              : `${pet.kind} moved to a new spot.`,
      );
      paint();
    };
    const react = (
      label: string,
      x: number,
      force = false,
      y = pets.current[0]?.groundY || homeY,
    ) => {
      if (prefs.paused || calm || (prefs.follow && !force)) return;
      const text = label.toLowerCase();
      const kind: Kind = /minigpt|transformer|skills/.test(text)
        ? 'robot'
        : /sentinel|github|governance/.test(text)
          ? 'fox'
          : /research|paper/.test(text)
            ? 'penguin'
            : /contact/.test(text)
              ? 'dog'
              : 'cat';
      const pet = pets.current.find((p) => p.kind === kind) || pets.current[0];
      if (!pet || (!force && Math.random() > 0.4)) return;
      const thought = /sign.language|vision/.test(text)
        ? 'I see it…'
        : /customer|cluster/.test(text)
          ? 'patterns everywhere…'
          : /emora/.test(text)
            ? 'a fellow companion…'
            : personalities[kind].thought;
      if (pet.investigate(Math.max(36, Math.min(worldWidth - 36, x)), thought))
        pet.targetY = y;
    };
    const interest = (e: Event) => {
      react(String((e as CustomEvent).detail), homeX, true, homeY);
    };
    const clicked = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a, .flow-node');
      if (target)
        react(
          `${path} ${target.textContent} ${target.getAttribute('href')}`,
          ((target.getBoundingClientRect().left +
            target.getBoundingClientRect().right) /
            2 -
            0) /
            scale,
          true,
          (target.getBoundingClientRect().bottom + scrollY + 30) / scale,
        );
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            react(
              entry.target.textContent?.slice(0, 160) || path,
              (entry.boundingClientRect.x +
                entry.boundingClientRect.width / 2) /
                scale,
              false,
              (entry.boundingClientRect.bottom + scrollY + 30) / scale,
            );
      },
      { threshold: 0.6 },
    );
    document
      .querySelectorAll(
        'main h1, main h2, .architecture, .project-card, .repo-card',
      )
      .forEach((e) => observer.observe(e));
    const viewportObserver = new IntersectionObserver(() => scrollVisibility());
    build();
    for (const record of records) viewportObserver.observe(record.node);
    sheet.onload = paint;
    if (path !== '/' && path !== '/about') react(path, homeX, true, homeY);
    raf = requestAnimationFrame(animate);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('click', clicked);
    window.addEventListener('notebook-interest', interest);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', scrollVisibility, { passive: true });
    reduced.addEventListener('change', motion);
    mobile.addEventListener('change', resize);
    return () => {
      if (drag?.moved) {
        drag.pet.vy = 0;
        drag.pet.enter('dropping');
      }
      stopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(longPress);
      observer.disconnect();
      viewportObserver.disconnect();
      sheet.onload = null;
      document.removeEventListener('pointermove', move);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('click', clicked);
      window.removeEventListener('notebook-interest', interest);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', scrollVisibility);
      reduced.removeEventListener('change', motion);
      mobile.removeEventListener('change', resize);
      layer.remove();
    };
  }, [ready, prefs, path, selected, kind, small]);
  return (
    <aside
      className={`pet-world pet-scene ${kind === 'cat' ? 'cat-scene' : 'companion'} ${small ? 'small' : ''} ${prefs.hidden ? 'pets-hidden' : ''}`}
      aria-label="Notebook companions"
    >
      {!prefs.hidden && <div ref={stage} className="pet-stage" />}
      <span className="pet-caption hand">
        {
          {
            cat: 'my research assistant',
            robot: 'the tiny engineer',
            fox: 'the open-source scout',
            penguin: 'the paper keeper',
            dog: 'your friendly postdog',
          }[kind]
        }
      </span>
      {ready &&
        createPortal(
          <div className="pet-controls" ref={menu}>
            <button
              className="pet-toggle"
              aria-expanded={open}
              aria-controls="pet-menu"
              onClick={() => setOpen(!open)}
              aria-label="Pet world"
            >
              <PawPrint size={22} aria-hidden="true" />
              <span>Pet world</span>
            </button>
            {open && (
              <div id="pet-menu" className="pet-menu">
                <strong className="hand">A little company.</strong>
                <p>
                  Stroke slowly to pet. Drag anywhere on the page, or use the
                  buttons below.
                </p>
                {(
                  [
                    ['paused', 'Pause creatures'],
                    ['follow', 'Follow cursor'],
                    ['quiet', 'Quiet mode'],
                    ['hidden', 'Hide creatures'],
                    ['reduced', 'Reduced motion'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={prefs[key]}
                      onChange={(e) =>
                        setPrefs({ ...prefs, [key]: e.target.checked })
                      }
                    />
                    {label}
                  </label>
                ))}
                <button
                  onClick={() =>
                    setPrefs({ ...prefs, paused: false, follow: false })
                  }
                >
                  Let them wander
                </button>
                <div className="pet-actions">
                  {['pet', 'wake', 'move', 'call'].map((action) => (
                    <button
                      key={action}
                      disabled={prefs.hidden}
                      onClick={() => actions.current(action)}
                    >
                      {action === 'call'
                        ? 'Come here'
                        : action === 'move'
                          ? 'Move over'
                          : action === 'pet'
                            ? 'Pet ♡'
                            : 'Wake'}
                    </button>
                  ))}
                </div>
                <output className="pet-status">
                  {status || `Keeping you company: ${kind}.`}
                </output>
              </div>
            )}
          </div>,
          document.body,
        )}
    </aside>
  );
}
