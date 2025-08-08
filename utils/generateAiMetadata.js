import { openai } from "../config/openai.img.js";
import fs from "fs/promises";
import path from "path";
import { endpoint, token, model } from "../config/ask.ai.js";

export const generateTitle = async (description) => {
  const response = await fetch(`${endpoint}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: `Write a short and catchy remedy title only 3 to 4 words  for this: ${description}`,
        },
      ],
      temperature: 0.7,
      top_p: 1,
    }),
  });

  const data = await response.json();

  const title = data?.choices?.[0]?.message?.content?.trim();

  if (!title) {
    console.error("⚠️ AI returned no title:", JSON.stringify(data, null, 2));
    throw new Error("Failed to generate remedy title.");
  }

  return title;
};

export const generateAiImgs = async (description) => {
  if (!description || description.length < 10) {
    throw new Error("Description must be at least 10 characters.");
  }

  const prompt = `Ultra-detailed, high-resolution illustration of a natural remedy. Description: "${description}". Show the remedy in an interactive, visually appealing style — realistic textures, soft natural lighting, botanical ingredients, minimal background. Suitable for health and wellness apps.`;

  try {
    // 1. Generate image
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    return imageResponse.data[0].url;
    
  } catch (err) {
    console.error("❌ Generation failed:", err.message);
    throw new Error("AI metadata generation failed.");
  }
};
