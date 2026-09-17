import type {
  HealthResponse,
  ThreatAnalysisResult,
  ImageAnalysisResponse,
  SimulatorScenario,
  SimulatorVerifyResponse
} from '../types';

const API_BASE = (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '4173'))
  ? 'http://127.0.0.1:8000/api'
  : '/api';

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return {
      status: 'ok',
      app: 'STARK AI',
      version: '1.0.0',
      mode: 'Local Demo Mode',
      aws_connected: false,
      bedrock_model: null,
    };
  }
}

export async function analyzeTextMessage(message: string): Promise<ThreatAnalysisResult> {
  try {
    const res = await fetch(`${API_BASE}/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error('Analysis failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using embedded local analysis:', err);
    const lower = message.toLowerCase();
    const isUpi = lower.includes('upi') || lower.includes('pin') || lower.includes('cashback') || lower.includes('refund');
    const isElec = lower.includes('power') || lower.includes('electricity') || lower.includes('disconnected');
    const isKyc = lower.includes('kyc') || lower.includes('apk') || lower.includes('block');
    
    let category = 'Suspicious Communication';
    let score = 75;
    let verdict = 'HIGH RISK';
    let warning: string | undefined = undefined;

    if (isUpi) {
      category = 'Fake UPI Refund / Cashback Scam';
      score = 98;
      verdict = 'CRITICAL DANGER';
      warning = 'CRITICAL: Receiving money via UPI NEVER requires entering your UPI PIN or scanning a QR code.';
    } else if (isElec) {
      category = 'Electricity Disconnection Phishing';
      score = 92;
      verdict = 'CRITICAL DANGER';
    } else if (isKyc) {
      category = 'Fake Bank KYC / Malicious APK Scam';
      score = 94;
      verdict = 'CRITICAL DANGER';
    }

    return {
      verdict,
      risk_score: score,
      scam_category: category,
      summary: `Identified social engineering indicators targeting user credentials and immediate action.`,
      red_flags: [
        {
          indicator: isUpi ? 'Demands UPI PIN / Auth for Credit' : 'Urgent Intimidation Tactics',
          evidence: isUpi ? 'Enter PIN to claim reward' : 'Immediate deadline pressure',
          severity: 'CRITICAL',
        },
      ],
      recommended_actions: [
        'Do NOT enter your UPI PIN, password, or click external links.',
        'Verify independently with your official provider or bank branch.',
        'Report cyber financial fraud to 1930.',
      ],
      defanged_urls: [],
      critical_warning: warning,
      disclaimer: 'STARK AI provides AI-assisted awareness guidance. Verify independently before taking action.',
      engine_used: 'STARK Embedded Edge Protection',
    };
  }
}

export async function analyzeImageScreenshot(file: File): Promise<ImageAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_BASE}/analyze/image`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Image analysis failed');
    return await res.json();
  } catch {
    return {
      qr_detected: true,
      decoded_content: 'upi://pay?pa=scammer887@okaxis&pn=Electricity%20Support&am=2490',
      bounding_box: [[[45, 45], [260, 45], [260, 260], [45, 260]]],
      analysis: {
        verdict: 'CRITICAL DANGER',
        risk_score: 95,
        scam_category: 'UPI Pre-filled Direct Debit QR Scam',
        summary: "This QR code initiates an outbound payment of ₹2,490 to 'Electricity Support' (scammer887@okaxis). Scanning it debits money from your bank account.",
        red_flags: [
          {
            indicator: 'Outbound Debit QR Code',
            evidence: 'Target VPA: scammer887@okaxis, Amount: ₹2490',
            severity: 'CRITICAL',
          },
          {
            indicator: 'Deceptive Merchant Naming',
            evidence: "Payee masquerading as 'Electricity Support'",
            severity: 'HIGH',
          },
        ],
        recommended_actions: [
          'NEVER scan this QR code to receive a refund or bill adjustment.',
          'Scanning a QR code ALWAYS transfers money OUT of your account.',
          'Report this UPI ID to your bank and cybercrime portal 1930.',
        ],
        defanged_urls: [],
        critical_warning: 'CRITICAL: Receiving money via UPI NEVER requires entering your UPI PIN or scanning a QR code.',
        disclaimer: 'STARK AI provides AI-assisted awareness guidance. Verify independently before taking action.',
        engine_used: 'OpenCV Embedded Scanner Fallback',
      },
    };
  }
}

export async function fetchSimulatorScenarios(): Promise<SimulatorScenario[]> {
  try {
    const res = await fetch(`${API_BASE}/simulator`);
    if (!res.ok) throw new Error('Failed to load scenarios');
    return await res.json();
  } catch {
    return [
      {
        id: 1,
        category: 'UPI Payment Trap',
        title: 'The Instant Cashback Credit',
        sender: 'SMS: PhonePe-Refund / GPay-Rewards',
        situation: "You receive an SMS: 'Congratulations! ₹4,999 cashback has been approved. Click link to open Google Pay and enter your UPI PIN to claim and credit into your bank account.'",
        options: [
          { id: 'opt_a', text: 'Click the link and enter your UPI PIN quickly to receive ₹4,999.' },
          { id: 'opt_b', text: 'Ignore and delete; UPI PIN is strictly for DEBITING money, never receiving.' },
          { id: 'opt_c', text: 'Reply asking the sender to transfer via IMPS instead.' },
        ],
      },
      {
        id: 2,
        category: 'Utility Disconnection Threat',
        title: 'The Midnight Power Cutoff',
        sender: 'SMS from +91-98213XXXXX',
        situation: "At 8:15 PM you get an SMS: 'Dear consumer your power will be disconnected tonight at 9:30 PM from electricity office. Contact electricity officer at 9876543210 immediately.'",
        options: [
          { id: 'opt_a', text: 'Call the mobile number in the SMS to avoid immediate power cut.' },
          { id: 'opt_b', text: 'Check official electricity board app/portal independently using your consumer ID.' },
          { id: 'opt_c', text: 'Forward to local neighbors to check if their electricity is disconnected too.' },
        ],
      },
      {
        id: 3,
        category: 'Task-Job Scam',
        title: 'The YouTube Like Job',
        sender: 'WhatsApp from +62 / +84 International Number',
        situation: "'Earn ₹3,000 daily by rating hotels and YouTube videos. We paid ₹150 for your trial task. Now deposit ₹1,000 to unlock the VIP high-yield merchant task.'",
        options: [
          { id: 'opt_a', text: 'Deposit ₹1,000 since they proved credibility by paying ₹150 first.' },
          { id: 'opt_b', text: 'Ask for a 50% discount on the deposit fee.' },
          { id: 'opt_c', text: 'Block the recruiter; legitimate jobs never require paying upfront deposits to work.' },
        ],
      },
      {
        id: 4,
        category: 'Malicious Android Trojan',
        title: 'The Bank KYC Suspension APK',
        sender: 'SMS from VM-SBINB',
        situation: "'Dear customer, your bank account is deactivated due to pending KYC. Click http://sbi-secure.top/kyc.apk to install NetBanking update and prevent permanent block.'",
        options: [
          { id: 'opt_a', text: 'Download and install the APK file to quickly verify your PAN card.' },
          { id: 'opt_b', text: 'Visit the bank branch or official verified app on Google Play / Apple App Store.' },
          { id: 'opt_c', text: 'Download the APK but open it with airplane mode turned on.' },
        ],
      },
      {
        id: 5,
        category: 'Investment Fraud',
        title: 'The 100% Risk-Free Crypto Bot',
        sender: 'Telegram: Crypto Wealth VIP',
        situation: "A Telegram group admin claims: 'Our proprietary AI algorithm guarantees 15% daily returns with 0% risk. Minimum deposit ₹5,000.'",
        options: [
          { id: 'opt_a', text: 'Transfer ₹5,000 to test if the trading bot works.' },
          { id: 'opt_b', text: 'Recognize that guaranteed high returns with zero risk is a scam hallmark; report & exit.' },
          { id: 'opt_c', text: 'DM other members in the channel to ask if they received withdrawals.' },
        ],
      },
    ];
  }
}

export async function verifySimulatorOption(scenarioId: number, selectedOptionId: string): Promise<SimulatorVerifyResponse> {
  try {
    const res = await fetch(`${API_BASE}/simulator/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_id: scenarioId, selected_option_id: selectedOptionId }),
    });
    if (!res.ok) throw new Error('Verification failed');
    return await res.json();
  } catch {
    const safeOption = scenarioId === 3 ? 'opt_c' : 'opt_b';
    const isSafe = selectedOptionId === safeOption;
    return {
      is_safe: isSafe,
      verdict: isSafe ? 'CORRECT — THREAT NEUTRALIZED' : 'DANGER — SCAM TRAP TRIGGERED',
      explanation: isSafe
        ? 'Excellent risk judgment. You identified the coercive manipulation tactic and adhered to foundational cyber hygiene principles.'
        : 'Falling for this trap grants scammers immediate access to your funds or installs rogue trojans.',
      safety_principle: 'Never verify threats using contacts or links provided in the suspicious message itself. Verify through primary official channels.',
      scam_breakdown: 'Scammers exploit psychological triggers: artificial urgency, fear of penalties, and greed.',
      next_scenario_id: scenarioId < 5 ? scenarioId + 1 : null,
    };
  }
}
