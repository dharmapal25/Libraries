# import asyncio
# import edge_tts

# TEXT = (
#     "Hey there! I am your AI assistant. "
#     "Unlike older, robotic voices, neural text-to-speech adapts naturally "
#     "to punctuation, conversational cadence, and human phrasing. "
#     "You can easily plug this audio straight into your chat application."
# )

# # Best voices:
# # 'en-IN-NeerjaNeural' (Indian English Female)
# # 'en-IN-PrabhatNeural' (Indian English Male)
# # 'en-US-ChristopherNeural' / 'en-US-JennyNeural' (US English)
# # 'hi-IN-SwaraNeural' / 'hi-IN-MadhurNeural' (Hindi)
# VOICE = "en-IN-NeerjaNeural"
# OUTPUT_FILE = "demo_voice.mp3"

# async def generate_speech():
#     # rate="-5%" se voice thodi grounded aur calm lagti hai, pitch normal rehti hai
#     communicate = edge_tts.Communicate(TEXT, VOICE, rate="-5%", pitch="+0Hz")
#     await communicate.save(OUTPUT_FILE)
#     print(f"Audio generated successfully: {OUTPUT_FILE}")

# if __name__ == "__main__":
#     asyncio.run(generate_speech())



