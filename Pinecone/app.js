require('dotenv').config()
const express = require("express");
const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenAI } = require("@google/genai");
const { Groq } = require("groq-sdk/client.js");

const app = express();
app.use(express.json())

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

// User
//  ↓
// Embedding
//  ↓
// Pinecone
//  ↓
// Relevant Data
//  ↓
// LLM (Gemini)
//  ↓
// Answer

const gemini = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

console.log(process.env.PINECONE_API_KEY)

let pcIndex = pinecone.Index("demo-index") // same as index name in pinecone

console.log(pcIndex)
async function demoVectorDB() {
    try {

        // to check the stats of the index
        const stats = await pcIndex.describeIndexStats();
        // console.log(stats);

        // insert & update data in the index
        await pcIndex.upsert({
            records: [
                {
                    id: "user2",
                    values: [0.1, 0.2, 0.3, 0.5],
                    metadata: {
                        text: "My name is Jod"
                    }
                },
                {
                    id: "user3",
                    values: [1.1, 1.2, 1.3, 2.54],
                    metadata: {
                        text: "i love cooking!"
                    }
                }
            ]
        });

        // query the index
        let data = await pcIndex.query({
            vector: [0.1, 0.2, 0.3, 0.4],
            topK: 1,
            includeMetadata: true,
        })

        console.log(data.matches)


    } catch (err) {
        console.log(err);
    }
}


async function pinrconeNamespace() {

    // upsert with namespace

    try {
        console.log("Loading...");

        await pcIndex.namespace("user10").upsert({
            records: [
                {
                    id: "user1",
                    values: [0.1, 0.2, 0.3, 0.4],
                    metadata: {
                        text: "My name is John"
                    }
                }
            ]
        });

        // query with namespace
        let data = await pcIndex.query({
            vector: [0.1, 0.2, 0.3, 0.4],
            topK: 1,
            includeMetadata: true,
            namespace: "user10"
        })

        console.log(data);

    }
    catch (err) {
        console.log(err.message);
    }
    finally {
        console.log("Done!");
    }

}


// pinrconeNamespace();


















// pinecone + gemini embedding 

async function pinconeDB() {
    try {

        // Generate Embedding

        let EmbeddingValue = await gemini.models.embedContent({
            model: 'gemini-embedding-2',
            contents: [
                'explain react',
            ],
            config: {
                outputDimensionality: 4 // 4 Dimensions in the output vector
            }
        })

        console.log(EmbeddingValue)

        let arr = EmbeddingValue.embeddings[0].values // 4 Dimensions


        // Save in Pinecone

        await pcIndex.upsert({
            records: [
                {
                    id: "user7",
                    values: arr,
                    metadata: {
                        text: "explain react"
                    }
                },

            ]
        })

        // Search using that vector

        let fetchData = await pcIndex.query({
            vector: [0.7757765, 0.38812122, 0.4695125, 0.16459285],
            includeMetadata: true,
            topK: 2 // topK is the number of similar results you want to fetch
        })

        console.log(fetchData.matches);


    } catch (err) {
        console.log("ERROR : ", err.message)
    }

}




// pinecone + gemini embedding + gemini LLM

// user message -> embedding -> pinecone -> relevant data + user message -> LLM (Gemini) -> answer

// =========================

// EXTRACT MEMORY

// mera naam Flash hai -> gemnini -> {"save": true, "memory": "mera naam Flash hai"} 
//          true -> embedding -> pinecone   +   chats history -> mongodb

// what is react? -> 
// gemnini -> {"save": false, "memory": null} 
//          false -> no embedding -> no pinecone   +   chats history -> mongodb


// ---- Retrieve Memory ----

// mera naam kya hai? -> gemnini -> {"save": false, "memory": "mera naam kya hai?"}
//          true -> embedding -> pinecone search using the memory as query -> relevant data from pinecone   +   chats history -> mongodb    


// Implementation of the above flow

// Question
//    ↓
// Embedding
//    ↓
// Pinecone Search
//    ↓
// TopK = 3
//    ↓
// Score Filter
//    ↓
// Relevant Memories
//    ↓
// Context Build
//    ↓
// Gemini
//    ↓
// Output


app.post("/chat", async (req, res) => {
    try {

        // question from user

        let { message } = req.body;


        // embedding
        let EmbeddingValue = await gemini.models.embedContent({
            model: 'gemini-embedding-2',
            contents: [
                message,
            ],
            config: {
                outputDimensionality: 4 // 4 Dimensions in the output vector
            }
        })

        let arr = EmbeddingValue.embeddings[0].values // 4 Dimensions


        // pinecone search
        let fetchData = await pcIndex.query({
            vector: arr,
            includeMetadata: true,
            topK: 3 // topK is the number of similar results you want to fetch
        })


        // score filter
        let relevantMemories = fetchData.matches.filter(item => item.score > 0.5);


        // context build
        let context = `MEMORIES: 
        ${relevantMemories.map(item => `- 
        ${item.metadata.text}`)
                .join("\n")}`;


        // gemini

        // first prompt
        // const prompt = `Memory Context: ${context}
        // User Question: ${message} Answer naturally.`

        // second prompt
        const prompt = `
You are an AI assistant.

Available Memories:
${context || "No memories"}

User Message:
${message}

Tasks:

1. Decide if the user's message contains long-term memory worth saving. like, name, preferences, important events, etc. If it does, extract that memory. If not, ignore it.

2. Answer the user's message.

Return ONLY valid JSON:

{
  "save": true,
  "memory": "User is learning MERN",
  "answer": "That's great! MERN is a popular stack."}
  `;

        //         const response = await gemini.models.generateContent({
        //             model: "gemini-2.5-flash",
        //             contents: prompt,
        //             config: {
        //                 maxOutputTokens: 500,
        //                 systemInstruction: `You are a helpful AI assistant.
        // Use Memory Context only if relevant to the user's question.
        // If memory is not relevant, ignore it.` }
        //         })

        const response = await groq.chat.completions.create({
            model: process.env.AI_GROQ_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a memory extraction system. Return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0,
            response_format: {
                type: "json_object"
            },
            max_tokens: 200
        });

        // upsert in pinecone if save is true

        console.log(response.choices[0].message.content)
        let result = JSON.parse(response.choices[0].message.content)

        console.log(result.save)
        if (result.save) {

            // embedding
            let EmbeddingValue = await gemini.models.embedContent({
                model: 'gemini-embedding-2',
                contents: [
                    result.memory,
                ],
                config: {
                    outputDimensionality: 4 // 4 Dimensions in the output vector
                }
            })
            let arr = EmbeddingValue.embeddings[0].values // 4 Dimensions


            //     // Save in Pinecone

            await pcIndex.upsert({
                records: [
                    {
                        id: `user-${Date.now()}`, // unique id for each memory
                        values: arr,
                        metadata: {
                            text: result.memory
                        }
                    },
                ]
            })
        }

        res.json({
            answer: result.answer
        });




    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    }

    // Use Memory Context only if relevant to the user's question.
    // If memory is not relevant, ignore it.` }
    // }



});


// with namespace implementation in pinecone

app.post("/userchat", async (req, res) => {

    const { message, userId } = req.body;

    if (!userId || !message) {
        return res.status(400).json({
            error: "userId and message are required"
        });
    }



})


// pendings tasks for the above implementation
// - Dimesion increase in embedding for better results
// - fine-tuning the system instructions and prompt for better memory extraction and answer generation
// - namespace implementation in pinecone for better organization of data
// - MongoDB implementation for chat history and long-term memory storage


// async function FullStack() {
//     try {



//     } catch (err) {
//         console.log("ERROR : ", err.message)
//     }
// }




// pinconeDB();

demoVectorDB();

app.listen(3000, () => {
    console.log("Server running..")
})