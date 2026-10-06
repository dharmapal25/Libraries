import asyncio
import io
import edge_tts
import sounddevice as sd
import soundfile as sf

# 1. Natural phrasing, pauses aur conversational rhythm ke sath text
TEXT = (
    "Hey! Ab suno... koi compiler error nahi aayega. "
    "Main direct memory se stream hokar aapse naturally baat kar rahi hoon. "
    "Dekha? Awaaz kitni soft aur human-like lag rahi hai — "
    "na koi robotic stretch, na koi artificial rush."
)

# 2. Top-tier Natural Voices:
# 'en-US-AvaMultilingualNeural' -> Sabse human-like, expressive aur soft (Hindi + English dono perfectly handle karti hai)
# 'en-US-AndrewMultilingualNeural' -> Real conversational male voice
# 'hi-IN-SwaraNeural' -> Natural Indian Hindi tone
# VOICE = "en-US-AvaMultilingualNeural"
# VOICE = "hi-IN-SwaraNeural"
VOICE = "en-US-AvaMultilingualNeural"

async def speak_direct(text: str):
    # rate="-4%" aur pitch="-2Hz" robotic sharpness ko warm human voice me badal deta hai
    communicate = edge_tts.Communicate(
        text, 
        voice=VOICE, 
        rate="-4%", 
        pitch="-2Hz"
    )
    
    audio_data = bytearray()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data.extend(chunk["data"])

    # In-memory zero-latency playback
    audio_buffer = io.BytesIO(audio_data)
    data, samplerate = sf.read(audio_buffer)
    sd.play(data, samplerate)
    sd.wait()

if __name__ == "__main__":
    print("AI bol raha hai (Natural Human Cadence)...")
    asyncio.run(speak_direct(TEXT))
    print("Done!")