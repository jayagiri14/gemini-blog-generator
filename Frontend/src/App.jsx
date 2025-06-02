import { useState } from 'react';
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [title, setTitle] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState(400);
  const [outline, setOutline] = useState("");

  // Function to generate outline using backend API
  async function generateOutline() {
    try {
      const response = await axios.post('https://gemini-blog-generator-liy3.onrender.com/ai/get-review', {
        title,
        tone,
        wordCount
      });
      setOutline(response.data);
    } catch (error) {
      console.error("Error generating outline", error);
      setOutline("Something went wrong while generating the outline.");
    }
  }

  return (
    <>
      <h2>📝 Blog Post Outline Generator</h2>
      <main>
        <div className="left">
          <div className="form">
            <label>Title/Topic</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. How to Learn React in 2025"
            />

            <label>Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)}>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="witty">Witty</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>

            <label>Word Count</label>
            <input
              type="number"
              value={wordCount}
              onChange={e => setWordCount(Number(e.target.value))}
              min={100}
              max={2000}
            />

            <div className="generate" onClick={generateOutline}>
              Generate Outline
            </div>
          </div>
        </div>

        {/* Right section for displaying the generated outline */}
        <div className="right">
          <h3>Generated Outline:</h3>
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {outline}
          </Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
