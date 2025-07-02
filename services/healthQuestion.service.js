import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const generateHealthQuestionsPrompt = (userHealthData) => `
You are a health questionnaire assistant. Based on the following user health data:

${JSON.stringify(userHealthData, null, 2)}

Generate at least 50 multiple-choice questions, distributed across these categories:
- Lifestyle Habits
- Dietary Habits
- Medical History
- Environmental Exposure
- Health Monitoring

Each category should follow this format:
Categories: Lifestyle, Dietary, Medical, Environmental, Health Monitoring
Format:
[{
  "title": "Category",
  "description": "Brief description",
  "questions": [{
    "name": "field_name",
    "question": "Question text?",
    "options": [
      {"value": "option1", "label": "Option 1"},
      {"value": "option2", "label": "Option 2"},
      {"value": "option3", "label": "Option 3"},
      {"value": "option4", "label": "Option 4"}
    ]
  }]
}]

Respond only with a valid JSON object that is an array of categories.
`;

const generateHealthQuestions = async (userHealthData) => {
  try {
    const client =  ModelClient(endpoint, new AzureKeyCredential(token));

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that returns JSON only.",
          },
          {
            role: "user",
            content: generateHealthQuestionsPrompt(userHealthData),
          },
        ],
        temperature: 0.7,
        top_p: 1,
        model: model,
      },
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const output = response.body.choices[0].message.content;
    const parsed = JSON.parse(output);
    return parsed;
  } catch (error) {
    console.error("Error generating health questions:", error);
    throw error
  }
};

export default generateHealthQuestions;
