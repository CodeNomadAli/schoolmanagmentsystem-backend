import { openai } from "../config/openai.js";

export const askAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Missing message.",
    });
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `
You are a health and natural remedy assistant. 
Only answer questions related to natural remedies, health issues, herbal treatments, symptoms, or healing approaches.
If the user asks something unrelated (like coding, news, celebrities, or random topics), politely reply:
"I'm here to help with remedies and health-related questions only."
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      top_p: 1,
    });

    const aiMessage = response.choices?.[0]?.message?.content?.trim();

    if (!aiMessage) {
      console.error(
        "⚠️ No valid AI message:",
        JSON.stringify(response, null, 2)
      );
      return res.status(502).json({
        success: false,
        message: "No valid message returned by AI.",
      });
    }

    return res.status(200).json({
      success: true,
      reply: aiMessage,
    });
  } catch (err) {
    console.error("❌ AI call failed:", err);
    return res.status(500).json({
      success: false,
      message: "AI server error",
    });
  }
};
