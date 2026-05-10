const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const detectFood = async (base64Image) => {

  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const response = await client.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 500,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: cleanBase64
          }
        },
        {
          type: "text",
          text: "Identify food and return JSON with food_name and calories"
        }
      ]
    }]
  });

  const text = response.content[0].text;

  try {
    return JSON.parse(text);
  } catch {
    return { food_name: "Unknown", calories: 200 };
  }
};

module.exports = { detectFood };