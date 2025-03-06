import aiohttp
import asyncio
from settings import BACKEND_URL

async def send_minutely_request(config,data,websocket):
    while True:
        if not config["session"] or not config["session"].get("is_active", True):
            print("Call disconnected, stopping minutely requests.")
            break

        await asyncio.sleep(60)
        json = data.copy()
        try:
            async with aiohttp.ClientSession() as session:
                print("request sending...")
                async with session.post(f"{BACKEND_URL}/api/configs/cut-credits", json=json) as response:
                    data = await response.text()
                    print("Response:", data)

                    # Check if credits are exhausted and close the WebSocket
                    if response.status == 401 and data.get("creditsEnd"):
                        print("Closing WebSocket due to no more credits.")
                        await websocket.close()


        except Exception as e:
            print(f"Error sending minutely request: {e}")
        
        

