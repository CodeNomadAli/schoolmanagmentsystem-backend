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

    const imageUrl = imageResponse.data[0].url;
    if (!imageUrl) throw new Error("Image URL not found");

    // 2. Download image and save
    const res = await fetch(imageUrl);
    const imageBuffer = await res.arrayBuffer();
    const fileName = `remedy-${Date.now()}.png`;
    const folderPath = path.resolve("images");
    const filePath = path.join(folderPath, fileName);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, Buffer.from(imageBuffer));
    console.log("✅ Image Saved:", filePath);

    return {
      status: 200,
      message: "Image and title generated successfully.",
      filePath,
    };
  } catch (err) {
    console.error("❌ Generation failed:", err.message);
    throw new Error("AI metadata generation failed.");
  }
};
