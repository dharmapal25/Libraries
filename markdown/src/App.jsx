import React from "react";

// Used to render Markdown
import ReactMarkdown from "react-markdown";

// Used for GitHub style markdown (tables, lists, etc.)
import remarkGfm from "remark-gfm";

// Used to highlight code
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// Dark theme for code
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown from "react-markdown";

function App() {

  // AI response in Markdown format
  const message = `
# Hello Flash 👋

This is **bold text**.

## Python Example

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

### List

- Apple
- Mango
- Banana
`;



  return (
    <div
      style={{
        width: "800px",
        margin: "30px auto",
        padding: "20px",
        background: "#202123",
        color: "white",
        borderRadius: "10px",
      }}
    >
      {/* Convert Markdown into HTML */}
      {/* <ReactMarkdown

        // Enable GitHub Markdown
        remarkPlugins={[remarkGfm]}

        // Custom rendering
        components={{

          // This function is called whenever Markdown finds a code block
          code({ inline, className, children }) {

            // Find language (python, javascript, etc.)
            const match = /language-(\w+)/.exec(className || "");

            // If it is a code block
            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  language={match[1]}
                  style={oneDark}
                >
                  {String(children)}
                </SyntaxHighlighter>
              );
            }

            // Normal inline code
            return <code>{children}</code>;
          },
        }}
      >
        {message}
      </ReactMarkdown> */}




      <ReactMarkdown>
        {message}
      </ReactMarkdown>

    </div>
  );
}

export default App;