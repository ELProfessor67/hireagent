from settings import ULTRAVOX_API_KEY
import requests

# Ultravox defaults
ULTRAVOX_MODEL         = "fixie-ai/ultravox-70B"
ULTRAVOX_VOICE         = "Tanya-English"   # or “Mark”
ULTRAVOX_SAMPLE_RATE   = 8000        
ULTRAVOX_BUFFER_SIZE   = 60   

#
# Helper: Create an Ultravox serverWebSocket call
#
async def create_ultravox_call(system_prompt: str, first_message: str,selectedTools) -> str:
    """
    Creates a new Ultravox call in serverWebSocket mode and returns the joinUrl.
    """

    url = "https://api.ultravox.ai/api/calls"
    headers = {
        "X-API-Key": ULTRAVOX_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "systemPrompt": system_prompt,
        "model": ULTRAVOX_MODEL,
        "voice": ULTRAVOX_VOICE,
        "temperature":0.1,
        "initialMessages": [
            {
                "role": "MESSAGE_ROLE_USER",  
                "text": first_message
            }
        ],
        "medium": {
            "serverWebSocket": {
                "inputSampleRate": ULTRAVOX_SAMPLE_RATE,   
                "outputSampleRate": ULTRAVOX_SAMPLE_RATE,   
                "clientBufferSizeMs": ULTRAVOX_BUFFER_SIZE
            }
        },
        "selectedTools": selectedTools
    }
    print(selectedTools)
    # print("Creating Ultravox call with payload:", json.dumps(payload, indent=2))  # Enhanced logging

    try:
        resp = requests.post(url, headers=headers, json=payload)
        if not resp.ok:
            print("Ultravox create call error:", resp.status_code, resp.text)
            return ""
        body = resp.json()
        join_url = body.get("joinUrl") or ""
        print("Ultravox joinUrl received:", join_url)  # Enhanced logging
        return join_url
    except Exception as e:
        print("Ultravox create call request failed:", e)
        return ""




