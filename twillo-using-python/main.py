from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Response
from fastapi.responses import Response
from settings import PORT, PUBLIC_URL
import asyncio
from services.ultravoxservice import create_ultravox_call
import json
import websockets
import traceback
import base64
import audioop
from services.apiservice import get_assistant_by_number,get_assistant_by_id
import aiohttp
from utils.transformdata import transform_input
from utils.replace_placeholders import replace_placeholders
from fastapi.middleware.cors import CORSMiddleware
from utils.cut_credits import send_minutely_request

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Keep the same session store
sessions = {}
LOG_EVENT_TYPES = [
    'response.content.done',
    'response.done',
    'session.created',
    'conversation.item.input_audio_transcription.completed'
]

def get_required_params(data, tool_name):
    for item in data:
        if item["modelToolName"] == tool_name:
            return [param["name"] for param in item["dynamicParameters"] if param.get("required", False)]
    return []

#root route
@app.get("/")
async def root():
    return {"message": "Twilio + Ultravox Media Stream Server is running!"}




# incoming call web route 
@app.post("/incoming-call-web")
async def incoming_call_web(request: Request):
    """
        Handle the inbound call from Web. 
        - Fetch firstMessage from DB
        - Store session data
    """
    form_data = await request.form()
    print(form_data)
    params = dict(form_data)
    print('Incoming Web call')

    


    assistant_id = params.get('id', '')
    is_test = params.get("isTest",False)
    session_id = params.get("sessionId")
    print('Assistant ID:', assistant_id)


    assistant_data = get_assistant_by_id(assistant_id)

    credits_end = assistant_data.get("creditsEnd")
    if credits_end == True:
         return {"message": "No Credits Left to make a call"}
    
    res_data = assistant_data.get("data")
    function = res_data.get('function')
    instructions = res_data.get('instructions')
    first_message = res_data.get('firstFiller',"")
    placeholders = res_data.get('placeholders',[])
    call_type = res_data.get('type','purchased')
    user_id = res_data.get('userId',None)
    assistant_id = res_data.get('_id',None)

    if user_id == None or assistant_id == None:
        return {"message": "No UserId Found"}

    final_instruction = replace_placeholders(text=instructions,placeholders=placeholders)
    final_first_message = replace_placeholders(text=first_message,placeholders=placeholders)


    model_tool_names = [item["modelToolName"] for item in function]

    # change key name 
    for item in function:
        for param in item.get("dynamicParameters", []):
            if "Dataschema" in param:
                param["schema"] = param.pop("Dataschema")

    # delete id 
    for item in function:
        if '_id' in item:
            del item['_id']
        if 'assistant' in item:
            del item['assistant']
        for param in item.get('dynamicParameters', []):
            if '_id' in param:
                del param['_id']

    print("function",function)

    transform_data = transform_input(function)
    print(transform_data)

    

    # Fetch first message from N8N
    # first_message = "Hello How can i assist you today"
    # Save session
    session = {
        "transcript": "",
        "is_test": is_test,
        "first_message": final_first_message,
        "streamSid": None,
        "assistant_data": res_data,
        "system_prompt": final_instruction,
        "selected_tools": function,
        "transform_data": transform_data,
        "model_tool_names": model_tool_names,
        "call_type": call_type,
        "user_id": user_id,
        "assistant_id": assistant_id
    }

    sessions[session_id] = session

    # Respond with TwiML to connect to /media-stream
    host = PUBLIC_URL
    stream_url = f"{host.replace('https', 'wss')}/web-media-stream" 
    return {"stream_url": stream_url, "session_id": session_id}







# incoming call route 
@app.post("/incoming-call")
async def incoming_call(request: Request):
    """
        Handle the inbound call from Twilio. 
        - Fetch firstMessage from N8N
        - Store session data
        - Respond with TwiML containing <Stream> to /media-stream
    """
    form_data = await request.form()
    twilio_params = dict(form_data)
    print('Incoming call')


    


    caller_number = twilio_params.get('From', 'Unknown')
    called_number =  twilio_params.get('Called', 'Unknown')
    session_id = twilio_params.get('CallSid')
    print('Called Number:', called_number)
    print('Caller Number:', caller_number)
    print('Session ID (CallSid):', session_id)


    assistant_data = get_assistant_by_number(called_number)

    credits_end = assistant_data.get("creditsEnd")
    if credits_end == True:
        print("NO credits")
        twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
        <Response>
        </Response>"""
    
        return Response(content=twiml_response, media_type="text/xml")
         
    
    res_data = assistant_data.get("data")
    function = res_data.get('function')
    instructions = res_data.get('instructions')
    first_message = res_data.get('firstFiller',"")
    placeholders = res_data.get('placeholders',[])
    call_type = res_data.get('type','purchased')
    user_id = res_data.get('userId',None)
    assistant_id = res_data.get('_id',None)

    if user_id == None or assistant_id == None:
        return {"message": "No UserId Found"}


    final_instruction = replace_placeholders(text=instructions,placeholders=placeholders)
    final_first_message = replace_placeholders(text=first_message,placeholders=placeholders)


    model_tool_names = [item["modelToolName"] for item in function]

    # change key name 
    for item in function:
        for param in item.get("dynamicParameters", []):
            if "Dataschema" in param:
                param["schema"] = param.pop("Dataschema")

    # delete id 
    for item in function:
        if '_id' in item:
            del item['_id']
        if 'assistant' in item:
            del item['assistant']
        for param in item.get('dynamicParameters', []):
            if '_id' in param:
                del param['_id']

    print("function",function)

    transform_data = transform_input(function)
    print(transform_data)

    

    # Fetch first message from N8N
    # first_message = "Hello How can i assist you today"
    # Save session
    session = {
        "transcript": "",
        "callerNumber": caller_number,
        "callDetails": twilio_params,
        "first_message": final_first_message,
        "streamSid": None,
        "assistant_data": res_data,
        "system_prompt": final_instruction,
        "selected_tools": function,
        "transform_data": transform_data,
        "model_tool_names": model_tool_names,
        "call_type": call_type,
        "user_id": user_id,
        "assistant_id": assistant_id
    }

    sessions[session_id] = session

    # Respond with TwiML to connect to /media-stream
    host = PUBLIC_URL
    stream_url = f"{host.replace('https', 'wss')}/media-stream"
    
    twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Connect>
                <Stream url="{stream_url}">
                    <Parameter name="firstMessage" value="{first_message}" />
                    <Parameter name="callerNumber" value="{caller_number}" />
                    <Parameter name="callSid" value="{session_id}" />
                </Stream>
            </Connect>
        </Response>"""
    
    return Response(content=twiml_response, media_type="text/xml")





#handle call
@app.websocket("/media-stream")
async def media_stream(websocket: WebSocket):
    """
        Handles the Twilio <Stream> WebSocket and connects to Ultravox via WebSocket.
        Includes transcoding audio between Twilio's G.711 µ-law and Ultravox's s16 PCM.
    """
    await websocket.accept()
    print('Client connected to /media-stream (Twilio)')

    # Initialize session variables
    call_sid = None
    session = None
    stream_sid = ''
    uv_ws = None  # Ultravox WebSocket connection

    config = {
        "call_sid": None,
        "session": None,
        "stream_sid": "",
        "uv_ws": None
    }

    # Define handler for Ultravox messages
    async def handle_ultravox(config):
        nonlocal uv_ws, session, stream_sid, call_sid
        try:
            async for raw_message in config["uv_ws"]:
                if isinstance(raw_message, bytes):
                    # Agent audio in PCM s16le
                    try:
                        mu_law_bytes = audioop.lin2ulaw(raw_message, 2)
                        payload_base64 = base64.b64encode(mu_law_bytes).decode('ascii')
                    except Exception as e:
                        print(f"Error transcoding PCM to µ-law: {e}")
                        continue  # Skip this audio frame

                    # Send to Twilio as media payload
                    try:
                        await websocket.send_text(json.dumps({
                            "event": "media",
                            "streamSid": config["stream_sid"],
                            "media": {
                                "payload": payload_base64
                            }
                        }))
                    except Exception as e:
                        print(f"Error sending media to Twilio: {e}")

                else:
                    # Text data message from Ultravox
                    try:
                        msg_data = json.loads(raw_message)
                        # print(f"Received data message from Ultravox: {json.dumps(msg_data)}")
                    except Exception as e:
                        print(f"Ultravox non-JSON data: {raw_message}")
                        continue

                    msg_type = msg_data.get("type") or msg_data.get("eventType")

                    if msg_type == "transcript":
                        role = msg_data.get("role")
                        text = msg_data.get("text") or msg_data.get("delta")
                        final = msg_data.get("final", False)

                        if role and text:
                            role_cap = role.capitalize()
                            config['session']['transcript'] += f"{role_cap}: {text}\n"
                            print(f"{role_cap} says: {text}")

                            if final:
                                print(f"Transcript for {role_cap} finalized.")

                    elif msg_type == "client_tool_invocation":
                        toolName = msg_data.get("toolName", "")
                        invocationId = msg_data.get("invocationId")
                        parameters = msg_data.get("parameters", {})
                        print(f"Invoking tool: {toolName} with invocationId: {invocationId} and parameters: {parameters}")

                        session = config.get('session',{})
                        model_tool_names = session.get('model_tool_names',[])
                        selected_tools = session.get('selected_tools',[])
                       
                        if toolName in model_tool_names:
                            print(f'Arguments passed to schedule_meeting tool: {parameters}')
                            # Validate required parameters
                            required_params = get_required_params(selected_tools, msg_type)
                            missing_params = [param for param in required_params if not parameters.get(param)]

                            if missing_params:
                                print(f"Missing parameters for schedule_meeting: {missing_params}")

                                # Inform the agent to prompt the user for missing parameters
                                prompt_message = f"Please provide the following information to schedule your meeting: {', '.join(missing_params)}."
                                tool_result = {
                                    "type": "client_tool_result",
                                    "invocationId": invocationId,
                                    "result": prompt_message,
                                    "response_type": "tool-response"
                                }
                                await config["uv_ws"].send(json.dumps(tool_result))
                            else:
                                 # Send data to webhook
                                webhook_url = next((item["webhookURL"] for item in selected_tools if item["modelToolName"] == toolName), None)
                                
                                if webhook_url:
                                    print(f"Sending data to webhook: {webhook_url}")
                                    
                                
                                    try:
                                        async with aiohttp.ClientSession() as session:
                                            async with session.post(webhook_url, json=parameters) as response:
                                                response_text = await response.text()
                                                print(f"Webhook response: {response_text}")
                                    except Exception as e:
                                        print(e)
                                else:
                                    print(f"No webhook URL found for {toolName}")


                    elif msg_type == "state":
                        # Handle state messages
                        state = msg_data.get("state")
                        if state:
                            print(f"Agent state: {state}")

                    elif msg_type == "debug":
                        # Handle debug messages
                        debug_message = msg_data.get("message")
                        print(f"Ultravox debug message: {debug_message}")
                        # Attempt to parse nested messages within the debug message
                        try:
                            nested_msg = json.loads(debug_message)
                            nested_type = nested_msg.get("type")

                            if nested_type == "toolResult":
                                tool_name = nested_msg.get("toolName")
                                output = nested_msg.get("output")
                                print(f"Tool '{tool_name}' result: {output}")


                            else:
                                print(f"Unhandled nested message type within debug: {nested_type}")
                        except json.JSONDecodeError as e:
                            print(f"Failed to parse nested message within debug message: {e}. Message: {debug_message}")

                    elif msg_type in LOG_EVENT_TYPES:
                        print(f"Ultravox event: {msg_type} - {msg_data}")
                    else:
                        print(f"Unhandled Ultravox message type: {msg_type} - {msg_data}")

        except Exception as e:
            print(f"Error in handle_ultravox: {e}")
            traceback.print_exc()

    # Define handler for Twilio messages
    async def handle_twilio():
       
        try:
            while True:
                message = await websocket.receive_text()
                data = json.loads(message)

                if data.get('event') == 'start':
                    config["stream_sid"] = data['start']['streamSid']
                    config["call_sid"] = data['start']['callSid']
                    custom_parameters = data['start'].get('customParameters', {})

                    print("Twilio event: start")
                    print("CallSid:", config["call_sid"])
                    print("StreamSid:", config["stream_sid"])
                    print("Custom Params:", custom_parameters)

                    # Extract first_message and caller_number
                    first_message = custom_parameters.get('firstMessage', "Hello, how can I assist you?")
                    caller_number = custom_parameters.get('callerNumber', 'Unknown')

                    if config["call_sid"] and config['call_sid'] in sessions:
                        call_sid = config["call_sid"]
                        config["session"] = sessions[call_sid]
                        config["session"]["callerNumber"] = caller_number
                        config["session"]["streamSid"] = config["stream_sid"]
                    else:
                        print(f"Session not found for CallSid: {config['call_sid']}")
                        await websocket.close()
                        return

                    print("Caller Number:", caller_number)
                    print("First Message:", first_message)

                    # Create Ultravox call with first_message
                    uv_join_url = await create_ultravox_call(
                        system_prompt=config['session']["system_prompt"],
                        first_message=config['session']["first_message"],
                        selectedTools=config['session']["transform_data"],
                    )

                    if not uv_join_url:
                        print("Ultravox joinUrl is empty. Cannot establish WebSocket connection.")
                        await websocket.close()
                        return

                    # Connect to Ultravox WebSocket
                    try:
                        config["uv_ws"] = await websockets.connect(uv_join_url)
                        print("Ultravox WebSocket connected.")
                    except Exception as e:
                        print(f"Error connecting to Ultravox WebSocket: {e}")
                        traceback.print_exc()
                        await websocket.close()
                        return

                    # Start handling Ultravox messages as a separate task
                    uv_task = asyncio.create_task(handle_ultravox(config))
                    print("Started Ultravox handler task.")

                    #start timer
                    if config["session"].get("call_type") == "purchased":
                        config["session"]["is_active"] = True
                        asyncio.create_task(send_minutely_request(config=config,data={"user_id": config["session"].get("user_id"),"assistant_id":  config["session"].get("assistant_id")},websocket=websocket))
                    

                elif data.get('event') == 'media':
                    # Twilio sends media from user
                    payload_base64 = data['media']['payload']

                    try:
                        # Decode base64 to get raw µ-law bytes
                        mu_law_bytes = base64.b64decode(payload_base64)

                    except Exception as e:
                        print(f"Error decoding base64 payload: {e}")
                        continue  # Skip this payload

                    try:
                        # Transcode µ-law to PCM (s16le)
                        pcm_bytes = audioop.ulaw2lin(mu_law_bytes, 2)
                        
                    except Exception as e:
                        print(f"Error transcoding µ-law to PCM: {e}")
                        continue  # Skip this payload

                    # Send PCM bytes to Ultravox
                    if config["uv_ws"] and config["uv_ws"].state == websockets.protocol.State.OPEN:
                        try:
                            await config["uv_ws"].send(pcm_bytes)
                       
                        except Exception as e:
                            print(f"Error sending PCM to Ultravox: {e}")

        except WebSocketDisconnect:
            print(f"Twilio WebSocket disconnected (CallSid={config['call_sid']}).")
            # Attempt to close Ultravox ws
            config["session"]["is_active"] = False
            if config["uv_ws"] and config["uv_ws"].state == websockets.protocol.State.OPEN:
                await config["uv_ws"].close()
            # Post the transcript to N8N
            if session:
                # await send_transcript_to_n8n(session)
                sessions.pop(config["call_sid"], None)

        except Exception as e:
            print(f"Error in handle_twilio: {e}")
            traceback.print_exc()

    # Start handling Twilio media as a separate task
    twilio_task = asyncio.create_task(handle_twilio())

    # Wait for the Twilio handler to complete
    await twilio_task





















#handle web call
@app.websocket("/web-media-stream")
async def media_stream_web(websocket: WebSocket):
    """
        Handles the  WebSocket and connects to Ultravox via WebSocket.
    """
    await websocket.accept()
    print('Client connected to /web-media-stream (Web)')

    # Initialize session variables
    call_sid = None
    session = None
    stream_sid = ''
    uv_ws = None  # Ultravox WebSocket connection

    config = {
        "call_sid": None,
        "session": None,
        "stream_sid": "",
        "uv_ws": None
    }

    # Define handler for Ultravox messages
    async def handle_ultravox(config):
        nonlocal uv_ws, session, stream_sid, call_sid
        try:
            async for raw_message in config["uv_ws"]:
                if isinstance(raw_message, bytes):
                    # Agent audio in PCM s16le
                    try:
                        mu_law_bytes = audioop.lin2ulaw(raw_message, 2)
                        pcm_bytes = audioop.ulaw2lin(mu_law_bytes,2)
                        payload_base64 = base64.b64encode(pcm_bytes).decode('ascii')
                    except Exception as e:
                        print(f"Error transcoding PCM to µ-law: {e}")
                        continue  # Skip this audio frame

                    # Send to Twilio as media payload
                    try:
                        await websocket.send_text(json.dumps({
                            "event": "media",
                            "streamSid": config["stream_sid"],
                            "media": {
                                "payload": payload_base64
                            }
                        }))
                    except Exception as e:
                        print(f"Error sending media to Twilio: {e}")

                else:
                    # Text data message from Ultravox
                    try:
                        msg_data = json.loads(raw_message)
                        # print(f"Received data message from Ultravox: {json.dumps(msg_data)}")
                    except Exception as e:
                        print(f"Ultravox non-JSON data: {raw_message}")
                        continue

                    msg_type = msg_data.get("type") or msg_data.get("eventType")

                    if msg_type == "transcript":
                        role = msg_data.get("role")
                        text = msg_data.get("text") or msg_data.get("delta")
                        final = msg_data.get("final", False)

                        if role and text:
                            role_cap = role.capitalize()
                            config['session']['transcript'] += f"{role_cap}: {text}\n"
                            print(f"{role_cap} says: {text}")

                            if final:
                                print(f"Transcript for {role_cap} finalized.")

                    elif msg_type == "client_tool_invocation":
                        toolName = msg_data.get("toolName", "")
                        invocationId = msg_data.get("invocationId")
                        parameters = msg_data.get("parameters", {})
                        print(f"Invoking tool: {toolName} with invocationId: {invocationId} and parameters: {parameters}")

                        session = config.get('session',{})
                        model_tool_names = session.get('model_tool_names',[])
                        selected_tools = session.get('selected_tools',[])
                       
                        if toolName in model_tool_names:
                            print(f'Arguments passed to schedule_meeting tool: {parameters}')
                            # Validate required parameters
                            required_params = get_required_params(selected_tools, msg_type)
                            missing_params = [param for param in required_params if not parameters.get(param)]

                            if missing_params:
                                print(f"Missing parameters for schedule_meeting: {missing_params}")

                                # Inform the agent to prompt the user for missing parameters
                                prompt_message = f"Please provide the following information to schedule your meeting: {', '.join(missing_params)}."
                                tool_result = {
                                    "type": "client_tool_result",
                                    "invocationId": invocationId,
                                    "result": prompt_message,
                                    "response_type": "tool-response"
                                }
                                await config["uv_ws"].send(json.dumps(tool_result))
                            else:
                                 # Send data to webhook
                                webhook_url = next((item["webhookURL"] for item in selected_tools if item["modelToolName"] == toolName), None)
                                
                                if webhook_url:
                                    print(f"Sending data to webhook: {webhook_url}")
                                    
                                
                                    try:
                                        async with aiohttp.ClientSession() as session:
                                            async with session.post(webhook_url, json=parameters) as response:
                                                response_text = await response.text()
                                                print(f"Webhook response: {response_text}")
                                    except Exception as e:
                                        print(e)
                                else:
                                    print(f"No webhook URL found for {toolName}")


                    elif msg_type == "state":
                        # Handle state messages
                        state = msg_data.get("state")
                        if state:
                            print(f"Agent state: {state}")

                    elif msg_type == "debug":
                        # Handle debug messages
                        debug_message = msg_data.get("message")
                        print(f"Ultravox debug message: {debug_message}")
                        # Attempt to parse nested messages within the debug message
                        try:
                            nested_msg = json.loads(debug_message)
                            nested_type = nested_msg.get("type")

                            if nested_type == "toolResult":
                                tool_name = nested_msg.get("toolName")
                                output = nested_msg.get("output")
                                print(f"Tool '{tool_name}' result: {output}")


                            else:
                                print(f"Unhandled nested message type within debug: {nested_type}")
                        except json.JSONDecodeError as e:
                            print(f"Failed to parse nested message within debug message: {e}. Message: {debug_message}")

                    elif msg_type in LOG_EVENT_TYPES:
                        print(f"Ultravox event: {msg_type} - {msg_data}")
                    else:
                        print(f"Unhandled Ultravox message type: {msg_type} - {msg_data}")

        except Exception as e:
            print(f"Error in handle_ultravox: {e}")
            traceback.print_exc()

    # Define handler for Twilio messages
    async def handle_twilio():
       
        try:
            while True:
                message = await websocket.receive_text()
                data = json.loads(message)

                if data.get('event') == 'start':
                    print(data)
                    config["stream_sid"] = data['start']['streamSid']
                    config["call_sid"] = data['start']['callSid']
                    custom_parameters = data['start'].get('customParameters', {})

                    print("Twilio event: start")
                    print("CallSid:", config["call_sid"])
                    print("StreamSid:", config["stream_sid"])
                    print("Custom Params:", custom_parameters)

                    # Extract first_message and caller_number
                    first_message = custom_parameters.get('firstMessage', "Hello, how can I assist you?")
                    caller_number = custom_parameters.get('callerNumber', 'Unknown')

                    if config["call_sid"] and config['call_sid'] in sessions:
                        call_sid = config["call_sid"]
                        config["session"] = sessions[call_sid]
                        config["session"]["callerNumber"] = caller_number
                        config["session"]["streamSid"] = config["stream_sid"]
                    else:
                        print(f"Session not found for CallSid: {config['call_sid']}")
                        await websocket.close()
                        return

                    print("Caller Number:", caller_number)
                    print("First Message:", first_message)

                    # Create Ultravox call with first_message
                    uv_join_url = await create_ultravox_call(
                        system_prompt=config['session']["system_prompt"],
                        first_message=config['session']["first_message"],
                        selectedTools=config['session']["transform_data"],
                    )

                    if not uv_join_url:
                        print("Ultravox joinUrl is empty. Cannot establish WebSocket connection.")
                        await websocket.close()
                        return

                    # Connect to Ultravox WebSocket
                    try:
                        config["uv_ws"] = await websockets.connect(uv_join_url)
                        print("Ultravox WebSocket connected.")
                    except Exception as e:
                        print(f"Error connecting to Ultravox WebSocket: {e}")
                        traceback.print_exc()
                        await websocket.close()
                        return

                    # Start handling Ultravox messages as a separate task
                    uv_task = asyncio.create_task(handle_ultravox(config))
                    print("Started Ultravox handler task.")

                      #start timer
                    if config["session"].get("call_type") == "purchased":
                        config["session"]["is_active"] = True
                        asyncio.create_task(send_minutely_request(config=config,data={"user_id": config["session"].get("user_id"),"assistant_id":  config["session"].get("assistant_id")},websocket=websocket))

                elif data.get('event') == 'media':
                    # Twilio sends media from user
                    payload_base64 = data['media']['payload']

                    try:
                        # Decode base64 to get raw µ-law bytes
                        pcm_bytes_raw = base64.b64decode(payload_base64)

                    except Exception as e:
                        print(f"Error decoding base64 payload: {e}")
                        continue  # Skip this payload

                    try:
                        # Transcode µ-law to PCM (s16le)
                        ulaw_bytes = audioop.lin2ulaw(pcm_bytes_raw, 2)
                        pcm_bytes = audioop.ulaw2lin(ulaw_bytes,2)
                        
                    except Exception as e:
                        print(f"Error transcoding µ-law to PCM: {e}")
                        continue  # Skip this payload

                    # Send PCM bytes to Ultravox
                    if config["uv_ws"] and config["uv_ws"].state == websockets.protocol.State.OPEN:
                        try:
                            await config["uv_ws"].send(pcm_bytes)
                       
                        except Exception as e:
                            print(f"Error sending PCM to Ultravox: {e}")

        except WebSocketDisconnect:
            print(f"Twilio WebSocket disconnected (CallSid={config['call_sid']}).")
            config["session"]["is_active"] = False
            # Attempt to close Ultravox ws
            if config["uv_ws"] and config["uv_ws"].state == websockets.protocol.State.OPEN:
                await config["uv_ws"].close()
    
            if config["session"]:
                sessions.pop(config["call_sid"], None)

        except Exception as e:
            print(f"Error in handle_twilio: {e}")
            traceback.print_exc()

    # Start handling Twilio media as a separate task
    twilio_task = asyncio.create_task(handle_twilio())

    # Wait for the Twilio handler to complete
    await twilio_task



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)