import { openai } from "../config/openai.js";
import axios from "axios";

const GROK_API_KEY = process.env.GROK_API_KEY;


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



export const chatWithGroq = async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // System prompt for Remote School
    const systemPrompt = `
You are "Remote School Assistant", a friendly AI for AxoraWeb's Remote School software.
Features: Dashboard, Students, Teachers, Parents, Classes, Subjects, Timetable, Homework, Exams, Grades,
Attendance, Fees, Library, Hostel, Transport, Chat, Notifications, Reports, Profile, Settings.
Help users understand these features concisely and professionally.
`;

    // Build messages array for chat API
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversation, // previous messages
      { role: "user", content: message }
    ];

    // Groq chat API request
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions", // ✅ correct endpoint
      {
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // your env key
          "Content-Type": "application/json"
        }
      }
    );

    // Extract reply
    const reply = response.data.choices?.[0]?.message?.content?.trim() || "No response";

    res.json({ success: true, reply });

  } catch (error) {
    console.error("Groq AI error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "AI request failed" });
  }
};
