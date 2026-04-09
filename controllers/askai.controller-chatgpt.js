import puppeteer from "puppeteer";

const CHAT_URL = "https://chat.openai.com/chat";

// Replace this with your actual ChatGPT session token
const AUTH_TOKEN = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb25kdWl0X3V1aWQiOiIyNzA3MWJhZTJiMzk0YzIzYWM1Mzc0OWM2MzFjYjI4NiIsImNvbmR1aXRfbG9jYXRpb24iOiIxMC4xMjguMjMuNDo4MzA1IiwiaWF0IjoxNzU2MjIwNzQzLCJleHAiOjE3NTYyMjEzNDN9.61AJy354GD679tCJBmsPsWUwS2Nr5AOsEtBbEWfstfpa_KXL9Xc9ACb73EYj0tU5Kl1LJvagAAQm85qu8Ke-vw";


/**
 * Ask ChatGPT a question using Puppeteer + token login
 * @param {string} message - The message to send
 * @returns {Promise<string>} - The response from ChatGPT
 */
async function askChatGPT(message) {
  // Launch Puppeteer safely as root
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Set session token cookie
  await page.setCookie({
    name: "__Secure-next-auth.session-token",
    value: AUTH_TOKEN,
    domain: ".chat.openai.com",
    path: "/",
    httpOnly: true,
    secure: true,
  });

  // Go to ChatGPT
  await page.goto(CHAT_URL, { waitUntil: "networkidle2" });

  // Wait for editable input
  await page.waitForSelector('[contenteditable="true"]', { timeout: 60000 });

  // Focus and type the message
  const input = await page.$('[contenteditable="true"]');
  await input.focus();
  await page.keyboard.type(message);
  await page.keyboard.press("Enter");

  // Wait for response (adjust timeout if needed)
  await page.waitForTimeout(5000);

  // Grab all messages dynamically
  const messages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="group"]'))
      .map(el => el.innerText)
      .filter(Boolean);
  });

  const reply = messages[messages.length - 1] || "No response received.";

  await browser.close();
  return reply;
}

// Test
(async () => {
  const question = "Tell me a fun coding joke!";
  const response = await askChatGPT(question);
  console.log("ChatGPT says:", response);
})();
