const { test, expect } = require('@playwright/test');

test('Validate articles on Hacker News are sorted from newest to oldest', async ({ page }) => {
  // Step 1: Navigate to Hacker News "Newest" page
  await page.goto("https://news.ycombinator.com/newest");

  // Step 2: Wait for articles to load
  await page.waitForSelector(".athing");

  // Step 3: Extract the first 100 articles
  const articles = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".athing"));
    
    return rows.slice(0, 100).map(row => {
      const titleElement = row.querySelector(".titleline a");
      const title = titleElement ? titleElement.innerText.trim() : "No title";

      const id = row.getAttribute("id");
      const scoreElement = document.querySelector(`#score_${id}`);
      
      // Extract the timestamp from the 'score' element
      const timestamp = scoreElement ? scoreElement.getAttribute("data-timestamp") : null; 
      return { title, timestamp };
    });
  });

  // Step 4: Validate if the articles are sorted by timestamp
  let sorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    const currentTimestamp = parseInt(articles[i].timestamp);
    const nextTimestamp = parseInt(articles[i + 1].timestamp);

    // If the current article's timestamp is greater than the next, they are not sorted
    if (currentTimestamp > nextTimestamp) {
      sorted = false;
      break;
    }
  }

  // Step 5: Use Playwright assertion to check if sorted
  expect(sorted).toBe(true);
});
