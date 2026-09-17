import { FinancialAnalysis, SafetyStatus, StressResult } from '../types';

/**
 * Formats a number according to Indian Currency standard (e.g. ₹10,00,000)
 */
export function formatINR(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  const rounded = Math.round(val);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Formats numbers into Indian denominations (e.g., ₹1.5 Lakh, ₹2.4 Crore)
 */
export function formatINRLakhs(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  if (Math.abs(val) >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(val) >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(val);
}

/**
 * Standard banking EMI calculation (deterministic annuity formula)
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEMI(principal: number, annualRatePct: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  
  const monthlyRate = annualRatePct / 12 / 100;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) {
    return Math.round(principal / totalMonths);
  }

  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Calculates Debt Service Coverage Ratio (DSCR)
 * DSCR = Operating Surplus / EMI
 */
export function calculateDSCR(monthlyOperatingSurplus: number, monthlyEMI: number): number {
  if (monthlyEMI <= 0) return 99.0; // debt free
  if (monthlyOperatingSurplus <= 0) return 0.0;
  const dscr = monthlyOperatingSurplus / monthlyEMI;
  return Math.round(dscr * 100) / 100;
}

/**
 * Derives banking repayment safety tier based on DSCR
 * >= 1.50 : SAFE (Bank preferred)
 * 1.10 - 1.49 : WATCH (Vulnerable to minor shocks)
 * < 1.10 : RISKY (High probability of default/cashflow stress)
 */
export function getSafetyRating(dscr: number): SafetyStatus {
  if (dscr >= 1.5) return 'SAFE';
  if (dscr >= 1.1) return 'WATCH';
  return 'RISKY';
}

/**
 * Deterministic benchmark data generator for standard Indian enterprise types
 */
export interface BusinessArchetypeBenchmark {
  category: string;
  typicalCapexBase: number;
  typicalMonthlyOpexBase: number;
  typicalMonthlyRevenueBase: number;
  capexItems: { item: string; pct: number; description: string }[];
  opexSplit: { rawMaterialPct: number; fixedOverheadPct: number };
}

export const BENCHMARKS: Record<string, BusinessArchetypeBenchmark> = {
  'bakery': {
    category: 'Bakery & Confectionery',
    typicalCapexBase: 650000,
    typicalMonthlyOpexBase: 120000,
    typicalMonthlyRevenueBase: 195000,
    capexItems: [
      { item: 'Commercial Deck Oven & Proofer', pct: 0.35, description: 'Double deck electric/gas oven with temperature automation' },
      { item: 'Planetary Mixer & Dough Kneader', pct: 0.18, description: '20-liter commercial gear-driven mixer' },
      { item: 'Display Counters & Refrigeration', pct: 0.22, description: 'Chilled display counter for cakes + deep freezer' },
      { item: 'Shop Fitout & Civil Work', pct: 0.15, description: 'Hygienic flooring, counter, LED lighting, billing counter' },
      { item: 'FSSAI, Electrical & Utensil Setup', pct: 0.10, description: 'Baking trays, moulds, commercial 3-phase power load' }
    ],
    opexSplit: { rawMaterialPct: 0.58, fixedOverheadPct: 0.42 }
  },
  'kirana': {
    category: 'Kirana & FMCG Retail',
    typicalCapexBase: 450000,
    typicalMonthlyOpexBase: 95000,
    typicalMonthlyRevenueBase: 165000,
    capexItems: [
      { item: 'Modular Steel Display Racks', pct: 0.30, description: 'Heavy-duty slotted angle display shelves' },
      { item: 'Initial Inventory Stocking', pct: 0.40, description: 'Fast-moving staples, packaged goods, personal care' },
      { item: 'POS System, Barcode Scanner & POS Software', pct: 0.10, description: 'Thermal printer, weighing scale, inventory billing PC' },
      { item: 'Shop Signage, AC & CCTV', pct: 0.12, description: 'Backlit board, 4-channel security CCTV system' },
      { item: 'Advance Deposit & Municipal License', pct: 0.08, description: 'Local shop registration & security deposit' }
    ],
    opexSplit: { rawMaterialPct: 0.65, fixedOverheadPct: 0.35 }
  },
  'cloud_kitchen': {
    category: 'Cloud Kitchen & Delivery',
    typicalCapexBase: 550000,
    typicalMonthlyOpexBase: 140000,
    typicalMonthlyRevenueBase: 225000,
    capexItems: [
      { item: 'Commercial Burners, Exhaust & Ducting', pct: 0.32, description: 'High-pressure four-burner range with heavy chimney' },
      { item: 'Commercial Deep Freezers & Chiller', pct: 0.24, description: '500L double-door commercial storage' },
      { item: 'Stainless Steel Prep Tables & Sinks', pct: 0.14, description: 'SS 304 food-grade preparation stations' },
      { item: 'Packaging & Initial Brand Setup', pct: 0.15, description: 'Biodegradable meal boxes, tamper-evident seals' },
      { item: 'FSSAI, Fire Extinguishers & Tech Onboarding', pct: 0.15, description: 'Platform aggregators integration, order tablets' }
    ],
    opexSplit: { rawMaterialPct: 0.55, fixedOverheadPct: 0.45 }
  },
  'garments': {
    category: 'Garments & Apparel Retail',
    typicalCapexBase: 700000,
    typicalMonthlyOpexBase: 110000,
    typicalMonthlyRevenueBase: 185000,
    capexItems: [
      { item: 'Opening Garment Stock (Ready-to-wear)', pct: 0.45, description: 'Ethnic, casual, festive curation from wholesale hubs' },
      { item: 'Boutique Interior, Trial Room & Hangers', pct: 0.25, description: 'Full length mirrors, warm spot lighting, brass racks' },
      { item: 'Mannequins & Facade Display Glass', pct: 0.12, description: 'Display podiums and illuminated storefront glass' },
      { item: 'POS, Barcode Tagging Machine & Sound System', pct: 0.08, description: 'Garment tag gun, thermal billing, inventory software' },
      { item: 'Shop Security Deposit & GST Filings', pct: 0.10, description: 'Commercial lease buffer and GST registration' }
    ],
    opexSplit: { rawMaterialPct: 0.60, fixedOverheadPct: 0.40 }
  },
  'mobile_repair': {
    category: 'Mobile & Electronics Service',
    typicalCapexBase: 350000,
    typicalMonthlyOpexBase: 65000,
    typicalMonthlyRevenueBase: 125000,
    capexItems: [
      { item: 'SMD Rework Station & Oscilloscope', pct: 0.25, description: 'Precision micro-soldering heat gun and testing kit' },
      { item: 'Screen Separator & OCA Laminator', pct: 0.25, description: 'Pneumatic display glass replacement machinery' },
      { item: 'Spare Parts Inventory (Screens, Batteries, ICs)', pct: 0.25, description: 'Fast-moving spare kits for major smartphone brands' },
      { item: 'Workstation Table, ESD Mats & Magnifiers', pct: 0.15, description: 'Anti-static grounded repair desk setup' },
      { item: 'Shop Signage & Local Trade License', pct: 0.10, description: 'Signage and municipal registration' }
    ],
    opexSplit: { rawMaterialPct: 0.45, fixedOverheadPct: 0.55 }
  },
  'dairy': {
    category: 'Dairy Farming & Milk Chilling',
    typicalCapexBase: 900000,
    typicalMonthlyOpexBase: 135000,
    typicalMonthlyRevenueBase: 210000,
    capexItems: [
      { item: 'High-Yield Dairy Cattle (5-8 Murrah/HF cows)', pct: 0.48, description: 'Certified vaccinated lactating crossbreed animals' },
      { item: 'Shed Construction & Ventilation', pct: 0.22, description: 'Concrete flooring, feeding mangers, water misters' },
      { item: 'Milking Machine & Bulk Milk Chiller (500L)', pct: 0.15, description: 'Automatic pulsator milker + insulated chilling tank' },
      { item: 'Chaff Cutter & Silage Pit Setup', pct: 0.08, description: 'Motorized green fodder cutter and ensiling storage' },
      { item: 'Veterinary Kits & Insurance Registration', pct: 0.07, description: 'Tagging, health records, livestock transit insurance' }
    ],
    opexSplit: { rawMaterialPct: 0.60, fixedOverheadPct: 0.40 }
  },
  'stationery': {
    category: 'Stationery, Books & Xerox Center',
    typicalCapexBase: 380000,
    typicalMonthlyOpexBase: 65000,
    typicalMonthlyRevenueBase: 125000,
    capexItems: [
      { item: 'Commercial Heavy-Duty Xerox & Printer Machine', pct: 0.35, description: 'High-speed duplex monochrome & color multifunction printer' },
      { item: 'Opening Stock (Notebooks, Pens, Files, Office Stationery)', pct: 0.30, description: 'Bulk paper reams, school supplies, desk accessories' },
      { item: 'Lamination & Spiral Binding Equipment', pct: 0.12, description: 'Thermal laminator, coil binding machine, paper trimmer' },
      { item: 'Display Shelves, Glass Counter & POS Billing', pct: 0.15, description: 'Modular wall racks and front customer counter' },
      { item: 'Shop Fitout, Electrical & Signage', pct: 0.08, description: 'LED lighting, power backup UPS, trade license' }
    ],
    opexSplit: { rawMaterialPct: 0.55, fixedOverheadPct: 0.45 }
  },
  'pharmacy': {
    category: 'Pharmacy & Medical Retail Store',
    typicalCapexBase: 620000,
    typicalMonthlyOpexBase: 110000,
    typicalMonthlyRevenueBase: 190000,
    capexItems: [
      { item: 'Initial Pharmaceutical Inventory (Prescription & OTC)', pct: 0.45, description: 'Essential branded & generic medicines, surgicals' },
      { item: 'Medicine Refrigerator (2-8°C)', pct: 0.14, description: 'Dedicated medical refrigerator for vaccines and insulins' },
      { item: 'Modular Glass Cabinets & Slotted Racks', pct: 0.18, description: 'Dust-free partitioned drug storage system' },
      { item: 'Drug License Compliance & Pharmacist Setup', pct: 0.13, description: 'State Drug Control statutory filing and verification' },
      { item: 'Air Conditioning & Computerized Billing Unit', pct: 0.10, description: 'Mandatory climate control for stability and barcode POS' }
    ],
    opexSplit: { rawMaterialPct: 0.68, fixedOverheadPct: 0.32 }
  },
  'hardware': {
    category: 'Hardware, Electrical & Sanitary Store',
    typicalCapexBase: 750000,
    typicalMonthlyOpexBase: 95000,
    typicalMonthlyRevenueBase: 175000,
    capexItems: [
      { item: 'Opening Stock (Pipes, Fittings, Wires, Tools)', pct: 0.50, description: 'PVC pipes, brass valves, electrical cables, switches' },
      { item: 'Heavy-Duty Cantilever Racks & Pipe Bins', pct: 0.20, description: 'Industrial steel shelving for heavy metal goods' },
      { item: 'Pipe Threading & Power Cut Tools', pct: 0.12, description: 'Electrical wire cutter, pipe bender, multimeters' },
      { item: 'Storefront Facade & Billing Desk', pct: 0.10, description: 'Front order counter, signage board, security lock' },
      { item: 'Municipal License & Trade Permit', pct: 0.08, description: 'Local shop registration & commercial deposit' }
    ],
    opexSplit: { rawMaterialPct: 0.65, fixedOverheadPct: 0.35 }
  },
  'salon': {
    category: 'Salon, Beauty Parlour & Grooming',
    typicalCapexBase: 420000,
    typicalMonthlyOpexBase: 70000,
    typicalMonthlyRevenueBase: 140000,
    capexItems: [
      { item: 'Hydraulic Styling Chairs & Wash Station', pct: 0.32, description: 'Reclining barber chairs and ceramic shampoo sink' },
      { item: 'Styling, Hair Spa & Facial Equipment', pct: 0.22, description: 'Hair dryers, facial steamer, UV tool sterilizer' },
      { item: 'Cosmetic Products & Treatment Inventory', pct: 0.20, description: 'Professional haircare and skincare supplies' },
      { item: 'Mirrors, Warm LED Lighting & Interior Decor', pct: 0.16, description: 'Full-length mirrors and aesthetic parlour setup' },
      { item: 'Air Conditioning & Inverter Power Backup', pct: 0.10, description: 'Client comfort AC unit and inverter for appliances' }
    ],
    opexSplit: { rawMaterialPct: 0.35, fixedOverheadPct: 0.65 }
  },
  'tea_stall': {
    category: 'Tea Stall, Snacks & Juice Point',
    typicalCapexBase: 220000,
    typicalMonthlyOpexBase: 55000,
    typicalMonthlyRevenueBase: 110000,
    capexItems: [
      { item: 'Commercial Tea Urn, Milk Boiler & Gas Stove', pct: 0.32, description: 'High-speed tea brewing setup and commercial gas pipe' },
      { item: 'Juice Machine, Blender & Cold Storage', pct: 0.24, description: 'Commercial citrus extractor, mixer, ice chest' },
      { item: 'Stainless Steel Counter & Snack Showcase', pct: 0.22, description: 'Glass hot-case for samosas/puffs and counter' },
      { item: 'Serving Utensils & Takeaway Packaging', pct: 0.12, description: 'Paper cups, flasks, cleaning supplies' },
      { item: 'FSSAI Food Registration & Signboard', pct: 0.10, description: 'Basic food registration and illuminated board' }
    ],
    opexSplit: { rawMaterialPct: 0.58, fixedOverheadPct: 0.42 }
  },
  'automobile_repair': {
    category: 'Automobile Repair & Two-Wheeler Workshop',
    typicalCapexBase: 480000,
    typicalMonthlyOpexBase: 75000,
    typicalMonthlyRevenueBase: 145000,
    capexItems: [
      { item: 'Hydraulic Motorcycle Service Lift', pct: 0.28, description: 'Pneumatic bike lift with safety locking clamp' },
      { item: 'Air Compressor & Pneumatic Impact Tools', pct: 0.22, description: 'High-pressure compressor, air impact gun, tyre inflator' },
      { item: 'Engine Diagnostic & Battery Charging Setup', pct: 0.18, description: 'Multi-meter, battery boost charger, spark plug tester' },
      { item: 'Fast Moving Consumables & Spares Stock', pct: 0.20, description: 'Engine oils, brake pads, drive chains, filters' },
      { item: 'Workshop Flooring, Spill Basin & Tools', pct: 0.12, description: 'Epoxy floor coat, tool trolley, fire extinguisher' }
    ],
    opexSplit: { rawMaterialPct: 0.42, fixedOverheadPct: 0.58 }
  },
  'tailoring': {
    category: 'Tailoring & Boutique Embroidery',
    typicalCapexBase: 280000,
    typicalMonthlyOpexBase: 50000,
    typicalMonthlyRevenueBase: 105000,
    capexItems: [
      { item: 'Industrial Sewing Machines (Direct Drive)', pct: 0.35, description: 'High-speed computerized lockstitch machines' },
      { item: 'Overlock & Embroidery Machine', pct: 0.25, description: '4-thread overlock and pattern stitching setup' },
      { item: 'Cutting Bench, Steam Iron & Pattern Tools', pct: 0.18, description: 'Large fabric cutting table and heavy steam press' },
      { item: 'Sewing Accessories, Threads & Linings', pct: 0.14, description: 'Zippers, buttons, buckram, variety threads' },
      { item: 'Trial Enclosure, Mirror & Fitting Area', pct: 0.08, description: 'Curtained trial room and full-height mirrors' }
    ],
    opexSplit: { rawMaterialPct: 0.35, fixedOverheadPct: 0.65 }
  }
};

/**
 * Returns normalized benchmark key from arbitrary user query text
 */
export function matchBusinessCategory(queryText: string): BusinessArchetypeBenchmark {
  const q = (queryText || '').toLowerCase();
  
  if (q.includes('station') || q.includes('book') || q.includes('xerox') || q.includes('print') || q.includes('paper') || q.includes('pen') || q.includes('copy')) {
    return BENCHMARKS['stationery'];
  }
  if (q.includes('pharm') || q.includes('medic') || q.includes('drug') || q.includes('chemist') || q.includes('clinic') || q.includes('health')) {
    return BENCHMARKS['pharmacy'];
  }
  if (q.includes('hard') || q.includes('electr') || q.includes('sanit') || q.includes('pipe') || q.includes('plumb') || q.includes('paint') || q.includes('cement')) {
    return BENCHMARKS['hardware'];
  }
  if (q.includes('salon') || q.includes('parl') || q.includes('beauty') || q.includes('hair') || q.includes('barber') || q.includes('spa') || q.includes('groom')) {
    return BENCHMARKS['salon'];
  }
  if (q.includes('tea') || q.includes('chai') || q.includes('juice') || q.includes('coffee') || q.includes('beverage') || q.includes('tiffin')) {
    return BENCHMARKS['tea_stall'];
  }
  if (q.includes('auto') || q.includes('mechanic') || q.includes('garage') || q.includes('bike') || q.includes('car') || q.includes('motor') || q.includes('tyre') || q.includes('puncture')) {
    return BENCHMARKS['automobile_repair'];
  }
  if (q.includes('tailor') || q.includes('stitch') || q.includes('sew') || q.includes('embroid') || q.includes('boutique') || q.includes('dressmaker')) {
    return BENCHMARKS['tailoring'];
  }
  if (q.includes('bake') || q.includes('cake') || q.includes('bread') || q.includes('pastry') || q.includes('cookie') || q.includes('patisserie')) {
    return BENCHMARKS['bakery'];
  }
  if (q.includes('kiran') || q.includes('grocery') || q.includes('supermarket') || q.includes('provision') || q.includes('ration') || q.includes('store') || q.includes('shop') || q.includes('retail')) {
    return BENCHMARKS['kirana'];
  }
  if (q.includes('cloud') || q.includes('kitchen') || q.includes('restaurant') || q.includes('cafe') || q.includes('food') || q.includes('catering') || q.includes('dhaba') || q.includes('biryani') || q.includes('snack')) {
    return BENCHMARKS['cloud_kitchen'];
  }
  if (q.includes('cloth') || q.includes('garment') || q.includes('fashion') || q.includes('textile') || q.includes('saree') || q.includes('dress')) {
    return BENCHMARKS['garments'];
  }
  if (q.includes('mobile') || q.includes('phone') || q.includes('repair') || q.includes('laptop') || q.includes('electronic') || q.includes('computer')) {
    return BENCHMARKS['mobile_repair'];
  }
  if (q.includes('dairy') || q.includes('cow') || q.includes('buffalo') || q.includes('milk') || q.includes('paneer') || q.includes('cattle') || q.includes('farm') || q.includes('poultry') || q.includes('goat')) {
    return BENCHMARKS['dairy'];
  }

  // Dynamic generic benchmark synthesized for any custom business idea
  const cleanTitle = queryText.trim().replace(/^i want to (start|open|run)\s+/i, '').replace(/\b(shop|store|business|venture|enterprise)\b/gi, '').trim();
  const capitalized = cleanTitle ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1) : 'Custom MSME Venture';
  
  return {
    category: `${capitalized} Enterprise`,
    typicalCapexBase: 450000,
    typicalMonthlyOpexBase: 80000,
    typicalMonthlyRevenueBase: 150000,
    capexItems: [
      { item: `${capitalized} Core Operational Machinery & Tools`, pct: 0.38, description: `Specialized tools and operating equipment for ${capitalized}` },
      { item: 'Opening Stock & Consumables Reserve', pct: 0.30, description: `Initial raw material and commercial inventory for ${capitalized}` },
      { item: 'Customer Counter, Racks & Commercial Fitout', pct: 0.16, description: 'Storefront showcase, storage racks, and customer service area' },
      { item: 'Statutory Permits, Trade Registration & FSSAI/Udyam', pct: 0.08, description: 'Local municipal trade license and compliance filings' },
      { item: 'Signage, Billing System & Safety Setup', pct: 0.08, description: 'POS computer, storefront board, and fire safety gear' }
    ],
    opexSplit: { rawMaterialPct: 0.55, fixedOverheadPct: 0.45 }
  };
}

/**
 * Deterministic Financial Feasibility Engine
 */
export function computeFinancialAnalysis(
  categoryKey: string,
  ownCapital: number,
  scale: 'Micro (Local)' | 'Small (Town/Zone)' | 'Medium (Regional)' = 'Small (Town/Zone)',
  customCapexAdjustment?: number
): FinancialAnalysis {
  const benchmark = matchBusinessCategory(categoryKey);

  // Multiplier based on scale
  let scaleMultiplier = 1.0;
  if (scale === 'Micro (Local)') scaleMultiplier = 0.65;
  if (scale === 'Medium (Regional)') scaleMultiplier = 1.8;

  const baseCapex = (customCapexAdjustment && customCapexAdjustment > 0) 
    ? customCapexAdjustment 
    : Math.round(benchmark.typicalCapexBase * scaleMultiplier);
  
  // 3 months working capital buffer (industry standard for MSME debt underwriting)
  const baseMonthlyOpex = Math.round(benchmark.typicalMonthlyOpexBase * scaleMultiplier);
  const workingCapitalBufferMonths = 3;
  const workingCapitalBufferAmount = Math.round(baseMonthlyOpex * workingCapitalBufferMonths * 0.4); // 40% of 3-month opex as cash reserve
  
  const totalProjectCost = baseCapex + workingCapitalBufferAmount;

  // Promoter capital vs Loan required
  // Ensure own capital does not exceed project cost
  const effectiveOwnCapital = Math.min(Math.max(ownCapital, 20000), totalProjectCost);
  const loanRequired = Math.max(0, totalProjectCost - effectiveOwnCapital);
  const promoterContributionPct = Math.round((effectiveOwnCapital / totalProjectCost) * 100);

  // Capex item list calculated proportionally
  const capexItems = benchmark.capexItems.map(item => ({
    item: item.item,
    amount: Math.round(baseCapex * item.pct),
    description: item.description
  }));

  // Standard MSME term loan parameters: 9.5% per annum, 5 years
  const interestRatePct = 9.5;
  const tenureYears = 5;
  const monthlyEMI = calculateEMI(loanRequired, interestRatePct, tenureYears);

  // Revenue & Cashflow projections
  const projectedMonthlyRevenue = Math.round(benchmark.typicalMonthlyRevenueBase * scaleMultiplier);
  const projectedMonthlyOpex = baseMonthlyOpex;
  const monthlyGrossSurplus = projectedMonthlyRevenue - projectedMonthlyOpex;
  const monthlyNetSurplus = monthlyGrossSurplus - monthlyEMI;

  const dscr = calculateDSCR(monthlyGrossSurplus, monthlyEMI);
  const safetyStatus = getSafetyRating(dscr);

  // Break-even estimate: Initial Capex / Monthly Gross Surplus
  const breakEvenMonths = monthlyGrossSurplus > 0 
    ? Math.round((baseCapex / monthlyGrossSurplus) * 10) / 10 
    : 99;

  return {
    projectCost: totalProjectCost,
    capexItems,
    workingCapitalBufferMonths,
    workingCapitalBufferAmount,
    ownCapital: effectiveOwnCapital,
    promoterContributionPct,
    loanRequired,
    interestRatePct,
    tenureYears,
    monthlyEMI,
    projectedMonthlyRevenue,
    projectedMonthlyOpex,
    monthlyGrossSurplus,
    monthlyNetSurplus,
    dscr,
    safetyStatus,
    breakEvenMonths
  };
}

/**
 * Deterministic Stress-Testing Function
 * "What if things go wrong?"
 */
export function runStressScenario(
  base: FinancialAnalysis,
  categoryKey: string,
  salesDropPct: number = 0,
  opexIncreasePct: number = 0,
  rawMaterialIncreasePct: number = 0
): StressResult {
  const benchmark = matchBusinessCategory(categoryKey);

  // Apply sales drop
  const stressedRevenue = Math.round(base.projectedMonthlyRevenue * (1 - salesDropPct / 100));

  // Split baseline opex into raw materials (variable) and fixed overheads (rent, electricity, salaries)
  const baseRawMaterialCost = base.projectedMonthlyOpex * benchmark.opexSplit.rawMaterialPct;
  const baseFixedCost = base.projectedMonthlyOpex * benchmark.opexSplit.fixedOverheadPct;

  const stressedRawMaterialCost = baseRawMaterialCost * (1 + rawMaterialIncreasePct / 100);
  const stressedFixedCost = baseFixedCost * (1 + opexIncreasePct / 100);
  const stressedOpex = Math.round(stressedRawMaterialCost + stressedFixedCost);

  const stressedOperatingProfit = stressedRevenue - stressedOpex;
  const monthlyEMI = base.monthlyEMI;
  const stressedNetSurplus = stressedOperatingProfit - monthlyEMI;

  const stressedDSCR = calculateDSCR(stressedOperatingProfit, monthlyEMI);
  const stressedSafety = getSafetyRating(stressedDSCR);

  let warningNote = 'Business maintains healthy repayment capacity under this stress scenario.';
  if (stressedSafety === 'WATCH') {
    warningNote = 'Cash flow surplus is constrained. Business will have limited room for unexpected machinery breakdown or receivables delay.';
  } else if (stressedSafety === 'RISKY') {
    warningNote = 'Cash flow insufficient to safely service debt. High risk of loan delinquency unless promoter infuses personal reserves.';
  }

  return {
    salesDropPct,
    opexIncreasePct,
    rawMaterialIncreasePct,
    stressedRevenue,
    stressedOpex,
    stressedOperatingProfit,
    monthlyEMI,
    stressedNetSurplus,
    stressedDSCR,
    stressedSafety,
    warningNote
  };
}
