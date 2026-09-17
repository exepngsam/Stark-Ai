import cv2
import numpy as np
import io
from PIL import Image
from typing import Tuple, Optional, Dict, Any
from urllib.parse import urlparse, parse_qs
from app.services.analyzer import analyze_threat_local, UPI_WARNING
from app.services.utils import defang_url
from app.models import ThreatAnalysisResult, RedFlag

def decode_qr_with_opencv(image_bytes: bytes) -> Tuple[Optional[str], Optional[list]]:
    """
    Decodes QR code from raw image bytes using OpenCV QRCodeDetector.
    Returns (decoded_text, bbox_points).
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return None, None
        
        detector = cv2.QRCodeDetector()
        data, points, _ = detector.detectAndDecode(img)
        
        if data:
            coords = points.tolist() if points is not None else None
            return data, coords
        
        # Try grayscale with Otsu thresholding for low-contrast screenshots
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        data, points, _ = detector.detectAndDecode(thresh)
        if data:
            return data, points.tolist() if points is not None else None

        return None, None
    except Exception as e:
        print(f"Error decoding QR with OpenCV: {e}")
        return None, None

def analyze_qr_payload(data: str) -> ThreatAnalysisResult:
    """
    Analyzes decoded QR string for fraudulent UPI parameters or malicious links.
    """
    lower = data.lower()
    red_flags = []
    actions = []
    defanged = []
    category = "QR Code Analysis"
    score = 20
    critical_warning = None

    # Check for UPI URI scheme
    if lower.startswith("upi://pay"):
        category = "UPI Payment QR Code"
        parsed = urlparse(data)
        params = parse_qs(parsed.query)
        
        pa = params.get("pa", ["Unknown VPA"])[0]
        pn = params.get("pn", ["Unknown Payee"])[0]
        am = params.get("am", [None])[0]
        
        score = 85
        critical_warning = UPI_WARNING
        red_flags.append(RedFlag(
            indicator="Direct Debit Payment QR Code",
            evidence=f"Target VPA: {pa}, Payee: {pn}" + (f", Amount: ₹{am}" if am else ""),
            severity="CRITICAL"
        ))
        
        if am:
            red_flags.append(RedFlag(
                indicator="Pre-filled Debit Amount Detected",
                evidence=f"Scanning will initiate an outbound payment of ₹{am} from your account",
                severity="CRITICAL"
            ))
            score = 95
        
        actions.append("CRITICAL: Do NOT scan this QR code if someone claimed they are sending YOU money.")
        actions.append("Scanning a QR code and entering your UPI PIN always DEBITS money from your account.")
        actions.append("Never approve UPI collect requests or scan QR codes received via WhatsApp or OLX.")
        verdict = "CRITICAL DANGER"
        summary = f"This QR code encodes an outbound payment instruction to '{pn}' ({pa}). Scanning it will deduct money from your bank account."
    
    # Check for web link
    elif lower.startswith("http://") or lower.startswith("https://"):
        defanged_url_str = defang_url(data)
        defanged.append(defanged_url_str)
        category = "Web Link QR Code"
        
        # Run standard heuristic on the URL
        threat = analyze_threat_local(data)
        return threat
    else:
        # Plain text inside QR
        return analyze_threat_local(data)

    return ThreatAnalysisResult(
        verdict=verdict,
        risk_score=score,
        scam_category=category,
        summary=summary,
        red_flags=red_flags,
        recommended_actions=actions,
        defanged_urls=defanged,
        critical_warning=critical_warning,
        engine_used="OpenCV QR Engine & Threat Heuristics"
    )

def analyze_image_file(image_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Main image analysis handler:
    1. Runs OpenCV QR detector
    2. If QR found, analyzes decoded content
    3. If no QR found, examines image format and provides guidance
    """
    qr_data, coords = decode_qr_with_opencv(image_bytes)
    
    if qr_data:
        analysis = analyze_qr_payload(qr_data)
        return {
            "qr_detected": True,
            "decoded_content": qr_data,
            "bounding_box": coords,
            "analysis": analysis.dict()
        }
    
    # If no QR code detected, analyze as screenshot or fallback
    # In full AWS deployment, Amazon Textract would perform OCR
    analysis = analyze_threat_local("Screenshot received. No direct QR code detected. Ensure sensitive OTPs and numbers are verified via official portals.")
    analysis.summary = f"Image '{filename}' processed. No encoded QR payment string was detected. If this is a text message screenshot, paste the message text into the Message Analyzer for in-depth semantic risk breakdown."
    analysis.risk_score = 10
    analysis.verdict = "LOW RISK / SAFE"
    
    return {
        "qr_detected": False,
        "decoded_content": None,
        "bounding_box": None,
        "analysis": analysis.dict()
    }
