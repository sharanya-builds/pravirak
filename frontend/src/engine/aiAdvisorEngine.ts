import { BusinessDecisionResult, BusinessInput, FinancialAnalysis, LocationData, Language } from '../types';
import { formatINR, formatINRLakhs } from './financialEngine';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function generateContextualQnA(
  input: BusinessInput,
  location: LocationData,
  financials: FinancialAnalysis,
  decision: BusinessDecisionResult,
  language: Language = 'en'
): FAQItem[] {
  if (language === 'hi') {
    return [
      {
        id: 'why_location',
        question: 'आपने इस स्थान की सिफारिश क्यों की?',
        answer: `हमने स्थानीय पैदल आवागमन (${location.footfallMonthly.toLocaleString('en-IN')}/माह) और ${location.residentialColoniesNearby} घनी आवासीय कॉलोनियों (${location.customerColonies.slice(0, 2).join(', ')}) की निकटता के आधार पर ${location.areaName} (${location.city}) का मूल्यांकन किया। यद्यपि 1.5 किमी के भीतर ${location.competitorsNearbyCount} प्रतिस्पर्धी हैं, फिर भी ${location.transitPoints[0] || 'परिवहन गलियारों'} के पास पैदल ग्राहकों का जमावड़ा विश्वसनीय दैनिक मांग पैदा करता है। ${location.alternativeLocation ? `नोट: हमने ${location.alternativeLocation.areaName} में ${Math.abs(location.alternativeLocation.rentDifferentialPct)}% कम किराए और ${location.alternativeLocation.score}/100 स्कोर वाला एक वैकल्पिक स्थल भी पहचाना है।` : ''}`
      },
      {
        id: 'how_project_cost',
        question: 'मेरी परियोजना लागत की गणना कैसे की गई?',
        answer: `आपकी कुल परियोजना लागत ${formatINR(financials.projectCost)} की गणना ${input.category || 'इस व्यवसाय'} के लिए मानक उद्योग बेंचमार्क का उपयोग करके की गई है। इसमें शामिल हैं: (1) मशीनरी, प्रदर्शन फिटआउट और बिजली कनेक्शन के लिए ${formatINR(financials.capexItems.reduce((acc, i) => acc + i.amount, 0))} का अचल पूंजीगत व्यय (Capex); और (2) ${formatINR(financials.workingCapitalBufferAmount)} का अनिवार्य 3-महीने का कार्यशील पूंजी नकद रिजर्व। यह नकद बफर आपको मासिक बिलों में चूक किए बिना शुरुआती बिक्री में देरी से बचाता है।`
      },
      {
        id: 'sales_fall_20',
        question: 'यदि बिक्री में 20% की गिरावट आए तो क्या होगा?',
        answer: `यदि बिक्री 20% गिरती है, तो आपका मासिक राजस्व ${formatINR(financials.projectedMonthlyRevenue)} से घटकर ${formatINR(Math.round(financials.projectedMonthlyRevenue * 0.8))} रह जाता है। चूंकि निश्चित लागत (किराया, बिजली, वेतन) तुरंत कम नहीं की जा सकती, आपका मासिक शुद्ध नकद अधिशेष ${formatINR(financials.monthlyNetSurplus)} से घटकर लगभग ${formatINR(Math.round(financials.monthlyNetSurplus * 0.48))} हो जाता है। यदि आप अनुशंसित 3 महीने का कार्यशील पूंजी रिजर्व बनाए रखते हैं, तो आप अपनी ${formatINR(financials.monthlyEMI)} की EMI पर डिफॉल्ट किए बिना इस मंदी का सामना कर सकते हैं।`
      },
      {
        id: 'why_financing',
        question: 'यह वित्तपोषण विकल्प क्यों उपयुक्त है?',
        answer: `${formatINR(financials.projectCost)} की परियोजना लागत के मुकाबले ${formatINR(financials.ownCapital)} की अपनी पूंजी के साथ, आपको ${formatINR(financials.loanRequired)} के ऋण की आवश्यकता है। यह PMEGP और मुद्रा तरुण जैसी सरकारी योजनाओं के अनुकूल है क्योंकि आपकी प्रमोटर इक्विटी (${financials.promoterContributionPct}%) 10% की आवश्यकता को पूरा करती है, और यह परिसंपत्ति संपार्श्विक-मुक्त CGTMSE क्रेडिट गारंटी कवरेज के लिए पात्र है।`
      },
      {
        id: 'what_licenses',
        question: 'शुरू करने से पहले मुझे किन लाइसेंसों की आवश्यकता हो सकती है?',
        answer: `${input.category || 'इस उद्यम'} के लिए आवश्यक वैधानिक पंजीकरण हैं: (1) बैंक योजना लाभों के लिए निःशुल्क उद्यम एमएसएमई पंजीकरण; (2) FSSAI खाद्य सुरक्षा पंजीकरण (यदि खाद्य पदार्थ तैयार या परोस रहे हैं); (3) स्थानीय नगर निकाय से दुकान और स्थापना / व्यापार लाइसेंस; और (4) जीएसटी पंजीकरण यदि वार्षिक कारोबार ₹40 लाख से अधिक हो।`
      },
      {
        id: 'how_improve_profit',
        question: 'मैं अपने लाभ मार्जिन में कैसे सुधार कर सकता हूँ?',
        answer: `तीन ठोस कदम: (1) उच्च मार्जिन वाले मुख्य उत्पादों पर ध्यान केंद्रित करें (विशेष बेकरी केक या निजी लेबल उत्पादों पर 45-55% सकल मार्जिन होता है); (2) ऑर्डर निरंतरता स्थापित होने के बाद थोक आपूर्तिकर्ताओं के साथ 30-दिन के क्रेडिट चक्र पर बातचीत करें; और (3) डिलीवरी एग्रीगेटर के 18-25% कमीशन से बचने के लिए नजदीकी सोसाइटियों के साथ सीधा व्हाट्सएप ऑर्डरिंग नेटवर्क बनाएं।`
      }
    ];
  }

  if (language === 'te') {
    return [
      {
        id: 'why_location',
        question: 'మీరు ఈ స్థలాన్ని ఎందుకు సిఫార్సు చేశారు?',
        answer: `మేము స్థానిక పాదచారుల రద్దీ (${location.footfallMonthly.toLocaleString('en-IN')}/నెల) మరియు ${location.residentialColoniesNearby} దట్టమైన నివాస కాలనీల (${location.customerColonies.slice(0, 2).join(', ')}) సామీప్యత ఆధారంగా ${location.areaName} (${location.city}) ను పరిశీలించాము. 1.5 కి.మీ పరిధిలో ${location.competitorsNearbyCount} పోటీ దుకాణాలు ఉన్నప్పటికీ, ${location.transitPoints[0] || 'ప్రధాన కూడలి'} సమీపంలో ఉండే జనసంచారం స్థిరమైన రోజువారీ వ్యాపారాన్ని అందిస్తుంది. ${location.alternativeLocation ? `గమనిక: మేము ${location.alternativeLocation.areaName} లో ${Math.abs(location.alternativeLocation.rentDifferentialPct)}% తక్కువ అద్దె మరియు ${location.alternativeLocation.score}/100 స్కోరు కలిగిన ప్రత్యామ్నాయ స్థలాన్ని కూడా గుర్తించాము.` : ''}`
      },
      {
        id: 'how_project_cost',
        question: 'నా ప్రాజెక్ట్ ఖర్చును ఎలా లెక్కించారు?',
        answer: `మీ మొత్తం ప్రాజెక్ట్ వ్యయం ${formatINR(financials.projectCost)} అనేది ${input.category || 'ఈ వ్యాపార రంగానికి'} సంబంధించిన ఖచ్చితమైన పరిశ్రమ ప్రమాణాల ప్రకారం లెక్కించబడింది. ఇందులో: (1) యంత్రాలు, దుకాణ అమరిక మరియు విద్యుత్ కనెక్షన్ల కోసం ${formatINR(financials.capexItems.reduce((acc, i) => acc + i.amount, 0))} మూలధన ఖర్చు (క్యాపెక్స్); మరియు (2) ${formatINR(financials.workingCapitalBufferAmount)} తప్పనిసరి 3 నెలల వర్కింగ్ క్యాపిటల్ నగదు రిజర్వ్ ఉన్నాయి. ఈ రిజర్వ్ ప్రారంభంలో వ్యాపారం ఊపందుకునే వరకు నెలవారీ ఖర్చులకు రక్షణ కల్పిస్తుంది.`
      },
      {
        id: 'sales_fall_20',
        question: 'అమ్మకాలు 20% తగ్గితే పరిస్థితి ఏమిటి?',
        answer: `అమ్మకాలు 20% తగ్గితే, మీ నెలవారీ రాబడి ${formatINR(financials.projectedMonthlyRevenue)} నుండి ${formatINR(Math.round(financials.projectedMonthlyRevenue * 0.8))} కు పడిపోతుంది. స్థిర ఖర్చులు (అద్దె, జీతాలు) వెంటనే తగ్గించలేము కాబట్టి, మీ నికర మిగులు ${formatINR(financials.monthlyNetSurplus)} నుండి దాదాపు ${formatINR(Math.round(financials.monthlyNetSurplus * 0.48))} కు తగ్గుతుంది. మీరు సిఫార్సు చేసిన 3 నెలల వర్కింగ్ క్యాపిటల్ రిజర్వ్‌ను నిర్వహిస్తే, మీ నెలవారీ ${formatINR(financials.monthlyEMI)} ఈఎంఐ చెల్లింపులో ఎటువంటి ఆటంకం లేకుండా ఈ మాంద్యాన్ని తట్టుకోవచ్చు.`
      },
      {
        id: 'why_financing',
        question: 'ఈ ఆర్థిక సహాయ ఎంపిక ఎందుకు అనుకూలమైనది?',
        answer: `మొత్తం ప్రాజెక్ట్ వ్యయం ${formatINR(financials.projectCost)} లో మీ సొంత మూలధనం ${formatINR(financials.ownCapital)} పోను, మీకు ${formatINR(financials.loanRequired)} రుణ సహాయం అవసరం. మీ ప్రమోటర్ పెట్టుబడి వాటా (${financials.promoterContributionPct}%) కనీస 10% నిబంధనను సంతృప్తి పరుస్తున్నందున మరియు పూచీకత్తు లేని CGTMSE క్రెడిట్ గ్యారెంటీ కవరేజీకి అర్హత ఉన్నందున, ఇది PMEGP మరియు ముద్రా తరుణ్ వంటి పథకాలకు సరిగ్గా సరిపోతుంది.`
      },
      {
        id: 'what_licenses',
        question: 'వ్యాపారం ప్రారంభించే ముందు ఏయే లైసెన్సులు అవసరం?',
        answer: `${input.category || 'ఈ వ్యాపారం'} కోసం అవసరమైన ముఖ్యమైన అనుమతులు: (1) బ్యాంక్ పథకాల రాయితీ కోసం ఉచిత ఉద్యమ్ (Udyam) ఎంఎస్ఎంఈ నమోదు; (2) ఆహార పదార్థాల తయారీ లేదా విక్రయం అయితే FSSAI ఫుడ్ సేఫ్టీ లైసెన్స్; (3) స్థానిక పురపాలక సంఘం నుండి షాప్ & ఎస్టాబ్లిష్‌మెంట్ ట్రేడ్ లైసెన్స్; మరియు (4) వార్షిక టర్నోవర్ ₹40 లక్షలు దాటితే జీఎస్టీ రిజిస్ట్రేషన్.`
      },
      {
        id: 'how_improve_profit',
        question: 'లాభాల శాతాన్ని ఎలా పెంచుకోవచ్చు?',
        answer: `మూడు స్పష్టమైన మార్గాలు: (1) ఎక్కువ మార్జిన్ ఉండే ఉత్పత్తులపై దృష్టి పెట్టండి (ప్రత్యేక బేకరీ కేకులు లేదా సొంత బ్రాండ్ వస్తువులపై 45-55% వరకు స్థూల మార్జిన్ లభిస్తుంది); (2) ఆర్డర్ల స్థిరత్వం ఏర్పడిన తర్వాత హోల్‌సేల్ వ్యాపారులతో 30 రోజుల క్రెడిట్ నిబంధనలను కుదుర్చుకోండి; మరియు (3) ఆన్‌లైన్ అగ్రిగేటర్ల 18-25% కమీషన్ ఫీజులను తప్పించుకోవడానికి స్థానిక అపార్ట్‌మెంట్ నివాసులతో ప్రత్యక్ష వాట్సాప్ ఆర్డరింగ్ నెట్‌వర్క్ నిర్మించండి.`
      }
    ];
  }

  // Default English
  return [
    {
      id: 'why_location',
      question: 'Why did you recommend this location?',
      answer: `We evaluated ${location.areaName} (${location.city}) based on local footfall (${location.footfallMonthly.toLocaleString('en-IN')}/month) and proximity to ${location.residentialColoniesNearby} dense residential colonies (${location.customerColonies.slice(0, 2).join(', ')}). While there are ${location.competitorsNearbyCount} competitors within 1.5 km, the pedestrian concentration near ${location.transitPoints[0] || 'transit corridors'} creates reliable daily demand. ${location.alternativeLocation ? `Note: We also detected an alternative site at ${location.alternativeLocation.areaName} with ${Math.abs(location.alternativeLocation.rentDifferentialPct)}% lower rent and score ${location.alternativeLocation.score}/100.` : ''}`
    },
    {
      id: 'how_project_cost',
      question: 'How did you calculate my project cost?',
      answer: `Your total project cost of ${formatINR(financials.projectCost)} is calculated using deterministic industry benchmarks for ${input.category || 'this enterprise'}. It consists of: (1) Fixed Capital Expenditure (Capex) of ${formatINR(financials.capexItems.reduce((acc, i) => acc + i.amount, 0))} covering machinery, display fitouts, and utility connections; plus (2) a non-negotiable 3-month Working Capital Cash Buffer of ${formatINR(financials.workingCapitalBufferAmount)}. This cash buffer protects you against delayed initial sales without defaulting on monthly bills.`
    },
    {
      id: 'sales_fall_20',
      question: 'What happens if sales fall by 20%?',
      answer: `If sales drop by 20%, your monthly revenue drops from ${formatINR(financials.projectedMonthlyRevenue)} to ${formatINR(Math.round(financials.projectedMonthlyRevenue * 0.8))}. Because fixed costs (rent, base electricity, salaries) cannot be immediately cut, your monthly net cash surplus drops from ${formatINR(financials.monthlyNetSurplus)} to approximately ${formatINR(Math.round(financials.monthlyNetSurplus * 0.48))}. Your debt coverage ratio (DSCR) compresses. If you maintain the recommended 3-month working capital reserve, you can withstand this downturn without defaulting on your ${formatINR(financials.monthlyEMI)} EMI.`
    },
    {
      id: 'why_financing',
      question: 'Why is this financing option suitable?',
      answer: `With own capital of ${formatINR(financials.ownCapital)} against a project cost of ${formatINR(financials.projectCost)}, you require ${formatINR(financials.loanRequired)} in debt. This aligns with government schemes like PMEGP and MUDRA Tarun because your promoter equity (${financials.promoterContributionPct}%) satisfies the 10% requirement, and the asset class qualifies for collateral-free CGTMSE credit guarantee coverage.`
    },
    {
      id: 'what_licenses',
      question: 'What licenses may I need before opening?',
      answer: `For ${input.category || 'this business'}, the essential statutory registrations are: (1) Free Udyam MSME registration for bank scheme benefits; (2) FSSAI Food Safety registration (if serving or preparing edibles); (3) Municipal Shop & Establishment / Trade License from your local urban body; and (4) GST registration if turnover exceeds ₹40 Lakhs or if you plan to sell on digital platforms.`
    },
    {
      id: 'how_improve_profit',
      question: 'How can I improve my profit margin?',
      answer: `Three concrete steps: (1) Focus on high-margin anchor items (custom bakery celebration cakes or private label goods have 45-55% gross margins vs 15% on generic items); (2) Negotiate 30-day credit cycles with wholesale flour and dairy suppliers once order consistency is established; and (3) Build direct WhatsApp ordering for nearby apartment residents to save 18-25% aggregator commission fees.`
    }
  ];
}

export function answerCustomQuestion(
  question: string,
  input: BusinessInput,
  location: LocationData,
  financials: FinancialAnalysis,
  decision: BusinessDecisionResult,
  language: Language = 'en'
): string {
  const q = question.toLowerCase();

  if (language === 'te') {
    if (q.includes('rent') || q.includes('lease') || q.includes('అద్దె') || q.includes('space')) {
      return `${location.areaName} లో వాణిజ్య దుకాణాల సగటు అద్దె చదరపు అడుగుకు ₹65 - ₹110 వరకు ఉంది. నెలవారీ అద్దెను మీ అంచనా స్థూల ఆదాయంలో 18% కంటే తక్కువగా ఉంచుకోవాలని (${formatINR(financials.projectedMonthlyRevenue * 0.18)}/నెల లోపు) మేము సలహా ఇస్తున్నాము. అద్దె అంతకంటే ఎక్కువ ఉంటే, ${location.alternativeLocation?.areaName || 'సమీప ప్రత్యామ్నాయ స్థలాన్ని'} పరిశీలించండి.`;
    }
    if (q.includes('loan') || q.includes('bank') || q.includes('రుణం') || q.includes('వడ్డీ') || q.includes('emi') || q.includes('బ్యాంక్')) {
      return `మీ అంచనా బ్యాంక్ రుణ అవసరం ${formatINR(financials.loanRequired)}. 5 సంవత్సరాల కాలపరిమితికి 9.5% వడ్డీతో నెలవారీ ఈఎంఐ సుమారు ${formatINR(financials.monthlyEMI)} అవుతుంది. మీ నెలవారీ నిర్వహణ మిగులుతో రుణ కవరేజ్ (DSCR) ${financials.dscr}x గా ఉంది.`;
    }
    return `"${input.businessIdea}" (${location.areaName}) విశ్లేషణ ప్రకారం: మొత్తం ప్రాజెక్ట్ ఖర్చు ${formatINRLakhs(financials.projectCost)}, రుణ భద్రత ${financials.dscr}x. దీర్ఘకాలిక అద్దె ఒప్పందంపై సంతకం చేయడానికి ముందే ఉచిత ఉద్యమ్ నమోదు మరియు PMEGP/ముద్రా రుణ దరఖాస్తును పూర్తి చేసుకోండి.`;
  }

  if (language === 'hi') {
    if (q.includes('rent') || q.includes('किराया') || q.includes('lease') || q.includes('space')) {
      return `${location.areaName} के लिए वाणिज्यिक किराया वर्तमान में मुख्य सड़क के आधार पर ₹65 - ₹110 प्रति वर्ग फुट है। हम मासिक किराए को अनुमानित मासिक सकल राजस्व के 18% से कम (${formatINR(financials.projectedMonthlyRevenue * 0.18)}/माह अधिकतम) रखने की सलाह देते हैं।`;
    }
    if (q.includes('loan') || q.includes('ऋण') || q.includes('कर्ज') || q.includes('bank') || q.includes('emi')) {
      return `आपकी अनुमानित ऋण आवश्यकता ${formatINR(financials.loanRequired)} है। 5 साल की अवधि में 9.5% ब्याज पर मासिक EMI ${formatINR(financials.monthlyEMI)} है। आपके शुद्ध अधिशेष के साथ DSCR कवरेज ${financials.dscr}x है।`;
    }
    return `"${input.businessIdea}" (${location.areaName}) के विश्लेषण के अनुसार: परियोजना लागत ${formatINRLakhs(financials.projectCost)} है और ऋण कवरेज ${financials.dscr}x है। व्यावसायिक लीज पर हस्ताक्षर करने से पहले उद्यम और PMEGP/मुद्रा ऋण के लिए आवेदन करें।`;
  }

  if (q.includes('rent') || q.includes('lease') || q.includes('deposit') || q.includes('space')) {
    return `For ${location.areaName}, commercial rentals currently average ₹65 - ₹110 per sq.ft. depending on main road frontage. We advise keeping monthly rent below 18% of projected monthly gross revenue (maximum ${formatINR(financials.projectedMonthlyRevenue * 0.18)}/month). If asking rent exceeds this, strongly consider the alternative site at ${location.alternativeLocation?.areaName || 'the outer ring road'}.`;
  }

  if (q.includes('loan') || q.includes('bank') || q.includes('interest') || q.includes('emi') || q.includes('repay')) {
    return `Your estimated loan requirement is ${formatINR(financials.loanRequired)}. At a benchmark 9.5% p.a. interest over a 5-year tenure, the monthly EMI is ${formatINR(financials.monthlyEMI)}. With your projected monthly operating surplus of ${formatINR(financials.monthlyGrossSurplus)}, your repayment coverage (DSCR) is ${financials.dscr}x, which is categorized as ${financials.safetyStatus}.`;
  }

  if (q.includes('risk') || q.includes('fail') || q.includes('danger') || q.includes('loss')) {
    return `The primary risks identified for ${input.businessIdea || 'your business'} are: (1) Working capital depletion before reaching cash break-even (${financials.breakEvenMonths} months); (2) High competitor count (${location.competitorsNearbyCount} outlets within 1.5 km); and (3) Sudden ingredient price spikes. Pravirak mitigates this by enforcing a ${formatINR(financials.workingCapitalBufferAmount)} liquid cash reserve.`;
  }

  if (q.includes('partner') || q.includes('investor') || q.includes('equity')) {
    return `Your promoter equity currently stands at ${financials.promoterContributionPct}% (${formatINR(financials.ownCapital)}). While taking a bank loan under PMEGP or MUDRA preserves 100% ownership, bringing in a working partner who contributes an additional ₹1.5 - 2 Lakhs can reduce your debt obligation and elevate your DSCR safety to over 2.0x.`;
  }

  if (q.includes('staff') || q.includes('employee') || q.includes('worker') || q.includes('salary')) {
    return `For a ${input.preferredScale || 'Small'} scale setup, we model staffing at 2 to 3 personnel (e.g. 1 head master/technician and 1-2 helpers), budgeted at ₹32,000 - ₹45,000 monthly total wage expense. This is already budgeted inside the ${formatINR(financials.projectedMonthlyOpex)} operating cost.`;
  }

  // General fallback tailored to context
  return `Based on your analysis for "${input.businessIdea}" in ${location.areaName}: The platform decision is ${decision.decision} with a project cost of ${formatINRLakhs(financials.projectCost)} and debt coverage of ${financials.dscr}x (${financials.safetyStatus}). Focus on verifying local pedestrian footfall, securing competitive machinery quotations, and applying for Udyam and PMEGP/MUDRA financing before signing long-term commercial lease agreements.`;
}
