from typing import List, Dict, Any, Optional
from app.models import SimulatorScenario, SimulatorOption, SimulatorVerifyResponse

SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": 1,
        "category": "UPI Payment Trap",
        "title": "The Instant Cashback Credit",
        "sender": "SMS: PhonePe-Refund / GPay-Rewards",
        "situation": "You receive a message: 'Congratulations! ₹4,999 cashback has been approved for your recent transaction. Click the link to open Google Pay and enter your UPI PIN to claim and credit into your bank account.'",
        "options": [
            {
                "id": "opt_a",
                "text": "Click the link and quickly enter your 4-digit UPI PIN to claim the ₹4,999 refund."
            },
            {
                "id": "opt_b",
                "text": "Ignore and delete the message; entering a UPI PIN is strictly for DEBITING money, never receiving."
            },
            {
                "id": "opt_c",
                "text": "Reply asking the sender to transfer the money via NEFT instead."
            }
        ],
        "safe_option": "opt_b",
        "explanation": "Entering your UPI PIN authorizes your bank to DEBIT money from your account. In the UPI architecture, receiving or accepting incoming funds NEVER requires entering your UPI PIN, passcode, or biometric scan.",
        "safety_principle": "GOLDEN RULE: UPI PIN is solely used to SEND money. If someone tells you to enter your PIN to receive a cashback, lottery, or refund, it is 100% a scam.",
        "scam_breakdown": "Tactics Used: Financial Greed + False Authority. Scammers disguise an outbound Collect Request or Intent URL as a 'credit voucher'. Entering your PIN instantly debits ₹4,999 into the scammer's mule account."
    },
    {
        "id": 2,
        "category": "Utility Disconnection Threat",
        "title": "The Midnight Power Cutoff",
        "sender": "SMS from +91-98213XXXXX",
        "situation": "You receive an SMS at 8:15 PM: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210.'",
        "options": [
            {
                "id": "opt_a",
                "text": "Immediately call the number in the SMS to stop the power cut and pay via the link they send."
            },
            {
                "id": "opt_b",
                "text": "Check your official state electricity board app (e.g. Mahavitaran, BESCOM, TNEB) or official bill portal independently."
            },
            {
                "id": "opt_c",
                "text": "Forward the message to your family WhatsApp group to warn them."
            }
        ],
        "safe_option": "opt_b",
        "explanation": "State power distribution companies (DISCOMs) never send disconnection threats from personal 10-digit mobile numbers with a 1-hour deadline. They send registered alerts with your Consumer ID (CA Number).",
        "safety_principle": "Never dial phone numbers embedded in unsolicited panic messages. Always verify billing dues on the official utility provider website or registered consumer app.",
        "scam_breakdown": "Tactics Used: Artificial Urgency + Fear of Disruption. Once you call, the fake 'officer' asks you to install a screen-share app (QuickSupport/AnyDesk) to 'update your bill with a ₹10 token charge', through which they siphon your bank savings."
    },
    {
        "id": 3,
        "category": "Task-Job / Advance Fee Fraud",
        "title": "The Work-From-Home YouTube Like Job",
        "sender": "WhatsApp from +62 / +84 International Number",
        "situation": "A 'recruiter' messages: 'Hi! We have a remote job rating YouTube videos & hotels on Google Maps. Earn ₹2,000 to ₹5,000 daily for 30 mins work. We already paid ₹150 for your test task. Now join our Telegram VIP channel and pay ₹1,000 deposit to unlock the high-payout Merchant Task.'",
        "options": [
            {
                "id": "opt_a",
                "text": "Deposit ₹1,000 since they proved legitimacy by already paying ₹150 for the trial task."
            },
            {
                "id": "opt_b",
                "text": "Ask if you can deposit ₹500 first instead of the full ₹1,000."
            },
            {
                "id": "opt_c",
                "text": "Block the recruiter immediately; legitimate jobs never require paying prepaid fees or deposits to work."
            }
        ],
        "safe_option": "opt_c",
        "explanation": "This is a classic 'Task-Based Pig-Butchering Scam'. Scammers give nominal payouts (₹100-₹500) early on to build trust. Once you deposit larger sums (₹1,000, then ₹10,000, then ₹50,000), they freeze your funds and demand more 'tax clearance' fees.",
        "safety_principle": "NO REAL EMPLOYER asks candidates to deposit money to unlock tasks, earn returns, or complete 'recharge jobs'.",
        "scam_breakdown": "Tactics Used: Sunk-Cost Fallacy + Reciprocity Trap. The initial small token reward acts as bait to lure victims into transferring substantial savings into cyber mule networks."
    },
    {
        "id": 4,
        "category": "Malicious Android Trojan",
        "title": "The Urgent Bank KYC Suspension APK",
        "sender": "SMS from VM-SBINB / DM-HDFCBK",
        "situation": "An SMS arrives: 'Dear Customer, your Bank Account and Debit Card have been deactivated due to unverified PAN/KYC. Click http://sbi-secure.top/kyc.apk to install the official SBI NetBanking update and prevent account forfeiture.'",
        "options": [
            {
                "id": "opt_a",
                "text": "Download and install the APK file to quickly verify your PAN card."
            },
            {
                "id": "opt_b",
                "text": "Visit the physical bank branch or open the official verified app from Google Play / Apple App Store."
            },
            {
                "id": "opt_c",
                "text": "Download the APK, but turn off Wi-Fi before opening it."
            }
        ],
        "safe_option": "opt_b",
        "explanation": "Banks NEVER distribute `.apk` installation files via SMS, WhatsApp, or shady external websites (`.top`, `.xyz`). Sideloading APKs bypasses app store sandboxing and installs banking trojans.",
        "safety_principle": "Never install `.apk` files sent via SMS or links. Legitimate banking applications are distributed ONLY through official app stores (Google Play & Apple App Store).",
        "scam_breakdown": "Tactics Used: Impersonation + Severe Consequence. The rogue APK requests 'Accessibility Service' and 'SMS Permissions'. Once granted, it intercepts OTPs silently in the background and drains your account without notification."
    },
    {
        "id": 5,
        "category": "Guaranteed Investment Fraud",
        "title": "The 100% Risk-Free Crypto Bot",
        "sender": "Telegram: 'Crypto Wealth VIP Signals'",
        "situation": "You are added to a Telegram group with 45,000 members where dozens of users post screenshots of earning ₹50,000 per day. The admin announces: 'Our proprietary institutional AI arbitrage algorithm guarantees 15% daily returns with 0% risk. Minimum deposit ₹5,000.'",
        "options": [
            {
                "id": "opt_a",
                "text": "Transfer ₹5,000 to test if the trading bot works as claimed."
            },
            {
                "id": "opt_b",
                "text": "Recognize that 'guaranteed high returns with zero risk' is mathematically impossible and the hallmark of a Ponzi/crypto scam; exit and report the group."
            },
            {
                "id": "opt_c",
                "text": "DM other members in the group to ask if they really got their withdrawals."
            }
        ],
        "safe_option": "opt_b",
        "explanation": "No legitimate financial instrument offers guaranteed double-digit daily returns with zero risk. The group members posting profit screenshots are automated bots or coordinated shills running a Ponzi scheme.",
        "safety_principle": "High returns always come with high risk. Any scheme promising 'guaranteed profit' or 'zero risk' is fraudulent. Verify registered entities with SEBI/RBI.",
        "scam_breakdown": "Tactics Used: Social Proof + FOMO (Fear Of Missing Out). Fake group testimonials create an illusion of mass wealth. Once you deposit funds on their fraudulent dashboard, withdrawals are locked forever."
    }
]

def get_all_scenarios() -> List[SimulatorScenario]:
    """Returns scenarios without exposing the safe option answer."""
    results = []
    for s in SCENARIOS:
        results.append(SimulatorScenario(
            id=s["id"],
            category=s["category"],
            title=s["title"],
            situation=s["situation"],
            sender=s["sender"],
            options=[SimulatorOption(**opt) for opt in s["options"]]
        ))
    return results

def verify_scenario_response(scenario_id: int, selected_option_id: str) -> SimulatorVerifyResponse:
    """Evaluates the user's choice and provides comprehensive educational feedback."""
    target = next((s for s in SCENARIOS if s["id"] == scenario_id), None)
    if not target:
        raise ValueError(f"Scenario with id {scenario_id} not found")
    
    is_safe = (selected_option_id == target["safe_option"])
    next_id = scenario_id + 1 if scenario_id < len(SCENARIOS) else None
    
    verdict = "CORRECT — THREAT NEUTRALIZED" if is_safe else "DANGER — SCAM TRAP TRIGGERED"
    
    return SimulatorVerifyResponse(
        is_safe=is_safe,
        verdict=verdict,
        explanation=target["explanation"],
        safety_principle=target["safety_principle"],
        scam_breakdown=target["scam_breakdown"],
        next_scenario_id=next_id
    )
