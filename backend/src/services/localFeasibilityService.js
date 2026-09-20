import { z } from 'zod';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

const CANDIDATE_MODELS = [
  'google/gemini-2.5-flash',
  'google/gemini-2.5-flash-lite',
  'meta-llama/llama-3.3-70b-instruct',
  'openai/gpt-4o-mini'
];

export const localFeasibilitySchema = z.object({
  marketReach: z.object({
    catchmentKm: z.number().min(5).max(10),
    summary: z.string().min(1),
    distributionChannels: z.array(z.string()).min(1)
  }),
  opportunities: z.array(
    z.object({
      niche: z.string().min(1),
      why: z.string().min(1)
    })
  ).min(1),
  swot: z.object({
    strengths: z.array(z.string()).min(1),
    weaknesses: z.array(z.string()).min(1),
    opportunities: z.array(z.string()).min(1),
    threats: z.array(z.string()).min(1)
  }),
  threats: z.array(
    z.object({
      type: z.enum(['supply_chain', 'seasonal', 'single_buyer', 'other']),
      description: z.string().min(1),
      mitigation: z.string().min(1)
    })
  ).min(1),
  pricing: z.object({
    strategy: z.string().min(1),
    priceBandNote: z.string().min(1)
  }),
  assumptions: z.array(z.string()).min(1)
});

/**
 * Builds the strict JSON-only system prompt.
 */
function buildSystemPrompt(language = 'en') {
  let langInstruction = 'Output all text values in clear, natural English.';
  if (language === 'hi') {
    langInstruction = 'Output all text values strictly in Hindi (Devanagari script - हिंदी). Use clear, professional MSME terminology.';
  } else if (language === 'te') {
    langInstruction = 'Output all text values strictly in Telugu (Telugu script - తెలుగు). Use natural, accessible regional business terminology.';
  }

  return `You are PRAVIRAK's Local Feasibility Analyst, an expert MSME business and credit evaluator for rural and semi-urban India.
You MUST return a STRICT, PARSEABLE JSON OBJECT ONLY.
Do NOT include markdown formatting, backticks (\`\`\` or \`\`\`json), comments, greetings, or extra prose.

SCHEMA:
{
  "marketReach": {
    "catchmentKm": 5 to 10 (number),
    "summary": string,
    "distributionChannels": string[]
  },
  "opportunities": [
    { "niche": string, "why": string }
  ],
  "swot": {
    "strengths": string[],
    "weaknesses": string[],
    "opportunities": string[],
    "threats": string[]
  },
  "threats": [
    {
      "type": "supply_chain" | "seasonal" | "single_buyer" | "other",
      "description": string,
      "mitigation": string
    }
  ],
  "pricing": {
    "strategy": string,
    "priceBandNote": string
  },
  "assumptions": string[]
}

CRITICAL RULES:
1. Use ONLY the inputs provided.
2. If data is not provided, state "data not available" instead of guessing or hallucinating.
3. Tailor all advice strictly to the stated capital and micro-enterprise scale.
4. Output in the requested language: ${langInstruction}. Keep official scheme names, programs, and statutory terms (such as PMEGP, MUDRA, Udyam, GST, FSSAI) in their original English form.
5. NEVER invent or output rupee amounts or numerical counts that were not explicitly given. In pricing, provide qualitative strategic guidance only (e.g. cost-plus margin, local mandi benchmark matching). Do not invent prices.
6. Return only a valid JSON object matching the schema.`;
}

/**
 * Builds the user prompt detailing the input parameters.
 */
function buildUserPrompt({
  category,
  location = {},
  ownCapital,
  competitorCount,
  catchmentPopulationEstimate,
  projectCost,
  language = 'en'
}) {
  const locParts = [
    location.village ? `Village: ${location.village}` : 'Village: data not available',
    location.block ? `Block/Mandal: ${location.block}` : 'Block/Mandal: data not available',
    location.district ? `District: ${location.district}` : 'District: data not available',
    location.state ? `State: ${location.state}` : 'State: data not available'
  ].join(', ');

  return `BUSINESS & LOCALITY INPUTS:
- Business Category: ${category || 'General MSME / Retail'}
- Location Hierarchy: ${locParts}
- Promoter Own Capital: ${typeof ownCapital === 'number' && ownCapital > 0 ? 'Provided at micro-enterprise scale' : 'data not available'}
- Estimated Project Cost: ${typeof projectCost === 'number' && projectCost > 0 ? 'Provided micro-scale capex' : 'data not available'}
- Verified Competitor Count (OpenStreetMap): ${typeof competitorCount === 'number' ? competitorCount : 'data not available'}
- Catchment Population Estimate: ${typeof catchmentPopulationEstimate === 'number' && catchmentPopulationEstimate > 0 ? catchmentPopulationEstimate : 'data not available'}
- Target Language: ${language}

Generate the Local Feasibility Report JSON adhering strictly to the schema and instructions.`;
}

/**
 * Clean LLM response string to extract pure JSON.
 */
function extractJsonString(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let cleaned = raw.trim();
  // Strip ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

/**
 * Deterministic template fallback generator (when LLM is offline or validation fails).
 * Marked with aiGenerated: false and provenance: 'ESTIMATED'.
 */
export function generateDeterministicFallback({
  category = 'General Store',
  location = {},
  ownCapital,
  competitorCount,
  catchmentPopulationEstimate,
  projectCost,
  language = 'en'
}) {
  const locName = [location.village, location.block, location.district]
    .filter(Boolean)
    .join(', ') || 'the designated local catchment';

  const catLower = (category || '').toLowerCase();
  const isFood = /food|bakery|restaurant|canteen|sweet|hotel/.test(catLower);
  const isGarment = /garment|cloth|tailor|textile|apparel/.test(catLower);
  const isKirana = /kirana|grocery|provisions|store|fmcg/.test(catLower);

  if (language === 'hi') {
    return {
      marketReach: {
        catchmentKm: 5,
        summary: `${locName} के 5 किमी दायरे में प्राथमिक खुदरा एवं दैनिक आवश्यकता आपूर्ति पर केंद्रित।`,
        distributionChannels: [
          'प्रत्यक्ष काउंटर बिक्री (Direct Counter Sales)',
          'स्थानीय साप्ताहिक हाट / बाजार व्यवस्था',
          'फोन व संदेश के माध्यम से ऑर्डर बुकिंग'
        ]
      },
      opportunities: [
        {
          niche: isFood ? 'ताजा दैनिक स्नैक्स एवं मिष्ठान आपूर्ति' : isGarment ? 'स्कूल ड्रेस व स्थानीय सिलाई ऑल्ट्रेशन' : 'दैनिक उपभोग के आवश्यक घरेलू पैक',
          why: 'निकटवर्ती ग्रामीण आबादी के लिए निकटतम विश्वसनीय उपलब्धता।'
        },
        {
          niche: 'त्योहारी व मौसमी अग्रिम ऑर्डर बुकिंग',
          why: 'स्थानीय ग्राहकों के साथ प्रत्यक्ष व्यक्तिगत संबंध और भरोसेमंद सेवा।'
        }
      ],
      swot: {
        strengths: [
          'स्थानीय ग्राहकों से सीधा संपर्क एवं न्यूनतम परिवहन लागत',
          'सूक्ष्म पूंजी के अनुकूल कम परिचालन व्यय',
          'कैचमेंट में दैनिक मांग की निरंतरता'
        ],
        weaknesses: [
          'आरंभिक कार्यशील पूंजी की सीमित सीमा',
          'एकल संचालक की दैनिक क्षमता सीमा',
          'थोक सप्लायरों से सीमित क्रेडिट अवधि'
        ],
        opportunities: [
          'साप्ताहिक हाट के दिनों में अतिरिक्त मांग का लाभ उठाना',
          'नियमित ग्राहकों को त्वरित होम/दुकान डिलीवरी की पेशकश',
          'मांग बढ़ने पर पूरक वस्तुओं का विस्तार'
        ],
        threats: [
          'मौसम या कृषि चक्र के आधार पर मौसमी मांग में उतार-चढ़ाव',
          'थोक आपूर्ति में अस्थायी रुकावट या मूल्य वृद्धि',
          'प्रतिद्वंद्वी दुकानों द्वारा अनौपचारिक उधारी की पेशकश'
        ]
      },
      threats: [
        {
          type: 'supply_chain',
          description: 'थोक मंडियों से माल की आपूर्ति में देरी अथवा परिवहन लागत में वृद्धि।',
          mitigation: '2-3 वैकल्पिक थोक विक्रेताओं के संपर्क रखें और आवश्यक स्टॉक का 7 दिवसीय बफर बनाएं।'
        },
        {
          type: 'seasonal',
          description: 'कृषि कटाई और त्योहारों के अनुसार स्थानीय नकदी प्रवाह में मौसमी चक्र।',
          mitigation: 'त्योहारी सीजन में स्टॉक बढ़ाएं और मंदी के महीनों में इन्वेंट्री हल्की रखें।'
        },
        {
          type: 'single_buyer',
          description: 'किसी एक बड़े खरीदार या समूह पर अत्यधिक निर्भरता की स्थिति में भुगतान जोखिम।',
          mitigation: 'व्यापक खुदरा ग्राहक आधार बनाएं और एकल ग्राहक को अनधिकृत बड़ी उधारी न दें।'
        }
      ],
      pricing: {
        strategy: 'लागत-आधारित मूल्य निर्धारण एवं स्थानीय बाजार दरों से समन्वय।',
        priceBandNote: 'सलाह: अंतिम दरें तय करने से पहले स्थानीय मंडी और बाजार के चालू भावों से सत्यापन अवश्य करें।'
      },
      assumptions: [
        'प्रवर्तक स्वयं दैनिक व्यवसाय संचालन का प्रबंधन करेंगे।',
        'व्यावसायिक परिसर का किराया अथवा कब्जा प्रथम 12 माह तक स्थिर रहेगा।',
        'स्थानीय उपभोक्ता मांग सामान्य नकदी प्रवाह चक्र का पालन करेगी।'
      ],
      aiGenerated: false,
      provenance: 'ESTIMATED'
    };
  }

  if (language === 'te') {
    return {
      marketReach: {
        catchmentKm: 5,
        summary: `${locName} పరిసరాల్లోని 5 కి.మీ పరిధిలో రోజువారీ చిల్లర వ్యాపార సేవలపై దృష్టి సారిస్తుంది.`,
        distributionChannels: [
          'ప్రత్యక్ష కౌంటర్ అమ్మకాలు (Direct Counter Sales)',
          'స్థానిక వారపు సంతలు మరియు అంగడి కేంద్రాలు',
          'ఫోన్ మరియు సందేశాల ద్వారా ఆర్డర్ స్వీకరణ'
        ]
      },
      opportunities: [
        {
          niche: isFood ? 'తాజా చిరుతిళ్ళు మరియు స్వీట్ల సరఫరా' : isGarment ? 'స్కూల్ యూనిఫారాలు మరియు స్థానిక టైలరింగ్' : 'చిన్న ప్యాకెట్లలో నిత్యావసర సరుకుల పంపిణీ',
          why: 'స్థానిక గ్రామీణ ప్రజలకు అందుబాటులో ఉండే సులభమైన సేవా కేంద్రం.'
        },
        {
          niche: 'పండుగలు మరియు ప్రత్యేక సందర్భాల ముందస్తు ఆర్డర్లు',
          why: 'స్థానిక కొనుగోలుదారులతో ప్రత్యక్ష వ్యక్తిగత సంబంధాలు మరియు నమ్మకం.'
        }
      ],
      swot: {
        strengths: [
          'స్థానిక కస్టమర్లతో నేరుగా సత్సంబంధాలు మరియు తక్కువ రవాణా ఖర్చులు',
          'పరిమిత పెట్టుబడికి తగిన తక్కువ నిర్వహణ ఖర్చులు',
          'రోజువారీ నిత్యావసర వస్తువులకు స్థిరమైన డిమాండ్'
        ],
        weaknesses: [
          'ప్రారంభ వర్కింగ్ క్యాపిటల్ నిధుల పరిమితి',
          'ఒకే నిర్వాహకుడిపై ఆధారపడిన నిర్వహణ సామర్థ్యం',
          'హోల్‌సేల్ వ్యాపారుల నుండి స్వల్పకాలిక అరువు లభ్యత'
        ],
        opportunities: [
          'వారపు సంత రోజుల్లో అదనపు గిరాకీని ఒడిసిపట్టడం',
          'సమీప గ్రామాల నుండి వచ్చే వారికి సత్వర సేవలు అందించడం',
          'లాభదాయకతను బట్టి మరిన్ని అనుబంధ వస్తువులను చేర్చడం'
        ],
        threats: [
          'వ్యవసాయ సీజన్ లేదా వర్షాల ఆధారంగా స్థానిక నగదు ప్రవాహంలో హెచ్చుతగ్గులు',
          'హోల్‌సేల్ మార్కెట్లలో ధరల ఆకస్మిక పెరుగుదల లేదా సరుకు కొరత',
          'సమీప వ్యాపారులు ఇచ్చే అసంఘటిత అరువు పోటీ'
        ]
      },
      threats: [
        {
          type: 'supply_chain',
          description: 'హోల్‌సేల్ మార్కెట్ నుండి సరుకు రాకలో జాప్యం లేదా రవాణా ఛార్జీల పెరుగుదల.',
          mitigation: 'కనీసం 2-3 ప్రత్యామ్నాయ డీలర్లతో సంబంధాలు కలిగి ఉండటం మరియు 7 రోజుల నిల్వ నిర్వహించడం.'
        },
        {
          type: 'seasonal',
          description: 'పంట చేతికొచ్చే సమయాలు మరియు పండుగల ఆధారంగా వ్యాపార పరిమాణంలో మార్పులు.',
          mitigation: 'సీజన్ సమయంలో డిమాండ్‌కు సరిపడా నిల్వలు ఉంచడం, సాధారణ రోజుల్లో నిల్వ తగ్గించడం.'
        },
        {
          type: 'single_buyer',
          description: 'ఏదైనా ఒకే పెద్ద కస్టమర్‌పై ఆధారపడితే ఏర్పడే బకాయిల చెల్లింపు ముప్పు.',
          mitigation: 'విస్తృత చిల్లర కస్టమర్ బేస్‌ను సృష్టించడం మరియు భారీగా అప్పులు ఇవ్వకుండా నివారించడం.'
        }
      ],
      pricing: {
        strategy: 'ఖర్చుల ఆధారిత మార్జిన్ మరియు స్థానిక మార్కెట్ ధరలతో పోలిక.',
        priceBandNote: 'మార్గదర్శకం: ధరలను నిర్ణయించే ముందు స్థానిక మార్కెట్ / మండి ధరలతో ధృవీకరించుకోండి.'
      },
      assumptions: [
        'వ్యాపార వ్యవస్థాపకుడే స్వయంగా రోజువారీ బాధ్యతలను నిర్వహిస్తారు.',
        'వ్యాపార స్థల అద్దె లేదా లీజు కనీసం మొదటి 12 నెలల పాటు స్థిరంగా ఉంటుంది.',
        'స్థానిక కొనుగోలు ప్రవర్తన సాధారణ ప్రాంతీయ ఆర్థిక చక్రాలకు అనుగుణంగా ఉంటుంది.'
      ],
      aiGenerated: false,
      provenance: 'ESTIMATED'
    };
  }

  // Default: English
  return {
    marketReach: {
      catchmentKm: 5,
      summary: `Focuses on a primary retail and direct service footprint within a 5 km radius across ${locName}.`,
      distributionChannels: [
        'Direct counter walk-in sales',
        'Participation in weekly local market (haat / santhe) clusters',
        'Local phone / messaging-based order reservation'
      ]
    },
    opportunities: [
      {
        niche: isFood ? 'Fresh daily prepared snacks and morning bakery essentials' : isGarment ? 'School uniform alterations and festival tailoring' : 'Daily essentials pre-packed in small, affordable ticket sizes',
        why: 'Captive local micro-catchment with regular recurring requirements.'
      },
      {
        niche: 'Advance custom booking for community events and seasonal occasions',
        why: 'Direct proprietor trust and personalized fulfillment within the immediate community.'
      }
    ],
    swot: {
      strengths: [
        'Direct neighborly relationship with shoppers and zero distributor intermediary overhead',
        'Lean operating expense profile matched to promoter own capital',
        'Daily staple demand resilience within local walking radius'
      ],
      weaknesses: [
        'Limited liquid working capital reserve during early operational quarters',
        'Single-operator daily capacity bandwidth constraints',
        'Dependence on supplier credit cycles for inventory restocking'
      ],
      opportunities: [
        'Leverage higher shopper inflow during weekly local haat days',
        'Introduce complementary fast-moving items as operating cash flow stabilizes',
        'Direct bulk sourcing arrangements with district-level agricultural or wholesale mandis'
      ],
      threats: [
        'Seasonal agricultural income cycles affecting local purchasing power',
        'Wholesale price shocks or temporary transport logistics disruptions',
        'Informal credit (udhar) pressures from competing long-standing neighborhood shops'
      ]
    },
    threats: [
      {
        type: 'supply_chain',
        description: 'Wholesale mandi stockouts or sudden logistics price hikes on essential raw stock.',
        mitigation: 'Maintain backup supplier ties across neighbouring taluk/district centers and maintain a 7-day safety buffer.'
      },
      {
        type: 'seasonal',
        description: 'Demand swings aligned with agricultural harvest cycles and regional weather extremes.',
        mitigation: 'Stock up inventory ahead of peak harvest/festival months and minimize dead stock during off-peak windows.'
      },
      {
        type: 'single_buyer',
        description: 'Over-exposure to a small group of institutional or bulk buyers causing receivable delays.',
        mitigation: 'Maintain a diversified retail consumer base and strictly cap unsecured credit limits to any individual buyer.'
      }
    ],
    pricing: {
      strategy: 'Prudent cost-plus margin aligned with prevailing neighbourhood market rates.',
      priceBandNote: 'Guidance, verify with local mandi/market rates (text guidance only; verify counter prices locally).'
    },
    assumptions: [
      'Promoter directly oversees day-to-day operations without full-time supervisory hire overhead.',
      'Commercial tenancy or premises access remains stable across the initial 12 months.',
      'Customer footfall follows typical semi-urban / rural cash flow rhythms.'
    ],
    aiGenerated: false,
    provenance: 'ESTIMATED'
  };
}

/**
 * Executes an OpenRouter API call.
 */
async function callOpenRouter(apiKey, systemPrompt, userPrompt) {
  const model = CANDIDATE_MODELS[0];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://pravirak.gov.in',
        'X-Title': 'PRAVIRAK Local Feasibility Report'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`OpenRouter returned status ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter returned empty choices');
    }
    return content;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Main service method to generate the Local Feasibility Report.
 * Uses schema validation with Zod and retries once upon failure before falling back.
 */
export async function generateLocalFeasibilityReport(params) {
  const { language = 'en' } = params;
  const apiKey = process.env.OPENROUTER_API_KEY;

  // If no API key is set, immediately return deterministic fallback
  if (!apiKey) {
    return generateDeterministicFallback(params);
  }

  const systemPrompt = buildSystemPrompt(language);
  const userPrompt = buildUserPrompt(params);

  // Attempt 1: Initial call
  try {
    const rawContent = await callOpenRouter(apiKey, systemPrompt, userPrompt);
    const jsonStr = extractJsonString(rawContent);
    const parsed = JSON.parse(jsonStr);
    const validation = localFeasibilitySchema.safeParse(parsed);

    if (validation.success) {
      return {
        ...validation.data,
        aiGenerated: true,
        provenance: 'AI_GENERATED'
      };
    }

    // Validation failed on Attempt 1 -> Retry once with corrective prompt
    const errorIssues = validation.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    const retryUserPrompt = `${userPrompt}\n\nCORRECTION REQUIRED: Your previous response failed schema validation with errors: [${errorIssues}]. Fix all errors and return ONLY the valid JSON object strictly matching the schema.`;

    const retryRaw = await callOpenRouter(apiKey, systemPrompt, retryUserPrompt);
    const retryJsonStr = extractJsonString(retryRaw);
    const retryParsed = JSON.parse(retryJsonStr);
    const retryValidation = localFeasibilitySchema.safeParse(retryParsed);

    if (retryValidation.success) {
      return {
        ...retryValidation.data,
        aiGenerated: true,
        provenance: 'AI_GENERATED'
      };
    }

    // Schema validation failed after retry
    return generateDeterministicFallback(params);
  } catch (err) {
    // Network error, JSON parse error, or timeout
    return generateDeterministicFallback(params);
  }
}
