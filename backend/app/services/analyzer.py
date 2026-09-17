import json
import re
from typing import List
from app.config import settings
from app.models import ThreatAnalysisResult, RedFlag
from app.services.utils import defang_url, extract_urls, scrub_sensitive_data

UPI_WARNING = "CRITICAL: Receiving money via UPI NEVER requires entering your UPI PIN or scanning a QR code."

def analyze_threat_local(text: str) -> ThreatAnalysisResult:
    """
    High-fidelity Local Heuristic Threat Engine.
    Detects scam patterns, urgency triggers, financial bait, APK trojans, and impersonation.
    """
    clean_text = scrub_sensitive_data(text)
    lower_text = clean_text.lower()
    
    red_flags: List[RedFlag] = []
    category = "Suspicious Communication"
    score = 15
    critical_warning = None
    
    # 1. UPI PIN / Cashback Scams
    upi_pin_match = re.search(r'(enter\s+(?:upi\s+)?pin|share\s+(?:upi\s+)?pin|pin\s+to\s+receive|scan\s+(?:and\s+)?enter\s+pin)', lower_text)
    cashback_match = re.search(r'(cashback|won\s+₹|claim\s+(?:reward|refund)|phonepe\s+reward|gpay\s+scratch|paytm\s+cashback)', lower_text)
    
    if upi_pin_match or (cashback_match and "pin" in lower_text):
        category = "Fake UPI Refund / Cashback Scam"
        score = max(score, 98)
        critical_warning = UPI_WARNING
        red_flags.append(RedFlag(
            indicator="Demand for UPI PIN to Receive Money",
            evidence=upi_pin_match.group(0) if upi_pin_match else "Claiming reward requires entering PIN",
            severity="CRITICAL"
        ))
    elif cashback_match:
        category = "Cashback / Lottery Bait"
        score = max(score, 82)
        critical_warning = UPI_WARNING
        red_flags.append(RedFlag(
            indicator="Unsolicited Financial Reward Bait",
            evidence=cashback_match.group(0),
            severity="HIGH"
        ))

    # 2. Electricity Disconnection Threats
    elec_match = re.search(r'(power\s+(?:will\s+be\s+)?disconnected|electricity\s+(?:bill|power|office)|disconnect\s+tonight|dear\s+consumer.*power|contact\s+officer\s+\d{10})', lower_text)
    if elec_match:
        category = "Electricity Disconnection Phishing"
        score = max(score, 92)
        red_flags.append(RedFlag(
            indicator="False Utility Disconnection Threat & Personal Phone Contact",
            evidence=elec_match.group(0),
            severity="CRITICAL"
        ))

    # 3. Bank KYC & Account Freeze Scam
    kyc_match = re.search(r'(kyc\s+(?:update|expired|suspended|pending)|account\s+(?:blocked|suspended|freeze)|pan\s+card\s+link|debit\s+card\s+block)', lower_text)
    if kyc_match:
        category = "Fake Bank KYC / Account Suspension Scam"
        score = max(score, 90)
        red_flags.append(RedFlag(
            indicator="Urgent Banking Threat & Phishing Prompt",
            evidence=kyc_match.group(0),
            severity="CRITICAL"
        ))

    # 4. Malicious APK Android Trojan
    apk_match = re.search(r'(\.apk\b|download\s+app|install\s+support\s+app|quicksupport|anydesk|teamviewer)', lower_text)
    if apk_match:
        score = max(score, 96)
        if "APK" not in category:
            category = "Malicious APK Trojan / Remote Access Scam"
        red_flags.append(RedFlag(
            indicator="Sideloading Unverified APK or Screen-Share App",
            evidence=apk_match.group(0),
            severity="CRITICAL"
        ))

    # 5. Telegram Task-Job / Prepaid Task Scam
    task_match = re.search(r'(like\s+youtube|rate\s+(?:hotel|google\s+maps)|telegram\s+group|earn\s+₹?\d{3,5}\s+daily|part[\s-]time\s+job|prepaid\s+task|merchant\s+recharge)', lower_text)
    if task_match:
        category = "Telegram Task-Job / Advance Fee Fraud"
        score = max(score, 88)
        red_flags.append(RedFlag(
            indicator="Unrealistic Part-Time Pay for Micro-Tasks",
            evidence=task_match.group(0),
            severity="HIGH"
        ))

    # 6. Guaranteed Investment / Crypto Arbitrage Scam
    invest_match = re.search(r'(guaranteed\s+(?:return|profit)|100%\s+profit|double\s+your\s+money|crypto\s+bot|forex\s+trading\s+signal|daily\s+\d+%)', lower_text)
    if invest_match:
        category = "Guaranteed Investment Ponzi Scheme"
        score = max(score, 85)
        red_flags.append(RedFlag(
            indicator="Guaranteed High-Return Investment Claim",
            evidence=invest_match.group(0),
            severity="HIGH"
        ))

    # 7. Artificial Urgency & Coercion Triggers
    urgency_match = re.search(r'(immediately|within\s+\d+\s+(?:hours|mins|minutes)|urgent|last\s+warning|tonight\s+at\s+\d+|police\s+arrest|customs\s+parcel)', lower_text)
    if urgency_match:
        score = min(100, score + 15)
        red_flags.append(RedFlag(
            indicator="Psychological Pressure (Artificial Urgency)",
            evidence=urgency_match.group(0),
            severity="HIGH"
        ))

    # 8. Unofficial Links & Defanging
    raw_urls = extract_urls(clean_text)
    defanged = [defang_url(u) for u in raw_urls]
    suspicious_tld_match = re.search(r'\.(top|xyz|cc|site|app|live|ru|tk|ml|ga|cf|gq|club|online|vip)\b', lower_text)
    if raw_urls:
        score = min(100, score + 10)
        if suspicious_tld_match:
            score = max(score, 88)
            red_flags.append(RedFlag(
                indicator="Suspicious Low-Trust Top-Level Domain (TLD)",
                evidence=suspicious_tld_match.group(0),
                severity="HIGH"
            ))
        else:
            red_flags.append(RedFlag(
                indicator="External Link Contained in Unsolicited Message",
                evidence=", ".join(defanged[:2]),
                severity="MEDIUM"
            ))

    # Determine final verdict
    if score >= 85:
        verdict = "CRITICAL DANGER"
    elif score >= 65:
        verdict = "HIGH RISK"
    elif score >= 35:
        verdict = "SUSPICIOUS / CAUTION"
    else:
        verdict = "LOW RISK / SAFE"
        category = "Standard / Non-Threatening Message"

    # Compile recommended actions
    actions: List[str] = []
    if score >= 65:
        actions.append("Do NOT click any links, download attachments, or call the provided numbers.")
        actions.append("Do NOT share OTPs, UPI PINs, bank details, or passwords under any circumstances.")
        if "UPI" in category or "Cashback" in category:
            actions.append("Remember: Entering your UPI PIN is ONLY done when MONEY IS LEAVING your account.")
        if "Electricity" in category:
            actions.append("Verify your power bill status exclusively on the official utility provider app or website.")
        if "Bank" in category:
            actions.append("Contact your branch using the official customer care number on the back of your debit card.")
        if "Task" in category:
            actions.append("Cease all contact with the Telegram/WhatsApp handler. Do not pay any 'activation' or 'prepaid' fees.")
        actions.append("Report financial cyber fraud immediately on the National Cybercrime Portal or call 1930.")
    else:
        actions.append("No overt phishing patterns detected, but remain cautious when interacting with unknown senders.")
        actions.append("Never share private credentials or passwords.")

    summary = (
        f"This communication exhibits {len(red_flags)} notable security indicators typical of a {category}. "
        f"The content relies on {('urgency, intimidation, and financial manipulation' if score >= 70 else 'standard communication patterns')}."
    )

    return ThreatAnalysisResult(
        verdict=verdict,
        risk_score=score,
        scam_category=category,
        summary=summary,
        red_flags=red_flags,
        recommended_actions=actions,
        defanged_urls=defanged,
        critical_warning=critical_warning,
        engine_used="Local Heuristic Engine (Offline Safety Mode)"
    )

def analyze_threat(text: str) -> ThreatAnalysisResult:
    """
    Main entrypoint: Attempts AWS Bedrock first if configured, otherwise falls back seamlessly to Local Engine.
    """
    if settings.has_aws_credentials:
        try:
            import boto3
            client = boto3.client(
                "bedrock-runtime",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                aws_session_token=settings.AWS_SESSION_TOKEN or None,
            )
            
            prompt = f"""
You are STARK AI, an expert cybersecurity threat analyst specializing in social engineering, SMS phishing, UPI frauds, fake KYC, and digital impersonation.
Analyze the following user-provided message:
---
{scrub_sensitive_data(text)}
---
Evaluate:
1. Verdict: 'CRITICAL DANGER', 'HIGH RISK', 'SUSPICIOUS / CAUTION', or 'LOW RISK / SAFE'
2. Risk Score: 0 to 100
3. Scam Category: precise category (e.g., Fake UPI Refund, Electricity Disconnection Scam, Fake Bank KYC APK, Telegram Task Job Scam, Investment Scam)
4. Summary: concise 2-sentence summary
5. Red Flags: list of items with indicator, evidence quote from text, severity (CRITICAL, HIGH, MEDIUM, LOW)
6. Recommended Actions: 3-5 specific steps the user should take
7. URLs: list of raw URLs found
8. Is there any UPI PIN or cashback reference?

Respond ONLY with valid JSON adhering to this schema:
{{
  "verdict": "CRITICAL DANGER",
  "risk_score": 95,
  "scam_category": "Fake UPI Refund",
  "summary": "...",
  "red_flags": [{{"indicator": "...", "evidence": "...", "severity": "CRITICAL"}}],
  "recommended_actions": ["..."],
  "raw_urls": ["..."],
  "has_upi_pin_threat": true
}}
"""
            # Call Bedrock model
            response = client.invoke_model(
                modelId=settings.BEDROCK_MODEL_ID,
                contentType="application/json",
                accept="application/json",
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1024,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.1
                })
            )
            response_body = json.loads(response['body'].read().decode('utf-8'))
            result_json = json.loads(response_body['content'][0]['text'])
            
            defanged = [defang_url(u) for u in result_json.get("raw_urls", [])]
            crit_warn = UPI_WARNING if result_json.get("has_upi_pin_threat") else None
            
            return ThreatAnalysisResult(
                verdict=result_json["verdict"],
                risk_score=result_json["risk_score"],
                scam_category=result_json["scam_category"],
                summary=result_json["summary"],
                red_flags=[RedFlag(**f) for f in result_json.get("red_flags", [])],
                recommended_actions=result_json.get("recommended_actions", []),
                defanged_urls=defanged,
                critical_warning=crit_warn,
                engine_used=f"Amazon Bedrock ({settings.BEDROCK_MODEL_ID})"
            )
        except Exception:
            # Graceful fallback to local heuristic engine
            pass

    return analyze_threat_local(text)
