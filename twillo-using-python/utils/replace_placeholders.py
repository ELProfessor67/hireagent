import re

def replace_placeholders(text, placeholders):
    """
    Replaces placeholders in the given text with corresponding values from the list of dictionaries.

    :param text: The input text containing placeholders like [placeholder_key]
    :param placeholders_list: A list of dictionaries containing 'key' and 'value'
    :return: The formatted text with replaced values
    """
    # Convert list of dictionaries into a single dictionary
    placeholders_dic = {item["key"]: item["value"] for item in placeholders}

    # Replace placeholders
    return re.sub(r"\[([^\]]+)\]", lambda m: placeholders_dic.get(m.group(1), m.group(0)), text)

