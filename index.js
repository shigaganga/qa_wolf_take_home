const { chromium } = require("playwright");

async function hackerNews() {
  const browser = await chromium.launch({ headless: false }); 
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://news.ycombinator.com/newest");
  await page.waitForSelector(".athing");
  const articles = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".athing"));
    
    return rows.slice(0, 100).map(row => {
      const titleElement = row.querySelector(".titleline a");
      const title = titleElement ? titleElement.innerText.trim() : "No title";

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
async function execute() {
  await hackerNews();
}

execute();
