const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // Step 1: Launch the browser
  const browser = await chromium.launch({ headless: false }); // Set to true to run in the background
  const context = await browser.newContext();
  const page = await context.newPage();

  // Step 2: Navigate to Hacker News "Newest" page
  await page.goto("https://news.ycombinator.com/newest");

  // Step 3: Wait for the articles to load
  await page.waitForSelector(".athing");

  // Step 4: Extract the first 100 articles with their timestamps
  const articles = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".athing"));

    return rows.slice(0, 100).map(row => {
      const title = row.querySelector(".titleline a")?.innerText.trim();
      const id = row.getAttribute("id");

      // Find the age element in the next row (Hacker News structure)
      const ageElement = row.nextElementSibling?.querySelector(".age a");
      const ageText = ageElement ? ageElement.innerText.trim() : null;

      return { title, ageText };
    }).filter(article => article.ageText); // Remove any articles without a timestamp
  });

  // Step 5: Convert relative time (e.g., "3 minutes ago") into comparable values
  function extractMinutes(text) {
    if (!text) return Infinity; // If no timestamp, assign a high value to avoid sorting issues
    const match = text.match(/(\d+)\s*(minute|hour|second)s?\s*ago/);
    if (!match) return Infinity;

    const value = parseInt(match[1]);
    if (text.includes("second")) return value / 60; // Convert seconds to minutes
    if (text.includes("hour")) return value * 60; // Convert hours to minutes
    return value; // Keep minutes as is
  }

  // Step 6: Sort articles from newest to oldest
  const sortedArticles = articles.sort((a, b) => extractMinutes(a.ageText) - extractMinutes(b.ageText));

  // Step 7: Print all 100 sorted articles in terminal
  console.log("\n✅ Sorted Articles (Newest to Oldest):");
  sortedArticles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title} - ${article.ageText}`);
  });

  // Step 8: Close the browser
  await browser.close();
}

// Run the function
(async () => {
  await sortHackerNewsArticles();
})();
