const { test, expect } = require('@playwright/test');

test('Validate articles on Hacker News are sorted from newest to oldest', async ({ page }) => {
  
  await page.goto("https://news.ycombinator.com/newest");

  await page.waitForSelector(".athing");

  const articles = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".athing"));
    
    return rows.slice(0, 100).map(row => {
      const titleElement = row.querySelector(".titleline a");
      const title = titleElement ? titleElement.innerText.trim() : "No title";

      const id = row.getAttribute("id");
      const scoreElement = document.querySelector(`#score_${id}`);
      
      const timestamp = scoreElement ? scoreElement.getAttribute("data-timestamp") : null; 
      return { title, timestamp };
    });
  });

  let sorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    const currentTimestamp = parseInt(articles[i].timestamp);
    const nextTimestamp = parseInt(articles[i + 1].timestamp);

    if (currentTimestamp > nextTimestamp) {
      sorted = false;
      break;
    }
  }

  expect(sorted).toBe(true);
});
