require("dotenv").config();
const express = require("express");
const { Pinecone } = require("@pinecone-database/pinecone");
const { GoogleGenAI } = require("@google/genai");
const { Groq } = require("groq-sdk/client.js");
const crypto = require("crypto");

const app = express();
app.use(express.json());


// Initialize Pinecone
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

// Initialize Gemini (Google GenAI)
const gemini = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Create a reference to the Pinecone index
let pcIndex = pinecone.Index("user-memory"); // same as index name in Pinecone


// embedding function to convert text to vector
async function getEmbedding(text) {
    const response = await gemini.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: {
            outputDimensionality: 768 // specify the dimensionality of the embedding vector
        }
    });

    // Find the embedding with the correct dimensionality
    const embedding = response.embeddings.find(e => e.values.length === 768);

    return response.embeddings[0].values;
}



app.post("/question", async (req, res) => {

    try {
        const { question, userId } = req.body;

        // Step 1: Get the embedding for the question
        const questionEmbedding = await getEmbedding(question);

        // Step 2: Query Pinecone for relevant data
        const queryResponse = await pcIndex.namespace("users_memories").query({
            vector: questionEmbedding,
            topK: 5, // number of relevant results to retrieve
            includeMetadata: true,
            filter: {
                userId: { "$eq": userId }
            }
        });

        console.log("Done");

        // Step 3: Use the retrieved data to generate an answer with Gemini
        const relevantData = queryResponse.matches.map(match => match.metadata.text).join("\n");
        console.log("relevantData from pinecone: ", relevantData);


        // (info + question)  context for the LLM
        const context = `Relevant data:\n${relevantData}\n\nQuestion: ${question}`;


        // Prompt for the LLM (Relevant data + question) to generate an answer and decide if the memory should be saved
        const prompt = `
You are an AI assistant.

Available Memories:
${context || "No memories"}

User Message:
${question}

Tasks:

1. Decide if the user's message contains long-term memory worth saving. like, name, preferences, important events, etc. If it does, extract that memory. If not, ignore it.

2. Answer the user's message.

Return ONLY valid JSON:

{
  "save": true,
  "memory": "User is learning MERN",
  "answer": "That's great! MERN is a popular stack."}
  `;


        // Step 4: Generate an answer using Groq
        const answerResponse = await groq.chat.completions.create({
            model: process.env.AI_GROQ_MODEL, // specify the Groq model to use
            messages: [
                { role: "system", content: "You are a helpful assistant that answers questions based on the provided context." },
                { role: "user", content: prompt }
            ]
        });
        res.json(answerResponse.choices[0].message.content);


        // Step 5: If the response indicates to save the memory, store it in Pinecone

        let memoryCondition = JSON.parse(answerResponse.choices[0].message.content);

        console.log("memoryCondition: ", memoryCondition.save);
        if (memoryCondition.save) {
            const memoryText = memoryCondition.memory;
            const memoryEmbedding = await getEmbedding(memoryText);

            await pcIndex.namespace("users_memories").upsert({
                records: [
                    {
                        id: `user-${crypto.randomUUID()}`, // unique ID for the memory like mongoDB ObjectId
                        values: memoryEmbedding,
                        metadata: {
                            userId: userId, // for filtering memories by user
                            text: memoryText,
                            timestamp: new Date().toISOString()
                        }
                    }
                ]
            });
        }



    } catch (error) {
        console.error("Error processing question:", error);
        res.status(500).json({ error: "An error occurred while processing the question." });

    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});