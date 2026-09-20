import { 
  BusinessDecisionResult, 
  BusinessInput, 
  DecisionState, 
  EvidenceItem, 
  FinancialAnalysis, 
  LocationData, 
  PillarGrade,
  Language,
  ConfidenceLevel,
  EvidenceType,
  Provenance
} from '../types';
import { formatINR } from './financialEngine';

export function synthesizeDecision(
  input: BusinessInput,
  location: LocationData,
  financials: FinancialAnalysis,
  language: Language = 'en'
): BusinessDecisionResult {
  const locFitAnalysis = location.locationFit || {
    overallFitScore: location.score || 76,
    fitCategory: 'Moderate Fit' as const,
    factors: [],
    disclaimer: 'Never present simulated/demo market data as live real-world evidence.'
  };

  const locFitScore = locFitAnalysis.overallFitScore;

  // Demand score & grade
  let demandGrade: PillarGrade = 'Good';
  if (location.footfallMonthly < 80000 && location.residentialColoniesNearby < 5) {
    demandGrade = 'Moderate';
  }

  // Competition score & grade
  let compGrade: PillarGrade = 'Moderate';
  if (location.competitorsNearbyCount >= 10) {
    compGrade = 'High';
  } else if (location.competitorsNearbyCount <= 4) {
    compGrade = 'Low';
  }

  // Location fit grade
  let locFitGrade: PillarGrade = 'Good';
  if (locFitScore < 68) {
    locFitGrade = 'Poor';
  } else if (locFitScore < 76) {
    locFitGrade = 'Moderate';
  }

  // Financial feasibility grade
  let finGrade: PillarGrade = 'Suitable';
  if (financials.safetyStatus === 'WATCH') {
    finGrade = 'Stretched';
  } else if (financials.safetyStatus === 'RISKY') {
    finGrade = 'Unviable';
  }

  // Determine overall Decision State using central deterministic decision engine
  let decision: DecisionState = 'START HERE';
  let headline = 'Proceed with planned investment under recommended safeguards';
  let summaryExplanation = 'Favorable local consumer demand signals, resilient debt coverage ratio, and adequate working capital reserves support launching this enterprise.';

  const promoterEquityPct = financials.promoterContributionPct;
  const hasSuperiorAlternative = location.alternativeLocation && (location.alternativeLocation.score - locFitScore >= 7);

  if (financials.safetyStatus === 'RISKY') {
    if (promoterEquityPct < 12) {
      decision = 'REDUCE SCALE';
      if (language === 'te') {
        headline = 'మీ వ్యక్తిగత పెట్టుబడిని కాపాడుకోవడానికి వ్యాపార పరిమాణాన్ని తగ్గించండి';
        summaryExplanation = `ప్రస్తుత ప్రాజెక్ట్ వ్యయం ${formatINR(financials.projectCost)} కి మీ సొంత పెట్టుబడి ${formatINR(financials.ownCapital)} సరిపోక, పెద్ద మొత్తం రుణం (${formatINR(financials.loanRequired)}) తీసుకోవాల్సి వస్తుంది. దీని నెలవారీ EMI ${formatINR(financials.monthlyEMI)} నగదు ప్రవాహాన్ని తీవ్ర ఇబ్బందుల్లోకి నెడుతుంది. ముందుగా చిన్న మైక్రో యూనిట్ ప్రారంభించడం మంచిది.`;
      } else if (language === 'hi') {
        headline = 'अपनी व्यक्तिगत पूंजी की रक्षा के लिए परियोजना का पैमाना घटाएं';
        summaryExplanation = `वर्तमान परियोजना लागत ${formatINR(financials.projectCost)} पर, आपकी अपनी पूंजी ${formatINR(financials.ownCapital)} के साथ बड़ा ऋण (${formatINR(financials.loanRequired)}) लेना होगा जिसकी EMI ${formatINR(financials.monthlyEMI)}/माह होगी। यह नकदी प्रवाह पर भारी दबाव डालता है। पहले एक छोटी इकाई शुरू करने पर विचार करें।`;
      } else {
        headline = 'Reduce project scale to protect your personal capital';
        summaryExplanation = `At the current project cost of ${formatINR(financials.projectCost)}, your own capital of ${formatINR(financials.ownCapital)} requires taking on a large loan (${formatINR(financials.loanRequired)}) with an EMI of ${formatINR(financials.monthlyEMI)}/month. This strains cash flow. Consider launching a compact micro unit first.`;
      }
    } else {
      decision = 'DON\'T BORROW YET';
      if (language === 'te') {
        headline = 'ప్రారంభ నగదు ప్రవాహం స్థిరపడే వరకు వాణిజ్య అప్పులు తీసుకోవద్దు';
        summaryExplanation = `అంచనా వేసిన నెలవారీ రుణ కవరేజ్ (DSCR: ${financials.dscr}) బ్యాంకింగ్ భద్రతా పరిమితి 1.5x కంటే తక్కువగా ఉంది. మొదటి రోజు నుంచే నెలకు ${formatINR(financials.monthlyEMI)} ఈఎంఐ చెల్లించడం వ్యాపారానికి ప్రమాదకరం.`;
      } else if (language === 'hi') {
        headline = 'शुरुआती नकदी प्रवाह स्थापित होने तक व्यावसायिक ऋण से बचें';
        summaryExplanation = `अनुमानित मासिक ऋण सेवा कवरेज (DSCR: ${financials.dscr}) बैंकिंग सुरक्षा सीमा 1.5x से नीचे है। पहले दिन से ${formatINR(financials.monthlyEMI)} की EMI चुकाना जोखिम पैदा करता है।`;
      } else {
        headline = 'Avoid commercial debt until initial cash flow is established';
        summaryExplanation = `The projected monthly debt service coverage (DSCR: ${financials.dscr}) falls below the banking safety threshold of 1.5x. Servicing an EMI of ${formatINR(financials.monthlyEMI)} from day one creates vulnerability.`;
      }
    }
  } else if (hasSuperiorAlternative && (compGrade === 'High' || locFitScore < 75)) {
    decision = 'MOVE TO A BETTER LOCATION';
    if (language === 'te') {
      headline = 'సిఫార్సు చేయబడిన ప్రత్యామ్నాయ ప్రాంతానికి మారడాన్ని పరిశీలించండి';
      summaryExplanation = `${location.areaName} లో మీ ప్రస్తుత వ్యాపార స్థలం తీవ్ర పోటీని ఎదుర్కొంటోంది (${location.competitorsNearbyCount} సమీప దుకాణాలు). సమీపంలోని ${location.alternativeLocation?.areaName} తక్కువ అద్దె మరియు మెరుగైన కస్టమర్ రద్దీని అందిస్తుంది.`;
    } else if (language === 'hi') {
      headline = 'अनुशंसित वैकल्पिक सूक्ष्म-बाजार में जाने पर विचार करें';
      summaryExplanation = `${location.areaName} में आपके वर्तमान स्थान पर भारी प्रतिस्पर्धा है (${location.competitorsNearbyCount} नजदीकी दुकानें)। ${location.alternativeLocation?.areaName} में निकटवर्ती स्थान कम किराया और बेहतर ग्राहक पहुंच प्रदान करता है।`;
    } else {
      headline = 'Consider shifting to the recommended alternative micro-market';
      summaryExplanation = `Your current location at ${location.areaName} faces competition saturation (${location.competitorsNearbyCount} nearby outlets). The nearby location at ${location.alternativeLocation?.areaName} offers lower commercial rent and significantly better customer capture potential.`;
    }
  } else if (financials.safetyStatus === 'WATCH') {
    decision = 'VALIDATE FIRST';
    if (language === 'te') {
      headline = 'పూర్తి పెట్టుబడి పెట్టే ముందు తక్కువ ఖర్చుతో డిమాండ్‌ను ధృవీకరించుకోండి';
      summaryExplanation = `వ్యాపార ప్రాథమిక అంశాలు ఆచరణీయమైనవే, కానీ రుణ చెల్లింపు భద్రత 'జాగ్రత్త' (WATCH) జోన్‌లో ఉంది (DSCR: ${financials.dscr}). భారీ యంత్రాలను కొనుగోలు చేయడానికి ముందు అడ్వాన్స్ ఆర్డర్లను పొందడం మంచిది.`;
    } else if (language === 'hi') {
      headline = 'पूरा सेटअप करने से पहले कम पूंजी वाले पायलट से मांग सत्यापित करें';
      summaryExplanation = `व्यापार की बुनियादी बातें व्यावहारिक हैं, लेकिन ऋण चुकौती सुरक्षा वॉच ज़ोन में है (DSCR: ${financials.dscr})। भारी मशीनरी ऑर्डर करने से पहले अग्रिम ऑर्डर सुरक्षित करने की सलाह दी जाती है।`;
    } else {
      headline = 'Validate demand with low-capex pilot before full setup';
      summaryExplanation = `The business fundamentals are viable, but debt repayment safety is in the WATCH zone (DSCR: ${financials.dscr}). We advise securing firm advance institutional buyers or testing an order counter before ordering heavy machinery.`;
    }
  } else if (compGrade === 'High' && demandGrade !== 'Good') {
    decision = 'RECONSIDER';
    if (language === 'te') {
      headline = 'ఉత్పత్తి నాణ్యత లేదా లక్ష్య కస్టమర్ వర్గాన్ని పునఃసమీక్షించండి';
      summaryExplanation = 'పరిమిత పాదచారుల రద్దీ మరియు అధిక పోటీదారుల సంఖ్య లాభాల మార్జిన్‌పై ఒత్తిడిని కలిగిస్తుంది. ఉత్పత్తుల్లో ప్రత్యేకతను చూపించండి.';
    } else if (language === 'hi') {
      headline = 'उत्पाद मूल्य प्रस्ताव या लक्षित ग्राहक वर्ग पर पुनर्विचार करें';
      summaryExplanation = 'सीमित ग्राहक आवागमन के साथ उच्च प्रतिस्पर्धी एकाग्रता लाभ मार्जिन पर भारी दबाव डालती है। अपने उत्पादों को अलग बनाएं।';
    } else {
      headline = 'Reconsider value proposition or target customer niche';
      summaryExplanation = 'High competitor concentration coupled with limited pedestrian footfall presents high margin pressure. Differentiate your product line or explore specialized B2B institutional orders.';
    }
  } else {
    decision = 'START HERE';
    if (language === 'te') {
      headline = 'అనుకూలమైన రుణ చెల్లింపు భద్రతతో లాభదాయక వ్యాపార అవకాశం';
      summaryExplanation = `ప్రతిపాదిత వ్యాపారం మంచి పాదచారుల రద్దీ, సమతుల్య పోటీ మరియు ${financials.dscr}x బలమైన రుణ సేవా కవరేజ్ నిష్పత్తిని (DSCR) కలిగి ఉంది.`;
    } else if (language === 'hi') {
      headline = 'अनुकूल ऋण चुकौती सुरक्षा के साथ व्यवहार्य व्यावसायिक अवसर';
      summaryExplanation = `प्रस्तावित उद्यम एक व्यवहार्य स्थानीय ग्राहक आधार, संतुलित प्रतिस्पर्धा और ${financials.dscr}x का लचीला ऋण सेवा कवरेज अनुपात प्रदर्शित करता है।`;
    } else {
      headline = 'Viable business opportunity with favorable repayment safety';
      summaryExplanation = `The proposed venture demonstrates a viable local footfall base, balanced competitor density, and a resilient Debt Service Coverage Ratio of ${financials.dscr}.`;
    }
  }

  // Provenance & Source Audit
  const isOverpassMeasured = location.competitorsCountProvenance === 'MEASURED';
  const overpassSource = isOverpassMeasured
    ? `OpenStreetMap via Overpass, queried ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'Category benchmark (PRAVIRAK model)';
  const compConfidence: ConfidenceLevel = isOverpassMeasured ? 'HIGH' : 'MEDIUM';
  const compType: EvidenceType = isOverpassMeasured ? 'Observed' : 'Estimated';
  const compProvenance: Provenance = isOverpassMeasured ? 'MEASURED' : 'ESTIMATED';

  // Localized Evidence Items
  let evidenceList: EvidenceItem[];
  if (language === 'te') {
    evidenceList = [
      {
        id: 'ev-comp',
        title: `5 కి.మీ & 10 కి.మీ పరిధిలో ${location.competitorsNearbyCount} పోటీ దుకాణాలు గుర్తించబడ్డాయి`,
        detail: `5 కి.మీ మైక్రో-క్యాచ్‌మెంట్ మరియు 10 కి.మీ మాక్రో-క్యాచ్‌మెంట్‌లో ${location.competitorsNearbyCount} పోటీ దుకాణాలు గుర్తించబడ్డాయి. సమీప పోటీదారుని సగటు దూరం ${location.competitors[0]?.distanceKm || 0.4} కి.మీ.`,
        source: overpassSource,
        type: compType,
        provenance: compProvenance,
        confidence: compConfidence
      },
      {
        id: 'ev-demand',
        title: `5 కి.మీ & 10 కి.మీ పరిధిలో ${location.residentialColoniesNearby} దట్టమైన నివాస / వాణిజ్య కాలనీలు`,
        detail: `${location.city} లో 5 కి.మీ మరియు 10 కి.మీ పరిధిలోని ప్రధాన రవాణా మరియు వాణిజ్య మార్గాల్లో నెలవారీ పాదచారుల రద్దీ సుమారు ${location.footfallMonthly.toLocaleString('en-IN')} గా అంచనా వేయబడింది.`,
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-financial',
        title: `అంచనా వేసిన రుణ కవరేజ్ నిష్పత్తి (DSCR) ${financials.dscr}x`,
        detail: `నెలవారీ స్థూల మిగులు ${formatINR(financials.monthlyGrossSurplus)} మరియు నెలవారీ రుణ వాయిదా ${formatINR(financials.monthlyEMI)} తో 8% వడ్డీ వద్ద ${financials.safetyStatus} రేటింగ్ నమోదైంది.`,
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-capex',
        title: `యంత్రాలు & ప్రాజెక్ట్ వ్యయం: ${formatINR(financials.projectCost)}`,
        detail: 'వాణిజ్య పరికరాలు, దుకాణ అమరిక మరియు 3 నెలల తప్పనిసరి వర్కింగ్ క్యాపిటల్ నగదు రిజర్వ్ ఆధారంగా లెక్కించబడింది.',
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-loc-fit',
        title: `స్థల అనుకూలత స్కోరు: ${locFitScore}/100`,
        detail: `డిమాండ్, పోటీ, రవాణా సౌకర్యం, వ్యాపార అనుకూలత సహా 6 అంశాల ఆధారంగా విశ్లేషించబడింది.`,
        source: 'Pravirak Spatial Intelligence Engine',
        type: 'AI interpretation',
        provenance: 'AI_GENERATED',
        confidence: 'MEDIUM'
      }
    ];
  } else if (language === 'hi') {
    evidenceList = [
      {
        id: 'ev-comp',
        title: `5 किमी व 10 किमी दायरे में ${location.competitorsNearbyCount} प्रतिस्पर्धी दुकानें मैप की गईं`,
        detail: `प्राथमिक 5 किमी माइक्रो-कैचमेंट और विस्तारित 10 किमी मैक्रो-कैचमेंट के तहत ${location.competitorsNearbyCount} प्रतिस्पर्धी दुकानों की मैपिंग। निकटतम प्रत्यक्ष प्रतिस्पर्धी की औसत दूरी ${location.competitors[0]?.distanceKm || 0.4} किमी है।`,
        source: overpassSource,
        type: compType,
        provenance: compProvenance,
        confidence: compConfidence
      },
      {
        id: 'ev-demand',
        title: `5 किमी व 10 किमी में ${location.residentialColoniesNearby} घनी आवासीय/व्यावसायिक कॉलोनियां`,
        detail: `${location.city} में 5 किमी और 10 किमी कैचमेंट के प्रमुख वाणिज्यिक गलियारों में अनुमानित मासिक फुटफॉल ${location.footfallMonthly.toLocaleString('en-IN')} है।`,
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-financial',
        title: `अनुमानित ऋण कवरेज अनुपात (DSCR) ${financials.dscr}x`,
        detail: `मासिक सकल परिचालन अधिशेष ${formatINR(financials.monthlyGrossSurplus)} के मुकाबले ${formatINR(financials.monthlyEMI)} की EMI पर 8% ब्याज दर के तहत ${financials.safetyStatus} रेटिंग प्राप्त होती है।`,
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-capex',
        title: `मशीनरी एवं परियोजना लागत मानक: ${formatINR(financials.projectCost)}`,
        detail: 'वाणिज्यिक उपकरण, मॉड्यूलर डिस्प्ले फिटआउट और 3 महीने के कार्यशील पूंजी नकद रिजर्व के आधार पर।',
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-loc-fit',
        title: `स्थान उपयुक्तता स्कोर: ${locFitScore}/100`,
        detail: `मांग, प्रतिस्पर्धा, पहुंच और व्यापार उपयुक्तता सहित 6 कारकों से संश्लेषित।`,
        source: 'Pravirak Spatial Intelligence Engine',
        type: 'AI interpretation',
        provenance: 'AI_GENERATED',
        confidence: 'MEDIUM'
      }
    ];
  } else {
    evidenceList = [
      {
        id: 'ev-comp',
        title: `${location.competitorsNearbyCount} Competitor Outlets in 5 km & 10 km Catchment`,
        detail: `Mapped ${location.competitorsNearbyCount} competing trade outlets across primary 5 km micro-catchment and expanded 10 km macro-catchment. Average distance to closest direct competitor is ${location.competitors[0]?.distanceKm || 0.4} km.`,
        source: overpassSource,
        type: compType,
        provenance: compProvenance,
        confidence: compConfidence
      },
      {
        id: 'ev-demand',
        title: `${location.residentialColoniesNearby} Dense Residential / Commercial Clusters in 5 km & 10 km Catchment`,
        detail: `Estimated monthly footfall of ${location.footfallMonthly.toLocaleString('en-IN')} individuals across major transit and commercial corridors in ${location.city} serving 5 km and 10 km catchment areas.`,
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-financial',
        title: `Projected Debt Coverage Ratio of ${financials.dscr}x`,
        detail: `Monthly gross operating surplus of ${formatINR(financials.monthlyGrossSurplus)} against monthly debt installment of ${formatINR(financials.monthlyEMI)} yields a ${financials.safetyStatus} rating under 8.0% p.a. term loan underwriting.`,
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-capex',
        title: `Machinery & Fitout Benchmark at ${formatINR(financials.projectCost)}`,
        detail: 'Based on prevailing procurement quotations for commercial equipment, modular display fitouts, and statutory 3-month working capital cash reserve.',
        source: 'Category benchmark (PRAVIRAK model)',
        type: 'Estimated',
        provenance: 'ESTIMATED',
        confidence: 'MEDIUM'
      },
      {
        id: 'ev-loc-fit',
        title: `Location Fit Analysis: ${locFitScore}/100`,
        detail: `Synthesized from 6 audited factors (Demand, Competition, Accessibility, Trade Fit, Synergy, Opportunity). All metrics indicate explicit data provenance.`,
        source: 'Pravirak Spatial Intelligence Engine',
        type: 'AI interpretation',
        provenance: 'AI_GENERATED',
        confidence: 'MEDIUM'
      }
    ];
  }

  // Localized Risk Factors
  let riskFactors: { title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }[];
  if (language === 'te') {
    riskFactors = [
      {
        title: 'వ్యాపారం ఊపందుకునే సమయంలో వర్కింగ్ క్యాపిటల్ తగ్గిపోవడం',
        severity: financials.safetyStatus === 'RISKY' ? 'High' : 'Medium',
        mitigation: `${formatINR(financials.workingCapitalBufferAmount)} వర్కింగ్ క్యాపిటల్ రిజర్వ్‌ను ఎట్టి పరిస్థితుల్లోనూ దుకాణ అలంకరణల కోసం ఖర్చు చేయకుండా కేవలం రోజువారీ ఖర్చులకు మాత్రమే ఉపయోగించండి.`
      },
      {
        title: 'స్థానిక ధరల పోటీ మరియు లాభాల తగ్గుదల',
        severity: compGrade === 'High' ? 'High' : 'Medium',
        mitigation: 'సాధారణ వస్తువులపై రాయితీలు ఇచ్చే బదులు ప్రత్యేకమైన, ఎక్కువ మార్జిన్ ఉండే ఉత్పత్తులపై దృష్టి పెట్టండి.'
      },
      {
        title: 'ముడి సరుకుల ధరల పెరుగుదల ప్రమాదం',
        severity: 'Medium',
        mitigation: 'ధరల స్థిరత్వం కోసం అధీకృత ప్రాంతీయ పంపిణీదారులతో 30 రోజుల క్రెడిట్ ఒప్పందాన్ని కుదుర్చుకోండి.'
      }
    ];
  } else if (language === 'hi') {
    riskFactors = [
      {
        title: 'शुरुआती दौर में कार्यशील पूंजी का समाप्त होना',
        severity: financials.safetyStatus === 'RISKY' ? 'High' : 'Medium',
        mitigation: `सुनिश्चित करें कि ${formatINR(financials.workingCapitalBufferAmount)} का कार्यशील पूंजी बफर तरल खाते में सुरक्षित रहे और इसे दुकान की सजावट में न लगाएं।`
      },
      {
        title: 'स्थानीय मूल्य प्रतिस्पर्धा और मार्जिन में कमी',
        severity: compGrade === 'High' ? 'High' : 'Medium',
        mitigation: 'सामान्य उत्पादों पर छूट देने के बजाय विशेष उच्च-मार्जिन वाली वस्तुओं पर ध्यान केंद्रित करें।'
      },
      {
        title: 'कच्चे माल की कीमतों में अचानक वृद्धि',
        severity: 'Medium',
        mitigation: '30-दिवसीय निश्चित मूल्य शर्तों के लिए अधिकृत वितरकों के साथ थोक आपूर्ति व्यवस्था स्थापित करें।'
      }
    ];
  } else {
    riskFactors = [
      {
        title: 'Working Capital Depletion During Gestation',
        severity: financials.safetyStatus === 'RISKY' ? 'High' : 'Medium',
        mitigation: `Ensure the ${formatINR(financials.workingCapitalBufferAmount)} working capital buffer is held strictly in a liquid sweep account and not diverted into non-essential decorative shop fitouts.`
      },
      {
        title: 'Local Price Competition & Margin Undercutting',
        severity: compGrade === 'High' ? 'High' : 'Medium',
        mitigation: 'Focus on specialty high-margin items (e.g. customized products, corporate bulk orders) rather than discounting commodity inventory.'
      },
      {
        title: 'Raw Material & Stock Inflation Shock',
        severity: 'Medium',
        mitigation: 'Establish direct wholesale supply arrangements with authorized regional distributors to lock in 30-day fixed pricing terms.'
      }
    ];
  }

  // Localized Action Plan
  let actionPlan: { stepNumber: number; title: string; description: string; timeline: string }[];
  if (language === 'te') {
    actionPlan = [
      {
        stepNumber: 1,
        title: 'స్థలాన్ని మరియు పాదచారుల రద్దీని ప్రత్యక్షంగా తనిఖీ చేయండి',
        description: `${location.areaName} లో ఉదయం (8-10 గం.) మరియు సాయంత్రం (5-8 గం.) రద్దీ వేళల్లో 3 రోజుల పాటు స్వయంగా ప్రజల రాకపోకలను గమనించండి.`,
        timeline: 'వారం 1'
      },
      {
        stepNumber: 2,
        title: 'స్థానిక వినియోగదారుల డిమాండ్‌ను తెలుసుకోండి',
        description: 'సమీపంలోని కనీసం 25 మంది నివాసితులతో మాట్లాడి వారి కొనుగోలు అలవాట్లు మరియు అవసరాలను తెలుసుకోండి.',
        timeline: 'వారం 2'
      },
      {
        stepNumber: 3,
        title: 'ముగ్గురు సరఫరాదారుల నుండి కోట్లను సేకరించండి',
        description: 'యంత్రాలు, దుకాణ అమరిక మరియు ముడి సరుకుల కోసం 3 స్వతంత్ర వ్యాపారుల నుండి ధరల వివరాలను సేకరించండి.',
        timeline: 'వారం 2 - 3'
      },
      {
        stepNumber: 4,
        title: 'చట్టబద్ధమైన రిజిస్ట్రేషన్లను పూర్తి చేయండి',
        description: 'ఉచిత ఉద్యమ్ ఎంఎస్ఎంఈ నమోదు, స్థానిక పురపాలక లైసెన్స్ మరియు సంబంధిత అనుమతులకు దరఖాస్తు చేసుకోండి.',
        timeline: 'వారం 3 - 4'
      },
      {
        stepNumber: 5,
        title: 'PMEGP లేదా ముద్రా రుణ పథకానికి దరఖాస్తు చేయండి',
        description: 'ప్రవీరక్ రూపొందించిన సమగ్ర వ్యాపార నివేదికను బ్యాంక్ శాఖ లేదా జిల్లా పరిశ్రమల కేంద్రంలో సమర్పించండి.',
        timeline: 'వారం 4 - 6'
      },
      {
        stepNumber: 6,
        title: 'నియంత్రిత వ్యాపార కార్యకలాపాలను ప్రారంభించండి',
        description: 'ప్రధాన ఉత్పత్తులతో వ్యాపారాన్ని ప్రారంభించి, ప్రారంభ కస్టమర్ అభిప్రాయాలను సేకరించండి.',
        timeline: 'నెల 2 నుండి'
      }
    ];
  } else if (language === 'hi') {
    actionPlan = [
      {
        stepNumber: 1,
        title: 'भौतिक स्थान और ग्राहक फुटफॉल का सत्यापन करें',
        description: `${location.areaName} में सुबह (8-10 बजे) और शाम (5-8 बजे) के व्यस्त समय के दौरान 3-दिवसीय ऑन-साइट फुटफॉल की गिनती करें।`,
        timeline: 'सप्ताह 1'
      },
      {
        stepNumber: 2,
        title: 'स्थानीय उपभोक्ता मांग को प्रमाणित करें',
        description: 'कम से कम 25 पड़ोसी निवासियों और श्रमिकों से उनकी खरीदारी की आदतों और जरूरतों के बारे में बात करें।',
        timeline: 'सप्ताह 2'
      },
      {
        stepNumber: 3,
        title: 'तीन स्वतंत्र आपूर्तिकर्ता कोटेशन प्राप्त करें',
        description: 'मशीनरी, डिस्प्ले फिक्स्चर और कच्चे माल के लिए प्रतिस्पर्धी लिखित कोटेशन एकत्र करें।',
        timeline: 'सप्ताह 2 - 3'
      },
      {
        stepNumber: 4,
        title: 'प्रासंगिक वैधानिक पंजीकरण पूरे करें',
        description: 'मुफ्त उद्यम पंजीकरण, खाद्य व्यवसाय के लिए FSSAI और नगर निगम दुकान लाइसेंस के लिए आवेदन करें।',
        timeline: 'सप्ताह 3 - 4'
      },
      {
        stepNumber: 5,
        title: 'PMEGP या मुद्रा योजना वित्तपोषण के लिए आवेदन करें',
        description: 'नामित बैंक शाखा या जिला उद्योग केंद्र (DIC) में अपनी औपचारिक प्रवीरक व्यापार योजना प्रस्तुत करें।',
        timeline: 'सप्ताह 4 - 6'
      },
      {
        stepNumber: 6,
        title: 'नियंत्रित व्यावसायिक संचालन शुरू करें',
        description: 'मुख्य उच्च-मांग वाले उत्पादों के साथ सॉफ्ट लॉन्च शुरू करें और शुरुआती समीक्षाओं की निगरानी करें।',
        timeline: 'माह 2 से'
      }
    ];
  } else {
    actionPlan = [
      {
        stepNumber: 1,
        title: 'Verify the Physical Location & Footfall',
        description: `Conduct a 3-day on-site manual footfall count at ${location.areaName} during morning (8-10 AM) and evening (5-8 PM) peak hours. Inspect parking convenience.`,
        timeline: 'Week 1'
      },
      {
        stepNumber: 2,
        title: 'Validate Local Consumer Demand',
        description: 'Interview at least 25 neighboring residents and workers about their existing purchase habits, unmet needs, and average spending.',
        timeline: 'Week 2'
      },
      {
        stepNumber: 3,
        title: 'Obtain Three Independent Supplier Quotes',
        description: 'Collect competitive written quotations for core machinery, display fixtures, and raw materials to ensure procurement stays within budget.',
        timeline: 'Week 2 - 3'
      },
      {
        stepNumber: 4,
        title: 'Complete Relevant Statutory Registrations',
        description: 'Apply for free Udyam MSME registration, relevant sector licenses (such as FSSAI for food), and municipal Shop & Establishment permits.',
        timeline: 'Week 3 - 4'
      },
      {
        stepNumber: 5,
        title: 'Apply for PMEGP or MUDRA Scheme Financing',
        description: 'Submit your formal Pravirak Business Plan to the designated Public Sector Bank branch or District Industries Centre (DIC) nodal officer.',
        timeline: 'Week 4 - 6'
      },
      {
        stepNumber: 6,
        title: 'Initiate Controlled Commercial Operations',
        description: 'Begin commercial soft launch with core high-demand inventory, gather early customer reviews, and monitor weekly collections against projections.',
        timeline: 'Month 2 onwards'
      }
    ];
  }

  return {
    decision,
    headline,
    summaryExplanation,
    pillars: {
      localDemand: {
        grade: demandGrade,
        commentary: `${location.footfallMonthly.toLocaleString('en-IN')} estimated monthly footfall across ${location.residentialColoniesNearby} adjacent clusters.`
      },
      competition: {
        grade: compGrade,
        commentary: `${location.competitorsNearbyCount} direct outlets operational within 5 km and 10 km catchment radiuses.`
      },
      locationFit: {
        grade: locFitGrade,
        commentary: `Fit score ${locFitScore}/100 based on ${locFitAnalysis.fitCategory} rating and local consumer synergy.`
      },
      financialFeasibility: {
        grade: finGrade,
        commentary: `Debt Service Coverage Ratio ${financials.dscr}x (${financials.safetyStatus}) with EMI ${formatINR(financials.monthlyEMI)}.`
      }
    },
    locationFitAnalysis: locFitAnalysis,
    evidenceList,
    riskFactors,
    actionPlan
  };
}
