import { ComplianceItem } from '../types';

export const COMPLIANCE_CHECKLIST: ComplianceItem[] = [
  {
    id: 'fssai',
    title: 'FSSAI Food Safety Registration / State License',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    status: 'Required',
    estimatedTimeline: '7 - 14 working days',
    estimatedFee: '₹100/year (Registration) or ₹2,000/year (State License)',
    officialPortalUrl: 'https://foscos.fssai.gov.in/',
    portalName: 'FoSCoS Portal (Official)',
    whyNeeded: 'Mandatory under Food Safety and Standards Act for all food preparation, baking, dairy, catering, and packaged eatables. Ensures basic hygiene and display of 14-digit FSSAI number on packaging and billing counter.'
  },
  {
    id: 'udyam',
    title: 'Udyam MSME Registration Certificate',
    authority: 'Ministry of MSME, Government of India',
    status: 'Required',
    estimatedTimeline: 'Instant (Paperless with Aadhaar & PAN)',
    estimatedFee: '₹0 (100% Free Government Portal)',
    officialPortalUrl: 'https://udyamregistration.gov.in/',
    portalName: 'Udyam Portal (Official MoMSME)',
    whyNeeded: 'Essential gateway document for all priority sector bank loans, interest subvention, government tender exemptions, protection against delayed payments from buyers, and PMEGP/MUDRA subsidy disbursement.'
  },
  {
    id: 'gst',
    title: 'GST (Goods & Services Tax) Registration',
    authority: 'Goods and Services Tax Network (GSTN)',
    status: 'May be required',
    estimatedTimeline: '3 - 7 working days',
    estimatedFee: '₹0 government fee (Self or nominal CA charge)',
    officialPortalUrl: 'https://www.gst.gov.in/',
    portalName: 'GST Common Portal',
    whyNeeded: 'Legally required if annual turnover crosses ₹40 Lakhs for goods (₹20 Lakhs in special states) or ₹20 Lakhs for services. Recommended early registration if procuring inputs from registered wholesalers to claim Input Tax Credit (ITC) or selling via online delivery apps (Zomato/Swiggy/Amazon).'
  },
  {
    id: 'trade_license',
    title: 'Municipal Trade License / Shop & Establishment Act',
    authority: 'Local Municipal Corporation / State Labour Dept',
    status: 'Required',
    estimatedTimeline: '10 - 21 working days',
    estimatedFee: '₹1,500 - ₹5,000 depending on area & square footage',
    officialPortalUrl: 'https://services.india.gov.in/',
    portalName: 'National Government Services Portal',
    whyNeeded: 'Permits legal commercial operation of a shop, workshop, or outlet within municipal boundaries. Confirms premises safety, sanitation, working hours, and employee welfare compliance.'
  },
  {
    id: 'fire_noc',
    title: 'Fire Safety Clearance / NOC',
    authority: 'State Directorate of Fire Services',
    status: 'May be required',
    estimatedTimeline: '15 - 30 working days',
    estimatedFee: '₹1,000 - ₹4,000 inspection fee',
    officialPortalUrl: 'https://services.india.gov.in/',
    portalName: 'State Fire Department Portal',
    whyNeeded: 'Required for commercial kitchens, bakeries using commercial gas banks/heavy electric ovens, or retail spaces with floor areas exceeding 500 sq.ft. Ensures availability of certified ABC dry powder extinguishers, emergency exits, and gas leak detectors.'
  },
  {
    id: 'spcb_noc',
    title: 'State Pollution Control Board (Consent to Establish/Operate)',
    authority: 'State Pollution Control Board (SPCB)',
    status: 'Check locally',
    estimatedTimeline: '20 - 45 working days',
    estimatedFee: '₹2,000 - ₹8,000 (Green/White category MSMEs)',
    officialPortalUrl: 'https://ocmms.nic.in/',
    portalName: 'Online Consent Management Portal (CPCB)',
    whyNeeded: 'Most small bakeries and retail shops fall under the "White" or exempt category (just simple intimation required). Required if operating diesel generator sets (>15 kVA) or food processing discharge systems.'
  }
];

export function getSectorCompliances(category: string): ComplianceItem[] {
  const cat = (category || '').toLowerCase();
  const isFood = cat.includes('bake') || cat.includes('cake') || cat.includes('food') || cat.includes('kitchen') || cat.includes('restaurant') || cat.includes('dairy');

  return COMPLIANCE_CHECKLIST.map(item => {
    if (item.id === 'fssai') {
      return {
        ...item,
        status: isFood ? 'Required' : 'Check locally'
      };
    }
    if (item.id === 'fire_noc') {
      return {
        ...item,
        status: isFood ? 'Required' : 'May be required'
      };
    }
    return item;
  });
}
