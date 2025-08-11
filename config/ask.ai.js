import { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import createClient from "@azure-rest/ai-inference";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.OPENAI_API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

if (!token) {
  throw new Error("❌ OPENAI_TOKEN is missing in .env");
}

const client = createClient(endpoint, new AzureKeyCredential(token));

export { client, model, isUnexpected,endpoint,token };
