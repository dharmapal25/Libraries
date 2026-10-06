import asyncio
import io
import edge_tts
import sounddevice as sd
import soundfile as sf

TEXT = (
    "Arey suniye! Ab humein koi bhi file save karne ki bilkul zaroorat nahi hai. "
    "Main direct memory se stream hokar aapse baat kar rahi hoon. "
    "Awaaz ka flow, pauses, aur conversational tone suniye... "
    "kya yeh sach me kisi robot jaisa lag raha hai?"
)

VOICE = "en-IN-NeerjaNeural"

async def speak_direct(text: str):
    communicate = edge_tts.Communicate(text, voice=VOICE, rate="-7%", pitch="-1Hz")
    audio_data = bytearray()
    
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data.extend(chunk["data"])

    # In-memory buffer se sounddevice ke through direct play
    audio_buffer = io.BytesIO(audio_data)
    data, samplerate = sf.read(audio_buffer)
    sd.play(data, samplerate)
    sd.wait()

if __name__ == "__main__":
    print("AI bol raha hai...")
    asyncio.run(speak_direct(TEXT))
    print("Done!")