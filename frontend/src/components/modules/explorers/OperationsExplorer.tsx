import React from 'react';
import { Truck, Zap, Package, Users } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { ActiveAnalysis } from './types';
import { useLanguage } from '../../../context/LanguageContext';

interface OperationsExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
}

function buildOperationsChecklist(businessIdea: string): {
  suppliers: string[];
  infrastructure: string[];
  logistics: string[];
  staffing: string[];
} {
  const q = businessIdea.toLowerCase();
  const isFood = /(bake|cake|kitchen|cafe|restaurant|food|snack|dairy)/.test(q);
  const isRetail = /(kirana|store|grocery|fmcg|garment|boutique|shop)/.test(q);

  const suppliers = isFood
    ? [
        'Identify 2–3 raw material wholesalers within 5–10 km to keep freight cost low',
        'Negotiate a credit cycle (7–15 days) with your primary supplier before committing to volume',
        'Keep a backup supplier for your top 3 raw materials to avoid stock-outs'
      ]
    : isRetail
    ? [
        'Register with regional distributors for your top-selling SKU categories',
        'Compare wholesale rates from at least 2 distributor networks before finalizing',
        'Set up a reorder trigger (e.g. 20% stock remaining) for fast-moving items'
      ]
    : [
        'List your top 5 recurring purchase items and map at least one local supplier for each',
        'Negotiate payment terms before signing any standing purchase order'
      ];

  const infrastructure = [
    'Confirm 3-phase electrical load availability if using commercial equipment',
    'Verify water supply and drainage compliance for your premises',
    'Plan signage and shopfront visibility from the main road',
    isFood
      ? 'Ensure kitchen ventilation and fire-safety equipment meet FSSAI/municipal norms'
      : 'Plan storage and shelving layout for efficient customer flow'
  ];

  const logistics = [
    'Map your delivery radius against nearby residential clusters and transit points',
    isFood
      ? 'Decide between in-house delivery staff vs. aggregator platforms for order fulfilment'
      : 'Plan inbound stock delivery windows to avoid peak footfall hours',
    'Keep a simple daily stock/sales log from day one for reorder planning'
  ];

  const staffing = [
    'Hire 1–2 trained staff for peak hours before full-time headcount',
    'Cross-train staff on billing and basic customer service',
    'Budget for staff wages within your working-capital buffer, not just capex'
  ];

  return { suppliers, infrastructure, logistics, staffing };
}

const SECTION_ICONS = { suppliers: Package, infrastructure: Zap, logistics: Truck, staffing: Users };
const SECTION_LABELS: Record<string, string> = {
  suppliers: 'Suppliers',
  infrastructure: 'Infrastructure',
  logistics: 'Logistics & Delivery',
  staffing: 'Staffing'
};

export const OperationsExplorer: React.FC<OperationsExplorerProps> = ({ analysis, onBack, onStartNew }) => {
  const { t } = useLanguage();
  const checklist = analysis ? buildOperationsChecklist(analysis.input.businessIdea) : null;

  return (
    <ExplorerShell
      icon={Truck}
      title={t.exploreOperations}
      description={t.exploreOperationsDesc}
      onBack={onBack}
    >
      {!analysis || !checklist ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(checklist) as Array<keyof typeof checklist>).map((section) => {
              const Icon = SECTION_ICONS[section];
              return (
                <div key={section} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center border border-indigo-100">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{SECTION_LABELS[section]}</h3>
                  </div>
                  <ul className="space-y-2">
                    {checklist[section].map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Location-derived logistics context */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t.nearbyTransitContext}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold text-slate-700 mb-1.5">{t.transitPointsTitle}</p>
                <ul className="space-y-1 text-slate-500">
                  {analysis.location.transitPoints.map((tr, i) => (
                    <li key={i}>• {tr}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1.5">{t.commercialHubsNearbyTitle}</p>
                <ul className="space-y-1 text-slate-500">
                  {analysis.location.commercialHubs.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </ExplorerShell>
  );
};
