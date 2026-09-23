const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const origin = process.env.QA_ORIGIN || 'http://localhost:3000';
(async () => {
  fs.mkdirSync('qa', { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.addInitScript(() => {
    Math.random = () => 0.78;
  });
  const page = await context.newPage();
  const errors = [],
    passed = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const check = (name, condition) => {
    assert.ok(condition, name);
    passed.push(name);
  };
  const cat = page.locator('[data-kind="cat"]');
  const state = () => cat.getAttribute('data-state');
  const waitState = async (wanted) => {
    await page.waitForFunction(
      (wanted) =>
        wanted.includes(
          document.querySelector('[data-kind="cat"]')?.dataset.state,
        ),
      wanted,
    );
  };
  await page.goto(origin, { waitUntil: 'networkidle' });
  check(
    'Cover uses one inline cat instead of a pet strip',
    (await page.locator('.living-pet').count()) === 1,
  );
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete),
  );
  await page.waitForTimeout(500);
  const alpha = await cat.locator('canvas').evaluate((c) =>
    c
      .getContext('2d')
      .getImageData(0, 0, c.width, c.height)
      .data.some((v, i) => i % 4 === 3 && v > 0),
  );
  check('Raster sprites actually rendered', alpha);
  check(
    'Cat starts from the former hero illustration',
    (await page.locator('.hero-art .pet-scene').count()) === 1 &&
      (await page.locator('.hero-art svg').count()) === 0,
  );
  check(
    'Pet scene participates in normal page layout',
    (await page
      .locator('.pet-world')
      .evaluate((e) => getComputedStyle(e).position === 'relative')) &&
      (await page.locator('.notebook-surface').count()) === 0,
  );
  await waitState(['walking']);
  const x = await cat.evaluate((e) => e.getBoundingClientRect().x);
  await page.waitForTimeout(600);
  check(
    'Autonomous walking changes position',
    Math.abs((await cat.evaluate((e) => e.getBoundingClientRect().x)) - x) > 2,
  );
  await cat.focus();
  await page.keyboard.press('Enter');
  await waitState(['petting']);
  check('Keyboard petting', true);
  await page.keyboard.press('ArrowRight');
  const movedX = await cat.evaluate((e) => e.getBoundingClientRect().x);
  check(
    'Keyboard movement stays inside the page',
    movedX >= 0 && movedX < 1440,
  );
  await waitState(['happy']);
  check('Petting becomes happy', true);
  await page.keyboard.press('Home');

  await page.waitForTimeout(2200);
  let box = await cat.boundingBox();
  await page.mouse.move(box.x + 28, box.y + 36);
  for (let i = 0; i < 16; i++) {
    await page.mouse.move(box.x + 28 + (i % 2) * 7, box.y + 36);
    await page.waitForTimeout(65);
  }
  check(
    'Slow strokes trigger petting',
    ['petting', 'happy'].includes(await state()),
  );
  box = await cat.boundingBox();
  await page.mouse.move(box.x + 36, box.y + 36);
  await page.mouse.down();
  await page.mouse.move(box.x - 360, box.y + 180, { steps: 6 });
  check('Pointer drag has its own pose', (await state()) === 'dragging');
  check(
    'Drag escapes the original illustration area',
    await cat.evaluate((e) => {
      const p = e.getBoundingClientRect(),
        home = document.querySelector('.pet-stage').getBoundingClientRect();
      return (
        p.right < home.left ||
        p.left > home.right ||
        p.bottom > home.bottom + 50
      );
    }),
  );

  await page.mouse.up();
  await waitState(['dropping', 'recovering']);
  check('Release starts physics recovery', true);
  await waitState(['curious', 'walking']);
  check('Recovery resumes autonomous behavior', true);
  await page.getByRole('button', { name: 'Pet world', exact: true }).click();
  await page.getByLabel('Pause creatures', { exact: true }).check();
  const frozen = await cat.evaluate((e) => [
    e.style.transform,
    e.dataset.state,
  ]);
  await page.waitForTimeout(800);
  check(
    'Pause freezes position and state',
    JSON.stringify(frozen) ===
      JSON.stringify(
        await cat.evaluate((e) => [e.style.transform, e.dataset.state]),
      ),
  );
  await page.getByLabel('Quiet mode', { exact: true }).check();
  check(
    'Quiet mode removes thoughts',
    await page
      .locator('.pet-thought')
      .allTextContents()
      .then((t) => t.every((v) => !v)),
  );
  await page.getByLabel('Hide creatures', { exact: true }).check();
  check(
    'Hide removes all pets',
    (await page.locator('.living-pet').count()) === 0,
  );
  await page.reload({ waitUntil: 'networkidle' });
  check(
    'Preferences survive reload',
    (await page.locator('.living-pet').count()) === 0,
  );
  await page.getByRole('button', { name: 'Pet world', exact: true }).click();
  await page.getByLabel('Hide creatures', { exact: true }).uncheck();
  await page
    .getByRole('button', { name: 'Let them wander', exact: true })
    .click();
  await page.getByLabel('Follow cursor', { exact: true }).check();
  await page.keyboard.press('Escape');
  await page.mouse.move(1000, 700);
  await page.waitForFunction(
    () =>
      document.querySelector('[data-kind="cat"]')?.dataset.following === 'true',
  );
  check('Follow cursor starts without waiting for a section cooldown', true);
  const followStart = await cat.evaluate((e) => e.getBoundingClientRect().x);
  await page.waitForTimeout(1200);
  const followRight = await cat.evaluate((e) => e.getBoundingClientRect().x);
  check(
    'Following moves the pet toward the cursor',
    followRight > followStart + 5,
  );
  await page.mouse.move(100, 700);
  await page.waitForTimeout(1200);
  check(
    'Following tracks a changed cursor position',
    (await cat.evaluate((e) => e.getBoundingClientRect().x)) < followRight - 5,
  );
  const control = await page
    .getByRole('button', { name: 'Pet world', exact: true })
    .boundingBox();
  await page.mouse.move(
    control.x + control.width / 2,
    control.y + control.height / 2,
  );
  await page.waitForFunction(
    () =>
      document.querySelector('[data-kind="cat"]')?.dataset.following ===
      'false',
  );
  check('Following pauses over the controls', true);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.mouse.move(1000, 700);
  await page.waitForTimeout(250);
  const offscreenFollowing = await cat.evaluate((e) => e.style.transform);
  await page.waitForTimeout(850);
  check(
    'Follow mode continues moving when the pet starts offscreen',
    offscreenFollowing !== (await cat.evaluate((e) => e.style.transform)),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  check(
    'Follow setting persists',
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('notebook-pets')).follow,
    ),
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // MediaQueryList change is queued after the emulation command resolves.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const calm = await cat.evaluate((e) => e.style.transform);
  await page.waitForTimeout(900);
  check(
    'OS reduced motion freezes autonomous movement',
    calm === (await cat.evaluate((e) => e.style.transform)),
  );
  await page.getByRole('button', { name: 'Pet world', exact: true }).click();
  await page.getByRole('button', { name: 'Pet ♡', exact: true }).click();
  check(
    'Accessible pet action gives feedback in reduced motion',
    (await page.locator('.pet-status').textContent()).includes('loved'),
  );
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  fs.writeFileSync(
    'qa/pet-accessibility.json',
    JSON.stringify(axe.violations, null, 2),
  );
  check(
    'Pet controls have no automated accessibility violations',
    axe.violations.length === 0,
  );
  await page.screenshot({ path: 'qa/pet-controls.png' });
  await page.keyboard.press('Escape');
  await page
    .locator('#navigation')
    .getByRole('link', { name: 'Projects', exact: true })
    .click();
  await page.waitForURL('**/projects');
  await page.locator('h1').waitFor({ state: 'visible' });
  check('Navigation remains usable', true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(origin + '/projects/minigpt', { waitUntil: 'networkidle' });
  check(
    'Project context chooses the technical creature',
    (await page.locator('[data-kind="robot"]').getAttribute('data-state')) !==
      'idle',
  );
  await page.getByRole('button', { name: /07 SwiGLU/ }).click();
  check(
    'Technical diagram interaction preserved',
    (await page.locator('#architecture-note').textContent()).includes('SiLU'),
  );
  await page.goto(origin, { waitUntil: 'networkidle' });
  const frameTiming = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const times = [];
        let last = performance.now();
        function tick(t) {
          times.push(t - last);
          last = t;
          if (times.length < 120) requestAnimationFrame(tick);
          else
            resolve({
              meanMs: times.reduce((a, b) => a + b) / times.length,
              over50ms: times.filter((t) => t > 50).length,
            });
        }
        requestAnimationFrame(tick);
      }),
  );
  check(
    'Local frame timing has no sustained stalls',
    frameTiming.meanMs < 35 && frameTiming.over50ms < 8,
  );
  // Exercise the visibility handler without relying on headless tab scheduling.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hiddenPosition = await cat.evaluate((e) => [
    e.style.transform,
    e.dataset.state,
  ]);
  await page.waitForTimeout(600);
  check(
    'Visibility handler suspends simulation',
    JSON.stringify(hiddenPosition) ===
      JSON.stringify(
        await cat.evaluate((e) => [e.style.transform, e.dataset.state]),
      ),
  );
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.screenshot({ path: 'qa/pet-desktop.png' });
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mp = await mobile.newPage();
  await mp.goto(origin, { waitUntil: 'networkidle' });
  check(
    'Mobile uses only the primary cat',
    (await mp.locator('.living-pet').count()) === 1,
  );
  await mp.locator('.living-pet').tap();
  await mp.waitForTimeout(80);
  check(
    'Touch tap requests curiosity',
    (await mp.locator('.living-pet').getAttribute('data-state')) === 'curious',
  );
  const touch = await mobile.newCDPSession(mp);
  const touchBox = await mp.locator('.living-pet').boundingBox();
  const point = { x: touchBox.x + 36, y: touchBox.y + 36 };
  await touch.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [point],
  });
  await mp.waitForTimeout(700);
  check(
    'Touch long press pets',
    (await mp.locator('.living-pet').getAttribute('data-state')) === 'petting',
  );
  await touch.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: point.x + 65, y: point.y - 18 }],
  });
  await mp.waitForTimeout(80);
  check(
    'Touch drag uses picked-up state',
    (await mp.locator('.living-pet').getAttribute('data-state')) === 'dragging',
  );
  await touch.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await mp.waitForFunction(() =>
    ['dropping', 'recovering'].includes(
      document.querySelector('.living-pet').dataset.state,
    ),
  );
  check('Touch release recovers', true);
  await mp.getByRole('button', { name: 'Menu +' }).click();
  await mp
    .locator('#navigation')
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  await mp.waitForURL('**/contact');
  await mp
    .getByRole('button', { name: 'Copy email' })
    .waitFor({ state: 'visible' });
  check(
    'Touch navigation preserved',
    await mp.getByRole('button', { name: 'Copy email' }).isVisible(),
  );
  check(
    'Contact uses its dog in the page heading',
    (await mp.locator('[data-kind="dog"]').count()) === 1,
  );
  check(
    'Mobile pet stays inside the page',
    await mp.locator('.living-pet').evaluate((e) => {
      const p = e.getBoundingClientRect();
      return p.left >= -1 && p.right <= innerWidth + 1;
    }),
  );
  check(
    'No mobile horizontal overflow',
    await mp.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
  await mp.screenshot({ path: 'qa/pet-mobile.png' });
  for (const [route, species] of [
    ['/about', 'cat'],
    ['/skills', 'cat'],
    ['/projects', 'robot'],
    ['/github', 'fox'],
    ['/research', 'penguin'],
    ['/contact', 'dog'],
    ['/projects/emora', 'cat'],
    ['/projects/minigpt', 'robot'],
    ['/projects/sentinelai', 'fox'],
    ['/projects/sign-language', 'robot'],
    ['/projects/customer-intelligence', 'fox'],
  ]) {
    await page.goto(origin + route, { waitUntil: 'networkidle' });
    check(
      'Inline character replacement ' + route,
      (await page.locator('[data-kind="' + species + '"]').count()) === 1 &&
        (await page.locator('.pet-scene > svg').count()) === 0,
    );
  }
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Pet world', exact: true }).click();
  await page.getByLabel('Follow cursor', { exact: true }).uncheck();
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  const offscreen = await cat.evaluate((e) => [
    e.style.transform,
    e.dataset.state,
  ]);
  await page.waitForTimeout(600);
  check(
    'Offscreen illustration suspends simulation',
    JSON.stringify(offscreen) ===
      JSON.stringify(
        await cat.evaluate((e) => [e.style.transform, e.dataset.state]),
      ),
  );
  await page.getByRole('button', { name: 'Pet world', exact: true }).click();
  await page.getByRole('button', { name: 'Come here', exact: true }).click();
  check(
    'Come here retrieves an offscreen pet to the current section',
    await cat.evaluate((e) => {
      const r = e.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    }),
  );
  await page.keyboard.press('Escape');
  await cat.focus();
  const oldY = await cat.evaluate((e) => e.getBoundingClientRect().y);
  await page.keyboard.press('ArrowDown');
  check(
    'Keyboard can move vertically across the page',
    (await cat.evaluate((e) => e.getBoundingClientRect().y)) > oldY,
  );
  await page.goto(origin, { waitUntil: 'networkidle' });
  let dragBox = await cat.boundingBox();
  const projectLink = page.getByRole('link', {
    name: /Explore my experiments/,
  });
  const linkBox = await projectLink.boundingBox();
  await page.mouse.move(
    dragBox.x + dragBox.width / 2,
    dragBox.y + dragBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    linkBox.x + linkBox.width / 2,
    linkBox.y + linkBox.height / 2,
    { steps: 8 },
  );
  await page.mouse.up();
  await page.waitForTimeout(180);
  check(
    'Dropped pet stays opaque and interactive over a navigation link',
    await cat.evaluate(
      (e) =>
        getComputedStyle(e).pointerEvents === 'auto' &&
        getComputedStyle(e).opacity === '1',
    ),
  );
  await cat.focus();
  await page.keyboard.press('Enter');
  for (const [dx, dy] of [
    [160, 100],
    [-160, -100],
  ]) {
    const current = await cat.boundingBox();
    await page.mouse.move(
      current.x + current.width / 2,
      current.y + current.height / 2,
    );
    check(
      'Grab cursor remains available after dropping ' + dx,
      await cat.evaluate((e) => getComputedStyle(e).cursor === 'grab'),
    );
    await page.mouse.down();
    await page.mouse.move(
      current.x + current.width / 2 + dx,
      current.y + current.height / 2 + dy,
      { steps: 6 },
    );
    check(
      'Previously dropped pet can be grabbed again ' + dx,
      (await state()) === 'dragging',
    );
    await page.mouse.up();
    await page.waitForTimeout(800);
    check(
      'Re-dropped pet remains fully visible ' + dx,
      await cat.evaluate((e) => getComputedStyle(e).opacity === '1'),
    );
    check(
      'Dragging over a link never activates it ' + dx,
      new URL(page.url()).pathname === '/',
    );
  }
  await page.screenshot({ path: 'qa/pet-click-through.png' });
  await page.mouse.click(
    linkBox.x + linkBox.width / 2,
    linkBox.y + linkBox.height / 2,
  );
  await page.waitForURL('**/projects');
  await page.locator('h1').waitFor({ state: 'visible' });
  check(
    'Underlying project link remains clickable after dropping a pet over it',
    true,
  );
  await page.goto(origin, { waitUntil: 'networkidle' });
  dragBox = await cat.boundingBox();
  await page.mouse.move(
    dragBox.x + dragBox.width / 2,
    dragBox.y + dragBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(dragBox.x + 40, dragBox.y + 40, { steps: 3 });
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(250);
  await page.mouse.move(600, 500, { steps: 5 });
  await page.mouse.up();
  check(
    'Captured drag reaches document positions beyond the first viewport',
    await cat.evaluate((e) => e.getBoundingClientRect().top + scrollY > 1000),
  );
  check('No browser runtime errors', errors.length === 0);
  fs.writeFileSync(
    'qa/pet-report.json',
    JSON.stringify({ passed, frameTiming, errors }, null, 2),
  );
  console.log(JSON.stringify({ passed, frameTiming }, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
