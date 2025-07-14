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

module.exports.exportHTML = async (req, res) => {
    try {
        const { title, outline, tone } = req.body;

        // Input validation
        if (!title) {
            return res.status(400).send("Title is required.");
        }

        if (!outline) {
            return res.status(400).send("Outline is required.");
        }

        // Create a prompt to generate a complete HTML file
        const prompt = `
        Convert the following blog post outline into a complete, well-formatted HTML document:

        Title: ${title}
        Tone: ${tone}
        Outline: ${outline}

        Requirements:
        1. Create a complete HTML5 document with proper DOCTYPE, head, and body
        2. Include modern CSS styling in a <style> tag in the head
        3. Convert the markdown outline to proper HTML elements
        4. Use semantic HTML tags (article, section, h1-h6, p, ul, li, etc.)
        5. Make it visually appealing with good typography and spacing
        6. Use a professional color scheme
        7. Make it responsive
        8. Include the title as an h1 element
        9. Format headings and bullet points properly
        10. Add some basic styling for code blocks if any exist

        Return only the HTML code, no explanations.
        `;

        const htmlContent = await aiService(prompt);

        // Set headers for HTML file download
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_outline.html"`);
        
        res.send(htmlContent);

    } catch (error) {
        console.error("Error generating HTML export:", error);
        res.status(500).send("Something went wrong while generating the HTML file.");
    }
}