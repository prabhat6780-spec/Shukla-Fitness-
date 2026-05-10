const express = require("express")
const router = express.Router()
const groq = require("../ai/groqClient")

router.post("/chat", async (req, res) => {
  try {
    const { system, messages } = req.body

    console.log("CHAT ROUTE HIT ✓")

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        ...messages
      ],
      max_tokens: 1024
    })

    const text = completion.choices[0].message.content

    // Return in Groq shape
    res.json({
      choices: [{ message: { content: text } }]
    })

  } catch (error) {
    console.log("GROQ CHAT ERROR →", error.message)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router