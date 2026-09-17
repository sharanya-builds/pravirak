import { GovernmentScheme } from '../types';

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pmegp',
    name: 'Prime Minister\'s Employment Generation Programme (PMEGP)',
    code: 'PMEGP-KVIC-2024',
    ministry: 'Ministry of Micro, Small and Medium Enterprises (MoMSME)',
    maxSubsidyText: 'Up to 35% margin money subsidy (Rural) / 25% (Urban)',
    maxSubsidyPct: 35,
    maxLoanText: 'Up to ₹50 Lakhs (Mfg) / ₹20 Lakhs (Service & Retail)',
    interestRateText: '8.5% - 10.5% per annum (Linked to Bank MCLR)',
    tenureText: '3 to 7 years',
    moratoriumText: 'Up to 6 months initial moratorium on principal repayment',
    collateralRequirement: 'Collateral-free (Covered under CGTMSE credit guarantee)',
    suitableProfile: 'First-generation entrepreneurs, new manufacturing units, food processing, bakery, and service centers',
    eligibilityCriteria: [
      'Individual entrepreneur aged 18 years or above',
      'At least 8th standard pass for manufacturing units above ₹10 Lakhs',
      'Own promoter contribution is 5% to 10% of total project cost',
      'Unit must be a new enterprise (expansion of existing unit not eligible under initial phase)'
    ],
    matchScore: 94,
    matchReasons: [
      'Promoter own capital contribution matches the 10% equity threshold required by KVIC.',
      'Food & retail service enterprise falls under Priority Category 2 in state industrial classification.',
      'Significant subsidy cushion (up to 25%-35%) reduces real financial debt burden.'
    ],
    applicationPortalUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    nodalAgency: 'Khadi and Village Industries Commission (KVIC) & District Industries Centre (DIC)'
  },
  {
    id: 'mudra_tarun',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY) - Tarun / Kishore',
    code: 'PMMY-TARUN-M2',
    ministry: 'Department of Financial Services, Ministry of Finance',
    maxSubsidyText: 'No direct cash subsidy; 100% collateral-free refinancing',
    maxSubsidyPct: 0,
    maxLoanText: 'Up to ₹10 Lakhs (Tarun category for established/scaling units)',
    interestRateText: '9.15% - 11.20% per annum (Varies by public sector bank)',
    tenureText: 'Up to 5 years',
    moratoriumText: '3 to 6 months moratorium available depending on appraisal',
    collateralRequirement: 'Nil (Strictly no third-party collateral or mortgage permitted)',
    suitableProfile: 'Micro-shops, bakeries, tailoring boutique, mobile sales/service, and small commercial establishments',
    eligibilityCriteria: [
      'Non-Corporate Small Business Segment (NCSBS) / proprietorship firm',
      'Clean CIBIL track record (minimum score 650+ recommended)',
      'Quotations for machinery/equipment and shop agreement proof',
      'Valid Udyam Registration certificate'
    ],
    matchScore: 89,
    matchReasons: [
      'Loan size requirement aligns perfectly with MUDRA Tarun / Kishore limits.',
      'No property mortgage required, ideal for entrepreneurs without ancestral real estate.',
      'Processed through all Public Sector Banks (SBI, PNB, Canara) and Regional Rural Banks.'
    ],
    applicationPortalUrl: 'https://www.udyamimitra.in/',
    nodalAgency: 'MUDRA Ltd & Commercial / Gramin Banks'
  },
  {
    id: 'standup_india',
    name: 'Stand-Up India Scheme',
    code: 'SUI-SIDBI-2024',
    ministry: 'Department of Financial Services, Ministry of Finance',
    maxSubsidyText: 'Convergence with state capital subsidies + collateral-free guarantee',
    maxSubsidyPct: 15,
    maxLoanText: '₹10 Lakhs to ₹100 Lakhs (1 Crore)',
    interestRateText: 'Lowest applicable bank rate (MCLR + 3% + tenor premium)',
    tenureText: 'Up to 7 years',
    moratoriumText: 'Up to 18 months comprehensive moratorium period',
    collateralRequirement: 'Credit Guarantee Scheme for Stand Up India (CGFSI)',
    suitableProfile: 'Women entrepreneurs and SC/ST individuals establishing greenfield enterprises',
    eligibilityCriteria: [
      'SC/ST and/or woman entrepreneur above 18 years of age',
      'Greenfield project (first-time venture in manufacturing, services or trading)',
      'Non-individual enterprises must have 51% shareholding by SC/ST or woman promoter',
      'Promoter contribution minimum 10% to 15%'
    ],
    matchScore: 86,
    matchReasons: [
      'Offers high-tenure repayment schedule (up to 7 years) providing cashflow protection.',
      'Composite loan covering both machinery capex and revolving working capital.',
      'Mandatory per-bank-branch target ensures serious underwriting consideration.'
    ],
    applicationPortalUrl: 'https://www.standupmitra.in/',
    nodalAgency: 'Small Industries Development Bank of India (SIDBI)'
  },
  {
    id: 'cgtmse',
    name: 'Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)',
    code: 'CGTMSE-TRUST-2024',
    ministry: 'Ministry of MSME & SIDBI',
    maxSubsidyText: 'Up to 85% credit guarantee coverage against default',
    maxSubsidyPct: 0,
    maxLoanText: 'Up to ₹500 Lakhs (5 Crore)',
    interestRateText: 'Competitive MSME commercial rate (approx 8.75% - 10.25%)',
    tenureText: 'Up to 5 to 7 years',
    moratoriumText: 'Aligned with bank term-loan policy',
    collateralRequirement: 'Strictly zero collateral; guarantee fee subsidized for micro enterprises',
    suitableProfile: 'Growth-stage businesses seeking working capital and machinery term loans from Scheduled Banks',
    eligibilityCriteria: [
      'Registered Micro or Small enterprise holding Udyam certificate',
      'New or existing viable commercial projects',
      'Valid business plan showing verifiable Debt Service Coverage Ratio (DSCR > 1.25)'
    ],
    matchScore: 82,
    matchReasons: [
      'Allows regular commercial bank branches to approve loan without asking for residential property title.',
      'Recently reduced annual guarantee fee makes borrowing cost-efficient.',
      'Accepts Pravirak financial projections report directly for appraisal.'
    ],
    applicationPortalUrl: 'https://www.cgtmse.in/',
    nodalAgency: 'Credit Guarantee Fund Trust for Micro and Small Enterprises'
  },
  {
    id: 'pm_svanidhi',
    name: 'PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)',
    code: 'PMSVANIDHI-HUA',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    maxSubsidyText: '7% annual interest subsidy on digital transaction compliance',
    maxSubsidyPct: 7,
    maxLoanText: 'Graduated tranches: ₹10,000 → ₹20,000 → ₹50,000',
    interestRateText: 'Standard base rate with 7% interest subvention',
    tenureText: '1 to 3 years',
    moratoriumText: 'Immediate monthly repayment cycle',
    collateralRequirement: 'Nil',
    suitableProfile: 'Micro food stalls, mobile pushcarts, corner snack stalls, and neighborhood kiosks',
    eligibilityCriteria: [
      'Urban street vendors / micro service providers possessing Certificate of Vending / LOR',
      'Identified in urban local body survey or recommendation by Ward Committee',
      'Aadhaar-linked active bank account'
    ],
    matchScore: 65,
    matchReasons: [
      'Fast digital sanction within 48 hours for nano-scale start capital.',
      'Cashback incentive on digital UPI transactions up to ₹1,200 per year.'
    ],
    applicationPortalUrl: 'https://pmsvanidhi.mohua.gov.in/',
    nodalAgency: 'Urban Local Bodies (Municipalities) & Lending Institutions'
  }
];
