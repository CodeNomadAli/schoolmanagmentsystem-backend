import dotenv from "dotenv";
dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

if (!token) {
  throw new Error("❌ GITHUB_TOKEN is missing from your .env file");
}



function generatePrompt(data) {
  return `
You are a health questionnaire assistant. Based on the following user health data:

${JSON.stringify(data, null, 2)}

Generate at least 50 multiple-choice questions, distributed across these categories:
- Lifestyle Habits
- Dietary Habits
- Medical History
- Environmental Exposure
- Health Monitoring

Each category must follow this format:
{
  "title": "Category Name",
  "description": "One-sentence reason why these questions matter",
  "questions": [
    {
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    }
  ]
}

Respond **only** with a valid JSON array of category objects.
`.trim();
}

async function main() {
  try {
    const res = await fetch(`${endpoint}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant that returns JSON only." },
          { role: "user", content: generatePrompt(userHealthData) },
        ],
        temperature: 0.7,
        top_p: 1,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`API Error: ${data?.error?.message || res.statusText}`);
    }

    const output = data.choices?.[0]?.message?.content;
    try {
      const parsed = JSON.parse(output);
      console.dir(parsed, { depth: null });
      console.log("✅ Questions generated successfully!");
    } catch (err) {
      console.error("❌ Failed to parse JSON response:", err);
      console.log("⚠️ Raw response:\n", output);
    }

  } catch (err) {
    console.error("❌ Fatal error:", err.message || err);
  }
}

main();
