import { instant } from "@next/playwright";
import { expect, type Page, test } from "@playwright/test";

/**
 * Static-shell guards. `instant()` locks dynamic data; anything asserted
 * inside the callback must come from the prerendered shell (or the
 * prefetched app shell on a soft navigation), never from a stream.
 */

const HOME_SHELL = '[data-testid="home-shell"]';
const HOME_ACTIVITY = '[data-testid="home-activity"]';
const ABOUT_SHELL = '[data-testid="about-shell"]';
const PROJECTS_SHELL = '[data-testid="projects-shell"]';
const PROJECTS_CATALOGUE = '[data-testid="projects-catalogue"]';

function nav(page: Page, name: string) {
  return page.getByRole("navigation", { name: "Menu" }).getByRole("link", {
    exact: true,
    name,
  });
}

test.describe("initial load", () => {
  test("home shell is served, including the cached activity grid", async ({
    baseURL,
    page,
  }) => {
    const url = `${baseURL}/`;
    await instant(
      page,
      async () => {
        await page.goto(url);
        await expect(page.locator(HOME_SHELL)).toBeVisible();
        await expect(page.locator(HOME_ACTIVITY)).toBeVisible();
      },
      { baseURL: new URL(url).origin }
    );
  });

  test("projects shell is served while the catalogue is gated", async ({
    baseURL,
    page,
  }) => {
    const url = `${baseURL}/projects`;
    await instant(
      page,
      async () => {
        await page.goto(url);
        await expect(page.locator(PROJECTS_SHELL)).toBeVisible();
        await expect(page.locator(PROJECTS_CATALOGUE)).toHaveCount(0);
      },
      { baseURL: new URL(url).origin }
    );
  });

  test("spanish home shell is served", async ({ baseURL, page }) => {
    const url = `${baseURL}/es`;
    await instant(
      page,
      async () => {
        await page.goto(url);
        await expect(page.locator(HOME_SHELL)).toBeVisible();
        await expect(page.locator(HOME_ACTIVITY)).toBeVisible();
      },
      { baseURL: new URL(url).origin }
    );
  });
});

test.describe("soft navigation", () => {
  test("home -> about commits the about shell", async ({ page }) => {
    await page.goto("/");
    const trigger = nav(page, "about");
    await expect(trigger).toBeVisible();

    await instant(page, async () => {
      await trigger.click();
      await expect(page.locator(ABOUT_SHELL)).toBeVisible();
    });
  });

  test("home -> projects commits the shell, then streams the catalogue", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = nav(page, "projects");
    await expect(trigger).toBeVisible();

    await instant(page, async () => {
      await trigger.click();
      await expect(page.locator(PROJECTS_SHELL)).toBeVisible();
      await expect(page.locator(PROJECTS_CATALOGUE)).toHaveCount(0);
    });
    await expect(page.locator(PROJECTS_CATALOGUE)).toBeVisible();
  });

  test("projects -> home commits the home shell with the activity grid", async ({
    page,
  }) => {
    await page.goto("/projects");
    const trigger = page.getByRole("link", { name: "Martin Vila" }).first();
    await expect(trigger).toBeVisible();

    await instant(page, async () => {
      await trigger.click();
      await expect(page.locator(HOME_SHELL)).toBeVisible();
      await expect(page.locator(HOME_ACTIVITY)).toBeVisible();
    });
  });
});
