const { chromium } = require("playwright");

async function hackerNews() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://news.ycombinator.com/newest");
  await page.waitForSelector(".athing");
  const articles = await page.evaluate(() => {
    const allArticles = Array.from(document.querySelectorAll(".athing"));

    return allArticles.slice(0, 100).map(hundredArticle => {
      const articleTitleEle = hundredArticle.querySelector(".titleline a");
      const title = articleTitleEle ? articleTitleEle.innerText.trim() : "No title";
      const articleId = hundredArticle.getAttribute("id");
      const timeStampEle = document.querySelector(`#score_${articleId}`);
      const timestamp = timeStampEle ? timeStampEle.getAttribute("data-timestamp") : null;
      return { title, timestamp };
    });
  });
  let sortTitle = true;
  for (let i = 0; i < articles.length - 1; i++) {
    if (articles[i].timestamp && articles[i + 1].timestamp) {
      if (currentTimestamp > nextTimestamp) {
        sortTitle = false;
        break;
      }
    }
  }

  if (sortTitle) {
    console.log("✅ Articles are correctly sortTitle from newest to oldest.");
  } else {
    console.log("❌ Articles are NOT correctly sortTitle.");
  }
   await browser.close();
}
async function execute() {
  await hackerNews();
}
execute();
