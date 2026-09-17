import re
from typing import List

def defang_url(url: str) -> str:
    """
    Defangs a URL to prevent accidental clicks:
    - http:// -> hxxp://
    - https:// -> hxxps://
    - . -> [.] in domain
    """
    if not url:
        return ""
    defanged = url
    if defanged.startswith("https://"):
        defanged = "hxxps://" + defanged[8:]
    elif defanged.startswith("http://"):
        defanged = "hxxp://" + defanged[7:]
    
    # Defang dot in host/domain
    # Match domain part before the first single slash (after protocol)
    parts = defanged.split("/", 3)
    if len(parts) >= 3:
        # parts[0] is protocol (hxxps:), parts[1] is empty, parts[2] is host:port
        host = parts[2].replace(".", "[.]")
        if len(parts) > 3:
            defanged = f"{parts[0]}//{host}/{parts[3]}"
        else:
            defanged = f"{parts[0]}//{host}"
    else:
        defanged = defanged.replace(".", "[.]")
    return defanged

def extract_urls(text: str) -> List[str]:
    """
    Extracts all URLs and domain-like patterns from text.
    """
    url_pattern = r'(?:https?://|www\.)[^\s<>"\'{}|\\^`]+|[a-zA-Z0-9.-]+\.(?:com|org|net|in|top|xyz|cc|biz|info|site|app|live|ru|tk|ml|ga|cf|gq)(?:/[^\s<>"\'{}|\\^`]*)?'
    raw_urls = re.findall(url_pattern, text, re.IGNORECASE)
    cleaned = []
    for u in raw_urls:
        u = u.strip().rstrip(".,;!?:")
        if u and u not in cleaned:
            cleaned.append(u)
    return cleaned

def scrub_sensitive_data(text: str) -> str:
    """
    Never store or log sensitive items like OTPs, CVVs, UPI PINs, passwords.
    """
    # 4-6 digit standalone OTP/PIN
    text = re.sub(r'\b(otp|pin|cvv)\s*(?:is|:|=|-)?\s*(\d{4,6})\b', r'\1: [REDACTED]', text, flags=re.IGNORECASE)
    # 16-digit card numbers
    text = re.sub(r'\b(?:\d[ -]*?){13,16}\b', '[REDACTED_CARD]', text)
    return text
