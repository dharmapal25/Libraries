import asyncio
import edge_tts

# Conversational dialogue: notice the commas, pauses, and casual tone
CONVERSATION_TEXT = (
    "Hey! Oh, don't worry about it, I totally get what you mean. "
    "To make a chat feel alive... you really need natural pauses and softer tones. "
    "Listen to this pacing — it doesn't sound stiff or scripted at all, right?"
)

# Natural conversational Indian-English voice
VOICE = "en-IN-NeerjaNeural"
OUTPUT_FILE = "natural_chat.mp3"

async def generate_natural_voice():
    # rate="-8%" gives natural human conversational speed
    # pitch="-1Hz" slightly deepens the tone so it doesn't sound sharp/metallic
    communicate = edge_tts.Communicate(
        CONVERSATION_TEXT,
        voice=VOICE,
        rate="-8%",
        pitch="-1Hz"
    )
    await communicate.save(OUTPUT_FILE)
    print("Conversational audio generated: natural_chat.mp3")

if __name__ == "__main__":
    asyncio.run(generate_natural_voice())