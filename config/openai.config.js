import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-turbo-preview"; 

if (!token) {
  throw new Error("❌ GITHUB_TOKEN is missing from your .env file");
}


const userHealthData = {
  age: 45,
  gender: "female",
  symptoms: ["chest pain", "dizziness"],
  medicalHistory: ["hypertension", "diabetes"],
  lifestyle: {
    smoking: true,
    exercise: "rarely",
    diet: "high-fat",
  },
};


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


export async function main() {
  try {
    const client = ModelClient(endpoint, new AzureKeyCredential(token));

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "You are a helpful assistant that returns JSON only." },
          { role: "user", content: generatePrompt(userHealthData) },
        ],
        temperature: 0.7,
        top_p: 1,
        model: model,
      },
    });

    if (isUnexpected(response)) {
      throw new Error(response.body.error?.message || "Unexpected response error");
    }

    const output = response.body.choices[0].message.content;

    try {
      const parsed = JSON.parse(output);
      console.dir(parsed, { depth: null });
      console.log("✅ Questions generated successfully!");
    } catch (err) {
      console.error("❌ Failed to parse JSON response:", err);
      console.log("⚠️ Raw response:\n", output);
    }

  } catch (err) {
    console.error("❌ Fatal error during OpenAI call:", err);
  }
}

main().catch((err) => {
  console.error("❌ Unhandled error in main():", err);
});
