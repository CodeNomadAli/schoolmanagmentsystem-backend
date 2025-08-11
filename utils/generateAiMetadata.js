import { openai } from "../config/openai.js";
import slugify from "./slugify.js";
import Remedy from '../models/remedy.model.js';


export const generateTitle = async (description) => {
  
  const response = await openai.responses.create({
    model: "gpt-5",
    input:  `Write a short and catchy remedy title only 4 to 6 words  for this: ${description}`
  });

  const slug = slugify(response.output_text)

  const remedy = await Remedy.findOne({ slug });
  if (remedy) {
    return generateTitle(description)
  }




  if (!response.output_text) {
    console.error("⚠️ AI returned no title:", JSON.stringify(data, null, 2));
    throw new Error("Failed to generate remedy title.");
  }

  return response.output_text;
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