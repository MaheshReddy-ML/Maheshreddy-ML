const assert = require("node:assert/strict")
const { chromium } = require("playwright")

const origin = process.env.QA_ORIGIN || "http://localhost:8443"

async function run() {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    })
    await page.addInitScript(() => {
      window.transitionCount = 0
      const start = document.startViewTransition?.bind(document)
      if (start) {
        document.startViewTransition = (update) => {
          window.transitionCount += 1
          return start(update)
        }
      }
    })
    await page.goto(origin, { waitUntil: "networkidle" })
    assert.equal(await page.locator("#main").isVisible(), true)

    await page
      .locator("#navigation")
      .getByRole("link", { name: "Projects" })
      .click()
    await page.waitForURL("**/projects")
    assert.equal(await page.evaluate(() => window.transitionCount), 1)
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .some(
          (animation) =>
            animation.effect?.pseudoElement ===
              "::view-transition-new(notebook-page)" &&
            animation.animationName === "notebook-page-in",
        ),
    )
    await page.getByRole("heading", { level: 1 }).waitFor()
    await page.goBack()
    await page.waitForURL(origin + "/")
    await page.waitForFunction(() => window.transitionCount === 2)
    assert.equal(await page.evaluate(() => window.transitionCount), 2)
    assert.equal(
      await page.getByRole("heading", { level: 1 }).isVisible(),
      true,
      "Browser history restores the cover",
    )
    await page.close()

    const reduced = await browser.newPage({ reducedMotion: "reduce" })
    await reduced.goto(origin, { waitUntil: "networkidle" })
    await reduced
      .locator("#navigation")
      .getByRole("link", { name: "About" })
      .click()
    await reduced.waitForURL("**/about")
    assert.equal(
      await reduced
        .locator("#main")
        .evaluate((element) => getComputedStyle(element).viewTransitionName),
      "none",
      "Reduced motion disables the page snapshot animation",
    )
    assert.equal(
      await reduced.evaluate(
        () =>
          getComputedStyle(
            document.documentElement,
            "::view-transition-new(root)",
          ).animationName,
      ),
      "none",
      "Reduced motion disables the root animation",
    )
    await reduced.close()

    const fallback = await browser.newPage()
    const transitionWarnings = []
    fallback.on("console", (message) => {
      if (
        message.type() === "warning" &&
        message.text().includes("viewTransition")
      ) {
        transitionWarnings.push(message.text())
      }
    })
    await fallback.addInitScript(() => {
      Object.defineProperty(document, "startViewTransition", {
        value: undefined,
      })
    })
    await fallback.goto(origin, { waitUntil: "networkidle" })
    await fallback
      .locator("#navigation")
      .getByRole("link", { name: "Contact" })
      .click()
    await fallback.waitForURL("**/contact")
    assert.equal(
      await fallback.getByRole("heading", { level: 1 }).isVisible(),
      true,
    )
    assert.deepEqual(transitionWarnings, [])
    await fallback.close()

    console.log(
      "Page transitions: links, history, reduced motion, and fallback passed",
    )
  } finally {
    await browser.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
