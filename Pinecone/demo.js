require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const { Pinecone } = require("@pinecone-database/pinecone");
const crypto = require("crypto");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index("chat-memory");

// =========================
// EMBEDDING
// =========================
async function getEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return response.embeddings[0].values;
}

// =========================
// MEMORY EXTRACTOR
// =========================
async function extractMemory(userMessage) {
  const prompt = `
You are a memory extractor.

Extract only long-term useful information.

Examples:
"My name is Flash"
→ save

"I like MERN stack"
→ save

"What is JavaScript?"
→ don't save

Return ONLY JSON.

{
  "save": true,
  "memory": "..."
}

User Message:
${userMessage}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  try {
    return JSON.parse(response.text);
  } catch {
    return {
      save: false,
      memory: null,
    };
  }
}

// =========================
// SAVE MEMORY
// =========================
async function saveMemory(userId, message) {
  const extracted = await extractMemory(message);

  if (!extracted.save) {
    console.log("Nothing to save");
    return;
  }

  const vector = await getEmbedding(extracted.memory);

  await index.namespace(userId).upsert([
    {
      id: crypto.randomUUID(),
      values: vector,
      metadata: {
        text: extracted.memory,
      },
    },
  ]);

  console.log("Memory Saved");
}

// =========================
// RETRIEVE MEMORY
// =========================
async function retrieveMemory(userId, question) {
  const queryVector = await getEmbedding(question);

  const result = await index.namespace(userId).query({
    vector: queryVector,
    topK: 5,
    includeMetadata: true,
  });

  return result.matches.map(
    item => item.metadata.text
  );
}

// =========================
// CHAT
// =========================
async function chat(userId, question) {
  const memories = await retrieveMemory(
    userId,
    question
  );

  const context = memories.join("\n");

  const prompt = `
Memory Context:
${context}

User Question:
${question}

Answer naturally.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

// =========================
// DEMO
// =========================
(async () => {
  const userId = "flash123";

  await saveMemory(
    userId,
    "My name is Flash"
  );

  await saveMemory(
    userId,
    "I like MERN stack"
  );

  const answer = await chat(
    userId,
    "What technology do I like?"
  );

  console.log(answer);
})();