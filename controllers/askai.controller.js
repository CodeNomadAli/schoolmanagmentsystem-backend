import {
  client,
  model,
  isUnexpected,
  endpoint,
  token,
} from "../config/ask.ai.js";

export const askAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing message." });
  }

  try {
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
            role: "system",
            content: `
You are a health and natural remedy assistant. 
Only answer questions that are related to natural remedies, health issues, herbal treatments, symptoms, or healing approaches.
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
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || "Unknown error from AI";
      return res
        .status(response.status)
        .json({ success: false, message: errorMsg });
    }

    const choices = data?.choices;
    const aiMessage = choices?.[0]?.message?.content;

    if (!aiMessage) {
      console.log(
        "⚠️ Raw AI response (no message):",
        JSON.stringify(data, null, 2)
      );
      return res
        .status(502)
        .json({ success: false, message: "No valid message returned by AI." });
    }

    return res.status(200).json({ success: true, reply: aiMessage });
  } catch (err) {
    console.error("❌ AI call failed:", err.message || err);
    return res.status(500).json({ success: false, message: "AI server error" });
  }
};
