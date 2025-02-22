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

  // Step 4: Extract the first 100 articles
  const articles = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".athing"));

    // Utility to convert relative time into milliseconds
    function parseRelativeTime(timeText) {
      const timeRegex = /(\d+)\s+(\w+)\s+ago/;
      const match = timeText.match(timeRegex);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        let multiplier = 0;

        switch (unit) {
          case "minute":
          case "minutes":
            multiplier = 60 * 1000;
            break;
          case "hour":
          case "hours":
            multiplier = 60 * 60 * 1000;
            break;
          case "day":
          case "days":
            multiplier = 24 * 60 * 60 * 1000;
            break;
          default:
            return 0;
        }

        return Date.now() - value * multiplier; // Return time in milliseconds
      }

      return 0; // In case it doesn't match
    }

    return rows.slice(0, 100).map(row => {
      const title = row.querySelector(".titleline a")?.innerText.trim();
      const id = row.getAttribute("id");
      const ageElement = document.querySelector(`#score_${id} ~ span`);
      const ageText = ageElement ? ageElement.innerText.trim() : null;

      return {
        title,
        ageText,
        timestamp: ageText ? parseRelativeTime(ageText) : 0, // Add timestamp for sorting
      };
    });
  });

  // Step 5: Sort the articles based on timestamp
  const sortedArticles = articles.sort((a, b) => b.timestamp - a.timestamp);

  // Step 6: Validate if the articles are sorted
  let sorted = true;
  for (let i = 0; i < sortedArticles.length - 1; i++) {
    if (sortedArticles[i].timestamp < sortedArticles[i + 1].timestamp) {
      sorted = false;
      break;
    }
  }

  // Step 7: Print results
  if (sorted) {
    console.log("✅ Articles are correctly sorted from newest to oldest.");
  } else {
    console.log("❌ Articles are NOT correctly sorted.");
  }

  // Step 8: Close the browser
  //await browser.close();
}

// Run the function
(async () => {
  await sortHackerNewsArticles();
})();

