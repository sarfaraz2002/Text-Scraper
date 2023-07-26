function Loader() {
  document.getElementById("loader").style.display = "block";
}
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
async function getTop5Urls(query) {
  const apiKey = "AIzaSyB_aip7_iDO-_E_myeIXe1NNmx_pSoLrqU";
  const customSearchEngineId = "425b814a63c844c09";
  const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&key=${apiKey}&cx=${customSearchEngineId}&num=5`;
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data.items.map((item) => item.link));
}
async function scrapeTextFromUrls(urls) {
  const scrapingBeeApiUrl = "https://app.scrapingbee.com/api/v1/";
  const apiKey =
    "974OKIHMLZ6TK0ZWYVQ076534LUWPVMBGN3T9AEN2SLXFQ3T2K8B248VH1UBKZT361HPGXV97RS03D8W";
  const renderJs = "false";
  const extractRules = JSON.stringify({ text: "body" });

  const fetchText = urls.map(async (url) => {
    const params = new URLSearchParams({
      url,
      render_js: renderJs,
      extract_rules: extractRules,
      api_key: apiKey,
    });
    const apiUrl = `${scrapingBeeApiUrl}?${params.toString()}`;
    return fetch(apiUrl)
      .then((response) => {
        return response.text();
      })
      .catch((error) => {
        console.error(error);
      });
  });
  return await Promise.all(fetchText);
}
function displayText(texts) {
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "";
  texts.forEach((text, index) => {
    const resultBox = document.createElement("div");
    resultBox.classList.add("result-box");
    resultBox.textContent = `URL ${index + 1} Text:\n${text}`;
    resultContainer.appendChild(resultBox);
  });
}
document
  .getElementById("searchForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("query").value;
    try {
      Loader();
      const top5Urls = await getTop5Urls(query);
      const texts = await scrapeTextFromUrls(top5Urls);
      hideLoader();
      displayText(texts);
    } catch (error) {
      console.error(error);
    }
  });
