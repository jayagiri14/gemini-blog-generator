import { useState } from 'react';
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000'
function App() {
  const [title, setTitle] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState(400);
  const [outline, setOutline] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Function to generate outline using backend API
  async function generateOutline() {
    try {
      console.log('BACKEND_URI:', BACKEND_URI);
      console.log('Form data:', { title, tone, wordCount });
      
      if (!title.trim()) {
        alert('Please enter a title/topic first!');
        return;
      }
      
      const response = await axios.post(`${BACKEND_URI}/ai/get-review`, {
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

  // Function to export as HTML
  async function exportAsHTML() {
    if (!outline) {
      alert("Please generate an outline first!");
      return;
    }

    try {
      setIsExporting(true);
      const response = await axios.post(`${BACKEND_URI}/ai/export-html`, {
        title,
        outline,
        tone
      }, {
        responseType: 'blob'
      });

      // Create a download link
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_outline.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting to HTML", error);
      alert("Something went wrong while exporting to HTML.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <>
      <h2>📝 Blog Post Outline Generator</h2>
      <main className={!outline ? 'no-outline' : ''}>
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

            {outline && (
              <div className="generate" onClick={exportAsHTML} style={{ 
                marginTop: '10px', 
                backgroundColor: '#28a745',
                opacity: isExporting ? 0.6 : 1,
                cursor: isExporting ? 'not-allowed' : 'pointer'
              }}>
                {isExporting ? "Exporting..." : "📄 Export as HTML"}
              </div>
            )}
          </div>
        </div>

        {/* Right section for displaying the generated outline */}
        {outline && (
          <div className="right">
            <h3>Generated Outline:</h3>
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {outline}
            </Markdown>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
