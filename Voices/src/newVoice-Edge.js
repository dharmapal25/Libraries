import { EdgeTTS } from "edge-tts-node";
import fs from "fs";

async function main() {
  const tts = new EdgeTTS();

  const text = 
    "Arey suniye, yeh Node.js me direct Microsoft ki neural voice generate kar raha hai. " +
    "Isme na koi token limit hai, na koi setup error. Conversation ekdum clear aur human sound karti hai.";

  // Indian English: 'en-IN-NeerjaNeural' (Conversational Female)
  // US English: 'en-US-JennyNeural' ya 'en-US-ChristopherNeural'
  const audioBuffer = await tts.synthesize(text, "en-IN-NeerjaNeural", {
    rate: "-6%",   // Human conversational pacing
    pitch: "-1Hz"
  });

  fs.writeFileSync("output.mp3", audioBuffer);
  console.log("Audio saved: output.mp3");
}

main();