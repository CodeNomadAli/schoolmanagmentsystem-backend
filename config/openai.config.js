import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const userHealthData = {
  firstName: "Aliyan",
  lastName: "Siddiqui",
  age: 18,
  sex: "Male",
  weight: 40,
  height: 180,
  bloodType: "O+",
  allergies: ["Peanuts"],
  chronicConditions: ["Hypertension"],
  medications: ["Atenolol"],
  familyHistory: ["Diabetes"],
  dataShareConsent: true,
  preferredLanguage: "en",
};

const prompt = `
You are a health questionnaire assistant. Based on the following user health data:

${JSON.stringify(userHealthData, null, 2)}

Generate at least 50 multiple-choice questions, distributed across these categories:
- Lifestyle Habits
- Dietary Habits
- Medical History
- Environmental Exposure
- Health Monitoring

Each category should follow this format:
{
  "title": "Category Name",
  "description": "One-sentence motivation about why these questions are important",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    },
    ...
  ]
}

Respond only with a valid JSON object that is an array of categories.
`;

export async function main() {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant that returns JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      top_p: 1,
      model: model,
    },
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  try {
    const output = response.body.choices[0].message.content;
    const parsed = JSON.parse(output);
    console.dir(parsed, { depth: null });
  } catch (err) {
    console.error("Failed to parse JSON response:", err);
    console.log("Raw response:", response.body.choices[0].message.content);
  }
}
