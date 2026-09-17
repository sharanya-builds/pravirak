// Real-time conversational NLP AI Advisor — powered by OpenRouter.
//
// Routes user doubts and queries to leading LLMs (Gemini, LLaMA, GPT)
// strictly grounded in the user's live business plan:
// - Business Idea & Category
// - Location, Footfall, Competitors
// - Capex, Opex, Revenue, Surplus, EMI, DSCR, and Safety Verdict
// - Language (English, Hindi, or Telugu)

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

const CANDIDATE_MODELS = [
  'google/gemini-2.5-flash',
  'google/gemini-2.5-flash-lite',
  'meta-llama/llama-3.3-70b-instruct',
  'openai/gpt-4o-mini'
];

function buildSystemPrompt(language = 'en') {
  let langInstruction = 'Respond naturally in English.';
  if (language === 'hi') {
    langInstruction = 'उत्तर पूरी तरह से सरल, स्पष्ट और व्यावहारिक हिंदी (Devanagari script) में दें। व्यावसायिक और वित्तीय शब्दों को समझने में आसान रखें।';
  } else if (language === 'te') {
    langInstruction = 'సమాధానాన్ని స్పష్టమైన, సహజమైన మరియు వ్యావహారిక తెలుగులో (Telugu script) ఇవ్వండి. సాంకేతిక ఆర్థిక పదాలను సులభంగా వివరించండి.';
  }

  return `You are PRAVIRAK AI Business Advisor, an expert senior MSME business & credit consultant in India.
Your mission is to help entrepreneurs, shop owners, and small business founders make realistic, data-grounded decisions.

CRITICAL INSTRUCTIONS:
1. Ground your response directly in the user's specific business parameters (project cost, location, footfall, competitors, monthly rent, EMI, DSCR, safety status) whenever relevant.
2. Provide direct, practical, and actionable insights. Avoid generic corporate fluff or vague disclaimers.
3. Structure your response cleanly using short paragraphs or bullet points where appropriate so it is easy to read.
4. ${langInstruction}
5. Keep the tone encouraging, pragmatic, prudent, and helpful.`;
}

function buildUserMessage({
  question,
  businessIdea,
  category,
  location,
  financials,
  decision
}) {
  const locInfo = location ? `
- Location: ${location.areaName || ''} (${location.city || ''}, ${location.state || ''})
- Monthly Footfall: ${location.footfallMonthly ? location.footfallMonthly.toLocaleString('en-IN') : 'N/A'}
- Competitors within 1.5km: ${location.competitorsNearbyCount ?? 'N/A'}
- Key transit points / landmarks: ${(location.transitPoints || []).join(', ') || 'N/A'}
${location.alternativeLocation ? `- Alternative location available: ${location.alternativeLocation.areaName} (${location.alternativeLocation.rentDifferentialPct}% rent differential)` : ''}` : 'Not specified';

  const finInfo = financials ? `
- Total Project Cost: ₹${financials.projectCost?.toLocaleString('en-IN') || 'N/A'}
- Own Capital (Equity): ₹${financials.ownCapital?.toLocaleString('en-IN') || 'N/A'} (${financials.promoterContributionPct || ''}%)
- Bank Loan Required: ₹${financials.loanRequired?.toLocaleString('en-IN') || 'N/A'}
- Projected Monthly Gross Revenue: ₹${financials.projectedMonthlyRevenue?.toLocaleString('en-IN') || 'N/A'}
- Projected Monthly Opex (rent, wages, utilities): ₹${financials.projectedMonthlyOpex?.toLocaleString('en-IN') || 'N/A'}
- Monthly Net Cash Surplus: ₹${financials.monthlyNetSurplus?.toLocaleString('en-IN') || 'N/A'}
- Monthly Bank Loan EMI: ₹${financials.monthlyEMI?.toLocaleString('en-IN') || 'N/A'}
- Debt Service Coverage Ratio (DSCR): ${financials.dscr || 'N/A'}x (${financials.safetyStatus || 'N/A'})
- Break-even estimated: ${financials.breakEvenMonths || 'N/A'} months
- Working Capital Buffer: ₹${financials.workingCapitalBufferAmount?.toLocaleString('en-IN') || 'N/A'}` : 'Not specified';

  const verdictInfo = decision ? `Platform Decision Verdict: ${typeof decision === 'string' ? decision : decision.decision || 'N/A'}` : '';

  return `User Question: "${question}"

BUSINESS CONTEXT:
- Business Idea: ${businessIdea || 'Small Business'}
- Category: ${category || 'General'}
${verdictInfo}

LOCATION DATA:
${locInfo}

FINANCIAL MODEL:
${finInfo}

Please answer the user's question directly with specific advice based on these business facts.`;
}

function generateLocalNLPFallback({
  question,
  businessIdea = 'your business',
  category = 'micro enterprise',
  location = {},
  financials = {},
  decision = 'START HERE',
  language = 'en'
}) {
  const q = (question || '').toLowerCase();
  const area = location.areaName || location.city || 'your chosen area';
  const cost = financials.projectCost ? `₹${financials.projectCost.toLocaleString('en-IN')}` : 'the estimated project cost';
  const loan = financials.loanRequired ? `₹${financials.loanRequired.toLocaleString('en-IN')}` : 'the required loan';
  const emi = financials.monthlyEMI ? `₹${financials.monthlyEMI.toLocaleString('en-IN')}` : 'the monthly EMI';
  const surplus = financials.monthlyNetSurplus ? `₹${financials.monthlyNetSurplus.toLocaleString('en-IN')}` : 'operating surplus';
  const dscr = financials.dscr ? `${financials.dscr}x` : 'sustainable';

  if (language === 'te') {
    if (q.includes('rent') || q.includes('అద్దె') || q.includes('స్థలం') || q.includes('lease')) {
      return `${area} ప్రాంతంలో అద్దె మీ వ్యాపార విజయానికి అత్యంత కీలకం. మీ అంచనా నెలవారీ రాబడి ప్రకారం, అద్దె మొత్తం రాబడిలో 15% నుండి 18% మించకుండా చూసుకోండి. అద్దె అంతకంటే ఎక్కువ ఉంటే లాభాల మార్జిన్ తగ్గుతుంది, కాబట్టి లీజు అగ్రిమెంట్ చేసుకునేటప్పుడు కనీసం 3 సంవత్సరాల లాక్-ఇన్ మరియు స్థిరమైన ఇంక్రిమెంట్ నిబంధనలను ఖరారు చేసుకోండి.`;
    }
    if (q.includes('loan') || q.includes('రుణం') || q.includes('బ్యాంక్') || q.includes('వడ్డీ') || q.includes('emi')) {
      return `మీ ప్రాజెక్ట్ ఖర్చు ${cost} లో మీ సొంత మూలధనం పోను, సుమారు ${loan} రుణ సహాయం అవసరమవుతుంది. నెలవారీ EMI సుమారు ${emi} గా అంచనా వేయబడింది. మీ రుణ చెల్లింపు నిష్పత్తి (DSCR) ${dscr} గా ఉంది, ఇది బ్యాంకులు సురక్షితంగా పరిగణించే పరిధిలోనే ఉంది. PMEGP లేదా ముద్రా ద్వారా దరఖాస్తు చేసుకోవడం ద్వారా పూచీకత్తు లేకుండా ఈ రుణాన్ని పొందవచ్చు.`;
    }
    return `"${businessIdea}" కోసం (${area}): మీ ప్రాజెక్ట్ మొత్తం వ్యయం ${cost} మరియు అంచనా నికర మిగులు నెలకు ${surplus}. ఈ వ్యాపారంలో విజయవంతం కావడానికి మొదటి 3 నెలల నిర్వహణ మూలధనాన్ని ఎల్లప్పుడూ సిద్ధంగా ఉంచుకోండి. అదనంగా స్థానిక కస్టమర్ల అభిరుచులను గమనించి నాణ్యతతో కూడిన సేవలను అందించడం ద్వారా పోటీని సులభంగా ఎదుర్కొనవచ్చు.`;
  }

  if (language === 'hi') {
    if (q.includes('rent') || q.includes('किराया') || q.includes('lease') || q.includes('दुकान')) {
      return `${area} में दुकान का किराया आपके कुल मासिक खर्च का एक बड़ा हिस्सा होगा। वित्तीय मानक के अनुसार, किराया आपके अनुमानित मासिक सकल राजस्व के 15-18% से अधिक नहीं होना चाहिए। यदि मांग अधिक है, तो 3 साल के एग्रीमेंट और पूर्व-निर्धारित किराया वृद्धि के साथ ही आगे बढ़ें।`;
    }
    if (q.includes('loan') || q.includes('ऋण') || q.includes('कर्ज') || q.includes('bank') || q.includes('emi')) {
      return `आपकी परियोजना लागत ${cost} के लिए लगभग ${loan} का बैंक ऋण आवश्यक होगा। 9.5% अनुमानित ब्याज दर पर मासिक EMI लगभग ${emi} होगी। आपका DSCR अनुपात ${dscr} है, जो बैंक ऋण स्वीकृति के लिए अनुकूल है। PMEGP या मुद्रा योजना के तहत आवेदन करने पर बिना गारंटी के ऋण प्राप्त किया जा सकता है।`;
    }
    return `"${businessIdea}" (${area}) के लिए सलाह: कुल परियोजना लागत ${cost} और मासिक शुद्ध अधिशेष लगभग ${surplus} आंका गया है। शुरुआती 3-6 महीनों के दौरान कैश फ्लो को स्थिर रखने के लिए कार्यशील पूंजी रिज़र्व बनाए रखें और स्थानीय स्तर पर प्रत्यक्ष ग्राहक संबंध बनाने पर ध्यान केंद्रित करें।`;
  }

  // English fallback
  if (q.includes('rent') || q.includes('lease') || q.includes('deposit') || q.includes('property')) {
    return `In ${area}, commercial rentals should be strictly capped at 15% to 18% of your projected monthly revenue to keep your margins safe. Before committing to a lease agreement, negotiate a rent-free fit-out period of 30 to 45 days while you set up equipment. If the landlord asks for more than 3-4 months of security deposit, explore adjacent secondary roads or negotiate staggered deposit terms.`;
  }
  if (q.includes('loan') || q.includes('borrow') || q.includes('interest') || q.includes('bank') || q.includes('emi')) {
    return `For ${businessIdea}, your modeled debt requirement is ${loan} against a total capital layout of ${cost}. At standard MSME priority sector lending rates (~9.5% p.a.), the resulting monthly EMI of ${emi} is well covered by your projected net surplus of ${surplus} (DSCR coverage of ${dscr}). Apply via the Udyam portal first, then approach your lead district bank with a PMEGP or MUDRA Tarun proposal to avail CGTMSE collateral-free guarantee coverage.`;
  }
  if (q.includes('risk') || q.includes('compet') || q.includes('threat') || q.includes('fail')) {
    return `The key operational risks for ${businessIdea} in ${area} revolve around: (1) managing cash flow during the first ${financials.breakEvenMonths || '4'} months before reaching operational break-even, and (2) differentiating from the ${location.competitorsNearbyCount || 'existing'} competitors in the 1.5km radius. We recommend preserving your dedicated ₹${financials.workingCapitalBufferAmount?.toLocaleString('en-IN') || '75,000'} liquid working capital buffer and focusing on repeat customer loyalty programs.`;
  }

  return `Regarding your inquiry on "${question}" for ${businessIdea} in ${area}:
Based on your project model (Total Cost: ${cost}, Net Monthly Surplus: ${surplus}, Debt Safety: ${dscr}):
1. Cost Discipline: Ensure your fixed monthly overheads (rent + salaries + power) do not cross 65% of your baseline revenue.
2. Liquidity: Keep at least 3 months of operational expenses reserved in a dedicated current account to absorb seasonal dips.
3. Market Expansion: Leverage local transit footfall (${location.footfallMonthly ? location.footfallMonthly.toLocaleString('en-IN') : 'pedestrian traffic'}) through localized digital promotions and direct neighborhood delivery.`;
}

export async function answerAdvisorQuestion(payload) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const { question, language = 'en' } = payload || {};

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return {
      answer: 'Please ask a specific question regarding your business, operations, financing, or strategy.',
      grounded: false,
      model: 'system-validation'
    };
  }

  if (!apiKey) {
    return {
      answer: generateLocalNLPFallback(payload),
      grounded: false,
      model: 'local-expert-engine'
    };
  }

  const systemPrompt = buildSystemPrompt(language);
  const userPrompt = buildUserMessage(payload);

  for (const model of CANDIDATE_MODELS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://pravirak.app',
          'X-Title': 'PRAVIRAK AI Advisor'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          max_tokens: 800,
          temperature: 0.35,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });

      clearTimeout(timeout);

      if (!response.ok) {
        continue;
      }

      const data = await response.json().catch(() => null);
      const text = data?.choices?.[0]?.message?.content;

      if (text && typeof text === 'string' && text.trim().length > 20) {
        return {
          answer: text.trim(),
          grounded: true,
          model: `${model} (via OpenRouter)`
        };
      }
    } catch {
      // Move to next candidate model
      continue;
    }
  }

  // Graceful fallback if external LLM times out or is unreachable
  return {
    answer: generateLocalNLPFallback(payload),
    grounded: false,
    model: 'pravirak-context-engine'
  };
}
