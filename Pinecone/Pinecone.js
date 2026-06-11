require('dotenv').config()
const express = require("express");
const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenAI } = require("@google/genai");


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

// console.log(pcIndex)
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
                        text: "My name is Rahul"
                    }
                },
                {
                    id: "user3",
                    values: [1.1, 1.2, 1.3, 2.54],
                    metadata: {
                        text: "i love volleyball!"
                    }
                }
            ]
        });

        // await pcIndex.upsert([
        //     { id: "user2", values: [0.1, 0.2, 0.3, 0.5], metadata: { text: "My name is Rahul" } },
        //     { id: "user3", values: [1.1, 1.2, 1.3, 2.54], metadata: { text: "i love volleyball!" } }
        // ]);

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

// demoVectorDB();

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

        await pcIndex.namespace("user10").upsert({
            records: [
                {
                    id: "user1",
                    values: [0.1, 0.2, 2.3, 0.4],
                    metadata: {
                        text: "i love football!",
                        text_list: [""]
                    }
                }
            ]
        });

        // query with namespace
        let data = await pcIndex.query({
            vector: [0.1, 0.2, 0.3, 0.4],
            topK: 2,
            includeMetadata: true,
            namespace: "user10"
        })

        console.log(data.matches);

    }
    catch (err) {
        console.log(err.message);
    }
    finally {
        console.log("Done!");
    }

}

pinrconeNamespace();



app.listen(4000, () => {
    console.log("Server running..")
})