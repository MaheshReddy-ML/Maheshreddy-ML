const { chromium } = require("playwright")
const { default: AxeBuilder } = require("@axe-core/playwright")
const fs = require("fs")
const assert = require("node:assert/strict")
const origin = process.env.QA_ORIGIN || "http://localhost:5173"
void (async () => {
  const b = await chromium.launch()
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ["clipboard-read", "clipboard-write"],
  })
  const p = await ctx.newPage()
  const goto = p.goto.bind(p)
  p.goto = (url, opts) => goto(url, { waitUntil: "networkidle", ...opts })
  const results = []
  const check = (name, value) => {
    assert.ok(value, name)
    results.push(name)
  }
  await p.goto(origin)
  await p.getByRole("button", { name: "Menu +" }).click()
  await p.waitForTimeout(150)
  check("Mobile menu expands", await p.locator("#navigation").isVisible())
  await p
    .locator("#navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .click()
  await p.waitForTimeout(150)
  await p.waitForURL("**/projects")
  check(
    "Mobile navigation changes route",
    await p.getByRole("heading", { level: 1 }).textContent(),
  )
  await p.goto(origin + "/projects/minigpt")
  await p.getByRole("button", { name: /07 SwiGLU/ }).click()
  await p.waitForTimeout(150)
  check(
    "Transformer block opens its technical note",
    (await p.locator("#architecture-note").textContent()).includes(
      "SiLU-activated gate",
    ),
  )
  await p.goto(origin + "/projects/sentinelai")
  check(
    "Six independent governance experts",
    (await p.locator(".flow-node.expert").count()) === 6,
  )
  await p.getByRole("button", { name: /09 Audit/ }).click()
  await p.waitForTimeout(150)
  check(
    "Governance domain selects note",
    (await p.locator("#architecture-note").textContent()).includes(
      "independent expert domain",
    ),
  )
  await p.goto(origin + "/projects/logistic-regression")
  await p.locator("#sample").fill("9")
  await p.waitForTimeout(150)
  check(
    "Min-max scaling calculation",
    (await p.locator(".scaling output").textContent()) === "1.000",
  )
  await p.getByRole("tab", { name: "Standardization", exact: true }).click()
  await p.waitForTimeout(150)
  check(
    "Standardization calculation",
    (await p.locator(".scaling output").textContent()) === "1.414",
  )
  await p.goto(origin + "/github")
  const repositoryCount = await p.locator(".repo-card").count()
  check("GitHub lab loads saved or live repositories", repositoryCount > 0)
  await p.getByRole("searchbox").fill("MiniGPT")
  await p.waitForTimeout(150)
  check(
    "Repository search filters cards",
    (await p.locator(".repo-card").count()) === 1,
  )
  await p.getByRole("searchbox").fill("unfindable-project-qw9")
  await p.waitForTimeout(150)
  check(
    "Empty results are handled",
    await p
      .getByRole("heading", { name: "No experiments on this page." })
      .isVisible(),
  )
  await p.getByRole("button", { name: "Clear filters" }).click()
  await p.waitForTimeout(150)
  check(
    "Clear filters restores projects",
    (await p.locator(".repo-card").count()) === repositoryCount,
  )
  await p.getByRole("button", { name: "Computer Vision", exact: true }).click()
  await p.waitForTimeout(150)
  check(
    "Category filter finds sign language",
    (await p.locator(".repo-grid").textContent()).includes("Sign Language"),
  )
  await p.getByRole("button", { name: "All", exact: true }).click()
  await p.waitForTimeout(150)
  await p.getByRole("combobox").click()
  await p.waitForTimeout(150)
  await p.getByRole("option", { name: "Name A–Z" }).click()
  await p.waitForTimeout(150)
  check("Sort applies", await p.locator(".repo-card").evaluateAll((cards) => {
      const names = cards.map((card) =>
        decodeURIComponent(new URL(card.href).pathname.split("/").at(-1)),
      )
      return names.every(
        (name, index) =>
          index === 0 || names[index - 1].localeCompare(name) <= 0,
      )
    }))
  await p.route("https://api.github.com/**", (r) => r.abort())
  await p.getByRole("button", { name: "Refresh ↻" }).click()
  await p.waitForTimeout(150)
  await p.waitForSelector(".data-notice")
  check(
    "Failed refresh preserves saved data",
    (await p.locator(".repo-card").count()) === repositoryCount,
  )
  await p.unroute("https://api.github.com/**")
  await p.goto(origin + "/contact")
  await p.getByRole("button", { name: "Copy email" }).click()
  await p.waitForTimeout(150)
  check(
    "Copy email succeeds",
    (await p.locator(".copy-status").textContent()).includes("Email copied"),
  )
  await p.getByRole("button", { name: "Switch to midnight mode" }).click()
  await p.waitForTimeout(150)
  await p.reload({ waitUntil: "networkidle" })
  check(
    "Theme survives reload",
    (await p.locator("html").getAttribute("data-theme")) === "dark",
  )
  for (const route of [
    "/",
    "/about",
    "/projects",
    "/projects/emora",
    "/projects/sentinelai",
    "/projects/minigpt",
    "/projects/sign-language",
    "/projects/student-risk",
    "/projects/customer-intelligence",
    "/projects/logistic-regression",
    "/research",
    "/github",
    "/skills",
    "/journey",
    "/contact",
  ]) {
    await p.goto(origin + route, { waitUntil: "networkidle" })
    const axe = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze()
    check("Dark accessibility " + route, axe.violations.length === 0)
    await p.screenshot({
      path:
        "qa/dark-" +
        (route === "/" ? "home" : route.slice(1).replaceAll("/", "-")) +
        ".png",
      fullPage: true,
    })
  }
  await p.emulateMedia({ reducedMotion: "reduce" })
  await p.goto(origin)
  const pet = p.locator(".living-pet")
  const initialPosition = await pet.evaluate((e) => e.style.transform)
  await p.waitForTimeout(250)
  check(
    "Reduced motion stops creature movement",
    initialPosition === (await pet.evaluate((e) => e.style.transform)),
  )
  await p.getByRole("button", { name: "Pet world", exact: true }).click()
  await p.getByRole("button", { name: "Pet ♡", exact: true }).click()
  check(
    "Accessible pet interaction works",
    (await p.locator(".pet-status").textContent()).includes("loved"),
  )
  await p.keyboard.press("Escape")
  for (const width of [320, 768, 1024]) {
    await p.setViewportSize({ width, height: 900 })
    await p.goto(origin)
    check(
      "No home overflow at " + width,
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    )
    await p.screenshot({ path: `qa/home-${width}.png`, fullPage: true })
  }
  await p.setViewportSize({ width: 390, height: 844 })
  await p.goto(origin + "/no-such-page")
  check(
    "Unknown page renders recovery",
    await p.getByRole("heading", { name: "Page not found." }).isVisible(),
  )
  fs.writeFileSync(
    "qa/interaction-report.json",
    JSON.stringify({ passed: results }, null, 2),
  )
  console.log(results.join("\n"))
  await b.close()
})()
