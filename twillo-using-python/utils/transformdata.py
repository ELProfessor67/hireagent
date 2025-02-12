def transform_input(input_data):
    output_data = []
    
    for item in input_data:
        # Creating a new dictionary to hold the transformed tool
        temp_tool = {
            "temporaryTool": {
                "modelToolName": item["modelToolName"],
                "description": item["description"],
                "dynamicParameters": item["dynamicParameters"],
                "timeout": item["timeout"],
                "client": {},  # Empty client
            }
        }
        
        # Special transformation for 'schedule_meeting' modelToolName
        if item["modelToolName"] == "schedule_meeting":
            # Define the new parameters to add
            new_params = [
                {
                    "name": "purpose",
                    "location": "PARAMETER_LOCATION_BODY",
                    "schema": {
                        "type": "string",
                        "description": "Purpose of the Meeting"
                    },
                    "required": True
                },
                {
                    "name": "datetime",
                    "location": "PARAMETER_LOCATION_BODY",
                    "schema": {
                        "type": "string",
                        "description": "Meeting Datetime"
                    },
                    "required": True
                },
                {
                    "name": "location",
                    "location": "PARAMETER_LOCATION_BODY",
                    "schema": {
                        "type": "string",
                        "enum": ["London", "Manchester", "Brighton"],
                        "description": "Meeting location"
                    },
                    "required": True
                }
            ]
            
            # Add the new parameters only if they do not already exist
            existing_param_names = {param["name"] for param in item["dynamicParameters"]}
            for param in new_params:
                if param["name"] not in existing_param_names:
                    temp_tool["temporaryTool"]["dynamicParameters"].append(param)
        
        # Add the transformed tool to the output list
        output_data.append(temp_tool)
    
    return output_data
