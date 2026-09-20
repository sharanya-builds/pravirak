import React from 'react';
import { ExternalLink, FileCheck2, Clock, IndianRupee } from 'lucide-react';
import { ComplianceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ComplianceCardProps {
  item: ComplianceItem;
}

const LOCALIZED_COMPLIANCE: Record<string, Record<'hi' | 'te', { title: string; authority: string; whyNeeded: string; timeline: string; fee: string }>> = {
  fssai: {
    te: {
      title: 'FSSAI ఆహార భద్రతా రిజిస్ట్రేషన్ / రాష్ట్ర లైసెన్స్',
      authority: 'భారత ఆహార భద్రత మరియు ప్రమాణాల ప్రాధికార సంస్థ (FSSAI)',
      whyNeeded: 'ఆహార పదార్థాల తయారీ, బేకరీ, క్యాటరింగ్ మరియు ప్యాక్ చేసిన తినుబండారాలకు ఆహార భద్రతా చట్టం ప్రకారం తప్పనిసరి. ప్యాకింగ్ మరియు బిల్లింగ్ కౌంటర్ పై 14 అంకెల FSSAI నంబర్ ప్రదర్శించాల్సి ఉంటుంది.',
      timeline: '7 - 14 పని దినాలు',
      fee: 'సంవత్సరానికి ₹100 (రిజిస్ట్రేషన్) లేదా ₹2,000 (రాష్ట్ర లైసెన్స్)'
    },
    hi: {
      title: 'FSSAI खाद्य सुरक्षा पंजीकरण / राज्य लाइसेंस',
      authority: 'भारतीय खाद्य सुरक्षा एवं मानक प्राधिकरण (FSSAI)',
      whyNeeded: 'सभी खाद्य तैयारी, बेकिंग, डेयरी और पैकेज्ड खाद्य पदार्थों के लिए खाद्य सुरक्षा अधिनियम के तहत अनिवार्य। बिलिंग काउंटर और पैकेजिंग पर 14-अंकीय FSSAI नंबर प्रदर्शित करना सुनिश्चित करता है।',
      timeline: '7 - 14 कार्य दिवस',
      fee: '₹100/वर्ष (पंजीकरण) या ₹2,000/वर्ष (राज्य लाइसेंस)'
    }
  },
  udyam: {
    te: {
      title: 'ఉద్యమ్ MSME రిజిస్ట్రేషన్ సర్టిఫికేట్',
      authority: 'కేంద్ర సూక్ష్మ, చిన్న & మధ్య తరహా పరిశ్రమల మంత్రిత్వ శాఖ',
      whyNeeded: 'ప్రాధాన్యతా రంగ బ్యాంకు రుణాలు, వడ్డీ రాయితీ, ప్రభుత్వ టెండర్ మినహాయింపులు మరియు PMEGP/ముద్రా సబ్సిడీలను పొందడానికి ఇది ప్రాథమిక పత్రం.',
      timeline: 'వెంటనే (ఆధార్ & పాన్ తో కాగిత రహితం)',
      fee: '₹0 (100% ఉచిత ప్రభుత్వ పోర్టల్)'
    },
    hi: {
      title: 'उद्यम एमएसएमई पंजीकरण प्रमाणपत्र',
      authority: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय, भारत सरकार',
      whyNeeded: 'सभी प्राथमिकता प्राप्त क्षेत्र के बैंक ऋण, ब्याज सबवेंशन और PMEGP/मुद्रा सब्सिडी संवितरण के लिए आवश्यक मुख्य दस्तावेज।',
      timeline: 'तुरंत (आधार और पैन के साथ पेपरलेस)',
      fee: '₹0 (100% मुफ्त सरकारी पोर्टल)'
    }
  },
  gst: {
    te: {
      title: 'GST (వస్తు మరియు సేవల పన్ను) రిజిస్ట్రేషన్',
      authority: 'గూడ్స్ అండ్ సర్వీసెస్ టాక్స్ నెట్‌వర్క్ (GSTN)',
      whyNeeded: 'వార్షిక టర్నోవర్ ₹40 లక్షలు దాటితే చట్టబద్ధంగా తప్పనిసరి. హోల్‌సేల్ వ్యాపారుల నుండి ఇన్‌పుట్ టాక్స్ క్రెడిట్ (ITC) పొందడానికి లేదా ఆన్‌లైన్ ఫుడ్ డెలివరీ యాప్‌ల ద్వారా విక్రయించడానికి సిఫార్సు చేయబడింది.',
      timeline: '3 - 7 పని దినాలు',
      fee: '₹0 ప్రభుత్వ రుసుము'
    },
    hi: {
      title: 'जीएसटी (वस्तु एवं सेवा कर) पंजीकरण',
      authority: 'वस्तु एवं सेवा कर नेटवर्क (GSTN)',
      whyNeeded: 'वार्षिक कारोबार ₹40 लाख से अधिक होने पर कानूनी रूप से आवश्यक। इनपुट टैक्स क्रेडिट (ITC) का दावा करने या ऑनलाइन डिलीवरी ऐप पर बिक्री के लिए अनुशंसित।',
      timeline: '3 - 7 कार्य दिवस',
      fee: '₹0 सरकारी शुल्क'
    }
  },
  trade_license: {
    te: {
      title: 'మున్సిపల్ ట్రేడ్ లైసెన్స్ / షాప్ & ఎస్టాబ్లిష్‌మెంట్ చట్టం',
      authority: 'స్థానిక మున్సిపల్ కార్పొరేషన్ / రాష్ట్ర కార్మిక శాఖ',
      whyNeeded: 'మున్సిపల్ పరిధిలో దుకాణం లేదా వర్క్‌షాప్ చట్టబద్ధంగా నిర్వహించడానికి అనుమతిస్తుంది. భవన భద్రత మరియు పారిశుధ్య నిబంధనల పాటించడాన్ని ధృవీకరిస్తుంది.',
      timeline: '10 - 21 పని దినాలు',
      fee: 'ప్రాంతం మరియు విస్తీర్ణాన్ని బట్టి ₹1,500 - ₹5,000'
    },
    hi: {
      title: 'नगरपालिका व्यापार लाइसेंस / दुकान और स्थापना अधिनियम',
      authority: 'स्थानीय नगर निगम / राज्य श्रम विभाग',
      whyNeeded: 'नगर निगम की सीमाओं के भीतर दुकान या वर्कशॉप के कानूनी संचालन की अनुमति देता है। परिसर की सुरक्षा और स्वच्छता की पुष्टि करता है।',
      timeline: '10 - 21 कार्य दिवस',
      fee: 'क्षेत्र और वर्ग फुट के आधार पर ₹1,500 - ₹5,000'
    }
  },
  fire_noc: {
    te: {
      title: 'అగ్నిమాపక భద్రతా క్లియరెన్స్ / NOC',
      authority: 'రాష్ట్ర అగ్నిమాపక సేవల డైరెక్టరేట్',
      whyNeeded: 'కమర్షియల్ కిచెన్‌లు, గ్యాస్ బ్యాంకులు లేదా భారీ ఎలక్ట్రిక్ ఓవెన్లు ఉపయోగించే బేకరీలకు మరియు 500 చ.అ. దాటిన దుకాణాలకు అవసరం.',
      timeline: '15 - 30 పని దినాలు',
      fee: '₹1,000 - ₹4,000 తనిఖీ రుసుము'
    },
    hi: {
      title: 'अग्नि सुरक्षा अनापत्ति प्रमाणपत्र (Fire NOC)',
      authority: 'राज्य अग्निशमन सेवा निदेशालय',
      whyNeeded: 'व्यावसायिक रसोई, गैस बैंक या भारी इलेक्ट्रिक ओवन का उपयोग करने वाली बेकरी के लिए आवश्यक। अग्निशामक और आपातकालीन निकास सुनिश्चित करता है।',
      timeline: '15 - 30 कार्य दिवस',
      fee: '₹1,000 - ₹4,000 निरीक्षण शुल्क'
    }
  },
  spcb_noc: {
    te: {
      title: 'రాష్ట్ర కాలుష్య నియంత్రణ మండలి అనుమతి (Consent to Operate)',
      authority: 'రాష్ట్ర కాలుష్య నియంత్రణ మండలి (SPCB)',
      whyNeeded: 'చాలా చిన్న బేకరీలు మరియు రిటైల్ దుకాణాలు మినహాయింపు విభాగం క్రిందకు వస్తాయి. భారీ డీజిల్ జనరేటర్లను నడిపేటప్పుడు అవసరం.',
      timeline: '20 - 45 పని దినాలు',
      fee: '₹2,000 - ₹8,000'
    },
    hi: {
      title: 'राज्य प्रदूषण नियंत्रण बोर्ड सहमति (Consent to Operate)',
      authority: 'राज्य प्रदूषण नियंत्रण बोर्ड (SPCB)',
      whyNeeded: 'अधिकांश छोटी बेकरियां और दुकानें छूट श्रेणी में आती हैं। भारी डीजल जनरेटर सेट संचालित करने पर आवश्यक।',
      timeline: '20 - 45 कार्य दिवस',
      fee: '₹2,000 - ₹8,000'
    }
  }
};

export const ComplianceCard: React.FC<ComplianceCardProps> = ({ item }) => {
  const { language } = useLanguage();

  const localized = (language === 'hi' || language === 'te') && LOCALIZED_COMPLIANCE[item.id]
    ? LOCALIZED_COMPLIANCE[item.id][language]
    : null;

  const displayTitle = localized?.title || item.title;
  const displayAuthority = localized?.authority || item.authority;
  const displayWhy = localized?.whyNeeded || item.whyNeeded;
  const displayTimeline = localized?.timeline || item.estimatedTimeline;
  const displayFee = localized?.fee || item.estimatedFee;

  const getStatusBadge = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'Required':
        return 'bg-rose-100 text-rose-900 border-rose-300 font-bold dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
      case 'May be required':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'Check locally':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getStatusLabel = (status: ComplianceItem['status']) => {
    if (language === 'te') {
      switch (status) {
        case 'Required': return 'తప్పనిసరి';
        case 'May be required': return 'అవసరం కావచ్చు';
        case 'Check locally': return 'స్థానికంగా తనిఖీ చేయండి';
      }
    }
    if (language === 'hi') {
      switch (status) {
        case 'Required': return 'अनिवार्य';
        case 'May be required': return 'आवश्यक हो सकता है';
        case 'Check locally': return 'स्थानीय रूप से जांचें';
      }
    }
    return status;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm transition-all duration-200 flex flex-col justify-between card-hover-float cursor-default">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0 border border-indigo-100">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              {displayAuthority}
            </span>
          </div>

          <span className={`text-xs px-2.5 py-1 rounded-md border uppercase ${getStatusBadge(item.status)}`}>
            {getStatusLabel(item.status)}
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-extrabold text-slate-950 leading-snug">
          {displayTitle}
        </h4>

        {/* Explanation font is larger and darker */}
        <p className="text-sm sm:text-base text-slate-950 mt-3 leading-relaxed font-medium">
          {displayWhy}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-800 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{displayTimeline}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{displayFee}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">
          {language === 'te' ? 'అధికారిక ప్రభుత్వ పోర్టల్' : language === 'hi' ? 'आधिकारिक सरकारी पोर्टल' : 'Official Gov Portal'}
        </span>
        <a
          href={item.officialPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-900 hover:text-indigo-700 transition-colors"
        >
          <span>{item.portalName}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
