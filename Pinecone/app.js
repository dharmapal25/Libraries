const express = require("express");
const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config()

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

console.log(process.env.PINECONE_API_KEY)

let pcIndex = pinecone.Index("demo-index") // same as index name in pinecone


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





pinconeDB();

// demoVectorDB();

app.listen(3000,()=> {
    console.log("Server running..")
})