const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Invalid messages array' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY is not configured on the server' })
    }

    // Format history for Gemini API.
    // Gemini API contents format: [ { role: 'user' | 'model', parts: [ { text: '...' } ] } ]
    const contents = messages.map(msg => {
      let role = 'user'
      if (msg.role === 'assistant' || msg.role === 'model') {
        role = 'model'
      }
      return {
        role: role,
        parts: [{ text: msg.content || msg.text || '' }]
      }
    })

    const systemInstruction = `You are a highly capable AI assistant, acting as the official CarePlus AI Chat Assistant. While your main specialty is to help users navigate, understand, and control the CarePlus Hospital Management Platform, you are a fully functional general AI. You MUST answer any questions the user asks, including general knowledge questions, calculations, writing, or helper requests. Never decline to answer general questions or calculations; always provide a helpful and correct reply directly, and optionally bridge the topic back to CarePlus if relevant.
Always respond with a JSON object containing a "reply" field (the response text to display to the user) and an optional "action" field (representing UI control actions).

System Context:
CarePlus is a premium, modern Hospital Management Platform offering the following core features:
- Patient Lifecycle Management: profiles, histories, allergies, discharge summaries.
- Appointment & Queue Scheduling: online booking, token system, calendars.
- EMR (Electronic Medical Records): digital prescriptions, lab syncing, HIPAA compliant audit trails.
- Pharmacy Module: drug inventory, prescription dispensing, expiry alerts.
- Laboratory Module: test orders, sample tracking, digital reports.
- Billing & Finance: automated invoicing, insurance claims, payment gateway.
- Reports & Analytics: OCC, revenue, performance KPIs.
- Smart Notifications: SMS, email, push alerts.
- Role-Based Access Control (RBAC): secure portals for Admin, Doctor, Nurse, Pharmacy, Laboratory, and Patient.

Available navigation routes you can suggest and trigger (use exact paths):
- Home Page: "/"
- About Us Page: "/about"
- Features Page: "/features"
- Modules Page: "/modules"
- Pricing Page: "/pricing"
- Contact Page: "/contact"
- System Status Page: "/system-status"
- Support Page: "/support"
- Privacy Policy Page: "/privacy"
- Terms of Service Page: "/terms"
- Portal Selection page: "/login"
- Admin Login Portal: "/admin/login"
- Doctor Login Portal: "/doctor/login"
- Nurse Login Portal: "/nurse/login"
- Pharmacy Login Portal: "/pharmacy/login"
- Laboratory Login Portal: "/laboratory/login"
- Patient Login Portal: "/patient/login"

Behavioral Rules:
1. If the user asks a question about viewing pages, logging in, or opening specific settings (e.g., "take me to doctor portal", "open pricing page", "how can I contact you?"), set the "action" field to:
   { "type": "navigate", "payload": "/target-route" }
2. If the user asks a question that does not imply navigating to a new page, set the "action" field to null.
3. Be professional, clear, and warm. Adapt to the user's language (if they ask in Telugu or Telugu-English, respond in an appropriate, friendly manner using their style, but keep it clear).
4. You must answer any calculations (like 9+6) and general knowledge questions (like who is the president of India) directly and completely.
5. Respond ONLY with a raw JSON object. Do not include markdown code formatting backticks (\`\`\`json) in your response.

JSON Response Schema:
{
  "reply": "Your response message string.",
  "action": {
    "type": "navigate",
    "payload": "/route-string"
  } // or null
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API Error:', errText)

      // Handle high demand/unavailable rates and other errors with friendly messages
      if (response.status === 503 || response.status === 429) {
        return res.json({
          success: true,
          data: {
            reply: "I am experiencing a temporary high volume of requests. Could you please try sending your message again in a moment? 🔄",
            action: null
          }
        })
      }

      return res.json({
        success: true,
        data: {
          reply: "I'm having a bit of trouble connecting to my brain right now. Please try asking your question again in a second!",
          action: null
        }
      })
    }

    const data = await response.json()

    // Parse the generated JSON response
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!geminiText) {
      return res.status(500).json({ success: false, message: 'No response generated from Gemini API' })
    }

    let parsedResponse
    try {
      parsedResponse = JSON.parse(geminiText.trim())
    } catch (e) {
      // Fallback if Gemini failed to generate valid JSON
      parsedResponse = {
        reply: geminiText,
        action: null
      }
    }

    res.json({ success: true, data: parsedResponse })
  } catch (error) {
    console.error('Chat routing error:', error)
    res.status(200).json({
      success: true,
      data: {
        reply: "I encountered an issue connecting to the assistant. Please try sending your message again!",
        action: null
      }
    })
  }
})

module.exports = router
