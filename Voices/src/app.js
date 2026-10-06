import { KokoroTTS } from "kokoro-js";

async function talkDirectly() {
  console.log("Loading model...");
  const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
    dtype: "q8",
    device: "wasm" // Browser ke liye
  });

  const text = 
    "Hey! Ab koi bhi file save nahi ho rahi hai. " +
    "Main direct browser ke audio context se aapse live baat kar rahi hoon. " +
    "Kahi koi robot jaisi stiffness nahi hai, bilkul natural cadence hai.";

  console.log("Speaking...");
  // Direct speech generation
  const audio = await tts.generate(text, { voice: "af_heart" });

  // Web Audio Context se direct speaker me play (No file saved)
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(await audio.toBlob().arrayBuffer());

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}