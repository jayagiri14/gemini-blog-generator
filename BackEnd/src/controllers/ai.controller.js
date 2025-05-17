const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {

    const { title, tone, wordCount } = req.body;
     // Input validation
    if (!title) {
        return res.status(400).send("Title is required.");
    }

    if (!tone) {
        return res.status(400).send("Tone is required.");
    }

    if (!wordCount || isNaN(wordCount)) {
        return res.status(400).send("A valid word count is required.");
    }

    const prompt = `
    Generate a blog post outline for the topic:
    "${title}"

    Tone: ${tone}
    Target Word Count: Approximately ${wordCount} words

    Please follow this format:
    1. A short introduction (2–4 sentences)
    2. 4–6 section headings with 2–4 bullet points each
    3. Markdown formatting (### Headings, - bullets)
    4. Adapt style to the requested tone
    `;

    const response = await aiService(prompt);


    res.send(response);

}