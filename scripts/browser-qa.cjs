const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const fs = require('node:fs');
const origin = process.env.QA_ORIGIN || 'http://localhost:3000';
const routes = [
  '/',
  '/about',
  '/projects',
  '/projects/emora',
  '/projects/sentinelai',
  '/projects/minigpt',
  '/projects/sign-language',
  '/projects/student-risk',
  '/projects/customer-intelligence',
  '/projects/logistic-regression',
  '/research',
  '/github',
  '/skills',
  '/journey',
  '/contact',
];
void (async () => {
  fs.mkdirSync('qa', { recursive: true });
  const browser = await chromium.launch();
  const result = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 950 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const route of routes) {
      const start = Date.now();
      const r = await page.goto(origin + route, {
        waitUntil: 'networkidle',
        timeout: 90000,
      });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
      await page.screenshot({
        path: `qa/${name}-${width}.png`,
        fullPage: true,
      });
      const row = {
        route,
        width,
        status: r.status(),
        h1: await page.locator('h1').count(),
        overflow,
        violations: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes
            .map((n) => ({ target: n.target, summary: n.failureSummary }))
            .slice(0, 5),
        })),
        errors: [...errors],
        ms: Date.now() - start,
      };
      errors.length = 0;
      result.push(row);
      console.log(
        JSON.stringify({
          route,
          width,
          status: row.status,
          overflow,
          violations: row.violations.map((x) => x.id),
          errors: row.errors,
        }),
      );
    }
    await context.close();
  }
  fs.writeFileSync('qa/browser-report.json', JSON.stringify(result, null, 2));
  await browser.close();
  if (
    result.some(
      (r) =>
        r.status !== 200 ||
        r.overflow ||
        r.h1 !== 1 ||
        r.violations.length ||
        r.errors.length,
    )
  )
    process.exitCode = 1;
})();
