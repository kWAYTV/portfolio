/**
 * Demo script: Expand/Collapse buttons in IDE explorer
 * Records a video of the feature in action.
 *
 * Run: bun run scripts/demo-expand-collapse.ts
 * (Requires dev server at localhost:3000)
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const DEMO_DIR = join(process.cwd(), "demo-recordings");

async function main() {
  await mkdir(DEMO_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: DEMO_DIR, size: { width: 1280, height: 720 } },
  });

  const page = await context.newPage();

  try {
    // Navigate to IDE (use /en for consistent locale)
    await page.goto("http://localhost:3000/en", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    await page.waitForLoadState("networkidle");

    // Wait for sidebar to be visible (Explorer or Explorador)
    const explorer = page.getByText(/EXPLORER|Explorador/i).first();
    await explorer.waitFor({ state: "visible", timeout: 10000 });

    // Verify tree is expanded (portfolio, src, blog visible)
    await page.getByText("portfolio").first().waitFor({ state: "visible" });
    await page.getByText("src").first().waitFor({ state: "visible" });

    // Explorer header: first button = Expand All, second = Collapse All (size-6 icon buttons)
    const expandBtn = page.locator("button.size-6").first();
    const collapseBtn = page.locator("button.size-6").nth(1);

    // Click Collapse All
    await collapseBtn.click();

    // Brief pause to show collapsed state
    await page.waitForTimeout(800);

    // Click Expand All
    await expandBtn.click();

    // Pause to show expanded state
    await page.waitForTimeout(1200);

    // Collapse again
    await collapseBtn.click();
    await page.waitForTimeout(600);

    // Expand again
    await expandBtn.click();
    await page.waitForTimeout(800);
  } finally {
    await context.close();
    await browser.close();
  }

  console.log(`Demo complete. Video saved to ${DEMO_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
