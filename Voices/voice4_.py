import asyncio
import io
import edge_tts
import sounddevice as sd
import soundfile as sf

# Natural conversational text
# TEXT = (
#     "Hey! Ab koi compiler error nahi aayega. "
#     "Main direct memory se live stream hokar aapse naturally baat kar raha hoon. "
#     "Bina kisi extra heavy setup ke, yeh voice kafi smooth aur realistic sound karti hai."
# )

# TEXT = ("Database Management System (DBMS): A software program that acts as the interface between the database and its users or programs, allowing people to create, read, update, and delete data.")
TEXT = ("Mera naam Flash hai aur main ek simple, positive aur hard-working person hoon. Mujhe nayi cheezein seekhna aur logon se connect karna bohot pasand hai. Main hamesha apne goals ko achieve karne ke liye mehnat karta hoon aur apni life ko full energy ke saath jeeta hoon.")

# Best natural voices:
# 'en-IN-NeerjaNeural' (Female conversational)
# 'en-IN-PrabhatNeural' (Male conversational)
# VOICE = "en-IN-PrabhatNeural"
# VOICE = "en-IN-NeerjaNeural"
# VOICE = "en-US-AvaMultilingualNeural"
VOICE = "en-IN-SwaraNeural"

async def speak_direct(text: str):
    # communicate = edge_tts.Communicate(text, voice=VOICE, rate="-6%", pitch="-1Hz")
    communicate = edge_tts.Communicate(text, voice=VOICE, rate="-1%", pitch="-1Hz")
    audio_data = bytearray()
    
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data.extend(chunk["data"])

    # In-memory playback (Zero disk save)
    audio_buffer = io.BytesIO(audio_data)
    data, samplerate = sf.read(audio_buffer)
    sd.play(data, samplerate)
    sd.wait()

if __name__ == "__main__":
    print("Speaking directly from memory...")
    asyncio.run(speak_direct(TEXT))
    print("Done!")