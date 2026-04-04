export const getAIAdvice = async (species, category) => {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a wildlife expert. Always explain clearly, simply, and specifically. Avoid generic advice.",
          },
          {
            role: "user",
            content: `
User detected: ${species} ${category ? `(Type: ${category})` : ""}.

Respond in this format:

What it is:
- One short sentence explaining the organism

Risk level:
- Say clearly: none, low, medium, or high

What to do:
- 2 short bullet points with specific actions

Keep it concise and relevant to the species.
`,
          },
        ],
      }),
    });

    const data = await res.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("AI response error:", data);
      return "Unable to generate guidance. Likely harmless—observe from a distance.";
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("AI error:", err);
    return "Unable to generate guidance. Likely harmless—observe from a distance.";
  }
};
