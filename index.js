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
      const scoreElement = document.querySelector(`#score_${id}`);
      
      // You can extract the timestamp directly from the 'score' element or use other attributes
      const timestamp = scoreElement ? scoreElement.getAttribute("data-timestamp") : null; 
      return { title, timestamp };
    });
  });

  // Step 5: Validate if the articles are sorted
  let sorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    if (articles[i].timestamp && articles[i + 1].timestamp) {
      const currentTimestamp = parseInt(articles[i].timestamp);
      const nextTimestamp = parseInt(articles[i + 1].timestamp);

      if (currentTimestamp > nextTimestamp) {
        sorted = false;
        break;
      }
    }
  }

  // Step 6: Print results
  if (sorted) {
    console.log("✅ Articles are correctly sorted from newest to oldest.");
  } else {
    console.log("❌ Articles are NOT correctly sorted.");
  }

  // Step 7: Close the browser
  // await browser.close();
}

// Run the function
(async () => {
  await sortHackerNewsArticles();
})();
