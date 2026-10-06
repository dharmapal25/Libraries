import { spawn } from "child_process";

const text = 
  "Arey suniye! Ab kisi package constructor ka jhanjhat hi nahi hai. " +
  "Main direct speaker se aapse baat kar rahi hoon bina koi file save kiye. " +
  "Listen to this natural voice cadence, bilkul insaan jaisi baat cheet.";

function talkDirectly(message) {
  console.log("AI bol raha hai (Direct playback)...");

  // edge-playback Python ke sath built-in aata hai aur direct speaker me stream karta hai
  const child = spawn("edge-playback", [
    "--voice", "en-IN-NeerjaNeural",
    "--rate=-6%",
    "--text", message
  ], { shell: true });

  child.stderr.on("data", (data) => {
    // Agar koi notice ho
  });

  child.on("close", (code) => {
    console.log("Baat complete ho gayi!");
  });
}

talkDirectly(text);